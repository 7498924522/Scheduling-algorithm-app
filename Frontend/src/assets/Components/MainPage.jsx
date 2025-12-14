import React from 'react';
import { Cpu, LogIn, UserPlus, Github, Twitter, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {

    const navigate=useNavigate();
  const GoLogin = () => {
    alert("Login First");
    navigate("/login")

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="flex items-center md:gap-3 gap-1">
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-600 p-2.5 rounded-xl shadow-lg">
            <Cpu className="md:w-8 md:h-8 sm:w-6 sm:h-6 text-white" />
          </div>
          <p className="md:text-2xl sm:text-xl font-bold text-white tracking-tight">
            VisualizerAlgo
          </p>
        </div>
        
        
        <div className="flex gap-2">
          <button 
            onClick={()=>navigate("/login")} 
            className="px-2 sm:px-3 md:px-5 py-2 md:py-2.5 text-white hover:bg-white/10 rounded-lg transition-all duration-300 flex items-center gap-1 md:gap-2 font-medium border border-white/20 hover:border-white/40 text-xs sm:text-sm md:text-base"
          >
            <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
            Login
          </button>
          <button 
          onClick={()=>navigate("/signup")}
            className="px-2 sm:px-3 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-1 md:gap-2 font-medium text-xs sm:text-sm md:text-base"
          >
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Master CPU Scheduling
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Algorithms Visualized
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Simulate and understand process scheduling with interactive visualizations of FCFS, SJF, Priority, and Round Robin algorithms
            </p>
          </div>

          {/* Algorithm Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 ">
            {[
              { label: 'FCFS', name: 'First Come First Serve', color: 'from-green-400  to-emerald-600' },
              { label: 'SJF', name: 'Shortest Job First', color: 'from-blue-400 to-cyan-600' },
              { label: 'Prior', name: 'Priority Scheduling', color: 'from-purple-400 to-pink-600' },
              { label: 'RR', name: 'Round Robin', color: 'from-orange-400 to-red-600' }
            ].map((algo, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-10 h-10 sm:w-12  px-8 sm:h-12 bg-gradient-to-br ${algo.color} rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-sm sm:text-lg group-hover:rotate-12  transition-transform duration-300`}>
                  {algo.label}
                </div>
                <p className="text-white font-semibold mr-5 text-sm sm:text-base md:text-lg">{algo.label}</p>
                <p className="text-indigo-300 text-xs mt-1 hidden sm:block">{algo.name}</p>
              </div>
            ))}
          </div>

          {/* Features List */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Visual Gantt Charts', desc: 'See process execution timeline' },
              { title: 'Performance Metrics', desc: 'Analyze waiting & turnaround time' },
              { title: 'Step-by-Step', desc: 'Understand each scheduling decision' }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <h4 className="text-emerald-400 font-semibold mb-1 text-sm sm:text-base">{feature.title}</h4>
                <p className="text-indigo-200 text-xs sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button 
            onClick={GoLogin} 
            className="mt-8 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white rounded-full text-base sm:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Start Scheduling Now
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-sm bg-white/5 border-t border-white/10 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-indigo-200 text-sm">
            © 2025 ScheduleSim. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-300">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-300">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}