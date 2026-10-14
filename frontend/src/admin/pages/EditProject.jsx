
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api.js";
import "./EditProject.css";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/projects/${id}`);
        const project = response.data.data;

        if (!isMounted) return;

        setFormData({
          title: project.title || "",
          description: project.description || "",
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : project.technologies || "",
          image: project.image || "",
          githubUrl: project.githubUrl || "",
          liveUrl: project.liveUrl || "",
          featured: Boolean(project.featured),
        });

        setImagePreview(project.image || "");
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Failed to load project details."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    } else {
      setError("Project ID is missing.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!selectedImage) return;

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    const technologies = formData.technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = new FormData();

      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("technologies", JSON.stringify(technologies));
      payload.append("githubUrl", formData.githubUrl.trim());
      payload.append("liveUrl", formData.liveUrl.trim());
      payload.append("featured", String(formData.featured));

      if (selectedImage) {
        payload.append("image", selectedImage);
      } else {
        payload.append("image", formData.image);
      }

      await api.put(`/projects/${id}`, payload);

      setSuccess("Project updated successfully.");

      // Allow the success message to appear before navigating.
      window.setTimeout(() => {
        navigate("/admin/projects");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update project. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-project-page">
        <div className="edit-project-state">
          <span className="edit-project-spinner" />
          <p>Loading project details...</p>
        </div>
      </main>
    );
  }

  if (error && !formData.title && !formData.description) {
    return (
      <main className="edit-project-page">
        <div className="edit-project-state">
          <div className="edit-project-state-icon">!</div>
          <h1>Unable to load project</h1>
          <p className="edit-project-error">{error}</p>
          <Link className="edit-project-back" to="/admin/projects">
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-project-page">
      <header className="edit-project-header">
        <div>
          <span className="edit-project-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>
          <h1>Edit Project</h1>
          <p>Update your project details and keep your portfolio current.</p>
        </div>

        <Link className="edit-project-back" to="/admin/projects">
          <span aria-hidden="true">←</span> All Projects
        </Link>
      </header>

      <form className="edit-project-form" onSubmit={handleSubmit}>
        <div className="edit-project-form-intro">
          <div className="edit-project-icon" aria-hidden="true">
            ✎
          </div>
          <div>
            <h2>Project Information</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        {error && (
          <div className="edit-project-alert edit-project-alert-error" role="alert">
            <span aria-hidden="true">!</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="edit-project-alert edit-project-alert-success" role="status">
            <span aria-hidden="true">✓</span>
            <p>{success}</p>
          </div>
        )}

        <div className="edit-project-grid">
          <label className="edit-project-field edit-project-field-full">
            <span>Project title <b>*</b></span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              maxLength={120}
              required
            />
          </label>

          <label className="edit-project-field edit-project-field-full">
            <span>Description <b>*</b></span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project and the problem it solves"
              rows={5}
              maxLength={3000}
              required
            />
            <small>{formData.description.length}/3000 characters</small>
          </label>

          <label className="edit-project-field edit-project-field-full">
            <span>Technologies</span>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
            <small>Separate each technology with a comma.</small>
          </label>

          <div className="edit-project-field edit-project-field-full">
            <span className="edit-project-label">Project image</span>

            {imagePreview ? (
              <div className="edit-project-image-preview">
                <img src={imagePreview} alt="Project preview" />
                <div className="edit-project-image-caption">
                  <span className="edit-project-image-dot" />
                  {selectedImage ? "New image selected" : "Current project image"}
                </div>
              </div>
            ) : (
              <div className="edit-project-image-empty">
                <span aria-hidden="true">▧</span>
                <strong>No project image</strong>
                <small>Choose an image to add one.</small>
              </div>
            )}

            <label className="edit-project-upload">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <span aria-hidden="true">↑</span>
              <span>{selectedImage ? "Choose another image" : "Upload new image"}</span>
            </label>
            <small>Image files only. Maximum size: 5 MB.</small>
          </div>

          <label className="edit-project-field">
            <span>GitHub repository</span>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
            />
          </label>

          <label className="edit-project-field">
            <span>Live demo URL</span>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://your-project.com"
            />
          </label>
        </div>

        <label className="edit-project-featured">
          <span className="edit-project-featured-copy">
            <strong>Featured project</strong>
            <small>Highlight this project on your portfolio homepage.</small>
          </span>

          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <span className="edit-project-switch" aria-hidden="true" />
        </label>

        <footer className="edit-project-actions">
          <Link
            className="edit-project-cancel"
            to="/admin/projects"
            aria-disabled={submitting}
            onClick={(event) => submitting && event.preventDefault()}
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="edit-project-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="edit-project-spinner" />
                Updating project...
              </>
            ) : (
              "Save Changes →"
            )}
          </button>
        </footer>
      </form>
    </main>
  );
};

export default EditProject;
