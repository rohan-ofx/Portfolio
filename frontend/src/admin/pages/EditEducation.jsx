import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiBookOpen,
  FiArrowLeft,
  FiSave,
  FiCalendar,
  FiAward,
  FiMapPin,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import api from "../../services/api.js";
import "./Education.css";

const initialFormData = {
  degree: "",
  institution: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  grade: "",
  description: "",
  isCurrent: false,
};

const EditEducation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/education/${id}`);
        const education = response.data.data;

        if (!education) {
          throw new Error("Education record not found.");
        }

        setFormData({
          degree: education.degree || "",
          institution: education.institution || "",
          fieldOfStudy: education.fieldOfStudy || "",
          startYear: education.startDate
            ? new Date(education.startDate).getUTCFullYear().toString()
            : "",
          endYear: education.endDate
            ? new Date(education.endDate).getUTCFullYear().toString()
            : "",
          grade: education.grade || "",
          description: education.description || "",
          // Model mein isCurrent field nahi hai.
          // Null endDate ko current education maana jayega.
          isCurrent: !education.endDate,
        });
      } catch (err) {
        console.error("Fetch Education Error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load education."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEducation();
    } else {
      setError("Education ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isCurrent" && checked ? { endYear: "" } : {}),
    }));

    setError("");
    setValidationError("");
  };

  const validateForm = () => {
    const startYear = Number(formData.startYear);
    const endYear = Number(formData.endYear);

    if (!formData.degree.trim()) {
      return "Please enter your degree or qualification.";
    }

    if (!formData.institution.trim()) {
      return "Please enter the institution name.";
    }

    if (!formData.fieldOfStudy.trim()) {
      return "Please enter your field of study.";
    }

    if (
      !formData.startYear ||
      !Number.isInteger(startYear) ||
      startYear < 1950 ||
      startYear > currentYear + 10
    ) {
      return `Enter a valid start year between 1950 and ${
        currentYear + 10
      }.`;
    }

    if (
      !formData.isCurrent &&
      formData.endYear &&
      (!Number.isInteger(endYear) ||
        endYear < startYear ||
        endYear > currentYear + 10)
    ) {
      return "End year cannot be earlier than start year.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setValidationError("");

    const validationMessage = validateForm();

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    // Backend ke Education model ke matching fields
    const payload = {
      degree: formData.degree.trim(),
      institution: formData.institution.trim(),
      fieldOfStudy: formData.fieldOfStudy.trim(),

      startDate: `${formData.startYear}-01-01`,

      endDate:
        formData.isCurrent || !formData.endYear
          ? null
          : `${formData.endYear}-01-01`,

      grade: formData.grade.trim(),
      description: formData.description.trim(),
    };

    try {
      setSaving(true);

      await api.put(`/education/${id}`, payload);

      navigate("/admin/education");
    } catch (err) {
      console.error("Update Education Error:", err);
      console.error("Backend response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Failed to update education. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="new-education-page">
        <section className="new-education-form-card">
          <p>Loading education details...</p>
        </section>
      </main>
    );
  }

  if (error && !formData.degree && !formData.institution) {
    return (
      <main className="new-education-page">
        <section className="new-education-form-card">
          <div className="new-education-alert" role="alert">
            <FiAlertCircle />
            <span>{error}</span>
          </div>

          <button
            type="button"
            className="new-education-back-btn"
            onClick={() => navigate("/admin/education")}
          >
            <FiArrowLeft />
            Back to Education
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="new-education-page">
      <header className="new-education-header">
        <div className="new-education-heading">
          <div className="new-education-heading-icon">
            <FiBookOpen />
          </div>

          <div>
            <span className="new-education-eyebrow">
              PORTFOLIO MANAGEMENT
            </span>
            <h1>Edit Education</h1>
            <p>Update your academic qualification.</p>
          </div>
        </div>

        <button
          type="button"
          className="new-education-back-btn"
          onClick={() => navigate("/admin/education")}
        >
          <FiArrowLeft />
          Back to Education
        </button>
      </header>

      <div className="new-education-layout">
        <section className="new-education-form-card">
          <div className="new-education-card-heading">
            <div>
              <h2>Academic Details</h2>
              <p>Update the information below and save your changes.</p>
            </div>

            <span className="new-education-required-note">
              * Required
            </span>
          </div>

          {(error || validationError) && (
            <div className="new-education-alert" role="alert">
              <FiAlertCircle />
              <span>{validationError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="new-education-form-grid">
              <div className="new-education-field">
                <label htmlFor="degree">
                  Degree / Qualification <span>*</span>
                </label>

                <div className="new-education-input-wrap">
                  <FiAward />
                  <input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech"
                    maxLength={120}
                    required
                  />
                </div>
              </div>

              <div className="new-education-field">
                <label htmlFor="institution">
                  Institution <span>*</span>
                </label>

                <div className="new-education-input-wrap">
                  <FiBookOpen />
                  <input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Enter institution name"
                    maxLength={180}
                    required
                  />
                </div>
              </div>

              <div className="new-education-field new-education-full">
                <label htmlFor="fieldOfStudy">
                  Field of Study <span>*</span>
                </label>

                <div className="new-education-input-wrap">
                  <FiFileText />
                  <input
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science and Engineering"
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <div className="new-education-field">
                <label htmlFor="startYear">
                  Start Year <span>*</span>
                </label>

                <div className="new-education-input-wrap">
                  <FiCalendar />
                  <input
                    id="startYear"
                    name="startYear"
                    type="number"
                    min="1950"
                    max={currentYear + 10}
                    value={formData.startYear}
                    onChange={handleChange}
                    placeholder="e.g. 2023"
                    required
                  />
                </div>
              </div>

              <div className="new-education-field">
                <label htmlFor="endYear">End Year</label>

                <div className="new-education-input-wrap">
                  <FiCalendar />
                  <input
                    id="endYear"
                    name="endYear"
                    type="number"
                    min={formData.startYear || 1950}
                    max={currentYear + 10}
                    value={formData.endYear}
                    onChange={handleChange}
                    placeholder={
                      formData.isCurrent ? "Present" : "e.g. 2027"
                    }
                    disabled={formData.isCurrent}
                  />
                </div>

                <small>Leave empty if the end year is not known.</small>
              </div>

              <div className="new-education-field new-education-full">
                <label htmlFor="grade">Grade / CGPA</label>

                <div className="new-education-input-wrap">
                  <FiAward />
                  <input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="e.g. 7.2 CGPA or 85%"
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="new-education-field new-education-full">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={1500}
                  placeholder="Add academic details, achievements, or coursework..."
                />

                <small className="new-education-character-count">
                  {formData.description.length}/1500 characters
                </small>
              </div>
            </div>

            <label className="new-education-current-toggle">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
              />

              <span className="new-education-custom-checkbox">
                <FiCheckCircle />
              </span>

              <span className="new-education-toggle-copy">
                <strong>Currently studying here</strong>
                <small>
                  Mark this if you are still pursuing this qualification.
                </small>
              </span>
            </label>

            <div className="new-education-form-footer">
              <button
                type="button"
                className="new-education-cancel-btn"
                disabled={saving}
                onClick={() => navigate("/admin/education")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="new-education-submit-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="new-education-button-spinner" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Update Education
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <aside className="new-education-side-card">
          <div className="new-education-side-icon">
            <FiBookOpen />
          </div>

          <h2>Keep your profile up to date</h2>

          <p>
            Maintain accurate education details so visitors can follow
            your academic journey.
          </p>

          <div className="new-education-side-divider" />

          <div className="new-education-side-tip">
            <FiCheckCircle />
            <span>Use your official qualification and institution names.</span>
          </div>

          <div className="new-education-side-tip">
            <FiCalendar />
            <span>Verify your start and end dates before saving.</span>
          </div>

          <div className="new-education-side-tip">
            <FiMapPin />
            <span>Keep your academic details accurate and relevant.</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default EditEducation;