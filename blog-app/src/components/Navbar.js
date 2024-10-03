import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaPowerOff, FaSearch } from 'react-icons/fa'; // Nhập biểu tượng từ react-icons
import './Navbar.css';

function Navbar() {
  // Khởi tạo state để quản lý giá trị nhập vào của ô tìm kiếm
  const [searchTerm, setSearchTerm] = useState(''); 
  
  // useNavigate là một hook trong react-router-dom, dùng để điều hướng người dùng đến một route khác
  const navigate = useNavigate(); 
  
  // Lấy thông tin người dùng đã đăng nhập từ localStorage (nếu có)
  const user = JSON.parse(localStorage.getItem('user')); 

  // Hàm handleSearch dùng để xử lý việc tìm kiếm khi người dùng nhấn Enter hoặc nút tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (không tải lại trang)
    
    // Nếu ô tìm kiếm không trống, điều hướng tới trang tìm kiếm với từ khóa được nhập
    if (searchTerm.trim()) {
      navigate(`/blogs/search?keyword=${searchTerm.trim()}`); // Điều hướng tới trang kết quả tìm kiếm với từ khóa
      setSearchTerm(''); // Xóa nội dung ô tìm kiếm sau khi tìm kiếm
    }
  };

  // Hàm handleLogout dùng để xử lý khi người dùng nhấn nút đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage (đăng xuất)
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  return (
    // Tạo thanh điều hướng với Bootstrap, giao diện tối (navbar-dark bg-dark)
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark"> 
      
      {/* Logo hoặc tên thương hiệu, điều hướng tới trang chủ ("/blogs") */}
      <Link className="navbar-brand" to="/blogs">Blog App</Link> 

      <div className="collapse navbar-collapse">
        
        {/* Form tìm kiếm nằm ở giữa thanh navbar, thực hiện tìm kiếm khi submit */}
        <form className="form-inline mx-auto" onSubmit={handleSearch}>
          {/* Sử dụng Bootstrap input group để tạo ô tìm kiếm */}
          <div className="input-group" style={{ width: '500px' }}> {/* Đặt chiều dài của thanh tìm kiếm là 500px */}
            <input
              className="form-control rounded-pill me-2" // Bo tròn các góc của ô tìm kiếm bằng Bootstrap (rounded-pill)
              type="search" // Loại input là tìm kiếm
              placeholder="Search" // Văn bản hiển thị mặc định trong ô tìm kiếm
              aria-label="Search" // Cung cấp mô tả cho ô tìm kiếm cho các công cụ hỗ trợ (accessibility)
              value={searchTerm} // Giá trị hiện tại của ô tìm kiếm
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị khi người dùng gõ vào ô tìm kiếm
            />
            <button className="btn btn-outline-success rounded-pill" type="submit"> {/* Nút tìm kiếm */}
              <FaSearch /> {/* Biểu tượng tìm kiếm từ react-icons */}
            </button>
          </div>
        </form>

        {/* Phần điều hướng bên phải của thanh navbar */}
        <ul className="navbar-nav ml-auto">
          
          {/* Nếu user đã đăng nhập (kiểm tra bằng cách xem có đối tượng user hay không) */}
          {user ? (
            <>
              {/* Hiển thị tên người dùng đã đăng nhập */}
              <li className="nav-item">
                <span className="nav-link text-white">Hello, {user.username}</span> {/* Tên người dùng */}
              </li>
              
              {/* Nút để tạo bài viết mới, có biểu tượng dấu cộng (plus) */}
              <li className="nav-item">
                <Link className="btn btn-outline-primary rounded-pill me-2" to="/blogs/create">
                  <FaPlusCircle /> {/* Biểu tượng dấu cộng */}
                </Link>
              </li>
              
              {/* Nút đăng xuất, khi nhấn sẽ gọi hàm handleLogout */}
              <li className="nav-item">
                <button className="btn btn-outline-danger rounded-pill" onClick={handleLogout}>
                  <FaPowerOff /> {/* Biểu tượng nút nguồn (đăng xuất) */}
                </button>
              </li>
            </>
          ) : (
            // Nếu user chưa đăng nhập, hiển thị liên kết tới trang đăng nhập
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link> {/* Nút đăng nhập */}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
