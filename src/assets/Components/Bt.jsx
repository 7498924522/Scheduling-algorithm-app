import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { RiArrowLeftDoubleFill } from "react-icons/ri";

function Bt() {
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
        <h1 className="text-black text">BURST TIME </h1>
        <h2 className="text-black">So What is Mean By Burst Time</h2>
        <div>
          <p>
            {" "}
            <MdOutlineArrowRightAlt className="size-5 text-black" />
            Burst Time{" "}
            <u className="text-black">
              (also called Execution Time or CPU Burst)
            </u>{" "}
            is the total time a process needs the CPU to complete its execution,
            without any interruption.
          </p>
          <p>
            {" "}
            <MdOutlineArrowRightAlt className="size-5 text-black" />
            It's the amount of time the process will take on the CPU, from start
            to finish, assuming it gets the CPU and doesn't get blocked or
            paused..
          </p>

        </div>
      </div>
    </div>
  );
}

export default Bt;
