import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";

function FCFS() {
  // Load from session storage on mount
  const [processes, setProcesses] = useState(() => {
    const saved = sessionStorage.getItem('fcfs-processes');
    return saved ? JSON.parse(saved) : [];
  });

  const [at, setAt] = useState(() => {
    return sessionStorage.getItem('fcfs-at') || "";
  });

  const [bt, setBt] = useState(() => {
    return sessionStorage.getItem('fcfs-bt') || "";
  });

  const [showGantt, setShowGantt] = useState(() => {
    return sessionStorage.getItem('fcfs-showGantt') === 'true';
  });

  const [showSolution, setShowSolution] = useState(() => {
    return sessionStorage.getItem('fcfs-showSolution') === 'true';
  });

  const navigate = useNavigate();

  // Save to session storage whenever state changes
  useEffect(() => {
    sessionStorage.setItem('fcfs-processes', JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    sessionStorage.setItem('fcfs-at', at);
  }, [at]);

  useEffect(() => {
    sessionStorage.setItem('fcfs-bt', bt);
  }, [bt]);

  useEffect(() => {
    sessionStorage.setItem('fcfs-showGantt', showGantt);
  }, [showGantt]);

  useEffect(() => {
    sessionStorage.setItem('fcfs-showSolution', showSolution);
  }, [showSolution]);

  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const clearAll = () => {
    // Clear all state
     if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
  
    setProcesses([]);
    setAt("");
    setBt("");
    setShowGantt(false);
    setShowSolution(false);

    // Clear session storage
    sessionStorage.removeItem('fcfs-processes');
    sessionStorage.removeItem('fcfs-at');
    sessionStorage.removeItem('fcfs-bt');
    sessionStorage.removeItem('fcfs-showGantt');
    sessionStorage.removeItem('fcfs-showSolution');
  }
};

  // Validation remains the same
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
      // Add original properties for easy reference
      remaining: parseInt(bt),
    };

    setProcesses([...processes, newProcess]);
    setAt("");
    setBt("");
  };

  const Table = () => {
    setShowSolution(!showSolution);
  };

  // UPDATED: computeGanttData to include Ready Queue tracking for FCFS
  const computeGanttData = () => {
    // 1. Prepare and sort processes by Arrival Time (AT)
    const processesCopy = [...processes].sort((a, b) => a.at - b.at);

    const gantt = [];
    let currentTime = 0;
    const readyQueue = [];
    const completedProcesses = [];
    let processIndex = 0;

    while (completedProcesses.length < processes.length) {
      // A. Move newly arrived processes into the Ready Queue
      while (processIndex < processesCopy.length && processesCopy[processIndex].at <= currentTime) {
        readyQueue.push(processesCopy[processIndex]);
        processIndex++;
      }

      if (readyQueue.length === 0) {
        // B. CPU Idle - No processes ready

        // Find the next arriving process
        const nextArrival = processesCopy[processIndex] ? processesCopy[processIndex].at : null;

        if (nextArrival !== null) {
          const idleStart = currentTime;
          currentTime = nextArrival;

          gantt.push({
            id: `idle-${idleStart}`,
            process: "Idle",
            start: idleStart,
            end: currentTime,
            isIdle: true,
            // Ready Queue is empty during idle time
            queueBefore: [],
          });
          // Re-check arrivals now that time has advanced
          continue;
        } else {
          // No more processes to run or arrive
          break;
        }
      } else {
        // C. Execute the next process from the Ready Queue (FCFS logic)

        const p = readyQueue.shift(); // Get the process at the front

        const start = currentTime;
        const end = start + p.bt;

        // Snapshot of the queue *before* the process is executed
        const queueSnapshot = [{ id: p.id }, ...readyQueue.map(q => ({ id: q.id }))];

        // Record the Gantt block
        gantt.push({
          ...p,
          start,
          end,
          isIdle: false,
          queueBefore: queueSnapshot, // Capture P(id) of all processes in the queue (including p)
        });

        // Update system time and completion status
        currentTime = end;
        completedProcesses.push(p);

        // D. Check for new arrivals again since time has advanced
        while (processIndex < processesCopy.length && processesCopy[processIndex].at <= currentTime) {
          readyQueue.push(processesCopy[processIndex]);
          processIndex++;
        }
      }
    }

    return gantt;
  };

  const ganttData = computeGanttData();

  // Recalculate Total and Avg TAT/WT using the final ganttData
  // Ensure we only consider *actual* processes, not idle blocks
  const completedProcesses = ganttData.filter((p) => !p.isIdle);

  const TotalTat = completedProcesses.reduce((pre, q) => pre + (q.end - q.at), 0);
  const AvgTat = processes.length > 0 ? (TotalTat / processes.length).toFixed(2) : 0;

  const totalWt = completedProcesses.reduce(
    (prev, p) => prev + (p.end - p.at - p.bt),
    0
  );
  const AvgWt = processes.length > 0 ? (totalWt / processes.length).toFixed(2) : 0;

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 md:gap-6 lg:gap-1 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
        <button className="flex items-center font-semibold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 mt-2  rounded-lg hover:bg-blue-600 transition" onClick={Back}>
          <ArrowLeft className="mr-2" size={20} /> EXIT
        </button>

        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Mode: <u className="text-red-500">Non-Pre-Emptive</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Criteria: <u className="text-red-500">Arrival Time</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          T-A-T: <u className="text-red-500">CT - AT</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          W-T: <u className="text-red-500">TAT - BT</u>
        </h2>
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mt-8 sm:mt-12 md:mt-16 text-black">
        CPU Process Manager (FCFS)
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


      <div className="mt-2 sm:mt-10 md:mt-2 flex gap-2">
        <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded font-bold border-2 border-white transition-all  text-xs sm:text-sm md:text-base">
          User Input Table
        </button>
      </div>


      {/* Process List Table - Responsive */}
      {processes.length > 0 ? (
        <div className="overflow-x-auto mt-2">
          <table className="border-collapse border border-gray-400 w-full min-w-[300px]">
            <thead>
              <tr className="bg-red-400 h-8">
                <th className="border px-2 text-center border-black text-xs sm:text-sm md:text-base">Process</th>
                <th className="border px-2 text-center border-black text-xs sm:text-sm md:text-base">
                  Arrival Time (AT) ms
                </th>
                <th className="border px-2 text-center border-black text-xs sm:text-sm md:text-base">
                  Burst Time (BT) ms
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.id}>
                  <td className="border px-2 bg-cyan-200 text-center border-black text-xs sm:text-sm md:text-base">
                    P{p.id}
                  </td>
                  <td className="border px-2 bg-cyan-200 text-center border-black text-xs sm:text-sm md:text-base">
                    {p.at} ms
                  </td>
                  <td className="border px-2 bg-cyan-200 text-center border-black text-xs sm:text-sm md:text-base">
                    {p.bt} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-black text-lg sm:text-xl md:text-2xl mt-3 text-center font-serif">
          No processes added yet..
        </p>
      )}

      {/* Gantt Chart Button */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowGantt(!showGantt)}
          className="bg-green-500 text-white px-3 py-2 rounded mt-6 sm:mt-8 md:mt-10 font-bold text-xs sm:text-sm md:text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 transition"
        >
          {showGantt ? "Hide Gantt Chart" : "Generate Gantt Chart"}
        </button>
      </div>

      {/* Gantt Chart - Responsive */}
      {showGantt && ganttData.length > 0 && (
        <div className="mt-2 bg-red-400 py-4 sm:py-6 border-2 p-2 sm:p-4 rounded-md">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-center text-white">
            Gantt Chart
          </h2>

          <div className="overflow-x-auto mt-4 sm:mt-6 pb-8">
            <div className="flex items-center gap-1 justify-start sm:justify-center min-w-max px-2">
              {ganttData.map((p, i) => (
                <div
                  key={i}
                  className={`${p.isIdle ? "bg-gray-500" : "bg-green-500"
                    } text-white font-bold text-sm sm:text-base md:text-lg text-center rounded shadow relative h-8 sm:h-10 w-24 sm:w-32 flex-shrink-0`}
                >
                  <div className="flex items-center justify-center h-full">
                    {p.isIdle ? "IDLE" : `P${p.id}`}
                  </div>
                  <div className="absolute -bottom-6 left-0 text-white font-bold text-xs sm:text-sm md:text-base">
                    {p.start}
                  </div>
                  <div className="absolute -bottom-6 right-0 text-white font-bold text-xs sm:text-sm md:text-base">
                    {p.end}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Idle Messages */}
          <div className="mt-10 sm:mt-14">
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

          {/* Ready Queue Display - Responsive */}
          <div className="flex flex-col justify-center p-2 sm:p-4 rounded-md bg-cyan-300 mt-6 sm:mt-8">
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

            <h2 className="text-base sm:text-lg md:text-xl font-bold text-center text-black mt-6 sm:mt-10">
              Ready Queue Timeline
            </h2>
            <div className="flex flex-col items-center mb-5 mt-4">
              <div className="overflow-x-auto w-full">
                <div className="flex items-start justify-start sm:justify-center gap-1 min-w-max p-2">
                  {ganttData.map((p, idx) => {
                    const readyQueueProcesses = p.queueBefore.map((proc, index) => {
                      const isExecuted = index === 0 && !p.isIdle;

                      return (
                        <div
                          key={`rq-${idx}-${proc.id}`}
                          className={`text-black font-semibold mx-1 p-1 rounded w-full text-center text-xs sm:text-sm ${isExecuted ? 'bg-green-300 line-through' : 'bg-white'}`}
                        >
                          P{proc.id}
                        </div>
                      );
                    });

                    return (
                      <div
                        key={`rq-block-${idx}`}
                        className="flex flex-col items-center w-24 sm:w-32 border border-dotted border-black rounded-sm p-1 flex-shrink-0"
                        style={{ minHeight: '100px' }}
                      >
                        <span className="text-black text-xs sm:text-sm font-bold mb-1 text-center">
                          {p.isIdle ? 'IDLE' : `P${p.id} EXECUTE`}
                        </span>
                        <div className="bg-gray-400 p-1 rounded min-h-8 flex flex-col items-center justify-center flex-grow w-full gap-1">
                          {p.isIdle ? (
                            <span className="text-black font-semibold p-1 rounded w-full text-center bg-yellow-100 text-xs sm:text-sm">No Process</span>
                          ) : (
                            readyQueueProcesses.length > 0 ? (
                              readyQueueProcesses
                            ) : (
                              <span className="text-black text-xs">Empty</span>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solution Table Button */}
      <div className="mt-8 sm:mt-10 md:mt-14 flex gap-2">
        <button
          onClick={Table}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded font-bold text-xs sm:text-sm md:text-base  transition"
        >
          Show Solution Table
        </button>
      </div>

      {/* Solution Table - Responsive */}
      {showSolution && processes.length > 0 && (
        <div className="mt-5 bg-red-400 p-2 sm:p-4 rounded-md border-2 border-white">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 text-center text-black">
            Solution Table (FCFS Scheduling)
          </h2>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-400 w-full min-w-[600px]">
              <thead>
                <tr className="bg-red-400 h-10">
                  <th className="border px-2 sm:px-4 border-black text-xs sm:text-sm md:text-base">Process</th>
                  <th className="border px-2 sm:px-4 border-black text-xs sm:text-sm md:text-base">Arrival Time (ms)</th>
                  <th className="border px-2 sm:px-4 border-black text-xs sm:text-sm md:text-base">Burst Time (ms)</th>
                  <th className="border px-2 sm:px-4 border-black text-xs sm:text-sm md:text-base">
                    Completion Time (ms)
                  </th>
                  <th className="border px-2 sm:px-4 border-black text-xs sm:text-sm md:text-base">
                    Turn Around Time (CT-AT) (ms)
                  </th>
                  <th className="border px-2 sm:px-4 border-black text-xs sm:text-sm md:text-base">
                    Waiting Time (TAT-BT) (ms)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ganttData
                  .filter((p) => !p.isIdle)
                  .sort((a, b) => a.id - b.id)
                  .map((p) => {
                    const tat = p.end - p.at;
                    const wt = tat - p.bt;
                    return (
                      <tr key={p.id}>
                        <td className="border px-2 text-center bg-cyan-200 border-black text-xs sm:text-sm md:text-base">
                          P{p.id}
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black text-xs sm:text-sm md:text-base">
                          {p.at} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black text-xs sm:text-sm md:text-base">
                          {p.bt} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black text-xs sm:text-sm md:text-base">
                          {p.end} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black text-xs sm:text-sm md:text-base">
                          {tat} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black text-xs sm:text-sm md:text-base">
                          {wt} ms
                        </td>
                      </tr>
                    );
                  })}

                <tr className="bg-yellow-300 font-bold text-center">
                  <td className="border px-2 border-black text-xs sm:text-sm md:text-base" colSpan="4">
                    Average
                  </td>
                  <td className="border px-2 border-black text-xs sm:text-sm md:text-base">{AvgTat} ms</td>
                  <td className="border px-2 border-black text-xs sm:text-sm md:text-base">{AvgWt} ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}


      <div className="text-center">

        <button
          className="mt-8 sm:mt-10 md:mt-8 flex items-center gap-2 font-bold text-sm sm:text-base bg-gradient-to-b from-red-400 to-red-600 text-white px-5 py-2 rounded-lg 
          "
          onClick={clearAll}
        >
          <RiDeleteBinLine className="w-5 h-5" />
          CLEAR ALL
        </button>
      </div>

      {/* Information Boxes - Responsive */}
      <div className="mt-6 sm:mt-8 md:mt-10 space-y-6">
        {/* Average Turn Around Time */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl">

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-bold text-white text-lg sm:text-xl md:text-2xl">
                Average Turn Around Time
              </h2>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white border-opacity-30">
              <p className="text-white text-center font-semibold text-sm sm:text-base md:text-lg leading-relaxed">
                <span className="block mb-2 text-yellow-200">Formula:-</span>
                <span className="font-mono bg-white bg-opacity-20 px-4 py-2 rounded-lg inline-block">
                  Σ Turn Around Time ÷ Number of Processes
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Average Waiting Time */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl">

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="font-bold text-white text-lg sm:text-xl md:text-2xl">
                Average Waiting Time
              </h2>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white border-opacity-30">
              <p className="text-white text-center font-semibold text-sm sm:text-base md:text-lg leading-relaxed">
                <span className="block mb-2 text-yellow-200">Formula:-</span>
                <span className="font-mono bg-white bg-opacity-20 px-4 py-2 rounded-lg inline-block">
                  Σ Waiting Time ÷ Number of Processes
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FCFS;