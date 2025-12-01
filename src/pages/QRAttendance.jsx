import React, { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

const QRAttendance = () => {
  const [lastScan, setLastScan] = useState(null);
  const [message, setMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success', 'error', 'warning'
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);

  const { ref } = useZxing({
    paused: paused,
    onDecodeResult(result) {
      handleScan(result.getText());
    },
  });

  // Auto-reset scanner after 3 seconds when paused
  useEffect(() => {
    let timer;
    if (paused && (message || lastScan)) {
      timer = setTimeout(() => {
        resetScanner();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [paused, message, lastScan]);

  const handleScan = async (qrString) => {
    if (loading || paused) return;

    setPaused(true); // Pause scanning while processing
    setLoading(true);
    setMessage("");
    setLastScan(null);
    setStatusType("");

    let passId;
    try {
      const qrData = JSON.parse(qrString);
      passId = qrData.passId;
    } catch {
      // If not JSON, maybe it's just the ID string?
      passId = qrString;
    }

    if (!passId) {
      setMessage("Invalid QR Code Format");
      setStatusType("error");
      setLoading(false);
      return;
    }
const BASE_URL=import.meta.env.VITE_API_BASE
    try {
      const response = await axios.post(`${BASE_URL}/api/visitors/scan`, { passId });

      const { visitor, message, type } = response.data;

      setLastScan(visitor);
      setMessage(message || "Scan Successful");

      if (type === 'check-in') {
        setStatusType("success");
      } else if (type === 'check-out') {
        setStatusType("warning"); // Yellow for check-out
      } else {
        setStatusType("info");
      }

    } catch (error) {
      console.error(error);
      // Check for network error or server error
      const errorMsg = error.response?.data?.message || error.message || "Scan Failed";
      setMessage(errorMsg);
      setStatusType("error");
      if (error.response?.data?.visitor) {
        setLastScan(error.response.data.visitor);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setLastScan(null);
    setMessage("");
    setStatusType("");
    setPaused(false);
  };

  return (
    <div className="min-h-screen p-6 bg-[#f8fafc] text-center font-sans flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-[#0b1f3b] mb-2">QR Attendance Scanner</h1>
      <p className="text-slate-500 mb-8">Scan visitor pass to mark Check-In / Check-Out</p>

      {/* Scanner Container */}
      <div className="relative w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-[#0b1f3b]">
        {!paused ? (
          <video ref={ref} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
            <div className="text-center px-6">
              <p className="font-bold text-lg mb-2">Scanner Paused</p>
              <p className="text-sm text-slate-400">Resuming in 3s...</p>
            </div>
          </div>
        )}

        {/* Overlay Guide */}
        {!paused && (
          <div className="absolute inset-0 border-2 border-white/30 m-12 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-64 h-0.5 bg-red-500/50 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mt-8 px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 text-lg font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 ${statusType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
          statusType === 'warning' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
            statusType === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
              'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
          {statusType === 'success' && <CheckCircle size={24} />}
          {statusType === 'warning' && <CheckCircle size={24} />}
          {statusType === 'error' && <XCircle size={24} />}
          {message}
        </div>
      )}

      {/* Visitor Details Card */}
      {lastScan && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl w-full max-w-md text-left border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Visitor</p>
              <h3 className="text-2xl font-bold text-[#0b1f3b]">{lastScan.fullName}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${lastScan.status === 'Active' ? 'bg-green-100 text-green-700' :
              lastScan.status === 'Checked Out' ? 'bg-gray-100 text-gray-600' :
                lastScan.status === 'Expired' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
              }`}>
              {lastScan.status}
            </span>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Pass ID:</span>
              <span className="font-mono font-bold text-slate-800">{lastScan.passId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Host:</span>
              <span className="font-medium text-slate-800">{lastScan.hostName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Check-In:</span>
              <span className="font-medium text-slate-800">
                {lastScan.checkInTime ? new Date(lastScan.checkInTime).toLocaleString() : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-Out:</span>
              <span className="font-medium text-slate-800">
                {lastScan.checkOutTime ? new Date(lastScan.checkOutTime).toLocaleString() : '-'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      {paused && (
        <button
          onClick={resetScanner}
          className="mt-8 flex items-center gap-2 px-8 py-3 bg-[#0b1f3b] text-[#facc15] font-bold rounded-xl hover:bg-[#142a50] transition shadow-lg hover:shadow-xl active:scale-95"
        >
          <RefreshCw size={20} />
          Scan Next Visitor Now
        </button>
      )}

    </div>
  );
};

export default QRAttendance;
