import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import { supabase } from "../lib/supabaseClient";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Account created. Check your email for confirmation.");
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1>Create Account</h1>
        <p className="authSubtitle">Join CineVault today</p>

        <form onSubmit={handleSignUp} className="authForm">
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="authError">{error}</div>}
          {message && <div className="authSuccess">{message}</div>}

          <button type="submit" className="authBtn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="authLinks">
          <span>
            Already have an account? <Link to="/signin">Sign In</Link>
          </span>
          <span>
            <Link to="/">Back to Home</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
