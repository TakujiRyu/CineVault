import React from "react";
import { Link } from "react-router-dom";
import "./button.css";

function Button({
  icon,
  name,
  bgColor = "#ff3700",
  color = "#ffffff",
  to,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  const style = { color, background: bgColor };
  const classes = `mainBtn ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} style={style}>
        {icon}
        {name}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {name}
    </button>
  );
}

export default Button;
