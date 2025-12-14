import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Lightbulb, Trash2, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";



function RR() {
  const [processes, setProcesses] = useState([]);
  const [at, setAt] = useState("");
  const [bt, setBt] = useState("");
  const [showGantt, setShowGantt] = useState(false);
  const [quantum, setQuantum] = useState(1);
  const [showSolution, setShowSolution] = useState(false);



  // Load data from sessionStorage on component mount
  useEffect(() => {
    const savedProcesses = sessionStorage.getItem('rrProcesses');
    const savedQuantum = sessionStorage.getItem('rrQuantum');
    const savedShowGantt = sessionStorage.getItem('rrShowGantt');
    const savedShowSolution = sessionStorage.getItem('rrShowSolution');

    if (savedProcesses) {
      setProcesses(JSON.parse(savedProcesses));
    }
    if (savedQuantum) {
      setQuantum(JSON.parse(savedQuantum));
    }
    if (savedShowGantt) {
      setShowGantt(JSON.parse(savedShowGantt));
    }
    if (savedShowSolution) {
      setShowSolution(JSON.parse(savedShowSolution));
    }
  }, []);

  // Save processes to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('rrProcesses', JSON.stringify(processes));
  }, [processes]);

  // Save quantum to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('rrQuantum', JSON.stringify(quantum));
  }, [quantum]);

  // Save showGantt to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('rrShowGantt', JSON.stringify(showGantt));
  }, [showGantt]);

  // Save showSolution to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('rrShowSolution', JSON.stringify(showSolution));
  }, [showSolution]);

  const Table = () => {
    setShowSolution(!showSolution);
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setProcesses([]);
      setAt("");
      setBt("");
      setQuantum(1);
      setShowGantt(false);
      setShowSolution(false);
      
      // Clear sessionStorage
      sessionStorage.removeItem('rrProcesses');
      sessionStorage.removeItem('rrQuantum');
      sessionStorage.removeItem('rrShowGantt');
      sessionStorage.removeItem('rrShowSolution');
    }
  };

  const Decrease = (e) => {
    e.preventDefault();
    quantum > 1
      ? setQuantum(quantum - 1)
      : alert("Do not try zero or negative");
  };

  const Increase = (e) => {
    e.preventDefault();
    quantum >= 7 ? alert("Limit between 1-7") : setQuantum(quantum + 1);
  };

  const B_Home = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to exit?')) {
      window.history.back();
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

  const computeGanttData = () => {
    const hasBeenQueued = new Set();
    const queue = [];
    const ganttChart = [];

    const processesCopy = processes.map((p) => ({
      id: p.id,
      at: p.at,
      bt: p.bt,
      remaining: p.bt,
      completionTime: null,
    }));

    let currentTime = 0;
    let completed = 0;

    processesCopy.sort((a, b) => a.at - b.at);

    const addNewlyArrivedProcesses = (currentT) => {
      processesCopy.forEach((p) => {
        if (p.at <= currentT && !hasBeenQueued.has(p.id)) {
          queue.push(p);
          hasBeenQueued.add(p.id);
        }
      });
    };

    addNewlyArrivedProcesses(currentTime);

    while (completed < processesCopy.length) {
      if (queue.length === 0) {
        const nextProcess = processesCopy.find((p) => p.remaining > 0 && !hasBeenQueued.has(p.id) || p.at > currentTime);

        if (!nextProcess) break;

        const nextArrivalTime = processesCopy
          .filter(p => p.at > currentTime || (p.remaining > 0 && !hasBeenQueued.has(p.id)))
          .map(p => p.at)
          .sort((a, b) => a - b)[0];

        if (nextArrivalTime > currentTime) {
          const idleStart = currentTime;
          currentTime = nextArrivalTime;

          ganttChart.push({
            id: `idle-${idleStart}`,
            start: idleStart,
            end: currentTime,
            isIdle: true,
            queueBefore: [],
            executedProcess: 'IDLE',
            extraReadyQueue: [],
          });
        }

        addNewlyArrivedProcesses(currentTime);
        continue;
      }

      const currentProcess = queue.shift();
      const execTime = Math.min(quantum, currentProcess.remaining);
      const start = currentTime;
      const end = currentTime + execTime;

      const queueBeforeSnapshot = [
        { id: currentProcess.id, remaining: currentProcess.remaining },
        ...queue.map(p => ({ id: p.id, remaining: p.remaining }))
      ];

      currentProcess.remaining -= execTime;
      currentTime = end;

      addNewlyArrivedProcesses(currentTime);

      if (currentProcess.remaining > 0) {
        queue.push(currentProcess);
      } else {
        completed++;
        currentProcess.completionTime = currentTime;
      }

      ganttChart.push({
        id: currentProcess.id,
        start,
        end,
        isIdle: false,
        queueBefore: queueBeforeSnapshot,
        executedProcess: `P${currentProcess.id}`,
        extraReadyQueue: [],
      });
    }

    return ganttChart;
  };

  const ganttData = computeGanttData();

  const finalTable = processes.map((proc) => {
    const completionEntry = ganttData.filter(g => g.id === proc.id).pop();
    const ct = completionEntry ? completionEntry.end : null;

    return {
      ...proc,
      end: ct,
    };
  });

  const TotalTat = finalTable.reduce((pre, q) => pre + (q.end !== null ? q.end - q.at : 0), 0);
  const AvgTat = processes.length > 0 ? (TotalTat / processes.length).toFixed(2) : 0;

  const totalWt = finalTable.reduce(
    (previous, p) => previous + (p.end !== null ? p.end - p.at - p.bt : 0),
    0
  );
  const AvgWt = processes.length > 0 ? (totalWt / processes.length).toFixed(2) : 0;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 md:gap-6 lg:gap-1 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
        <button className="flex items-center font-semibold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 mt-2 rounded-lg hover:bg-blue-600 transition" onClick={B_Home}>
          <ArrowLeft className="mr-2" size={20} /> EXIT
        </button>
        
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
          Mode :-
          <u className="text-red-500">Non-Pre-Emptive</u>
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

      <div className="w-full h-14 bg-yellow-100 mt-10 flex items-center justify-center gap-6 rounded-2xl">
        <h2 className="text-black text-xl font-semibold tracking-wide">
          Quantum Time
        </h2>
        <button
          onClick={Decrease}
          className="bg-yellow-300 w-10 h-10 flex items-center justify-center mt-2 text-xl font-bold rounded-md shadow hover:bg-yellow-400 transition"
        >
          <ChevronLeft />
        </button>
        <span className="text-center text-black flex items-center gap-2">
          <Clock className="text-black" />
          {quantum}
        </span>
        <button
          onClick={Increase}
          className="bg-yellow-300 w-10 h-10 flex items-center justify-center mt-2 text-xl font-bold rounded-md shadow hover:bg-yellow-400 transition"
        >
          <ChevronRight />
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mt-10 text-black">
        CPU Process Manager (Round Robin)
      </h2>

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
        <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-1 rounded font-bold border-2 border-white transition-all text-xs sm:text-sm md:text-base">
          User Input Table
        </button>
      </div>

      {processes.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-2">
          <thead>
            <tr className="bg-red-400 h-10">
              <th className="border px-2 text-center border-black">Process</th>
              <th className="border px-2 text-center border-black">
                Arrival Time (ms)
              </th>
              <th className="border px-2 text-center border-black">
                Burst Time (ms)
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

      <div className="mt-4 flex gap-2 justify-left">
        <button
          onClick={() => setShowGantt(!showGantt)}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-2 rounded mt-10 font-bold"
        >
          {showGantt ? "Hide Gantt Chart" : "Generate Gantt Chart"}
        </button>
      </div>

      {showGantt && ganttData.length >= 0 && (
        <div className="mt-2 bg-red-400 h-auto py-8 border-2 p-4 rounded-md">
          <h2 className="text-lg font-bold mb-4 text-center text-white">
            Gantt Chart
          </h2>

          <div className="overflow-x-auto pb-8">
            <div className="flex items-center gap-1 justify-center mt-6 min-w-max">
              {ganttData.map((p, idx) => (
                <div
                  key={idx}
                  className={`${p.isIdle ? "bg-gray-500" : "bg-green-500"
                    } text-white font-bold text-lg text-center rounded shadow relative h-8 w-12 md:w-20`}
                >
                  {p.isIdle ? "IDLE" : `P${p.id}`}
                  <div className="absolute -bottom-6 left-0 text-lg text-white font-bold">
                    {p.start}
                  </div>
                  <div className="absolute -bottom-6 right-0 text-lg text-white font-bold">
                    {p.end}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            {ganttData.map((rahul, i) =>
              rahul.isIdle ? (
                <marquee
                  key={rahul.id}
                  behavior="alternate"
                  className=" text-lg font-bold text-white"
                >
                  The CPU is not doing any work at{" "}
                  <u className="text-black">{rahul.start}</u> ms to{" "}
                  <u className="text-black">{rahul.end}</u> ms{" "}
                  <u className="text-black"> --- IDLE ---</u>
                </marquee>
              ) : null
            )}
          </div>
          <hr />

          <div className="flex flex-col items-center mt-5 rounded-md p-3 bg-cyan-200">
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

            <h2 className="text-lg font-bold text-center text-black mt-4">
              Ready Queue Timeline
            </h2>
            <h2 className="text-lg font-bold mb-2 text-center text-black">{`Executes ${quantum} time of quantum period simultaneously till complete execution`}</h2>

            <div className="flex items-start justify-center gap-1 w-full overflow-x-auto p-2">
              <div className="grid grid-cols-4 md:flex items-start justify-start gap-1 min-w-max">
                {ganttData.map((p, idx) => {
                  const readyQueueProcesses = p.queueBefore.map((proc, index) => {
                    const isExecuted = index === 0 && !p.isIdle;

                    return (
                      <div
                        key={`rq-${idx}-${proc.id}`}
                        className={`text-black font-semibold mx-1 p-1 rounded w-full text-center ${isExecuted ? 'line-through text-black bg-green-300' : 'bg-white'}`}
                      >
                        P{proc.id}({proc.remaining})
                      </div>
                    );
                  });

                  return (
                    <div
                      key={`rq-block-${idx}`}
                      className="flex flex-col items-center w-20 md:w-24 border border-dotted border-black p-1"
                      style={{ minHeight: '100px' }}
                    >
                      <span className="text-black text-sm font-bold mb-1">
                        {p.isIdle ? 'IDLE' : `${p.executedProcess} EXECUTE`}
                      </span>
                      <div className="bg-gray-500 p-1 rounded min-h-8 flex flex-col items-center justify-center flex-grow w-18 md:w-20 gap-1">
                        {p.isIdle ? (
                          <span className="text-black font-semibold p-1 rounded w-full text-center bg-yellow-100">No Process</span>
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
      )}

      <div className="mt-14 flex gap-2">
        <button
          onClick={Table}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-2 rounded font-bold"
        >
          Show Solution Table
        </button>
      </div>
      {showSolution && finalTable.length > 0 && (
        <div className="mt-2 bg-red-400 p-3 rounded-md border-2 border-white">
          <h2 className="text-lg font-bold mb-4 text-center text-black">
            Solution Table (Round Robin Scheduling)
          </h2>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-400 w-full">
              <thead>
                <tr className="bg-red-400 h-10">
                  <th className="border px-4 border-black min-w-[80px]">Process</th>
                  <th className="border px-4 border-black min-w-[150px]">
                    Arrival Time (AT) ms
                  </th>
                  <th className="border px-4 border-black min-w-[150px]">Burst Time (BT) ms</th>
                  <th className="border px-4 border-black min-w-[150px]">
                    Completion Time (CT) ms
                  </th>
                  <th className="border px-4 border-black min-w-[150px]">
                    Turn Around Time = (CT-AT) ms
                  </th>
                  <th className="border px-4 border-black min-w-[150px]">
                    Waiting Time = (TAT-BT) ms
                  </th>
                </tr>
              </thead>
              <tbody>
                {finalTable
                  .sort((a, b) => a.id - b.id)
                  .map((p) => {
                    const tat = p.end - p.at;
                    const wt = tat - p.bt;
                    return (
                      <tr key={p.id}>
                        <td className="border px-2 text-center bg-cyan-200 border-black whitespace-nowrap">
                          P{p.id}
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black whitespace-nowrap">
                          {p.at} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black whitespace-nowrap">
                          {p.bt} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black whitespace-nowrap">
                          {p.end} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black whitespace-nowrap">
                          {tat} ms
                        </td>
                        <td className="border px-2 text-center bg-cyan-200 border-black whitespace-nowrap">
                          {wt} ms
                        </td>
                      </tr>
                    );
                  })}
                <tr className="bg-yellow-300 font-bold text-center">
                  <td className="border px-2 border-black" colSpan="4">
                    Average
                  </td>
                  <td className="border px-2 border-black whitespace-nowrap">{AvgTat} ms</td>
                  <td className="border px-2 border-black whitespace-nowrap">{AvgWt} ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center">
              <button
                className="mt-8 sm:mt-10 md:mt-8 flex items-center gap-2 font-bold text-sm sm:text-base bg-gradient-to-b from-red-400 to-red-600 text-white px-5 py-2 rounded-lg"
                onClick={clearAllData}
              >
                <RiDeleteBinLine className="w-5 h-5" />
                CLEAR ALL
              </button>
            </div>
      

      <div className="mt-6 sm:mt-8 md:mt-10 space-y-6">
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

export default RR;