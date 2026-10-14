import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";

const Projects = () => {
    const {
        data: projects,
        loading,
        error,
    } = useFetch("/projects");

    const [failedImages, setFailedImages] = useState([]);

    if (loading) {
        return (
            <main className="projects-page projects-state" aria-live="polite">
                <div className="projects-state-card">
                    <span className="projects-loader" />
                    <p>Loading projects...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="projects-page projects-state" role="alert">
                <div className="projects-state-card">
                    <h2>Unable to load projects</h2>
                    <p>Please try again later.</p>
                </div>
            </main>
        );
    }

    const projectList = Array.isArray(projects) ? projects : [];

    return (
        <main className="projects-page">
            <section className="projects-section">
                <header className="section-heading">
                    <div className="projects-eyebrow">
                        <span className="projects-eyebrow-dot" />
                        <span>PORTFOLIO SHOWCASE</span>
                    </div>

                    <p className="section-label">My Work</p>

                    <h1>
                        Featured <span>Projects</span>
                    </h1>

                    <p className="section-description">
                        A collection of projects built through learning,
                        experimentation, and solving real-world problems.
                    </p>

                    <div className="projects-heading-line" />
                </header>

                {projectList.length === 0 ? (
                    <div className="projects-empty">
                        <div className="projects-empty-icon">{"</>"}</div>
                        <h2>Projects coming soon</h2>
                        <p>
                            New projects will appear here once they are added
                            to the portfolio.
                        </p>
                    </div>
                ) : (
                    <div className="project-grid">
                        {projectList.map((project, index) => {
                            const imageFailed = failedImages.includes(
                                project._id
                            );

                            return (
                                <article
                                    className="project-card"
                                    key={project._id}
                                    style={{
                                        "--project-index": index,
                                    }}
                                >
                                    <div className="project-image">
                                        {project.image && !imageFailed ? (
                                            <img
                                                src={project.image}
                                                alt={`${project.title} preview`}
                                                loading="lazy"
                                                onError={() =>
                                                    setFailedImages((previous) =>
                                                        previous.includes(project._id)
                                                            ? previous
                                                            : [
                                                                  ...previous,
                                                                  project._id,
                                                              ]
                                                    )
                                                }
                                            />
                                        ) : (
                                            <div className="project-image-placeholder">
                                                <span>{"</>"}</span>
                                                <p>{project.title}</p>
                                            </div>
                                        )}

                                        <span className="project-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {project.featured && (
                                            <span className="project-featured">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <div className="project-content">
                                        <h2>{project.title}</h2>

                                        <p className="project-description">
                                            {project.description}
                                        </p>

                                        {Array.isArray(project.technologies) &&
                                            project.technologies.length > 0 && (
                                                <div className="project-technologies">
                                                    {project.technologies.map(
                                                        (technology, techIndex) => (
                                                            <span key={`${technology}-${techIndex}`}>
                                                                {technology}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        <div className="project-links">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="project-link project-link-secondary"
                                                >
                                                    GitHub
                                                    <span aria-hidden="true">↗</span>
                                                </a>
                                            )}

                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="project-link project-link-primary"
                                                >
                                                    Live Demo
                                                    <span aria-hidden="true">↗</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <div className="projects-footer">
                    <span className="projects-footer-line" />
                    <p>Built with curiosity. Improved with every project.</p>
                    <span className="projects-footer-line" />
                </div>

                <div className="projects-contact">
                    <div>
                        <p className="projects-contact-label">HAVE AN IDEA?</p>
                        <h2>Let's build something meaningful.</h2>
                    </div>

                    <Link to="/contact" className="projects-contact-button">
                        Get in Touch <span aria-hidden="true">↗</span>
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Projects;