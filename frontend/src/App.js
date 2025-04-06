import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Patient from './components/Patient';
import Doctor from './components/Doctors';
import Admin from './components/Admins';
import Dashboard from './pages/Dashboard';

function App() {
  const [email, setEmail] = useState('');
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login email={email} setEmail={setEmail} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/doctor" element={<Doctor email={email} />} />
          <Route path="/admin" element={<Admin email={email}/>} />
          <Route path='/finance' element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;