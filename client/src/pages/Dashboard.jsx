import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          'http://localhost:5001/api/users/profile',
          config
        );

        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Your session has expired or is invalid. Please log in again.');
        localStorage.removeItem('userToken');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={styles.fullPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.fullPage}>
        <h1 style={styles.errorTitle}>Error</h1>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Authenticator</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.title}>Hello, {user?.name || 'User'}!</h2>
          <p style={styles.subtitle}>Your account details:</p>

          <div style={styles.infoRow}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{user?.name}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{user?.email}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>User ID:</span>
            <span style={styles.value}>{user?._id}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Minimalistic Styles ---
const styles = {
  page: {
    height: '100vh',
    backgroundColor: '#fefefe',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: `'Inter', sans-serif`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e5e5',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#333333',
  },
  logoutBtn: {
    backgroundColor: '#333333',
    border: 'none',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    letterSpacing: '0.5px',
    transition: 'background 0.3s',
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#333333',
  },
  subtitle: {
    fontSize: '14px',
    color: '#777777',
    marginBottom: '24px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#555555',
  },
  label: {
    fontWeight: 500,
  },
  value: {
    fontWeight: 400,
    color: '#333333',
  },
  fullPage: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fefefe',
    textAlign: 'center',
    fontFamily: `'Inter', sans-serif`,
    padding: '0 20px',
  },
  loadingText: {
    marginTop: '16px',
    color: '#999999',
    fontSize: '14px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #e5e5e5',
    borderTopColor: '#333333',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorTitle: {
    color: '#ff4d4f',
    fontSize: '22px',
    marginBottom: '10px',
  },
  errorText: {
    color: '#666666',
    fontSize: '14px',
  },
};

// Inject minimal CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

export default Dashboard;
