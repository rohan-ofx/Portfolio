import { useState } from "react";
import api from "../services/api.js"

const Contact = () => {
    const [formData, serFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const {name, value} = event.target;
        serFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const validateform = () => {
        if(!formData.name.trim()){
            return "Name is required";
        }
        if(!formData.email.trim()){
            return "Email is required";
        }

        const emailpatten = /^[^/s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailpatten.test(from.email)){
            return "Please enter valid email address";
        }

        if(!from.message.trim()){
            return "Message is required";
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        const validationError = validateform();
        if(validationError){
            setError(validationError)
            return;
        }

        setLoading(true);

        try{
            const response = await api.post("/messages",formData);

            setSuccess(response.data.message);

            serFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.log(error);
            setError(
                error.response?.data?.message || 
                "Failed to send message"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Contact Me</h2>

            <form onSubmit={handleSubmit}>
            <input
             type="text"
             name="name"
             placeholder="Your Name"
             value={formData.name}
             onChange={handleChange}
             />


            <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            />

            <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            />

            {/* <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            /> */}

            <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            />

            <button type="submit" disabled={loading}> {loading ? "Sending..." : "Send Message"} </button>


            </form>

            {success && <P>{success}</P>}

            {error && <p>{error}</p>}
            
            
        </section>
    );

};

export default Contact;