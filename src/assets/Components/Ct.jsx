import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { RiArrowLeftDoubleFill } from "react-icons/ri";

function Ct() {
  const navigate = useNavigate();
  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <div>
      <button className="Back_button" onClick={Back}>
        <RiArrowLeftDoubleFill className="ml-6" />
        EXIT
      </button>
      <div className="INFOR">
        <h1 className="text-black text">COMPLETION TIME</h1>
        <h2 className="text-black">So What is Mean By Completion Time</h2>
        <div>
          <p>
            {" "}
            <MdOutlineArrowRightAlt className="size-5 text-black" />
            Completion Time is the time at which a process finishes its
            execution  that is, the moment the CPU finishes processing the last
            instruction of that process.
          </p>
          <p>
            {" "}
            <MdOutlineArrowRightAlt className="size-5 text-black" />
            It's the clock time (in milliseconds, seconds, etc.) when a process
            completes its work on the CPU.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Ct;
