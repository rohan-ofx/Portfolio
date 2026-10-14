
import { useEffect, useState } from "react";
import {
  UserRound,
  ContactRound,
  Share2,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Code2,
  FileText,
  Sparkles,
  RefreshCw,
  ImagePlus,
  Upload,
} from "lucide-react";

import api from "../../services/api";
import "./SiteSettings.css";

const initialFormData = {
  name: "",
  title: "",
  tagline: "",
  email: "",
  phone: "",
  location: "",
  githubUrl: "",
  linkedinUrl: "",
  leetcodeUrl: "",
  resumeUrl: "",
};

function SiteSettings() {
  const [formData, setFormData] = useState(initialFormData);
  const [savedFormData, setSavedFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settingsExists, setSettingsExists] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch existing settings
  useEffect(() => {
    let active = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/site-settings");
        const settings = response.data?.data;

        if (!active) return;

        if (settings) {
          const imageUrl =
            typeof settings.profileImage === "string"
              ? settings.profileImage
              : settings.profileImage?.url || "";

          const loadedFormData = {
            ...initialFormData,
            ...settings,
            tagline: settings.bio || settings.tagline || "",
            resumeUrl: settings.resumeUrl || "",
          };

          setSettingsExists(true);
          setFormData(loadedFormData);
          setSavedFormData(loadedFormData);
          setProfileImage(imageUrl);
          setImagePreview(imageUrl);
        }
      } catch (err) {
        if (!active) return;

        if (err.response?.status === 404) {
          setSettingsExists(false);
          setError("");
        } else {
          setError(
            err.response?.data?.message ||
              "Site settings load nahi ho paayi."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSettings();

    return () => {
      active = false;
    };
  }, []);

  // Handle text inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Save or update settings
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        bio: formData.tagline,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        leetcodeUrl: formData.leetcodeUrl,
        resumeUrl: formData.resumeUrl,
      };

      const response = settingsExists
        ? await api.put("/site-settings", payload)
        : await api.post("/site-settings", payload);

      const settings = response.data?.data || {};

      const savedData = {
        ...formData,
        ...settings,
        tagline: settings.bio ?? formData.tagline,
      };

      setFormData(savedData);
      setSavedFormData(savedData);
      setSettingsExists(true);
      setSuccess("Site settings successfully save ho gayi.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Site settings save nahi ho paayi."
      );
    } finally {
      setSaving(false);
    }
  };

  // Select profile image
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  // Upload profile image to backend / Cloudinary
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError("Please select a profile image first.");
      return;
    }

    if (!settingsExists) {
      setError("Please save Site Settings before uploading the profile image.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const imageData = new FormData();
      imageData.append("profileImage", selectedImage);

      const response = await api.patch(
        "/site-settings/profile-image",
        imageData
      );

      const settings = response.data?.data;
      const uploadedUrl =
        typeof settings?.profileImage === "string"
          ? settings.profileImage
          : settings?.profileImage?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Upload response mein profile image URL nahi mila."
        );
      }

      setProfileImage(uploadedUrl);
      setImagePreview(uploadedUrl);
      setSelectedImage(null);
      setSuccess("Profile image successfully upload ho gayi.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Profile image upload nahi ho paayi."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // Reset form to last saved data
  const handleReset = () => {
    setFormData(savedFormData);
    setSelectedImage(null);
    setImagePreview(profileImage);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <section className="settings-page">
        <div className="settings-loading">
          <div className="settings-loading-icon">
            <LoaderCircle size={27} className="settings-spin" />
          </div>
          <h2>Loading your settings</h2>
          <p>Fetching your portfolio configuration...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="settings-page">
      <header className="settings-page-header">
        <div className="settings-heading">
          <div className="settings-heading-icon">
            <Sparkles size={25} />
          </div>

          <div>
            <span className="settings-eyebrow">
              PORTFOLIO CONFIGURATION
            </span>
            <h1>Site Settings</h1>
            <p>
              Manage your personal information, contact details and
              public profile links.
            </p>
          </div>
        </div>

        <div className="settings-header-badge">
          <span />
          Configuration
        </div>
      </header>

      {error && (
        <div className="settings-alert settings-alert-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div
          className="settings-alert settings-alert-success"
          role="status"
        >
          <CheckCircle2 size={19} />
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-content">
          <div className="settings-main-column">
            {/* Profile Image */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon settings-icon-purple">
                  <ImagePlus size={20} />
                </div>
                <div>
                  <h2>Profile Image</h2>
                  <p>
                    Upload the photo displayed on your portfolio.
                  </p>
                </div>
              </div>

              <div className="settings-card-body">
                <div className="settings-profile-upload">
                  <div className="settings-profile-preview">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                      />
                    ) : (
                      <UserRound size={42} />
                    )}
                  </div>

                  <div className="settings-profile-details">
                    <h3>Portfolio Profile Photo</h3>
                    <p>JPG, PNG or WEBP · Maximum 5 MB</p>

                    <label className="settings-image-select">
                      <ImagePlus size={16} />
                      Choose Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />
                    </label>

                    {selectedImage && (
                      <p className="settings-selected-file">
                        Selected: {selectedImage.name}
                      </p>
                    )}

                    <button
                      type="button"
                      className="settings-save-btn settings-image-upload-btn"
                      onClick={handleImageUpload}
                      disabled={
                        !selectedImage ||
                        uploadingImage ||
                        !settingsExists
                      }
                    >
                      {uploadingImage ? (
                        <LoaderCircle
                          size={17}
                          className="settings-spin"
                        />
                      ) : (
                        <Upload size={17} />
                      )}
                      {uploadingImage
                        ? "Uploading..."
                        : "Upload Profile Image"}
                    </button>

                    {!settingsExists && (
                      <p className="settings-field-hint">
                        Save your site settings before uploading a photo.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon settings-icon-purple">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2>Personal Information</h2>
                  <p>How you appear across your portfolio.</p>
                </div>
              </div>

              <div className="settings-card-body">
                <div className="settings-field">
                  <label htmlFor="name">
                    Full Name <span>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="title">
                    Professional Title <span>*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Aspiring Software Engineer"
                    maxLength={150}
                    required
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="tagline">About / Tagline</label>
                  <textarea
                    id="tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="Write a short introduction about yourself..."
                    rows={4}
                    maxLength={1000}
                  />
                  <span className="settings-field-hint">
                    A short introduction shown on your portfolio.
                  </span>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon settings-icon-blue">
                  <ContactRound size={20} />
                </div>
                <div>
                  <h2>Contact Information</h2>
                  <p>Details visitors can use to reach you.</p>
                </div>
              </div>

              <div className="settings-card-body settings-form-grid">
                <div className="settings-field">
                  <label htmlFor="email">
                    <Mail size={14} /> Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="phone">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="settings-field settings-field-full">
                  <label htmlFor="location">
                    <MapPin size={14} /> Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Kolkata, India"
                  />
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon settings-icon-green">
                  <Share2 size={20} />
                </div>
                <div>
                  <h2>Social & Portfolio Links</h2>
                  <p>Connect visitors to your work and profiles.</p>
                </div>
              </div>

              <div className="settings-card-body">
                <div className="settings-field">
                  <label htmlFor="githubUrl">
                    <Code2 size={15} /> GitHub URL
                  </label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="linkedinUrl">
                    <Share2 size={15} /> LinkedIn URL
                  </label>
                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="leetcodeUrl">
                    <Code2 size={15} /> LeetCode URL
                  </label>
                  <input
                    id="leetcodeUrl"
                    name="leetcodeUrl"
                    type="url"
                    value={formData.leetcodeUrl}
                    onChange={handleChange}
                    placeholder="https://leetcode.com/username"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="resumeUrl">
                    <FileText size={15} /> Resume URL
                  </label>
                  <input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/resume.pdf"
                  />
                  <span className="settings-field-hint">
                    Paste a publicly accessible resume link.
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="settings-sidebar">
            <div className="settings-sidebar-card">
              <div className="settings-sidebar-icon">
                <Sparkles size={21} />
              </div>
              <h3>Keep it up to date</h3>
              <p>
                Changes saved here can be reflected across your portfolio
                wherever these settings are used.
              </p>

              <div className="settings-sidebar-divider" />

              <div className="settings-sidebar-tip">
                <CheckCircle2 size={16} />
                <span>Use valid social profile URLs.</span>
              </div>

              <div className="settings-sidebar-tip">
                <CheckCircle2 size={16} />
                <span>Keep your contact information current.</span>
              </div>

              <div className="settings-sidebar-tip">
                <CheckCircle2 size={16} />
                <span>Test links after saving changes.</span>
              </div>
            </div>

            <div className="settings-save-card">
              <div>
                <h3>Ready to save?</h3>
                <p>Your changes will be sent to the backend.</p>
              </div>

              <button
                type="submit"
                className="settings-save-btn"
                disabled={saving}
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="settings-spin"
                  />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving..." : "Save Settings"}
              </button>

              <button
                type="button"
                className="settings-reset-btn"
                disabled={saving || uploadingImage}
                onClick={handleReset}
              >
                <RefreshCw size={15} />
                Reset Changes
              </button>
            </div>
          </aside>
        </div>

        <div className="settings-mobile-save">
          <button
            type="submit"
            className="settings-save-btn"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle
                size={17}
                className="settings-spin"
              />
            ) : (
              <Save size={17} />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SiteSettings;
