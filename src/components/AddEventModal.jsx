import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, User, Type, AlignLeft } from "lucide-react";

const AddEventModal = ({ isOpen, onClose, onSubmit }) => {
  // Centralized State for Form
  const [formData, setFormData] = useState({
    title: "",
    host: "",
    type: "One-Day",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    status: "Upcoming"
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Type Toggle
  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic Validation: Ensure end date is present for one-day events (same as start)
    const finalData = { ...formData };
    if (finalData.type === 'One-Day' && finalData.startDate) {
      finalData.endDate = finalData.startDate;
    }
    onSubmit(finalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up transform transition-all">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-[#0b1f3b]">Create New Event</h2>
            <p className="text-sm text-slate-500 font-medium">Fill in the details to schedule a campus event.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <form className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Type size={14} /> Event Title
                </label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange}
                  placeholder="Ex: Annual Tech Fest" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <User size={14} /> Host / Organizer
                </label>
                <input 
                  type="text" name="host" value={formData.host} onChange={handleChange}
                  placeholder="Ex: Dr. Alok Verma" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="p-1 bg-slate-100 rounded-xl flex">
              <button
                type="button" onClick={() => handleTypeChange("One-Day")}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  formData.type === "One-Day" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                One-Day Event
              </button>
              <button
                type="button" onClick={() => handleTypeChange("Multi-Day")}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  formData.type === "Multi-Day" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Multi-Day Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {formData.type === "One-Day" ? (
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={14} /> Date
                  </label>
                  <input 
                    type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar size={14} /> Start Date
                    </label>
                    <input 
                      type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar size={14} /> End Date
                    </label>
                    <input 
                      type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock size={14} /> Start Time
                </label>
                <input 
                  type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock size={14} /> End Time
                </label>
                <input 
                  type="time" name="endTime" value={formData.endTime} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin size={14} /> Location / Venue
              </label>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder="Ex: Main Auditorium, Block C" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            
             <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <AlignLeft size={14} /> Description (Optional)
              </label>
              <textarea 
                rows="3" name="description" value={formData.description} onChange={handleChange}
                placeholder="Enter event details here..." 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
              />
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-[#0b1f3b] text-white font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-900 hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all">
            Create Event
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddEventModal;