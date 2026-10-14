import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";

const Home = () => {
    const {
        data: siteSettings,
        loading,
        error,
    } = useFetch("/site-settings");

    const [imageError, setImageError] = useState(false);

    if (loading) {
        return (
            <main className="home home-state" aria-live="polite">
                <p>Loading portfolio...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="home home-state" role="alert">
                <p>Portfolio load nahi ho paaya. Please try again.</p>
            </main>
        );
    }

    if (!siteSettings) {
        return (
            <main className="home home-state">
                <p>Portfolio information abhi available nahi hai.</p>
            </main>
        );
    }

    const name = siteSettings.name || "Portfolio";
    const title = siteSettings.title || "Aspiring Software Engineer";
    const whatsappNumber = siteSettings.phone?.replace(/\D/g, "");
   const profileImageUrl =
    typeof siteSettings.profileImage === "string"
        ? siteSettings.profileImage
        : siteSettings.profileImage?.url || "";

const showProfileImage = Boolean(profileImageUrl) && !imageError;

    return (
        <main className="home">
            <section className="hero" aria-labelledby="hero-title">
                <div className="hero-content">
                    <p className="hero-greeting">Hello, I'm</p>

                    <h1 id="hero-title">{name}</h1>

                    <h2>{title}</h2>

                    {siteSettings.bio && (
                        <p className="hero-description">
                            {siteSettings.bio}
                        </p>
                    )}

                    <div className="hero-buttons">
                        <Link to="/projects" className="btn btn-primary">
                            View My Work
                            <span aria-hidden="true"> ↗</span>
                        </Link>

                        <Link to="/contact" className="btn btn-secondary">
                            Contact Me
                        </Link>

                        {whatsappNumber && (
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                WhatsApp Me
                                <span aria-hidden="true"> ↗</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="hero-image">
                    <div className="profile-glow">
                        {showProfileImage ? (
                            <img
                                src={profileImageUrl}
                                alt={`${name} profile`}
                                className="profile-image"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div
                                className="profile-placeholder"
                                aria-label={`${name} profile placeholder`}
                            >
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
