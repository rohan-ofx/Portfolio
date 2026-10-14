import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import api from "../../services/api.js";
import "./CodingProfiles.css";

function NewCodingProfile() {
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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

      await api.post("/coding", payload);

      navigate("/admin/coding");
    } catch (err) {
      console.error("Create Coding Profile Error:", err);

      setError(
        err.response?.data?.message ||
          "Coding profile create nahi ho paaya. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

              <h1>Add Coding Profile</h1>

              <p>
                Connect your coding platform and showcase your progress.
              </p>
            </div>
          </div>

          <div className="new-coding-status">
            <span />
            New profile
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
              <p>Tell us where your coding profile lives.</p>
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
                autoComplete="off"
                maxLength={80}
                required
              />

              <small>The name displayed on your portfolio.</small>
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
                placeholder="Enter your platform username"
                autoComplete="off"
                maxLength={100}
                required
              />

              <small>Your public username on this platform.</small>
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
                    aria-label="Open entered profile URL"
                    title="Open link"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <small>
                Visitors can use this link to open your public profile.
              </small>
            </div>
          </div>

          <div className="new-coding-divider" />

          <div className="new-coding-form-top">
            <div className="new-coding-section-icon new-coding-section-blue">
              <Trophy size={19} />
            </div>

            <div>
              <h2>Performance & Ranking</h2>
              <p>Add your current statistics if available.</p>
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

              <small>Platform rating, if applicable.</small>
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

              <small>Your platform rank, if applicable.</small>
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

              <small>Use smaller values for earlier placement.</small>
            </div>
          </div>

          <div className="new-coding-tip">
            <div className="new-coding-tip-icon">
              <CheckCircle2 size={17} />
            </div>

            <p>
              <strong>Keep your profile accurate.</strong>
              <br />
              Optional statistics can be left blank if the platform
              does not provide them.
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
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="new-coding-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="new-coding-spinner"
                    />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Profile
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

export default NewCodingProfile;
