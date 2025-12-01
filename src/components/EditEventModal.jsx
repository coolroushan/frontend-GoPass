import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, User, Type, AlignLeft, Save, Activity } from "lucide-react";

const EditEventModal = ({ isOpen, onClose, onUpdate, eventData }) => {
  const [formData, setFormData] = useState({
    title: "", host: "", type: "One-Day", startDate: "", endDate: "",
    startTime: "", endTime: "", location: "", description: "", status: "Upcoming"
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData.title || "",
        host: eventData.host || "",
        type: eventData.type || "One-Day",
        startDate: eventData.startDate || "",
        endDate: eventData.endDate || "",
        startTime: eventData.startTime || "",
        endTime: eventData.endTime || "",
        location: eventData.location || "",
        description: eventData.description || "",
        status: eventData.status || "Upcoming"
      });
    }
  }, [eventData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure the updated data includes the _id from the original event
    onUpdate({ ...eventData, ...formData }); 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-[#0b1f3b] flex items-center gap-2">
              <span className="bg-blue-100 p-1.5 rounded-lg text-blue-700"><Save size={18}/></span>
              Edit Event
            </h2>
            <p className="text-sm text-slate-500 font-medium ml-1">Update details for <span className="font-bold text-slate-700">{eventData?.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Type size={14} /> Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><User size={14} /> Host / Organizer</label>
                <input type="text" name="host" value={formData.host} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
               <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Activity size={14} /> Event Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold bg-white focus:outline-none focus:border-blue-500 cursor-pointer">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="p-1 bg-slate-100 rounded-xl flex h-[46px]">
                <button type="button" onClick={() => handleTypeChange("One-Day")} className={`flex-1 text-sm font-bold rounded-lg transition-all ${formData.type === "One-Day" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>One-Day</button>
                <button type="button" onClick={() => handleTypeChange("Multi-Day")} className={`flex-1 text-sm font-bold rounded-lg transition-all ${formData.type === "Multi-Day" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Multi-Day</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {formData.type === "One-Day" ? (
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Calendar size={14} /> Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 transition-all" />
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Calendar size={14} /> Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Calendar size={14} /> End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 transition-all" />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Clock size={14} /> Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Clock size={14} /> End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><MapPin size={14} /> Location / Venue</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ex: Main Auditorium, Block C" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-all" />
            </div>
            
             <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><AlignLeft size={14} /> Description</label>
              <textarea rows="3" name="description" value={formData.description} onChange={handleChange} placeholder="Enter event details here..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-all resize-none" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 transition-all">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-[#0b1f3b] text-white font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-900 hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"><Save size={18} /> Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;