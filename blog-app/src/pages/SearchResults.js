import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; // `useLocation` dùng để lấy query từ URL, `Link` dùng để điều hướng.
import axios from 'axios';

function SearchResults() {
  //useState([]):
  // - `results`: State để lưu danh sách kết quả tìm kiếm trả về từ API.
  // - `setResults`: Hàm để cập nhật giá trị của `results`.
  const [results, setResults] = useState([]);

  //useState(null):
  // - `error`: State để lưu lỗi nếu xảy ra khi lấy dữ liệu từ API.
  // - `setError`: Hàm để cập nhật lỗi.
  const [error, setError] = useState(null); 

  //useLocation().search:
  // - Lấy tham số truy vấn từ URL, dùng `new URLSearchParams()` để phân tích cú pháp query string.
  // - Ở đây chúng ta lấy tham số `keyword` từ URL.
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get('keyword'); // Lấy từ khóa tìm kiếm từ query string (?keyword=...)

  //useEffect:
  // - Hàm `useEffect` được chạy sau khi component được render.
  // - Hàm này dùng để gửi yêu cầu HTTP GET đến API khi từ khóa `keyword` thay đổi.
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Gửi yêu cầu GET tới API `/posts/search?keyword=...`
        const response = await axios.get(`http://localhost:5000/posts/search?keyword=${keyword}`);
        setResults(response.data); // Cập nhật state `results` với dữ liệu trả về từ API.
        setError(null); // Nếu thành công, đặt `error` về null.
      } catch (error) {
        console.error("Error fetching search results:", error); // Ghi lỗi vào console.
        setError("An error occurred while fetching search results."); // Cập nhật `error` để hiển thị thông báo lỗi.
      }
    };

    // Kiểm tra xem từ khóa `keyword` có hợp lệ không (không rỗng và có chứa ký tự không phải khoảng trắng).
    if (keyword && keyword.trim()) {
      fetchResults(); // Nếu hợp lệ, gọi hàm fetchResults để lấy dữ liệu.
    }
  }, [keyword]); // useEffect sẽ chạy lại khi giá trị `keyword` thay đổi.

  return (
    <div className="container">
      <h2>Search Results for: {keyword}</h2> {/* Hiển thị từ khóa người dùng đã tìm kiếm */}
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <div className="alert alert-danger">{error}</div>} 

      {/* Nếu không có kết quả và không có lỗi, hiển thị thông báo "No results found" */}
      {results.length === 0 && !error ? ( 
        <p>No results found.</p>
      ) : (
        // Nếu có kết quả, hiển thị danh sách các bài viết.
        <ul className="list-group">
          {results.map(post => (
            <li key={post.id} className="list-group-item"> {/* Lặp qua từng kết quả tìm kiếm */}
              <h5>{post.title || "Untitled"}</h5> {/* Nếu bài viết không có tiêu đề, hiển thị "Untitled" */}
              
              {/* Hiển thị nội dung của bài viết. Dùng `dangerouslySetInnerHTML` để hiển thị nội dung HTML */}
              <p dangerouslySetInnerHTML={{ __html: post.content }} /> 
              
              {/* Link điều hướng đến trang chi tiết của bài viết */}
              <Link to={`/blogs/${post.id}`} className="btn btn-primary">View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;
