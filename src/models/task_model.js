const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    reminderAt: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    repeat: {
      type: String,
      enum: ["None", "Daily", "Weekly", "Monthly"],
      default: "None",
    },

    isReminderSent: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
  type: String,
  default: null,
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);