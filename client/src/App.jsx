import Login from './pages/Login';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './protectedROute';
import ResetPassword from './pages/ResetPassword';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route: The login page is accessible to everyone at the root URL */}
          <Route path="/" element={<Login />} />

          {/* Protected Route: The dashboard is wrapped in our ProtectedRoute component */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;