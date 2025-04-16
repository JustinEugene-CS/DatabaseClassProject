import React, { useState, useEffect } from 'react';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Error fetching games:', err));
  }, []);

  return (
    <div className="container">
      <h2>Games</h2>
      {games.length > 0 ? (
        games.map(game => (
          <div key={game.game_id} style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}>
            <p><strong>Date:</strong> {new Date(game.game_date).toLocaleDateString()}</p>
            <p><strong>Opponent:</strong> {game.opponent}</p>
            <p><strong>Location:</strong> {game.location || 'N/A'}</p>
            <p><strong>Score:</strong> {game.team_score} - {game.opponent_score}</p>
            <p><strong>Attendance:</strong> {game.attendance}</p>
          </div>
        ))
      ) : (
        <p>Loading games...</p>
      )}
    </div>
  );
};

export default Games;