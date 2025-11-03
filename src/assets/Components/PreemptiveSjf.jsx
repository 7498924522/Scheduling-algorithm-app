import React, { useState, useEffect } from "react"; // 👈 Import useEffect
import { useNavigate } from "react-router-dom";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { FaHandPointRight } from "react-icons/fa";
import { FcIdea } from "react-icons/fc";
import { ArrowLeft, ArrowRight, Lightbulb, Trash2 } from "lucide-react"; // 👈 Import Trash2 (or RiDeleteBinLine)
import { RiDeleteBinLine } from "react-icons/ri"; // 👈 Import RiDeleteBinLine (from original)

function PreemptiveSjf() {
  // ------------------------------------------------------------------
  // 💾 STATE PERSISTENCE: Load from session storage on mount
  // ------------------------------------------------------------------
  const [processes, setProcesses] = useState(() => {
    const saved = sessionStorage.getItem("psjf-processes");
    return saved ? JSON.parse(saved) : [];
  });

  const [at, setAt] = useState(() => {
    return sessionStorage.getItem("psjf-at") || "";
  });

  const [bt, setBt] = useState(() => {
    return sessionStorage.getItem("psjf-bt") || "";
  });

  const [ganttData, setGanttData] = useState(() => {
    const saved = sessionStorage.getItem("psjf-ganttData");
    return saved ? JSON.parse(saved) : [];
  });

  const [show, setShow] = useState(() => {
    return sessionStorage.getItem("psjf-show") === "true";
  });

  const [showT, setShowT] = useState(() => {
    return sessionStorage.getItem("psjf-showT") === "true";
  });

  const navigate = useNavigate();

  // ------------------------------------------------------------------
  // 💾 STATE PERSISTENCE: Save to session storage whenever state changes
  // ------------------------------------------------------------------
  useEffect(() => {
    sessionStorage.setItem("psjf-processes", JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    sessionStorage.setItem("psjf-at", at);
  }, [at]);

  useEffect(() => {
    sessionStorage.setItem("psjf-bt", bt);
  }, [bt]);

  useEffect(() => {
    sessionStorage.setItem("psjf-ganttData", JSON.stringify(ganttData));
  }, [ganttData]);

  useEffect(() => {
    sessionStorage.setItem("psjf-show", show);
  }, [show]);

  useEffect(() => {
    sessionStorage.setItem("psjf-showT", showT);
  }, [showT]);

  // ------------------------------------------------------------------
  // 🧹 CLEAR ALL FUNCTIONALITY
  // ------------------------------------------------------------------
  const clearAll = () => {
    // Clear all state
     if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
  
    setProcesses([]);
    setAt("");
    setBt("");
    setGanttData([]);
    setShow(false);
    setShowT(false);

    // Clear session storage
    sessionStorage.removeItem("psjf-processes");
    sessionStorage.removeItem("psjf-at");
    sessionStorage.removeItem("psjf-bt");
    sessionStorage.removeItem("psjf-ganttData");
    sessionStorage.removeItem("psjf-show");
    sessionStorage.removeItem("psjf-showT");
  }
};

  const addProcess = () => {
    if (at === "" || bt === "") {
      alert("Please enter both AT and BT");
      return;
    } else if (at < 0 || bt <= 0 || at > 15 || bt > 15) {
      alert("Invalid values! AT >= 0, 0 < BT <= 15");
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

  // ------------------------------------------------------------------
  // SJF Preemptive (SRTF) Logic (generateGantt - UNCHANGED)
  // ------------------------------------------------------------------
  const generateGantt = () => {
    if (processes.length === 0) return;

    let time = 0;
    // Initialize a mutable copy of processes for simulation
    let remaining = processes.map((p) => ({
      ...p,
      remaining: p.bt,
      completed: false,
    }));

    let gantt = [];
    let lastProcessId = null;

    while (remaining.some((p) => !p.completed)) {
      // 1. Identify all arrived and uncompleted processes (The Ready Queue)
      const available = remaining.filter((p) => p.at <= time && !p.completed);

      if (available.length === 0) {
        // CPU is idle
        if (lastProcessId !== "idle") {
          // Start new idle block
          gantt.push({
            process: "IDLE",
            start: time,
            queueBefore: [], // Ready Queue is empty during idle
          });
        }
        time++;
        lastProcessId = "idle";
        continue;
      }

      // Close idle block if CPU was idle just before
      if (lastProcessId === "idle") {
        gantt[gantt.length - 1].end = time;
      }

      // 2. SJF Selection (Shortest Remaining Time First)
      let current = available.reduce((min, p) =>
        p.remaining < min.remaining ? p : min
      );

      // Handle tie-breaking by AT, then ID
      if (current.id !== lastProcessId && lastProcessId !== null) {
        const currentProcess = remaining.find(p => p.id === lastProcessId);
        // If the currently running process has the same remaining time as the new shortest,
        // it keeps running due to tie-breaker and to avoid unnecessary context switch
        if (currentProcess && current.remaining === currentProcess.remaining) {
          current = currentProcess;
        }
      }


      // 3. Capture the Ready Queue state BEFORE execution/preemption decision
      // Sort the queue for display: Selected process (P_SJF) first, then others by ID for stability
      const queueSnapshot = available
        .sort((a, b) => {
          if (a.id === current.id) return -1; // Keep the chosen process at the start
          if (b.id === current.id) return 1;
          return a.id - b.id; // Sort others by ID
        })
        .map((p) => ({ id: p.id, remaining: p.remaining }));

      // 4. Gantt block start
      if (lastProcessId !== current.id) {
        // If the CPU switches to a new process (or back to a preempted one)
        gantt.push({
          process: `P${current.id}`,
          id: current.id,
          start: time,
          queueBefore: queueSnapshot, // Store the queue snapshot here
        });
      } else if (gantt.length > 0) {
        // If the same process is continuing, update the snapshot for the last block
        // This ensures the queue reflects its state at the *start* of the time unit.
        // This is only strictly needed for detailed time unit simulation
        // gantt[gantt.length - 1].queueBefore = queueSnapshot;
      }

      current.remaining--;
      time++;

      // 5. Preemption Check
      // Find the absolute shortest remaining job among arrived processes *at time + 1*
      const nextAvailable = remaining.filter((p) => p.at <= time && !p.completed);
      const nextCurrent = nextAvailable.reduce(
        (min, p) => (p.remaining < min.remaining ? p : min),
        current // Start comparison with the currently running process
      );

      // Secondary tie-breaker logic for display consistency
      let shouldPreempt = nextCurrent.id !== current.id;
      if (nextCurrent.remaining === current.remaining) {
        // If tie in remaining time, the currently running process is preferred
        shouldPreempt = false;
      }


      // Gantt block end if preemption occurs or process completed
      if (current.remaining === 0) {
        // Process finished
        const completedProcess = remaining.find((p) => p.id === current.id);
        completedProcess.completed = true;
        gantt[gantt.length - 1].end = time;
        lastProcessId = null;
      } else if (shouldPreempt) {
        // Preemption occurs
        gantt[gantt.length - 1].end = time;
        lastProcessId = null; // Forces a new block in the next iteration
      } else {
        // Continue the current block
        lastProcessId = current.id;
      }
    }

    // Finalize the last block if it wasn't closed
    if (gantt.length > 0 && !gantt[gantt.length - 1].end) {
      gantt[gantt.length - 1].end = time;
    }

    setGanttData(gantt);
  };
  // ------------------------------------------------------------------

  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const EntryNP = (e) => {
    e.preventDefault();
    if (e.target.value === "Non-preemptive") {
      navigate(-1);
    }
  };

  const Table = (e) => {
    e.preventDefault();
    setShowT(!showT);
  };

  return (
    <div className="p-4">
      {/* Header (UNCHANGED) */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 md:gap-6 lg:gap-1 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
        <button className="flex items-center font-semibold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 mt-2  rounded-lg hover:bg-blue-600 transition" onClick={Back}>
          <ArrowLeft className="mr-2" size={20} /> EXIT
        </button>


        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Mode :-
          <u>
            <select
              className="rounded-md   text-white text-center bg-gray-300"
              onChange={EntryNP}
            >
              <option>Pre-Emptive</option>
              <option value="Non-preemptive">Non-Pre-Emptive</option>
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
        <u>Less</u> Remaining Burst Time Executes First (SJF - Preemptive /
        SRTF).
      </marquee>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mt-8 sm:mt-12 md:mt-16 text-black">
        CPU Process Manager (Preemptive SJF / SRTF)
      </h2>

      {/* Input Fields - Responsive (UNCHANGED) */}
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

      <div className="mt-8 sm:mt-10 md:mt-14 flex gap-2">
        <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded font-bold border-2 border-white transition-all  text-xs sm:text-sm md:text-base">
          User Input Table
        </button>
      </div>

      {/* Process Table (UNCHANGED) */}
      {processes.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-2">
          <thead>
            <tr className="bg-red-400 h-8">
              <th className="border border-black px-2">Process</th>
              <th className="border border-black px-2">Arrival Time (ms)</th>
              <th className="border border-black px-2">Burst Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id}>
                <td className="border border-black px-2 bg-cyan-200 text-center">
                  P{p.id}
                </td>
                <td className="border border-black px-2 bg-cyan-200 text-center">
                  {p.at} ms
                </td>
                <td className="border border-black px-2 bg-cyan-200 text-center">
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

      <div className="mt-10 flex gap-4">
        <button
          onClick={() => setShow(!show)}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded h-auto w-auto p-2 font-bold"
        >
          {show ? "Hide Gantt Chart" : "Generate Gantt Chart"}
        </button>
        <button
          onClick={generateGantt}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded h-auto w-auto p-2 font-bold"
        >
          Calculate Solution (Run Simulation)
        </button>
      </div>

      {/* Gantt Chart (UNCHANGED) */}
      {show && ganttData.length > 0 && (
        <div className="mt-2 bg-red-400 h-auto py-6 p-4 border-2 rounded-md">
          <h2 className="text-xl font-bold mb-3 text-center text-white">
            Gantt Chart
          </h2>

          <div className="flex items-end justify-center overflow-x-auto gap-2 mt-3 p-1">
            {ganttData.map((g, i) => (
              <div
                key={i}
                className="text-center relative flex flex-col items-center"
              >
                <div
                  className={`${g.process === "IDLE" ? "bg-gray-500" : "bg-green-500"
                    } 
        font-bold text-white 
        text-xs sm:text-sm md:text-lg 
        py-1 rounded shadow-md
        w-14 sm:w-28 md:w-36`}
                >
                  {g.process}
                </div>

                <div className="flex justify-between w-full text-[10px] sm:text-sm md:text-lg mt-1 text-white font-bold">
                  <span>{g.start}</span>
                  {i === ganttData.length - 1 && <span>{g.end}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* IDLE Marquee */}
          <div className="mt-5">
            {ganttData.map(
              (p, i) =>
                p.process === "IDLE" && (
                  <marquee
                    key={i}
                    behavior="alternate"
                    className="text-lg font-bold text-white"
                  >
                    The CPU is not doing any work from{" "}
                    <u className="text-black">{p.start}</u> ms to{" "}
                    <u className="text-black">{p.end}</u> ms{" "}
                    <u className="text-black">--IDLE--</u>
                  </marquee>
                )
            )}
          </div>
          <hr className="border-t-2 border-white my-8" />

          {/* BASIC IDEA SECTION (UNCHANGED) */}
          <div className="flex flex-col justify-center p-3 rounded-md bg-cyan-100 mt-6">
            <div className="border-2 border-black p-2 sm:p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-black font-semibold text-sm sm:text-base md:text-lg">
                  BASIC IDEA
                </h3>
                <Lightbulb className="text-yellow-500" size={20} />
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-medium">* EXECUTING PROCESSES</p>
                  <ArrowRight size={16} />
                  <span className="text-black font-semibold px-2 py-1 rounded bg-green-300 border-2 border-black whitespace-nowrap">
                    PROCESS
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-medium">** READY PROCESSES</p>
                  <ArrowRight size={16} />
                  <span className="text-black font-semibold px-2 py-1 rounded bg-white border-2 border-black whitespace-nowrap">
                    PROCESS
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-medium">*** IDLE PROCESSES</p>
                  <ArrowRight size={16} />
                  <span className="text-black font-semibold px-2 py-1 rounded bg-yellow-100 border-2 border-black whitespace-nowrap">
                    PROCESS
                  </span>
                </div>
              </div>
            </div>
            {/* READY QUEUE TIMELINE (UNCHANGED) */}
            <h2 className="text-lg font-bold mb-2 mt-6 text-center text-black">
              Ready Queue Timeline
            </h2>

            <div className="flex items-start justify-center gap-1 w-full overflow-x-auto p-2">
              {ganttData.map((g, idx) => {
                const isIdle = g.process === "IDLE";

                const readyQueueProcesses = g.queueBefore?.map(
                  (proc, index) => {
                    const isSelected = index === 0 && !isIdle;
                    return (
                      <div
                        key={`rq-${idx}-${proc.id}`}
                        className={`text-black font-semibold mx-1 p-1 rounded w-full text-center ${isSelected ? "bg-green-300 line-through" : "bg-white"
                          }`}
                      >
                        P{proc.id}
                      </div>
                    );
                  }
                );

                return (
                  <div
                    key={`rq-block-${idx}`}
                    className="flex flex-col items-center w-32 border border-dotted border-black rounded-sm p-1"
                    style={{ minHeight: "100px" }}
                  >
                    <span className="text-black text-sm font-bold mb-1">
                      {isIdle ? "IDLE" : `${g.process} EXECUTE`}
                    </span>
                    <div className="bg-gray-400 p-1 rounded min-h-8 flex flex-col items-center justify-center flex-grow w-full gap-1">
                      {isIdle ? (
                        <span className="text-black font-semibold p-1 rounded w-full text-center bg-yellow-100">
                          No Process
                        </span>
                      ) : readyQueueProcesses?.length > 0 ? (
                        readyQueueProcesses
                      ) : (
                        <span className="text-black text-xs">Empty</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={Table}
        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded h-auto w-auto mt-20 font-bold p-2"
      >
        Show Solution Table
      </button>

      {/* Solution Table (UNCHANGED) */}
      {showT && ganttData.length > 0 && (
        <div className="mt-2 bg-red-400 p-3 sm:p-4 rounded-md border-2 border-white">
          <h2 className="text-sm sm:text-lg font-bold text-center text-black mb-4">
            Solution Table (Pre-emptive SJF Scheduling)
          </h2>

          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-400 w-full text-xs sm:text-sm md:text-base min-w-[500px]">
              <thead>
                <tr className="bg-red-400 h-8 sm:h-10 text-[10px] sm:text-sm">
                  <th className="border border-black px-2 sm:px-4">Process</th>
                  <th className="border border-black px-2 sm:px-4">
                    Arrival Time (AT) ms
                  </th>
                  <th className="border border-black px-2 sm:px-4">
                    Burst Time (BT) ms
                  </th>
                  <th className="border border-black px-2 sm:px-4">
                    Completion Time (CT) ms
                  </th>
                  <th className="border border-black px-2 sm:px-4">
                    Turn Around Time (CT-AT) ms
                  </th>
                  <th className="border border-black px-2 sm:px-4">
                    Waiting Time (TAT-BT) ms
                  </th>
                </tr>
              </thead>

              <tbody>
                {(() => {
                  let totalTAT = 0;
                  let totalWT = 0;

                  const ganttEnds = ganttData.reduce((acc, g) => {
                    if (g.process !== "IDLE" && g.end) {
                      acc[g.process] = g.end;
                    }
                    return acc;
                  }, {});

                  const rows = processes
                    .sort((a, b) => a.id - b.id)
                    .map((p) => {
                      const CT = ganttEnds[`P${p.id}`] || 0;
                      const TAT = CT - p.at;
                      const WT = TAT - p.bt;

                      totalTAT += TAT;
                      totalWT += WT;

                      return (
                        <tr key={p.id} className="text-center">
                          <td className="border px-1 sm:px-2 bg-cyan-200 border-black">
                            P{p.id}
                          </td>
                          <td className="border px-1 sm:px-2 bg-cyan-200 border-black">
                            {p.at} ms
                          </td>
                          <td className="border px-1 sm:px-2 bg-cyan-200 border-black">
                            {p.bt} ms
                          </td>
                          <td className="border px-1 sm:px-2 bg-cyan-200 border-black">
                            {CT} ms
                          </td>
                          <td className="border px-1 sm:px-2 bg-cyan-200 border-black">
                            {TAT} ms
                          </td>
                          <td className="border px-1 sm:px-2 bg-cyan-200 border-black">
                            {WT} ms
                          </td>
                        </tr>
                      );
                    });

                  const avgTAT =
                    processes.length > 0
                      ? (totalTAT / processes.length).toFixed(2)
                      : 0;
                  const avgWT =
                    processes.length > 0
                      ? (totalWT / processes.length).toFixed(2)
                      : 0;

                  rows.push(
                    <tr key="avg" className="bg-yellow-300 font-bold text-center">
                      <td className="border px-1 sm:px-2 border-black" colSpan={4}>
                        Average
                      </td>
                      <td className="border px-1 sm:px-2 border-black">
                        {avgTAT} ms
                      </td>
                      <td className="border px-1 sm:px-2 border-black">
                        {avgWT} ms
                      </td>
                    </tr>
                  );

                  return rows;
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clear All Button (NEW) */}
      <div className="text-center">
        <button
          className="mt-8 sm:mt-10 md:mt-8 flex items-center gap-2 font-bold text-sm sm:text-base bg-gradient-to-b from-red-400 to-red-600 text-white px-5 py-2 rounded-lg"
          onClick={clearAll}
        >
          <RiDeleteBinLine className="w-5 h-5" />
          CLEAR ALL
        </button>
      </div>

      {/* Average Info (UNCHANGED) */}
      <div className="mt-6 sm:mt-8 md:mt-10 space-y-6">
        {/* Average Turn Around Time */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
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

export default PreemptiveSjf;