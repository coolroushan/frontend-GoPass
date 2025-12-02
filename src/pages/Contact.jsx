import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  User, 
  Smartphone, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2 
} from "lucide-react";

// --- REUSED DASHBOARD STYLES & ANIMATIONS ---
const customStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// Reused StatCard for Contact Info Highlights
const ContactInfoCard = ({ title, value, icon, subtext, delay }) => (
  <div 
    className="relative group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-blue-100 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden opacity-0 animate-fade-in-up cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0b1f3b] to-[#facc15] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>

    <div className="relative flex justify-between items-start z-10">
      <div>
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1 transition-colors group-hover:text-[#0b1f3b]">{title}</p>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b1f3b] tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
          {value}
        </h3>
      </div>
      <div className="p-3.5 rounded-xl bg-slate-50 text-[#0b1f3b] shadow-sm group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] group-hover:rotate-12 group-hover:shadow-lg transition-all duration-300 ease-out">
        {icon}
      </div>
    </div>
    
    <div className="relative mt-4 flex items-center text-sm z-10">
       <span className="text-slate-400 text-xs font-medium group-hover:text-slate-500 transition-colors">{subtext}</span>
    </div>
  </div>
);

// Updated InputField to accept name, value, onChange
const InputField = ({ label, type, name, value, onChange, placeholder, icon: Icon, required }) => (
  <div className="group">
    <label className="block text-[#0b1f3b] text-sm font-bold mb-2 ml-1 transition-colors group-focus-within:text-blue-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={18} />
      </div>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder} 
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 shadow-sm group-hover:border-slate-300"
      />
    </div>
  </div>
);

// Updated TextAreaField to accept name, value, onChange
const TextAreaField = ({ label, name, value, onChange, placeholder, icon: Icon, required }) => (
  <div className="group">
    <label className="block text-[#0b1f3b] text-sm font-bold mb-2 ml-1 transition-colors group-focus-within:text-blue-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Icon size={18} />
      </div>
      <textarea 
        rows="4"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder} 
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 shadow-sm group-hover:border-slate-300 resize-none"
      ></textarea>
    </div>
  </div>
);

const Contact = () => {
  // 1. State for form data
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    message: ''
  });

  // 2. State for submission status
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // 3. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Using the deployed URL directly to avoid build environment issues with import.meta
    const BASE_URL = 'https://gopass-backend-rfvu.onrender.com';
    const API_URL = `${BASE_URL}/api/contact`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', contact: '', email: '', message: '' }); // Reset form
        
        // Reset success message after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        alert("Failed to send message. Please check server logs.");
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus('error');
      alert("Error connecting to server. Please check your internet connection.");
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <style>{customStyles}</style>

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight hover:tracking-wide transition-all duration-300 cursor-default">
            Get in Touch
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">
            We'd love to hear from you. <span className="text-[#facc15] font-bold">Contact Us.</span>
          </p>
        </div>
        
        {/* Status Pill Style */}
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
           <span className="text-sm font-bold text-[#0b1f3b]">Support Online</span>
        </div>
      </div>

      {/* --- Contact Info Grid (Styled like StatCards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <ContactInfoCard 
           title="Email Support"
           value="support@gopass.com"
           subtext="We reply within 24 hours"
           icon={<Mail size={24} />}
           delay={100}
         />
         <ContactInfoCard 
           title="Phone Number"
           value="+91 98765 43210"
           subtext="Mon-Fri, 9am - 6pm IST"
           icon={<Phone size={24} />}
           delay={200}
         />
         <ContactInfoCard 
           title="Main Office"
           value="Boring Road, Patna"
           subtext="CIMAGE Professional College"
           icon={<MapPin size={24} />}
           delay={300}
         />
      </div>

      {/* --- Main Content Split --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Form Section --- */}
        <div 
          className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col"
          style={{ animationDelay: '400ms' }}
        >
             {/* Header of the Card */}
             <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/30 flex items-center gap-4">
                 <div className="p-3 bg-blue-50 rounded-2xl text-[#0b1f3b]">
                    <MessageSquare size={22} />
                 </div>
                 <div>
                    <h3 className="text-xl font-extrabold text-[#0b1f3b]">Send a Message</h3>
                    <p className="text-sm text-slate-500 font-medium">We will get back to you shortly</p>
                 </div>
             </div>

             {/* Form Content */}
             <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Enter your name" 
                        icon={User} 
                        required 
                      />
                      <InputField 
                        label="Contact Number" 
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="Enter contact number" 
                        icon={Smartphone} 
                        required 
                      />
                   </div>
                   
                   <InputField 
                     label="Email" 
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     type="email" 
                     placeholder="Enter your email" 
                     icon={Mail} 
                     required 
                   />

                   <TextAreaField 
                     label="Message" 
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     placeholder="Type your message..." 
                     icon={MessageSquare} 
                     required 
                   />

                   <div className="pt-2">
                     <button 
                       type="submit"
                       disabled={status === 'loading' || status === 'success'}
                       className={`w-full group relative px-6 py-4 rounded-xl text-base font-bold shadow-lg transition-all duration-300 overflow-hidden flex items-center justify-center gap-2
                         ${status === 'success' 
                           ? 'bg-emerald-500 text-white shadow-emerald-900/20' 
                           : 'bg-[#0b1f3b] text-white shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0'
                         }
                       `}
                     >
                        <span className="relative z-10 flex items-center gap-2">
                           {status === 'loading' && <Loader2 size={20} className="animate-spin" />}
                           {status === 'success' && 'Message Sent!'}
                           {status === 'idle' && 'Send Message'}
                           
                           {status === 'idle' && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
                           {status === 'success' && <CheckCircle size={20} />}
                        </span>
                        
                        {/* Success Animation Background */}
                        <div className={`absolute top-0 left-0 w-full h-full bg-emerald-600 transition-transform duration-500 ease-in-out ${status === 'success' ? 'translate-x-0' : '-translate-x-full'}`}></div>
                     </button>
                   </div>
                </form>
             </div>
        </div>

        {/* --- Side Section (Map) --- */}
        <div className="lg:col-span-5 space-y-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            
            {/* Map Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col h-full min-h-[400px]">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                   <div>
                      <h3 className="font-bold text-[#0b1f3b]">Find Us Here</h3>
                      <p className="text-xs text-slate-500 font-bold mt-1">GoPass HQ</p>
                   </div>
                   <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
                     <MapPin size={16} />
                   </div>
                </div>
                <div className="flex-grow bg-slate-100 relative h-full">
                   <iframe 
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.522810815774!2d85.1348573150247!3d25.62083398369971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed585c5a8470a9%3A0xe1634c02117565c8!2sCIMAGE%20Professional%20College!5e0!3m2!1sen!2sin!4v1625642289657!5m2!1sen!2sin"
                     width="100%" 
                     height="100%" 
                     style={{ border: 0, minHeight: '400px' }} 
                     allowFullScreen="" 
                     loading="lazy" 
                     referrerPolicy="no-referrer-when-downgrade"
                     className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                     title="GoPass HQ Map"
                   ></iframe>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;