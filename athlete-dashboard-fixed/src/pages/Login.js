import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Placeholder for authentication logic
    alert(`Logging in as ${username}`);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ maxWidth: 300 }}>
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
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#002855',
          color: '#FFB612',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;