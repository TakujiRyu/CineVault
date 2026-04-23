import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import { supabase } from "../lib/supabaseClient";

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Sign in successful. Redirecting...");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1>Sign In</h1>
        <p className="authSubtitle">Welcome back to CineVault</p>

        <form onSubmit={handleSignIn} className="authForm">
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="authError">{error}</div>}
          {message && <div className="authSuccess">{message}</div>}

          <button type="submit" className="authBtn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="authLinks">
          <Link to="/forgot-password">Forgot Password?</Link>
          <span>
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </span>
          <span>
            <Link to="/">Back to Home</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
