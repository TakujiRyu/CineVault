import React, { useEffect, useState } from "react";
import "./blog.css";
import BlogCard from "../components/BlogCard";

function Blog() {
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

  return (
    <section id="news" className="blogs">
      <div className="container-fluid">
        <div className="row">
          <h4 className="section-title">Our Blog</h4>
        </div>
        <div className="row mt-5">
          {blogs &&
            blogs.length > 0 &&
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </div>
    </section>
  );
}

export default Blog;
