import React, { useState } from 'react';
import axios from 'axios';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { setUser } from '../store/userSlice'; // Import setUser action
import { useDispatch } from 'react-redux';
import "../styles/Auth.css";
import { BASE_URL } from '../constants';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Signup = () => {
  const dispatch = useDispatch(); // Hook to dispatch actions
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Specify type for change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Specify type for submit event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, formData);
      setSuccess(response.data.message);
      // Dispatch setUser to store user data in Redux state
      dispatch(setUser(response.data.user)); // Assume response contains user object
      toast.success("Account created successfully! Login to continue!")
    } catch (err: any) { // Use 'any' here if the error type is dynamic
      setError(err.response?.data?.message || 'An error occurred | Backend server might be down!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <div className="input-group">
          <FaUserAlt className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          Sign Up
        </button>

        {isLoading && <Loader />}

        <div className="auth-switch">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
