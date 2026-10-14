import useFetch from "../hooks/useFetch.js";

const CodingProfile = () => {
  const {
    data: profiles,
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
    <section>
      <h2>My Coding Profiles</h2>

      {profiles.length === 0 ? (
        <p>No Coding Profiles Found</p>
      ) : (
        <div>
          {profiles.map((profile) => (
            <div key={profile._id}>
              <h3>{profile.platform}</h3>

              <p>Username: {profile.username}</p>

              {profile.description && (
                <p>{profile.description}</p>
              )}

              {profile.icon && (
                <p>Icon: {profile.icon}</p>
              )}

              {profile.profileUrl && (
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Profile
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CodingProfile;

