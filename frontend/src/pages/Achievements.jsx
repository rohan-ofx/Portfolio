import useFetch from "../hooks/useFetch.js";

const Achievements = () => {
  const {
    data: achievements,
    loading,
    error,
  } = useFetch("/achivements");

  const achievementList = Array.isArray(achievements)
    ? achievements
    : [];

  if (loading) {
    return (
      <main className="achievements-page achievements-state">
        <div className="achievements-loader" />
        <p>Loading achievements...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="achievements-page achievements-state">
        <div className="achievements-state-icon">!</div>
        <h2>Unable to Load Achievements</h2>
        <p className="achievements-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="achievements-page">
      <section className="achievements-section">
        {/* Section Heading */}
        <header className="achievements-heading">
          <span className="achievements-eyebrow">
            MILESTONES & RECOGNITION
          </span>

          <p className="section-label">My Highlights</p>

          <h1>
            Achievements & <span>Milestones</span>
          </h1>

          <p className="section-description">
            A collection of achievements, recognitions, and
            milestones from my academic and technical journey.
          </p>
        </header>

        {/* Dynamic Summary */}
        {achievementList.length > 0 && (
          <div className="achievements-summary">
            <div className="achievements-summary-icon">✦</div>

            <div className="achievements-summary-content">
              <span className="achievements-summary-number">
                {String(achievementList.length).padStart(2, "0")}
              </span>

              <span className="achievements-summary-label">
                {achievementList.length === 1
                  ? "Achievement Recorded"
                  : "Achievements Recorded"}
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {achievementList.length === 0 ? (
          <div className="achievements-empty">
            <div className="achievements-empty-icon">◇</div>

            <h2>No Achievements Yet</h2>

            <p>
              My achievements and recognitions will appear here
              once they are added to the portfolio.
            </p>
          </div>
        ) : (
          /* Achievement Cards */
          <div className="achievements-grid">
            {achievementList.map((achievement, index) => (
              <article
                className="achievement-card"
                key={achievement._id}
                style={{ "--achievement-index": index }}
              >
                <div className="achievement-card-top">
                  <div className="achievement-icon">
                    <span>✦</span>
                  </div>

                  <span className="achievement-number">
                    MILESTONE{" "}
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="achievement-content">
                  <div className="achievement-header">
                    <h2>{achievement.title}</h2>

                    {achievement.date && (
                      <span className="achievement-date">
                        {achievement.date}
                      </span>
                    )}
                  </div>

                  {achievement.organization && (
                    <p className="achievement-organization">
                      <span className="achievement-meta-icon">
                        ◈
                      </span>
                      {achievement.organization}
                    </p>
                  )}

                  {achievement.description && (
                    <p className="achievement-description">
                      {achievement.description}
                    </p>
                  )}
                </div>

                {achievement.link && (
                  <div className="achievement-link">
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Achievement
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                )}

                <div className="achievement-card-glow" />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Achievements;