import { useState } from "react";
import api from "../services/api.js";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setStatus("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");

      const response = await api.post("/messages", formData);

      console.log("MESSAGE RESPONSE:", response.data);

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log("MESSAGE ERROR:", error);

      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-section">

        <div className="section-heading">
          <p className="section-label">Get In Touch</p>

          <h1>Contact Me</h1>

          <p className="section-description">
            Have a question, opportunity, or project idea?
            Feel free to get in touch with me.
          </p>
        </div>

        <div className="contact-container">

          <div className="contact-info">

            <div className="contact-info-header">
              <p className="contact-label">Let's Talk</p>

              <h2>Have something in mind?</h2>

              <p>
                I am open to internship opportunities, software
                development roles, collaborations, and interesting
                projects.
              </p>
            </div>

            <div className="contact-info-item">
              <span className="contact-info-icon">✉</span>

              <div>
                <span>Email</span>
                <p>Let's connect through the form.</p>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="contact-info-icon">◆</span>

              <div>
                <span>Availability</span>
                <p>Open to new opportunities.</p>
              </div>
            </div>

          </div>

          <div className="contact-form-card">

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">
                    Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />

                  {errors.name && (
                    <p className="form-error">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />

                  {errors.email && (
                    <p className="form-error">
                      {errors.email}
                    </p>
                  )}
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What would you like to discuss?"
                />

                {errors.subject && (
                  <p className="form-error">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="6"
                />

                {errors.message && (
                  <p className="form-error">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === "success" && (
                <p className="form-success">
                  Your message has been sent successfully.
                </p>
              )}

              {status === "error" && (
                <p className="form-error form-submit-error">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

            </form>

          </div>

        </div>

      </section>
    </main>
  );
};

export default Contact;