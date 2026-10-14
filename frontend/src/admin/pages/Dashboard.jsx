
import { useEffect, useState } from "react";
import api from "../../services/api.js";
import "./AdminAuth.css";

const dashboardItems = [
  {
    key: "projects",
    label: "Total Projects",
    icon: "⌘",
    description: "Portfolio projects",
    color: "violet",
  },
  {
    key: "skills",
    label: "Skills",
    icon: "✳",
    description: "Technical expertise",
    color: "blue",
  },
  {
    key: "experience",
    label: "Experience",
    icon: "◷",
    description: "Career experience",
    color: "orange",
  },
  {
    key: "education",
    label: "Education",
    icon: "▤",
    description: "Academic records",
    color: "cyan",
  },
  {
    key: "certifications",
    label: "Certifications",
    icon: "✧",
    description: "Courses and credentials",
    color: "pink",
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: "♜",
    description: "Milestones and awards",
    color: "gold",
  },
  {
    key: "codingProfiles",
    label: "Coding Profiles",
    icon: "</>",
    description: "Developer platforms",
    color: "green",
  },
  {
    key: "messages",
    label: "Messages",
    icon: "✉",
    description: "Portfolio enquiries",
    color: "purple",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        setStats(response.data.data);
      } catch (error) {
        console.error("Dashboard API Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <main className="admin-dashboard">
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />

      <div className="dashboard-content">
        {/* Page heading */}
        <header className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">
              <span className="dashboard-live-dot" />
              ADMIN WORKSPACE
            </div>

            <h1>
              Dashboard<span className="dashboard-title-dot">.</span>
            </h1>

            <p>
              Manage your portfolio, track your content, and keep
              everything up to date.
            </p>
          </div>

          <div className="dashboard-header-badge">
            <span className="dashboard-header-icon">✦</span>
            <div>
              <strong>Portfolio Admin</strong>
              <span>Management overview</span>
            </div>
          </div>
        </header>

        {/* Overview banner */}
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-content">
            <span className="dashboard-welcome-label">
              YOUR WORKSPACE
            </span>

            <h2>Everything in one place.</h2>

            <p>
              Your portfolio at a glance. Keep your projects,
              skills, and achievements organized.
            </p>
          </div>

          <div className="dashboard-orbit" aria-hidden="true">
            <div className="dashboard-orbit-ring dashboard-orbit-ring-one" />
            <div className="dashboard-orbit-ring dashboard-orbit-ring-two" />
            <div className="dashboard-orbit-core">R</div>
            <span className="dashboard-orbit-star">✦</span>
            <span className="dashboard-orbit-spark">✧</span>
          </div>
        </section>

        {/* Statistics section */}
        <section className="dashboard-overview">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-kicker">
                PERFORMANCE OVERVIEW
              </span>
              <h2>Portfolio statistics</h2>
              <p>A quick overview of your portfolio content.</p>
            </div>

            <span className="dashboard-stats-count">
              08 CATEGORIES
            </span>
          </div>

          {loading ? (
            <div
              className="dashboard-stats dashboard-stats-loading"
              aria-label="Loading dashboard statistics"
              aria-busy="true"
            >
              {dashboardItems.map((item) => (
                <div className="dashboard-card dashboard-skeleton" key={item.key}>
                  <div className="skeleton-line skeleton-icon" />
                  <div className="skeleton-line skeleton-label" />
                  <div className="skeleton-line skeleton-number" />
                  <div className="skeleton-line skeleton-description" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="dashboard-state dashboard-error">
              <div className="dashboard-state-icon">!</div>

              <div>
                <h3>Unable to load statistics</h3>
                <p>{error}</p>
                <button
                  type="button"
                  className="dashboard-retry-button"
                  onClick={() => window.location.reload()}
                >
                  Try again ↗
                </button>
              </div>
            </div>
          ) : (
            <div className="dashboard-stats">
              {dashboardItems.map((item, index) => (
                <article
                  className={`dashboard-card dashboard-card-${item.color}`}
                  key={item.key}
                  style={{ "--card-index": index }}
                >
                  <div className="dashboard-card-top">
                    <div className="dashboard-card-icon">
                      {item.icon}
                    </div>

                    <span className="dashboard-card-index">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="dashboard-card-info">
                    <span className="dashboard-card-label">
                      {item.label}
                    </span>

                    <h3>
                      {stats?.[item.key] ?? 0}
                    </h3>

                    <p>{item.description}</p>
                  </div>

                  <div className="dashboard-card-bottom">
                    <span className="dashboard-card-indicator" />
                    <span>Current total</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer note */}
        {!loading && !error && (
          <footer className="dashboard-footer">
            <div className="dashboard-footer-mark">✦</div>

            <p>
              <strong>Keep building.</strong>{" "}
              Every update makes your portfolio better.
            </p>

            <span className="dashboard-footer-status">
              <span />
              Workspace ready
            </span>
          </footer>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
