import React, { useState, useEffect } from 'react';

const Home = () => {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [randomGame, setRandomGame] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/random-player')
      .then(res => res.json())
      .then(data => setRandomPlayer(data))
      .catch(err => console.error('Error fetching random player:', err));

    fetch('http://127.0.0.1:8000/random-game')
      .then(res => res.json())
      .then(data => setRandomGame(data))
      .catch(err => console.error('Error fetching random game:', err));
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the MTSU Basketball Dashboard</h1>

      <section style={{ marginTop: 30 }}>
        <h2>Random Player Spotlight</h2>
        {randomPlayer ? (
          <div style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}>
            <h3>{randomPlayer.name}</h3>
            <p><strong>Position:</strong> {randomPlayer.position || 'N/A'}</p>
            <p><strong>Class:</strong> {randomPlayer.year}</p>
            <p><strong>PPG:</strong> {randomPlayer.points_per_game}</p>
            <p><strong>RPG:</strong> {randomPlayer.rebounds_per_game}</p>
            <p><strong>APG:</strong> {randomPlayer.assists}</p>
          </div>
        ) : (
          <p>Loading random player...</p>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Random Game</h2>
        {randomGame ? (
          <div style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}>
            <p><strong>Date:</strong> {new Date(randomGame.game_date).toLocaleDateString()}</p>
            <p><strong>Opponent:</strong> {randomGame.opponent}</p>
            <p><strong>Location:</strong> {randomGame.location || 'N/A'}</p>
            <p><strong>Score:</strong> {randomGame.team_score} - {randomGame.opponent_score}</p>
            <p><strong>Attendance:</strong> {randomGame.attendance}</p>
          </div>
        ) : (
          <p>Loading random game...</p>
        )}
      </section>
    </div>
  );
};

export default Home;