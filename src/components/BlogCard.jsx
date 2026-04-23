import React from "react";
import "./blogCard.css";

function BlogCard({ blog }) {
  return (
    <div className="blog col-xl-3 col-md-6 mb-4">
      <article>
        <div className="post-img">
          <img src={blog.thumbnail} alt={blog.title} className="img-fluid" />
        </div>

        <p className="post-category">{blog.category}</p>

        <h2 className="title">
          <button type="button" className="blogTitleBtn">
            {blog.title}
          </button>
        </h2>

        <div className="d-flex align-items-center">
          <img
            src={blog.author.image}
            alt={blog.author.name}
            className="img-fluid post-author-img flex-shrink-0"
          />
          <div className="post-meta">
            <p className="post-author-list">{blog.author.name}</p>
            <p className="post-date">
              <time dateTime={blog.date}>{blog.date}</time>
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default BlogCard;
