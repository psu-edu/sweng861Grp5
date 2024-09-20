import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import SemesterRegistration from './components/Semester Registration'; // Import the semester registration page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/semester-registration" element={<SemesterRegistration />} /> {/* Route for Semester Registration */}
      </Routes>
    </Router>
  );
}

export default App;
