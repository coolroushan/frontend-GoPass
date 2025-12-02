import React, { useEffect, useState } from "react";
import { 
  Users, 
  CheckCircle, 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  Zap, 
  Printer, 
  Database, 
  ShieldCheck, 
  Code,
  Layout,
  HardDrive,
  UserCheck,
  MousePointer,
  Smartphone
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

// Reused StatCard Component for "Features"
const FeatureCard = ({ title, subtext, icon, delay }) => (
  <div 
    className="relative group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-blue-100 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden opacity-0 animate-fade-in-up cursor-default h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0b1f3b] to-[#facc15] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>

    <div className="relative flex justify-between items-start z-10 mb-4">
      <div className="p-3.5 rounded-xl bg-slate-50 text-[#0b1f3b] shadow-sm group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] group-hover:rotate-12 group-hover:shadow-lg transition-all duration-300 ease-out">
        {icon}
      </div>
    </div>
    
    <div className="relative z-10">
       <h3 className="text-xl font-extrabold text-[#0b1f3b] tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
         {title}
       </h3>
       <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
         {subtext}
       </p>
    </div>
  </div>
);

// Reused List Item for Tech/Future Enhancements
const ListItem = ({ text, icon: Icon }) => (
  <li className="flex items-start group">
    <div className="mr-3 mt-1 min-w-[24px] h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] transition-colors duration-300">
      <Icon size={14} strokeWidth={2.5} />
    </div>
    <span className="text-slate-600 font-medium group-hover:text-[#0b1f3b] transition-colors">{text}</span>
  </li>
);

const About = () => {
  // Team Data extracted from your image
  const teamMembers = [
    { name: "Kamaljeet Mishra", role: "Frontend Developer", color: "from-blue-600 to-blue-800" },
    { name: "Sakshi Deep", role: "Frontend Developer", color: "from-teal-500 to-emerald-600" },
    { name: "Aarohi Sharma", role: "Software Tester", color: "from-indigo-500 to-purple-600" },
    { name: "Roushan Kumar", role: "Backend Developer", color: "from-slate-700 to-slate-900" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <style>{customStyles}</style>

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 opacity-0 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight hover:tracking-wide transition-all duration-300 cursor-default">
            About GoPass
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">
            The story behind the <span className="text-[#facc15] font-bold">ID Card Generator.</span>
          </p>
        </div>
        
        {/* Decorative Badge similar to "System Online" */}
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-[#facc15] animate-pulse"></div>
           <span className="text-sm font-bold text-[#0b1f3b]">Version 1.0</span>
        </div>
      </div>

      {/* --- Intro Section (Card Style) --- */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-lg shadow-slate-200/50 mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
         <div className="flex items-start gap-4">
            <div className="hidden sm:flex p-3 bg-blue-50 rounded-2xl text-[#0b1f3b]">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h2 className="text-xl font-extrabold text-[#0b1f3b] mb-3">Project Overview</h2>
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                    The <strong>ID Card Generator</strong> is a simple and efficient web-based tool designed to create digital or printable ID cards for visitors, students, employees, and event participants. It helps institutions and organizations manage identification seamlessly and securely.
                </p>
            </div>
         </div>
      </div>

      {/* --- Features Grid (Reusing StatCard Design) --- */}
      <h2 className="text-xl font-bold text-[#0b1f3b] mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>Key Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <FeatureCard 
          title="Instant Generation"
          subtext="Generate One-Day and Multiple-Day ID cards instantly with a few clicks."
          icon={<Zap size={26} strokeWidth={1.5} />}
          delay={200}
        />
        <FeatureCard 
          title="Easy Customization"
          subtext="Add names, company details, and photos easily to create professional cards."
          icon={<UserCheck size={26} strokeWidth={1.5} />}
          delay={300}
        />
        <FeatureCard 
          title="Print & Save"
          subtext="Save your digital ID or print it directly in just one click for immediate use."
          icon={<Printer size={26} strokeWidth={1.5} />}
          delay={400}
        />
        <FeatureCard 
          title="Attendance Tracking"
          subtext="Track and view attendance for all registered users efficiently."
          icon={<Database size={26} strokeWidth={1.5} />}
          delay={500}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* --- How It Works --- */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col h-full" style={{ animationDelay: '600ms' }}>
             <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/30 flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-900"><MousePointer size={20} /></div>
                 <h3 className="text-lg font-extrabold text-[#0b1f3b]">How It Works</h3>
             </div>
             <div className="p-6 sm:p-8 flex-grow">
                <ol className="relative border-l border-slate-200 ml-3 space-y-8">                  
                  <li className="mb-2 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white text-blue-800 font-bold text-sm">1</span>
                    <h4 className="font-bold text-[#0b1f3b] text-base mb-1">Select ID Type</h4>
                    <p className="text-slate-500 text-sm">Choose the type of ID you want to generate (One-Day or Multi-Day).</p>
                  </li>
                  <li className="mb-2 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white text-blue-800 font-bold text-sm">2</span>
                    <h4 className="font-bold text-[#0b1f3b] text-base mb-1">Enter Details</h4>
                    <p className="text-slate-500 text-sm">Input required details such as name, company, and purpose.</p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white text-blue-800 font-bold text-sm">3</span>
                    <h4 className="font-bold text-[#0b1f3b] text-base mb-1">Preview & Print</h4>
                    <p className="text-slate-500 text-sm">Preview your ID card before saving or printing.</p>
                  </li>
                </ol>
             </div>
          </div>

          {/* --- Why Use This Tool --- */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col h-full" style={{ animationDelay: '700ms' }}>
             <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/30 flex items-center gap-3">
                 <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700"><CheckCircle size={20} /></div>
                 <h3 className="text-lg font-extrabold text-[#0b1f3b]">Why Use This Tool?</h3>
             </div>
             <div className="p-6 sm:p-8 flex flex-col justify-center flex-grow">
                <p className="text-slate-600 leading-7 mb-4">
                  This system reduces paperwork and manual errors, making ID creation faster and more professional. It’s perfect for colleges, offices, and event organizers who need to generate and manage ID cards efficiently.
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[#0b1f3b] font-bold text-sm mb-2">Perfect for:</p>
                    <div className="flex flex-wrap gap-2">
                        {['Colleges', 'Corporate Offices', 'Event Organizers', 'Security Checkpoints'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 shadow-sm">{tag}</span>
                        ))}
                    </div>
                </div>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           {/* --- Technology Used --- */}
           <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Code size={20} /></div>
                 <h3 className="text-lg font-extrabold text-[#0b1f3b]">Technology Used</h3>
              </div>
              <ul className="space-y-4">
                <ListItem icon={Layout} text="Frontend: React + Vite" />
                <ListItem icon={Layers} text="CSS: Tailwind CSS + Custom CSS" />
                <ListItem icon={Cpu} text="Backend: Node.js + Express.js" />
                <ListItem icon={Database} text="Database: MongoDB" />
              </ul>
           </div>

           {/* --- Future Enhancements --- */}
           <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-yellow-50 rounded-lg text-[#0b1f3b]"><ArrowUpRight size={20} /></div>
                 <h3 className="text-lg font-extrabold text-[#0b1f3b]">Future Enhancements</h3>
              </div>
              <ul className="space-y-4">
                <ListItem icon={ShieldCheck} text="Developing a dedicated Guard-side Interface" />
                <ListItem icon={Smartphone} text="Building a mobile App for GoPass" />
                
                <ListItem icon={ArrowUpRight} text="Generating bulk ID cards through Excel upload" />
            <ListItem icon={Cpu} text="Integrating AI-powered Facial Recognition for secure entry" />
              </ul>
           </div>
      </div>

      {/* --- Meet Our Team (Styled like Recent Visitor Log) --- */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col mb-10" style={{ animationDelay: '1000ms' }}>
         <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-[#0b1f3b]">
                       <Users size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-[#0b1f3b]">Meet Our Team</h3>
                        <p className="text-sm text-slate-500 font-medium">The minds behind GoPass</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-slate-600 leading-7 max-w-4xl">
                 <p>
                    Our team worked together to build this event management project with the aim of making event planning simple and efficient. We designed the system to help organizers manage events, handle registrations, and keep participant details organized in one place.
                 </p>
                 <p className="mt-4">
                    Each team member contributed based on their strengths — some focused on design, some on coding, and some on testing and documentation. Our main goal was to create a smooth, easy-to-use platform that saves time and makes event handling more systematic and reliable.
                 </p>
            </div>
         </div>

         {/* Team Grid (Using Dashboard's "Visitor" List Aesthetic) */}
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, idx) => (
                <div key={idx} className="group bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-default">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 min-w-[3.5rem] rounded-2xl bg-gradient-to-br ${member.color} text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            {member.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0b1f3b] text-base lg:text-lg group-hover:text-blue-700 transition-colors line-clamp-1">{member.name}</h4>
                            <p className="text-xs lg:text-sm font-medium text-slate-500 uppercase tracking-wider line-clamp-1">{member.role}</p>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default About;