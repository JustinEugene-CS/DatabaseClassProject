import React, { useState, useEffect } from 'react';

const AthleteCard = ({ player }) => {
  const [favorited, setFavorited] = useState(false);

  // Check if current player is already favorited
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/favorites?item_type=player`)
      .then(res => res.json())
      .then(favs => {
        const isFav = favs.some(fav => fav.item_id === player.player_id);
        setFavorited(isFav);
      })
      .catch(err => console.error('Fetch favorites error:', err));
  }, [player.player_id]);

  // Toggle favorite on click
  const toggleFavorite = () => {
    if (!favorited) {
      fetch('http://127.0.0.1:8000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: 'player', item_id: player.player_id })
      })
      .then(() => setFavorited(true))
      .catch(err => console.error('Add favorite error:', err));
    } else {
      fetch(`http://127.0.0.1:8000/favorites?item_type=player`)
        .then(res => res.json())
        .then(favs => {
          const fav = favs.find(f => f.item_id === player.player_id);
          if (fav) {
            fetch(`http://127.0.0.1:8000/favorites/${fav.favorite_id}`, { method: 'DELETE' })
              .then(() => setFavorited(false))
              .catch(err => console.error('Remove favorite error:', err));
          }
        })
        .catch(err => console.error('Fetch favorites error:', err));
    }
  };

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      boxShadow: '0 0 5px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{player.first_name} {player.last_name}</h3>
        <button
          onClick={toggleFavorite}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: favorited ? 'red' : 'gray' }}
          aria-label={favorited ? 'Unfavorite player' : 'Favorite player'}
        >
          {favorited ? '❤️' : '🤍'}
        </button>
      </div>

      <p><strong>Position:</strong> {player.position || 'N/A'}</p>
      <p><strong>Jersey #:</strong> {player.jersey_number}</p>
      <p><strong>Class:</strong> {player.year}</p>

      <hr />

      <p><strong>Games Played:</strong> {player.games_played ?? 'N/A'}</p>
      <p><strong>Points/Game:</strong> {player.points_per_game ?? 'N/A'}</p>
      <p><strong>Rebounds/Game:</strong> {player.rebounds_per_game ?? 'N/A'}</p>
      <p><strong>Assists:</strong> {player.assists ?? 'N/A'}</p>
      <p><strong>FG%:</strong> 
        {isNaN(player.fg_pct) || player.fg_pct === null ? 'N/A' : `${(player.fg_pct * 100).toFixed(1)}%`}
      </p>
    </div>
  );
};

export default AthleteCard;