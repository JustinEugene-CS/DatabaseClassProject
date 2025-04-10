import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Athletes from './pages/Athletes';
import Injuries from './pages/Injuries';
import Games from './pages/Games';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/" className="nav-link" end>Home</NavLink>
        <NavLink to="/athletes" className="nav-link">Athletes</NavLink>
        <NavLink to="/injuries" className="nav-link">Injuries</NavLink>
        <NavLink to="/games" className="nav-link">Games</NavLink>
        <NavLink to="/login" className="nav-link">Login</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/injuries" element={<Injuries />} />
        <Route path="/games" element={<Games />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;