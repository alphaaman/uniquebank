import React, { useState } from "react";
import backgroundImage from "../assets/ContactUs.png";
import { getToken } from "../services/LocalStorageService";
import { sendEmailToBank } from "../services/userService";
import { ToastContainer,toast } from "react-toastify";
const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    const input = e.target.value;
    if (input.length <= 100) {
      setMessage(input);
      setErrorMessage("");
    } else {
      setMessage(input.slice(0, 100));
      setErrorMessage("Maximum character limit exceeded (125 characters)");
    }
  };
  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const values={
      
    "to":"t8361242@gmail.com",
    "subject":email,
    "message":message
    }
    const response = await sendEmailToBank(values,config)
    toast.success('Your message has been sent to our Bank. We will get back to you as soon as possible');
    // Perform any necessary actions with the email and message values
    console.log("Email:", email);
    console.log("Message:", message);

    // Reset the form
    setEmail("");
    setMessage("");
    setErrorMessage("");
  };

  return (
    <>
    <ToastContainer/>
    <div
      style={{
        textAlign: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "black",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Contact Us</h2>
        <h3>We would love to hear from you!</h3>
        <p>
          If you have any questions, feedback, or inquiries, please don't hesitate
          to get in touch with us.
        </p>
        <p>
          You can reach us via phone, email, or by visiting one of our branches.
          Our dedicated customer support team is available to assist you with any
          banking-related queries.
        </p>
        <p>
          We look forward to serving you and providing the best banking experience
          possible.
        </p>

        <h3>Send us a message</h3>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label htmlFor="email" style={{ marginBottom: "5px" }}>
              <b>Email:</b>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label htmlFor="message" style={{ marginBottom: "5px" }}>
              <b>Message:</b>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              required
              style={{ minHeight: "150px", minWidth: "300px" }}
            />
          </div>
          {errorMessage && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
          )}
          <div>
            <button type="submit" style={{ fontWeight: "bold" }}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
