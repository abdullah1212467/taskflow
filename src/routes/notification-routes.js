const express = require("express");

const notificationRouter = express.Router();

const protect = require("../middlewere/auth_middlewere.js");

const {
  getNotifications,
  deleteNotification,
} = require("../controllers/notification-controller.js");

notificationRouter.get("/", protect, getNotifications);

notificationRouter.delete("/:id", protect, deleteNotification);

module.exports = notificationRouter;