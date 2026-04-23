import React, { useState } from "react";
import "./movieContent.css";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { supabase } from "../lib/supabaseClient";

function MovieContent({ movie }) {
  const navigate = useNavigate();
  const [loadingList, setLoadingList] = useState(false);

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

    setLoadingList(true);

    const { data: existing, error: checkError } = await supabase
      .from("my_list")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie._id)
      .maybeSingle();

    if (checkError) {
      setLoadingList(false);
      alert(checkError.message);
      return;
    }

    if (existing) {
      setLoadingList(false);
      alert("This movie is already in your list.");
      return;
    }

    const { error } = await supabase.from("my_list").insert([
      {
        user_id: user.id,
        movie_id: movie._id,
      },
    ]);

    setLoadingList(false);

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
    <div className={`content ${movie.active ? "active" : undefined}`}>
      <img src={movie.titleImg} alt="Movie Title" className="movie-title" />
      <h4>
        <span>{movie.year}</span>
        <span>
          <i>{movie.ageLimit}</i>
        </span>
        <span>{movie.length}</span>
        <span>{movie.category}</span>
      </h4>
      <p>{movie.description}</p>
      <div className="button">
        <Button
          icon={<ion-icon name="play-outline"></ion-icon>}
          name="Watch Now"
          color="#ff3700"
          bgColor="#ffffff"
          onClick={handleWatchNow}
        />

        <Button
          icon={<ion-icon name="add-outline"></ion-icon>}
          name={loadingList ? "Saving..." : "My List"}
          onClick={handleAddToList}
          disabled={loadingList}
        />
      </div>
    </div>
  );
}

export default MovieContent;
