import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftDoubleFill } from "react-icons/ri";

function Try() {
  const [processes, setProcesses] = useState([]);
  const [at, setAt] = useState("");
  const [bt, setBt] = useState("");
  const [ganttData, setGanttData] = useState([]);

  const addProcess = () => {
    if (at === "" || bt === "") {
      alert("Please enter both AT and BT");
      return;
    } else if (at < 0 || bt <= 0 || at > 15 || bt > 15) {
      alert("Invalid values!");
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

  // Generate Gantt Chart
  const generateGantt = () => {
    if (processes.length === 0) return;

    let readyQueue = [...processes].sort((a, b) => a.at - b.at); // sort by AT
    let time = readyQueue[0].at; // start at first arrival
    let completed = [];
    let gantt = [];

    while (readyQueue.length > 0) {
      // get processes that have arrived
      let available = readyQueue.filter((p) => p.at <= time);

      if (available.length === 0) {
        time++;
        continue;
      }

      // pick process with smallest BT
      let next = available.reduce((min, p) =>
        p.bt < min.bt ? p : min
      );

      // process execution
      let start = time;
      let end = start + next.bt;

      gantt.push({
        process: `P${next.id}`,
        start,
        end,
      });

      time = end;
      completed.push(next);

      // remove executed process from readyQueue
      readyQueue = readyQueue.filter((p) => p.id !== next.id);
    }

    setGanttData(gantt);
  };

  const navigate = useNavigate();
  const Back = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="p-4">
      <div className="Edit flex gap-4 items-center">
        <button className="Back_button flex items-center" onClick={Back}>
          <RiArrowLeftDoubleFill className="mr-2" /> BACK
        </button>
        <h2 className="text-xl font-bold">
          Mode :-{" "}
          <u className="text-red-500">
            <select className="rounded-md bg-slate-950 text-white">
              <option>Non-Pre-Emptive</option>
              <option>Pre-Emptive</option>
            </select>
          </u>
        </h2>
        <h2 className="text-xl font-bold">
          Criteria:- <u className="text-red-500">Burst Time</u>
        </h2>
      </div>

      <marquee
        className="text-black bg-yellow-100 rounded-md mt-5 p-1"
        direction="left"
      >
        <u>Less</u> Burst Time Executes First (SJF - Non Preemptive).
      </marquee>

      <h2 className="text-xl font-bold text-center mt-5">
        CPU Process Manager
      </h2>

      <div className="Input my-3 flex gap-2 justify-center">
        <input
          type="number"
          placeholder="Arrival Time"
          value={at}
          onChange={(e) => setAt(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Burst Time"
          value={bt}
          onChange={(e) => setBt(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addProcess}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add Process
        </button>
        <button
          onClick={generateGantt}
          className="bg-green-500 text-white px-4 rounded"
        >
          Generate Gantt
        </button>
      </div>

      {/* Process Table */}
      {processes.length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-5">
          <thead>
            <tr className="bg-red-400 h-10">
              <th className="border px-2">Process</th>
              <th className="border px-2">Arrival Time</th>
              <th className="border px-2">Burst Time</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 bg-white">P{p.id}</td>
                <td className="border px-2 bg-white">{p.at}</td>
                <td className="border px-2 bg-white">{p.bt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-yellow-600 mt-3">No Processes added yet...</p>
      )}

      {/* Gantt Chart */}
      {ganttData.length > 0 && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold mb-3">Gantt Chart</h2>
          <div className="flex justify-center items-center">
            {ganttData.map((g, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="border bg-blue-200 px-4 py-2 m-1 rounded shadow">
                  {g.process}
                </div>
                <div className="flex justify-between w-full text-sm">
                  <span>{g.start}</span>
                  {index === ganttData.length - 1 && <span>{g.end}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Try;
