// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import News from './pages/News';
import Prediction from './pages/Prediction';
import Stocks from './pages/Stocks';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Portfolio from './pages/Portofolio';  

function App() {
  return (
    <Router>
      <div>
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/portfolio" element={<Portfolio />} />
          {/* ADD WEB PAGE OF ERROR !!! */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
