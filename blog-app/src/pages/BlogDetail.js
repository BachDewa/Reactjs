import React, { useState, useEffect } from 'react'; // Nhập các hook `useState` và `useEffect` để quản lý trạng thái và tác động phụ trong component.
import { useParams, Link, useNavigate } from 'react-router-dom'; // Nhập các hook `useParams` để lấy tham số URL, `Link` để điều hướng, và `useNavigate` để chuyển hướng trang.
import axios from 'axios'; // Nhập thư viện `axios` để thực hiện các yêu cầu HTTP.

function BlogDetail() {
  const { id } = useParams(); // Lấy `id` từ URL (id của bài blog) để sử dụng cho các yêu cầu API.
  const [blog, setBlog] = useState(null); // Khởi tạo state `blog` để lưu trữ dữ liệu chi tiết của bài viết.
  const [likes, setLikes] = useState([]); // Khởi tạo state `likes` để lưu trữ danh sách người dùng đã thích bài viết.
  const [loading, setLoading] = useState(true); // Khởi tạo state `loading` để quản lý trạng thái chờ trong khi lấy dữ liệu.
  const navigate = useNavigate(); // Sử dụng `useNavigate` để điều hướng sau khi xóa bài viết.
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng đã đăng nhập từ `localStorage`.

  // Hàm `useEffect` sẽ chạy sau khi component được render lần đầu tiên. Nó sẽ lấy dữ liệu blog và số lượt thích.
  useEffect(() => {
    const fetchBlogAndLikes = async () => {
      try {
        // Thực hiện hai yêu cầu HTTP song song: một để lấy chi tiết bài viết và một để lấy danh sách lượt thích.
        const [blogResponse, likesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/posts/${id}`), // Lấy chi tiết bài viết dựa trên `id`.
          axios.get(`http://localhost:5000/posts/${id}/likes`) // Lấy danh sách lượt thích của bài viết.
        ]);
        
        // Lưu trữ dữ liệu bài viết và danh sách lượt thích vào state.
        setBlog(blogResponse.data);
        setLikes(likesResponse.data);
      } catch (error) {
        // Xử lý lỗi nếu yêu cầu thất bại.
        console.log('Error fetching blog or likes:', error);
        alert('Đã xảy ra lỗi trong quá trình lấy dữ liệu.');
      } finally {
        // Sau khi hoàn thành yêu cầu, cập nhật trạng thái `loading` thành `false`.
        setLoading(false);
      }
    };

    fetchBlogAndLikes(); // Gọi hàm lấy dữ liệu.
  }, [id]); // Chỉ chạy lại `useEffect` khi `id` thay đổi.

  // Hàm để xử lý khi người dùng nhấn nút thích bài viết.
  const handleLike = async () => {
    try {
      // Gửi yêu cầu tới API để thêm lượt thích.
      await axios.post(`http://localhost:5000/posts/${id}/like`, { username: user?.username });
      // Cập nhật danh sách lượt thích bằng cách thêm người dùng hiện tại.
      setLikes(prevLikes => [...prevLikes, { username: user.username }]);
    } catch (err) {
      console.log('Error liking post:', err.response?.data.message);
      alert('Đã xảy ra lỗi trong quá trình thích bài viết.');
    }
  };

  // Hàm để xử lý khi người dùng nhấn nút bỏ thích bài viết.
  const handleUnlike = async () => {
    try {
      // Gửi yêu cầu tới API để bỏ thích.
      await axios.post(`http://localhost:5000/posts/${id}/unlike`, { username: user?.username });
      // Cập nhật danh sách lượt thích bằng cách loại bỏ người dùng hiện tại.
      setLikes(prevLikes => prevLikes.filter(like => like.username !== user.username));
    } catch (err) {
      console.log('Error unliking post:', err.response?.data.message);
      alert('Đã xảy ra lỗi trong quá trình bỏ thích bài viết.');
    }
  };

  // Kiểm tra xem người dùng hiện tại đã thích bài viết chưa.
  const hasLiked = likes.some(like => like.username === user?.username);

  // Hiển thị thông báo đang tải nếu dữ liệu chưa được tải xong.
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Hiển thị thông báo nếu bài viết không tồn tại.
  if (!blog) {
    return <div className="text-center">Blog không tồn tại.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          {/* Hiển thị tiêu đề bài viết */}
          <h2 className="card-title">{blog.title}</h2>
          {/* Hiển thị nội dung bài viết, loại bỏ các thẻ <p> */}
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
          {/* Hiển thị trạng thái (công khai/riêng tư) */}
          <p className="card-text"><strong>Trạng thái:</strong> {blog.status}</p>
          {/* Hiển thị tên người tạo */}
          <p className="card-text"><strong>Tạo bởi:</strong> {blog.username}</p>

          {/* Hiển thị các nút chỉnh sửa và xóa nếu người dùng hiện tại là người tạo bài viết */}
          {user?.username === blog.username && (
            <div className="mb-3">
              <Link to={`/blogs/edit/${id}`} className="btn btn-warning me-2">Chỉnh sửa</Link>
              <button onClick={async () => {
                // Xóa bài viết bằng API và điều hướng về trang danh sách blog.
                await axios.delete(`http://localhost:5000/posts/${id}`, { data: { username: user.username } });
                navigate('/blogs');
              }} className="btn btn-danger">Xóa</button>
            </div>
          )}

          {/* Hiển thị nút thích hoặc bỏ thích dựa trên trạng thái hiện tại */}
          {hasLiked ? (
            <button onClick={handleUnlike} className="btn btn-secondary me-2">Bỏ thích</button>
          ) : (
            <button onClick={handleLike} className="btn btn-primary me-2">Thích</button>
          )}

          {/* Hiển thị tổng số lượt thích */}
          <p className="mt-3"><strong>Số lượt thích:</strong> {likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail; // Xuất component `BlogDetail` để sử dụng ở các nơi khác.
