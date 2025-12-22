import User from "../models/User";

const searchUser = async (req, res) => {
    try {
        const { name, email } = req.query;

        if (!name & !email) {
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

export { searchUser };