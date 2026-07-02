const bcrypt = require("bcrypt")
const User = require("../models/user_Model.js")
const redisClient = require("../config/redis_config.js");
const { generateAccessToken,  generateRefreshToken } = require("../utils/generate_token.js")
const sendEmail  = require("../utils/sendEmail.js")
const emailQueue = require("../queue/register-email-q.js")

    const register = async (req, res) => {
    try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({
    success: false,
    message: "Email already registered",
    });
    }
// Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    let createUser =await User.create({
    name,
    email,
    password: hashedPassword,
    })
// generate OTP for email Verification 
    let OTP =  Math.floor(100000 + Math.random() * 900000).toString();
    console.log(OTP)
// ?store OTP in Redis 
    let storeOTP = await redisClient.set(
  `verify:${email}`,
  OTP,
  "EX",
  300
);

console.log(storeOTP)

await emailQueue.add(
    "sendVerificationEmail",
    {
        to: email,
        otp: OTP,
    },
    {
        priority: 1,

        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 3000,
        },
    }
);

    res.status(200).json({
    success: true,
    message: "Registration successful. Please check your email for the verification OTP "
    });
    } catch (error) {
    res.status(500).json({
    success: false,
    message: error.message,
    });
    }
    };

    const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // get Otp From Redis
    const storedOTP = await redisClient.get(`verify:${email}`);
    if (!storedOTP) {
  return res.status(400).json({
    success: false,
    message: "OTP expired ",
  });
}   
    if (storedOTP !== otp) {
  return res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
}
 let user =   await User.findOneAndUpdate(
  { email },
  {
    isEmailVerified: true,
  }
);
    await redisClient.del(`verify:${email}`);


     const accessToken = generateAccessToken(user._id);
const refreshToken = generateRefreshToken(user._id);
user.refreshToken = refreshToken;
await user.save();

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

  return res.status(200).json({
  success: true,
  message: "Register Successfully",
  accessToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    isEmailVerified: user.isEmailVerified,
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
   const { email, password } = req.body;
   if(!email || !password){
    return res.status(400).json({
      success: false,
      message: "userName and password is required",
    });
   }
   const user = await User.findOne({ email }).select("+password");
   if (!user) {
  return res.status(404).json({
    success: false,
    message: "Invalid email or password",
  });
}
if (!user.isEmailVerified) {
  return res.status(400).json({
    success: false,
    message: "Please verify your email first",
  });
}
const isMatch = await bcrypt.compare(
  password,
  user.password
);
if (!isMatch) {
  return res.status(400).json({
    success: false,
    message: "Invalid email or password",
  });
}


const accessToken = generateAccessToken(user._id);
const refreshToken = generateRefreshToken(user._id);
user.refreshToken = refreshToken;
await user.save();

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

return res.status(200).json({
  success: true,
  message: "Login successful",
  accessToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    isEmailVerified: user.isEmailVerified,
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

if (!token) {
  return res.status(401).json({
    success: false,
    message: "Refresh token not found",
  });
}
const decoded = jwt.verify(
  token,
  process.env.JWT_REFRESH_SECRET
);

const user = await User.findById(decoded.userId);
if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}
if (user.refreshToken !== token) {
  return res.status(401).json({
    success: false,
    message: "Invalid refresh token",
  });
}

const accessToken = generateAccessToken(user._id);

const newRefreshToken = generateRefreshToken(user._id);

user.refreshToken = newRefreshToken;

await user.save();

res.cookie("refreshToken", newRefreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(200).json({
  success: true,
  accessToken,
});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Generate OTP
 let OTP =  Math.floor(100000 + Math.random() * 900000).toString();
    console.log(OTP)

    // 3. Store in Redis
    await redisClient.set(
      `forgot:${email}`,
      OTP,
      "EX",
      300
    );

   await emailQueue.add(
    "sendForgotPasswordEmail",
    {
        to: email,
        OTP,
    },
    {
        priority: 1,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    }
);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully to Your Gmail.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Get OTP from Redis
    const storedOTP = await redisClient.get(`forgot:${email}`);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    // 3. Compare OTP
    if (storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update Password
    user.password = hashedPassword;

    // Force user to login again
    user.refreshToken = null;

    await user.save();

    // 6. Delete OTP
    await redisClient.del(`forgot:${email}`);

    // 7. Remove refresh token cookie (if present)
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login again.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

    module.exports = {
    register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword
    };