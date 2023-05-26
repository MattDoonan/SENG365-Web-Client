import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Films from './controllers/films';
import Film from './controllers/film';
import {Login} from "./controllers/login";
import {Register} from "./controllers/register";
import Profile from "./controllers/profile";
function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="/" element={<Films/>} />
                <Route path="/film/:id" element={<Film/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/profile" element={<Profile/>} />
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
