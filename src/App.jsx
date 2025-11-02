import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./assets/Components/Home";
import "./popup.css";

import "./edit.css";
import "./Navbar.css";
import Preemptive from "./assets/Components/PREEMPTIVE";
import Nonpreemptive from "./assets/Components/Nonpreemptive";
import At from "./assets/Components/At";
import Bt from "./assets/Components/Bt";
import Ct from "./assets/Components/Ct";
import Tat from "./assets/Components/Tat";
import Wt from "./assets/Components/Wt";
import FCFS from "./assets/Components/FCFS";
import SJF from "./assets/Components/SJF";
import PreemptiveSjf from "./assets/Components/PreemptiveSjf";
import LogIn from "./LogIn";
import RR from "./assets/Components/RR";
import PrioritySche from "./assets/Components/PrioritySche";
import AboutUs from "./assets/Components/AboutUs";
import ContactUs from "./assets/Components/ContactUs";
import PreemptivePriority from "./assets/Components/PreemptivePriority";
import BankersAlgorithm from "./assets/Components/BankersAlgorithm";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/contact_us" element={<ContactUs />} />
          <Route path="/Pre_emptive" element={<Preemptive />} />
          <Route path="/Non_Pre_emptive" element={<Nonpreemptive />} />
          <Route path="/at" element={<At />} />
          <Route path="/bt" element={<Bt />} />
          <Route path="/ct" element={<Ct />} />
          <Route path="/tat" element={<Tat />} />
          <Route path="/Wt" element={<Wt />} />
          <Route path="/fcfs" element={<FCFS />} />
          <Route path="/sjf" element={<SJF />} />
          <Route path="/Psjf" element={<PreemptiveSjf />} />
          <Route path="/rr" element={<RR />} />
          <Route path="/priority_scheduling" element={<PrioritySche />} />
          <Route path="/preemptivepriority" element={<PreemptivePriority />} />
          <Route path="/banker" element={<BankersAlgorithm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
