import useFetch from "../hooks/useFetch.js";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

const Certification = () => {
  const {
    data: certifications,
    loading,
    error,
  } = useFetch("/certificates");

  const certificationList = Array.isArray(certifications)
    ? certifications
    : [];

  if (loading) {
    return (
      <main className="certifications-page certifications-state">
        <div className="certifications-loader" />
        <p>Loading certifications...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="certifications-page certifications-state">
        <div className="certifications-state-icon">!</div>
        <h2>Unable to Load Certifications</h2>
        <p className="certifications-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="certifications-page">
      <section className="certifications-section">
        {/* Section Heading */}
        <header className="certifications-heading">
          <span className="certifications-eyebrow">
            PROFESSIONAL DEVELOPMENT
          </span>

          <p className="section-label">My Credentials</p>

          <h1>
            Certifications & <span>Achievements</span>
          </h1>

          <p className="section-description">
            Certifications and learning achievements that reflect
            my technical knowledge, practical learning, and
            commitment to continuous growth.
          </p>
        </header>

        {/* Dynamic Certification Count */}
        {certificationList.length > 0 && (
          <div className="certifications-summary">
            <div className="certifications-summary-icon">✦</div>

            <div>
              <span className="certifications-summary-number">
                {String(certificationList.length).padStart(2, "0")}
              </span>

              <span className="certifications-summary-label">
                {certificationList.length === 1
                  ? "Certification Earned"
                  : "Certifications Earned"}
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {certificationList.length === 0 ? (
          <div className="certifications-empty">
            <div className="certifications-empty-icon">◇</div>

            <h2>No Certifications Yet</h2>

            <p>
              My certifications and credentials will appear here
              once they are added to the portfolio.
            </p>
          </div>
        ) : (
          /* Certification Cards */
          <div className="certifications-grid">
            {certificationList.map((certification, index) => (
              <article
                className="certification-card"
                key={certification._id}
                style={{ "--certification-index": index }}
              >
                <div className="certification-card-top">
                  <div className="certification-icon">
                    <span>✦</span>
                  </div>

                  <span className="certification-number">
                    CERTIFICATE {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="certification-content">
                  <h2>{certification.title}</h2>

                  {certification.issuer && (
                    <p className="certification-issuer">
                      <span className="certification-meta-icon">◈</span>
                      {certification.issuer}
                    </p>
                  )}

                  {certification.issueDate && (
                    <p className="certification-date">
                      <span className="certification-meta-label">
                        Issued
                      </span>
                      <span>{formatDate(certification.issueDate)}</span>
                    </p>
                  )}

                  {certification.credentialId && (
                    <div className="certification-id">
                      <span>Credential ID</span>
                      <span>{certification.credentialId}</span>
                    </div>
                  )}
                </div>

                {(certification.credentialUrl ||
                  certification.certificateUrl) && (
                  <div className="certification-links">
                    {certification.credentialUrl && (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="certification-link certification-link-primary"
                      >
                        View Credential
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {certification.certificateUrl && (
                      <a
                        href={certification.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="certification-link certification-link-secondary"
                      >
                        View Certificate
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}

                <div className="certification-card-glow" />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Certification;