import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import "./Certifications.css";

const NewCertification = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
  });

  const [certificateFile, setCertificateFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (file && !file.type.startsWith("image/")) {
      setError("Please select a valid certificate image.");
      event.target.value = "";
      setCertificateFile(null);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      setCertificateFile(null);
      return;
    }

    setCertificateFile(file);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.issuer.trim() ||
      !formData.issueDate
    ) {
      setError("Title, issuer and issue date are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = new FormData();

      payload.append("title", formData.title.trim());
      payload.append("issuer", formData.issuer.trim());
      payload.append("issueDate", formData.issueDate);
      payload.append("credentialId", formData.credentialId.trim());
      payload.append("credentialUrl", formData.credentialUrl.trim());
      payload.append("description", formData.description.trim());

      if (certificateFile) {
        // Must match upload.single("certificate") in your backend route.
        payload.append("certificate", certificateFile);
      }

      await api.post("/certificates", payload);

      navigate("/admin/certifications");
    } catch (err) {
      console.error("Create Certification Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add certification. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page certification-create-page">
      <header className="admin-page-header certification-create-header">
        <div>
          <span className="certification-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Add Certification</h1>

          <p>
            Showcase your achievements, qualifications and professional
            learning.
          </p>
        </div>

        <button
          className="certification-back-btn"
          type="button"
          onClick={() => navigate("/admin/certifications")}
          disabled={loading}
        >
          <span aria-hidden="true">←</span>
          Back to Certifications
        </button>
      </header>

      {error && (
        <div className="certification-form-error" role="alert">
          <span className="certification-error-icon" aria-hidden="true">
            !
          </span>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <form
        className="admin-form certification-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="certification-form-heading">
          <div className="certification-heading-icon" aria-hidden="true">
            ✦
          </div>

          <div>
            <h2>Certificate Details</h2>
            <p>Fill in the information below.</p>
          </div>

          <span className="certification-required-note">
            * Required
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="title">
            Certificate Title <span>*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Programming in Java"
            required
            maxLength={150}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="issuer">
            Issuing Organization <span>*</span>
          </label>

          <input
            id="issuer"
            name="issuer"
            type="text"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="e.g. NPTEL, AWS, Coursera"
            required
            maxLength={150}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="issueDate">
            Issue Date <span>*</span>
          </label>

          <input
            id="issueDate"
            name="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={handleChange}
            required
            max={new Date().toLocaleDateString("en-CA")}
            disabled={loading}
          />

          <small>Date the certificate was issued.</small>
        </div>

        <div className="form-group">
          <label htmlFor="credentialId">Credential ID</label>

          <input
            id="credentialId"
            name="credentialId"
            type="text"
            value={formData.credentialId}
            onChange={handleChange}
            placeholder="Enter your credential ID"
            maxLength={200}
            disabled={loading}
          />
        </div>

        <div className="form-group certification-full-width">
          <label htmlFor="credentialUrl">
            Credential Verification URL
          </label>

          <input
            id="credentialUrl"
            name="credentialUrl"
            type="url"
            value={formData.credentialUrl}
            onChange={handleChange}
            placeholder="https://example.com/verify-certificate"
            disabled={loading}
          />

          <small>
            Add a public link where someone can verify your certificate.
          </small>
        </div>

        <div className="form-group certification-full-width">
          <label htmlFor="certificate">
            Certificate Image
            <span className="certification-optional-label">Optional</span>
          </label>

          <label
            className={`certification-upload-box ${
              certificateFile ? "has-file" : ""
            }`}
            htmlFor="certificate"
          >
            <span className="certification-upload-icon" aria-hidden="true">
              ↑
            </span>

            <span className="certification-upload-title">
              {certificateFile
                ? certificateFile.name
                : "Choose a certificate image"}
            </span>

            <span className="certification-upload-description">
              {certificateFile
                ? "Image selected successfully"
                : "PNG, JPG, JPEG or WEBP · Maximum 5 MB"}
            </span>

            <span className="certification-upload-action">
              {certificateFile ? "Choose another image" : "Browse files"}
            </span>

            <input
              id="certificate"
              name="certificate"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        </div>

        <div className="form-group certification-full-width">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you learned or accomplished..."
            rows={4}
            maxLength={1000}
            disabled={loading}
          />

          <small className="certification-character-count">
            {formData.description.length}/1000 characters
          </small>
        </div>

        <div className="certification-form-footer">
          <p>
            <span aria-hidden="true">🔒</span>
            Your certificate details will be saved to your portfolio.
          </p>

          <div className="certification-form-actions">
            <button
              className="certification-cancel-btn"
              type="button"
              onClick={() => navigate("/admin/certifications")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="certification-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="certification-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <span aria-hidden="true">＋</span>
                  Save Certification
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewCertification;