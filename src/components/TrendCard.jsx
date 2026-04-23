import React from "react";
import "./trendCard.css";

function TrendCard({ slide }) {
  return (
    <div className="trend-card">
      <img src={slide.previewImg} alt={slide.title} className="img-fluid" />
      <button type="button" className="trendCardBtn">
        Watch Now <ion-icon name="play-outline"></ion-icon>
      </button>
    </div>
  );
}

export default TrendCard;
