import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess, setLikedCards } from '../redux/authSlice';
import { toast } from 'react-toastify';
import './SignIn.css';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/signin', formData, {
        withCredentials: true,
      });

      dispatch(loginSuccess(response.data.user));
      toast.success('SignIn successful!');

      // Delay navigation for better user experience
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign-in failed');
      toast.error(err.response?.data?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signin-container">
        <h2>Sign In</h2>
        {error && <p className="error1">Error: {error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </>
  );
}

export default SignIn;
