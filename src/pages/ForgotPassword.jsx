import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./forgotPassword.css";
import { supabase } from "../lib/supabaseClient";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password reset email sent. Check your inbox.");
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1>Forgot Password</h1>
        <p className="authSubtitle">We&apos;ll send you a reset link</p>

        <form onSubmit={handleResetRequest} className="authForm">
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <div className="authError">{error}</div>}
          {message && <div className="authSuccess">{message}</div>}

          <button type="submit" className="authBtn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="authLinks">
          <span>
            Remembered your password? <Link to="/signin">Sign In</Link>
          </span>
          <span>
            <Link to="/">Back to Home</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
