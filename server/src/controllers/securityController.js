import SecurityLog from "../models/SecurityLog";
import {
  exportSecurityLogs,
  buildSecurityFilter,
} from "../utils/securityExport.js";

export const getSecurityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = buildSecurityFilter(req.query);

    const logs = await SecurityLog.find(filter)
      .sort({ timeOfAttempt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      reports: logs.map((log) => ({
        timeOfAttempt: log.timeOfAttempt,
        attemptType: log.attemptType,
        count: log.count,
        officerName: log.officerName,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const exportSecurityLogsController = async (req, res) => {
  try {
    const filter = buildSecurityFilter(req.query);
    const fileUrl = await exportSecurityLogs(filter);

    res.status(200).json({
      success: true,
      downloadUrl: fileUrl,
    });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
