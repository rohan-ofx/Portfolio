
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./AdminAuth.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const successMessage = location.state?.message;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await api.post("/users/login", formData);

      const { accessToken, refreshToken } = response.data.data;

        if (!accessToken || !refreshToken) {
        throw new Error("Access Token or Refresh Token was not returned.");
        }

localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);

navigate("/admin/dashboard");
      
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-showcase">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark">R</span>
            <span>ROHAN<span className="auth-brand-light">.DEV</span></span>
          </Link>

          <div className="showcase-content">
            <span className="eyebrow">
              <span className="status-dot" />
              PERSONAL PORTFOLIO · ADMIN
            </span>

            <h1>
              Your work.
              <br />
              Your vision.
              <br />
              <span>Your space.</span>
            </h1>

            <p>
              One place to manage your projects, skills,
              achievements and everything you're building.
            </p>

            <div className="showcase-art" aria-hidden="true">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-orbit orbit-three" />
              <div className="art-core">
                <span>R</span>
              </div>
              <span className="art-spark spark-one">✳</span>
              <span className="art-spark spark-two">✦</span>
            </div>
          </div>

          <div className="showcase-footer">
            <span>DESIGNED TO BUILD · BUILT TO GROW</span>
            <span>© {new Date().getFullYear()} Rohan Singh</span>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="mobile-brand">
              <span className="auth-brand-mark">R</span>
              <span>ROHAN<span className="auth-brand-light">.DEV</span></span>
            </div>

            <div className="auth-heading">
              <span className="form-kicker">ADMIN WORKSPACE</span>
              <h2>Welcome back<span>.</span></h2>
              <p>Sign in to continue managing your portfolio.</p>
            </div>

            {successMessage && (
              <div className="auth-alert auth-alert-success" role="status">
                <span>✓</span>
                {successMessage}
              </div>
            )}

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="auth-field">
                <div className="field-label-row">
                  <label htmlFor="login-password">Password</label>
                </div>

                <div className="password-control">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Signing you in..." : "Sign in to workspace"}</span>
                {!loading && <span className="submit-arrow">↗</span>}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <span>SECURE ACCESS</span>
              <span />
            </div>

            {/* <p className="auth-switch">
              First time setting things up?
              {" "}
              <Link to="/admin/register">Create account <span>↗</span></Link>
            </p> */}

            <div className="auth-security-note">
              <span className="security-icon">◇</span>
              <span>Private workspace · Authorized access only</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;
