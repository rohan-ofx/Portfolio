import useFetch from "../hooks/useFetch.js";

const Achievements = () => {
  const {
    data: achievements,
    loading,
    error,
  } = useFetch("/achivements");

  if (loading) {
    return <p>Loading Achievements...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>My Achievements</h2>

      {achievements.length === 0 ? (
        <p>No Achievements Found</p>
      ) : (
        <div>
          {achievements.map((achievement) => (
            <div key={achievement._id}>
              <h3>{achievement.title}</h3>

              <p>{achievement.description}</p>

              {achievement.date && (
                <p>Date: {achievement.date}</p>
              )}

              {achievement.organization && (
                <p>
                  Organization: {achievement.organization}
                </p>
              )}

              {achievement.link && (
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Achievement
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievements;
