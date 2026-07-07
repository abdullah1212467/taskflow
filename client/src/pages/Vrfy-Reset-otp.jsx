import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import "../css/login.css";

function VerifyResetOtp() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const inputs = useRef([]);

  const handleChange = (e, index) => {

    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

  };

  const handleKeyDown = (e, index) => {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
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

    const newOtp = [...otp];

    paste.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

  };
const handleSubmit = (e) => {

  e.preventDefault();

  const otpCode = otp.join("");

  if (otpCode.length !== 6) {
    return toast.error("Please enter the complete OTP.");
  }

  console.log("OTP Data:", {
    email,
    otp: otpCode,
  });

  navigate("/reset-password", {
    state: {
      email,
      otp: otpCode,
    },
  });

};

  const handleResendOtp = async () => {

    if (!email) {
      return toast.error("Email not found.");
    }

    try {

      setResending(true);

      const { data } = await axios.post(
        "http://100.58.219.37:5000/api/auth/forgetPass",
        {
          email,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Resend OTP Response:", data);

      toast.success(data.message);

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

      setResending(false);

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

          <h1>Verify Reset OTP</h1>

          <p>

            Enter the 6-digit verification code sent to your email.

          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">

            <label>Verification Code</label>

            <div className="otp-group">

              {otp.map((digit, index) => (

                <input
                  key={index}
                  ref={(el) =>
                    (inputs.current[index] = el)
                  }
                  type="text"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={(e) =>
                    handleChange(e, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  onPaste={handlePaste}
                />

              ))}

            </div>

          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Continue"}

            <ArrowRight size={18} />

          </button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="register-text">

          Didn't receive the code?

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              cursor: "pointer",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            {resending
              ? "Sending..."
              : "Resend OTP"}
          </button>

        </p>

      </div>

    </div>

  );
}

export default VerifyResetOtp;