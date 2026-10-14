import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin.jsx";
import EditProject from "./pages/EditProject.jsx";

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/projects/edit/:id" element={<EditProject/>} />
    </Routes>
  );
};

export default AdminApp;