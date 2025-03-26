const User = require("../models/User");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {

    try {
        const users = await User.find({});

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User found", users });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Server error" });
    }
};


module.exports = {
    getUsers
};