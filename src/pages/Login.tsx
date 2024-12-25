import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice';
import "../styles/Auth.css";
import { BASE_URL } from '../constants';
import Loader from '../components/Loader';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Explicitly type the event parameter
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Explicitly type the event parameter
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formData);
      setSuccess(response.data.message);

      // Dispatch setUser to store user data in Redux state
      dispatch(setUser(response.data.user)); // Assume response contains user object

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to Dashboard after successful login
      navigate('/'); // Change '/dashboard' to your desired route
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred | Backend server might be down!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          Login
        </button>

        {isLoading && <Loader />}

        <div className="auth-switch">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
