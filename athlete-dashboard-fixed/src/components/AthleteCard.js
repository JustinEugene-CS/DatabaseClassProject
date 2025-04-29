import React, { useState, useEffect } from 'react';

const AthleteCard = ({ player }) => {
  const [favorited, setFavorited] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const token = localStorage.getItem('token');

  // Check if the player is already in the user's favorites
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.status}`);
        const favs = await res.json();
        setFavorited(Array.isArray(favs) && favs.some(fav => fav.player_id === player.player_id));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };
    if (token) checkFavorite();
  }, [player.player_id, token]);

  // Toggle favorite state for this player
  const toggleFavorite = async () => {
    try {
      const url = 'http://127.0.0.1:8000/favorites';
      const method = favorited ? 'DELETE' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ player_id: player.player_id })
      });
      if (!res.ok) throw new Error(`Failed to ${favorited ? 'remove' : 'add'} favorite: ${res.status}`);
      setFavorited(!favorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Toggle bio visibility
  const toggleBio = () => setShowFullBio(prev => !prev);

  return (
    <div
      style={{
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={player.image_url || 'https://via.placeholder.com/150'}
        alt={player.name}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          marginRight: '20px',
          objectFit: 'cover',
        }}
      />
      <div>
        <h3>{player.name}</h3>

        {/* Favorite Toggle */}
        <button
          onClick={toggleFavorite}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 24,
            color: favorited ? 'red' : 'gray',
          }}
          aria-label={favorited ? 'Unfavorite player' : 'Favorite player'}
        >
          {favorited ? '❤️' : '🤍'}
        </button>

        {/* Basic Player Info */}
        <p><strong>Position:</strong> {player.position || 'N/A'}</p>
        <p><strong>Jersey #:</strong> {player.jersey_number}</p>
        <p><strong>Class:</strong> {player.year}</p>

        <hr />

        {/* Basic Stats */}
        <p><strong>Games Played:</strong> {player.games_played ?? 'N/A'}</p>
        <p><strong>Points/Game:</strong> {player.points_per_game ?? 'N/A'}</p>
        <p><strong>Rebounds/Game:</strong> {player.rebounds_per_game ?? 'N/A'}</p>
        <p><strong>Assists:</strong> {player.assists ?? 'N/A'}</p>
        <p><strong>FG%:</strong> {isNaN(player.fg_pct) || player.fg_pct == null ? 'N/A' : `${(player.fg_pct * 100).toFixed(1)}%`}</p>

        {/* Bio Section */}
        <p><strong>Bio:</strong> {' '}
          {showFullBio ? player.bio : `${player.bio?.slice(0, 100)}${player.bio?.length > 100 ? '...' : ''}`}
        </p>
        {player.bio && player.bio.length > 100 && (
          <button
            onClick={toggleBio}
            style={{ background: 'none', border: 'none', color: '#0066CC', cursor: 'pointer' }}
          >
            {showFullBio ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AthleteCard;
