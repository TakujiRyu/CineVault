import React from "react";
import "./footerNavItem.css";

function FooterNavItem({ name }) {
  return (
    <li>
      <ion-icon name="chevron-forward-outline"></ion-icon>
      <button type="button" className="footerNavBtn">
        {name}
      </button>
    </li>
  );
}

export default FooterNavItem;
