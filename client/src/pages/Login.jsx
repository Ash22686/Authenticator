import React, { useState, useEffect } from "react";
import axios from "axios";
import OtpInput from 'react-otp-input';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Don't forget this import
import "./Login.css";

// Define view states for clarity
const VIEW_STATES = {
  SIGN_UP: "SIGN_UP",
  SIGN_IN: "SIGN_IN",
  OTP_VERIFY: "OTP_VERIFY"
};

// Define the backend API URL for easy maintenance
const API_URL = "http://localhost:5001/api/auth";

function Login() {
  const [viewState, setViewState] = useState(VIEW_STATES.SIGN_IN);
  const [otp, setOtp] = useState('');

  // State for registration form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State for login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

   const navigate = useNavigate();

  // --- GOOGLE AUTH REDIRECT HANDLER ---
  // This hook runs once when the component mounts to check if the user
  // has been redirected back from Google's OAuth flow with a token.
   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      toast.success("Logged in with Google successfully!");
      localStorage.setItem('userToken', token);
      
      // FIX: Redirect to dashboard
      navigate('/dashboard'); 
    }
  }, [navigate]);

  // --- FORM INPUT CHANGE HANDLERS ---
  const handleRegisterChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  // --- FORM SUBMISSION HANDLERS ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      toast.success(response.data.message);
      setViewState(VIEW_STATES.OTP_VERIFY); // Switch to OTP view
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { email: formData.email, otp });
      toast.success(response.data.message);
      localStorage.setItem('userToken', response.data.token);
      setViewState(VIEW_STATES.SIGN_IN); // On success, switch to sign-in view
       navigate('/dashboard'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      toast.success(response.data.message);
      localStorage.setItem('userToken', response.data.token);
       navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  // --- UI HELPER FUNCTIONS ---
  const getContainerClass = () => {
    if (viewState === VIEW_STATES.SIGN_UP) return "active";
    if (viewState === VIEW_STATES.OTP_VERIFY) return "active otp-view";
    return "";
  };

 const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address to receive a password reset link:");
    if (email) {
      try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        // Show the generic success message from the backend
        toast.info(response.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send reset link.');
      }
    }
  };


  // --- REUSABLE GOOGLE BUTTON COMPONENT ---
  const GoogleSignInButton = () => (
    <a href={`${API_URL}/google`} className="google-btn">
      <i className="fa-brands fa-google"></i>
      <span>Sign in with Google</span>
    </a>
  );

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen auth">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="colored" />

      <div className={`container ${getContainerClass()}`}>
        
        {/* Sign-Up Form View */}
        <div className="form-container sign-up">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Account</h1>
            <GoogleSignInButton />
            <span style={{ margin: '15px 0' }}>or use your email for registration</span>
            <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleRegisterChange} required />
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleRegisterChange} required />
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleRegisterChange} required minLength="6" />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* OTP Verification View */}
        <div className="form-container otp-verify">
          <form onSubmit={handleOtpSubmit}>
            <h1>Email Verification</h1>
            <span>An OTP has been sent to <strong>{formData.email}</strong></span>
            <input type="hidden" name="email" value={formData.email} />
            <p>Please enter the code below to continue.</p>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                containerStyle="otp-input-container"
                inputStyle="otp-input"
                renderInput={(props) => <input {...props} />}
            />
            <button type="submit">Verify</button>
          </form>
        </div>

        {/* Sign-In Form View */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <GoogleSignInButton />
            <span style={{ margin: '15px 0' }}>or use your email account</span>
            <input type="email" placeholder="Email" name="email" value={loginData.email} onChange={handleLoginChange} required />
            <input type="password" placeholder="Password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            <a href="#" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
              Forgot Your Password?
            </a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Overlay Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Sign in to access all of our site's features</p>
              <button className="toggle-button" onClick={() => setViewState(VIEW_STATES.SIGN_IN)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello there!</h1>
              <p>Register with your details to start your journey with us</p>
              <button className="toggle-button" onClick={() => setViewState(VIEW_STATES.SIGN_UP)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;