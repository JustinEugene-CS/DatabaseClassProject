import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // For signup
  const [role, setRole] = useState('viewer'); // For selecting role in signup
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const [error, setError] = useState(''); // To capture error messages

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before starting the login request

    try {
        const response = await fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            // Log out the full error to help debugging
            console.error('Error response:', data);
            throw new Error(data.detail || 'Login failed');
        }

        // If login is successful, store the JWT token
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);

        // Redirect to a protected page (e.g., dashboard or home page)
        navigate('/'); // Adjust this based on your routing
    } catch (error) {
        setError(error.message);  // Display error message to the user
    }
};

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before starting the signup request

    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sign Up failed');
      }

      // If sign up is successful, store the JWT token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);

      // Redirect to a login page or dashboard
      navigate('/'); // Adjust this based on your routing
    } catch (error) {
      setError(error.message);
    }
  };

  // Toggle between login and signup
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle between login and signup
  };

  return (
    <div className="container">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} style={{ maxWidth: 300 }}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 5 }}>Username:</label>
          <input 
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: 8, width: '100%' }}
            required 
          />
        </div>
        
        {isSignUp && (
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 5 }}>Email:</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ padding: 8, width: '100%' }}
              required 
            />
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 5 }}>Password:</label>
          <input 
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 8, width: '100%' }}
            required 
          />
        </div>

        {isSignUp && (
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: 5 }}>Role:</label>
            <select
              id="role"
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{ padding: 8, width: '100%' }}
              required
            >
              <option value="viewer">Viewer</option>
              <option value="coach">Coach</option>
            </select>
          </div>
        )}

        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#002855',
          color: '#FFB612',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <p style={{ marginTop: 15, textAlign: 'center' }}>
        {isSignUp ? 'Already have an account? ' : 'Need to sign up? '}
        <span
          onClick={toggleSignUp}
          style={{ color: '#FFB612', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isSignUp ? 'Login here' : 'Sign up here'}
        </span>
      </p>
    </div>
  );
};

export default Login;