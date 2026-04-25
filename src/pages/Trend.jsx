import React, { useEffect, useMemo, useState } from "react";
import "./trend.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import TrendCard from "../components/TrendCard";

function Trend({ searchQuery }) {
  const [slides, setSlides] = useState([]);

  const fectchData = () => {
    fetch("/data/movieData.json")
      .then((res) => res.json())
      .then((data) => {
        setSlides(data);
      })
      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    fectchData();
  }, []);

  const filteredSlides = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return slides;

    return slides.filter((slide) => {
      return (
        slide.title?.toLowerCase().includes(query) ||
        slide.category?.toLowerCase().includes(query) ||
        slide.year?.toLowerCase().includes(query) ||
        slide.type?.toLowerCase().includes(query)
      );
    });
  }, [slides, searchQuery]);

  return (
    <section id="trend" className="trend">
      <div className="container-fluid">
        <div className="row">
          <h4 className="section-title">Trending Now</h4>
        </div>
        <div className="row">
          {filteredSlides.length > 0 ? (
            <Swiper
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                400: { slidesPerView: 3, spaceBetween: 30 },
                640: { slidesPerView: 4, spaceBetween: 30 },
                992: { slidesPerView: 6, spaceBetween: 30 },
              }}
              spaceBetween={30}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              loop={filteredSlides.length > 1}
              modules={[Autoplay]}
              className="trendSwiper"
            >
              {filteredSlides.map((slide) => (
                <SwiperSlide key={slide._id}>
                  <TrendCard slide={slide} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-white mt-4">No matching movies found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Trend;
