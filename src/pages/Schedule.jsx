import React, { useState, useEffect, useMemo } from "react";
import "./schedule.css";
import Card from "../components/Card";

function Schedule({ searchQuery }) {
  const filterList = [
    { _id: 1, name: "All", active: true },
    { _id: 2, name: "Romance", active: false },
    { _id: 3, name: "Action", active: false },
    { _id: 4, name: "Thriller", active: false },
    { _id: 5, name: "Horror", active: false },
    { _id: 6, name: "Adventure", active: false },
  ];

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(filterList);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fectchData = () => {
    fetch("/data/movieData.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    fectchData();
  }, []);

  const handleFilterMovies = (category) => {
    setSelectedCategory(category);

    setFilters(
      filters.map((filter) => {
        filter.active = filter.name === category;
        return filter;
      }),
    );
  };

  const filteredMovies = useMemo(() => {
    let result = [...data];
    if (selectedCategory !== "All") {
      result = result.filter((movie) => movie.category === selectedCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((movie) => {
      return (
        movie.title?.toLowerCase().includes(query) ||
        movie.category?.toLowerCase().includes(query) ||
        movie.year?.toLowerCase().includes(query) ||
        movie.ageLimit?.toLowerCase().includes(query) ||
        movie.length?.toLowerCase().includes(query) ||
        movie.description?.toLowerCase().includes(query)
      );
    });
  }, [data, selectedCategory, searchQuery]);

  return (
    <section id="browse" className="schedule">
      <div className="container-fluid">
        <div className="row">
          <h4 className="section-title">Browse by Genre</h4>
        </div>
        <div className="row">
          <ul className="filters">
            {filters.map((filter) => (
              <li
                key={filter._id}
                className={`${filter.active ? "active" : ""}`}
                onClick={() => handleFilterMovies(filter.name)}
              >
                {filter.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="row mt-5">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Card key={movie._id} movie={movie} />
            ))
          ) : (
            <p className="text-white">No matching movies found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Schedule;
