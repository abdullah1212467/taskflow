const express = require("express");
const userRouter = express.Router();
const { getProfile} = require("../controllers/user_controller.js")
const protect = require("../middlewere/auth_middlewere.js")


userRouter.get("/profile", protect, getProfile);



module.exports = userRouter