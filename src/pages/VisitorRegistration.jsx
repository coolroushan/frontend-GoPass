import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed react-qr-code to prevent dependency errors
import { Camera, User, Phone, FileText, Calendar, MapPin, CreditCard, RefreshCw, X, Printer, ChevronDown } from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const customStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @media print {
  @page { size: A4 portrait; margin: 20mm; }

  body * { visibility: hidden; }

  #printable-pass, #printable-pass * { visibility: visible; }
#printable-pass {
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;           /* slightly smaller */
  transform: scale(.78);   /* fits inside printable height */
  transform-origin: top left;
  background: white;
}

}


`;

// --- REUSABLE INPUT COMPONENT ---
const InputField = ({ label, icon: Icon, type = "text", placeholder, readOnly = false, ...props }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-[#0b1f3b] transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#facc15] transition-colors duration-300">
        <Icon size={18} strokeWidth={2} />
      </div>
      <input
        type={type}
        readOnly={readOnly}
        className={`block w-full pl-10 sm:pl-12 pr-4 py-3 border rounded-xl text-sm sm:text-base font-medium transition-all duration-300 
          ${readOnly 
            ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' 
            : 'bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0b1f3b] hover:border-blue-300'
          }`}
        placeholder={placeholder}
        required={!readOnly}
        {...props}
      />
    </div>
  </div>
);

// --- THE EVENT PASS COMPONENT ---
const EventPass = ({ data, onReset }) => {
  const qrCodeData = JSON.stringify({
    passId: data.passId,
    fullName: data.fullName,
    phone: data.phone,
    visitorType: data.visitorType,
    purpose: data.purpose,
    hostName: data.hostName,
    validUntil: data.validUntil
  });

  // Using a reliable public API for QR codes to avoid package dependency issues
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}&color=0b1f3b`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in-up">
      <div id="printable-pass" className="bg-white w-[320px] border border-slate-200 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="bg-[#0b1f3b] p-6 text-center relative">
          <div className="w-3 h-3 bg-[#f8fafc] rounded-full mx-auto mb-2 opacity-50"></div>
          <h2 className="text-white font-black uppercase tracking-widest text-lg">Visitor Pass</h2>
          <div className="text-[#facc15] text-[10px] font-bold uppercase tracking-wider mt-1">
            {data.visitorType === 'oneday' ? 'One Day Access' : 'Multi-Day Access'}
          </div>
        </div>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-lg -mt-12 relative z-10">
            <User size={40} className="text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">{data.fullName}</h1>
          <p className="text-sm text-slate-500 font-medium mb-6">{data.phone}</p>
          
          {/* QR Code Container */}
          <div className="p-2 border border-slate-100 rounded-lg bg-white shadow-sm mb-6">
            <img 
              src={qrCodeUrl} 
              alt="Visitor QR Code" 
              className="w-[120px] h-[120px] object-contain"
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Event / Purpose</span>
              <span className="text-xs font-mono font-bold text-[#0b1f3b] truncate block">{data.purpose}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Host</span>
              <span className="text-xs font-bold text-slate-700 truncate block">{data.hostName}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Valid Until</span>
              <span className="text-xs font-bold text-red-500">{new Date(data.validUntil).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 p-3 text-center border-t border-slate-200">
          <p className="text-[10px] text-slate-400 font-medium">Please display this pass at all times.</p>
        </div>
      </div>
      <div className="mt-8 flex gap-4 w-full max-w-[320px]">
        <button onClick={() => window.print()} className="flex-1 bg-[#0b1f3b] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg">
          <Printer size={18} /> Print
        </button>
        <button onClick={onReset} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={18} /> New
        </button>
      </div>
    </div>
  );
};

// --- MAIN CONTROLLER COMPONENT ---
const VisitorRegistration = () => {
  const [visitorType, setVisitorType] = useState('oneday');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState(null);
  const [error, setError] = useState('');
  
  // New State for Events
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', purpose: '', hostName: '', validUntil: ''
  });
const BASE_URL=import.meta.env.VITE_API_BASE
  // Fetch Events on Mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/events`);
        setEvents(response.data);
      } catch (err) {
        console.error("Failed to load events", err);
        setError("Could not load event list. Please check connection.");
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Special Handler for Event Selection
  const handleEventChange = (e) => {
    const selectedEventTitle = e.target.value;
    
    // Find the full event object to get the host name
    const selectedEvent = events.find(ev => ev.title === selectedEventTitle);

    setFormData({
      ...formData,
      purpose: selectedEventTitle,
      hostName: selectedEvent ? selectedEvent.host : '' // Auto-populate Host
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        visitorType,
        validUntil: visitorType === 'multiday' ? formData.validUntil : undefined
      };
      const response = await axios.post(`${BASE_URL}/api/visitors`, payload);
      setGeneratedPass(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGeneratedPass(null);
    setFormData({ fullName: '', phone: '', purpose: '', hostName: '', validUntil: '' });
    setVisitorType('oneday');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 font-sans text-slate-900 flex justify-center items-start pt-6 sm:pt-10">
      <style>{customStyles}</style>

      <div className="w-full max-w-5xl">
        {!generatedPass && (
          <div className="mb-6 sm:mb-10 text-center sm:text-left animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight">Visitor Entry</h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
              Create pass for <span className="text-[#facc15] font-bold">guests & vendors</span>.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0b1f3b] via-blue-800 to-[#facc15] z-20"></div>

          {generatedPass ? (
            <EventPass data={generatedPass} onReset={handleReset} />
          ) : (
            <div className="flex flex-col md:flex-row animate-fade-in-up">
              
              {/* Sidebar - Pass Type */}
              <div className="md:w-1/3 bg-slate-50/80 p-5 sm:p-8 border-b md:border-b-0 md:border-r border-slate-100">
                <h3 className="text-sm font-bold text-[#0b1f3b] mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <CreditCard size={16} className="text-[#facc15]" /> Select Pass Type
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                  {['oneday', 'multiday'].map((type) => (
                    <button key={type} type="button" onClick={() => setVisitorType(type)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${visitorType === type ? 'border-[#0b1f3b] bg-[#0b1f3b] shadow-md' : 'border-white bg-white hover:border-blue-200'}`}>
                      <div className="flex flex-col justify-between h-full">
                        <span className={`text-[10px] font-bold uppercase ${visitorType === type ? 'text-blue-200' : 'text-slate-400'}`}>
                          {type === 'oneday' ? 'Standard' : 'Extended'}
                        </span>
                        <span className={`text-lg font-bold ${visitorType === type ? 'text-white' : 'text-[#0b1f3b]'}`}>
                          {type === 'oneday' ? 'One-Day' : 'Multi-Day'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Area */}
              <div className="md:w-2/3 p-5 sm:p-10">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2">
                    <X size={16} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} icon={User} placeholder="John Doe" />
                  <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} icon={Phone} type="tel" placeholder="99999..." />
                  
                  {/* --- UPDATED: Event Selection Dropdown --- */}
                  <div className="md:col-span-2 space-y-1.5 group">
                     <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-[#0b1f3b] transition-colors">
                        Select Event (Purpose)
                     </label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#facc15] transition-colors duration-300">
                          <FileText size={18} strokeWidth={2} />
                        </div>
                        <select 
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleEventChange} // Calls logic to update Host
                          required
                          className="block w-full pl-10 sm:pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0b1f3b] transition-all duration-300 hover:border-blue-300 appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select an Event</option>
                          {isLoadingEvents ? (
                            <option disabled>Loading events...</option>
                          ) : (
                            events.map(event => (
                              <option key={event._id} value={event.title}>
                                {event.title}
                              </option>
                            ))
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                        </div>
                     </div>
                  </div>

                  {/* --- UPDATED: Host Name (Read Only) --- */}
                  <div className="md:col-span-2">
                     <InputField 
                        label="Host Name (Auto-Filled)" 
                        name="hostName" 
                        value={formData.hostName} 
                        // No onChange because it's populated by Event Selection
                        icon={MapPin} 
                        placeholder="Select an event to see host" 
                        readOnly={true} // Read Only
                      />
                  </div>

                  {visitorType === 'multiday' ? (
                    <InputField label="Valid Until" name="validUntil" value={formData.validUntil} onChange={handleChange} icon={Calendar} type="date" />
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-xs font-medium h-[50px] sm:h-auto mt-auto">
                      Expires Today
                    </div>
                  )}

                  <div className="md:col-span-2 pt-4 mt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#0b1f3b] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <RefreshCw className="animate-spin" /> : <Camera />}
                      {isSubmitting ? 'Generating...' : 'Generate Pass'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorRegistration;