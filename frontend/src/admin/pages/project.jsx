import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./projectss.css";

const Projectss = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects");
      const data = response.data.data;

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Projects Error:", err);
      setError(
        err.response?.data?.message || "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setNotice("");

      await api.delete(`/projects/${id}`);

      setProjects((previous) =>
        previous.filter((project) => project._id !== id)
      );

      setNotice("Project deleted successfully.");
    } catch (err) {
      console.error("Delete Project Error:", err);
      setError(
        err.response?.data?.message || "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const technologies = Array.isArray(project.technologies)
        ? project.technologies.join(" ")
        : project.technologies || "";

      const matchesSearch =
        !query ||
        [project.title, project.description, technologies]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesFilter =
        filter === "all" ||
        (filter === "featured" && project.featured) ||
        (filter === "standard" && !project.featured);

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  const featuredCount = projects.filter(
    (project) => project.featured
  ).length;

  return (
    <main className="admin-projects">
      {/* Header */}
      <header className="projects-page-header">
        <div>
          <span className="projects-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>
            Projects<span>.</span>
          </h1>

          <p>
            Manage your work, showcase your best projects, and keep
            your portfolio up to date.
          </p>
        </div>

        <button
          type="button"
          className="projects-add-button"
          onClick={() => navigate("/admin/projects/new")}
        >
          <span>＋</span> Add project
        </button>
      </header>

      {/* Summary cards */}
      <section className="projects-summary">
        <article className="projects-summary-card">
          <div className="projects-summary-icon projects-icon-violet">
            ⌘
          </div>
          <div>
            <span>Total projects</span>
            <h2>{projects.length}</h2>
            <p>All portfolio projects</p>
          </div>
        </article>

        <article className="projects-summary-card">
          <div className="projects-summary-icon projects-icon-gold">
            ✦
          </div>
          <div>
            <span>Featured projects</span>
            <h2>{featuredCount}</h2>
            <p>Highlighted work</p>
          </div>
        </article>

        <article className="projects-summary-card">
          <div className="projects-summary-icon projects-icon-blue">
            ◈
          </div>
          <div>
            <span>Other projects</span>
            <h2>{projects.length - featuredCount}</h2>
            <p>Additional portfolio work</p>
          </div>
        </article>
      </section>

      {/* Project management panel */}
      <section className="projects-management">
        <div className="projects-management-heading">
          <div>
            <h2>All projects</h2>
            <p>View and manage your portfolio work.</p>
          </div>

          <span className="projects-result-count">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {/* Search and filters */}
        <div className="projects-toolbar">
          <label className="projects-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search projects or technologies..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search projects"
            />
          </label>

          <div className="projects-filters" aria-label="Project filters">
            {[
              { value: "all", label: "All projects" },
              { value: "featured", label: "Featured" },
              { value: "standard", label: "Other" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  filter === option.value ? "active" : ""
                }
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {notice && (
          <div className="projects-notice" role="status">
            <span>✓</span> {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="projects-error" role="alert">
            <span>!</span>
            <p>{error}</p>
            <button type="button" onClick={fetchProjects}>
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="projects-loading" role="status">
            <span className="projects-spinner" />
            <p>Loading your projects...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="projects-empty">
            <div className="projects-empty-icon">⌘</div>
            <h3>Your portfolio starts here</h3>
            <p>
              Add your first project to showcase your work and
              technical skills.
            </p>
            <button
              type="button"
              className="projects-add-button"
              onClick={() => navigate("/admin/projects/new")}
            >
              ＋ Create first project
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          projects.length > 0 &&
          filteredProjects.length === 0 && (
            <div className="projects-empty projects-empty-compact">
              <h3>No matching projects</h3>
              <p>Try another search term or change the filter.</p>
              <button
                type="button"
                className="projects-reset-button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Projects table */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="projects-table-wrapper">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>PROJECT</th>
                  <th>TECHNOLOGIES</th>
                  <th>STATUS</th>
                  <th className="projects-actions-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <div className="projects-title-cell">
                        <div className="projects-thumbnail">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt=""
                              loading="lazy"
                            />
                          ) : (
                            <span>⌘</span>
                          )}
                        </div>

                        <div className="projects-title-info">
                          <strong>{project.title}</strong>
                          <span>
                            {project.description
                              ? `${project.description.slice(0, 68)}${
                                  project.description.length > 68
                                    ? "..."
                                    : ""
                                }`
                              : "No description provided"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="projects-tech-list">
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : project.technologies
                            ? [project.technologies]
                            : []
                        )
                          .slice(0, 3)
                          .map((technology, index) => (
                            <span key={`${technology}-${index}`}>
                              {technology}
                            </span>
                          ))}

                        {Array.isArray(project.technologies) &&
                          project.technologies.length > 3 && (
                            <span className="projects-tech-more">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                      </div>
                    </td>

                    <td>
                      {project.featured ? (
                        <span className="projects-status projects-status-featured">
                          <span /> Featured
                        </span>
                      ) : (
                        <span className="projects-status projects-status-standard">
                          <span /> Standard
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="projects-actions">
                        <button
                          type="button"
                          className="projects-edit-button"
                          onClick={() =>
                            navigate(
                              `/admin/projects/edit/${project._id}`
                            )
                          }
                          aria-label={`Edit ${project.title}`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="projects-delete-button"
                          disabled={deletingId === project._id}
                          onClick={() => handleDelete(project._id)}
                          aria-label={`Delete ${project.title}`}
                        >
                          {deletingId === project._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="projects-panel-footer">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          <span className="projects-secure-label">
            <span /> Portfolio workspace
          </span>
        </footer>
      </section>
    </main>
  );
};

export default Projectss;
