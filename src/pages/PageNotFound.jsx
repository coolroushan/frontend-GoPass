import React, { useState, useEffect } from "react";
import { Mail, HelpCircle, Home, User, Calendar, LogIn } from "lucide-react";

const PageNotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredButton, setHoveredButton] = useState(null);
  const [particles, setParticles] = useState([]);
  const [animateNumber, setAnimateNumber] = useState(false);

  useEffect(() => {
    setAnimateNumber(true);
    // Generate particles for background animation
    const newParticles = Array.from({ length: 30 }).map(() => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const quickLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/leave", label: "Leave", icon: Calendar },
    { href: "/signin", label: "Login", icon: LogIn },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400 opacity-20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Glow effect that follows mouse */}
      <div
        className="absolute pointer-events-none rounded-full opacity-20 blur-3xl bg-gradient-to-r from-blue-400 to-cyan-300"
        style={{
          width: "400px",
          height: "400px",
          left: `${mousePosition.x - 200}px`,
          top: `${mousePosition.y - 200}px`,
          transition: "all 0.3s ease-out",
        }}
      />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Interactive 404 Animation */}
        <div className="mb-8 relative h-40 flex items-center justify-center">
          <div className="relative">
            {/* Animated circles around 404 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute w-32 h-32 border-2 border-blue-400 rounded-full opacity-30"
                style={{
                  animation: "spin 8s linear infinite",
                }}
              />
              <div
                className="absolute w-40 h-40 border-2 border-cyan-400 rounded-full opacity-20"
                style={{
                  animation: "spin 12s linear reverse",
                }}
              />
            </div>

            {/* 404 Text */}
            <div
              className={`text-9xl font-black transition-all duration-1000 transform ${
                animateNumber ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))",
              }}
            >
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-pulse">
            Page Not Found
          </h1>
          <p className="text-gray-300 mb-3 text-base leading-relaxed">
            Oops! It seems like you've ventured into uncharted territory. The
            page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-400">
            But don't worry, we'll help you find your way back! 🧭
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <a
            href="/"
            onMouseEnter={() => setHoveredButton("home")}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </a>

          <a
            href="/signin"
            onMouseEnter={() => setHoveredButton("signin")}
            onMouseLeave={() => setHoveredButton(null)}
            className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-400 rounded-lg text-sm font-semibold text-gray-200 bg-transparent hover:bg-gray-800 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Back to Login
          </a>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
          <div className="space-y-3 mb-6">
            <a
              href="mailto:support@panchayati.gov.in"
              className="flex items-center justify-center text-gray-300 hover:text-cyan-400 transition-all duration-200 ease-in-out group transform hover:scale-105"
            >
              <Mail className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Contact Support
            </a>
            <a
              href="#"
              className="flex items-center justify-center text-gray-300 hover:text-cyan-400 transition-all duration-200 ease-in-out group transform hover:scale-105"
            >
              <HelpCircle className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              View Documentation
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
            Quick Navigation
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className="group px-4 py-2 text-xs font-medium text-gray-300 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full hover:from-blue-600 hover:to-cyan-600 hover:text-white transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center gap-1"
                >
                  <Icon className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Fun message */}
        <div className="mt-8 text-xs text-gray-500 italic">
          💡 Tip: Try using the navigation above or go back to where you came
          from
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100px) translateX(30px);
            opacity: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;
