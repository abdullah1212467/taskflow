import {
  Search,
  Plus,
  Calendar,
  Flag,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../css/task.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import shared API
import api from "../pages/api.js";

function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [priority, setPriority] = useState("");

  const [status, setStatus] = useState("");

  // ===============================
  // Fetch Tasks
  // ===============================

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const { data } = await api.get("/tasks", {
        params: {
          page,
          search,
          priority,
          status,
        },
      });

      console.log("Tasks Response :", data);

      setTasks(data.tasks);

      setTotalPages(data.totalPages);

    } catch (error) {

      console.log("Server Error :", error.response?.data);

      if (error.response?.data?.errors?.length) {

        error.response.data.errors.forEach((err) => {
          toast.error(err.msg);
        });

      }

      else if (error.response?.data?.message) {

        toast.error(error.response.data.message);

      }

      else if (error.request) {

        toast.error("Unable to connect to the server.");

      }

      else {

        toast.error("Something went wrong.");

      }

    } finally {

      setLoading(false);

    }

  };

  // ===============================
  // Delete Task
  // ===============================

  const deleteTask = async (id) => {

    try {

      const { data } = await api.delete(`/tasks/${id}`);

      toast.success(data.message);

      fetchTasks();

    } catch (error) {

      console.log(error.response?.data);

      if (error.response?.data?.message) {

        toast.error(error.response.data.message);

      } else {

        toast.error("Unable to delete task.");

      }

    }

  };

  // ===============================
  // Complete Task
  // ===============================

  const completeTask = async (id) => {

    try {

      const { data } = await api.put(`/tasks/complete/${id}`);

      toast.success(data.message);

      fetchTasks();

    } catch (error) {

      console.log(error.response?.data);

      if (error.response?.data?.message) {

        toast.error(error.response.data.message);

      } else {

        toast.error("Unable to update task.");

      }

    }

  };

  useEffect(() => {

    fetchTasks();

  }, [page, search, priority, status]);

  if (loading) {

    return (

      <div className="tasks-page">

        <h2
          style={{
            textAlign: "center",
            marginTop: "150px",
          }}
        >
          Loading Tasks...
        </h2>

      </div>

    );

  }
  return (

  <div className="tasks-page">

    {/* Header */}

    <div className="tasks-header">

      <div>

        <h1>My Tasks</h1>

        <p>
          Organize, manage and complete your daily work.
        </p>

      </div>

      <Link to="/create-task">

        <button className="create-task-btn">

          <Plus size={18} />

          New Task

        </button>

      </Link>

    </div>

    {/* Toolbar */}

    <div className="task-toolbar">

      <div className="task-search">

        <Search size={18} />

        <div className="task-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                setPage(1);

                setSearch(searchInput);

              }

            }}
          />

          <button
            className="search-btn"
            onClick={() => {

              setPage(1);

              setSearch(searchInput);

            }}
          >

            <Search size={18} />

          </button>

        </div>

      </div>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >

        <option value="">
          All Priority
        </option>

        <option value="High">
          High
        </option>

        <option value="Medium">
          Medium
        </option>

        <option value="Low">
          Low
        </option>

      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >

        <option value="">
          All Status
        </option>

        <option value="Pending">
          Pending
        </option>

        <option value="Completed">
          Completed
        </option>

        <option value="In Progress">
          In Progress
        </option>

      </select>

    </div>

    {/* Tasks */}

    <div className="tasks-grid">

      {

        tasks.length === 0

          ?

          (

            <h2
              style={{
                textAlign: "center",
                width: "100%",
              }}
            >

              No Tasks Found

            </h2>

          )

          :

          (

            tasks.map((task) => (

              <div
                className="task-card"
                key={task._id}
              >

                <div className="task-top">

                  <h2>{task.title}</h2>

                  <span
                    className={`priority ${task.priority.toLowerCase()}`}
                  >

                    <Flag size={14} />

                    {task.priority}

                  </span>

                </div>

                <p className="task-description">

                  {task.description}

                </p>

                <div className="task-info">

                  <div>

                    <Calendar size={16} />

                    {

                      task.dueDate

                        ?

                        new Date(task.dueDate).toLocaleDateString()

                        :

                        "No Due Date"

                    }

                  </div>

                  <span
                    className={`status ${task.status
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >

                    {task.status}

                  </span>

                </div>

                <div className="task-actions">

                  <button
                    className="complete-btn"
                    onClick={() => completeTask(task._id)}
                  >

                    ✓

                    {

                      task.status === "Completed"

                        ?

                        "Undo"

                        :

                        "Complete"

                    }

                  </button>

                  <Link
                    to={`/update-task/${task._id}`}
                    state={{ task }}
                    className="edit-btn"
                  >

                    <SquarePen size={18} />

                    Edit

                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >

                    <Trash2 size={18} />

                    Delete

                  </button>

                </div>

              </div>

            ))

          )

      }

    </div>
          {/* Pagination */}

      <div className="pagination">

        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >

          <ChevronLeft size={20} />

        </button>

        <span className="pagination-text">

          {page} / {totalPages}

        </span>

        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >

          <ChevronRight size={20} />

        </button>

      </div>

    </div>

  );

}

export default Tasks;