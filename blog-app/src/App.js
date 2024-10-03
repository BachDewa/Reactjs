import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
// `BrowserRouter` dùng để quản lý điều hướng trong ứng dụng React.
// `Routes` và `Route` để định nghĩa các đường dẫn (routes).
// `Navigate` để chuyển hướng người dùng.
// `useLocation` dùng để lấy thông tin URL hiện tại.

import Login from './pages/Login'; // Component trang đăng nhập.
import Register from './pages/Register'; // Component trang đăng ký.
import BlogList from './pages/BlogList'; // Component hiển thị danh sách blog.
import BlogCreate from './pages/BlogCreate'; // Component tạo blog mới.
import BlogDetail from './pages/BlogDetail'; // Component hiển thị chi tiết blog.
import BlogEdit from './pages/BlogEdit'; // Component chỉnh sửa blog.
import SearchResults from './pages/SearchResults'; // Component hiển thị kết quả tìm kiếm.
import Navbar from './components/Navbar'; // Component thanh điều hướng (Navbar).
import './App.css'; // Tệp CSS cho các kiểu dáng trong ứng dụng.

/**
 * PrivateRoute:
 * - Kiểm tra xem người dùng có đăng nhập hay chưa dựa trên localStorage.
 * - Nếu đã đăng nhập, cho phép truy cập vào các trang con (`children`).
 * - Nếu chưa đăng nhập, chuyển hướng về trang `/login`.
 */
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage.
  return user ? children : <Navigate to="/login" />; // Nếu có user, hiển thị `children`, ngược lại điều hướng về `/login`.
};

/**
 * Layout:
 * - Kiểm tra xem người dùng đang ở trang đăng nhập (`/login`) hoặc đăng ký (`/register`) hay không.
 * - Nếu không phải các trang này, hiển thị component `Navbar`.
 * - Hiển thị component con (`children`) trong ứng dụng.
 */
const Layout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại.
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'; // Kiểm tra xem đường dẫn hiện tại có phải là `/login` hoặc `/register` không.

  return (
    <>
      {/* Nếu không phải các trang đăng nhập hoặc đăng ký, hiển thị Navbar */}
      {!isAuthRoute && <Navbar />}
      {/* Hiển thị các component con (nội dung chính của mỗi trang) */}
      {children}
    </>
  );
};

/**
 * App Component:
 * - Component gốc của ứng dụng, quản lý tất cả các đường dẫn.
 * - Sử dụng `Router` để bao bọc tất cả các routes.
 */
function App() {
  return (
    <Router>
      {/* Sử dụng Layout để hiển thị hoặc ẩn `Navbar` tùy thuộc vào đường dẫn hiện tại */}
      <Layout>
        {/* Định nghĩa các đường dẫn trong ứng dụng */}
        <Routes>
          {/* Route trang đăng nhập */}
          <Route path="/login" element={<Login />} />
          
          {/* Route trang đăng ký */}
          <Route path="/register" element={<Register />} />

          {/* Route gốc, hiển thị `BlogList` nếu người dùng đã đăng nhập */}
          <Route path="/" element={<PrivateRoute><BlogList /></PrivateRoute>} />

          {/* Route hiển thị danh sách blog */}
          <Route path="/blogs" element={<PrivateRoute><BlogList /></PrivateRoute>} />

          {/* Route tạo blog mới */}
          <Route path="/blogs/create" element={<PrivateRoute><BlogCreate /></PrivateRoute>} />

          {/* Route hiển thị chi tiết blog theo `id` */}
          <Route path="/blogs/:id" element={<PrivateRoute><BlogDetail /></PrivateRoute>} />

          {/* Route chỉnh sửa blog theo `id` */}
          <Route path="/blogs/edit/:id" element={<PrivateRoute><BlogEdit /></PrivateRoute>} />

          {/* Route hiển thị kết quả tìm kiếm */}
          <Route path="/blogs/search" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
