import { Card, CardContent } from "@/components/ui/card";

function FormulaFrame({ processes }) {
  // Calculate totals
  const totalTAT = processes.reduce((sum, p) => sum + (p.ct - p.at), 0);
  const totalWT = processes.reduce((sum, p) => sum + ((p.ct - p.at) - p.bt), 0);

  // Averages
  const avgTAT = (totalTAT / processes.length).toFixed(2);
  const avgWT = (totalWT / processes.length).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Formula Card */}
      <Card className="shadow-lg rounded-2xl p-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-3 text-blue-600">📘 CPU Scheduling Formulas</h2>
          <ul className="list-disc pl-5 space-y-2 text-base">
            <li>
              <span className="font-semibold">Completion Time (CT):</span> Time when process finishes execution.
            </li>
            <li>
              <span className="font-semibold">Turnaround Time (TAT):</span>{" "}
              <code className="bg-gray-100 px-1 rounded">CT - AT</code>
            </li>
            <li>
              <span className="font-semibold">Waiting Time (WT):</span>{" "}
              <code className="bg-gray-100 px-1 rounded">TAT - BT</code>
            </li>
            <li>
              <span className="font-semibold">Average TAT:</span>{" "}
              <code className="bg-gray-100 px-1 rounded">Σ TAT / N</code>
            </li>
            <li>
              <span className="font-semibold">Average WT:</span>{" "}
              <code className="bg-gray-100 px-1 rounded">Σ WT / N</code>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Average Result Card */}
      <Card className="shadow-lg rounded-2xl p-4 bg-blue-50">
        <CardContent>
          <h2 className="text-xl font-bold mb-3 text-green-700">📊 Average Results</h2>
          <ul className="list-disc pl-5 text-base space-y-1">
            <li>Total TAT = {totalTAT}</li>
            <li>Total WT = {totalWT}</li>
            <li>Average TAT = {avgTAT}</li>
            <li>Average WT = {avgWT}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default FormulaFrame;
