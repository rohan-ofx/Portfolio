import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAward,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiExternalLink,
  FiRefreshCw,
  FiAlertCircle,
  FiX,
  FiShield,
} from "react-icons/fi";

import api from "../../services/api.js";
import "./Certifications.css";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Certifications = () => {
  const navigate = useNavigate();

  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCertifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/certificates");
      const data = response.data?.data;

      setCertifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Certifications Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load certifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const filteredCertifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return certifications;

    return certifications.filter((certificate) =>
      [
        certificate.title,
        certificate.issuer,
        certificate.credentialId,
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [certifications, search]);

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/certificates/${deleteTarget._id}`);

      setCertifications((previous) =>
        previous.filter(
          (certificate) => certificate._id !== deleteTarget._id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete Certification Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete certification. Please try again."
      );

      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="admin-certifications">
      <header className="certifications-header">
        <div className="certifications-heading">
          <div className="certifications-heading-icon">
            <FiAward />
          </div>

          <div>
            <span className="certifications-eyebrow">
              PORTFOLIO MANAGEMENT
            </span>
            <h1>Certifications</h1>
            <p>
              Manage your professional certificates and achievements.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="certifications-add-btn"
          onClick={() => navigate("/admin/certifications/new")}
        >
          <FiPlus />
          Add Certificate
        </button>
      </header>

      <section className="certifications-stats">
        <article className="certifications-stat-card">
          <div className="certifications-stat-icon">
            <FiAward />
          </div>
          <div>
            <span>Total Certificates</span>
            <strong>{certifications.length}</strong>
          </div>
        </article>

        <article className="certifications-stat-card">
          <div className="certifications-stat-icon">
            <FiShield />
          </div>
          <div>
            <span>Issuing Organizations</span>
            <strong>
              {
                new Set(
                  certifications
                    .map((item) => item.issuer?.trim().toLowerCase())
                    .filter(Boolean)
                ).size
              }
            </strong>
          </div>
        </article>

        <article className="certifications-stat-card">
          <div className="certifications-stat-icon">
            <FiCalendar />
          </div>
          <div>
            <span>Search Results</span>
            <strong>{filteredCertifications.length}</strong>
          </div>
        </article>
      </section>

      <section className="certifications-content">
        <div className="certifications-toolbar">
          <div>
            <h2>Your Certificates</h2>
            <p>Review and update your credentials.</p>
          </div>

          <div className="certifications-toolbar-actions">
            <label
              className="certifications-search"
              htmlFor="certification-search"
            >
              <FiSearch />
              <input
                id="certification-search"
                type="search"
                placeholder="Search certificates..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="certifications-clear-search"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <FiX />
                </button>
              )}
            </label>

            <button
              type="button"
              className="certifications-refresh-btn"
              onClick={fetchCertifications}
              disabled={loading}
              aria-label="Refresh certifications"
              title="Refresh"
            >
              <FiRefreshCw className={loading ? "is-spinning" : ""} />
            </button>
          </div>
        </div>

        {error && (
          <div className="certifications-alert" role="alert">
            <FiAlertCircle />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <FiX />
            </button>
          </div>
        )}

        {loading ? (
          <div className="certifications-state">
            <span className="certifications-spinner" />
            <h3>Loading certifications</h3>
            <p>Fetching your certificate records...</p>
          </div>
        ) : certifications.length === 0 && !error ? (
          <div className="certifications-state">
            <div className="certifications-empty-icon">
              <FiAward />
            </div>
            <h3>No certificates yet</h3>
            <p>Add your first certificate to showcase your achievements.</p>
            <button
              type="button"
              className="certifications-add-btn"
              onClick={() => navigate("/admin/certifications/new")}
            >
              <FiPlus />
              Add Certificate
            </button>
          </div>
        ) : !error && filteredCertifications.length === 0 ? (
          <div className="certifications-state">
            <div className="certifications-empty-icon">
              <FiSearch />
            </div>
            <h3>No matching certificates</h3>
            <p>Try a different title, organization, or credential ID.</p>
            <button
              type="button"
              className="certifications-secondary-btn"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          </div>
        ) : !error ? (
          <div className="certifications-table-wrapper">
            <table className="certifications-table">
              <thead>
                <tr>
                  <th>Certificate</th>
                  <th>Issuing Organization</th>
                  <th>Issue Date</th>
                  <th>Credential ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCertifications.map((certificate) => (
                  <tr key={certificate._id}>
                    <td>
                      <div className="certifications-title-cell">
                        <div className="certifications-row-icon">
                          <FiAward />
                        </div>
                        <div>
                          <strong>{certificate.title || "Untitled Certificate"}</strong>
                          <span>Professional credential</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="certifications-issuer">
                        {certificate.issuer || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="certifications-date">
                        {formatDate(certificate.issueDate)}
                      </span>
                    </td>

                    <td>
                      <span className="certifications-credential">
                        {certificate.credentialId || "—"}
                      </span>
                    </td>

                    <td>
                      <div className="certifications-row-actions">
                        {certificate.certificateUrl && (
                          <a
                            className="certifications-icon-btn"
                            href={certificate.certificateUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View certificate"
                            title="View certificate"
                          >
                            <FiExternalLink />
                          </a>
                        )}

                        <button
                          type="button"
                          className="certifications-icon-btn"
                          onClick={() =>
                            navigate(
                              `/admin/certifications/edit/${certificate._id}`
                            )
                          }
                          aria-label={`Edit ${certificate.title || "certificate"}`}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="certifications-icon-btn certifications-delete-btn"
                          onClick={() => setDeleteTarget(certificate)}
                          aria-label={`Delete ${certificate.title || "certificate"}`}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && !error && filteredCertifications.length > 0 && (
          <footer className="certifications-footer">
            Showing {filteredCertifications.length} of{" "}
            {certifications.length} certificates
          </footer>
        )}
      </section>

      {deleteTarget && (
        <div
          className="certifications-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="certifications-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-certification-title"
          >
            <div className="certifications-delete-modal-icon">
              <FiTrash2 />
            </div>

            <h2 id="delete-certification-title">
              Delete Certificate?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title || "this certificate"}</strong>?
              This action cannot be undone.
            </p>

            <div className="certifications-modal-actions">
              <button
                type="button"
                className="certifications-secondary-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="certifications-confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Certificate"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Certifications;