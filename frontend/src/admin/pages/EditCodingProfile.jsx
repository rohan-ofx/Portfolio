
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Code2,
  ArrowLeft,
  ExternalLink,
  Trophy,
  Target,
  Hash,
  Layers3,
  Save,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  UserRound,
  Link2,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api.js";
import "./CodingProfiles.css";

function EditCodingProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    platform: "",
    username: "",
    profileUrl: "",
    problemsSolved: "",
    rating: "",
    rank: "",
    order: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/coding/${id}`);
        const profile = response.data?.data;

        if (!profile) {
          throw new Error("Coding profile nahi mila.");
        }

        if (!active) return;

        setFormData({
          platform: profile.platform || "",
          username: profile.username || "",
          profileUrl: profile.profileUrl || "",
          problemsSolved: profile.problemsSolved ?? "",
          rating: profile.rating ?? "",
          rank: profile.rank ?? "",
          order: profile.order ?? 0,
        });
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Coding profile load nahi ho paaya."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
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

    const profileUrl = formData.profileUrl.trim();

    if (profileUrl) {
      try {
        const parsedUrl = new URL(profileUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          setError("Profile URL must start with HTTP or HTTPS.");
          return;
        }
      } catch {
        setError("Please enter a valid profile URL.");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        platform: formData.platform.trim(),
        username: formData.username.trim(),
        profileUrl,
        problemsSolved:
          formData.problemsSolved === ""
            ? undefined
            : Number(formData.problemsSolved),
        rating:
          formData.rating === ""
            ? undefined
            : Number(formData.rating),
        rank:
          formData.rank === ""
            ? undefined
            : Number(formData.rank),
        order: Number(formData.order),
      };

      await api.put(`/coding/${id}`, payload);

      navigate("/admin/coding");
    } catch (err) {
      console.error("Update Coding Profile Error:", err);

      setError(
        err.response?.data?.message ||
          "Coding profile update nahi ho paaya."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="new-coding-page">
        <div className="new-coding-loading">
          <div className="new-coding-loading-icon">
            <LoaderCircle size={27} className="new-coding-spinner" />
          </div>
          <h2>Loading coding profile</h2>
          <p>Please wait while we fetch your saved details.</p>
        </div>
      </section>
    );
  }

  if (error && !formData.platform && !formData.username) {
    return (
      <section className="new-coding-page">
        <div className="new-coding-load-error">
          <div className="new-coding-loading-icon new-coding-error-icon">
            <AlertCircle size={25} />
          </div>

          <h2>Unable to load profile</h2>
          <p>{error}</p>

          <div className="new-coding-load-actions">
            <button
              type="button"
              className="new-coding-cancel"
              onClick={() => navigate("/admin/coding")}
            >
              <ArrowLeft size={16} />
              Back to Profiles
            </button>

            <button
              type="button"
              className="new-coding-submit"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="new-coding-page">
      <div className="new-coding-container">
        <button
          type="button"
          className="new-coding-back"
          onClick={() => navigate("/admin/coding")}
        >
          <ArrowLeft size={16} />
          Back to Coding Profiles
        </button>

        <header className="new-coding-header">
          <div className="new-coding-heading">
            <div className="new-coding-heading-icon">
              <Code2 size={27} />
            </div>

            <div>
              <div className="new-coding-eyebrow">
                <Layers3 size={13} />
                PORTFOLIO MANAGEMENT
              </div>

              <h1>Edit Coding Profile</h1>

              <p>
                Update your platform details and coding achievements.
              </p>
            </div>
          </div>

          <div className="new-coding-status new-coding-edit-status">
            <span />
            Editing profile
          </div>
        </header>

        {error && (
          <div
            className="new-coding-alert"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="new-coding-form">
          <div className="new-coding-form-top">
            <div className="new-coding-section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h2>Platform Information</h2>
              <p>Update your public coding profile details.</p>
            </div>
          </div>

          <div className="new-coding-form-body">
            <div className="new-coding-field">
              <label htmlFor="platform">
                Platform Name <span>*</span>
              </label>

              <input
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                placeholder="e.g. LeetCode, GitHub, CodeChef"
                maxLength={80}
                required
              />

              <small>Name shown on your portfolio.</small>
            </div>

            <div className="new-coding-field">
              <label htmlFor="username">
                Username <span>*</span>
              </label>

              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your platform username"
                maxLength={100}
                required
              />

              <small>Your username on this platform.</small>
            </div>

            <div className="new-coding-field new-coding-field-full">
              <label htmlFor="profileUrl">
                Public Profile URL
                <span className="new-coding-optional">Optional</span>
              </label>

              <div className="new-coding-input-icon">
                <Link2 size={17} />

                <input
                  id="profileUrl"
                  name="profileUrl"
                  type="url"
                  value={formData.profileUrl}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/u/your-username/"
                  maxLength={2048}
                />

                {formData.profileUrl && (
                  <a
                    href={formData.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="new-coding-preview-link"
                    aria-label="Open profile URL"
                    title="Open profile"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <small>Link visitors can use to view your profile.</small>
            </div>
          </div>

          <div className="new-coding-divider" />

          <div className="new-coding-form-top">
            <div className="new-coding-section-icon new-coding-section-blue">
              <Trophy size={19} />
            </div>

            <div>
              <h2>Performance & Ranking</h2>
              <p>Keep your coding statistics up to date.</p>
            </div>
          </div>

          <div className="new-coding-form-body new-coding-metrics">
            <div className="new-coding-field">
              <label htmlFor="problemsSolved">
                <Target size={15} />
                Problems Solved
              </label>

              <input
                id="problemsSolved"
                name="problemsSolved"
                type="number"
                min="0"
                step="1"
                value={formData.problemsSolved}
                onChange={handleChange}
                placeholder="e.g. 150"
              />

              <small>Total problems solved.</small>
            </div>

            <div className="new-coding-field">
              <label htmlFor="rating">
                <Trophy size={15} />
                Rating
              </label>

              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                step="any"
                value={formData.rating}
                onChange={handleChange}
                placeholder="e.g. 1450"
              />

              <small>Platform rating, if available.</small>
            </div>

            <div className="new-coding-field">
              <label htmlFor="rank">
                <Hash size={15} />
                Rank
              </label>

              <input
                id="rank"
                name="rank"
                type="number"
                min="0"
                step="1"
                value={formData.rank}
                onChange={handleChange}
                placeholder="e.g. 2500"
              />

              <small>Platform rank, if available.</small>
            </div>

            <div className="new-coding-field">
              <label htmlFor="order">
                <Layers3 size={15} />
                Display Order
              </label>

              <input
                id="order"
                name="order"
                type="number"
                step="1"
                value={formData.order}
                onChange={handleChange}
                placeholder="0"
              />

              <small>Smaller values appear earlier.</small>
            </div>
          </div>

          <div className="new-coding-tip">
            <div className="new-coding-tip-icon">
              <CheckCircle2 size={17} />
            </div>

            <p>
              <strong>Review before saving.</strong>
              <br />
              Blank optional statistics are sent as undefined, matching
              your existing payload behavior.
            </p>
          </div>

          <footer className="new-coding-form-footer">
            <p>
              <span>*</span> Required fields
            </p>

            <div className="new-coding-actions">
              <button
                type="button"
                className="new-coding-cancel"
                onClick={() => navigate("/admin/coding")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="new-coding-submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="new-coding-spinner"
                    />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </footer>
        </form>

        <p className="new-coding-footer-note">
          <Code2 size={14} />
          Your coding journey, presented in one place.
        </p>
      </div>
    </section>
  );
}

export default EditCodingProfile;
