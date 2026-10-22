
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";

const Footer = () => {
  const {
    data: siteSettings,
    loading,
    error,
  } = useFetch("/site-settings");

  if (loading || error) {
    return null;
  }

  const socialProfiles = [
    {
      name: "GitHub",
      url: siteSettings?.githubUrl,
    },
    {
      name: "LinkedIn",
      url: siteSettings?.linkedinUrl,
    },
    {
      name: "LeetCode",
      url: siteSettings?.leetcodeUrl,
    },
  ].filter((profile) => profile.url?.trim());

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h2>{siteSettings?.name}</h2>

          <p>{siteSettings?.title}</p>

          {siteSettings?.bio && (
            <p className="footer-bio">{siteSettings.bio}</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/projects">Projects</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Connect */}
        <div className="footer-social">
          <h3>Connect With Me</h3>

          <div className="footer-social-links">
            {socialProfiles.length > 0 ? (
              socialProfiles.map((profile) => (
                <a
                  key={profile.name}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${profile.name} profile`}
                  className="footer-social-link"
                >
                  <span className="footer-social-name">
                    {profile.name}
                  </span>

                  <span
                    className="footer-social-arrow"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              ))
            ) : (
              <p className="footer-social-empty">
                Social profiles coming soon.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteSettings?.name}
          {" "}· All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
