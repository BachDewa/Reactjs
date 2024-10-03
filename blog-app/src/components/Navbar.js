import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaPowerOff, FaSearch } from 'react-icons/fa'; // Nhập biểu tượng từ react-icons
import './Navbar.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin user từ localStorage

  const handleSearch = (e) => {
    e.preventDefault();
    // Kiểm tra từ khóa trước khi điều hướng
    if (searchTerm.trim()) {
      navigate(`/blogs/search?keyword=${searchTerm.trim()}`); // Điều hướng tới trang kết quả tìm kiếm
      setSearchTerm(''); // Xóa ô tìm kiếm sau khi tìm kiếm
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin user khỏi localStorage
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark"> {/* Giao diện tối */}
      <Link className="navbar-brand" to="/blogs">Blog App</Link>

      <div className="collapse navbar-collapse">
        {/* Thanh tìm kiếm */}
        <form className="form-inline mx-auto" onSubmit={handleSearch}>
          <div className="input-group" style={{ width: '500px' }}> {/* Đặt chiều dài của thanh tìm kiếm */}
            <input
              className="form-control rounded-pill me-2" // Bo tròn thanh tìm kiếm
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-success rounded-pill" type="submit">
              <FaSearch /> {/* Biểu tượng tìm kiếm */}
            </button>
          </div>
        </form>

        <ul className="navbar-nav ml-auto">
          {user ? (
            <>
              {/* Tên người dùng */}
              <li className="nav-item">
                <span className="nav-link text-white">Hello, {user.username}</span>
              </li>
              {/* Nút Create */}
              <li className="nav-item">
                <Link className="btn btn-outline-primary rounded-pill me-2" to="/blogs/create">
                  <FaPlusCircle /> {/* Biểu tượng dấu cộng */}
                </Link>
              </li>
              {/* Nút Logout */}
              <li className="nav-item">
                <button className="btn btn-outline-danger rounded-pill" onClick={handleLogout}>
                  <FaPowerOff /> {/* Biểu tượng nút nguồn */}
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
