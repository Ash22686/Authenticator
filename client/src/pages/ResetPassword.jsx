import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Hooks to get the token from the URL and to navigate programmatically
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    try {
      // Send the PUT request to the backend with the token from the URL
      const response = await axios.put(
        `http://localhost:5001/api/auth/reset-password/${token}`,
        { password }
      );
      toast.success(response.data.message);
      // Redirect to the login page after a short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Reset Your Password</h2>
        <p>Please enter your new password below.</p>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Reset Password</button>
      </form>
    </div>
  );
};

// Basic Styling for the component
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  form: { display: 'flex', flexDirection: 'column', padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  input: { padding: '12px', fontSize: '16px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '12px', color: 'white', backgroundColor: '#512da8', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
};

export default ResetPassword;