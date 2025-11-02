import React from 'react'
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

function ContactUs() {
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
          <h2>Contact Us</h2>
        </div>
  )
}

export default ContactUs
