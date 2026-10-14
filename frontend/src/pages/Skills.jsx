import useFetch from "../hooks/useFetch.js";
import SkillIcon from "../components/SkillIcon.jsx";

const Skills = () => {
  const {
    data: skills,
    loading,
    error,
  } = useFetch("/skills");

  if (loading) {
    return (
      <main className="skills-page skills-state">
        <p className="skills-state-text">Loading skills...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="skills-page skills-state">
        <p className="skills-error">{error}</p>
      </main>
    );
  }

  const skillsList = Array.isArray(skills) ? skills : [];

  return (
    <main className="skills-page">
      <section className="skills-section">
        <div className="section-heading skills-heading">
          <span className="skills-eyebrow">
            MY EXPERTISE
          </span>

          <p className="section-label">What I Know</p>

          <h1>
            Skills & <span>Technologies</span>
          </h1>

          <p className="section-description">
            Technologies and tools I have learned and worked with
            while building projects and improving my development skills.
          </p>
        </div>

        {skillsList.length === 0 ? (
          <div className="skills-empty">
            <span className="skills-empty-icon">◇</span>
            <h2>No skills added yet</h2>
            <p>Skills will appear here once they are available.</p>
          </div>
        ) : (
          <div className="skills-grid">
            {skillsList.map((skill, index) => (
              <article
                className="skill-card"
                key={skill._id}
                style={{ "--skill-index": index }}
              >
                <div className="skill-card-top">
                  <div className="skill-icon">
                    <SkillIcon identifier={skill.icon}/>
                  </div>

                  <span className="skill-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="skill-content">
                  <h2>{skill.name}</h2>

                  {skill.category && (
                    <p className="skill-category">
                      {skill.category}
                    </p>
                  )}

                  {skill.level && (
                    <div className="skill-level">
                      <div className="skill-level-track">
                        <div className="skill-level-fill" />
                      </div>

                      <span className="skill-level-text">
                        {skill.level}
                      </span>
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

export default Skills;