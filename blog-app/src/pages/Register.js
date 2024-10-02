import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Nhập Link để điều hướng đến trang đăng nhập
import './Register.css'; // Nhập tệp CSS nếu cần

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', dob: '', image: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      console.log(response.data);
      // Có thể điều hướng về trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="register-page">
      <div className="row h-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={require('../assets/content.jpg')} alt="Register Banner" className="img-fluid" />
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="register-form">
            <h2 className="text-center">Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3 w-100">Register</button>
            </form>
            {/* Thêm liên kết đăng nhập */}
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
