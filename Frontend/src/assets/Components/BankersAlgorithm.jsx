import React, { useState, useEffect } from "react";

export default function BankersAlgorithm() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(3);
  const [allocation, setAllocation] = useState([]);
  const [maxNeed, setMaxNeed] = useState([]);
  const [need, setNeed] = useState([]);
  const [safeSequence, setSafeSequence] = useState([]);
  const [steps, setSteps] = useState([]);
  const [totalResources, setTotalResources] = useState([]);
  const [available, setAvailable] = useState([]);

  // Generate empty matrices
  const generateMatrices = () => {
    setAllocation(Array(numProcesses).fill(0).map(() => Array(numResources).fill(0)));
    setMaxNeed(Array(numProcesses).fill(0).map(() => Array(numResources).fill(0)));
    setNeed(Array(numProcesses).fill(0).map(() => Array(numResources).fill(0)));
    setTotalResources(Array(numResources).fill(0));
    setAvailable(Array(numResources).fill(0));
    setSafeSequence([]);
    setSteps([]);
  };

  const handleAllocationChange = (i, j, value) => {
    const updated = [...allocation];
    updated[i][j] = parseInt(value) || 0;
    setAllocation(updated);
  };

  const handleMaxChange = (i, j, value) => {
    const updated = [...maxNeed];
    updated[i][j] = parseInt(value) || 0;
    setMaxNeed(updated);
  };

  const handleTotalChange = (j, value) => {
    const updated = [...totalResources];
    updated[j] = parseInt(value) || 0;
    setTotalResources(updated);
  };

  // Compute Available automatically: totalResources - sum(allocation column)
  useEffect(() => {
    if (allocation.length && totalResources.length) {
      const newAvailable = Array(numResources).fill(0);
      for (let j = 0; j < numResources; j++) {
        const totalAlloc = allocation.reduce((sum, row) => sum + row[j], 0);
        newAvailable[j] = (totalResources[j] || 0) - totalAlloc;
      }
      setAvailable(newAvailable);
    }
  }, [allocation, totalResources, numResources]);

  // Need = Max - Allocation
  const calculateNeed = () => {
    const n = allocation.length;
    const m = totalResources.length;
    const newNeed = Array(n)
      .fill(0)
      .map((_, i) =>
        Array(m)
          .fill(0)
          .map((_, j) => (maxNeed[i][j] || 0) - (allocation[i][j] || 0))
      );
    setNeed(newNeed);
    return newNeed;
  };

  const runBankersAlgorithm = () => {
    const n = allocation.length;
    const m = totalResources.length;
    const newNeed = calculateNeed();

    const work = [...available];
    const finish = Array(n).fill(false);
    const seq = [];
    const stepLog = [];

    let count = 0;
    while (count < n) {
      let found = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          let canRun = true;
          for (let j = 0; j < m; j++) {
            if (newNeed[i][j] > work[j]) {
              canRun = false;
              break;
            }
          }
          if (canRun) {
            stepLog.push(`P${i} can execute → Available: [${work.join(", ")}]`);
            for (let j = 0; j < m; j++) work[j] += allocation[i][j];
            finish[i] = true;
            seq.push(`P${i}`);
            stepLog.push(`After P${i} finishes → Available: [${work.join(", ")}]`);
            count++;
            found = true;
          }
        }
      }
      if (!found) break;
    }

    const isSafe = finish.every((f) => f);
    setSteps(stepLog);
    setSafeSequence(isSafe ? seq : ["No Safe Sequence (Unsafe State)"]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Dynamic Banker's Algorithm Simulator
      </h1>

      {/* Inputs for Processes & Resources */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="font-semibold text-sm">No. of Processes:</label>
          <input
            type="number"
            min="1"
            className="border rounded px-2 py-1 ml-2 w-20 text-center"
            value={numProcesses}
            onChange={(e) => setNumProcesses(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm">No. of Resources:</label>
          <input
            type="number"
            min="1"
            className="border rounded px-2 py-1 ml-2 w-20 text-center"
            value={numResources}
            onChange={(e) => setNumResources(parseInt(e.target.value) || 0)}
          />
        </div>
        <button
          onClick={generateMatrices}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Generate Table
        </button>
      </div>

      {/* Total Resources Input */}
      {allocation.length > 0 && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-blue-700">Enter Total Resources:</h3>
          <div className="flex gap-2">
            {Array(numResources)
              .fill(0)
              .map((_, j) => (
                <input
                  key={j}
                  type="number"
                  value={totalResources[j] || ""}
                  onChange={(e) => handleTotalChange(j, e.target.value)}
                  placeholder={`R${j}`}
                  className="border rounded px-2 py-1 w-20 text-center"
                />
              ))}
          </div>
        </div>
      )}

      {/* Combined Table */}
      {allocation.length > 0 && (
        <div className="overflow-x-auto w-full max-w-6xl">
          <h2 className="text-lg font-semibold text-blue-700 mb-3">
            Allocation | Max | Need | Available
          </h2>
          <table className="border-collapse border border-gray-400 w-full text-center bg-white">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-2 py-1">Process</th>
                {Array(numResources)
                  .fill(0)
                  .map((_, j) => (
                    <th key={`a${j}`} className="border px-2 py-1">
                      A{j}
                    </th>
                  ))}
                {Array(numResources)
                  .fill(0)
                  .map((_, j) => (
                    <th key={`m${j}`} className="border px-2 py-1">
                      M{j}
                    </th>
                  ))}
                {Array(numResources)
                  .fill(0)
                  .map((_, j) => (
                    <th key={`n${j}`} className="border px-2 py-1">
                      N{j}
                    </th>
                  ))}
                {Array(numResources)
                  .fill(0)
                  .map((_, j) => (
                    <th key={`v${j}`} className="border px-2 py-1">
                      Av{j}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {allocation.map((_, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 font-semibold text-gray-700">P{i}</td>

                  {/* Allocation */}
                  {allocation[i].map((val, j) => (
                    <td key={`a${i}${j}`} className="border px-1">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => handleAllocationChange(i, j, e.target.value)}
                        className="w-14 border rounded text-center"
                      />
                    </td>
                  ))}

                  {/* Max */}
                  {maxNeed[i].map((val, j) => (
                    <td key={`m${i}${j}`} className="border px-1">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => handleMaxChange(i, j, e.target.value)}
                        className="w-14 border rounded text-center"
                      />
                    </td>
                  ))}

                  {/* Need */}
                  {need[i]?.map((val, j) => (
                    <td key={`n${i}${j}`} className="border px-1">
                      <input
                        type="number"
                        value={val}
                        readOnly
                        className="w-14 border rounded text-center bg-gray-100"
                      />
                    </td>
                  ))}

                  {/* Available */}
                  {Array(numResources)
                    .fill(0)
                    .map((_, j) => (
                      <td key={`v${i}${j}`} className="border px-1">
                        <input
                          type="number"
                          value={available[j] || 0}
                          readOnly
                          className="w-14 border rounded text-center bg-gray-100"
                        />
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Run Algorithm */}
          <div className="flex justify-center mt-6">
            <button
              onClick={runBankersAlgorithm}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Run Banker's Algorithm
            </button>
          </div>

          {/* Output */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-700">
              Step-by-Step Execution:
            </h3>
            {steps.map((s, i) => (
              <p key={i} className="text-gray-800 mb-1">{s}</p>
            ))}
            <h3 className="text-xl font-semibold mt-4 text-purple-700">
              Safe Sequence:
            </h3>
            <p className="text-lg text-black">{safeSequence.join(" → ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
