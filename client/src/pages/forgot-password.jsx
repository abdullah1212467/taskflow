import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import "../css/login.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email.");
    }

    try {

      setLoading(true);

      const { data } = await axios.post(
        "http://100.58.219.37:5000/api/auth/forgetPass",
        {
          email,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Server Response:", data);

      toast.success(data.message);

      navigate("/verify-reset-otp", {
        state: {
          email,
        },
      });

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

            <Mail size={32} />

          </div>

        </div>

        {/* Heading */}

        <div className="heading">

          <h1>Forgot Password</h1>

          <p>

            Enter your registered email address. We'll send you a verification code to reset your password.

          </p>

        </div>

        {/* Form */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <Mail size={20} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading ? "Sending..." : "Send OTP"}

            <ArrowRight size={18} />

          </button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

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

export default ForgotPassword;