import React, { useState, useEffect } from 'react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [favGames, setFavGames] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Error fetching games:', err));

    fetch('http://127.0.0.1:8000/favorites?item_type=game')
      .then(res => res.json())
      .then(favs => setFavGames(favs.map(f => f.item_id)))
      .catch(err => console.error('Error fetching favorite games:', err));
  }, []);

  const toggleFavorite = async (gameId) => {
    const isFavorite = favGames.includes(gameId);

    if (!isFavorite) {
      await fetch('http://127.0.0.1:8000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: 'game', item_id: gameId })
      });
      setFavGames(prev => [...prev, gameId]);
    } else {
      const favs = await fetch('http://127.0.0.1:8000/favorites?item_type=game')
        .then(r => r.json());

      const target = favs.find(f => f.item_id === gameId);
      if (target) {
        await fetch(`http://127.0.0.1:8000/favorites/${target.favorite_id}`, {
          method: 'DELETE'
        });
        setFavGames(prev => prev.filter(id => id !== gameId));
      }
    }
  };

  return (
    <div className="container">
      <h2>Games</h2>
      {games.map(game => (
        <div
          key={game.game_id}
          style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}
        >
          <p><strong>Date:</strong> {new Date(game.game_date).toLocaleDateString()}</p>
          <p><strong>Opponent:</strong> {game.opponent}</p>
          <p><strong>Score:</strong> {game.team_score} – {game.opponent_score}</p>
          <p><strong>Attendance:</strong> {game.attendance ?? 'N/A'}</p>
          <button
            onClick={() => toggleFavorite(game.game_id)}
            title={favGames.includes(game.game_id) ? "Remove from favorites" : "Add to favorites"}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 20,
              color: favGames.includes(game.game_id) ? 'red' : 'gray'
            }}
          >
            {favGames.includes(game.game_id) ? '❤️' : '🤍'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Games;