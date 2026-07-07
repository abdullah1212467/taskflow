import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import "../css/login.css";

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {

      setLoading(true);

      const payload = {
        email,
        otp,
        newPassword: formData.password,
      };

      console.log("Reset Password Payload:", payload);

      const { data } = await axios.post(
        "/api/auth/reset-password",
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("Server Response:", data);

      toast.success(data.message);

      navigate("/login");

    } catch (error) {

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

    } finally {
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
            🔒
          </div>
        </div>

        {/* Heading */}
        <div className="heading">

          <h1>Create New Password</h1>

          <p>
            Choose a strong password to secure your account.
          </p>

        </div>

        {/* Form */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* Email */}
          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <Mail size={20} />

              <input
                type="email"
                value={email}
                readOnly
              />

            </div>

          </div>

          {/* New Password */}
          <div className="input-group">

            <label>New Password</label>

            <div className="input-box">

              <Lock size={20} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
              />

              {showPassword ? (
                <EyeOff
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(true)}
                />
              )}

            </div>

          </div>

          {/* Confirm Password */}
          <div className="input-group">

            <label>Confirm Password</label>

            <div className="input-box">

              <Lock size={20} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              {showConfirmPassword ? (
                <EyeOff
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}

            </div>

          </div>

          {/* Button */}
          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Resetting..."
              : "Reset Password"}

            <ArrowRight size={18} />

          </button>

        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Login */}
        <p className="register-text">

          Remember your password?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default ResetPassword;