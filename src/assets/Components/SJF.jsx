import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { FaHandPointRight } from "react-icons/fa";
import { FcIdea } from "react-icons/fc";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";


function SJF() {
  const [processes, setProcesses] = useState([]);
  const [at, setAt] = useState("");
  const [bt, setBt] = useState("");
  const [showGantt, setShowGantt] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const navigate = useNavigate();
  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  const EntryPsjf = (e) => {
    e.preventDefault();
    if (e.target.value === "preemptive") {
      //alert("You want to perform preemptive scheduling")
      navigate("/Psjf");
    }
  };

  const addProcess = () => {
    if (at === "" || bt === "") {
      alert("Please enter both AT and BT");
      return;
    } else if (at < 0 || bt < 0) {
      alert("Do not enter negative values");
      return;
    } else if (at > 15 || bt > 15) {
      alert("Please enter values between 0-15");
      return;
    }

    const newProcess = {
      id: processes.length + 1,
      at: parseInt(at),
      bt: parseInt(bt),
    };

    setProcesses([...processes, newProcess]);
    setAt("");
    setBt("");
  };

  const Table = () => {
    setShowSolution(!showSolution);
  };

  // ------------------------------------------------------------------
  // UPDATED: computeGanttData to include Ready Queue tracking for SJF Non-Preemptive
  // ------------------------------------------------------------------
  const computeGanttData = () => {
    // Deep copy and sort by Arrival Time first to ensure correct queueing
    let sortedProcesses = [...processes].sort((a, b) => a.at - b.at);
    let currentTime = 0;
    let gantt = [];
    let completedIDs = new Set();
    const n = sortedProcesses.length;
    let processIndex = 0;
    let readyQueue = []; // Holds process objects that have arrived but haven't started

    while (completedIDs.size < n) {

      // 1. Add newly arrived processes to the Ready Queue
      while (processIndex < n && sortedProcesses[processIndex].at <= currentTime) {
        readyQueue.push(sortedProcesses[processIndex]);
        processIndex++;
      }

      if (readyQueue.length === 0) {
        // CPU idle till next process arrives
        const nextUnstartedProcess = sortedProcesses.find(p => !completedIDs.has(p.id));

        if (!nextUnstartedProcess) break; // All processes are accounted for

        let nextArrivalTime = nextUnstartedProcess.at;

        gantt.push({
          id: `idle-${currentTime}`,
          process: "Idle",
          start: currentTime,
          end: nextArrivalTime,
          isIdle: true,
          queueBefore: [], // Ready Queue is empty during idle
        });
        currentTime = nextArrivalTime;
        continue;
      }

      // 2. SJF Selection (Sort Ready Queue by BT)
      readyQueue.sort((a, b) => a.bt - b.bt);

      // 3. Select the shortest job
      let nextProcess = readyQueue.shift();

      // 4. Capture the Ready Queue state *before* execution starts
      // The queueBefore includes the process being executed, followed by the rest of the waiting queue.
      const queueBeforeSnapshot = [
        { id: nextProcess.id },
        ...readyQueue.map(p => ({ id: p.id }))
      ];

      // 5. Execute (Non-Preemptive)
      let start = currentTime;
      let end = start + nextProcess.bt;

      gantt.push({
        ...nextProcess,
        start,
        end,
        isIdle: false,
        queueBefore: queueBeforeSnapshot, // Attach snapshot to the Gantt block
      });

      currentTime = end;
      completedIDs.add(nextProcess.id);
    }

    return gantt;
  };
  // ------------------------------------------------------------------

  const ganttData = computeGanttData();

  const totalTat = ganttData
    .filter((p) => !p.isIdle)
    .reduce((sum, p) => sum + (p.end - p.at), 0);
  const avgTat = processes.length > 0 ? (totalTat / processes.length).toFixed(2) : 0;

  const totalWt = ganttData
    .filter((p) => !p.isIdle)
    .reduce((sum, p) => sum + (p.end - p.at - p.bt), 0);
  const avgWt = processes.length > 0 ? (totalWt / processes.length).toFixed(2) : 0;

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 md:gap-6 lg:gap-4 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
        <button className="flex items-center font-semibold text-sm sm:text-base bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition" onClick={Back}>
          <ArrowLeft className="mr-2" size={20} /> EXIT
        </button>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Mode :-
          <u>
            <select
              className="rounded-md   text-white text-center bg-gray-300"
              onChange={EntryPsjf}
            >
              <option>Non-Pre-Emptive</option>
              <option value="preemptive" >
                Pre-Emptive
              </option>
            </select>
          </u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Criteria: <u className="text-red-500">Burst Time</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          T-A-T: <u className="text-red-500">CT - AT</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          W-T: <u className="text-red-500">TAT - BT</u>
        </h2>
      </div>

      <marquee
        className="text-black bg-yellow-100 rounded-md mt-7 p-1"
        direction="left"
      >
        <u>Less</u> Burst Time Executes First (SJF - Non Preemptive).
      </marquee>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mt-8 sm:mt-12 md:mt-16 text-black">
        CPU Process Manager (SJF)
      </h2>

      {/* Input Fields - Responsive */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center my-4 sm:my-6 px-2">
        <input
          type="number"
          placeholder="Arrival Time"
          value={at}
          onChange={(e) => setAt(e.target.value)}
          className="border-2 border-blue-100 p-2 rounded w-full sm:w-auto text-sm sm:text-base"
        />
        <input
          type="number"
          placeholder="Burst Time"
          value={bt}
          onChange={(e) => setBt(e.target.value)}
          className="border-2 border-blue-100 p-2 rounded w-full sm:w-auto text-sm sm:text-base"
        />
        <button
          onClick={addProcess}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base hover:bg-blue-600 transition"
        >
          Add Process
        </button>
      </div>

      <div className="mt-14 flex gap-2">
        <button className="bg-purple-600 text-white px-3 py-1 rounded font-bold border-2 border-white">
          User Input Table
        </button>
      </div>

      {/* Process List Table - User Input table*/}
      {processes.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-2">
          <thead>
            <tr className="bg-red-400 h-8">
              <th className="border px-2 text-center border-black">Process</th>
              <th className="border px-2 text-center border-black">
                Arrival Time (AT) ms
              </th>
              <th className="border px-2 text-center border-black">
                Burst Time (BT) ms
              </th>
            </tr>

          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 bg-cyan-200 text-center border-black">
                  P{p.id}
                </td>
                <td className="border px-2 bg-cyan-200 text-center border-black">
                  {p.at} ms
                </td>
                <td className="border px-2 bg-cyan-200 text-center border-black">
                  {p.bt} ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black text-2xl mt-3 text-center font-serif ml-16">
          No processes added yet..
        </p>
      )}

      {/* Gantt Chart Button */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowGantt(!showGantt)}
          className="bg-green-500 text-white px-3 py-2 rounded mt-10 font-bold"
        >
          {showGantt ? "Hide Gantt Chart" : "Generate Gantt Chart"}
        </button>
      </div>

      {/* Gantt Chart with Ready Queue */}
      {showGantt && ganttData.length > 0 && (
        <div className="mt-2 bg-red-400 h-auto py-6 p-4 border-2 rounded-md">


          <h2 className="text-lg font-bold text-center text-white">
            Gantt Chart
          </h2>
          <div className="flex items-center gap-1 justify-center mt-6">
            {ganttData.map((p, i) => (
              <div
                key={i}
                className={`${p.isIdle ? "bg-gray-500" : "bg-green-500"
                  } text-white font-bold text-lg text-center rounded shadow relative h-8 w-32`}
              >
                {p.isIdle ? "IDLE" : `P${p.id}`}
                <div className="absolute -bottom-6 left-0 text-white font-bold text-lg">
                  {p.start}
                </div>
                <div className="absolute -bottom-6 right-0 text-white font-bold text-lg">
                  {p.end}
                </div>
              </div>
            ))}
          </div>

          {/* Here we get the idea about the is it process idle or not or also how many time period. */}
          <div className="mt-8">
            {ganttData.map((p, i) =>
              p.isIdle ? (
                <marquee
                  key={p.id}
                  behavior="alternate"
                  className=" text-lg font-bold text-white"
                >
                  The CPU is not doing any work at{" "}
                  <u className="text-black">{p.start}</u> ms to{" "}
                  <u className="text-black">{p.end}</u> ms{" "}
                  <u className="text-black"> --- IDLE ---</u>
                </marquee>
              ) : null
            )}
          </div>

          <hr className="border-t-2 border-white mt-3" />


          {/*Represent the ready queue here,,,,means how many processes in ready queue */}
          <div className="flex flex-col justify-center p-3 rounded-md bg-cyan-300 mt-8 ">

            <div className="border-2 border-black p-2 sm:p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-black font-semibold text-sm sm:text-base md:text-lg">BASIC IDEA</h3>
                <Lightbulb className="text-yellow-500" size={20} />
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-medium">* EXECUTING PROCESSES</p>
                  <ArrowRight size={16} />
                  <span className="text-black font-semibold px-2 py-1 rounded bg-green-300 border-2 border-black whitespace-nowrap">PROCESS</span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-medium">** READY PROCESSES</p>
                  <ArrowRight size={16} />
                  <span className="text-black font-semibold px-2 py-1 rounded bg-white border-2 border-black whitespace-nowrap">PROCESS</span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-medium">*** IDLE PROCESSES</p>
                  <ArrowRight size={16} />
                  <span className="text-black font-semibold px-2 py-1 rounded bg-yellow-100 border-2 border-black whitespace-nowrap">PROCESS</span>
                </div>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2 mt-5 text-center text-black  ">
              Ready Queue Timeline
            </h2>
            <div className="flex items-start justify-center gap-1 w-full overflow-x-auto p-2">
              {ganttData.map((p, idx) => {

                const readyQueueProcesses = p.queueBefore?.map((proc, index) => {

                  const isSelected = index === 0 && !p.isIdle;

                  return (
                    <div
                      key={`rq-${idx}-${proc.id}`}
                      className={`text-black font-semibold mx-1 p-1 rounded w-full text-center ${isSelected ? 'bg-green-300 line-through' : 'bg-white'}`}
                    >
                      P{proc.id}
                    </div>
                  );
                });

                return (
                  <div
                    key={`rq-block-${idx}`}
                    className="flex flex-col items-center w-32 border border-dotted border-black rounded-sm p-1"
                    style={{ minHeight: '100px' }}
                  >
                    <span className="text-black text-sm font-bold mb-1 ">
                      {p.isIdle ? 'IDLE' : `P${p.id} EXECUTE`}
                    </span>
                    <div className="bg-gray-400 p-1 rounded min-h-8 flex flex-col items-center justify-center flex-grow w-full gap-1">
                      {p.isIdle ? (
                        <span className="text-black font-semibold p-1 rounded w-full text-center bg-yellow-100">No Process</span>
                      ) : (
                        readyQueueProcesses && readyQueueProcesses.length > 0 ? (
                          readyQueueProcesses
                        ) : (<span className="text-black text-xs">Empty</span>)
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>


        </div>
      )}

      {/* Solution Table Button */}
      <div className="mt-8 sm:mt-10 md:mt-14 flex gap-2">
        <button
          onClick={Table}
          className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-xs sm:text-sm md:text-base hover:bg-purple-700 transition"
        >
          Show Solution Table
        </button>
      </div>

      {/* Solution Table */}
      {showSolution && ganttData.length > 0 && (
        <div className="mt-5 bg-red-400 p-3 sm:p-4 rounded-md border-2 border-white">

          <h2 className="text-sm sm:text-lg font-bold mb-4 text-center text-black">
            Solution Table (SJF NON Pre-emptive Scheduling)
          </h2>

          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-400 w-full text-xs sm:text-sm md:text-base min-w-[500px]">
              <thead>
                <tr className="bg-red-400 h-8 sm:h-10 text-[10px] sm:text-sm">
                  <th className="border px-2 sm:px-4 border-black">Process</th>
                  <th className="border px-2 sm:px-4 border-black">Arrival Time (ms)</th>
                  <th className="border px-2 sm:px-4 border-black">Burst Time (ms)</th>
                  <th className="border px-2 sm:px-4 border-black">Completion Time (ms)</th>
                  <th className="border px-2 sm:px-4 border-black">Turn Around Time (CT-AT)</th>
                  <th className="border px-2 sm:px-4 border-black">Waiting Time (TAT-BT)</th>
                </tr>
              </thead>

              <tbody>
                {[...ganttData]
                  .filter((p) => !p.isIdle)
                  .sort((a, b) => a.id - b.id)
                  .map((p) => {
                    const tat = p.end - p.at;
                    const wt = tat - p.bt;
                    return (
                      <tr key={p.id} className="text-center">
                        <td className="border px-1 sm:px-2 bg-cyan-200 border-black">P{p.id}</td>
                        <td className="border px-1 sm:px-2 bg-cyan-200 border-black">{p.at} ms</td>
                        <td className="border px-1 sm:px-2 bg-cyan-200 border-black">{p.bt} ms</td>
                        <td className="border px-1 sm:px-2 bg-cyan-200 border-black">{p.end} ms</td>
                        <td className="border px-1 sm:px-2 bg-cyan-200 border-black">{tat} ms</td>
                        <td className="border px-1 sm:px-2 bg-cyan-200 border-black">{wt} ms</td>
                      </tr>
                    );
                  })}

                <tr className="bg-yellow-300 font-bold text-center">
                  <td className="border px-1 sm:px-2 border-black" colSpan="4">
                    Average
                  </td>
                  <td className="border px-1 sm:px-2 border-black">{avgTat} ms</td>
                  <td className="border px-1 sm:px-2 border-black">{avgWt} ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Basic Formula about the Average Information */}
      <div className="mt-6 sm:mt-8 md:mt-10 space-y-4">
        <div className="bg-red-300 p-3 sm:p-4 rounded-lg">
          <h2 className="font-bold text-sm sm:text-base md:text-lg mb-2">Average Turn Around Time:</h2>
          <p className="text-white font-bold text-xs sm:text-sm md:text-base">
            Total Turn Around Time of All Processes / Number Of Processes
          </p>
        </div>
        <div className="bg-red-300 p-3 sm:p-4 rounded-lg">
          <h2 className="font-bold text-sm sm:text-base md:text-lg mb-2">Average Waiting Time:</h2>
          <p className="text-white font-bold text-xs sm:text-sm md:text-base">
            Total Waiting Time of All Processes / Number Of Processes
          </p>
        </div>
      </div>
    </div>
  );
}

export default SJF;