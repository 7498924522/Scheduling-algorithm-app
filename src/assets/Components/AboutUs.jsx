import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftDoubleFill } from "react-icons/ri";

function AboutUs() {
  const navigate = useNavigate();

  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div>
      <button className="Back_button" onClick={Back}>
        <RiArrowLeftDoubleFill className="ml-6" /> BACK
      </button>
      <h2>About Us</h2>
     
    </div>
  );
}

export default AboutUs;
