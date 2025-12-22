// tests/admin.test.js
import request from "supertest";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest,
} from "@jest/globals";
import mongoose from "mongoose";
import app from "../src/index.js";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";

jest.setTimeout(30000);
let adminId;
let adminAgent;

describe("Admin Routes (Cookie-Based Auth)", () => {
    beforeAll(async () => {
        try {
            console.log("Setting up test environment...");

            // Connect to test database
            await mongoose.connect(process.env.TEST_DB_URI);
            console.log("Connected to test database");

            // Clear existing data
            await mongoose.connection.dropDatabase();
            console.log("Test database cleared");

        } catch (error) {
            console.error("beforeAll setup error:", error);
            throw error;
        }
    });

    afterAll(async () => {
    await mongoose.connection.close();
    console.log("Admin Routes Tests Completed.");
    });

    beforeEach(async () => {
        await User.deleteMany({});

        // Create test admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        const admin = await User.create({
        fullName: "Test Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        });

        adminId = admin._id;
        console.log("Test admin created:", adminId);

        adminAgent = request.agent(app);

        await adminAgent
        .post("/api/v1/auth/login")
        .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });

        await User.create([
            { fullName: "Milliastra Wonderland", email: "milliastra@gmail.com", role: "citizen" },
            { fullName: "Michael Scott", email: "michael@dundermifflin.com", role: "citizen" },
            { fullName: "Citizen One", email: "c1@dundermifflin.com", role: "citizen" },
            { fullName: "Officer One", email: "o1@test.com", role: "officer" },
            { fullName: "Admin One", email: "a1@test.com", role: "admin" }
        ]);

        const citizens = Array.from({ length: 5 }).map((_, i) => ({
            fullName: `Citizen ${i}`,
            email: `citizen${i}@gmail.com`,
            role: "citizen",
        }));

        await User.insertMany(citizens);
    })

    describe("Admin User Search API", () => {
        it("It should return 400 if no query params are provided", async () => {
            const res = await adminAgent.get("/api/v1/admin/user");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Either name or email query parameter is required")
        })

        it("It should find citizens by name", async () => {

            const res = await adminAgent
            .get("/api/v1/admin/user")
            .query({ name: "mil" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.citizens.length).toBe(1);
            expect(res.body.citizens[0].role).toBe("citizen");
        });

        it("It should find citizens by email", async () => {

            const res = await adminAgent
            .get("/api/v1/admin/user")
            .query({ email: "mil" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.citizens.length).toBe(1);
            expect(res.body.citizens[0].role).toBe("citizen");
        });

        it("It should never return officers or admins", async () => {

            const res = await adminAgent
                .get("/api/v1/admin/user")
                .query({ name: "one" });

            expect(res.status).toBe(200);
            expect(res.body.citizens.length).toBe(1);
            expect(res.body.citizens[0].role).toBe("citizen");
        });

        it("It should return a maximum of 5 users", async () => {

            const res = await adminAgent
                .get("/api/v1/admin/user")
                .query({ name: "Citizen" })

            expect(res.status).toBe(200);
            expect(res.body.citizens.length).toBe(5);
            expect(res.body.citizens[0].role).toBe("citizen");
          })
    })
})