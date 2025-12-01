import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, AlertCircle, CheckCircle, ArrowUpRight, Clock, MoreVertical, RefreshCw, MapPin, CalendarDays } from "lucide-react";

// Custom styles for specific animations (Shimmer effect)
const customStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const StatCard = ({ title, value, icon, subtext, trend, delay }) => (
  <div 
    className="relative group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-blue-100 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden opacity-0 animate-fade-in-up cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Gradient Blob on Hover */}
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    
    {/* Yellow Accent Line (Animated) */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0b1f3b] to-[#facc15] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>

    <div className="relative flex justify-between items-start z-10">
      <div>
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1 transition-colors group-hover:text-[#0b1f3b]">{title}</p>
        <h3 className="text-4xl font-extrabold text-[#0b1f3b] tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
          {value}
        </h3>
      </div>
      
      {/* Icon Container with Rotation/Color Swap */}
      <div className="p-3.5 rounded-xl bg-slate-50 text-[#0b1f3b] shadow-sm group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] group-hover:rotate-12 group-hover:shadow-lg transition-all duration-300 ease-out">
        {icon}
      </div>
    </div>
    
    <div className="relative mt-4 flex items-center text-sm z-10">
      <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg group-hover:bg-emerald-100 transition-colors">
        <ArrowUpRight size={14} className="mr-1" /> {trend}
      </span>
      <span className="text-slate-400 ml-3 text-xs font-medium group-hover:text-slate-500 transition-colors">{subtext}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
const BASE_URL=import.meta.env.VITE_API_BASE
  // Helper: Calculate dynamic status
  const getVisitorStatus = (visitor) => {
    const now = new Date();
    const validUntil = visitor.validUntil ? new Date(visitor.validUntil) : null;
    const hasCheckedIn = !!visitor.checkInTime;
    const hasCheckedOut = !!visitor.checkOutTime;
    const isExpired = validUntil && now > validUntil;

    // 1. Check for Active (Inside Campus)
    if (hasCheckedIn && !hasCheckedOut) {
        if (isExpired) return 'Expired';
        return 'Active';
    }
    
    // 2. Check for Expired explicitly
    if (isExpired) return 'Expired';

    // 3. Check for Not Active (Outside Campus but Valid)
    if (hasCheckedIn && hasCheckedOut) {
        return 'Not Active';
    }
    
    if (visitor.status === 'Registered') return 'Registered';

    return visitor.status;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [visitorRes, eventRes] = await Promise.all([
            fetch(`${BASE_URL}/api/visitors`),
            fetch(`${BASE_URL}/api/events`)
        ]);

        if (visitorRes.ok && eventRes.ok) {
            const visitorData = await visitorRes.json();
            const eventData = await eventRes.json();
            setVisitors(visitorData);
            setEvents(eventData);
        }
    } catch (error) {
        console.error("Failed to fetch dashboard data", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Helper
  const formatTime = (isoString) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  const formatDate = (isoString) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // --- STATS CALCULATION ---
  const totalVisitors = visitors.length;
  // Active Events: Status is Upcoming or Running
  const activeEventsCount = events.filter(e => e.status === 'Upcoming' || e.status === 'Running').length;
  // Inside Campus: Status is Active
  const insideCampusCount = visitors.filter(v => getVisitorStatus(v) === 'Active').length;
  // Outside Campus: Status is Not Active (Checked Out but Valid)
  const outsideCampusCount = visitors.filter(v => getVisitorStatus(v) === 'Not Active').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight hover:tracking-wide transition-all duration-300 cursor-default">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">Welcome back,  <span className="text-[#facc15] font-bold">Admin.</span></p>
        </div>
        
        {/* Live Status Pill */}
        <button onClick={fetchData} className="mt-4 md:mt-0 flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group w-full md:w-auto justify-center md:justify-start">
           <div className="relative">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 blur-sm opacity-50"></div>
           </div>
           <span className="text-sm font-bold text-[#0b1f3b] group-hover:text-blue-700 transition-colors">System Online</span>
           <RefreshCw size={14} className={`text-slate-400 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <StatCard
          title="Total Visitors"
          value={totalVisitors}
          trend="Live"
          subtext="Total registrations"
          icon={<Users size={26} strokeWidth={1.5} />}
          delay={100}
        />
        <StatCard
          title="Active Events"
          value={activeEventsCount}
          trend="Upcoming"
          subtext="Running & Scheduled"
          icon={<Calendar size={26} strokeWidth={1.5} />}
          delay={200}
        />
        <StatCard
          title="Inside Campus"
          value={insideCampusCount}
          trend="Now"
          subtext="Currently checked in"
          icon={<MapPin size={26} strokeWidth={1.5} />}
          delay={300}
        />
        <StatCard
          title="Outside Campus"
          value={outsideCampusCount}
          trend="Valid"
          subtext="Checked out & Valid"
          icon={<CheckCircle size={26} strokeWidth={1.5} />}
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
        {/* --- RECENT VISITOR LOG TABLE --- */}
        <div 
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col" 
            style={{ animationDelay: '500ms' }}
        >
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-white via-white to-blue-50/30">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-blue-50 rounded-2xl text-[#0b1f3b] group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] transition-colors duration-300">
                    <Clock size={22} />
                    </div>
                    <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0b1f3b] group-hover:text-blue-800 transition-colors">Recent Visitor Log</h3>
                    <p className="text-sm text-slate-500 font-medium">Real-time entry tracking (Latest 5)</p>
                    </div>
                </div>

                <button 
                  onClick={() => navigate('/event-passes')}
                  className="w-full md:w-auto group relative px-6 py-3 bg-[#0b1f3b] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center md:justify-start gap-2">
                    View All Visitor Logs
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </button>
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">Visitor Details</th>
                        <th className="px-6 py-5">Pass Type</th>
                        <th className="px-6 py-5">Host</th>
                        <th className="px-6 py-5">Time In</th>
                        <th className="px-6 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {visitors.slice(0, 5).map((visitor) => {
                        const status = getVisitorStatus(visitor);
                        return (
                            <tr key={visitor._id || visitor.passId} className="group hover:bg-white relative transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-900/5 hover:z-10 hover:-translate-y-0.5 border-l-4 border-transparent hover:border-l-[#facc15]">
                                <td className="px-8 py-5">
                                    <div className="flex items-center">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0b1f3b] to-[#254675] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 group-hover:shadow-blue-900/30 transition-all duration-300">
                                        {visitor.fullName.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-bold text-[#0b1f3b] group-hover:text-blue-700 transition-colors capitalize">{visitor.fullName}</p>
                                        <p className="text-xs text-slate-500 font-medium">ID: {visitor.passId}</p>
                                    </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${visitor.visitorType === 'oneday' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                    {visitor.visitorType === 'oneday' ? 'One-Day' : 'Multi-Day'}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-600 font-medium">{visitor.hostName}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center text-slate-500 font-mono text-sm bg-slate-50 px-2 py-1 rounded w-fit group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-100">
                                    <Clock size={12} className="mr-2 text-slate-400" />
                                    {formatTime(visitor.checkInTime)}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                    {status}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="text-slate-300 hover:text-[#0b1f3b] p-2 hover:bg-slate-100 rounded-lg transition-all transform hover:rotate-90">
                                    <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile View Visitors */}
            <div className="md:hidden flex flex-col divide-y divide-slate-100">
                {visitors.slice(0, 5).map((visitor) => {
                    const status = getVisitorStatus(visitor);
                    return (
                        <div key={visitor._id} className="p-5 bg-white hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b1f3b] to-[#254675] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    {visitor.fullName.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-[#0b1f3b] capitalize">{visitor.fullName}</p>
                                    <p className="text-xs text-slate-500 font-medium">ID: {visitor.passId}</p>
                                </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2.5 py-1 rounded-md text-xs font-bold border bg-blue-50 text-blue-700 border-blue-100">
                                    {visitor.visitorType}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                <div className="flex items-center text-slate-400 text-xs font-medium">
                                <Clock size={12} className="mr-1.5" />
                                {formatTime(visitor.checkInTime)}
                                </div>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                {status}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- RECENT EVENTS TABLE --- */}
        <div 
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col mt-4" 
            style={{ animationDelay: '600ms' }}
        >
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-white via-white to-blue-50/30">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-900 group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] transition-colors duration-300">
                    <CalendarDays size={22} />
                    </div>
                    <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0b1f3b] group-hover:text-blue-800 transition-colors">Recent Events</h3>
                    <p className="text-sm text-slate-500 font-medium">Upcoming & Running Events (Latest 5)</p>
                    </div>
                </div>
                
                <button 
                  onClick={() => navigate('/events')}
                  className="w-full md:w-auto group relative px-6 py-3 bg-[#0b1f3b] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center md:justify-start gap-2">
                    View All Events 
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </button>
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">Event Name</th>
                        <th className="px-6 py-5">Host</th>
                        <th className="px-6 py-5">Type</th>
                        <th className="px-6 py-5">Date</th>
                        <th className="px-6 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {events.slice(0, 5).map((event) => (
                        <tr key={event._id} className="group hover:bg-white relative transition-all duration-300 ease-out hover:shadow-lg hover:shadow-indigo-900/5 hover:z-10 hover:-translate-y-0.5 border-l-4 border-transparent hover:border-l-indigo-500">
                            <td className="px-8 py-5">
                                <p className="text-sm font-bold text-[#0b1f3b] group-hover:text-indigo-700 transition-colors capitalize">{event.title}</p>
                                <p className="text-xs text-slate-500 font-medium">{event.location}</p>
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-slate-700">{event.host}</td>
                            <td className="px-6 py-5">
                                <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">
                                {event.type}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center text-slate-500 font-mono text-sm">
                                <Calendar size={12} className="mr-2 text-slate-400" />
                                {formatDate(event.startDate)}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                event.status === 'Running' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                event.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${event.status === 'Running' ? 'bg-emerald-500 animate-pulse' : event.status === 'Upcoming' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                                {event.status}
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button className="text-slate-300 hover:text-[#0b1f3b] p-2 hover:bg-slate-100 rounded-lg transition-all transform hover:rotate-90">
                                <MoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View Events */}
            <div className="md:hidden flex flex-col divide-y divide-slate-100">
                {events.slice(0, 5).map((event) => (
                    <div key={event._id} className="p-5 bg-white hover:bg-slate-50 transition-colors">
                        <div className="mb-2">
                             <p className="text-sm font-bold text-[#0b1f3b] capitalize">{event.title}</p>
                             <p className="text-xs text-slate-500 font-medium">Host: {event.host}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">
                                {event.type}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                             <div className="flex items-center text-slate-400 text-xs font-medium">
                                <Calendar size={12} className="mr-1.5" />
                                {formatDate(event.startDate)}
                            </div>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${event.status === 'Running' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                {event.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;