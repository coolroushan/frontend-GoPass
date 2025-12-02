import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import html2canvas from 'html2canvas';
import { Search, Download, Printer, Eye, X, Calendar, User, Phone, MapPin, Loader, Filter, Clock, Trash2 } from 'lucide-react';

// --- STYLES FOR PRINTING & ANIMATION ---
const dashboardStyles = `
  @media print {
    body * { visibility: hidden !important; }
    #printable-area, #printable-area * { visibility: visible !important; }

    #printable-area {
      position: fixed !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 999999 !important;
    }

    /* FORCE BACKGROUNDS & COLORS */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* FIX SVG & QR NOT SHOWING */
    svg, img, canvas {
      display: block !important;
      visibility: visible !important;
    }

    .no-print { display: none !important; }
  }
`;

// --- THE PASS COMPONENT (Hidden until 'View' is clicked) ---
const PassCard = ({ data, passRef }) => {
    // QR Data Payload
    const qrData = JSON.stringify({
        passId: data.passId,
        fullName: data.fullName,
        phone: data.phone,
        visitorType: data.visitorType,
        purpose: data.purpose,
        hostName: data.hostName,
        validUntil: data.validUntil
    });

    return (
        <div ref={passRef} id="printable-area" className="bg-white w-[320px] border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative">
            {/* Header */}
            <div className="bg-[#0b1f3b] p-6 text-center relative">
                <div className="w-3 h-3 bg-[#f8fafc] rounded-full mx-auto mb-2 opacity-50"></div>
                <h2 className="text-white font-black uppercase tracking-widest text-lg">Visitor Pass</h2>
                <div className="text-[#facc15] text-[10px] font-bold uppercase tracking-wider mt-1">
                    {data.visitorType === 'oneday' ? 'One Day Access' : 'Multi-Day Access'}
                </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-3 flex items-center justify-center border-4 border-white shadow-lg -mt-10 relative z-10">
                    <User size={32} className="text-slate-400" />
                </div>

                <h1 className="text-lg font-bold text-slate-900 leading-tight">{data.fullName}</h1>
                <p className="text-xs text-slate-500 font-medium mb-4">{data.phone}</p>

                {/* QR Code */}
                <div className="p-2 border border-slate-100 rounded-lg bg-white shadow-sm mb-4">
                    <QRCode value={qrData} size={100} fgColor="#0b1f3b" level="M" />
                </div>

                {/* Details */}
                <div className="w-full text-left bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Pass ID</span>
                        <span className="text-xs font-mono font-bold text-[#0b1f3b]">{data.passId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Host</span>
                        <span className="text-xs font-bold text-slate-700">{data.hostName}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Exp</span>
                        <span className="text-xs font-bold text-red-500">
                            {new Date(data.validUntil).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const EventPass = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const passRef = useRef(null); 
    const BASE_URL = import.meta.env.VITE_API_BASE;

    // 1. Fetch Data
    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/visitors`);
            setVisitors(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    // 2. Handle Delete
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent opening the modal if user clicks delete
        
        if (window.confirm("Are you sure you want to permanently delete this visitor log?")) {
            try {
                await axios.delete(`${BASE_URL}/api/visitors/${id}`);
                // Remove from local state instantly
                setVisitors(prevVisitors => prevVisitors.filter(visitor => visitor._id !== id));
            } catch (error) {
                console.error("Error deleting visitor:", error);
                alert("Failed to delete visitor. Please check your connection.");
            }
        }
    };

    // 3. Handle Print
    const handlePrint = () => {
        window.print();
    };

    // 4. Handle Download (Image)
    const handleDownload = async () => {
        if (passRef.current) {
            const canvas = await html2canvas(passRef.current, { scale: 2 });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `Pass-${selectedVisitor.passId}.png`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 font-sans text-slate-900">
            <style>{dashboardStyles}</style>

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight hover:tracking-wide transition-all duration-300 cursor-default">Visitor Log</h1>
                        <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">Manage entries and <span className="text-[#facc15] font-bold">print passes</span> .</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search visitor..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1f3b] w-full sm:w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* List/Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="p-10 flex justify-center text-[#0b1f3b]">
                            <Loader className="animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* --- DESKTOP VIEW (Table) --- */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Visitor</th>
                                            <th className="px-6 py-4">Purpose</th>
                                            <th className="px-6 py-4">Host</th>
                                            <th className="px-6 py-4">Validity</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {visitors.map((visitor) => (
                                            <tr key={visitor._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-bold text-[#0b1f3b]">{visitor.fullName}</div>
                                                        <div className="text-xs text-slate-400 font-mono">{visitor.passId}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        {visitor.purpose}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {visitor.hostName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-xs">
                                                        <span className="text-slate-400">Expires:</span>
                                                        <span className="font-medium text-slate-700">
                                                            {new Date(visitor.validUntil).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${new Date(visitor.validUntil) > new Date()
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}>
                                                        {new Date(visitor.validUntil) > new Date() ? 'Active' : 'Expired'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedVisitor(visitor)}
                                                            className="inline-flex items-center justify-center p-2 text-[#0b1f3b] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="View Pass"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={(e) => handleDelete(visitor._id, e)}
                                                            className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Delete Visitor"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- MOBILE VIEW (Cards) --- */}
                            <div className="md:hidden flex flex-col divide-y divide-slate-100">
                                {visitors.map((visitor) => (
                                    <div key={visitor._id} className="p-5 bg-white hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-[#0b1f3b] mb-1">{visitor.fullName}</h3>
                                                <div className="text-xs text-slate-400 font-mono mb-2">{visitor.passId}</div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${new Date(visitor.validUntil) > new Date()
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                    {new Date(visitor.validUntil) > new Date() ? 'Active' : 'Expired'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedVisitor(visitor)}
                                                    className="p-2 text-[#0b1f3b] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="View Pass"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(visitor._id, e)}
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Visitor"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 mb-2">
                                            <div className="flex items-center text-xs text-slate-600">
                                                <User size={12} className="mr-2 text-slate-400" />
                                                <span className="font-bold mr-1">Host:</span> {visitor.hostName}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-600">
                                                <Filter size={12} className="mr-2 text-slate-400" />
                                                <span className="font-bold mr-1">Purpose:</span> {visitor.purpose}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                                            <div className="flex items-center text-xs text-slate-500 font-medium">
                                                <Calendar size={12} className="mr-1.5" />
                                                Expires: {new Date(visitor.validUntil).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- MODAL FOR VIEWING PASS (Unchanged) --- */}
            {selectedVisitor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1f3b]/50 backdrop-blur-sm animate-fade-in">

                    {/* Modal Content */}
                    <div className="bg-white rounded-3xl p-2 sm:p-4 shadow-2xl max-w-4xl flex flex-col sm:flex-row gap-6 sm:gap-10 relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedVisitor(null)}
                            className="absolute -top-4 -right-4 bg-white text-slate-400 hover:text-red-500 p-2 rounded-full shadow-lg border border-slate-100 no-print z-50"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Side: Visual Pass */}
                        <div className="flex justify-center items-center bg-slate-100/50 p-6 rounded-2xl border border-slate-100">
                            {/* Passing ref here allows us to target this specific div for download */}
                            <PassCard data={selectedVisitor} passRef={passRef} />
                        </div>

                        {/* Right Side: Actions */}
                        <div className="flex flex-col justify-center min-w-[200px] gap-3 pr-4 no-print">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-[#0b1f3b]">Pass Actions</h3>
                                <p className="text-sm text-slate-500">Manage {selectedVisitor.fullName.split(' ')[0]}'s entry.</p>
                            </div>

                            <button
                                onClick={handlePrint}
                                className="w-full py-3 px-4 bg-[#0b1f3b] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-blue-900 transition-all flex items-center gap-3"
                            >
                                <Printer size={18} /> Print Pass
                            </button>

                            <button
                                onClick={handleDownload}
                                className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-blue-200 transition-all flex items-center gap-3"
                            >
                                <Download size={18} /> Download
                            </button>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2"><MapPin size={14} /> {selectedVisitor.hostName}</div>
                                    <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(selectedVisitor.createdAt).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-2"><Phone size={14} /> {selectedVisitor.phone}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventPass;