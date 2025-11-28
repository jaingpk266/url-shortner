import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import API from "../api";

export default function Status() {
  const [status, setStatus] = useState("Checking...");
  const [isOnline, setIsOnline] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    setLoading(true);

    try {
      const res = await API.get("/healthz");
      if (res.data.status === "ok") {
        setStatus("Backend is running fine");
        setIsOnline(true);
      } else {
        setStatus("Backend is unreachable");
        setIsOnline(false);
      }
    } catch (err) {
      setStatus("Backend is unreachable");
      setIsOnline(false);
    }

    setLastChecked(new Date());
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="max-w-xl space-y-6">

      <h1 className="text-2xl font-semibold">System Status</h1>

      {/* Card */}
      <div className="p-6 border rounded-xl shadow-sm bg-white space-y-5">

        {/* Status Row */}
        <div className="flex items-center gap-3">
          {isOnline ? (
            <CheckCircle className="text-green-600" size={28} />
          ) : (
            <XCircle className="text-red-500" size={28} />
          )}

          <div>
            <p className="text-lg font-medium">
              {loading ? "Checking..." : status}
            </p>

            <p className="text-gray-500 text-sm">
              {lastChecked
                ? `Last checked: ${lastChecked.toLocaleString()}`
                : "Checking..."}
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={checkStatus}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <RefreshCcw size={16} />
          Check Again
        </button>

      </div>
    </div>
  );
}
