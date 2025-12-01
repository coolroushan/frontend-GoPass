import React, { useState, useEffect } from 'react';
import { BarChart2, Shield, RefreshCw, AlertCircle, Users, Clock, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

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

const Reports = () => {
  const [stats, setStats] = useState([]); 
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
const BASE_URL=import.meta.env.VITE_API_BASE
  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch both endpoints in parallel
      const [visitorRes, statsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/visitors`),
        fetch(`${BASE_URL}/api/visitors/stats`)
      ]);

      if (!visitorRes.ok || !statsRes.ok) throw new Error('Failed to fetch report data');

      const visitorData = await visitorRes.json();
      const statsData = await statsRes.json();

      setVisitors(visitorData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError('Could not load report data. Please check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: Calculate dynamic status for accurate reporting
  const getVisitorStatus = (visitor) => {
    const now = new Date();
    const validUntil = visitor.validUntil ? new Date(visitor.validUntil) : null;
    const hasCheckedIn = !!visitor.checkInTime;
    const hasCheckedOut = !!visitor.checkOutTime;
    const isExpired = validUntil && now > validUntil;

    // 1. Check for Active
    if (hasCheckedIn && !hasCheckedOut) {
        if (isExpired) return 'Expired';
        return 'Active';
    }
    
    // 2. Check for Expired explicitly (even if registered or checked out)
    if (isExpired) {
        return 'Expired';
    }

    // 3. Check for Not Active (Checked Out or just Registered and valid)
    if (hasCheckedIn && hasCheckedOut) {
        return 'Not Active';
    }
    
    // 4. Fallback for Registered users who are valid
    if (visitor.status === 'Registered') {
        return 'Not Active';
    }

    return visitor.status;
  };

  // Process data for Pie Chart
  // Groups data into: Active, Not Active, Expired
  const statusCounts = visitors.reduce((acc, visitor) => {
    let status = getVisitorStatus(visitor);
    
    // Ensure we categorize specific DB statuses into our 3 main buckets if getVisitorStatus didn't catch them
    if (status === 'Checked Out' || status === 'Registered') {
        status = 'Not Active';
    }

    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Active', value: statusCounts['Active'] || 0, color: '#10b981' }, // Emerald
    { name: 'Not Active', value: statusCounts['Not Active'] || 0, color: '#94a3b8' }, // Slate (Gray)
    { name: 'Expired', value: statusCounts['Expired'] || 0, color: '#ef4444' }, // Red
  ].filter(item => item.value > 0);

  // KPIs Calculation
  const totalVisitors = visitors.length;
  const activeVisitors = statusCounts['Active'] || 0;
  const expiredVisitors = statusCounts['Expired'] || 0;
  const todayDate = new Date().toISOString().split('T')[0];
  const todayRegistrations = stats.find(s => s.date === todayDate)?.visitors || 0;


  // Custom Tooltip for Bar Graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1f3b] text-white p-3 rounded-lg shadow-lg text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-[#facc15]">Visitors: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 sm:p-10 font-sans text-slate-900">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 opacity-0 animate-fade-in-up">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl font-extrabold text-[#0b1f3b] tracking-tight flex items-center gap-3">
            <BarChart2 className="text-[#facc15]" size={32} />
            Analytics & Reports
          </h1>
          <p className="text-slate-500 mt-2 font-medium ml-1">
            Comprehensive overview of <span className="text-[#0b1f3b] font-bold">Visitor Statistics</span>.
          </p>
        </div>
        
        <button 
            onClick={fetchData} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#0b1f3b] hover:text-[#0b1f3b] text-slate-500 transition-all shadow-sm"
        >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span className="font-medium text-sm">Refresh Reports</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in-up">
            <AlertCircle size={20} />
            {error}
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Card 1: Total Visitors */}
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={24} />
              </div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Visitors</p>
                  <h3 className="text-2xl font-extrabold text-[#0b1f3b]">{totalVisitors}</h3>
              </div>
          </div>

          {/* Card 2: Active Now */}
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Activity size={24} />
              </div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Now</p>
                  <h3 className="text-2xl font-extrabold text-[#0b1f3b]">{activeVisitors}</h3>
              </div>
          </div>

          {/* Card 3: Today's Registrations */}
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp size={24} />
              </div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Today</p>
                  <h3 className="text-2xl font-extrabold text-[#0b1f3b]">{todayRegistrations}</h3>
              </div>
          </div>

           {/* Card 4: Expired Stats (Previously Completed) */}
           <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <XCircle size={24} />
              </div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired Passes</p>
                  <h3 className="text-2xl font-extrabold text-[#0b1f3b]">{expiredVisitors}</h3>
              </div>
          </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100">
             <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#0b1f3b] flex items-center gap-2">
                        Daily Registrations
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Volume of visitors per day</p>
                </div>
             </div>
             
             <div className="h-80 w-full">
                {stats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="date" 
                                tick={{fontSize: 10, fill: '#64748b'}} 
                                axisLine={false} 
                                tickLine={false}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                }}
                            />
                            <YAxis 
                                tick={{fontSize: 10, fill: '#64748b'}} 
                                axisLine={false} 
                                tickLine={false} 
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="visitors" radius={[4, 4, 0, 0]} barSize={50}>
                                {stats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === stats.length - 1 ? '#0b1f3b' : '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        {isLoading ? 'Loading chart data...' : 'No analytics data available'}
                    </div>
                )}
             </div>
        </div>

        {/* Donut Chart for Status */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-[#0b1f3b]">Status Breakdown</h2>
                <p className="text-xs text-slate-400 mt-1">Active, Not Active & Expired</p>
            </div>

            <div className="h-64 w-full flex-grow relative">
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#0b1f3b', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36} 
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => <span className="text-slate-500 text-xs font-medium ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                     <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        No data
                    </div>
                )}
                
                {/* Center Text Overlay */}
                {pieData.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                        <div className="text-center">
                            <span className="text-3xl font-extrabold text-[#0b1f3b]">{totalVisitors}</span>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;