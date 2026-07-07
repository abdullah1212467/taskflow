import { useEffect, useRef, useState } from "react";

import { Menu, Bell } from "lucide-react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../pages/api.js";

import "../css/navebar.css";

function Navbar({ setShowSidebar }) {

  const userName = "Abdullah";

  const firstLetter = userName.charAt(0).toUpperCase();

  const [showNotificationDot, setShowNotificationDot] = useState(false);

  const latestNotificationId = useRef(null);

  const firstLoad = useRef(true);

  const checkNotifications = async () => {

    try {

      const { data } = await api.get("/notifications");

      const notifications = data.notifications || [];

      if (notifications.length === 0) {

        return;

      }

      const newestNotification = notifications[0];

      // First time page loads
      if (firstLoad.current) {

        latestNotificationId.current = newestNotification._id;

        firstLoad.current = false;

        return;

      }

      // New notification received
      if (latestNotificationId.current !== newestNotification._id) {

        latestNotificationId.current = newestNotification._id;

        setShowNotificationDot(true);

        toast.success("You have a new notification.", {
          duration: 2000,
        });

      }

    }

    catch (error) {

      console.log(error.response?.data);

    }

  };

  useEffect(() => {

    checkNotifications();

    const interval = setInterval(() => {

      checkNotifications();

    }, 10000);

    return () => clearInterval(interval);

  }, []);
    return (

    <header className="navbar">

      {/* Left */}

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={() => setShowSidebar(true)}
        >

          <Menu size={22} />

        </button>

        <div>

          <h2>Dashboard</h2>

          <p>Welcome back 👋</p>

        </div>

      </div>

      {/* Right */}

      <div className="navbar-right">

        <Link
          to="/notifications"
          onClick={() => setShowNotificationDot(false)}
        >

          <button className="notification-btn">

            <Bell size={20} />

            {

              showNotificationDot && (

                <span className="notification-dot"></span>

              )

            }

          </button>

        </Link>

        <div className="user-box">

          <div className="user-avatar">

            {firstLetter}

          </div>

          <div>

            <h4>{userName}</h4>

          </div>

        </div>

      </div>

    </header>

  );

}

export default Navbar;