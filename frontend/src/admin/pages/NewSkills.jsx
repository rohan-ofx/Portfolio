
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api.js";
import "./Skill.css";

const NewSkill = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
    icon: "",
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setLoading(true);

      await api.post("/skills", {
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
        level: formData.level.trim(),
        icon: formData.icon.trim(),
      });

      navigate("/admin/skills");
    } catch (err) {
      console.error("Create Skill Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create skill. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-skill-page">
      <div className="new-skill-glow new-skill-glow-one" />
      <div className="new-skill-glow new-skill-glow-two" />

      <header className="new-skill-header">
        <div className="new-skill-heading">
          <span className="new-skill-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Add New Skill</h1>

          <p>
            Add a technical skill to your portfolio and organize it
            by category.
          </p>
        </div>

        <Link to="/admin/skills" className="new-skill-back">
          <span aria-hidden="true">←</span>
          Back to Skills
        </Link>
      </header>

      <section className="new-skill-card">
        <div className="new-skill-card-heading">
          <div className="new-skill-card-icon" aria-hidden="true">
            +
          </div>

          <div>
            <h2>Skill Details</h2>
            <p>Enter the information you want to display.</p>
          </div>
        </div>

        {error && (
          <div className="new-skill-error" role="alert">
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="new-skill-form">
          <div className="new-skill-form-grid">
            <div className="new-skill-field">
              <label htmlFor="skill-name">
                Skill Name <span>*</span>
              </label>

              <input
                id="skill-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Java"
                autoComplete="off"
                required
              />

              <small>The name of your technical skill.</small>
            </div>

            <div className="new-skill-field">
              <label htmlFor="skill-category">
                Category <span>*</span>
              </label>

              <input
                id="skill-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Programming Language"
                required
              />

              <small>Group similar skills together.</small>
            </div>

            <div className="new-skill-field">
              <label htmlFor="skill-level">Proficiency Level</label>

              <select
                id="skill-level"
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

            <div className="new-skill-field">
              <label htmlFor="skill-icon">Icon Identifier</label>

              <input
                id="skill-icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. java"
              />

              <small>
                Optional. Use the format expected by your frontend.
              </small>
            </div>

            <div className="new-skill-field new-skill-order-field">
              <label htmlFor="skill-order">Display Order</label>

              <input
                id="skill-order"
                name="order"
                type="number"
                min="0"
                step="1"
                value={formData.order}
                onChange={handleChange}
              />

              <small>
                Lower numbers can appear earlier if your API sorts by order.
              </small>
            </div>
          </div>

          <div className="new-skill-form-footer">
            <p>
              <span>*</span> Required fields
            </p>

            <div className="new-skill-actions">
              <Link
                to="/admin/skills"
                className="new-skill-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="new-skill-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="new-skill-spinner" />
                    Saving Skill...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">+</span>
                    Create Skill
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      <p className="new-skill-footer-note">
        Your skill will be saved to the portfolio database.
      </p>
    </main>
  );
};

export default NewSkill;
