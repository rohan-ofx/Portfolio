import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  CalendarDays,
  Building2,
  Link as LinkIcon,
  FileText,
  Tag,
  Save,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import api from "../../services/api.js";
import "./Achievements.css";

const NewAchievement = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    organization: "",
    description: "",
    credentialUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...formData,
        date: formData.date || null,
      };

      await api.post("/achivements", payload);

      navigate("/admin/achievements");
    } catch (err) {
      console.error("Create Achievement Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add achievement. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-achievement-page">
      <div className="achievement-page-top">
        <button
          type="button"
          className="achievement-back-btn"
          onClick={() => navigate("/admin/achievements")}
        >
          <ArrowLeft size={17} />
          <span>Back to Achievements</span>
        </button>

        <div className="achievement-breadcrumb">
          Admin <span>/</span> Achievements <span>/</span>{" "}
          <strong>New</strong>
        </div>
      </div>

      <header className="achievement-page-header">
        <div className="achievement-heading-icon">
          <Award size={28} />
        </div>

        <div className="achievement-heading-content">
          <div className="achievement-eyebrow">
            <Sparkles size={14} />
            PORTFOLIO MANAGEMENT
          </div>

          <h1>Add Achievement</h1>

          <p>
            Highlight your milestones, accomplishments, awards and
            recognitions.
          </p>
        </div>
      </header>

      <form
        className="achievement-form-card"
        onSubmit={handleSubmit}
      >
        <div className="achievement-form-card-header">
          <div>
            <h2>Achievement Details</h2>
            <p>
              Add the details you want to showcase on your portfolio.
            </p>
          </div>

          <span className="achievement-required-note">
            * Required
          </span>
        </div>

        {error && (
          <div className="achievement-form-error" role="alert">
            <span className="achievement-error-mark">!</span>
            <span>{error}</span>
          </div>
        )}

        <div className="achievement-form-grid">
          <div className="achievement-field achievement-field-full">
            <label htmlFor="title">
              <Award size={15} />
              Achievement Title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Hackathon Finalist"
              required
              maxLength={150}
            />

            <small>Give your achievement a clear, descriptive title.</small>
          </div>

          <div className="achievement-field">
            <label htmlFor="category">
              <Tag size={15} />
              Category
            </label>

            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Coding, Award"
            />
          </div>

          <div className="achievement-field">
            <label htmlFor="date">
              <CalendarDays size={15} />
              Achievement Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />

            <small>Optional — leave empty if not applicable.</small>
          </div>

          <div className="achievement-field achievement-field-full">
            <label htmlFor="organization">
              <Building2 size={15} />
              Organization
            </label>

            <input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g. LeetCode, NPTEL, or event organizer"
            />
          </div>

          <div className="achievement-field achievement-field-full">
            <label htmlFor="credentialUrl">
              <LinkIcon size={15} />
              Credential / Reference URL
            </label>

            <input
              id="credentialUrl"
              name="credentialUrl"
              type="url"
              value={formData.credentialUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-achievement"
            />

            <small>
              Add a public link where visitors can verify the achievement.
            </small>
          </div>

          <div className="achievement-field achievement-field-full">
            <label htmlFor="description">
              <FileText size={15} />
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              maxLength={2000}
              placeholder="Explain what you achieved, what you learned, or why it matters..."
            />

            <div className="achievement-description-footer">
              <span>Keep it clear and meaningful.</span>
              <span>{formData.description.length}/2000</span>
            </div>
          </div>
        </div>

        <div className="achievement-form-footer">
          <p>
            <span className="achievement-footer-dot" />
            Fields marked * are required.
          </p>

          <div className="achievement-form-actions">
            <button
              type="button"
              className="achievement-cancel-btn"
              onClick={() => navigate("/admin/achievements")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="achievement-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="achievement-spinner"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Achievement
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="achievement-form-tip">
        <div className="achievement-tip-icon">
          <Sparkles size={18} />
        </div>

        <div>
          <strong>Make it count</strong>
          <p>
            Include genuine accomplishments and a reference link whenever
            one is available.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NewAchievement;