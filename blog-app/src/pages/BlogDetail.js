import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlogAndLikes = async () => {
      try {
        const [blogResponse, likesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/posts/${id}`),
          axios.get(`http://localhost:5000/posts/${id}/likes`)
        ]);
        
        setBlog(blogResponse.data);
        setLikes(likesResponse.data);
      } catch (error) {
        console.log('Error fetching blog or likes:', error);
        alert('Đã xảy ra lỗi trong quá trình lấy dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndLikes();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5000/posts/${id}/like`, { username: user?.username });
      setLikes(prevLikes => [...prevLikes, { username: user.username }]);
    } catch (err) {
      console.log('Error liking post:', err.response?.data.message);
      alert('Đã xảy ra lỗi trong quá trình thích bài viết.');
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.post(`http://localhost:5000/posts/${id}/unlike`, { username: user?.username });
      setLikes(prevLikes => prevLikes.filter(like => like.username !== user.username));
    } catch (err) {
      console.log('Error unliking post:', err.response?.data.message);
      alert('Đã xảy ra lỗi trong quá trình bỏ thích bài viết.');
    }
  };

  const hasLiked = likes.some(like => like.username === user?.username);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="text-center">Blog không tồn tại.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{blog.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
          <p className="card-text"><strong>Trạng thái:</strong> {blog.status}</p>
          <p className="card-text"><strong>Tạo bởi:</strong> {blog.username}</p>

          {user?.username === blog.username && (
            <div className="mb-3">
              <Link to={`/blogs/edit/${id}`} className="btn btn-warning me-2">Chỉnh sửa</Link>
              <button onClick={async () => {
                await axios.delete(`http://localhost:5000/posts/${id}`, { data: { username: user.username } });
                navigate('/blogs');
              }} className="btn btn-danger">Xóa</button>
            </div>
          )}

          {hasLiked ? (
            <button onClick={handleUnlike} className="btn btn-secondary me-2">Bỏ thích</button>
          ) : (
            <button onClick={handleLike} className="btn btn-primary me-2">Thích</button>
          )}

          <p className="mt-3"><strong>Số lượt thích:</strong> {likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
