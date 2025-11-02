import React, { useState } from "react";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaHandPointRight } from "react-icons/fa";
import { FcIdea } from "react-icons/fc";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";


function PrioritySche() {
  const [processes, setProcesses] = useState([]);
  const [at, setAt] = useState("");
  const [bt, setBt] = useState("");
  const [priority, setPriority] = useState("");
  const [ganttData, setGanttData] = useState([]);
  const [showGantt, setShowGantt] = useState(true);
  const [priorityRule, setPriorityRule] = useState(null); // 'high' or 'low'
  const [show, setShow] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const Table = () => {
    setShow(!show);
  };

  const navigate = useNavigate();

  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const EntryPreemptPrio = (e) => {
    e.preventDefault();
    if (e.target.value === "preemptive") {
      //alert("You want to perform preemptive priority scheduling");
      navigate("/preemptivepriority");
    }
  };

  const handleChange = (rule) => {
    setPriorityRule(rule);
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
      alert("Priority must be less than 100");
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

  // === ✅ MAIN PRIORITY SCHEDULING WITH READY QUEUE TIMELINE ===
  const generateGanttChart = () => {
    if (processes.length === 0 || !priorityRule) return;

    let processQueue = processes.map((p) => ({ ...p, isCompleted: false }));
    let currentTime = 0;
    let gantt = [];
    let completedMetrics = [];

    processQueue.sort((a, b) => a.at - b.at);

    while (completedMetrics.length < processes.length) {
      let available = processQueue.filter(
        (p) => p.at <= currentTime && !p.isCompleted
      );

      if (available.length === 0) {
        const nextProcess = processQueue.find((p) => !p.isCompleted);
        if (nextProcess) {
          const nextArrival = nextProcess.at;
          if (nextArrival > currentTime) {
            const idleStart = currentTime;
            gantt.push({
              isIdle: true,
              process: "IDLE",
              start: idleStart,
              end: nextArrival,
              duration: nextArrival - idleStart,
              queueBefore: [],
            });
            currentTime = nextArrival;
            continue;
          }
        }
        break;
      }

      let nextCandidates;
      if (priorityRule === "high") {
        const maxPriority = Math.max(...available.map((p) => p.priority));
        nextCandidates = available.filter((p) => p.priority === maxPriority);
      } else {
        const minPriority = Math.min(...available.map((p) => p.priority));
        nextCandidates = available.filter((p) => p.priority === minPriority);
      }

      let next = nextCandidates.reduce((earliest, p) =>
        p.at < earliest.at ? p : earliest
      );

      // ✅ Capture Ready Queue Snapshot
      // This snapshot reflects the queue BEFORE the 'next' process is dispatched
      const queueBeforeSnapshot = [
        { id: next.id },
        ...available
          .filter((p) => p.id !== next.id)
          .map((p) => ({ id: p.id })),
      ];

      const start = currentTime;
      const end = start + next.bt;

      const ct = end;
      const tat = ct - next.at;
      const wt = tat - next.bt;

      gantt.push({
        isIdle: false,
        process: `P${next.id}`,
        start,
        end,
        duration: next.bt,
        queueBefore: queueBeforeSnapshot,
      });

      completedMetrics.push({
        id: next.id,
        process: `P${next.id}`,
        at: next.at,
        bt: next.bt,
        priority: next.priority,
        ct,
        tat,
        wt,
      });

      currentTime = end;
      const completedIndex = processQueue.findIndex((p) => p.id === next.id);
      if (completedIndex !== -1) {
        processQueue[completedIndex].isCompleted = true;
      }
    }

    const finalData = [...gantt, ...completedMetrics.sort((a, b) => a.id - b.id)];
    setGanttData(finalData);
    setShowGantt(true);
    setShowTable(true);
  };

  // Filter Data for Display
  const ganttBlocks = ganttData.filter(
    (d) => d.process && d.duration !== undefined
  );
  const finalProcesses = ganttData
    .filter((d) => d.process && d.ct !== undefined)
    .sort((a, b) => a.id - b.id);

  const TotalTat = finalProcesses.reduce((acc, g) => acc + g.tat, 0);
  const AvgTat =
    finalProcesses.length > 0
      ? (TotalTat / finalProcesses.length).toFixed(2)
      : 0;

  const TotalWt = finalProcesses.reduce((acc, g) => acc + g.wt, 0);
  const AvgWt =
    finalProcesses.length > 0
      ? (TotalWt / finalProcesses.length).toFixed(2)
      : 0;

  // === UI PART ===
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 md:gap-6 lg:gap-4 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
        <button className="flex items-center font-semibold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 mt-2  rounded-lg hover:bg-blue-600 transition" onClick={Back}>
          <ArrowLeft className="mr-2" size={20} /> EXIT
        </button>
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Mode :-
          <u>
            <select
              className="rounded-md   text-white text-center bg-gray-300"
              onChange={EntryPreemptPrio}
            >
              <option>Non-Pre-Emptive</option>
              <option value="preemptive" >
                Pre-Emptive
              </option>
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
      <div className="text-xl flex ml-2 md:ml-80 mb-4 w-96 md:w-1/2 text-black mt-24 rounded-lg border-4 border-yellow-400 p-2 justify-center">
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
        CPU Process Manager (PRIORITY)
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

      <div className="mt-8 sm:mt-10 md:mt-14 flex gap-2">
        <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded font-bold border-2 border-white transition-all  text-xs sm:text-sm md:text-base">
          User Input Table
        </button>
      </div>


      {/* Process List Table */}
      {processes.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-2">
          <thead>
            <tr className="bg-red-400 h-10">
              <th className="border px-2 border-black">Process</th>
              <th className="border px-2 border-black">Priority</th>
              <th className="border px-2 border-black">
                Arrival Time (ms)
              </th>
              <th className="border px-2 border-black">Burst Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id}>
                <td className="border text-center bg-cyan-200 border-black">
                  P{p.id}
                </td>
                <td className="border text-center bg-cyan-200 border-black">
                  {p.priority}
                </td>
                <td className="border text-center bg-cyan-200 border-black">
                  {p.at} ms
                </td>
                <td className="border text-center bg-cyan-200 border-black">
                  {p.bt} ms
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

      {/* Gantt Chart Button */}
      <div className="flex justify-right gap-4 mt-10">
        <button
          onClick={generateGanttChart}
          disabled={!priorityRule}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-white text-center font-bold rounded"
        >
          Generate Gantt Chart
        </button>
      </div>

      {/* Gantt Chart */}
      {showGantt && ganttBlocks.length > 0 && (
        <div className="mt-2 bg-red-400 p-3 sm:p-4 rounded-md border-2 border-white">

          {/* Gantt Chart */}
          <h2 className="text-center text-base sm:text-lg md:text-xl mb-2 text-white font-bold">
            Gantt Chart
          </h2>

          <div className="flex items-center justify-center space-x-1 overflow-x-auto p-1">
            {ganttBlocks.map((g, index) => (
              <div key={index} className="flex flex-col items-center min-w-[60px] sm:min-w-[90px] md:min-w-[140px]">

                <div
                  className={`${g.isIdle ? "bg-gray-500" : "bg-green-500"} 
            text-white font-bold text-xs sm:text-sm md:text-lg 
            py-1 rounded shadow-md text-center w-full`}
                >
                  {g.process}
                </div>

                <div className="flex justify-between w-full text-[10px] sm:text-sm md:text-lg mt-1 text-white font-bold">
                  <span>{g.start}</span>
                  {index === ganttBlocks.length - 1 && <span>{g.end}</span>}
                </div>

              </div>
            ))}
          </div>

          {/* Idle Message */}
          <div className="mt-6 space-y-2">
            {ganttData.map(
              (p, i) =>
                p.isIdle && (
                  <marquee
                    key={i}
                    behavior="alternate"
                    className="text-sm sm:text-base md:text-lg font-bold text-white"
                  >
                    CPU Idle from <u className="text-black">{p.start}</u> ms to{" "}
                    <u className="text-black">{p.end}</u> ms
                    <u className="text-black"> --CPU--</u>

                  </marquee>
                )
            )}
          </div>

          <hr className="my-4" />

          {/* Ready Queue Timeline */}
          <div className="flex flex-col mt-8 p-3 rounded-md justify-center bg-cyan-100">

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

            <h2 className="text-center text-base sm:text-lg md:text-xl font-bold text-black mb-4">
              Ready Queue Timeline
            </h2>

            <div className="flex justify-center text-sm sm:text-base gap-2 flex-wrap font-bold text-black">
              {ganttBlocks.map((p, idx) => {

                const executedProcessLabel = p.isIdle
                  ? "IDLE"
                  : `P${p.queueBefore?.[0]?.id || '?'} EXECUTE`;

                const readyQueueProcesses = p.queueBefore?.map((proc, index) => {
                  const isSelected = index === 0 && !p.isIdle;
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
                    className="flex flex-col items-center border border-dotted border-black rounded-md p-2 min-w-[70px] sm:min-w-[90px] md:min-w-[120px]"
                  >
                    {/* Header label */}
                    <h3 className="w-full text-center font-bold text-xs sm:text-sm md:text-base mb-1 text-black">
                      {executedProcessLabel}
                    </h3>

                    <div className="p-2 w-full space-y-1 bg-gray-400 text-center rounded-sm">
                      {p.isIdle ? (
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


      {/* Show Solution Table */}
      <button
        onClick={Table}
        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 mt-10 text-white text-center font-bold rounded"
      >
        Show Solution Table
      </button>

      {/* Solution Table */}
      {show && finalProcesses.length > 0 && (
        <div className="mt-2 bg-red-400 p-2 sm:p-4 rounded-md border-2 border-white overflow-x-auto">

          <div className="text-center">
            <span className="text-lg sm:text-xl font-bold mb-4 text-center text-black">
              Solution Table (Non-Preemptive Priority Scheduling)
            </span>
          </div>

          <table className="border-collapse border border-gray-500 w-full mt-6 text-[10px] sm:text-sm md:text-base min-w-[700px]">
            <thead className="bg-red-400">
              <tr>
                <th className="border border-black px-2 sm:px-4 py-1">Process</th>
                <th className="border border-black px-2 sm:px-4 py-1">Priority</th>
                <th className="border border-black px-2 sm:px-4 py-1">
                  Arrival Time (ms)
                </th>
                <th className="border border-black px-2 sm:px-4 py-1">Burst Time (ms)</th>
                <th className="border border-black px-2 sm:px-4 py-1">
                  Completion Time (ms)
                </th>
                <th className="border border-black px-2 sm:px-4 py-1">
                  Turn Around Time (CT-AT)
                </th>
                <th className="border border-black px-2 sm:px-4 py-1">
                  Waiting Time (TAT-BT)
                </th>
              </tr>
            </thead>

            <tbody>
              {finalProcesses.map((g, index) => (
                <tr key={index}>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.process}</td>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.priority}</td>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.at} ms</td>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.bt} ms</td>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.ct} ms</td>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.tat} ms</td>
                  <td className="border text-center bg-cyan-200 border-black py-1">{g.wt} ms</td>
                </tr>
              ))}

              <tr className="bg-yellow-300 font-bold">
                <td className="border text-center border-black py-1" colSpan={5}>Averages</td>
                <td className="border text-center border-black py-1">{AvgTat} ms</td>
                <td className="border text-center border-black py-1">{AvgWt} ms</td>
              </tr>
            </tbody>
          </table>

        </div>
      )}


      {/* Average Info */}
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

export default PrioritySche;