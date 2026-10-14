import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Hash,
  LoaderCircle,
  Save,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import api from "../../services/api.js";
import "./Certifications.css";

const EditCertification = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/certificates/${id}`);
        const certificate = response.data.data;

        if (!certificate) {
          throw new Error("Certification details were not found.");
        }

        setFormData({
          title: certificate.title || "",
          issuer: certificate.issuer || "",
          issueDate: certificate.issueDate
            ? new Date(certificate.issueDate)
                .toISOString()
                .slice(0, 10)
            : "",
          credentialId: certificate.credentialId || "",
          credentialUrl: certificate.credentialUrl || "",
          description: certificate.description || "",
        });
      } catch (err) {
        console.error("Fetch Certification Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load certification."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertification();
    } else {
      setError("Certification ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.issuer.trim()) {
      setError("Certificate title and issuing organization are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate,
        credentialId: formData.credentialId.trim(),
        credentialUrl: formData.credentialUrl.trim(),
        description: formData.description.trim(),
      };

      await api.put(`/certificates/${id}`, payload);

      setSuccess("Certification updated successfully.");

      setTimeout(() => {
        navigate("/admin/certifications");
      }, 800);
    } catch (err) {
      console.error("Update Certification Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update certification. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-page certification-edit-page">
        <div className="cert-edit-loading">
          <span className="cert-edit-loading-icon">
            <LoaderCircle size={27} />
          </span>
          <h2>Loading certification</h2>
          <p>Please wait while we retrieve your certificate details.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page certification-edit-page">
      <div className="cert-edit-glow cert-edit-glow-one" />
      <div className="cert-edit-glow cert-edit-glow-two" />

      <header className="cert-edit-header">
        <div className="cert-edit-heading">
          <div className="cert-edit-eyebrow">
            <Sparkles size={14} />
            <span>PORTFOLIO MANAGEMENT</span>
          </div>

          <h1>Edit Certification</h1>
          <p>
            Keep your professional credentials accurate and up to date.
          </p>
        </div>

        <button
          type="button"
          className="cert-edit-back-btn"
          onClick={() => navigate("/admin/certifications")}
        >
          <ArrowLeft size={17} />
          <span>All Certifications</span>
        </button>
      </header>

      <div className="cert-edit-layout">
        <aside className="cert-edit-sidebar">
          <div className="cert-edit-preview-icon">
            <Award size={35} strokeWidth={1.6} />
          </div>

          <span className="cert-edit-preview-label">
            CREDENTIAL EDITOR
          </span>

          <h2>Showcase your achievements.</h2>

          <p>
            Make sure your certification details, issuing organization,
            and credential link are correct.
          </p>

          <div className="cert-edit-sidebar-divider" />

          <div className="cert-edit-tip">
            <ShieldCheck size={20} />
            <div>
              <strong>Keep it authentic</strong>
              <span>
                Add accurate details so visitors can verify your credentials.
              </span>
            </div>
          </div>

          <div className="cert-edit-tip">
            <ExternalLink size={20} />
            <div>
              <strong>Verification link</strong>
              <span>
                Add your credential URL if the issuing platform provides one.
              </span>
            </div>
          </div>

          <div className="cert-edit-sidebar-decoration">
            <Award size={100} strokeWidth={0.7} />
          </div>
        </aside>

        <section className="cert-edit-card">
          <div className="cert-edit-card-header">
            <div className="cert-edit-card-title-icon">
              <FileText size={21} />
            </div>

            <div>
              <h2>Certification details</h2>
              <p>Update the information displayed on your portfolio.</p>
            </div>

            <span className="cert-edit-required-note">
              * Required
            </span>
          </div>

          {error && (
            <div className="cert-edit-alert cert-edit-alert-error" role="alert">
              <span>{error}</span>
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError("")}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {success && (
            <div
              className="cert-edit-alert cert-edit-alert-success"
              role="status"
            >
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form className="cert-edit-form" onSubmit={handleSubmit}>
            <div className="cert-edit-section-label">
              <span>01</span>
              <h3>Basic information</h3>
            </div>

            <div className="cert-edit-fields">
              <div className="cert-edit-field cert-edit-field-full">
                <label htmlFor="title">
                  Certificate title <span>*</span>
                </label>

                <div className="cert-edit-input-wrap">
                  <Award size={18} />
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Programming in Java"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <div className="cert-edit-field">
                <label htmlFor="issuer">
                  Issuing organization <span>*</span>
                </label>

                <div className="cert-edit-input-wrap">
                  <Building2 size={18} />
                  <input
                    id="issuer"
                    name="issuer"
                    type="text"
                    placeholder="e.g. NPTEL"
                    value={formData.issuer}
                    onChange={handleChange}
                    maxLength={120}
                    required
                  />
                </div>
              </div>

              <div className="cert-edit-field">
                <label htmlFor="issueDate">Issue date</label>

                <div className="cert-edit-input-wrap">
                  <CalendarDays size={18} />
                  <input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    max={new Date().toLocaleDateString("en-CA")}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cert-edit-section-label cert-edit-field-full">
                <span>02</span>
                <h3>Credential information</h3>
              </div>

              <div className="cert-edit-field">
                <label htmlFor="credentialId">Credential ID</label>

                <div className="cert-edit-input-wrap">
                  <Hash size={18} />
                  <input
                    id="credentialId"
                    name="credentialId"
                    type="text"
                    placeholder="Enter credential ID"
                    value={formData.credentialId}
                    onChange={handleChange}
                    maxLength={150}
                  />
                </div>
              </div>

              <div className="cert-edit-field">
                <label htmlFor="credentialUrl">Credential URL</label>

                <div className="cert-edit-input-wrap">
                  <ExternalLink size={18} />
                  <input
                    id="credentialUrl"
                    name="credentialUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.credentialUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cert-edit-field cert-edit-field-full">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="What did you learn or accomplish through this certification?"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={5}
                />

                <div className="cert-edit-char-count">
                  {formData.description.length}/1000
                </div>
              </div>
            </div>

            <div className="cert-edit-form-footer">
              <p>
                <ShieldCheck size={16} />
                Your changes will be saved to your portfolio database.
              </p>

              <div className="cert-edit-actions">
                <button
                  type="button"
                  className="cert-edit-cancel-btn"
                  onClick={() => navigate("/admin/certifications")}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cert-edit-submit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="cert-edit-spinner" size={18} />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update certification
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EditCertification;
