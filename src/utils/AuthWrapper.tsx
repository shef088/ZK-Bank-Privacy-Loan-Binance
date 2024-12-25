import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { PropsWithChildren } from 'react';

const AuthWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login'); // If no token, redirect to login
      return;
    }

    const fetchUserData = async () => {
      try {
        // Check token validity by making a request to your backend
        const response = await axios.get(`${BASE_URL}/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If token is valid, set user data in Redux
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.log("error::", error)
        // If token is invalid or expired, clear user data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(clearUser());
        navigate('/login'); // Redirect to login page
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default AuthWrapper;
