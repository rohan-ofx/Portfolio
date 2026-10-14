
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./Experience.css";

const Experience = () => {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/experience");
      setExperiences(response.data.data || []);
    } catch (err) {
      console.error("Fetch Experiences Error:", err);
      setError(
        err.response?.data?.message || "Failed to load experiences."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/experience/${id}`);

      setExperiences((previous) =>
        previous.filter((experience) => experience._id !== id)
      );
    } catch (err) {
      console.error("Delete Experience Error:", err);
      setError(
        err.response?.data?.message || "Failed to delete experience."
      );
    }
  };

  return (
    <main className="experience-page">
      <div className="experience-glow experience-glow-one" />
      <div className="experience-glow experience-glow-two" />

      <header className="experience-header">
        <div className="experience-heading">
          <span className="experience-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Experience</h1>

          <p>
            Manage your professional experience, internships, and roles.
          </p>
        </div>

        <button
          type="button"
          className="experience-add-button"
          onClick={() => navigate("/admin/experience/new")}
        >
          <span aria-hidden="true">+</span>
          Add Experience
        </button>
      </header>

      <section className="experience-summary">
        <div className="experience-summary-icon" aria-hidden="true">
          <span>✦</span>
        </div>

        <div>
          <p className="experience-summary-label">Total Entries</p>
          <h2>{loading ? "—" : experiences.length}</h2>
        </div>

        <span className="experience-summary-note">
          Professional journey
        </span>
      </section>

      {error && (
        <div className="experience-error" role="alert">
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>

          <button type="button" onClick={fetchExperiences}>
            Try Again
          </button>
        </div>
      )}

      <section className="experience-list-card">
        <div className="experience-list-header">
          <div>
            <h2>Experience Entries</h2>
            <p>View and manage your saved experience details.</p>
          </div>

          {!loading && (
            <span className="experience-count">
              {experiences.length}{" "}
              {experiences.length === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="experience-state">
            <span className="experience-spinner" />
            <p>Loading experiences...</p>
          </div>
        ) : error ? (
          <div className="experience-state">
            <p>Experience data could not be loaded.</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="experience-empty">
            <div className="experience-empty-icon" aria-hidden="true">
              ✦
            </div>

            <h3>No experience entries yet</h3>

            <p>
              You can add an internship or professional role when you have
              one to include.
            </p>

            <button
              type="button"
              className="experience-add-button"
              onClick={() => navigate("/admin/experience/new")}
            >
              <span aria-hidden="true">+</span>
              Add Experience
            </button>
          </div>
        ) : (
          <div className="experience-table-wrapper">
            <table className="experience-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {experiences.map((experience) => (
                  <tr key={experience._id}>
                    <td>
                      <div className="experience-role-cell">
                        <span className="experience-role-icon" aria-hidden="true">
                          ✦
                        </span>

                        <span>{experience.role}</span>
                      </div>
                    </td>

                    <td>{experience.company}</td>

                    <td>
                      <span className="experience-location">
                        {experience.location || "—"}
                      </span>
                    </td>

                    <td>
                      <div className="experience-row-actions">
                        <button
                          type="button"
                          className="experience-edit-button"
                          onClick={() =>
                            navigate(
                              `/admin/experience/edit/${experience._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="experience-delete-button"
                          onClick={() => handleDelete(experience._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default Experience;
