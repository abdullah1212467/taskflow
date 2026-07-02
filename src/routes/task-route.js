const express = require("express");
const taskRouter = express.Router();

const protect = require("../middlewere/auth_middlewere.js");
const { createTask ,getMyTasks , getSingleTask , updateTask , deleteTask , getDeletedTasks , restoreTask} = require("../controllers/task-controller.js");

taskRouter.post("/", protect, createTask);

taskRouter.get("/", protect, getMyTasks);

taskRouter.get("/trash", protect, getDeletedTasks);

taskRouter.get("/:id", protect, getSingleTask);

taskRouter.put("/:id", protect, updateTask);

taskRouter.delete("/:id", protect, deleteTask);

taskRouter.patch("/:id/restore", protect, restoreTask);
module.exports = taskRouter;