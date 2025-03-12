// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartUserPage';
import LikedPage from './pages/LikeUserPage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
import { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from "react-toastify";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/userLogged', {
          withCredentials: true, // Send cookies with the request
        });

        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        console.error('User is not logged in', error);
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer autoClose={2000} /> 
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/like" element={<LikedPage />} />
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* ADD WEB PAGE OF ERROR !!! */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
