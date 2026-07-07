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
  Save,
  RotateCcw,
} from "lucide-react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import toast from "react-hot-toast";

import "../css/create-task.css";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },
  (error) => Promise.reject(error)
);

function UpdateTask() {

  const { state } = useLocation();

  const navigate = useNavigate();

  const { id } = useParams();

  const [task, setTask] = useState({

    title: state.task.title,

    description: state.task.description || "",

    dueDate: state.task.dueDate
      ? state.task.dueDate.slice(0, 10)
      : "",

    reminderAt: state.task.reminderAt
      ? state.task.reminderAt.slice(0, 16)
      : "",

    priority: state.task.priority,

    status: state.task.status,

    category: state.task.category || "General",

    repeat: state.task.repeat || "None",

  });

  const handleChange = (e) => {

    setTask({

      ...task,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await api.put(

        `/tasks/${id}`,

        task

      );

      toast.success(data.message);

      navigate("/tasks");

    }

    catch (error) {

      console.log(error.response?.data);

      if (error.response?.data?.errors?.length) {

        error.response.data.errors.forEach((err) => {

          toast.error(err.msg);

        });

      }

      else if (error.response?.data?.message) {

        toast.error(error.response.data.message);

      }

      else if (error.request) {

        toast.error("Unable to connect to server.");

      }

      else {

        toast.error("Something went wrong.");

      }

    }

  };

  return (

    <div className="create-page">

      {/* Left */}

      <div className="task-form-card">

        <div className="page-heading">

          <h1>Update Task</h1>

          <p>

            Modify your task details.

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
                    {/* Row */}

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

          {/* Row */}

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

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

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

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* Row */}

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

                  <option value="None">
                    None
                  </option>

                  <option value="Daily">
                    Daily
                  </option>

                  <option value="Weekly">
                    Weekly
                  </option>

                  <option value="Monthly">
                    Monthly
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* Buttons */}

          <div className="buttons">

            <button
              type="button"
              className="reset-btn"
              onClick={() => navigate("/tasks")}
            >

              <RotateCcw size={18} />

              Cancel

            </button>

            <button
              type="submit"
              className="create-btn"
            >

              <Save size={18} />

              Update Task

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

            {
              task.description ||

              "Task description will appear here."
            }

          </p>

          <div className="preview-info">

            <span>

              📅

              {

                task.dueDate ||

                "--/--/----"

              }

            </span>

            <span>

              🔔

              {

                task.reminderAt ||

                "--"

              }

            </span>

          </div>

          <div className="preview-footer">

            <span>

              📂

              {

                task.category ||

                "General"

              }

            </span>

            <span>

              🔄

              {

                task.repeat ||

                "None"

              }

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default UpdateTask;