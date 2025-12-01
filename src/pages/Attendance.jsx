import React, { useState, useEffect } from 'react';
import { Search, Shield, Filter, MoreHorizontal, ChevronLeft, ChevronRight, LogIn, LogOut, RefreshCw, AlertCircle, User, Calendar, Clock } from 'lucide-react';

// Shared animation styles
const customStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const Attendance = () => {
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const BASE_URL = import.meta.env.VITE_API_BASE

  // Fetch Visitors from Backend
  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/visitors`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch visitor data');
      }

      const data = await response.json();
      setVisitors(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError('Could not load attendance data. Please check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Format Helper: Converts ISO string to 12-hour time format
  const formatTime = (isoString) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper: Determine Status Dynamically
  const getVisitorStatus = (visitor) => {
    const now = new Date();
    const validUntil = visitor.validUntil ? new Date(visitor.validUntil) : null;
    const hasCheckedIn = !!visitor.checkInTime;
    const hasCheckedOut = !!visitor.checkOutTime;
    const isExpired = validUntil && now > validUntil;

    if (hasCheckedIn && !hasCheckedOut) {
        if (isExpired) return 'Expired';
        return 'Active';
    }

    if (hasCheckedIn && hasCheckedOut) {
        if (!isExpired) return 'Not Active';
    }

    return visitor.status;
  };

  // Helper: Status Color Mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Not Active': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'Checked Out': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Registered': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Expired': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500 animate-pulse';
      case 'Not Active': return 'bg-gray-400';
      case 'Checked Out': return 'bg-slate-400';
      case 'Registered': return 'bg-blue-500';
      case 'Expired': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  // Search Filter Logic
  const filteredVisitors = visitors.filter(visitor => 
    visitor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.passId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.hostName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredVisitors.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredVisitors.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-10 font-sans text-slate-900">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-10 opacity-0 animate-fade-in-up">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight flex items-center gap-3">
            <Shield className="text-[#facc15]" size={32} />
            Security Log
          </h1>
          <p className="text-slate-500 mt-2 font-medium ml-1 text-sm sm:text-base">
            Real-time tracking for <span className="text-[#0b1f3b] font-bold">Event Visitors</span>.
          </p>
        </div>

        {/* Search / Refresh Bar */}
        <div className="w-full lg:w-auto flex gap-3">
            <div className="relative group flex-grow lg:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-[#facc15] transition-colors duration-300" size={20} />
            </div>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                }}
                placeholder="Search Name, Pass ID..." 
                className="w-full lg:w-96 pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium shadow-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0b1f3b] transition-all duration-300 text-sm"
            />
            </div>
            
            <button 
                onClick={fetchVisitors} 
                className="p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#0b1f3b] hover:text-[#0b1f3b] text-slate-500 transition-all shadow-sm"
                title="Refresh Data"
            >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in-up">
            <AlertCircle size={20} />
            {error}
        </div>
      )}

      {/* Main Content Container */}
      <div 
        className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col min-h-[400px] sm:min-h-[600px]"
        style={{ animationDelay: '200ms' }}
      >
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1 bg-[#0b1f3b] text-white text-xs font-bold rounded-full shadow-lg shadow-blue-900/20 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#facc15] rounded-full animate-pulse"></span>
                    Live Feed
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium ml-2">Total: {visitors.length}</span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium ml-2 border-l pl-3 border-slate-200">
                    Active: {visitors.filter(v => getVisitorStatus(v) === 'Active').length}
                </span>
            </div>
            
            <button className="hidden sm:block text-slate-400 hover:text-[#0b1f3b] transition-colors">
                <MoreHorizontal size={20} />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow relative">
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <RefreshCw size={32} className="animate-spin text-[#0b1f3b]" />
                        <span className="font-medium text-sm">Loading data...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* --- DESKTOP TABLE VIEW --- */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">Visitor Profile</th>
                                    <th className="px-6 py-5">Event & Host</th>
                                    <th className="px-6 py-5">Check In</th>
                                    <th className="px-6 py-5">Check Out</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentRows.map((visitor) => {
                                    const currentStatus = getVisitorStatus(visitor);
                                    return (
                                        <tr key={visitor._id || visitor.passId} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0b1f3b] flex flex-col items-center justify-center font-mono text-[10px] font-bold border border-blue-100 shrink-0">
                                                        <span>VIS</span>
                                                        <span className="text-[9px]">{visitor.passId.split('-')[1]}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-bold text-[#0b1f3b] capitalize">{visitor.fullName}</p>
                                                        <p className="text-xs text-slate-500 capitalize">{visitor.visitorType === 'oneday' ? 'One-Day Pass' : 'Multi-Day Pass'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-700">{visitor.purpose}</span>
                                                    <span className="text-xs text-slate-400">Host: {visitor.hostName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center text-sm font-medium text-slate-700">
                                                    <LogIn size={14} className={`mr-2 ${visitor.checkInTime ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                    {formatTime(visitor.checkInTime)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center text-sm font-medium text-slate-700">
                                                    <LogOut size={14} className={`mr-2 ${visitor.checkOutTime ? 'text-amber-500' : 'text-slate-300'}`} />
                                                    {formatTime(visitor.checkOutTime)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(currentStatus)}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(currentStatus)}`}></span>
                                                    {currentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* --- MOBILE CARD VIEW --- */}
                    <div className="md:hidden flex flex-col divide-y divide-slate-100">
                        {currentRows.map((visitor) => {
                            const currentStatus = getVisitorStatus(visitor);
                            return (
                                <div key={visitor._id || visitor.passId} className="p-5 hover:bg-slate-50 transition-colors">
                                    {/* Top Row: Name, ID, Status */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0b1f3b] flex flex-col items-center justify-center font-mono text-[10px] font-bold border border-blue-100 shrink-0">
                                                <span>VIS</span>
                                                <span className="text-[9px]">{visitor.passId.split('-')[1]}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-[#0b1f3b]">{visitor.fullName}</h3>
                                                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                                    {visitor.visitorType === 'oneday' ? 'One-Day' : 'Multi-Day'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(currentStatus)}`}>
                                            {currentStatus}
                                        </span>
                                    </div>

                                    {/* Middle Row: Host Info */}
                                    <div className="mb-4 pl-[52px]">
                                        <div className="flex items-center text-xs text-slate-600 mb-1">
                                            <User size={12} className="mr-2 text-slate-400" />
                                            <span className="font-semibold mr-1">Host:</span> {visitor.hostName}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-600">
                                            <Calendar size={12} className="mr-2 text-slate-400" />
                                            <span className="font-semibold mr-1">Purpose:</span> {visitor.purpose}
                                        </div>
                                    </div>

                                    {/* Bottom Row: Timings */}
                                    <div className="grid grid-cols-2 gap-3 pl-[52px]">
                                        <div className={`p-2 rounded-lg border text-xs flex flex-col ${visitor.checkInTime ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <span className="text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400 flex items-center gap-1">
                                                <LogIn size={10} /> Check In
                                            </span>
                                            <span className={`font-mono font-medium ${visitor.checkInTime ? 'text-emerald-700' : 'text-slate-400'}`}>
                                                {formatTime(visitor.checkInTime)}
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-lg border text-xs flex flex-col ${visitor.checkOutTime ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <span className="text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400 flex items-center gap-1">
                                                <LogOut size={10} /> Check Out
                                            </span>
                                            <span className={`font-mono font-medium ${visitor.checkOutTime ? 'text-amber-700' : 'text-slate-400'}`}>
                                                {formatTime(visitor.checkOutTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Empty State */}
                    {currentRows.length === 0 && (
                        <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                            <Search size={48} className="text-slate-200 mb-4" />
                            <p className="text-lg font-medium text-slate-500">No visitors found</p>
                            <p className="text-sm">We couldn't find any visitors matching "{searchTerm}"</p>
                        </div>
                    )}
                </>
            )}
        </div>
        
        {/* Pagination / Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-medium gap-3">
             <span>
               Showing <span className="font-bold text-[#0b1f3b]">{currentRows.length > 0 ? indexOfFirstRow + 1 : 0}</span> to <span className="font-bold text-[#0b1f3b]">{Math.min(indexOfLastRow, filteredVisitors.length)}</span> of <span className="font-bold text-[#0b1f3b]">{filteredVisitors.length}</span>
             </span>
             
             <div className="flex gap-2">
                 <button 
                   onClick={handlePrevPage}
                   disabled={currentPage === 1}
                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0b1f3b] hover:text-[#0b1f3b] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm"
                 >
                   <ChevronLeft size={14} /> Prev
                 </button>
                 
                 <div className="flex items-center gap-1 px-2">
                   <span className="bg-[#0b1f3b] text-white w-7 h-7 rounded-lg flex items-center justify-center shadow-md">
                        {currentPage}
                   </span>
                   <span className="text-slate-400">/</span>
                   <span className="w-7 h-7 flex items-center justify-center">
                        {totalPages || 1}
                   </span>
                 </div>

                 <button 
                   onClick={handleNextPage}
                   disabled={currentPage === totalPages || totalPages === 0}
                   className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0b1f3b] hover:text-[#0b1f3b] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm"
                 >
                   Next <ChevronRight size={14} />
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;