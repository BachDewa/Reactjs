import React, { useState } from 'react';
import axios from 'axios'; // Thư viện để gửi yêu cầu HTTP.
import { useNavigate, Link } from 'react-router-dom'; // useNavigate để điều hướng sau khi đăng nhập thành công, Link để chuyển hướng sang trang đăng ký.
import './Login.css';

function Login() {
  //useState({ username: '', password: '' }):
  // - `formData`: Dùng để quản lý thông tin người dùng nhập vào form (username và password).
  // - `setFormData`: Hàm để cập nhật giá trị `formData`.
  const [formData, setFormData] = useState({ username: '', password: '' });

  //useState(''):
  // - `error`: Dùng để quản lý lỗi khi đăng nhập, nếu có lỗi, giá trị này sẽ lưu thông báo lỗi.
  // - `setError`: Hàm để cập nhật lỗi.
  const [error, setError] = useState('');

  //useNavigate():
  // - `navigate`: Hàm này dùng để điều hướng người dùng đến các trang khác sau khi đăng nhập thành công.
  const navigate = useNavigate();

  //handleSubmit:
  // - Hàm này sẽ được gọi khi người dùng nhấn nút đăng nhập.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (làm mới trang).

    try {
      // Gửi yêu cầu HTTP POST đến API để đăng nhập với dữ liệu `formData`.
      const response = await axios.post('http://localhost:5000/login', formData);

      // Lưu thông tin người dùng (dữ liệu trả về từ API) vào localStorage để sử dụng trong ứng dụng.
      localStorage.setItem('user', JSON.stringify(response.data.data));

      // Điều hướng người dùng tới trang danh sách blog sau khi đăng nhập thành công.
      navigate('/blogs');
    } catch (err) {
      // Nếu có lỗi xảy ra (ví dụ thông tin đăng nhập không chính xác), lưu thông báo lỗi vào state `error`.
      setError(err.response.data.message);
    }
  };

  return (
    //Giao diện đăng nhập:
    // - Gồm hai phần: một bên là ảnh và một bên là form đăng nhập.
    <div className="login-page">
      <div className="row h-100">
        
        {/* Cột bên trái hiển thị hình ảnh banner */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={require('../assets/content.jpg')} alt="Login Banner" className="img-fluid" />
        </div>

        {/* Cột bên phải chứa form đăng nhập */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="login-form">
            <h2 className="text-center">Login</h2>

            {/* Nếu có lỗi (error không rỗng), hiển thị thông báo lỗi */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Form đăng nhập */}
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
              
              {/* Nút đăng nhập */}
              <button type="submit" className="btn btn-primary mt-3 w-100">Login</button>
            </form>

            {/* Liên kết tới trang đăng ký */}
            <div className="mt-3 text-center">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
