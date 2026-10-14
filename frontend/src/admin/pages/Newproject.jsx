
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./NewProject.css";

const Newproject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
        image: formData.image.trim(),
        githubUrl: formData.githubUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
      };

      await api.post("/projects", payload);

      navigate("/admin/projects");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="project-form-page">
      <header className="project-form-header">
        <div>
          <span className="project-form-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>
          <h1>Create a Project</h1>
          <p>
            Showcase your work by adding the project details below.
          </p>
        </div>

        <button
          type="button"
          className="project-back-btn"
          onClick={() => navigate("/admin/projects")}
        >
          <span aria-hidden="true">←</span> All Projects
        </button>
      </header>

      <form className="project-form" onSubmit={handleSubmit}>
        <div className="project-form-intro">
          <div className="project-form-icon" aria-hidden="true">
            +
          </div>
          <div>
            <h2>Project Information</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        {error && (
          <div className="project-form-error" role="alert">
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <div className="project-form-grid">
          <label className="project-field project-field-full">
            <span>Project title <b>*</b></span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Job & Resume Assistant"
              required
              maxLength={120}
            />
          </label>

          <label className="project-field project-field-full">
            <span>Description <b>*</b></span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What does your project do? Which problem does it solve?"
              required
              rows={5}
              maxLength={3000}
            />
            <small>{formData.description.length}/3000 characters</small>
          </label>

          <label className="project-field project-field-full">
            <span>Technologies <b>*</b></span>
            <input
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              required
            />
            <small>Separate each technology with a comma.</small>
          </label>

          <label className="project-field project-field-full">
            <span>Project image URL</span>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/project-image.png"
            />
          </label>

          <label className="project-field">
            <span>GitHub repository</span>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </label>

          <label className="project-field">
            <span>Live project URL</span>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://your-project.com"
            />
          </label>
        </div>

        <label className="project-featured-option">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span className="project-featured-copy">
            <strong>Featured project</strong>
            <small>Highlight this project on your portfolio homepage.</small>
          </span>
          <span className="project-featured-badge">FEATURED</span>
        </label>

        <footer className="project-form-actions">
          <button
            type="button"
            className="project-cancel-btn"
            onClick={() => navigate("/admin/projects")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="project-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="project-spinner" />
                Saving project...
              </>
            ) : (
              "Save Project →"
            )}
          </button>
        </footer>
      </form>
    </main>
  );
};

export default Newproject;
