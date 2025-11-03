const userModel = require('../models/user.model')

const getUsersController = async (req, res) => {
  try {
    const allUsers = await userModel.find({}).select("-password");

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      total: allUsers.length,
      users: allUsers,
    });
  } catch (error) {
    console.error("Error in getUsersController:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
  });
  }
};

module.exports = {getUsersController}