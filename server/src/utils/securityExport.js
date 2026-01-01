import SecurityLog from "../models/SecurityLog.js";
import fs from "fs";
import path from "path";

export const exportSecurityLogs = async (filter) => {
  const logs = await SecurityLog.find(filter).lean();

  const fileName = `security_logs_${Date.now()}.json`;
  const filePath = path.join("exports", fileName);

  fs.mkdirSync("exports", { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

  return `/exports/${fileName}`;
};

export const buildSecurityFilter = (query) => {
  const filter = {};

  if (query.from || query.to) {
    filter.timeOfAttempt = {};
    if (query.from) {
      filter.timeOfAttempt.$gte = new Date(query.from);
    }
    if (query.to) {
      filter.timeOfAttempt.$lte = new Date(query.to);
    }
  }

  if (query.attemptCountMin) {
    filter.count = { $gte: Number(query.attemptCountMin) };
  }

  if (query.failedOnly === "true") {
    filter.success = false;
  }

  if (query.afterHoursOnly === "true") {
    filter.$expr = {
      $or: [
        { $lt: [{ $hour: "$timeOfAttempt" }, 9] },
        { $gte: [{ $hour: "$timeOfAttempt" }, 17] },
      ],
    };
  }

  return filter;
};
