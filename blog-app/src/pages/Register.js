import React, { useState } from 'react';
import axios from 'axios'; // Thư viện để gửi yêu cầu HTTP.
import { Link } from 'react-router-dom'; 
import './Register.css'; 

function Register() {
  //useState({ username: '', password: '', dob: '', image: '' }):
  // - `formData`: Dùng để quản lý thông tin người dùng nhập vào form (username, password, ngày sinh và URL hình ảnh).
  // - `setFormData`: Hàm để cập nhật giá trị `formData`.
  const [formData, setFormData] = useState({ username: '', password: '', dob: '', image: '' });

  //useState(''):
  // - `error`: Dùng để quản lý lỗi khi đăng ký, nếu có lỗi, giá trị này sẽ lưu thông báo lỗi.
  // - `setError`: Hàm để cập nhật lỗi.
  const [error, setError] = useState('');

  //handleSubmit:
  // - Hàm này sẽ được gọi khi người dùng nhấn nút đăng ký.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (làm mới trang).

    try {
      // Gửi yêu cầu HTTP POST đến API để đăng ký với dữ liệu `formData`.
      const response = await axios.post('http://localhost:5000/register', formData);

      // In ra dữ liệu trả về từ API (có thể điều hướng người dùng về trang đăng nhập sau khi đăng ký thành công).
      console.log(response.data);
    } catch (err) {
      // Nếu có lỗi xảy ra (ví dụ username đã tồn tại), lưu thông báo lỗi vào state `error`.
      setError(err.response.data.message);
    }
  };

  return (
    //Giao diện đăng ký:
    // - Gồm hai phần: một bên là ảnh và một bên là form đăng ký.
    <div className="register-page">
      <div className="row h-100">
        
        {/* Cột bên trái hiển thị hình ảnh banner */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={require('../assets/content.jpg')} alt="Register Banner" className="img-fluid" />
        </div>

        {/* Cột bên phải chứa form đăng ký */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="register-form">
            <h2 className="text-center">Register</h2>

            {/* Nếu có lỗi (error không rỗng), hiển thị thông báo lỗi */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Form đăng ký */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username} // Liên kết giá trị input với `formData.username`.
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} // Cập nhật `formData` khi người dùng thay đổi giá trị input.
                  required // Trường này bắt buộc phải nhập.
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password} // Liên kết giá trị input với `formData.password`.
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Cập nhật `formData` khi người dùng thay đổi giá trị input.
                  required // Trường này bắt buộc phải nhập.
                />
              </div>
              
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dob} // Liên kết giá trị input với `formData.dob`.
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })} // Cập nhật `formData` khi người dùng thay đổi giá trị input.
                  required // Trường này bắt buộc phải nhập.
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Image URL" // Gợi ý nhập URL hình ảnh.
                  value={formData.image} // Liên kết giá trị input với `formData.image`.
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} // Cập nhật `formData` khi người dùng thay đổi giá trị input.
                />
              </div>
              
              {/* Nút đăng ký */}
              <button type="submit" className="btn btn-primary mt-3 w-100">Register</button>
            </form>

            {/* Liên kết tới trang đăng nhập */}
            <div className="mt-3 text-center">
              <p>Do you have an account yet? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
