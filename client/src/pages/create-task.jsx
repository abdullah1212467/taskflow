import { useState } from "react";
import {
  ClipboardList,
  FileText,
  CalendarDays,
  Bell,
  Flag,
  FolderOpen,
  RotateCw,
  CheckCircle2,
  Plus,
  RotateCcw,
} from "lucide-react";

import "../css/create-task.css";
import api from "../pages/api.js";
import toast from "react-hot-toast";

function CreateTask() {

  const [loading, setLoading] = useState(false);

  const [task, setTask] = useState({

    title: "",

    description: "",

    dueDate: "",

    reminderAt: "",

    priority: "Medium",

    status: "Pending",

    category: "General",

    repeat: "None",

  });

  const handleChange = (e) => {

    setTask((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  const handleReset = () => {

    setTask({

      title: "",

      description: "",

      dueDate: "",

      reminderAt: "",

      priority: "Medium",

      status: "Pending",

      category: "General",

      repeat: "None",

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (

      !task.title ||

      !task.dueDate ||

      !task.reminderAt

    ) {

      return toast.error(
        "Title, Due Date and Reminder Date are required"
      );

    }

    try {

      setLoading(true);

      console.log("Task Data :", task);

      const { data } = await api.post(
        "/tasks",
        task
      );

      console.log("Server Response :", data);

      toast.success(data.message);

      handleReset();

    }

    catch (error) {

      console.log(
        "Server Error :",
        error.response?.data
      );

      if (error.response?.data?.errors?.length) {

        error.response.data.errors.forEach((err) => {

          toast.error(err.msg);

        });

      }

      else if (error.response?.data?.message) {

        toast.error(error.response.data.message);

      }

      else if (error.request) {

        toast.error(
          "Unable to connect to the server."
        );

      }

      else {

        toast.error(
          "Something went wrong."
        );

      }

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="create-page">

      {/* Left */}

      <div className="task-form-card">

        <div className="page-heading">

          <h1>Create Task</h1>

          <p>
            Organize your work with reminders and priorities.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Title */}

          <div className="input-group">

            <label>Task Title</label>

            <div className="input-box">

              <ClipboardList size={20} />

              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                placeholder="Finish Backend APIs"
              />

            </div>

          </div>

          {/* Description */}

          <div className="input-group">

            <label>Description</label>

            <div className="textarea-box">

              <FileText size={20} />

              <textarea
                rows="5"
                name="description"
                value={task.description}
                onChange={handleChange}
                placeholder="Write task details..."
              />

            </div>

          </div>

          {/* Dates */}

          <div className="row">

            <div className="input-group">

              <label>Due Date</label>

              <div className="input-box">

                <CalendarDays size={20} />

                <input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="input-group">

              <label>Reminder</label>

              <div className="input-box">

                <Bell size={20} />

                <input
                  type="datetime-local"
                  name="reminderAt"
                  value={task.reminderAt}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          {/* Priority & Status */}

          <div className="row">

            <div className="input-group">

              <label>Priority</label>

              <div className="input-box">

                <Flag size={20} />

                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                >

                  <option style={{ color: 'white', background: 'gray' }} value="Low">Low</option>

                  <option style={{ color: 'white', background: 'gray' }} value="Medium">Medium</option>

                  <option style={{ color: 'white', background: 'gray' }}  value="High">High</option>

                </select>

              </div>

            </div>

            <div className="input-group">

              <label>Status</label>

              <div className="input-box">

                <CheckCircle2 size={20} />

                <select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                >

                  <option>Pending</option>

                </select>

              </div>

            </div>

          </div>
                    {/* Category & Repeat */}

          <div className="row">

            <div className="input-group">

              <label>Category</label>

              <div className="input-box">

                <FolderOpen size={20} />

                <input
                  type="text"
                  name="category"
                  value={task.category}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="input-group">

              <label>Repeat</label>

              <div className="input-box">

                <RotateCw size={20} />

                <select
                  name="repeat"
                  value={task.repeat}
                  onChange={handleChange}
                >

                  <option style={{ color: 'white', background: 'gray' }} >None</option>

                  <option style={{ color: 'white', background: 'gray' }} >Daily</option>

                  <option style={{ color: 'white', background: 'gray' }}  >Weekly</option>

                  <option style={{ color: 'white', background: 'gray' }} >Monthly</option>

                </select>

              </div>

            </div>

          </div>

          {/* Buttons */}

          <div className="buttons">

            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={loading}
            >

              <RotateCcw size={18} />

              Reset

            </button>

            <button
              type="submit"
              className="create-btn"
              disabled={loading}
            >

              <Plus size={18} />

              {loading
                ? "Creating..."
                : "Create Task"}

            </button>

          </div>

        </form>

      </div>

      {/* Right */}

      <div className="preview-card">

        <h2>Live Preview</h2>

        <div className="preview">

          <span
            className={`badge ${task.priority.toLowerCase()}`}
          >

            {task.priority}

          </span>

          <h3>

            {task.title || "Task Title"}

          </h3>

          <p>

            {task.description ||
              "Task description will appear here."}

          </p>

          <div className="preview-info">

            <span>

              📅 {task.dueDate || "--/--/----"}

            </span>

            <span>

              🔔 {task.reminderAt || "--"}

            </span>

          </div>

          <div className="preview-footer">

            <span>

              📂 {task.category}

            </span>

            <span>

              🔄 {task.repeat}

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default CreateTask;