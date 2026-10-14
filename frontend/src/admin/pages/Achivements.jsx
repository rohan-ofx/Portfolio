import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Edit3,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  X,
  RefreshCw,
  LoaderCircle,
} from "lucide-react";

import api from "../../services/api.js";
import "./Achievements.css";

const Achievements = () => {
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [achievementToDelete, setAchievementToDelete] = useState(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/achivements");
      const data = response.data?.data;

      setAchievements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Achievements Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load achievements. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const categories = useMemo(() => {
    const values = achievements
      .map((item) => item.category?.trim())
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return achievements.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [achievements, search, categoryFilter]);

  const handleDelete = async () => {
    if (!achievementToDelete) return;

    const id = achievementToDelete._id;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/achivements/${id}`);

      setAchievements((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setAchievementToDelete(null);
      setSuccess("Achievement deleted successfully.");
    } catch (err) {
      console.error("Delete Achievement Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete achievement. Please try again."
      );
      setAchievementToDelete(null);
    } finally {
      setDeletingId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="admin-page achievements-page">
      <div className="achievements-glow achievements-glow-one" />
      <div className="achievements-glow achievements-glow-two" />

      <header className="achievements-header">
        <div className="achievements-heading">
          <div className="achievements-eyebrow">
            <Sparkles size={14} />
            <span>PORTFOLIO MANAGEMENT</span>
          </div>

          <h1>Achievements</h1>

          <p>
            Manage your milestones, accomplishments, and recognitions.
          </p>
        </div>

        <button
          type="button"
          className="achievements-add-btn"
          onClick={() => navigate("/admin/achievements/new")}
        >
          <Plus size={18} />
          <span>Add Achievement</span>
        </button>
      </header>

      <section className="achievements-stats">
        <article className="achievements-stat-card">
          <div className="achievements-stat-icon">
            <Trophy size={21} />
          </div>
          <div>
            <span>Total achievements</span>
            <strong>{achievements.length}</strong>
          </div>
        </article>

        <article className="achievements-stat-card">
          <div className="achievements-stat-icon achievements-stat-icon-alt">
            <Award size={21} />
          </div>
          <div>
            <span>Categories</span>
            <strong>{categories.length - 1}</strong>
          </div>
        </article>

        <article className="achievements-stat-card">
          <div className="achievements-stat-icon achievements-stat-icon-green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Matching results</span>
            <strong>{filteredAchievements.length}</strong>
          </div>
        </article>
      </section>

      {error && (
        <div className="achievements-alert achievements-alert-error" role="alert">
          <CircleAlert size={19} />
          <span>{error}</span>

          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div
          className="achievements-alert achievements-alert-success"
          role="status"
        >
          <CheckCircle2 size={18} />
          <span>{success}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setSuccess("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      <section className="achievements-content">
        <div className="achievements-toolbar">
          <div className="achievements-toolbar-title">
            <h2>Your achievements</h2>
            <p>Search, review, and manage your records.</p>
          </div>

          <button
            type="button"
            className="achievements-refresh-btn"
            onClick={fetchAchievements}
            disabled={loading}
            aria-label="Refresh achievements"
            title="Refresh achievements"
          >
            <RefreshCw
              size={16}
              className={loading ? "achievements-refreshing" : ""}
            />
            <span>Refresh</span>
          </button>
        </div>

        <div className="achievements-filters">
          <div className="achievements-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search achievements..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search achievements"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="achievements-category-filter">
            <label htmlFor="achievement-category">Category</label>
            <select
              id="achievement-category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="achievements-state">
            <LoaderCircle
              size={30}
              className="achievements-loading-spinner"
            />
            <h3>Loading achievements</h3>
            <p>Retrieving your achievement records...</p>
          </div>
        ) : error && achievements.length === 0 ? (
          <div className="achievements-state">
            <div className="achievements-empty-icon">
              <CircleAlert size={28} />
            </div>
            <h3>Unable to load achievements</h3>
            <p>Check your API connection and try again.</p>
            <button
              type="button"
              className="achievements-secondary-btn"
              onClick={fetchAchievements}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : achievements.length === 0 ? (
          <div className="achievements-state">
            <div className="achievements-empty-icon">
              <Trophy size={29} />
            </div>
            <h3>No achievements yet</h3>
            <p>
              Add your first accomplishment to showcase it on your portfolio.
            </p>
            <button
              type="button"
              className="achievements-add-btn"
              onClick={() => navigate("/admin/achievements/new")}
            >
              <Plus size={17} />
              Add your first achievement
            </button>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="achievements-state">
            <div className="achievements-empty-icon">
              <Search size={27} />
            </div>
            <h3>No matching achievements</h3>
            <p>Try a different search term or category.</p>
            <button
              type="button"
              className="achievements-secondary-btn"
              onClick={() => {
                setSearch("");
                setCategoryFilter("All");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="achievements-table-wrap">
              <table className="achievements-table">
                <thead>
                  <tr>
                    <th>Achievement</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th className="achievements-actions-heading">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAchievements.map((achievement) => (
                    <tr key={achievement._id}>
                      <td>
                        <div className="achievement-title-cell">
                          <div className="achievement-row-icon">
                            <Award size={19} />
                          </div>

                          <div className="achievement-title-content">
                            <strong>{achievement.title}</strong>
                            {achievement.description && (
                              <span>{achievement.description}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="achievement-category-badge">
                          {achievement.category || "Uncategorized"}
                        </span>
                      </td>

                      <td>
                        <div className="achievement-date-cell">
                          <CalendarDays size={15} />
                          <span>{formatDate(achievement.date)}</span>
                        </div>
                      </td>

                      <td>
                        <div className="achievement-row-actions">
                          <button
                            type="button"
                            className="achievement-edit-btn"
                            onClick={() =>
                              navigate(
                                `/admin/achievements/edit/${achievement._id}`
                              )
                            }
                            aria-label={`Edit ${achievement.title}`}
                            title="Edit achievement"
                          >
                            <Edit3 size={16} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="achievement-delete-btn"
                            onClick={() =>
                              setAchievementToDelete(achievement)
                            }
                            disabled={deletingId === achievement._id}
                            aria-label={`Delete ${achievement.title}`}
                            title="Delete achievement"
                          >
                            {deletingId === achievement._id ? (
                              <LoaderCircle
                                size={16}
                                className="achievements-loading-spinner"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="achievements-table-footer">
              <span>
                Showing <strong>{filteredAchievements.length}</strong> of{" "}
                <strong>{achievements.length}</strong> achievements
              </span>
              <span className="achievements-secure-note">
                <ShieldCheck size={15} />
                Portfolio records
              </span>
            </footer>
          </>
        )}
      </section>

      {achievementToDelete && (
        <div
          className="achievement-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingId) {
              setAchievementToDelete(null);
            }
          }}
        >
          <section
            className="achievement-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-delete-title"
          >
            <div className="achievement-delete-modal-icon">
              <Trash2 size={24} />
            </div>

            <h2 id="achievement-delete-title">Delete achievement?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{achievementToDelete.title}</strong>? This action
              cannot be undone.
            </p>

            <div className="achievement-delete-modal-actions">
              <button
                type="button"
                className="achievement-modal-cancel"
                onClick={() => setAchievementToDelete(null)}
                disabled={Boolean(deletingId)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="achievement-modal-confirm"
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="achievements-loading-spinner"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete achievement
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Achievements;