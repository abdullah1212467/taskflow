import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Mail,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import "../css/login.css";

function VerifyOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const inputs = useRef([]);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const handleChange = (e, index) => {

    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    e.target.value = value;

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

  };

  const handleKeyDown = (e, index) => {

    if (
      e.key === "Backspace" &&
      !e.target.value &&
      index > 0
    ) {
      inputs.current[index - 1].focus();
    }

  };

  const handlePaste = (e) => {

    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    paste.split("").forEach((digit, index) => {
      if (inputs.current[index]) {
        inputs.current[index].value = digit;
      }
    });

    if (paste.length < 6) {
      inputs.current[paste.length]?.focus();
    }

  };

  const handleVerify = async (e) => {

    e.preventDefault();

    const otp = inputs.current
      .map((input) => input?.value || "")
      .join("");

    if (!email) {
      return toast.error("Email is required");
    }

    if (otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    try {

      setLoading(true);

      const { data } = await axios.post(
        "http://100.58.219.37:5000/api/auth/verify-email",
        {
          email,
          otp,
        },
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

      navigate("/");

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

        <div className="logo">

          <div className="logo-circle">
            <ShieldCheck size={34} />
          </div>

        </div>

        <div className="heading">

          <h1>Verify Email</h1>

          <p>
            Enter your email and the 6-digit verification code.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleVerify}
        >

          {/* Email */}

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <Mail size={20} />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
              />

            </div>

          </div>

          {/* OTP */}

          <div className="input-group">

            <label>Verification Code</label>

            <div className="otp-group">

              {[0, 1, 2, 3, 4, 5].map((item) => (

                <input
                  key={item}
                  ref={(el) => (inputs.current[item] = el)}
                  type="text"
                  maxLength={1}
                  className="otp-input"
                  onChange={(e) =>
                    handleChange(e, item)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, item)
                  }
                  onPaste={handlePaste}
                />

              ))}

            </div>

          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Verify Email"}

            <ArrowRight size={18} />

          </button>

        </form>

        <div className="divider">

          <span>OR</span>

        </div>

        <p className="register-text">

          Didn't receive the code?

          <Link to="#">
            Resend OTP
          </Link>

        </p>

      </div>

    </div>

  );

}

export default VerifyOtp;