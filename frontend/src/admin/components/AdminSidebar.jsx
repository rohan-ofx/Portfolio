import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT access token
    localStorage.removeItem("accessToken");

    // Redirect to admin login
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="admin-sidebar-nav">
        <button onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/admin/projects")}>
          Projects
        </button>

        <button onClick={() => navigate("/admin/skills")}>
          Skills
        </button>

        <button onClick={() => navigate("/admin/experience")}>
          Experience
        </button>

        <button onClick={() => navigate("/admin/education")}>
          Education
        </button>

        <button onClick={() => navigate("/admin/certifications")}>
          Certifications
        </button>

        <button onClick={() => navigate("/admin/achievements")}>
          Achievements
        </button>

        <button onClick={() => navigate("/admin/coding")}>
          Coding Profiles
        </button>

        <button onClick={() => navigate("/admin/messages")}>
          Messages
        </button>

        <button onClick={() => navigate("/admin/settings")}>
          Site Settings
        </button>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;