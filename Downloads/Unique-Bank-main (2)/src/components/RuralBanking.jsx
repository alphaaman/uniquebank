import React, { useState } from "react";
import "./RuralBanking.css";
import SimpleSlider from "./Swiper";

const Popup = ({ text, closePopup }) => {
  return (
    <div className="popup">
      <div className="popup_inner">
        <h1 className="popup-heading">{text}</h1>
        <button className="popup-close-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
};

const RuralBanking = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  return (
    <div className="rural-banking">
      <SimpleSlider />
      <div className="rural-banking-card">
        <div className="feature-card">
          <span className="feature-card-title">Insurance</span>
          <button onClick={togglePopup} className="feature-card-button">
            Explore
          </button>
          {showPopup ? (
            <Popup text="INSURANCE" closePopup={togglePopup} />
          ) : null}
        </div>
        <div className="feature-card">
          <span className="feature-card-title">Loans</span>
          <button onClick={togglePopup} className="feature-card-button">
            Explore
          </button>
          {showPopup ? (
            <Popup text="Loans" closePopup={togglePopup} />
          ) : null}
        </div>
        <div className="feature-card">
          <span className="feature-card-title">Investment</span>
          <button onClick={togglePopup} className="feature-card-button">
            Explore
          </button>
          {showPopup ? (
            <Popup text="Investment" closePopup={togglePopup} />
          ) : null}
        </div>
        <div className="feature-card">
          <span className="feature-card-title">Free Laptop Scheme</span>
          <button onClick={togglePopup} className="feature-card-button">
            Explore
          </button>
          {showPopup ? (
            <Popup text="Free Laptop Scheme" closePopup={togglePopup} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default RuralBanking;
