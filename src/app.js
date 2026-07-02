const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-route.js")
const userRouter = require("./routes/user_route.js")
const taskRoutes = require("./routes/task-route.js");



const app = express();
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());




// all the  end points    
app.use("/api/auth", authRouter);
app.use("/api/Profile", userRouter);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Reminder API is running 🚀",
  });
});

module.exports = app;