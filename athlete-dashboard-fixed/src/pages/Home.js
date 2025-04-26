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
      <h1>MTSU Boy's Basketball</h1>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img
          src="https://mtsusidelines.com/wp-content/uploads/2025/02/pmm-54-1200x853.jpg"
          alt="MTSU Basketball"
          style={{ width: '50%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}
        />
      </div>

      <section style={{ marginTop: 30 }}>
        <h2>Player Spotlight</h2>
        {randomPlayer ? (
          <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={randomPlayer.image_url || 'https://via.placeholder.com/150'}
              alt={randomPlayer.name}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                marginRight: '20px',
                objectFit: 'cover'
              }}
            />
            <div>
              <h3>#{randomPlayer.jersey_number ?? 'N/A'} — {randomPlayer.name}</h3>
              <p><strong>Position:</strong> {randomPlayer.position || 'N/A'}</p>
              <p><strong>Class:</strong> {randomPlayer.year || 'N/A'}</p>
              <p><strong>Season Points:</strong> {randomPlayer.points ?? 'N/A'}</p>
              <p><strong>Season Rebounds:</strong> {randomPlayer.rebounds ?? 'N/A'}</p>
              <p><strong>Season Assists:</strong> {randomPlayer.assists ?? 'N/A'}</p>
              <p><strong>Height:</strong> {randomPlayer.height ? `${randomPlayer.height} in` : 'N/A'}</p>
              <p><strong>Weight:</strong> {randomPlayer.weight ? `${randomPlayer.weight} lbs` : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p>...</p>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Game Spotlight</h2>
        {randomGame ? (
          <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={randomGame.opponent_logo || 'https://via.placeholder.com/150'}
              alt={randomGame.opponent}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                marginRight: '20px',
                objectFit: 'cover'
              }}
            />
            <div>
              <p><strong>Date:</strong> {new Date(randomGame.game_date).toLocaleDateString()}</p>
              <p><strong>Opponent:</strong> {randomGame.opponent}</p>
              <p><strong>Location:</strong> {randomGame.location || 'N/A'}</p>
              <p><strong>Score:</strong> {randomGame.team_score} - {randomGame.opponent_score}</p>
              <p><strong>Attendance:</strong> {randomGame.attendance}</p>
            </div>
          </div>
        ) : (
          <p>...</p>
        )}
      </section>
    </div>
  );
};

export default Home;