import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./card.css";
import { supabase } from "../lib/supabaseClient";

function Card({ movie }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState("");

  const getCurrentUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      navigate("/signin");
      return null;
    }

    return session.user;
  };

  const handleAddToList = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    setBusy("list");

    const { data: existing, error: checkError } = await supabase
      .from("my_list")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie._id)
      .maybeSingle();

    if (checkError) {
      setBusy("");
      alert(checkError.message);
      return;
    }

    if (existing) {
      setBusy("");
      alert("This movie is already in your list.");
      return;
    }

    const { error } = await supabase.from("my_list").insert([
      {
        user_id: user.id,
        movie_id: movie._id,
      },
    ]);

    setBusy("");

    if (error) {
      alert(error.message);
      return;
    }

    alert("Movie added to My List.");
  };

  const handleWatchNow = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    navigate(`/player/${movie._id}`);
  };

  return (
    <div className="col-lg-2 col-md-4 col-sm-6">
      <div className="movie-card">
        <img src={movie.previewImg} alt={movie.title} className="img-fluid" />
        <p>
          {movie.length} | {movie.category}
        </p>
        <div className="content">
          <h4>{movie.title}</h4>
          <div className="card-icons">
            <ion-icon
              name={busy === "list" ? "hourglass-outline" : "add-outline"}
              onClick={handleAddToList}
            ></ion-icon>
            <ion-icon name="play-outline" onClick={handleWatchNow}></ion-icon>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
