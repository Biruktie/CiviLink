import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { searchUser, assignOfficer } from "../controllers/adminController.js";

const router = express.Router();

router.use(verifyToken);

router.get(
    "/user",
    authorizeRoles('admin'),
    searchUser
);

router.post(
    "/officers/assign",
    authorizeRoles("admin"),
    assignOfficer
)

export default router;