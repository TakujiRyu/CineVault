import React, { useEffect, useMemo, useState } from "react";
import "./blog.css";
import BlogCard from "../components/BlogCard";

function Blog({ searchQuery }) {
  const [blogs, setBlogs] = useState([]);

  const fectchData = () => {
    fetch("http://localhost:3000/data/blogData.json")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
      })
      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    fectchData();
  }, []);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter((blog) => {
      return (
        blog.title?.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.author?.name?.toLowerCase().includes(query) ||
        blog.date?.toLowerCase().includes(query)
      );
    });
  }, [blogs, searchQuery]);

  return (
    <section id="news" className="blogs">
      <div className="container-fluid">
        <div className="row">
          <h4 className="section-title">Our Blog</h4>
        </div>
        <div className="row mt-5">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          ) : (
            <p className="text-white">No matching blogs found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Blog;
