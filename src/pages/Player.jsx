import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./player.css";
import { supabase } from "../lib/supabaseClient";

function Player() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          navigate("/signin");
          return;
        }

        const res = await fetch("http://localhost:3000/data/movieData.json");
        const data = await res.json();
        const selectedMovie = data.find(
          (item) => String(item._id) === String(movieId),
        );

        if (!selectedMovie) {
          setError("Movie not found.");
          return;
        }

        setMovie(selectedMovie);

        const { data: existing, error: fetchError } = await supabase
          .from("continue_watching")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("movie_id", selectedMovie._id)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        if (existing) {
          await supabase
            .from("continue_watching")
            .update({
              last_watched_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("continue_watching").insert([
            {
              user_id: session.user.id,
              movie_id: selectedMovie._id,
              progress: 0,
            },
          ]);
        }
      } catch (err) {
        setError(err.message || "Failed to load player.");
      }
    };

    loadMovie();
  }, [movieId, navigate]);

  if (error) {
    return (
      <div className="playerPage">
        <div className="playerWrapper">
          <h2>{error}</h2>
          <Link to="/" className="playerBackBtn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="playerPage">
        <div className="playerWrapper">
          <h2>Loading player...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="playerPage">
      <div className="playerWrapper">
        <div className="playerTop">
          <div>
            <h1>{movie.title}</h1>
            <p>
              {movie.year} | {movie.length} | {movie.category}
            </p>
          </div>
          <Link to="/profile" className="playerBackBtn">
            Profile
          </Link>
        </div>

        <div className="playerFrameWrap">
          <iframe
            src={movie.video}
            title={movie.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>

        <div className="playerInfo">
          <h3>Description</h3>
          <p>{movie.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Player;
