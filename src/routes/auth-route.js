const express = require("express");
const authRouter = express.Router();
const registerValidation = require("../validator/auth-validator.js")
const validate = require("../middlewere/validator_middlewere.js")
const authLimiter = require("../middlewere/ratelimit-middlewere.js")


const {register ,verifyEmail ,login ,refreshToken ,logout ,forgotPassword ,resetPassword}  = require("../controllers/auth.controllers.js");

authRouter.post("/register",registerValidation ,validate,authLimiter, register);

authRouter.post("/verify-email",authLimiter,verifyEmail);

authRouter.post("/login",authLimiter, login);

authRouter.post("/refresh-token", refreshToken);

authRouter.post("/logout", logout);

authRouter.post("/forgetPass",authLimiter, forgotPassword);

authRouter.post("/reset-password",authLimiter, resetPassword);

module.exports = authRouter;