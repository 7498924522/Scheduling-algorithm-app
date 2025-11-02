import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
function Tat() {
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
        <h1 className="text-black text">TURN AROUND TIME</h1>
        <h2 className="text-black">So What is Mean By Completion Time</h2>
        <div>
          <p>
            {" "}
            <MdOutlineArrowRightAlt className="size-5 text-black" />
            Turnaround Time (TAT) is the total time taken by a process from the
            moment it arrives in the ready queue to the time it completes
            execution.
          </p>
          <p>
            {" "}
            <MdOutlineArrowRightAlt className="size-5 text-black" />
            It’s the total time a process spends in the system, 
            <br />
            including:- <br />
            Waiting time in the ready queue  or even Execution (burst) time
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tat;
