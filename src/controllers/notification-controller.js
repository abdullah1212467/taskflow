const Notification = require("../models/notification_model.js");


const getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const deleteNotification = async (req, res) => {
  try {

    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {

      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });

    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getNotifications,
  deleteNotification,
};