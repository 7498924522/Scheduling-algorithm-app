import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HomeIcon, Info, Mail, Github, Linkedin, ChevronDown, Pause, Plane, Clock, ArrowDown, ArrowRight, Menu, X } from "lucide-react";

// Mock ProfileCard component
const ProfileCard = () => (
  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
    P
  </div>
);

function Home() {
  const [showMore, setShowMore] = useState(false);
  const [Bankers, setBankers] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLearnMore = () => {
    setShowMore(!showMore);
  };

  const navigate=useNavigate();
// Mock navigation handlers
  // const PREEM = (e) => { e.preventDefault(); navigate("/Pre_emptive") };
  const NONPREEM = (e) => { e.preventDefault(); navigate("/Non_Pre_emptive") };
  const AT = (e) => { e.preventDefault(); navigate("/at") };
  const BT = (e) => { e.preventDefault(); navigate("/bt") };
  const CT = (e) => { e.preventDefault(); navigate("/ct") };
  const TAT = (e) => { e.preventDefault(); navigate("/tat") };
  const WT = (e) => { e.preventDefault(); navigate("/Wt") };
  const Fcfs = (e) => { e.preventDefault(); navigate("/fcfs") };
  const Sjf = (e) => { e.preventDefault(); navigate("/sjf") };
  const RRR = (e) => { e.preventDefault(); navigate("/rr") };
  const About_us = (e) => { e.preventDefault(); navigate("/about_us" ) ;  setMobileMenuOpen(false); };
  const contact_us = (e) => { e.preventDefault();navigate("/contact_us" ); setMobileMenuOpen(false); };
  const Priority = (e) => { e.preventDefault();  navigate("/priority_scheduling") };
  const BankerAlgo = (e) => { e.preventDefault(); console.log("Navigate to Banker"); };
  const OUT = (e) => { e.preventDefault(); navigate(-1) };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="w-full bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg sticky top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile & Tablet View */}
          <div className="lg:hidden">
            {/* First Row: Logo, Menu Toggle, Profile */}
            <div className="flex justify-between items-center">
              <div className="text-lg sm:text-xl font-bold text-white">
                MyScheduler
              </div>
              
              <div className="flex items-center gap-3">
                {/* Hamburger Menu Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <ProfileCard />
              </div>
            </div>

            {/* Second Row: Learn More */}
            <div className="mt-3">
              <button
                onClick={toggleLearnMore}
                className="bg-pink-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded hover:bg-pink-600 flex items-center gap-2"
              >
                <span>Learn More</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${showMore ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute left-0 right-0 top-full bg-gradient-to-r from-blue-700 to-purple-800 shadow-lg">
                <div className="px-4 py-3 space-y-3">
                  <button 
                    className="w-full text-left text-white hover:text-yellow-400 flex items-center gap-2 py-2"
                  >
                    <HomeIcon size={20} /> Home
                  </button>
                  <button 
                    onClick={About_us}
                    className="w-full text-left text-white hover:text-yellow-400 flex items-center gap-2 py-2"
                  >
                    <Info size={20} /> About Us
                  </button>
                  <button 
                    onClick={contact_us}
                    className="w-full text-left text-white hover:text-yellow-400 flex items-center gap-2 py-2"
                  >
                    <Mail size={20} /> Contact Us
                  </button>
                  <button
                    className="w-full bg-gray-500 rounded-lg px-4 py-2 hover:bg-gray-600 text-white font-semibold"
                    onClick={OUT}
                  >
                    Log-out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex justify-between items-center text-white">
            <div className="flex flex-col items-start space-y-2">
              <div className="text-xl font-bold cursor-pointer hover:text-yellow-400 hover:underline">
                MyScheduler
              </div>
              <button
                onClick={toggleLearnMore}
                className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-gray-400 flex items-center space-x-1"
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

          {/* Learn More Dropdown - All Screens */}
          {showMore && (
            <div className="absolute left-4 right-4 sm:left-6 sm:right-auto mt-2 bg-white shadow-2xl rounded-lg flex flex-col space-y-2 p-3 sm:p-4 text-black z-50 sm:w-72 max-h-96 overflow-y-auto">
              {/* <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={PREEM}>
                <span className="text-sm sm:text-base font-medium">Pre-emptive</span>
                <Pause size={18} className="flex-shrink-0" />
              </button> */}
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={NONPREEM}>
                <span className="text-sm sm:text-base font-medium">Non Preemptive</span>
                <Plane size={18} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={AT}>
                <span className="text-sm sm:text-base font-medium">Arrival Time</span>
                <Clock size={18} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={BT}>
                <span className="text-sm sm:text-base font-medium">Burst Time</span>
                <Clock size={18} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={CT}>
                <span className="text-sm sm:text-base font-medium">Completion Time</span>
                <Clock size={18} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={TAT}>
                <span className="text-sm sm:text-base font-medium">Turn Around Time</span>
                <Clock size={18} className="flex-shrink-0" />
              </button>
              <button className="flex bg-gradient-to-r from-pink-600 to-yellow-400 rounded py-2.5 px-3 text-white hover:opacity-90 justify-between items-center" onClick={WT}>
                <span className="text-sm sm:text-base font-medium">Waiting Time</span>
                <Clock size={18} className="flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl mx-auto">
        {/* Bankers Algorithm Card */}
        {/* {Bankers && (
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="flex justify-center mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-semibold flex items-center gap-2">
                BANKERS ALGORITHM <ArrowDown size={20} />
              </h2>
            </div>
            <div className="w-full h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 p-4">
              <div className="absolute inset-0 bg-black/10 rounded-lg sm:rounded-xl md:rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center">
                <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-5 text-white font-semibold flex items-center gap-2">
                  PERFORM BANKERS
                  <ArrowRight size={20} className="animate-bounce" />
                </p>
                <button className="bg-gradient-to-tr from-green-400 to-blue-300 h-9 sm:h-10 md:h-11 rounded-md w-28 sm:w-36 md:w-40 text-xs sm:text-sm md:text-base font-medium hover:shadow-lg hover:scale-105 transition-all" onClick={BankerAlgo}>
                  Click Here
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Algorithm Cards */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
          {/* FCFS CPU Scheduling */}
          <div className="w-full h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 p-4 ">
            {/* <div className="absolute inset-0 bg-black/10 rounded-lg sm:rounded-xl md:rounded-2xl"></div> */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="flex">
              <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-5 text-white font-semibold flex items-center gap-2">
              PERFORM FCFS
                <ArrowRight size={20} />
                
              </p>
              <button className="bg-gradient-to-br from-blue-400 to-cyan-300 shadow-lg h-9 sm:h-10 md:h-11 rounded-md w-28 sm:w-36 md:w-40 text-xs sm:text-sm md:text-base font-medium hover:shadow-lg hover:scale-105 transition-all" onClick={Fcfs}>
                Click Here
              </button>
              </div>
            </div>
          </div>

          {/* SJF CPU Scheduling */}
          <div className="w-full h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative bg-gradient-to-br from-green-500 to-teal-400 shadow-lg hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 p-4">
            <div className="absolute inset-0 bg-black/10 rounded-lg sm:rounded-xl md:rounded-2xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex">
              <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-5 text-white font-semibold flex items-center gap-2">
              PERFORM SJF
                <ArrowRight size={20} />
                
              </p>
              <button className="bg-gradient-to-tr from-green-400 to-blue-300 h-9 sm:h-10 md:h-11 rounded-md w-28 sm:w-36 md:w-40 text-xs sm:text-sm md:text-base font-medium hover:shadow-lg hover:scale-105 transition-all" onClick={Sjf}>
                Click Here
              </button>
              </div>
            </div>
          </div>

          {/* Priority Scheduling */}
          <div className="w-full h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative bg-gradient-to-br from-orange-500 to-red-400 shadow-lg hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 p-4">
            <div className="absolute inset-0 bg-black/10 rounded-lg sm:rounded-xl md:rounded-2xl"></div>
            <div className="relative z-10 flex flex-col items-center">
             <div className="flex">
              <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-5 text-white font-semibold flex items-center gap-2">
              PERFORM PRIORITY
                <ArrowRight size={20} />
                
              </p>
              <button className="bg-gradient-to-br from-orange-400 to-red-300 shadow-lg h-9 sm:h-10 md:h-11 rounded-md w-28 sm:w-36 md:w-40 text-xs sm:text-sm md:text-base font-medium hover:shadow-lg hover:scale-105 transition-all" onClick={Priority}>
                Click Here
              </button>
              </div>
            </div>
          </div>

          {/* Round Robin Scheduling */}
          <div className="w-full h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative bg-gradient-to-br from-indigo-500 to-purple-400 shadow-lg hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 p-4">
            <div className="absolute inset-0 bg-black/10 rounded-lg sm:rounded-xl md:rounded-2xl"></div>
            <div className="relative z-10 flex flex-col items-center">
             <div className="flex">
              <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-5 text-white font-semibold flex items-center gap-2">
              PERFORM ROUND ROBIN
                <ArrowRight size={20} />
                
              </p>
              <button className="bg-gradient-to-br from-indigo-400 to-purple-00 shadow-lg h-9 sm:h-10 md:h-11 rounded-md w-28 sm:w-36 md:w-40 text-xs sm:text-sm md:text-base font-medium hover:shadow-lg hover:scale-105 transition-all" onClick={RRR}>
                Click Here
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 mt-12 sm:mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-3 sm:mb-4">Reference</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white flex items-center gap-2">GitHub <Github size={16} className="text-white flex-shrink-0" /></a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white flex items-center gap-2">LinkedIn <Linkedin size={16} className="text-white flex-shrink-0" /></a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Performance Metrics</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Algorithm Walkthroughs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-3 sm:mb-4">Learning</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Textbook Chapter</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Related OS Topics</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Interactive Visualizer</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Video Tutorials</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-3 sm:mb-4">Project Info</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">About the Authors</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">License (e.g., MIT)</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white uppercase mb-3 sm:mb-4">Contribute</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Report an Issue</a></li>
                <li><a href="#" className="text-xs sm:text-sm hover:text-white">Provide Feedback</a></li>
                <li><a href="mailto:contact@example.com" className="text-xs sm:text-sm hover:text-white">Email Us</a></li>
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