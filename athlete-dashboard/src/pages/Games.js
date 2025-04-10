import React, { useState } from 'react';

const Games = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="container">
      <h2>Search Games</h2>
      <input
        type="text"
        placeholder="Search for games (e.g. by team, date)..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: 8, width: '100%', marginBottom: 20, fontSize: '16px' }}
      />
      <p>Game search functionality coming soon.</p>
    </div>
  );
};

export default Games;