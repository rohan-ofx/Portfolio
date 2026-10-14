import useFetch from "../hooks/useFetch.js";

const Experience = () => {
  const {
    data: experiences,
    loading,
    error,
  } = useFetch("/experience");

  if (loading) {
    return (
      <main className="experience-page experience-state">
        <p>Loading experience...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="experience-page experience-state">
        <p className="experience-error">{error}</p>
      </main>
    );
  }

  const experienceList = Array.isArray(experiences)
    ? experiences
    : [];

  return (
    <main className="experience-page">
      <section className="experience-section">
        <div className="section-heading experience-heading">
          <span className="experience-eyebrow">
            MY PROFESSIONAL JOURNEY
          </span>

          <p className="section-label">My Journey</p>

          <h1>
            Experience & <span>Growth</span>
          </h1>

          <p className="section-description">
            My professional journey, practical experience, and
            opportunities where I have applied my technical skills.
          </p>
        </div>

        {experienceList.length === 0 ? (
          <div className="experience-empty">
            <div className="experience-empty-icon">◇</div>

            <h2>No Professional Experience Yet</h2>

            <p>
              I am currently focused on building real-world projects,
              improving my technical skills, and preparing for
              software engineering opportunities.
            </p>
          </div>
        ) : (
          <div className="experience-list">
            {experienceList.map((experience, index) => (
              <article
                className="experience-card"
                key={experience._id}
                style={{ "--experience-index": index }}
              >
                <div className="experience-timeline">
                  <span className="timeline-dot" />
                  {index !== experienceList.length - 1 && (
                    <span className="timeline-line" />
                  )}
                </div>

                <div className="experience-content">
                  <div className="experience-header">
                    <div className="experience-role">
                      <span className="experience-number">
                        EXPERIENCE {String(index + 1).padStart(2, "0")}
                      </span>

                      <h2>{experience.position}</h2>

                      <h3>{experience.company}</h3>
                    </div>

                    <div className="experience-date">
                      <span>{experience.startDate}</span>
                      <span className="experience-date-separator">
                        —
                      </span>
                      <span>{experience.endDate || "Present"}</span>
                    </div>
                  </div>

                  {experience.location && (
                    <p className="experience-location">
                      <span aria-hidden="true">⌖</span>
                      {experience.location}
                    </p>
                  )}

                  {experience.description && (
                    <p className="experience-description">
                      {experience.description}
                    </p>
                  )}

                  {experience.technologies?.length > 0 && (
                    <div className="experience-technologies">
                      {experience.technologies.map(
                        (technology, technologyIndex) => (
                          <span key={`${technology}-${technologyIndex}`}>
                            {technology}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Experience;