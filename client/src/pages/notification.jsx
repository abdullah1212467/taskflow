import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  ShieldCheck,
  Clock,
  CheckCheck,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../pages/api.js";

import "../css/notification.css";

function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {

    try {

      setLoading(true);

      const { data } = await api.get("/notifications");

      console.log(data);

      setNotifications(data.notifications);

    } catch (error) {

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

  const deleteNotification = async (id) => {

    try {

      const { data } = await api.delete(`/notifications/${id}`);

      toast.success(data.message);

      setNotifications((prev) =>
        prev.filter((item) => item._id !== id)
      );

    } catch (error) {

      console.log(error.response?.data);

      if (error.response?.data?.message) {

        toast.error(error.response.data.message);

      }

      else {

        toast.error("Unable to delete notification.");

      }

    }

  };

  useEffect(() => {

    fetchNotifications();

  }, []);

  const getTimeAgo = (date) => {

    const seconds = Math.floor(
      (new Date() - new Date(date)) / 1000
    );

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    return "Just now";

  };

  const getIcon = (type) => {

    switch (type) {

      case "reminder":
        return <Bell size={22} />;

      case "task_completed":
        return <CheckCircle2 size={22} />;

      case "task_created":
        return <CalendarDays size={22} />;

      case "task_deleted":
        return <Trash2 size={22} />;

      case "task_restored":
        return <CheckCheck size={22} />;

      case "register":
        return <ShieldCheck size={22} />;

      default:
        return <AlertTriangle size={22} />;

    }

  };

  if (loading) {

    return (

      <div className="notification-page">

        <h2
          style={{
            textAlign: "center",
            marginTop: "150px",
          }}
        >
          Loading Notifications...
        </h2>

      </div>

    );

  }
    return (

    <div className="notification-page">

      {/* Header */}

      <div className="notification-header">

        <div>

          <h1>Notifications</h1>

          <p>
            Stay updated with reminders and recent activities.
          </p>

        </div>

      </div>

      {/* Notifications */}

      <div className="notification-list">

        {

          notifications.length === 0 ?

          (

            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
              }}
            >

              <h2>No Notifications</h2>

              <p
                style={{
                  color: "#777",
                  marginTop: "10px",
                }}
              >
                You're all caught up 🎉
              </p>

            </div>

          )

          :

          (

            notifications.map((item) => (

              <div
                key={item._id}
                className={`notification-card ${
                  item.isRead ? "" : "unread"
                }`}
              >

                <div className="notification-icon">

                  {getIcon(item.type)}

                </div>

                <div className="notification-content">

                  <div className="notification-top">

                    <h3>

                      {item.title}

                    </h3>

                    {

                      !item.isRead && (

                        <span className="new-badge">

                          New

                        </span>

                      )

                    }

                  </div>

                  <p>

                    {item.message}

                  </p>

                  <div className="notification-footer">

                    <span
                      className={`type ${item.type}`}
                    >

                      {item.type.replace("_", " ")}

                    </span>

                    <span className="time">

                      <Clock size={14} />

                      {

                        new Date(
                          item.createdAt
                        ).toLocaleString()

                      }

                    </span>

                  </div>

                </div>

                <button
                  className="clear-btn"
                  onClick={() =>
                    deleteNotification(item._id)
                  }
                >

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}

export default Notifications;