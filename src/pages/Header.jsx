import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import NavListItem from "../components/NavListItem";
import navListData from "../data/navListData";
import Search from "../components/Search";
import Button from "../components/Button";
import { supabase } from "../lib/supabaseClient";

function Header({ scroll, user, searchQuery, setSearchQuery }) {
  const [navList, setNavList] = useState(navListData);
  const navigate = useNavigate();

  const handleNavOnClick = (id) => {
    const nowNavList = navList.map((nav) => {
      nav.active = false;
      if (nav._id === id) nav.active = true;
      return nav;
    });

    setNavList(nowNavList);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className={`${scroll > 100 ? "scrolled" : ""}`}>
      <Link to="/" className="logo">
        CineVault
      </Link>

      <ul className="nav">
        {navList.map((nav) => (
          <NavListItem key={nav._id} nav={nav} navOnClick={handleNavOnClick} />
        ))}
      </ul>

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="authActions">
        {user ? (
          <>
            <Button
              icon={<ion-icon name="person-outline"></ion-icon>}
              name="Profile"
              to="/profile"
              bgColor="#1f1f1f"
            />
            <Button
              icon={<ion-icon name="log-out-outline"></ion-icon>}
              name="Sign Out"
              onClick={handleSignOut}
            />
          </>
        ) : (
          <Button
            icon={<ion-icon name="log-in-outline"></ion-icon>}
            name="Sign In"
            to="/signin"
          />
        )}
      </div>
    </header>
  );
}

export default Header;
