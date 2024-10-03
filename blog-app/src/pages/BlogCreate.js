import React, { useState } from 'react';
import axios from 'axios'; // Thư viện để gửi yêu cầu HTTP
import { CKEditor } from '@ckeditor/ckeditor5-react'; // Component CKEditor
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Phiên bản Classic của CKEditor

function BlogCreate() {
  // Khởi tạo state để quản lý dữ liệu của form: title, content, status
  const [formData, setFormData] = useState({ title: '', content: '', status: 'public' });
  
  // Khởi tạo state để lưu thông báo lỗi khi có vấn đề xảy ra trong quá trình gửi yêu cầu
  const [error, setError] = useState('');

  // Hàm handleSubmit sẽ xử lý việc gửi form khi người dùng nhấn nút "Tạo"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (không tải lại trang)
    
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
      // Gửi yêu cầu POST tới API backend để tạo bài viết mới
      await axios.post('http://localhost:5000/posts', { ...formData, username: user.username });
      
      // Sau khi tạo blog thành công, reset form và hiện thông báo
      setFormData({ title: '', content: '', status: 'public' }); // Đặt lại giá trị của form
      alert('Blog created successfully!'); // Hiển thị thông báo thành công
    } catch (err) {
      // Nếu có lỗi xảy ra, hiển thị thông báo lỗi từ server
      setError('Error creating blog: ' + err.response?.data.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tạo Blog</h2>
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Form để tạo bài viết mới */}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        
        {/* Nhập tiêu đề của bài viết */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Tiêu đề</label>
          <input
            type="text" // Loại input là văn bản
            id="title" // ID của trường, dùng cho label liên kết
            className="form-control" // Áp dụng các class của Bootstrap để định dạng
            placeholder="Nhập tiêu đề" // Văn bản hiển thị khi ô trống
            value={formData.title} // Giá trị hiện tại của ô tiêu đề
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} // Cập nhật state khi người dùng nhập
            required // Yêu cầu trường này phải được nhập
          />
        </div>

        {/* CKEditor để nhập nội dung của bài viết */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Nội dung</label>
          <CKEditor
            editor={ClassicEditor} // Sử dụng CKEditor phiên bản Classic
            data={formData.content} // Dữ liệu hiện tại của nội dung
            onChange={(event, editor) => {
              const data = editor.getData(); // Lấy dữ liệu khi người dùng nhập
              setFormData({ ...formData, content: data }); // Cập nhật state với nội dung mới
            }}
          />
        </div>

        {/* Chọn trạng thái của bài viết: Công khai hoặc Riêng tư */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Trạng thái</label>
          <select
            id="status" // ID của trường, dùng cho label liên kết
            className="form-select" // Áp dụng class của Bootstrap cho select
            value={formData.status} // Giá trị hiện tại của trạng thái
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} // Cập nhật state khi người dùng chọn trạng thái khác
          >
            <option value="public">Công khai</option> {/* Lựa chọn công khai */}
            <option value="private">Riêng tư</option> {/* Lựa chọn riêng tư */}
          </select>
        </div>

        {/* Nút để submit form */}
        <button type="submit" className="btn btn-primary">Tạo</button>
      </form>
    </div>
  );
}

export default BlogCreate;
