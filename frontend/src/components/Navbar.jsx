import { NavLink } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";

const Navbar = () => {
    const { data: siteSettings } = useFetch("/site-settings");

    const navItems = [
        { label: "Home", path: "/", end: true },
        { label: "Projects", path: "/projects" },
        { label: "Skills", path: "/skills" },
        { label: "Experience", path: "/experience" },
        { label: "Education", path: "/education" },
        { label: "Certifications", path: "/certifications" },
        { label: "Achievements", path: "/achievements" },
        { label: "Coding", path: "/coding" },
        { label: "Contact", path: "/contact" },
    ];

    return (
        <header className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <span className="navbar-logo-mark">
                        {siteSettings?.name?.charAt(0) || "P"}
                    </span>

                    <span className="navbar-logo-text">
                        {siteSettings?.name || "Portfolio"}
                    </span>
                </NavLink>

                <nav className="navbar-links" aria-label="Main navigation">
                    {navItems.map(({ label, path, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            className={({ isActive }) =>
                                `navbar-link${isActive ? " active" : ""}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}

                    {siteSettings?.resumeUrl && (
                        <a
                            href={siteSettings.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="navbar-resume"
                        >
                            <span>Resume</span>
                            <span aria-hidden="true">↗</span>
                        </a>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
