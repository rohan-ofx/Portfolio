
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api.js";
import "./Experience.css";

const NewExperience = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: "",
    isCurrent: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.role.trim() || !formData.company.trim()) {
      setError("Role and company are required.");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      !formData.isCurrent &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        role: formData.role.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        endDate: formData.isCurrent ? "" : formData.endDate,
      };

      await api.post("/experience", payload);

      navigate("/admin/experience");
    } catch (err) {
      console.error("Create Experience Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create experience. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-experience-page">
      <div className="new-experience-glow new-experience-glow-one" />
      <div className="new-experience-glow new-experience-glow-two" />

      <header className="new-experience-header">
        <div>
          <span className="new-experience-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Add Experience</h1>

          <p>
            Add an internship or professional role to your portfolio.
          </p>
        </div>

        <Link
          to="/admin/experience"
          className="new-experience-back"
        >
          <span aria-hidden="true">←</span>
          Back to Experience
        </Link>
      </header>

      <section className="new-experience-card">
        <div className="new-experience-card-heading">
          <div className="new-experience-card-icon" aria-hidden="true">
            ✦
          </div>

          <div>
            <h2>Experience Details</h2>
            <p>Enter the role, dates, and details you want to showcase.</p>
          </div>
        </div>

        {error && (
          <div className="new-experience-error" role="alert">
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="new-experience-form">
          <div className="new-experience-section-title">
            <span>01</span>
            <h3>Role Information</h3>
          </div>

          <div className="new-experience-grid">
            <div className="new-experience-field">
              <label htmlFor="experience-role">
                Role / Job Title <span>*</span>
              </label>

              <input
                id="experience-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Software Engineering Intern"
                autoComplete="organization-title"
                required
              />
            </div>

            <div className="new-experience-field">
              <label htmlFor="experience-company">
                Company <span>*</span>
              </label>

              <input
                id="experience-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                autoComplete="organization"
                required
              />
            </div>

            <div className="new-experience-field">
              <label htmlFor="experience-location">Location</label>

              <input
                id="experience-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kolkata, India"
              />
            </div>

            <div className="new-experience-field">
              <label htmlFor="experience-employmentType">
                Employment Type
              </label>

              <select
                id="experience-employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="new-experience-section-title new-experience-section-spaced">
            <span>02</span>
            <h3>Duration</h3>
          </div>

          <div className="new-experience-grid">
            <div className="new-experience-field">
              <label htmlFor="experience-startDate">Start Date</label>

              <input
                id="experience-startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                max={
                  !formData.isCurrent && formData.endDate
                    ? formData.endDate
                    : undefined
                }
                onChange={handleChange}
              />
            </div>

            <div className="new-experience-field">
              <label htmlFor="experience-endDate">End Date</label>

              <input
                id="experience-endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                min={formData.startDate || undefined}
                onChange={handleChange}
                disabled={formData.isCurrent}
              />

              {formData.isCurrent && (
                <small>
                  End date is disabled for a current role.
                </small>
              )}
            </div>

            <label className="new-experience-current">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
              />

              <span className="new-experience-checkmark" />

              <span className="new-experience-current-text">
                <strong>I currently work here</strong>
                <small>Mark this if the role is ongoing.</small>
              </span>
            </label>
          </div>

          <div className="new-experience-section-title new-experience-section-spaced">
            <span>03</span>
            <h3>Responsibilities & Skills</h3>
          </div>

          <div className="new-experience-grid new-experience-grid-single">
            <div className="new-experience-field">
              <label htmlFor="experience-technologies">
                Technologies
              </label>

              <input
                id="experience-technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js"
              />

              <small>Separate each technology with a comma.</small>
            </div>

            <div className="new-experience-field">
              <label htmlFor="experience-description">
                Description
              </label>

              <textarea
                id="experience-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your responsibilities, contributions, and achievements..."
              />

              <small>
                Focus on what you worked on and what you accomplished.
              </small>
            </div>
          </div>

          <div className="new-experience-form-footer">
            <p>
              <span>*</span> Required fields
            </p>

            <div className="new-experience-actions">
              <Link
                to="/admin/experience"
                className="new-experience-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="new-experience-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="new-experience-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">+</span>
                    Create Experience
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      <p className="new-experience-footer-note">
        Your experience details will be saved to the portfolio database.
      </p>
    </main>
  );
};

export default NewExperience;
