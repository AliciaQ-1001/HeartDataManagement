import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import HeartData from './pages/HeartData';
import RespiratoryData from './pages/RespiratoryData';
import SleepActivity from './pages/SleepActivity';
import UserInfo from './pages/UserInfo';
import Consultation from './pages/Consultation';
import 'antd/dist/reset.css';
import './App.css';

const AppContent: React.FC = () => {
  const [consultType, setConsultType] = useState('doctor');
  const location = useLocation();
  const isConsultation = location.pathname === '/consultation';
  return (
    <div className="app-root">
      <Sidebar />
      <div className="main-content">
        <Topbar {...(isConsultation ? { onConsultTypeChange: setConsultType } : {})} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heart" element={<HeartData />} />
          <Route path="/respiratory" element={<RespiratoryData />} />
          <Route path="/sleep" element={<SleepActivity />} />
          <Route path="/user" element={<UserInfo />} />
          <Route path="/consultation" element={<Consultation consultType={consultType} onConsultTypeChange={setConsultType} />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
