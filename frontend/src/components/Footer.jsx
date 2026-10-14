import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";

const Footer = () => {
  const {
    data: siteSettings,
    loading: settingsLoading,
    error: settingsError,
  } = useFetch("/site-settings");

  const {
    data: codingProfiles,
    loading: codingLoading,
    error: codingError,
  } = useFetch("/coding");

  if (settingsLoading || codingLoading) {
    return null;
  }

  if (settingsError || codingError) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>{siteSettings?.name}</h2>

          <p>
            {siteSettings?.title}
          </p>

          {siteSettings?.bio && (
            <p className="footer-bio">
              {siteSettings.bio}
            </p>
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
          <h3>Connect</h3>

          {codingProfiles?.map((profile) => (
            <a
              key={profile._id}
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              {profile.icon && (
                <span>{profile.icon}</span>
              )}

              {profile.platform}
            </a>
          ))}
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