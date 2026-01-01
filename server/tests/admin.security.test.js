import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest,
} from "@jest/globals";

import request from "supertest";
import app from "../src/index.js";
import mongoose from "mongoose";
import SecurityLog from "../src/models/SecurityLog.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

dotenv.config({ path: ".env.test" });
jest.setTimeout(30000);

let adminToken;
const agent = request.agent(app);

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
  await mongoose.connection.dropDatabase();

  // Create admin user using admin discriminator
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin123!", salt);

  // Use admin discriminator if available
  let AdminModel = User;
  if (User.discriminators && User.discriminators.admin) {
    AdminModel = User.discriminators.admin;
  }

  await AdminModel.create({
    fullName: "Admin Test",
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
  });

  // Login
  const loginRes = await agent.post("/api/v1/auth/login").send({
    email: "admin@test.com",
    password: "Admin123!",
  });

  expect(loginRes.status).toBe(200);

  // Extract token
  const token =
    loginRes.body?.token ||
    loginRes.body?.data?.token ||
    loginRes.body?.accessToken ||
    loginRes.body?.data?.accessToken;

  if (token) {
    adminToken = token;
    agent.set("Authorization", `Bearer ${adminToken}`);
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await SecurityLog.deleteMany({});
});

describe("Admin Security Metrics", () => {
  const createTestLogs = async () => {
    return await SecurityLog.create([
      {
        attemptType: "LOGIN_FAILED",
        count: 3,
        officerName: "Officer One",
        success: false,
        timeOfAttempt: new Date(),
      },
      {
        attemptType: "LOGIN_SUCCESS",
        count: 1,
        officerName: "Officer Two",
        success: true,
        timeOfAttempt: new Date(),
      },
    ]);
  };

  it("should get security logs", async () => {
    await createTestLogs();
    const res = await agent.get("/api/v1/admin/security");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reports.length).toBe(2);
  });

  it("should support pagination", async () => {
    await createTestLogs();
    const res = await agent.get("/api/v1/admin/security").query({ limit: 1 });
    expect(res.status).toBe(200);
    expect(res.body.reports.length).toBe(1);
  });

  it("should filter by failed attempts", async () => {
    await createTestLogs();
    const res = await agent
      .get("/api/v1/admin/security")
      .query({ failedOnly: "true" });
    expect(res.status).toBe(200);
    expect(
      res.body.reports.every((r) => r.attemptType === "LOGIN_FAILED")
    ).toBe(true);
  });

  it("should filter by minimum attempt count", async () => {
    await createTestLogs();
    const res = await agent
      .get("/api/v1/admin/security")
      .query({ attemptCountMin: 2 });
    expect(res.status).toBe(200);
    expect(res.body.reports.every((r) => r.count >= 2)).toBe(true);
  });

  it("should export security logs", async () => {
    await createTestLogs();
    const res = await agent.get("/api/v1/admin/security/export");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.downloadUrl).toMatch(
      /^\/exports\/security_logs_\d+\.json$/
    );
  });
});

describe("Authorization", () => {
  it("should require authentication for admin endpoints", async () => {
    // Admin can access (already proven)
    const adminRes = await agent.get("/api/v1/admin/security");
    expect(adminRes.status).toBe(200);

    // Unauthenticated cannot access
    const noAuthRes = await request(app).get("/api/v1/admin/security");
    expect([401, 403]).toContain(noAuthRes.status);
  });
});

describe("Security Log Model", () => {
  it("should create valid security logs", async () => {
    const log = await SecurityLog.create({
      attemptType: "LOGIN_SUCCESS",
      officerName: "Test Officer",
      timeOfAttempt: new Date(),
    });

    expect(log._id).toBeDefined();
    expect(log.attemptType).toBe("LOGIN_SUCCESS");
  });
});