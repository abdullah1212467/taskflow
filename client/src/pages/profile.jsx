import { useEffect, useState } from "react";
import {
  User,
  BadgeCheck,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../pages/api.js";

import "../css/profile.css";

function Profile() {

  const [user, setUser] = useState({

    name: "",

    email: "",

    profilePicture: "",

    isEmailVerified: false,

    isActive: false,

    createdAt: "",

  });

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {

    try {

      setLoading(true);

      const { data } = await api.get("/profile/profile");

      console.log(data);

      setUser(data.user);

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

  useEffect(() => {

    fetchProfile();

  }, []);

  if (loading) {

    return (

      <div className="profile-page">

        <h2
          style={{
            textAlign: "center",
            marginTop: "150px",
          }}
        >

          Loading Profile...

        </h2>

      </div>

    );

  }

  return (

    <div className="profile-page">

      {/* Left Side */}

      <div className="profile-card">

        <div className="profile-heading">

          <h1>My Profile</h1>

          <p>

            Your account information.

          </p>

        </div>

        {/* Profile Picture */}

        <div className="avatar-section">

          <div className="avatar">

            {

              user.profilePicture ?

              <img
                src={`http://localhost:5000/uploads/${user.profilePicture}`}
                alt="Profile"
              />

              :

              <User size={55} />

            }

          </div>

        </div>

        {/* Name */}

        <div className="input-group">

          <label>

            Full Name

          </label>

          <div className="input-box">

            <span>{user.name}</span>

          </div>

        </div>

        {/* Email */}

        <div className="input-group">

          <label>

            Email Address

          </label>

          <div className="input-box">

            <span>{user.email}</span>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="summary-card">

        <div className="summary-avatar">

          {

            user.profilePicture ?

            <img
              src={`http://localhost:5000/uploads/${user.profilePicture}`}
              alt="Profile"
            />

            :

            <User size={65} />

          }

        </div>

        <h2>

          {user.name}

        </h2>

        <p>

          {user.email}

        </p>

        <div className="summary-info">
                    <div>

            <BadgeCheck size={18} />

            <span>

              Email

            </span>

            <strong>

              {

                user.isEmailVerified

                ?

                "Verified"

                :

                "Not Verified"

              }

            </strong>

          </div>

          <div>

            <ShieldCheck size={18} />

            <span>

              Account

            </span>

            <strong>

              {

                user.isActive

                ?

                "Active"

                :

                "Inactive"

              }

            </strong>

          </div>

          <div>

            <CalendarDays size={18} />

            <span>

              Joined

            </span>

            <strong>

              {

                user.createdAt

                ?

                new Date(
                  user.createdAt
                ).toLocaleDateString()

                :

                "N/A"

              }

            </strong>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;