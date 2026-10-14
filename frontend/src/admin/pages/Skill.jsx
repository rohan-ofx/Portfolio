
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./Skill.css";

const Skills = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/skills");
      setSkills(response.data.data || []);
    } catch (err) {
      console.error("Fetch Skills Error:", err);
      setError(
        err.response?.data?.message || "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/skills/${id}`);
      setSkills((previous) => previous.filter((skill) => skill._id !== id));
    } catch (err) {
      console.error("Delete Skills Error:", err);
      setError(
        err.response?.data?.message || "Failed to delete skill."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="skills-admin-page">
      <header className="skills-admin-header">
        <div>
          <span className="skills-admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>
          <h1>Skills</h1>
          <p>Manage and organize the skills displayed on your portfolio.</p>
        </div>

        <button
          type="button"
          className="skills-add-btn"
          onClick={() => navigate("/admin/skills/new")}
        >
          <span aria-hidden="true">＋</span> Add Skill
        </button>
      </header>

      <section className="skills-summary">
        <div className="skills-summary-icon" aria-hidden="true">
          ✦
        </div>
        <div>
          <span>Total skills</span>
          <strong>{loading ? "—" : skills.length}</strong>
        </div>
        <p>Skills currently stored in your portfolio.</p>
      </section>

      {error && (
        <div className="skills-alert" role="alert">
          <span aria-hidden="true">!</span>
          <p>{error}</p>
          <button type="button" onClick={fetchSkills}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="skills-state">
          <span className="skills-spinner" />
          <p>Loading skills...</p>
        </div>
      ) : !error && skills.length === 0 ? (
        <div className="skills-empty">
          <div className="skills-empty-icon" aria-hidden="true">✦</div>
          <h2>No skills added yet</h2>
          <p>Add your first skill to start building your portfolio.</p>
          <button
            type="button"
            className="skills-add-btn"
            onClick={() => navigate("/admin/skills/new")}
          >
            ＋ Add your first skill
          </button>
        </div>
      ) : (
        !error && (
          <section className="skills-table-card">
            <div className="skills-table-heading">
              <div>
                <h2>Your skills</h2>
                <p>Review, update or remove a skill.</p>
              </div>
              <span className="skills-count-badge">
                {skills.length} {skills.length === 1 ? "skill" : "skills"}
              </span>
            </div>

            <div className="skills-table-wrapper">
              <table className="skills-table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th className="skills-actions-heading">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill._id}>
                      <td>
                        <div className="skills-name-cell">
                          <span className="skills-name-icon" aria-hidden="true">
                            {skill.name?.charAt(0)?.toUpperCase() || "S"}
                          </span>
                          <strong>{skill.name}</strong>
                        </div>
                      </td>

                      <td>
                        <span className="skills-category">
                          {skill.category || "Uncategorized"}
                        </span>
                      </td>

                      <td>
                        <span className="skills-level">
                          {skill.level || "Not specified"}
                        </span>
                      </td>

                      <td>
                        <div className="skills-row-actions">
                          <button
                            type="button"
                            className="skills-edit-btn"
                            onClick={() =>
                              navigate(`/admin/skills/edit/${skill._id}`)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="skills-delete-btn"
                            disabled={deletingId === skill._id}
                            onClick={() => handleDelete(skill._id)}
                          >
                            {deletingId === skill._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      )}
    </main>
  );
};

export default Skills;
