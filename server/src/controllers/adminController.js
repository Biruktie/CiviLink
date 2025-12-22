import User from "../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { promoteToOfficer } from "../services/assign_officer/assignOfficer.js";

const searchUser = async (req, res) => {
    try {
        const { name, email } = req.query;

        if (!name && !email) {
            return res.status(400).json({
                success: false,
                message: "Either name or email query parameter is required"
            });
        };

        const searchConditions = [];

        if (name) {
            searchConditions.push({ fullName: { $regex: name, $options: "i"}});
        };

        if (email) {
            searchConditions.push({ email: { $regex: email, $options: "i"}});
        };

        const users = await User.find({
            role: "citizen",
            $or: searchConditions,
        }).select("_id fullName email role").limit(5);

        res.status(200).json({
            success: true,
            count: users.length,
            citizens: users
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const assignOfficer = async (req, res) => {
    try {
        const { userId, department, subcity, adminPassword } = req.body;

        ///
        if (!userId || !department || !subcity || !adminPassword) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        };

        // check if the userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId"
            });
        };

        const admin = await User.findById(req.user.id).select("+password")

        if (!admin || !admin.password) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication failed"
            });
        }

        // validate admin password
        const isMatch = await bcrypt.compare(adminPassword, admin.password); ///
        if (!isMatch) {
            return res
            .status(401)
            .json({ 
                success: false,
                message: "Invalid admin password" 
            });
        };

        const allowedDepartments = ["approver", "customer_support"];
        if (!allowedDepartments.includes(department)) {
            return res.status(400).json({
                success: false,
                message: "Invalid department"
            });
        }


        const user = await User.findById(userId);

        // check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        };

        // validate user role     ///
        if (user.role !== "citizen") {
            return res.status(409).json({
                success: false,
                message: "User is not eligible for officer role"
            });
        }
       
        const officer = await promoteToOfficer(
            user._id, 
            {
                department,
                subcity
            },
            req.user.id
        );
        
        return res.status(200).json({
            success: true,
            message: "User successfully promoted to officer",
            data: officer
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export { searchUser, assignOfficer };