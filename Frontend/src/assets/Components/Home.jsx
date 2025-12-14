import React, { useState,useRef, use} from "react";
import { HomeIcon, Info, Mail, Github, Linkedin,ChevronDown, Pause, Plane, Clock, ArrowDown, ArrowRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoPaperPlane } from "react-icons/io5";
import axios from "axios";
const ProfileCard = () => (
  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex text-black items-center justify-center text-xs sm:text-sm font-bold">
    R
  </div>
);

function Home() {
  const [showMore, setShowMore] = useState(false);
  const [feed, setFeed] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate =useNavigate();
  const bottomRef=useRef(null);
  const scrollToBottom = () => {
    bottomRef.current.focus({ behavior: "smooth" });
  };

  const toggleLearnMore = () => {
    setShowMore(!showMore);
  };

  const modes = (e) => { e.preventDefault(); navigate("/mode"); };
  const AT = (e) => { e.preventDefault(); navigate("/at"); };
  const BT = (e) => { e.preventDefault(); navigate("/bt"); };
  const CT = (e) => { e.preventDefault(); navigate("/ct"); };
  const TAT = (e) => { e.preventDefault(); navigate("/tat"); };
  const WT = (e) => { e.preventDefault(); navigate("/Wt"); };
  const Fcfs = (e) => { e.preventDefault(); navigate("/fcfs"); };
  const Sjf = (e) => { e.preventDefault(); navigate("/sjf"); };
  const RRR = (e) => { e.preventDefault(); navigate("/rr"); };
  const About_us = (e) => { e.preventDefault(); navigate("/about_us"); setMobileMenuOpen(false); };
  const contact_us = (e) => { e.preventDefault(); navigate("/contact_us"); setMobileMenuOpen(false); };
  const Priority = (e) => { e.preventDefault(); navigate ("/priority_scheduling"); };
 
  const OUT = (e) => {
    e.preventDefault();

    // Clear login info
    localStorage.removeItem("loggedInUser");

    // Optional alert
    alert("Logged out successfully!");

    // Redirect to login page
    navigate("/");
  };

     const handlesubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8080/feedback/save", {feed});
      alert("FeedBack Saved:", res.data);
      setFeed("");
    } catch (err) {
      alert("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg sticky top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="lg:hidden">
            <div className="flex justify-between items-center">
              <div className="text-base sm:text-xl font-bold text-white cursor-pointer">
               <div onClick={scrollToBottom} className="flex md:gap-4 gap-2">FEEDBACK <FaPeopleGroup className="mt-1"/></div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-1.5 sm:p-2"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
                </button>

                <ProfileCard />
              </div>
            </div>

            <div className="mt-2 sm:mt-3">
              <button
                onClick={toggleLearnMore}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 text-xs sm:text-sm rounded flex items-center gap-1.5 sm:gap-2"
              >
                <span>Learn More</span>
                <ChevronDown
                  size={14}
                  className={`sm:w-4 sm:h-4 transition-transform duration-300 ${showMore ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="absolute left-0 right-0 top-full bg-gradient-to-r from-blue-700 to-purple-800 shadow-lg">
                <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                  <button
                    className="w-full text-left text-white hover:text-yellow-400 flex items-center gap-2 py-1.5 sm:py-2 text-sm"
                  >
                    <HomeIcon size={18} className="sm:w-5 sm:h-5" /> Home
                  </button>
                  <button
                    onClick={About_us}
                    className="w-full text-left text-white hover:text-yellow-400 flex items-center gap-2 py-1.5 sm:py-2 text-sm"
                  >
                    <Info size={18} className="sm:w-5 sm:h-5" /> About Us
                  </button>
                  <button
                    onClick={contact_us}
                    className="w-full text-left text-white hover:text-yellow-400 flex items-center gap-2 py-1.5 sm:py-2 text-sm"
                  >
                    <Mail size={18} className="sm:w-5 sm:h-5" /> Contact Us
                  </button>
                  <button
                    className="w-full bg-gray-500 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-white font-semibold text-sm"
                    onClick={OUT}
                  >
                    Log-out
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex justify-between items-center text-white">
            <div className="flex flex-col items-start space-y-2">
              <div className="text-xl font-bold cursor-pointer hover:text-yellow-400 hover:underline">
                <div onClick={scrollToBottom} className="md:flex gap-4">FEEDBACK <FaPeopleGroup className="mt-1"/></div>
              </div>
              <button
                onClick={toggleLearnMore}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded flex items-center space-x-1"
              >
                <span>Learn More</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${showMore ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>

            <ul className="flex font-semibold gap-12 xl:gap-20">
              <li className="hover:text-yellow-400 hover:underline flex items-center gap-2 transition-colors cursor-pointer">
                Home <HomeIcon size={20} />
              </li>
              <li onClick={About_us} className="hover:text-yellow-400 hover:underline flex items-center gap-2 transition-colors cursor-pointer">
                About Us <Info size={20} />
              </li>
              <li onClick={contact_us} className="hover:text-yellow-400 hover:underline flex items-center gap-2 transition-colors cursor-pointer">
                Contact Us <Mail size={20} />
              </li>
            </ul>

            <div className="flex flex-col items-center space-y-3">
              <ProfileCard />
              <button
                className="font-semibold bg-gray-500 rounded-lg px-4 py-1 hover:bg-gray-600 text-white whitespace-nowrap"
                onClick={OUT}
              >
                Log-out
              </button>
            </div>
          </div>

          {showMore && (
            <div className="absolute left-3 right-3 sm:left-6 sm:right-auto mt-2 bg-white shadow-2xl rounded-lg flex flex-col space-y-2 p-3 sm:p-4 text-black z-50 sm:w-72 max-h-80 sm:max-h-96 overflow-y-auto">
            
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2 px-2.5 sm:px-3 text-white hover:opacity-90 justify-between items-center text-sm" onClick={modes}>
                <span className="font-medium">Modes</span>
                <Plane size={16} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2 px-2.5 sm:px-3 text-white hover:opacity-90 justify-between items-center text-sm" onClick={AT}>
                <span className="font-medium">Arrival Time</span>
                <Clock size={16} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2 px-2.5 sm:px-3 text-white hover:opacity-90 justify-between items-center text-sm" onClick={BT}>
                <span className="font-medium">Burst Time</span>
                <Clock size={16} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2 px-2.5 sm:px-3 text-white hover:opacity-90 justify-between items-center text-sm" onClick={CT}>
                <span className="font-medium">Completion Time</span>
                <Clock size={16} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2 px-2.5 sm:px-3 text-white hover:opacity-90 justify-between items-center text-sm" onClick={TAT}>
                <span className="font-medium">Turn Around Time</span>
                <Clock size={16} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2 px-2.5 sm:px-3 text-white hover:opacity-90 justify-between items-center text-sm" onClick={WT}>
                <span className="font-medium">Waiting Time</span>
                <Clock size={16} className="flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="px-3 sm:px-6 md:px-8 py-4 sm:py-8 md:py-10 max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-12 md:space-y-16 lg:space-y-20">
          <div className="w-full min-h-[240px] sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-center relative bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg hover:shadow-2xl hover:shadow-cyan-300/50 transition-all duration-300 overflow-hidden">
            <div className="w-full sm:w-2/5 h-32 sm:h-full relative flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 p-3 sm:p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[120px] sm:max-w-[180px] max-h-[120px] sm:max-h-[180px]">
                  <rect x="50" y="50" width="100" height="100" rx="8" fill="white" opacity="0.95" />
                  <rect x="65" y="65" width="70" height="70" rx="4" fill="#3b82f6" />
                  <rect x="35" y="60" width="10" height="3" fill="white" />
                  <rect x="35" y="75" width="10" height="3" fill="white" />
                  <rect x="35" y="90" width="10" height="3" fill="white" />
                  <rect x="35" y="105" width="10" height="3" fill="white" />
                  <rect x="35" y="120" width="10" height="3" fill="white" />
                  <rect x="155" y="60" width="10" height="3" fill="white" />
                  <rect x="155" y="75" width="10" height="3" fill="white" />
                  <rect x="155" y="90" width="10" height="3" fill="white" />
                  <rect x="155" y="105" width="10" height="3" fill="white" />
                  <rect x="155" y="120" width="10" height="3" fill="white" />
                  <rect x="75" y="155" width="15" height="20" rx="2" fill="#22d3ee" opacity="0.9" />
                  <rect x="95" y="155" width="15" height="20" rx="2" fill="#22d3ee" opacity="0.7" />
                  <rect x="115" y="155" width="15" height="20" rx="2" fill="#22d3ee" opacity="0.5" />
                  <path d="M 100 145 L 100 155" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M 100 155 L 95 150 M 100 155 L 105 150" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            <div className="w-full sm:w-3/5 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-1.5 sm:mb-3">
                FCFS Algorithm
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 leading-relaxed">
                First Come First Served schedules processes in the order they arrive. Simple and fair, but may cause long wait times.
              </p>
              <button
                className="bg-white text-blue-600 shadow-lg h-9 sm:h-10 md:h-11 rounded-lg px-4 sm:px-6 md:px-8 text-xs sm:text-sm md:text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                onClick={Fcfs}
              >
                PERFORM FCFS
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="w-full min-h-[240px] sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-center relative bg-gradient-to-br from-green-500 to-teal-400 shadow-lg hover:shadow-2xl hover:shadow-teal-300/50 transition-all duration-300 overflow-hidden">
            <div className="w-full sm:w-2/5 h-32 sm:h-full relative flex items-center justify-center bg-gradient-to-br from-green-600 to-green-500 p-3 sm:p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[120px] sm:max-w-[180px] max-h-[120px] sm:max-h-[180px]">
                  <rect x="50" y="50" width="100" height="100" rx="8" fill="white" opacity="0.95" />
                  <rect x="65" y="65" width="70" height="70" rx="4" fill="#10b981" />
                  <rect x="35" y="60" width="10" height="3" fill="white" />
                  <rect x="35" y="75" width="10" height="3" fill="white" />
                  <rect x="35" y="90" width="10" height="3" fill="white" />
                  <rect x="35" y="105" width="10" height="3" fill="white" />
                  <rect x="35" y="120" width="10" height="3" fill="white" />
                  <rect x="155" y="60" width="10" height="3" fill="white" />
                  <rect x="155" y="75" width="10" height="3" fill="white" />
                  <rect x="155" y="90" width="10" height="3" fill="white" />
                  <rect x="155" y="105" width="10" height="3" fill="white" />
                  <rect x="155" y="120" width="10" height="3" fill="white" />
                  <rect x="75" y="155" width="15" height="20" rx="2" fill="#22d3ee" opacity="0.9" />
                  <rect x="95" y="155" width="15" height="20" rx="2" fill="#22d3ee" opacity="0.7" />
                  <rect x="115" y="155" width="15" height="20" rx="2" fill="#22d3ee" opacity="0.5" />
                  <path d="M 100 145 L 100 155" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M 100 155 L 95 150 M 100 155 L 105 150" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            <div className="w-full sm:w-3/5 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-1.5 sm:mb-3">
                SJF Algorithm
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 leading-relaxed">
                Shortest Job First schedules the process with the smallest execution time first. Minimizes average waiting time efficiently.
              </p>
              <button
                className="bg-white text-green-600 shadow-lg h-9 sm:h-10 md:h-11 rounded-lg px-4 sm:px-6 md:px-8 text-xs sm:text-sm md:text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                onClick={Sjf}
              >
                PERFORM SJF
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="w-full min-h-[240px] sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-center relative bg-gradient-to-br from-orange-500 to-red-400 shadow-lg hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 overflow-hidden">
            <div className="w-full sm:w-2/5 h-32 sm:h-full relative flex items-center justify-center bg-orange-600 p-3 sm:p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[120px] sm:max-w-[180px] max-h-[120px] sm:max-h-[180px]">
                  <rect x="50" y="50" width="100" height="100" rx="8" fill="white" opacity="0.95" />
                  <rect x="65" y="65" width="70" height="70" rx="4" fill="#f97316" />
                  <rect x="35" y="60" width="10" height="3" fill="white" />
                  <rect x="35" y="75" width="10" height="3" fill="white" />
                  <rect x="35" y="90" width="10" height="3" fill="white" />
                  <rect x="35" y="105" width="10" height="3" fill="white" />
                  <rect x="35" y="120" width="10" height="3" fill="white" />
                  <rect x="155" y="60" width="10" height="3" fill="white" />
                  <rect x="155" y="75" width="10" height="3" fill="white" />
                  <rect x="155" y="90" width="10" height="3" fill="white" />
                  <rect x="155" y="105" width="10" height="3" fill="white" />
                  <rect x="155" y="120" width="10" height="3" fill="white" />
                  <rect x="75" y="155" width="15" height="20" rx="2" fill="#fb923c" opacity="0.9" />
                  <rect x="95" y="155" width="15" height="20" rx="2" fill="#fb923c" opacity="0.7" />
                  <rect x="115" y="155" width="15" height="20" rx="2" fill="#fb923c" opacity="0.5" />
                  <path d="M 100 145 L 100 155" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M 100 155 L 95 150 M 100 155 L 105 150" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            <div className="w-full sm:w-3/5 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-1.5 sm:mb-3">
                Priority Algorithm
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 leading-relaxed">
                Priority Scheduling executes processes based on their priority level. Higher priority processes run first, ensuring critical tasks complete quickly.
              </p>
              <button
                className="bg-white text-orange-600 shadow-lg h-9 sm:h-10 md:h-11 rounded-lg px-4 sm:px-6 md:px-8 text-xs sm:text-sm md:text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                onClick={Priority}
              >
                PERFORM PRIORITY
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="w-full min-h-[240px] sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-center relative bg-gradient-to-br from-indigo-500 to-purple-400 shadow-lg hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 overflow-hidden">
            <div className="w-full sm:w-2/5 h-32 sm:h-full relative flex items-center justify-center bg-purple-800 p-3 sm:p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[120px] sm:max-w-[180px] max-h-[120px] sm:max-h-[180px]">
                  <rect x="50" y="50" width="100" height="100" rx="8" fill="white" opacity="0.95" />
                  <rect x="65" y="65" width="70" height="70" rx="4" fill="#a855f7" />
                  <rect x="35" y="60" width="10" height="3" fill="white" />
                  <rect x="35" y="75" width="10" height="3" fill="white" />
                  <rect x="35" y="90" width="10" height="3" fill="white" />
                  <rect x="35" y="105" width="10" height="3" fill="white" />
                  <rect x="35" y="120" width="10" height="3" fill="white" />
                  <rect x="155" y="60" width="10" height="3" fill="white" />
                  <rect x="155" y="75" width="10" height="3" fill="white" />
                  <rect x="155" y="90" width="10" height="3" fill="white" />
                  <rect x="155" y="105" width="10" height="3" fill="white" />
                  <rect x="155" y="120" width="10" height="3" fill="white" />
                  <rect x="75" y="155" width="15" height="20" rx="2" fill="#c084fc" opacity="0.9" />
                  <rect x="95" y="155" width="15" height="20" rx="2" fill="#c084fc" opacity="0.7" />
                  <rect x="115" y="155" width="15" height="20" rx="2" fill="#c084fc" opacity="0.5" />
                  <path d="M 100 145 L 100 155" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M 100 155 L 95 150 M 100 155 L 105 150" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            <div className="w-full sm:w-3/5 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10">
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-1.5 sm:mb-3">
                Round Robin Algorithm
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 leading-relaxed">
                Round Robin assigns each process a fixed time quantum in circular order. Ensures fair CPU allocation and prevents starvation.
              </p>
              <button
                className="bg-white text-indigo-600 shadow-lg h-9 sm:h-10 md:h-11 rounded-lg px-4 sm:px-6 md:px-8 text-xs sm:text-sm md:text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                onClick={RRR}
              >
                PERFORM Round Robin
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 mt-8 sm:mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto py-6 sm:py-10 md:py-12 px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-2 sm:mb-4">Reference</h3>
              <ul className="space-y-1.5 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white flex items-center gap-2">GitHub <Github size={14} className="sm:w-4 sm:h-4 text-white flex-shrink-0" /></a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white flex items-center gap-2">LinkedIn <Linkedin size={14} className="sm:w-4 sm:h-4 text-white flex-shrink-0" /></a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Performance Metrics</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Algorithm Walkthroughs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-2 sm:mb-4">Learning</h3>
              <ul className="space-y-1.5 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Textbook Chapter</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Related OS Topics</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Interactive Visualizer</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Video Tutorials</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-2 sm:mb-4">Project Info</h3>
              <ul className="space-y-1.5 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">About the Authors</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">License (e.g., MIT)</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-2 sm:mb-4">Contribute</h3>
              <ul className="space-y-1.5 sm:space-y-3">
               
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Provide Feedback</a></li>
                   <div className="flex">
                    <textarea ref={bottomRef} className="auto md:w-60 rounded-sm text-black" placeholder="Typing,,," value={feed} onChange={(e)=> setFeed(e.target.value)}>
                    </textarea></div>
                   <button onClick={handlesubmit} className="flex bg-white/30 p-1 gap-3 rounded-lg px-8 text-white">SUBMIT <IoPaperPlane className="mt-1"/></button>
              </ul>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
            <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
              &copy; 2025 CPU Scheduling Resource. All rights reserved. <span className="hidden sm:inline">Last Updated: October 2025.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;