import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import AdminApp from "@/App";
import UserApp from "@user/UserApp";

/**
 * Điểm vào chung: gộp khu vực người dùng (public, "/") và khu vực quản trị ("/admin/*").
 * AuthProvider nâng lên trên router để cả 2 khu vực dùng chung phiên đăng nhập.
 * AdminApp tự lo guard vai trò bằng <ProtectedRoute> bên trong.
 */
export default function RootApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<UserApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
