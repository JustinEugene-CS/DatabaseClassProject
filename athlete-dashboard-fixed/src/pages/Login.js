import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');               // For signup
  const [signUpRole, setSignUpRole] = useState('viewer'); // Avoid name clash
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ─── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Login error:', data);
        throw new Error(data.detail || 'Login failed');
      }

      // Decode the token to get the role claim
      const { role: decodedRole } = jwtDecode(data.access_token);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', decodedRole);

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // ─── Sign Up ─────────────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          role: signUpRole,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Signup error:', data);
        throw new Error(data.detail || 'Sign Up failed');
      }

      const { role: decodedRole } = jwtDecode(data.access_token);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', decodedRole);

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSignUp = () => setIsSignUp(prev => !prev);

  return (
    <div className="container">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form
        onSubmit={isSignUp ? handleSignUp : handleLogin}
        style={{ maxWidth: 300 }}
      >
        {/* Username */}
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: 5 }}>
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: 8, width: '100%' }}
            required
          />
        </div>

        {/* Email (signup only) */}
        {isSignUp && (
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 5 }}>
              Email:
            </label>
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

        {/* Password */}
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 5 }}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 8, width: '100%' }}
            required
          />
        </div>

        {/* Role selector (signup only) */}
        {isSignUp && (
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: 5 }}>
              Role:
            </label>
            <select
              id="role"
              value={signUpRole}
              onChange={e => setSignUpRole(e.target.value)}
              style={{ padding: 8, width: '100%' }}
              required
            >
              <option value="viewer">Viewer</option>
              <option value="coach">Coach</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#002855',
            color: '#FFB612',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {/* Error message */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Toggle link */}
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