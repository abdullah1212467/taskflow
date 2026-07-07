import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  SquareCheckBig,
  PlusSquare,
  Trash2,
  User,
  LogOut,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../pages/api.js";

import "../css/sidebar.css";

function Sidebar() {

  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      title: "My Tasks",
      icon: <SquareCheckBig size={20} />,
      path: "/tasks",
    },
    {
      title: "Create Task",
      icon: <PlusSquare size={20} />,
      path: "/create-task",
    },
    {
      title: "Trash",
      icon: <Trash2 size={20} />,
      path: "/trash",
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      path: "/profile",
    },
  ];

  const handleLogout = async () => {

    try {

      const { data } = await api.post("/auth/logout");

      toast.success(data.message);

      localStorage.removeItem("accessToken");

      navigate("/login");

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

  };

  return (

    <aside className="sidebar">

      <div>

        <div className="sidebar-logo">

          <div className="logo-box">
            TF
          </div>

          <div>

            <h2>TaskFlow</h2>

            <p>Task Manager</p>

          </div>

        </div>

        <nav className="sidebar-menu">

          {

            menuItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "menu-item active-menu"
                    : "menu-item"
                }
              >

                {item.icon}

                <span>{item.title}</span>

              </NavLink>

            ))

          }

        </nav>

      </div>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >

        <LogOut size={20} />

        Logout

      </button>

    </aside>

  );

}

export default Sidebar;