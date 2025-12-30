import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import checkIdsUploaded from "../middleware/checkIdsUploaded.js";
import { submitTinApplication, approveTinApplicatin } from "../controllers/tinController.js";
import {assignApproverOfficer} from "../middleware/assignOfficer.js";

const router = express.Router();

router.post(
  "/applications",
  verifyToken,
  authorizeRoles("citizen"),
  checkIdsUploaded,
  assignApproverOfficer,
  submitTinApplication
);

router.post(
  "/applications/:id/approve",
  verifyToken,
  authorizeRoles("officer"),
  approveTinApplicatin
);

export default router;
