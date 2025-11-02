import React from 'react'
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { RiArrowLeftDoubleFill } from "react-icons/ri";

function At() {
  const navigate = useNavigate();
  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return(
    <div>
      <button className='Back_button' onClick={Back}><RiArrowLeftDoubleFill className='ml-6' />EXIT</button>
      <div className='INFOR'>

        <h1 className='text-black text'>ARRIVAL TIME</h1>
        <h2 className='text-black'>So What is Mean By Arrival Time</h2>
        <div>
          <p> < MdOutlineArrowRightAlt className='size-5 text-black' />The time at which a process enters the ready queue and is ready to be executed by the CPU.</p>
          <p> < MdOutlineArrowRightAlt className='size-5 text-black' />It determines when a process becomes available for execution..</p>

        </div>

      </div>
    </div>
  )
}

export default At
