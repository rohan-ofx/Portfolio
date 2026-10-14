import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api.js";
import "./Experience.css";

const initialFormData = {
  role: "",
  company: "",
  location: "",
  employmentType: "",
  startDate: "",
  endDate: "",
  description: "",
  technologies: "",
  isCurrent: false,
};

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const EditExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchExperience = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/experience/${id}`);
      const experience = response.data.data;

      if (!experience) {
        throw new Error("Experience data was not found.");
      }

      setFormData({
        role: experience.position || "",
        company: experience.company || "",
        location: experience.location || "",
        employmentType: experience.employmentType || "",
        startDate: toDateInput(experience.startDate),
        endDate: toDateInput(experience.endDate),
        description: experience.description || "",
        technologies: Array.isArray(experience.technologies)
          ? experience.technologies.join(", ")
          : "",
        isCurrent: Boolean(experience.current),
      });
    } catch (err) {
      console.error("Fetch Experience Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load experience. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const role = formData.role.trim();
    const company = formData.company.trim();
    const description = formData.description.trim();

    if (!role || !company || !formData.startDate || !description) {
      setError(
        "Role, company, start date and description are required."
      );
      return;
    }

    if (
      !formData.isCurrent &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    const technologies = formData.technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      role,
      company,
      location: formData.location.trim(),
      employmentType: formData.employmentType,
      startDate: formData.startDate,
      endDate: formData.isCurrent
        ? null
        : formData.endDate || null,
      description,
      technologies,
      isCurrent: formData.isCurrent,
    };

    try {
      setSaving(true);

      await api.put(`/experience/${id}`, payload);

      setSuccess("Experience updated successfully.");

      navigate("/admin/experience");
    } catch (err) {
      console.error("Update Experience Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update experience. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-experience-page">
        <div className="edit-experience-loading">
          <span className="edit-experience-spinner" />
          <h2>Loading experience</h2>
          <p>Fetching your experience details...</p>
        </div>
      </main>
    );
  }

  if (error && !formData.role && !formData.company) {
    return (
      <main className="edit-experience-page">
        <section className="edit-experience-error-state">
          <div className="edit-experience-state-icon">!</div>
          <h1>Unable to load experience</h1>
          <p>{error}</p>

          <div className="edit-experience-actions">
            <button
              type="button"
              className="edit-experience-btn edit-experience-btn-primary"
              onClick={fetchExperience}
            >
              Try again
            </button>

            <Link
              to="/admin/experience"
              className="edit-experience-btn edit-experience-btn-secondary"
            >
              Back to experience
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="edit-experience-page">
      <header className="edit-experience-header">
        <div className="edit-experience-heading">
          <Link
            to="/admin/experience"
            className="edit-experience-back-link"
          >
            <span aria-hidden="true">←</span>
            Back to experience
          </Link>

          <div className="edit-experience-title-row">
            <div className="edit-experience-title-icon">
              <span aria-hidden="true">✦</span>
            </div>

            <div>
              <p className="edit-experience-eyebrow">
                PORTFOLIO MANAGEMENT
              </p>
              <h1>Edit Experience</h1>
              <p className="edit-experience-subtitle">
                Update your professional experience and career details.
              </p>
            </div>
          </div>
        </div>

        <div className="edit-experience-header-badge">
          <span className="edit-experience-status-dot" />
          Editing entry
        </div>
      </header>

      <form
        className="edit-experience-form"
        onSubmit={handleSubmit}
      >
        {error && (
          <div
            className="edit-experience-alert edit-experience-alert-error"
            role="alert"
          >
            <span className="edit-experience-alert-icon">!</span>
            <p>{error}</p>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            className="edit-experience-alert edit-experience-alert-success"
            role="status"
          >
            {success}
          </div>
        )}

        <section className="edit-experience-card">
          <div className="edit-experience-section-heading">
            <div className="edit-experience-section-icon">01</div>
            <div>
              <h2>Role information</h2>
              <p>Enter your position and workplace details.</p>
            </div>
          </div>

          <div className="edit-experience-grid">
            <div className="edit-experience-field">
              <label htmlFor="role">
                Job title <span>*</span>
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer Intern"
                autoComplete="organization-title"
                required
              />
            </div>

            <div className="edit-experience-field">
              <label htmlFor="company">
                Company <span>*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Company name"
                autoComplete="organization"
                required
              />
            </div>

            <div className="edit-experience-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kolkata, India / Remote"
              />
            </div>

            <div className="edit-experience-field">
              <label htmlFor="employmentType">
                Employment type
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="">Select employment type</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </section>

        <section className="edit-experience-card">
          <div className="edit-experience-section-heading">
            <div className="edit-experience-section-icon">02</div>
            <div>
              <h2>Duration</h2>
              <p>Specify when this experience started and ended.</p>
            </div>
          </div>

          <div className="edit-experience-grid">
            <div className="edit-experience-field">
              <label htmlFor="startDate">
                Start date <span>*</span>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-experience-field">
              <label htmlFor="endDate">End date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                min={formData.startDate || undefined}
                onChange={handleChange}
                disabled={formData.isCurrent}
              />
              {formData.isCurrent && (
                <p className="edit-experience-field-hint">
                  End date is cleared while this role is ongoing.
                </p>
              )}
            </div>
          </div>

          <label className="edit-experience-current-toggle">
            <input
              type="checkbox"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={handleChange}
            />

            <span className="edit-experience-toggle-track">
              <span />
            </span>

            <span className="edit-experience-toggle-copy">
              <strong>I currently work here</strong>
              <small>
                Mark this if the experience is ongoing.
              </small>
            </span>
          </label>
        </section>

        <section className="edit-experience-card">
          <div className="edit-experience-section-heading">
            <div className="edit-experience-section-icon">03</div>
            <div>
              <h2>Responsibilities & skills</h2>
              <p>Describe your work and the technologies you used.</p>
            </div>
          </div>

          <div className="edit-experience-field">
            <label htmlFor="description">
              Description <span>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your responsibilities, contributions and achievements..."
              rows={6}
              required
            />
            <p className="edit-experience-field-hint">
              Keep it clear and focus on what you actually worked on.
            </p>
          </div>

          <div className="edit-experience-field edit-experience-technologies-field">
            <label htmlFor="technologies">Technologies</label>
            <input
              id="technologies"
              name="technologies"
              type="text"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
            <p className="edit-experience-field-hint">
              Separate each technology with a comma.
            </p>
          </div>
        </section>

        <footer className="edit-experience-form-footer">
          <p>
            Fields marked <span>*</span> are required.
          </p>

          <div className="edit-experience-actions">
            <Link
              to="/admin/experience"
              className="edit-experience-btn edit-experience-btn-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="edit-experience-btn edit-experience-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="edit-experience-btn-spinner" />
                  Saving changes...
                </>
              ) : (
                <>
                  Save changes
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </form>
    </main>
  );
};

export default EditExperience;
