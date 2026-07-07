import "../css/login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Server Response:", data);

      toast.success(data.message);

      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      navigate("/");

    } catch (error) {

      console.log("Server Error:", error.response?.data);

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

      setLoading(false);

    }
  };

  return (
    <div className="login-page">

      <div className="blur blur1"></div>
      <div className="blur blur2"></div>

      <div className="login-card">

        <div className="logo">
          <div className="logo-circle">
            TF
          </div>
        </div>

        <div className="heading">
          <h1>Log In</h1>

          <p>
            Log in to continue managing your daily tasks.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
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

          {/* Remember */}

          <div className="options">

           

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging In..."
              : "Log In"}

            <ArrowRight size={20} />

          </button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="register-text">

          Don't have an account?

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;