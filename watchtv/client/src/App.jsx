import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {watchtv} from './assets/Pictures';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import Upload from './Components/Upload';
import Profile from './Components/Profile';
import EditProfile from './Components/Edit-Profile';
function App() {
  React.useEffect(() => {
    document.title = "Watch TV"; // Dynamically set the title
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = watchtv;
    document.head.appendChild(link);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />

      
      </Routes>
      
    </Router>
  );
}

export default App;