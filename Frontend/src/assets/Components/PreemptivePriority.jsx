import React, { useState, useEffect } from "react";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaHandPointRight } from "react-icons/fa";
import { FcIdea } from "react-icons/fc";
import { ArrowLeft, ArrowRight, Lightbulb, Trash2 } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";


// Define sessionStorage keys
const PREEMPTIVE_PROCESSES_KEY = "preemptive_priority_processes";
const PREEMPTIVE_PRIORITY_RULE_KEY = "preemptive_priority_rule";


function PreemptivePriority() {
  // --- STATE INITIALIZATION WITH SESSION STORAGE ---
  const [processes, setProcesses] = useState(() => {
    const savedProcesses = sessionStorage.getItem(PREEMPTIVE_PROCESSES_KEY);
    return savedProcesses ? JSON.parse(savedProcesses) : [];
  });
  const [priorityRule, setPriorityRule] = useState(() => {
    const savedRule = sessionStorage.getItem(PREEMPTIVE_PRIORITY_RULE_KEY);
    return savedRule || null; // 'high' or 'low' or null
  });

  const [at, setAt] = useState("");
  const [bt, setBt] = useState("");
  const [priority, setPriority] = useState("");
  const [ganttData, setGanttData] = useState([]); // Final solution metrics
  const [ganttSegments, setGanttSegments] = useState([]); // For visual Gantt chart
  const [showGantt, setShowGantt] = useState(false);
  const [show, setShow] = useState(false);

  // --- PERSISTENCE: useEffect to save data to sessionStorage ---
  useEffect(() => {
    // Save processes whenever the processes state changes
    sessionStorage.setItem(PREEMPTIVE_PROCESSES_KEY, JSON.stringify(processes));
    // Reset Gantt/Solution view when processes change
    setGanttData([]);
    setGanttSegments([]);
    setShowGantt(false);
    setShow(false);
  }, [processes]);

  useEffect(() => {
    // Save priorityRule whenever the priorityRule state changes
    if (priorityRule) {
      sessionStorage.setItem(PREEMPTIVE_PRIORITY_RULE_KEY, priorityRule);
    } else {
      sessionStorage.removeItem(PREEMPTIVE_PRIORITY_RULE_KEY);
    }
    // Reset Gantt/Solution view when rule changes
    setGanttData([]);
    setGanttSegments([]);
    setShowGantt(false);
    setShow(false);
  }, [priorityRule]);

  // --- NEW FUNCTIONALITY: Clear Processes Button Logic ---
  const clearProcesses = () => {
    // Clear state
     if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
  
    setProcesses([]);
    setGanttData([]);
    setGanttSegments([]);
    setShowGantt(false);
    setShow(false);
    setAt("");
    setBt("");
    setPriority("");
    // Clear sessionStorage
    sessionStorage.removeItem(PREEMPTIVE_PROCESSES_KEY);
    // Note: Choosing NOT to clear the priorityRule on "Clear Processes" 
    // as the user likely wants to keep the selected rule for new entries.
  }
};

  const Table = () => {
    setShow(!show);
  };

  const navigate = useNavigate();

  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const EntryNonPreemptPrio = (e) => {
    e.preventDefault();
    if (e.target.value === "NonpreemptivePri") {
      navigate(-1);
    }
  };

  const handleChange = (rule) => {
    // Toggling behavior added for better UX
    setPriorityRule(priorityRule === rule ? null : rule);
  };

  const addProcess = () => {
    if (at === "" || bt === "" || priority === "") {
      alert("Please enter AT, BT, and Priority");
      return;
    } else if (at < 0 || bt < 0 || priority < 0) {
      alert("Do not enter negative values");
      return;
    } else if (at > 15 || bt > 15) {
      alert("Please enter AT and BT between 0-15");
      return;
    } else if (priority > 100) {
      alert("Priority must be <= 100");
      return;
    } else if (priorityRule === null) {
      alert("Firstly select the priority rule");
      return;
    }

    const newProcess = {
      id: processes.length + 1,
      at: parseInt(at),
      bt: parseInt(bt),
      priority: parseInt(priority),
    };

    setProcesses([...processes, newProcess]);
    setAt("");
    setBt("");
    setPriority("");
  };

  // ----------------------------------------------------------------------
  // ✅ ORIGINAL PREEMPTIVE PRIORITY LOGIC (UNCHANGED)
  // ----------------------------------------------------------------------
  const generateGanttChart = () => {
    if (processes.length === 0) return;

    let time = 0;
    let completed = 0;
    const n = processes.length;

    // Copy processes with remaining time property
    const queue = processes.map((p) => ({
      id: p.id,
      at: p.at,
      bt: p.bt,
      rt: p.bt,
      priority: p.priority,
    }));

    const ganttSegmentsTemp = [];
    const resultMap = {};
    let lastProcessId = null;

    while (completed < n) {
      // Processes that have arrived and still need time
      const available = queue.filter((p) => p.at <= time && p.rt > 0);

      if (available.length === 0) {
        // CPU idle
        if (lastProcessId !== "IDLE") {
          ganttSegmentsTemp.push({
            process: "IDLE",
            start: time,
            end: time + 1,
            // ✅ ADDED: Ready queue is empty during IDLE
            queueBefore: [],
          });
          lastProcessId = "IDLE";
        } else {
          ganttSegmentsTemp[ganttSegmentsTemp.length - 1].end++;
        }
        time++;
        continue;
      }

      // Select next process based on priority rule
      let current;
      if (priorityRule === "high") {
        // Higher number = higher priority
        // Tie-breaker: FCFS (earliest AT)
        current = available.reduce((best, p) => {
          if (!best) return p;
          if (p.priority > best.priority) return p;
          if (p.priority === best.priority && p.at < best.at) return p;
          return best;
        }, null);
      } else {
        // Lower number = higher priority
        // Tie-breaker: FCFS (earliest AT)
        current = available.reduce((best, p) => {
          if (!best) return p;
          if (p.priority < best.priority) return p;
          if (p.priority === best.priority && p.at < best.at) return p;
          return best;
        }, null);
      }

      // ----------------------------------------------------------
      // ✅ CORE READY QUEUE SNAPSHOT LOGIC
      // Sort the available queue based on the actual scheduling criteria (Priority -> AT)
      const sortedQueue = available.sort((a, b) => {
        // Primary Sort: Priority (High number is higher priority OR Low number is higher priority)
        const prioDiff = priorityRule === 'high'
          ? (b.priority - a.priority) // Higher number = higher priority (descending)
          : (a.priority - b.priority); // Lower number = higher priority (ascending)

        if (prioDiff !== 0) return prioDiff;

        // Secondary Sort: Arrival Time (FCFS Tie-breaker)
        return a.at - b.at;
      });

      const queueBeforeSnapshot = sortedQueue.map(p => ({ id: p.id }));
      // ----------------------------------------------------------


      // Handle context switching / gantt segment grouping
      const currentProcessLabel = `P${current.id}`;

      if (lastProcessId !== currentProcessLabel) {
        // Finalize the previous block (if not IDLE)
        if (ganttSegmentsTemp.length > 0 && lastProcessId !== "IDLE") {
          ganttSegmentsTemp[ganttSegmentsTemp.length - 1].end = time;
        }

        // Start a new block
        ganttSegmentsTemp.push({
          process: currentProcessLabel,
          start: time,
          end: time + 1,
          // ✅ ADDED: Attach the ready queue snapshot
          queueBefore: queueBeforeSnapshot,
        });
        lastProcessId = currentProcessLabel;
      } else {
        ganttSegmentsTemp[ganttSegmentsTemp.length - 1].end++;
        // NOTE: We don't re-attach the queue snapshot here since it's a continuing segment, 
        // the snapshot from the segment start will be used for the whole block.
      }

      // Execute current process for 1 unit time
      current.rt--;
      time++;

      // Check if process completed
      if (current.rt === 0) {
        completed++;
        const ct = time;
        const tat = ct - current.at;
        const wt = tat - current.bt;
        resultMap[current.id] = {
          process: currentProcessLabel,
          priority: current.priority,
          at: current.at,
          bt: current.bt,
          ct,
          tat,
          wt,
        };
        lastProcessId = null; // Forces a new segment creation check on the next step
      }
    }

    // Recalculate duration after all end times are finalized
    const finalGanttSegments = ganttSegmentsTemp.map(segment => ({
      ...segment,
      duration: segment.end - segment.start
    })).filter(segment => segment.duration > 0);

    // Prepare final ganttData in process id order for table display
    const solutionData = queue
      .map((p) => resultMap[p.id])
      .filter((entry) => entry !== undefined)
      .sort((a, b) => a.id - b.id); // Sort by original P-ID

    setGanttData(solutionData);
    setGanttSegments(finalGanttSegments);
    setShowGantt(true);
    setShow(false); // Reset show table on new generation
  };

  // ----------------------------------------------------------------------
  // Calculation and UI Logic
  // ----------------------------------------------------------------------
  const totalTat = ganttData.reduce((acc, g) => acc + g.tat, 0);
  const avgTat = ganttData.length > 0 ? (totalTat / ganttData.length).toFixed(2) : "0.00";

  const totalWt = ganttData.reduce((acc, g) => acc + g.wt, 0);
  const avgWt = ganttData.length > 0 ? (totalWt / ganttData.length).toFixed(2) : "0.00";

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 md:gap-6 lg:gap-1 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
        <button className="flex items-center font-semibold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 mt-2  rounded-lg hover:bg-blue-600 transition" onClick={Back}>
          <ArrowLeft className="mr-2" size={20} /> EXIT
        </button>

        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Mode :-
          <u>
            <select
              className="rounded-md   text-white text-center bg-gray-300"
              onChange={EntryNonPreemptPrio}
            >
              <option>Pre-Emptive</option>
              <option value="NonpreemptivePri">Non-Pre-Emptive</option>
            </select>
          </u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Criteria: <u className="text-red-500">PRIORITY</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          T-A-T: <u className="text-red-500">CT - AT</u>
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          W-T: <u className="text-red-500">TAT - BT</u>
        </h2>
      </div>


      {/* Priority Rule Display */}
      <div className="text-xl flex ml-2 md:ml-80 mb-4 w-44 md:w-1/2 text-black mt-24 rounded-lg border-4 border-yellow-400 p-2 justify-center">
        {priorityRule === null ? (
          <>
            <FaRegQuestionCircle className="mr-2 mt-2" />
            <span className="md:text-2xl text-xl">Priority Rule: Not Selected</span>
          </>
        ) : (
          <>
            <FaArrowRightToBracket className="mr-2 mt-2" />
            <span className="md:text-2xl text-xl">
              {priorityRule === "high"
                ? "Higher number = higher priority"
                : "Lower number = higher priority"}
            </span>
          </>
        )}
      </div>

      {/* Priority Selection */}
      <div className="justify-center flex mt-10 gap-x-6">
        <div className="flex text-2xl bg-blue-100 p-2 rounded items-center">
          <input
            type="checkbox"
            className="size-5 mr-3"
            checked={priorityRule === "high"}
            onChange={() => handleChange("high")}
          />
          <h3 className="m-0 font-bold">
            1.] Higher the number = higher priority
          </h3>
        </div>

        <div className="flex text-2xl bg-blue-100 p-2 rounded items-center">
          <input
            type="checkbox"
            className="size-5 mr-3"
            checked={priorityRule === "low"}
            onChange={() => handleChange("low")}
          />
          <h3 className="m-0 font-bold">
            2.] Lower the number = higher priority
          </h3>
        </div>
      </div>

      {/* Input Section */}
      <h2 className="text-2xl font-bold text-center text-black mb-6 mt-16">
        CPU Process Manager (PREEM-PRIORITY)
      </h2>


      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center my-4 sm:my-6 px-2">
        <input
          type="number"
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border-2 border-blue-100 p-2 rounded "
        />
        <input
          type="number"
          placeholder="Arrival Time"
          value={at}
          onChange={(e) => setAt(e.target.value)}
          className="border-2 border-blue-100 p-2 rounded"
        />
        <input
          type="number"
          placeholder="Burst Time"
          value={bt}
          onChange={(e) => setBt(e.target.value)}
          className="border-2 border-blue-100 p-2 rounded"
        />
        <button
          onClick={addProcess}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base hover:bg-blue-600 transition"
        >
          Add Process
        </button>
      </div>

      <div className="mt-8 sm:mt-10 md:mt-14 flex gap-2 justify-between items-center"> {/* Modified this div for spacing */}
        <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded font-bold border-2 border-white transition-all  text-xs sm:text-sm md:text-base">
          User Input Table
        </button>

      </div>


      {/* Process List Table */}
      {processes.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-2">
          <thead className="bg-red-400">
            <tr>
              <th className="border border-black px-3">Process</th>
              <th className="border border-black px-3">Priority</th>
              <th className="border border-black px-3">Arrival Time (ms)</th>
              <th className="border border-black px-3">Burst Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={index}>
                <td className="border border-black text-center bg-cyan-200">
                  P{process.id}
                </td>
                <td className="border border-black text-center bg-cyan-200">
                  {process.priority}
                </td>
                <td className="border border-black text-center bg-cyan-200">
                  {process.at} ms
                </td>
                <td className="border border-black text-center bg-cyan-200">
                  {process.bt} ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black text-2xl mt-3 text-center font-serif">
          No processes added yet..
        </p>
      )}

      {/* Generate Gantt Chart Button */}
      <div className="flex justify-right gap-4 mt-10">
        <button
          onClick={generateGanttChart}
          disabled={!priorityRule || processes.length === 0}
          className={`px-4 py-2 text-white text-center font-bold rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition ${!priorityRule || processes.length === 0


            }`}
        >
          Generate Gantt Chart
        </button>
      </div>

      {/* Visual Gantt Chart */}
      {showGantt && ganttSegments.length > 0 && (
        <div className="mt-2 bg-red-400 p-4 rounded-md border-2 border-white h-auto w-full overflow-x-auto">
          <h2 className="text-center text-xl md:text-2xl mb-4 text-white font-bold">
            Gantt Chart
          </h2>
          <div className="flex items-center justify-start md:justify-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {ganttSegments.map((segment, index) => (
              <div key={index} className="flex flex-col items-center text-sm md:text-base min-w-[50px] sm:min-w-[80px] md:min-w-[120px]">
                <div
                  className={`text-white px-2 md:px-6 text-base md:text-lg py-1 rounded shadow font-bold text-center w-full ${segment.process === "IDLE" ? "bg-gray-500" : "bg-green-500"}`}
                >
                  {segment.process}
                </div>
                <div className="flex justify-between w-full text-sm md:text-lg mt-1 text-white font-bold">
                  <span>{segment.start}</span>
                  {index === ganttSegments.length - 1 && <span>{segment.end}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-10 space-y-2">
            {ganttSegments.map((segment, i) =>
              segment.process === "IDLE" ? (
                <marquee
                  key={i}
                  behavior="alternate"
                  className="text-sm sm:text-base md:text-lg font-bold text-white"
                >
                  CPU Idle from <u className="text-black">{segment.start}</u> ms to{" "}
                  <u className="text-black">{segment.end}</u> ms
                  <u className="text-black"> --CPU--</u>

                </marquee>
              ) : null
            )}
          </div>

          <hr className="border-t-2 border-white my-2" />

          <div className="flex flex-col mt-8 h-auto p-3 rounded-md bg-cyan-100 space-y-4 md:space-y-8 w-full overflow-x-auto">
            <div className="border-2 border-black p-2 rounded-md text-xs md:text-base">
              <div className="flex items-center gap-1 md:gap-2">
                <h3 className="text-black font-semibold text-base">BASIC IDEA</h3>
                <Lightbulb className="text-yellow-500" size={20} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-2 mt-2">
                <div className="flex justify-center items-center gap-2">
                  <p className="font-medium">* EXECUTING</p>
                  <span className="text-black font-semibold p-1 md:p-2 w-28 md:w-36 rounded bg-green-300">PROCESS</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p className="font-medium">** READY</p>
                  <span className="text-black font-semibold p-1 md:p-2 w-28 md:w-36 rounded bg-white">PROCESS</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p className="font-medium">*** IDLE</p>
                  <span className="text-black font-semibold p-1 md:p-2 w-28 md:w-36 rounded bg-yellow-100">PROCESS</span>
                </div>
              </div>
            </div>

            <h2 className="text-center text-xl md:text-2xl font-bold text-black mt-4">Ready Queue Timeline</h2>
            <div className="flex justify-start md:justify-center text-xs md:text-sm gap-2 mt-4 flex-wrap font-bold text-black w-full">
              {ganttSegments.map((segment, idx) => {
                const queueSnapshot = segment.queueBefore;
                // Only display a box if a new segment started or the queue changed
                if (!queueSnapshot || (idx > 0 && ganttSegments[idx - 1].process === segment.process && segment.process !== 'IDLE')) return null;

                const executedProcessLabel = segment.process === "IDLE"
                  ? "IDLE"
                  : `${segment.process} EXEC (${segment.start}-${segment.end})`;

                const readyQueueProcesses = queueSnapshot.map((proc, index) => {
                  const isSelected = index === 0 && segment.process !== "IDLE";
                  return (
                    <div
                      key={`rq-${idx}-${proc.id}`}
                      className={`text-black font-semibold p-1 rounded w-full text-center ${isSelected ? "bg-green-300 line-through" : "bg-white"}`}
                    >
                      P{proc.id}
                    </div>
                  );
                });

                return (
                  <div
                    key={idx}
                    className="flex border border-dotted border-black rounded-sm flex-col items-center p-2 min-w-[130px] md:min-w-[160px]"
                  >
                    <h3 className="w-full font-bold text-center text-[10px] md:text-sm mb-1">{executedProcessLabel}</h3>
                    <div className="p-2 w-full space-y-1 bg-gray-500 text-center rounded-sm">
                      {segment.process === "IDLE" || queueSnapshot.length === 0 ? (
                        <div className="text-black font-semibold p-1 rounded w-full text-center bg-yellow-100">
                          No Process
                        </div>
                      ) : (
                        readyQueueProcesses
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
        disabled={ganttData.length === 0}
        className={`px-4 py-2 mt-10 text-white text-center font-bold rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition${ganttData.length === 0


          }`}
      >
        {show ? "Hide Solution Table" : "Show Solution Table"}
      </button>

      {/* Solution Table */}
      {show && showGantt && ganttData.length > 0 && (
        <div className="mt-2 bg-red-400 p-4 rounded-md border-2 border-white">
          <h3 className="text-center text-xl mb-2 text-black font-bold">
            Solution Table (Preemptive Priority Scheduling)
          </h3>
          {/* Added a responsive container div here */}
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-500 w-full mt-6 text-sm md:text-base min-w-[800px]">
              <thead className="bg-red-400">
                <tr>
                  <th className="border border-black px-4 py-1">Process</th>
                  <th className="border border-black px-4 py-1">Priority</th>
                  <th className="border border-black px-4 py-1">Arrival Time (ms)</th>
                  <th className="border border-black px-4 py-1">Burst Time (ms)</th>
                  <th className="border border-black px-4 py-1">
                    Completion Time (ms)
                  </th>
                  <th className="border border-black px-4 py-1">
                    Turn Around Time = (CT-AT) ms
                  </th>
                  <th className="border border-black px-4 py-1">
                    Waiting Time = (TAT-BT) ms
                  </th>
                </tr>
              </thead>
              <tbody>
                {ganttData.map((g, index) => (
                  <tr key={index}>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.process}
                    </td>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.priority}
                    </td>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.at} ms
                    </td>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.bt} ms
                    </td>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.ct} ms
                    </td>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.tat} ms
                    </td>
                    <td className="border text-center bg-cyan-200 border-black py-1">
                      {g.wt} ms
                    </td>
                  </tr>
                ))}
                <tr className="bg-yellow-300 font-bold">
                  <td className="border text-center border-black py-1" colSpan={5}>
                    Averages
                  </td>
                  <td className="border text-center border-black py-1">
                    {avgTat} ms
                  </td>
                  <td className="border text-center border-black py-1">
                    {avgWt} ms
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          className="mt-8 sm:mt-10 md:mt-8 flex items-center gap-2 font-bold text-sm sm:text-base bg-gradient-to-b from-red-400 to-red-600 text-white px-5 py-2 rounded-lg"
          onClick={clearProcesses}
        >
          <RiDeleteBinLine className="w-5 h-5" />
          CLEAR ALL
        </button>
      </div>

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

export default PreemptivePriority;