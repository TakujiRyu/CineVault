import React from "react";
import "./main.css";
import Schedule from "./Schedule";
import Trend from "./Trend";
import Blog from "./Blog";

function Main({ searchQuery }) {
  return (
    <main>
      <Schedule searchQuery={searchQuery} />
      <Trend searchQuery={searchQuery} />
      <Blog searchQuery={searchQuery} />
    </main>
  );
}

export default Main;
