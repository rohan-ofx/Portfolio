import useFetch from "../hooks/useFetch.js";
const formatEducationDate = (date) => {
  if (!date) return "Present";

  return new Date(date).getUTCFullYear();
};
const Education = () => {
  const {
    data: educations,
    loading,
    error,
  } = useFetch("/education");

  if (loading) {
    return (
      <main className="education-page education-state">
        <p>Loading education...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="education-page education-state">
        <p className="education-error">{error}</p>
      </main>
    );
  }

  const educationList = Array.isArray(educations)
    ? educations
    : [];

  return (
    <main className="education-page">
      <section className="education-section">
        <div className="section-heading education-heading">
          <span className="education-eyebrow">
            ACADEMIC BACKGROUND
          </span>

          <p className="section-label">My Education</p>

          <h1>
            Education & <span>Qualifications</span>
          </h1>

          <p className="section-description">
            My academic journey, educational background, and
            qualifications that support my growth as a software
            engineer.
          </p>
        </div>

        {educationList.length === 0 ? (
          <div className="education-empty">
            <div className="education-empty-icon">◇</div>

            <h2>No Education Details Yet</h2>

            <p>
              Education details will be displayed here once they
              are added to the portfolio.
            </p>
          </div>
        ) : (
          <div className="education-list">
            {educationList.map((education, index) => (
              <article
                className="education-card"
                key={education._id}
                style={{ "--education-index": index }}
              >
                <div className="education-timeline">
                  <span className="education-dot" />

                  {index !== educationList.length - 1 && (
                    <span className="education-line" />
                  )}
                </div>

                <div className="education-content">
                  <div className="education-header">
                    <div className="education-main">
                      <span className="education-number">
                        EDUCATION {String(index + 1).padStart(2, "0")}
                      </span>

                      <h2>{education.degree}</h2>

                      <h3>{education.institution}</h3>
                    </div>

                    <div className="education-date">
                      <span>{ formatEducationDate(education.startDate)}</span>
                      <span className="education-date-separator">
                        —
                      </span>
                      <span>{education.endDate ? formatEducationDate(education.endDate) : "Present"}</span>
                    </div>
                  </div>

                  {education.fieldOfStudy && (
                    <p className="education-field">
                      {education.fieldOfStudy}
                    </p>
                  )}

                  {education.grade && (
                    <div className="education-grade">
                      <span className="education-grade-label">
                        Grade / Score
                      </span>

                      <span className="education-grade-value">
                        {education.grade}
                      </span>
                    </div>
                  )}

                  {education.description && (
                    <p className="education-description">
                      {education.description}
                    </p>
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

export default Education;