import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { RiArrowLeftDoubleFill } from "react-icons/ri";

function Nonpreemptive() {
    const navigate=useNavigate();
    const Back=(e)=>
    {
        e.preventDefault();
        navigate(-1);
    };
  return (
    <div>
     <button className='Back_button' onClick={Back}><RiArrowLeftDoubleFill className='ml-6' />EXIT</button>
     <div className='INFOR'>
             <h1 className='text-black text'>NON-PRE-EMPTIVE</h1>
             <p> Non-preemptive scheduling is a CPU scheduling method in which once a process starts executing, it cannot be interrupted. The CPU is released only when the process finishes or goes into waiting state.</p>
             <p>EX:- 1. First Come First Serve (FCFS)
                     2. Shortest Job First (SJF)
             </p>
             <br />
            <h3> <MdOutlineArrowRightAlt/> In Simple,, <br /> When Process Ready For Excecution or in Excetution That Time Another Process Can Not Interrupt While That Particular Process Completly Excecute First. </h3>
     
           </div>
            <div className='INFOR'>
                   <h1 className='text-black text'>PRE-EMPTIVE</h1>
                   <p> Preemptive scheduling is a CPU scheduling method in which the operating system can stop <u>(preempt)</u> a running process and give the CPU to another process, usually because of higher priority or time limit.</p>
                   <p>EX:- 
                     1. Round Robin 
                     2. Shortest Remaining Time First (SRTF)
                   </p>
                   
                  <h3> <MdOutlineArrowRightAlt/> In Simple,, <br /> When Process Ready For Excecution or in Excetution That Time Another Process Can Interrupt. </h3>
           
                 </div>
    </div>
  )
}

export default Nonpreemptive
