import React, { useEffect } from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  // const [otpSent, setOtpSent] = useState(false);
  const [isotpverifying, setIsotpverifying] = useState(false);
  const [optverified, setOtpVerified] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const { isGettingOtp, isResettingPassword, getOtp, forgotPassword, otp, otpSent, setOtp } =
    useAuthStore();

  useEffect(() => {
    setOtp(null);
  }, []);


    
  const sendOtp = async () => {
    const username = formData.userName;
    if(!username) {
      toast.error("Username is required");
    }
    else {
      const result = await getOtp({userName: username});
      emailjs
      .send(
        'service_4k4kkr7',
        'template_9etvx2i',
        {
            from_name: "Chatty",
            to_name: result.username,
            from_email: result.email,
            to_email: result.email,
            message: result.otp,
        },
        "QePtZrLC9GljElVm5"
      );
    }
  }

  const verifyOtp = () => {
    setIsotpverifying(true);
    if(formData.otp === otp.toString()) {
      setIsotpverifying(false);
      setOtpVerified(true);
      toast.success("OTP verified");  
    }
    else {
      toast.error("Invalid OTP");
      setIsotpverifying(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(formData);
    navigate('/login');
  };

  return (
    <div className="min-h-screen mt-5 grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />

      {/* Right Side - Image/Pattern */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Trouble logging in?</h1>
              <p className="text-base-content/60">Reset your Password</p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Send OTP  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-2/3 pl-10`}
                  placeholder="username1234"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="btn btn-primary w-1/3"
                  disabled={isGettingOtp}
                  onClick={sendOtp}
                >
                  {isGettingOtp ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : otpSent ? (
                    "OTP Sent"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </div>

            {/* Verify OTP  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Verify OTP</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-2/3 pl-10`}
                  placeholder="OTP"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="btn btn-primary w-1/3"
                  disabled={isotpverifying}
                  onClick={verifyOtp}
                >
                  {isotpverifying ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      {optverified ? (
                        <>
                          Verified
                          <CheckCircle className="h-5 w-5" />
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Password  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword1 ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!optverified}
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              <Link to="/login" className="link link-primary">
                Back to Login
              </Link>
            </p>
            <div className="text-base-content/60">OR</div>
            <p className="text-base-content/60">
              <Link to="/signup" className="link link-primary">
                Create account{" "}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


// https://clearkeys.enamy3.workers.dev/?id=52 