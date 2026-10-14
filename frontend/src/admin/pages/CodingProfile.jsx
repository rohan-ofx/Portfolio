import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Pencil,
  Trash2,
  Trophy,
  Target,
  UserRound,
  X,
  LoaderCircle,
  AlertCircle,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api.js";
import "./CodingProfiles.css";

function CodingProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/coding");
      const data = response.data?.data;

      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Coding Profiles Error:", err);

      setError(
        err.response?.data?.message ||
          "Coding profiles load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return profiles;

    return profiles.filter((profile) =>
      [profile.platform, profile.username]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [profiles, search]);

  const totalProblems = profiles.reduce((total, profile) => {
    const count = Number(profile.problemsSolved);
    return total + (Number.isFinite(count) && count > 0 ? count : 0);
  }, 0);

  const ratedProfiles = profiles.filter(
    (profile) =>
      profile.rating !== null &&
      profile.rating !== undefined &&
      profile.rating !== ""
  );

  const handleDelete = async () => {
    if (!selectedProfile) return;

    const id = selectedProfile._id;

    try {
      setDeletingId(id);
      setDeleteError("");
      setSuccess("");

      await api.delete(`/coding/${id}`);

      setProfiles((previous) =>
        previous.filter((profile) => profile._id !== id)
      );

      setSelectedProfile(null);
      setSuccess("Coding profile deleted successfully.");
    } catch (err) {
      console.error("Delete Coding Profile Error:", err);

      setDeleteError(
        err.response?.data?.message ||
          "Coding profile delete nahi ho paaya."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getPlatformStyle = (platform = "") => {
    const name = platform.toLowerCase();

    if (name.includes("leetcode")) {
      return { symbol: "LC", className: "coding-platform-leetcode" };
    }

    if (name.includes("github")) {
      return { symbol: "GH", className: "coding-platform-github" };
    }

    if (name.includes("codeforces")) {
      return { symbol: "CF", className: "coding-platform-codeforces" };
    }

    if (name.includes("hackerrank")) {
      return { symbol: "HR", className: "coding-platform-hackerrank" };
    }

    if (name.includes("codechef")) {
      return { symbol: "CC", className: "coding-platform-codechef" };
    }

    if (name.includes("geeks")) {
      return { symbol: "GFG", className: "coding-platform-geeks" };
    }

    return { symbol: "CP", className: "coding-platform-default" };
  };

  return (
    <section className="coding-profiles-page">
      {/* Page heading */}
      <header className="coding-page-header">
        <div className="coding-page-heading">
          <div className="coding-heading-icon">
            <Code2 size={27} />
          </div>

          <div>
            <div className="coding-eyebrow">
              <Terminal size={13} />
              PORTFOLIO MANAGEMENT
            </div>

            <h1>Coding Profiles</h1>

            <p>
              Manage your coding platforms and problem-solving progress.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="coding-add-btn"
          onClick={() => navigate("/admin/coding/new")}
        >
          <Plus size={18} />
          Add Coding Profile
        </button>
      </header>

      {/* Summary cards */}
      <div className="coding-stats-grid">
        <article className="coding-stat-card">
          <div className="coding-stat-top">
            <span>Total Profiles</span>
            <div className="coding-stat-icon coding-stat-purple">
              <UserRound size={19} />
            </div>
          </div>

          <strong>{profiles.length}</strong>

          <p>Connected coding platforms</p>
        </article>

        <article className="coding-stat-card">
          <div className="coding-stat-top">
            <span>Problems Solved</span>
            <div className="coding-stat-icon coding-stat-blue">
              <Target size={19} />
            </div>
          </div>

          <strong>{totalProblems.toLocaleString()}</strong>

          <p>Combined reported total</p>
        </article>

        <article className="coding-stat-card">
          <div className="coding-stat-top">
            <span>Rated Profiles</span>
            <div className="coding-stat-icon coding-stat-amber">
              <Trophy size={19} />
            </div>
          </div>

          <strong>{ratedProfiles.length}</strong>

          <p>Profiles with a rating</p>
        </article>
      </div>

      {/* Feedback */}
      {error && (
        <div className="coding-alert coding-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchProfiles}
            aria-label="Retry loading profiles"
          >
            Retry
          </button>
        </div>
      )}

      {success && (
        <div className="coding-alert coding-alert-success" role="status">
          <CheckCircle2 size={18} />
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Profiles panel */}
      <div className="coding-profiles-panel">
        <div className="coding-panel-header">
          <div>
            <h2>Your Platforms</h2>
            <p>
              {loading
                ? "Fetching your profiles..."
                : `${filteredProfiles.length} of ${profiles.length} profiles`}
            </p>
          </div>

          <button
            type="button"
            className="coding-refresh-btn"
            onClick={fetchProfiles}
            disabled={loading}
            title="Refresh profiles"
          >
            <RefreshCw
              size={16}
              className={loading ? "coding-refresh-spinning" : ""}
            />
            <span>Refresh</span>
          </button>
        </div>

        <div className="coding-toolbar">
          <div className="coding-search-box">
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search platform or username..."
              aria-label="Search coding profiles"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="coding-state">
            <div className="coding-state-icon">
              <LoaderCircle
                size={28}
                className="coding-refresh-spinning"
              />
            </div>

            <h3>Loading coding profiles</h3>
            <p>Please wait while we fetch your platform data.</p>
          </div>
        ) : error ? (
          <div className="coding-state">
            <div className="coding-state-icon coding-state-error">
              <AlertCircle size={26} />
            </div>

            <h3>Unable to load profiles</h3>
            <p>Check your connection and try again.</p>

            <button
              type="button"
              className="coding-secondary-btn"
              onClick={fetchProfiles}
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="coding-state">
            <div className="coding-state-icon">
              <Code2 size={28} />
            </div>

            <h3>
              {search ? "No matching profiles" : "No coding profiles yet"}
            </h3>

            <p>
              {search
                ? "Try a different platform name or username."
                : "Add your coding profile to showcase your progress."}
            </p>

            {search ? (
              <button
                type="button"
                className="coding-secondary-btn"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                className="coding-add-btn"
                onClick={() => navigate("/admin/coding/new")}
              >
                <Plus size={17} />
                Add Your First Profile
              </button>
            )}
          </div>
        ) : (
          <div className="coding-table-wrapper">
            <table className="coding-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Username</th>
                  <th>Problems Solved</th>
                  <th>Rating</th>
                  <th className="coding-actions-heading">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProfiles.map((profile) => {
                  const platform = getPlatformStyle(profile.platform);

                  return (
                    <tr key={profile._id}>
                      <td>
                        <div className="coding-platform-cell">
                          <div
                            className={`coding-platform-logo ${platform.className}`}
                          >
                            {platform.symbol}
                          </div>

                          <div className="coding-platform-name">
                            <strong>{profile.platform || "Unknown platform"}</strong>
                            <span>Programming profile</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="coding-username">
                          {profile.username || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="coding-number">
                          {profile.problemsSolved ?? "—"}
                        </span>
                      </td>

                      <td>
                        {profile.rating !== null &&
                        profile.rating !== undefined &&
                        profile.rating !== "" ? (
                          <span className="coding-rating">
                            <Trophy size={13} />
                            {profile.rating}
                          </span>
                        ) : (
                          <span className="coding-muted-value">—</span>
                        )}
                      </td>

                      <td>
                        <div className="coding-row-actions">
                          <button
                            type="button"
                            className="coding-action-btn coding-edit-btn"
                            onClick={() =>
                              navigate(`/admin/coding/edit/${profile._id}`)
                            }
                            aria-label={`Edit ${profile.platform || "coding"} profile`}
                            title="Edit profile"
                          >
                            <Pencil size={15} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="coding-action-btn coding-delete-btn"
                            onClick={() => {
                              setDeleteError("");
                              setSelectedProfile(profile);
                            }}
                            aria-label={`Delete ${profile.platform || "coding"} profile`}
                            title="Delete profile"
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>

                          {profile.profileUrl && (
                            <a
                              className="coding-external-btn"
                              href={profile.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${profile.platform || "coding"} profile`}
                              title="Open public profile"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {selectedProfile && (
        <div
          className="coding-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingId
            ) {
              setSelectedProfile(null);
              setDeleteError("");
            }
          }}
        >
          <div
            className="coding-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coding-delete-title"
          >
            <button
              type="button"
              className="coding-modal-close"
              onClick={() => {
                if (!deletingId) {
                  setSelectedProfile(null);
                  setDeleteError("");
                }
              }}
              disabled={Boolean(deletingId)}
              aria-label="Close confirmation"
            >
              <X size={18} />
            </button>

            <div className="coding-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2 id="coding-delete-title">Delete coding profile?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedProfile.platform || "this profile"}
              </strong>
              {selectedProfile.username
                ? ` (@${selectedProfile.username})`
                : ""}
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="coding-modal-error" role="alert">
                {deleteError}
              </div>
            )}

            <div className="coding-modal-actions">
              <button
                type="button"
                className="coding-cancel-btn"
                onClick={() => {
                  setSelectedProfile(null);
                  setDeleteError("");
                }}
                disabled={Boolean(deletingId)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="coding-confirm-delete-btn"
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="coding-refresh-spinning"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CodingProfiles;