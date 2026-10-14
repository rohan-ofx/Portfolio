
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./AdminAuth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...registrationData } = formData;

      await api.post("/users/register", registrationData);

      navigate("/admin/login", {
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      console.error("Registration Error:", err);

      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-showcase register-showcase">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark">R</span>
            <span>ROHAN<span className="auth-brand-light">.DEV</span></span>
          </Link>

          <div className="showcase-content">
            <span className="eyebrow">
              <span className="status-dot" />
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h1>
              Build with
              <br />
              purpose.
              <br />
              <span>Manage with clarity.</span>
            </h1>

            <p>
              Create your workspace and bring every part
              of your professional journey together.
            </p>

            <div className="register-feature-list">
              <div><span>01</span><p>Manage your projects</p><b>↗</b></div>
              <div><span>02</span><p>Showcase your skills</p><b>↗</b></div>
              <div><span>03</span><p>Keep your portfolio updated</p><b>↗</b></div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>YOUR SPACE. YOUR STORY.</span>
            <span>© {new Date().getFullYear()} Rohan Singh</span>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-wrap register-form-wrap">
            <div className="mobile-brand">
              <span className="auth-brand-mark">R</span>
              <span>ROHAN<span className="auth-brand-light">.DEV</span></span>
            </div>

            <div className="auth-heading">
              <span className="form-kicker">INITIAL SETUP</span>
              <h2>Create your account<span>.</span></h2>
              <p>Set up your credentials to access the workspace.</p>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-email">Email address</label>
                <input
                  id="register-email"
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
                <label htmlFor="register-password">Password</label>
                <div className="password-control">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    minLength={8}
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

              <div className="auth-field">
                <label htmlFor="confirm-password">Confirm password</label>
                <div className="password-control">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter password again"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Creating account..." : "Create account"}</span>
                {!loading && <span className="submit-arrow">↗</span>}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <span>ACCOUNT ACCESS</span>
              <span />
            </div>

            <p className="auth-switch">
              Already have an account?
              {" "}
              <Link to="/admin/login">Sign in <span>↗</span></Link>
            </p>

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

export default Register;
