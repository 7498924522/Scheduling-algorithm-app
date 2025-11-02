import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
function Wt() {
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
        <h1 className="text-black ">WAITING TIME</h1> <br />
        <p>
          {" "}
          <MdOutlineArrowRightAlt className="size-5 text-black" />{" "}
          <p>
            It’s how long a process waited before and between getting the CPU.
          </p>{" "}
        </p>
        <p>
          {" "}
          <MdOutlineArrowRightAlt className="size-5 text-black" />
          It refers to the total amount of time a process spends waiting in the
          ready queue before it can be executed on the CPU
        </p>
      </div>
    </div>
  );
}

export default Wt;
