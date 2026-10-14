
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api.js";
import "./Skill.css";

const EditSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
    icon: "",
    order: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [skillLoaded, setSkillLoaded] = useState(false);

  const fetchSkill = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSkillLoaded(false);

      const response = await api.get(`/skills/${id}`);
      const skill = response.data.data;

      if (!skill) {
        throw new Error("Skill data was not returned by the server.");
      }

      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        level: skill.level || "",
        icon: skill.icon || "",
        order: skill.order ?? 0,
      });

      setSkillLoaded(true);
    } catch (err) {
      console.error("Fetch Skill Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load skill."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "order" ? Number(value) : value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.category.trim()) {
      setError("Skill name and category are required.");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/skills/${id}`, {
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
        level: formData.level.trim(),
        icon: formData.icon.trim(),
      });

      navigate("/admin/skills");
    } catch (err) {
      console.error("Update Skill Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update skill. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-skill-page edit-skill-state">
        <span className="edit-skill-spinner" />
        <p>Loading skill details...</p>
      </main>
    );
  }

  if (!skillLoaded) {
    return (
      <main className="edit-skill-page">
        <section className="edit-skill-state-card">
          <div className="edit-skill-state-icon">!</div>
          <h1>Unable to Load Skill</h1>
          <p role="alert">
            {error || "The requested skill could not be found."}
          </p>

          <div className="edit-skill-state-actions">
            <button
              type="button"
              className="edit-skill-submit"
              onClick={fetchSkill}
            >
              Try Again
            </button>

            <Link to="/admin/skills" className="edit-skill-cancel">
              Back to Skills
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="edit-skill-page">
      <div className="edit-skill-glow edit-skill-glow-one" />
      <div className="edit-skill-glow edit-skill-glow-two" />

      <header className="edit-skill-header">
        <div>
          <span className="edit-skill-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Edit Skill</h1>

          <p>
            Update your skill information and how it appears in your portfolio.
          </p>
        </div>

        <Link to="/admin/skills" className="edit-skill-back">
          <span aria-hidden="true">←</span>
          Back to Skills
        </Link>
      </header>

      <section className="edit-skill-card">
        <div className="edit-skill-card-heading">
          <div className="edit-skill-card-icon" aria-hidden="true">
            ✎
          </div>

          <div>
            <h2>Skill Details</h2>
            <p>Make your changes below and save when you're ready.</p>
          </div>
        </div>

        {error && (
          <div className="edit-skill-error" role="alert">
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-skill-form">
          <div className="edit-skill-form-grid">
            <div className="edit-skill-field">
              <label htmlFor="edit-skill-name">
                Skill Name <span>*</span>
              </label>

              <input
                id="edit-skill-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Java"
                required
              />

              <small>The name of your technical skill.</small>
            </div>

            <div className="edit-skill-field">
              <label htmlFor="edit-skill-category">
                Category <span>*</span>
              </label>

              <input
                id="edit-skill-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Programming Language"
                required
              />

              <small>Organize your skill into a category.</small>
            </div>

            <div className="edit-skill-field">
              <label htmlFor="edit-skill-level">
                Proficiency Level
              </label>

              <select
                id="edit-skill-level"
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>

              <small>Choose your current skill level.</small>
            </div>

            <div className="edit-skill-field">
              <label htmlFor="edit-skill-icon">Icon Identifier</label>

              <input
                id="edit-skill-icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. java"
              />

              <small>
                Optional. Use the identifier expected by your frontend.
              </small>
            </div>

            <div className="edit-skill-field edit-skill-order-field">
              <label htmlFor="edit-skill-order">Display Order</label>

              <input
                id="edit-skill-order"
                name="order"
                type="number"
                min="0"
                step="1"
                value={formData.order}
                onChange={handleChange}
              />

              <small>
                Lower numbers appear first only if your API sorts by order.
              </small>
            </div>
          </div>

          <div className="edit-skill-form-footer">
            <p>
              <span>*</span> Required fields
            </p>

            <div className="edit-skill-actions">
              <Link to="/admin/skills" className="edit-skill-cancel">
                Cancel
              </Link>

              <button
                type="submit"
                className="edit-skill-submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="edit-skill-spinner" />
                    Updating...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✓</span>
                    Update Skill
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      <p className="edit-skill-footer-note">
        Your changes will be saved to the portfolio database.
      </p>
    </main>
  );
};

export default EditSkill;
