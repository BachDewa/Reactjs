import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function BlogEdit() {
  // Lấy id từ URL (blog nào cần chỉnh sửa)
  const { id } = useParams();
  
  //useState({ title: '', content: '', status: 'public' }):
  // - Quản lý dữ liệu của form, bao gồm: tiêu đề (title), nội dung (content), và trạng thái (status).
  // - Ban đầu, title và content là chuỗi rỗng, status là 'public' (mặc định là công khai).
  const [formData, setFormData] = useState({ title: '', content: '', status: 'public' });

  // UseState('') (đối với error):
  // - Quản lý thông báo lỗi. Nếu có lỗi xảy ra, thông báo lỗi sẽ được lưu và hiển thị ra màn hình.
  const [error, setError] = useState('');

  // Dùng để điều hướng người dùng (ví dụ sau khi cập nhật thành công, chuyển về trang chi tiết blog).
  const navigate = useNavigate();

  // Lấy thông tin người dùng đã đăng nhập từ localStorage (thông tin này sẽ gửi kèm khi chỉnh sửa blog).
  const user = JSON.parse(localStorage.getItem('user'));

  //useEffect:
  // - Dùng để tải thông tin blog cần chỉnh sửa từ backend khi component được render lần đầu.
  // - Chỉ gọi lại hàm này khi giá trị `id` trong URL thay đổi.
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Gửi yêu cầu GET đến API để lấy thông tin blog dựa trên id.
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        // Cập nhật dữ liệu của form với dữ liệu blog nhận được.
        setFormData(response.data);
      } catch (err) {
        // Nếu có lỗi, lưu thông báo lỗi vào state `error`.
        setError('Error fetching blog: ' + err.response?.data.message);
      }
    };
    fetchBlog();
  }, [id]);

  //handleSubmit:
  // - Hàm này được gọi khi người dùng nhấn nút submit để cập nhật bài viết.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (reload trang).
    try {
      // Gửi yêu cầu PUT đến API backend để cập nhật blog với dữ liệu từ formData.
      await axios.put(`http://localhost:5000/posts/${id}`, { ...formData, username: user.username });
      // Sau khi cập nhật thành công, điều hướng về trang chi tiết của blog đó.
      navigate(`/blogs/${id}`);
    } catch (err) {
      // Nếu có lỗi khi cập nhật, lưu thông báo lỗi vào state `error`.
      setError('Error updating blog: ' + err.response?.data.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Chỉnh sửa Blog</h2>
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form chỉnh sửa blog */}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        {/*Tiêu đề bài viết */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Tiêu đề</label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Nhập tiêu đề"
            value={formData.title} // Giá trị của tiêu đề trong form
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} // Cập nhật tiêu đề vào state
            required
          />
        </div>

        {/*Nội dung bài viết */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Nội dung</label>
          <CKEditor
            editor={ClassicEditor} // Sử dụng CKEditor để nhập nội dung với định dạng văn bản đa dạng.
            data={formData.content} // Giá trị nội dung hiện tại của bài viết.
            onChange={(event, editor) => {
              const data = editor.getData(); // Khi người dùng thay đổi nội dung, lấy dữ liệu từ CKEditor.
              setFormData({ ...formData, content: data }); // Cập nhật nội dung vào state formData.
            }}
          />
        </div>

        {/*Trạng thái bài viết (Công khai/Riêng tư) */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Trạng thái</label>
          <select
            id="status"
            className="form-select"
            value={formData.status} // Giá trị trạng thái hiện tại (public/private).
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} // Cập nhật trạng thái vào formData.
          >
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
          </select>
        </div>

        {/* Nút submit để cập nhật bài viết */}
        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
}

export default BlogEdit;
