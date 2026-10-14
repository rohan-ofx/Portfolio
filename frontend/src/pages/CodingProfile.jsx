import useFetch from "../hooks/useFetch.js";

const CodingProfile = () => {
  const {
    data: codingProfiles,
    loading,
    error,
  } = useFetch("/coding");

  if (loading) {
    return <p>Loading Coding Profiles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="coding-page">
      <section className="coding-section">

        <div className="section-heading">
          <p className="section-label">Where I Code</p>

          <h1>Coding Profiles</h1>

          <p className="section-description">
            My coding profiles and online platforms where I
            practice programming and improve my problem-solving skills.
          </p>
        </div>

        {codingProfiles?.length === 0 ? (
          <div className="coding-empty">
            <div className="coding-empty-icon">
              ◆
            </div>

            <h2>No Coding Profiles Yet</h2>

            <p>
              My coding profiles will be displayed here once they
              are added to the portfolio.
            </p>
          </div>
        ) : (
          <div className="coding-grid">

            {codingProfiles.map((profile) => (
              <article
                className="coding-card"
                key={profile._id}
              >
                <div className="coding-icon">
                  {profile.icon || "◆"}
                </div>

                <div className="coding-content">

                  <h2>{profile.platform}</h2>

                  {profile.username && (
                    <p className="coding-username">
                      @{profile.username}
                    </p>
                  )}

                  {profile.description && (
                    <p className="coding-description">
                      {profile.description}
                    </p>
                  )}

                  {profile.profileUrl && (
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="coding-link"
                    >
                      View Profile
                    </a>
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

export default CodingProfile;