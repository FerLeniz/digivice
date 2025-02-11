// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News';
import Prediction from './pages/Prediction';
import Stocks from './pages/Stocks';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Portfolio from './pages/Portofolio';  
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          {/* ADD WEB PAGE OF ERROR !!! */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
