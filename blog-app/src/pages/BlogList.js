import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Dùng để tạo liên kết tới trang chi tiết của mỗi blog.
import './BlogList.css';

function BlogList() {
  //useState([]):
  // - State `blogs` dùng để lưu trữ danh sách các blog lấy từ API. Ban đầu là một mảng rỗng.
  const [blogs, setBlogs] = useState([]);

  // Lấy thông tin người dùng từ localStorage để biết blog nào là của người dùng đang đăng nhập.
  const user = JSON.parse(localStorage.getItem('user'));

  //useEffect:
  // - Khi component render lần đầu (và chỉ một lần), hàm `fetchBlogs` được gọi để lấy dữ liệu từ API.
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Gửi yêu cầu GET tới API để lấy tất cả các blog.
        const response = await axios.get('http://localhost:5000/posts');
        // Cập nhật state `blogs` với dữ liệu blog nhận được từ server.
        setBlogs(response.data);
      } catch (error) {
        // Nếu có lỗi trong quá trình lấy dữ liệu, in lỗi ra console.
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs(); // Gọi hàm để thực hiện yêu cầu API khi component được mount.
  }, []); // Mảng [] đảm bảo useEffect chỉ chạy một lần khi component được render.

  //filteredBlogs:
  // - Lọc danh sách blog để chỉ hiển thị blog công khai hoặc blog của chính người dùng đang đăng nhập.
  const filteredBlogs = blogs.filter(blog => blog.status === 'public' || blog.username === user.username);

  return (
    <div className="container">
      <h2>Blog List</h2>
      {/* Nếu không có blog nào phù hợp (công khai hoặc của người dùng), hiển thị thông báo */}
      {filteredBlogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        // Duyệt qua từng blog trong danh sách filteredBlogs và hiển thị chúng
        filteredBlogs.map(blog => (
          <div key={blog.id} className="card mb-3">
            <div className="card-body">
              {/* Hiển thị tiêu đề của blog */}
              <h5 className="card-title">{blog.title}</h5>
              
              {/* Hiển thị nội dung blog mà loại bỏ thẻ <p> để tránh việc dư thừa các đoạn văn */}
              {/* `dangerouslySetInnerHTML` được dùng để render HTML trực tiếp từ chuỗi */}
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />

              {/* Tạo một liên kết tới trang chi tiết của blog */}
              <Link to={`/blogs/${blog.id}`} className="btn">Read more</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;
