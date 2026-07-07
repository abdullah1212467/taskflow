import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../pages/api.js";

import "../css/dashbord.css";

function Dashboard() {

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    recentTasks: [],
  });

  const getDashboard = async () => {

    try {

      setLoading(true);

      const { data } = await api.get("/tasks/dashboard");

      console.log("Dashboard Response:", data);

      setDashboard(data.dashboard);

    }

    catch (error) {

      console.log("Server Error:", error.response?.data);

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

  useEffect(() => {

    getDashboard();

  }, []);

  if (loading) {

    return (

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontSize: "22px",
          fontWeight: "600",
        }}
      >

        Loading Dashboard...

      </div>

    );

  }

  return (

    <div className="dashboard-page">

      {/* Top Cards */}

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <h3>Total Tasks</h3>

          <h1>{dashboard.totalTasks}</h1>

          <p>Your Total Tasks</p>

        </div>

        <div className="dashboard-card">

          <h3>Completed</h3>

          <h1>{dashboard.completedTasks}</h1>

          <p>Finished Successfully</p>

        </div>

        <div className="dashboard-card">

          <h3>Pending</h3>

          <h1>{dashboard.pendingTasks}</h1>

          <p>Need Attention</p>

        </div>

        <div className="dashboard-card">

          <h3>Overdue</h3>

          <h1>{dashboard.overdueTasks}</h1>

          <p>Past Due Date</p>

        </div>

      </div>

      {/* Recent Tasks */}

      <div className="recent-section">

        <h2>Recent Tasks</h2>

        {

          dashboard.recentTasks.length === 0 ?

          (

            <p
              style={{
                textAlign: "center",
                padding: "30px",
              }}
            >

              No Tasks Found

            </p>

          )

          :

          (

            dashboard.recentTasks.map((task) => (

              <div
                className="recent-task"
                key={task._id}
              >

                <div>

                  <h3>

                    {task.title}

                  </h3>

                  <p>

                    {task.priority} Priority

                  </p>

                </div>

                <span
                  className={
                    task.status === "Completed"
                      ? "completed"
                      : "pending"
                  }
                >

                  {task.status}

                </span>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}

export default Dashboard;