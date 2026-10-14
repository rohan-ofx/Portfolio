import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  RefreshCw,
} from "lucide-react";
import api from "../../services/api.js";
import "./Achievements.css";

const EditAchievement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    organization: "",
    description: "",
    credentialUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/achivements/${id}`);
        const achievement = response.data.data;

        setFormData({
          title: achievement.title || "",
          category: achievement.category || "",
          date: achievement.date
            ? new Date(achievement.date).toISOString().slice(0, 10)
            : "",
          organization: achievement.organization || "",
          description: achievement.description || "",
          credentialUrl: achievement.credentialUrl || "",
        });
      } catch (err) {
        console.error("Fetch Achievement Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load achievement. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id]);

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
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        date: formData.date || null,
      };

      await api.put(`/achivements/${id}`, payload);

      navigate("/admin/achievements");
    } catch (err) {
      console.error("Update Achievement Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update achievement. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="new-achievement-page">
        <div className="achievement-loading-card">
          <div className="achievement-loading-icon">
            <LoaderCircle size={30} className="achievement-spinner" />
          </div>

          <h2>Loading achievement</h2>

          <p>Please wait while we fetch your achievement details.</p>

          <div className="achievement-loading-track">
            <span />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="new-achievement-page">
      <div className="achievement-page-top">
        <button
          type="button"
          className="achievement-back-btn"
          onClick={() => navigate("/admin/achievements")}
          disabled={saving}
        >
          <ArrowLeft size={17} />
          <span>Back to Achievements</span>
        </button>

        <div className="achievement-breadcrumb">
          Admin <span>/</span> Achievements <span>/</span>{" "}
          <strong>Edit</strong>
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

          <h1>Edit Achievement</h1>

          <p>
            Refine your accomplishment details and keep your portfolio up
            to date.
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
            <p>Make your changes below and save when you're ready.</p>
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

            <small>Use a clear and descriptive title.</small>
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
              Link to a public page where visitors can verify the achievement.
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
              placeholder="Describe what you achieved, what you learned, or why it matters..."
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
            Your changes are saved when you select Update Achievement.
          </p>

          <div className="achievement-form-actions">
            <button
              type="button"
              className="achievement-cancel-btn"
              onClick={() => navigate("/admin/achievements")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="achievement-submit-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="achievement-spinner"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Update Achievement
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="achievement-form-tip">
        <div className="achievement-tip-icon">
          <RefreshCw size={18} />
        </div>

        <div>
          <strong>Keep your portfolio current</strong>
          <p>
            Update the date, organization or reference link whenever your
            achievement details change.
          </p>
        </div>
      </div>
    </main>
  );
};

export default EditAchievement;