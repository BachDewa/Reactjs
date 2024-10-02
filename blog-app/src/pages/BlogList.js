import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogList.css'; // Nhập tệp CSS cho BlogList

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/posts');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => blog.status === 'public' || blog.username === user.username);

  return (
    <div className="container">
      <h2>Blog List</h2>
      {filteredBlogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        filteredBlogs.map(blog => (
          <div key={blog.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{blog.title}</h5>
              {/* Loại bỏ thẻ <p> khi hiển thị nội dung */}
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
              <Link to={`/blogs/${blog.id}`} className="btn">Read more</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;
