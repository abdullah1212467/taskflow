import {
  Search,
  RotateCcw,
  Calendar,
} from "lucide-react";

import "../css/trash.css";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../pages/api.js";

function Trash() {

  const [deletedTasks, setDeletedTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchDeletedTasks = async () => {

    try {

      setLoading(true);

      const { data } = await api.get("/tasks/trash");

      console.log(data);

      setDeletedTasks(data.tasks);

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

        toast.error("Unable to connect to the server.");

      }

      else {

        toast.error("Something went wrong.");

      }

    }

    finally {

      setLoading(false);

    }

  };

  const restoreTask = async (id) => {

    try {

      const { data } = await api.patch(`/tasks/${id}/restore`);

      toast.success(data.message);

      fetchDeletedTasks();

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

        toast.error("Unable to connect to the server.");

      }

      else {

        toast.error("Unable to restore task.");

      }

    }

  };

  useEffect(() => {

    fetchDeletedTasks();

  }, []);

  if (loading) {

    return (

      <div className="trash-page">

        <h2
          style={{
            textAlign: "center",
            marginTop: "150px",
          }}
        >
          Loading Deleted Tasks...
        </h2>

      </div>

    );

  }

  return (

    <div className="trash-page">

      {/* Header */}

      <div className="trash-header">

        <div>

          <h1>🗑 Trash</h1>

          <p>
            Restore your deleted tasks before they are permanently removed.
          </p>

        </div>

      </div>

      {/* Toolbar */}

      <div className="task-toolbar">

        <div className="task-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search deleted tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Tasks */}

      <div className="trash-grid">

        {

          deletedTasks
            .filter((task) =>

              task.title
                .toLowerCase()
                .includes(search.toLowerCase())

              ||

              task.description
                ?.toLowerCase()
                .includes(search.toLowerCase())

            )

            .length === 0

            ?

            (

              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "100px 20px",
                }}
              >

                <h2
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  No Deleted Tasks
                </h2>

                <p
                  style={{
                    color: "#888",
                  }}
                >
                  Your trash is empty.
                </p>

              </div>

            )

            :

            (

              deletedTasks

                .filter((task) =>

                  task.title
                    .toLowerCase()
                    .includes(search.toLowerCase())

                  ||

                  task.description
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                )

                .map((task) => (

                  <div
                    className="task-card"
                    key={task._id}
                  >

                    <div className="task-top">

                      <h2>{task.title}</h2>

                      <span
                        className={`priority ${task.priority.toLowerCase()}`}
                      >

                        {task.priority}

                      </span>

                    </div>

                    <p className="task-description">

                      {task.description || "No description"}

                    </p>

                    <div className="task-info">

                      <div>

                        <Calendar size={16} />

                        {task.updatedAt
                          ? new Date(task.updatedAt).toLocaleDateString()
                          : "Unknown"}

                      </div>

                      <span
                        style={{
                          color: "#ef4444",
                          fontWeight: "600",
                        }}
                      >

                        Deleted

                      </span>

                    </div>

                    <div className="task-actions">

                      <button
                        className="complete-btn"
                        style={{
                          background: "#22c55e",
                        }}
                        onClick={() => restoreTask(task._id)}
                      >

                        <RotateCcw size={18} />

                        Restore

                      </button>

                    </div>

                  </div>

                ))

            )

        }

      </div>

    </div>

  );

}

export default Trash;