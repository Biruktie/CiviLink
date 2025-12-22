import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { searchUser } from "../controllers/adminController.js";

const router = express.Router();

router.use(verifyToken);

router.get(
    "/user",
    authorizeRoles('admin'),
    searchUser
);

export default router;