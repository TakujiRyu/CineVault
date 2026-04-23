import React, { useState } from "react";
import "./playBtn.css";
import Modal from "./Modal";

function PlayBtn({ movie }) {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <div
        className={`trailer d-flex align-items-center justify-content-center ${movie.active ? "active" : ""}`}
      >
        <button
          type="button"
          className="playBtn"
          onClick={toggleModal}
          aria-label={`Watch trailer for ${movie.title}`}
        >
          <ion-icon name="play-outline"></ion-icon>
        </button>
        <p>Watch Trailer</p>
      </div>
      {movie.active && (
        <Modal movie={movie} status={modal} toggleModal={toggleModal} />
      )}
    </>
  );
}

export default PlayBtn;
