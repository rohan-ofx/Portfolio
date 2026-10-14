import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

import api from "../../services/api.js";
import "./Education.css";

const Education = () => {
  const navigate = useNavigate();

  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchEducations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/education");

      setEducations(
        Array.isArray(response.data?.data) ? response.data.data : []
      );
    } catch (err) {
      console.error("Fetch Education Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load education records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  const filteredEducations = educations.filter((education) => {
    const searchText = search.trim().toLowerCase();

    return [
      education.degree,
      education.institution,
      education.fieldOfStudy,
      education.startYear,
      education.endYear,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(searchText)
    );
  });

  const handleDelete = async () => {
    if (!selectedEducation?._id || deletingId) return;

    try {
      setDeletingId(selectedEducation._id);
      setDeleteError("");

      await api.delete(`/education/${selectedEducation._id}`);

      setEducations((previous) =>
        previous.filter(
          (education) => education._id !== selectedEducation._id
        )
      );

      setSelectedEducation(null);
    } catch (err) {
      console.error("Delete Education Error:", err);

      setDeleteError(
        err.response?.data?.message ||
          "Unable to delete this record. Please try again."
      );
    } finally {
      setDeletingId("");
    }
  };

  const getDuration = (education) => {
    const start = education.startYear || "—";
    const end = education.isCurrent
      ? "Present"
      : education.endYear || "—";

    return `${start} – ${end}`;
  };

  return (
    <main className="education-page">
      <header className="education-header">
        <div className="education-heading">
          <div className="education-heading-icon">
            <FiBookOpen />
          </div>

          <div>
            <span className="education-eyebrow">PORTFOLIO MANAGEMENT</span>
            <h1>Education</h1>
            <p>Manage your academic journey and qualifications.</p>
          </div>
        </div>

        <button
          type="button"
          className="education-primary-btn"
          onClick={() => navigate("/admin/education/new")}
        >
          <FiPlus />
          <span>Add Education</span>
        </button>
      </header>

      <section className="education-stats">
        <article className="education-stat-card">
          <div className="education-stat-icon">
            <FiBookOpen />
          </div>
          <div>
            <span>Total Records</span>
            <strong>{educations.length}</strong>
          </div>
        </article>

        <article className="education-stat-card">
          <div className="education-stat-icon">
            <FiCalendar />
          </div>
          <div>
            <span>Current Studies</span>
            <strong>
              {educations.filter((item) => item.isCurrent).length}
            </strong>
          </div>
        </article>
      </section>

      <section className="education-content">
        <div className="education-toolbar">
          <div>
            <h2>Academic Records</h2>
            <p>Your education details in one place.</p>
          </div>

          <label className="education-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search education..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search education records"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </label>
        </div>

        {error && (
          <div className="education-alert" role="alert">
            <FiAlertCircle />
            <span>{error}</span>
            <button type="button" onClick={fetchEducations}>
              <FiRefreshCw /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="education-state">
            <span className="education-spinner" />
            <h3>Loading education</h3>
            <p>Fetching your academic records...</p>
          </div>
        ) : !error && filteredEducations.length === 0 ? (
          <div className="education-state">
            <div className="education-empty-icon">
              {search ? <FiSearch /> : <FiBookOpen />}
            </div>
            <h3>
              {search ? "No matching records" : "No education records yet"}
            </h3>
            <p>
              {search
                ? "Try a different search term."
                : "Add your academic qualifications to display them here."}
            </p>

            {!search && (
              <button
                type="button"
                className="education-primary-btn"
                onClick={() => navigate("/admin/education/new")}
              >
                <FiPlus /> Add your first record
              </button>
            )}
          </div>
        ) : (
          <div className="education-table-wrap">
            <table className="education-table">
              <thead>
                <tr>
                  <th>Qualification</th>
                  <th>Institution</th>
                  <th>Field of Study</th>
                  <th>Duration</th>
                  <th className="education-actions-heading">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEducations.map((education) => (
                  <tr key={education._id}>
                    <td>
                      <div className="education-degree">
                        <div className="education-degree-icon">
                          <FiBookOpen />
                        </div>
                        <div>
                          <strong>{education.degree || "Untitled degree"}</strong>
                          {education.isCurrent && (
                            <span className="education-current-badge">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="education-institution">
                        <strong>
                          {education.institution || "—"}
                        </strong>
                        {education.location && (
                          <span>
                            <FiMapPin />
                            {education.location}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>{education.fieldOfStudy || "—"}</td>

                    <td>
                      <span className="education-duration">
                        <FiCalendar />
                        {getDuration(education)}
                      </span>
                    </td>

                    <td>
                      <div className="education-row-actions">
                        <button
                          type="button"
                          className="education-icon-btn education-edit-btn"
                          title="Edit education"
                          aria-label={`Edit ${education.degree || "education"}`}
                          onClick={() =>
                            navigate(
                              `/admin/education/edit/${education._id}`
                            )
                          }
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="education-icon-btn education-delete-btn"
                          title="Delete education"
                          aria-label={`Delete ${education.degree || "education"}`}
                          onClick={() => {
                            setDeleteError("");
                            setSelectedEducation(education);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="education-table-footer">
              Showing <strong>{filteredEducations.length}</strong> of{" "}
              <strong>{educations.length}</strong> records
            </div>
          </div>
        )}
      </section>

      {selectedEducation && (
        <div
          className="education-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingId) {
              setSelectedEducation(null);
              setDeleteError("");
            }
          }}
        >
          <section
            className="education-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="education-delete-title"
          >
            <button
              type="button"
              className="education-modal-close"
              aria-label="Close dialog"
              disabled={Boolean(deletingId)}
              onClick={() => {
                setSelectedEducation(null);
                setDeleteError("");
              }}
            >
              <FiX />
            </button>

            <div className="education-delete-symbol">
              <FiTrash2 />
            </div>

            <h2 id="education-delete-title">Delete education record?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedEducation.degree || "this education record"}
              </strong>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="education-alert" role="alert">
                <FiAlertCircle />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="education-modal-actions">
              <button
                type="button"
                className="education-secondary-btn"
                disabled={Boolean(deletingId)}
                onClick={() => {
                  setSelectedEducation(null);
                  setDeleteError("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="education-confirm-delete"
                disabled={Boolean(deletingId)}
                onClick={handleDelete}
              >
                <FiTrash2 />
                {deletingId ? "Deleting..." : "Delete record"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Education;
