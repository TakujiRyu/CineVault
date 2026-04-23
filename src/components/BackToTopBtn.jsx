import React from "react";
import "./backToTopBtn.css";

function BackToTopBtn({ scroll }) {
  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${scroll > 100 ? "active" : ""}`}
      onClick={backToTop}
      aria-label="Back to top"
    >
      <ion-icon name="arrow-up-outline"></ion-icon>
    </button>
  );
}

export default BackToTopBtn;
