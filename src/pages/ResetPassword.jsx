import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import { supabase } from "../lib/supabaseClient";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated successfully. Redirecting to sign in...");
    setTimeout(() => navigate("/signin"), 1500);
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1>Reset Password</h1>
        <p className="authSubtitle">Enter your new password</p>

        <form onSubmit={handlePasswordUpdate} className="authForm">
          <div className="inputGroup">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="inputGroup">
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="authError">{error}</div>}
          {message && <div className="authSuccess">{message}</div>}

          <button type="submit" className="authBtn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="authLinks">
          <span>
            <Link to="/signin">Back to Sign In</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
