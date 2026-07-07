import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleRegister = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.password) {
    return toast.error("Please fill all fields");
  }

  try {
    setLoading(true);

    const { data } = await axios.post(
      "http://100.58.219.37:5000/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );

  

    toast.success(data.message);

    navigate("/verify-otp", {
      state: {
        email: formData.email,
      },
    });

  } catch (error) {

  

    if (error.response?.data?.errors?.length) {

      error.response.data.errors.forEach((err) => {
        toast.error(err.msg);
      });

    } else if (error.response?.data?.message) {

      toast.error(error.response.data.message);

    } else if (error.request) {

      toast.error("Unable to connect to the server.");

    } else {

      toast.error("Something went wrong.");

    }

  } finally {

    // VERY IMPORTANT
    setLoading(false);

  }
};

  return (
    <div className="login-page">

      <div className="blur blur1"></div>
      <div className="blur blur2"></div>

      <div className="login-card">

        {/* Logo */}

        <div className="logo">
          <div className="logo-circle">
            TF
          </div>
        </div>

        {/* Heading */}

        <div className="heading">

          <h1>Create Account</h1>

          <p>
            Create your account and start managing your daily tasks.
          </p>

        </div>

        {/* Form */}

        <form
          className="login-form"
          onSubmit={handleRegister}
        >

          {/* Name */}

          <div className="input-group">

            <label>Full Name</label>

            <div className="input-box">

              <User size={20} />

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Email */}

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <Mail size={20} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Password */}

          <div className="input-group">

            <label>Password</label>

            <div className="input-box">

              <Lock size={20} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "#94a3b8",
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Submit */}

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >

             Create Account

            <ArrowRight size={18} />

          </button>

        </form>

        {/* Divider */}

        <div className="divider">

          <span>OR</span>

        </div>

        {/* Login */}

        <p className="register-text">

          Already have an account?

          <Link to="/login">
            Log In
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;