import React, { useState, useEffect } from 'react';

const AthleteCard = ({ player }) => {
  const [favorited, setFavorited] = useState(false);  // Track if the player is favorited
  const [showFullBio, setShowFullBio] = useState(false);  // State to manage the bio visibility

  // Check if the player is already in the favorites
  useEffect(() => {
    fetch('http://127.0.0.1:8000/favorites')
      .then(res => res.json())
      .then(favs => {
        const isFav = favs.some(fav => fav.player_id === player.player_id);  // Check if this player is in favorites
        setFavorited(isFav);  // Update the favorited state
      })
      .catch(err => console.error('Error fetching favorites:', err));
  }, [player.player_id]);  // Re-run the effect when the player changes

  // Handle toggling the favorite state
  const toggleFavorite = () => {
    if (!favorited) {
      // Add the player to favorites
      fetch('http://127.0.0.1:8000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: player.player_id, user_id: 1 })  // Simulate user_id as 1 for now
      })
        .then(() => {
          setFavorited(true);  // Set as favorited
          console.log('Player added to favorites');
        })
        .catch(err => console.error('Error adding favorite:', err));
    } else {
      // Remove the player from favorites
      fetch('http://127.0.0.1:8000/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: player.player_id, user_id: 1 })  // Simulate user_id as 1 for now
      })
        .then(() => {
          setFavorited(false);  // Set as unfavorited
          console.log('Player removed from favorites');
        })
        .catch(err => console.error('Error removing favorite:', err));
    }
  };

  // Handle toggling bio visibility
  const toggleBio = () => {
    setShowFullBio(!showFullBio);  // Toggle the bio visibility
  };

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
        alt={`${player.first_name} ${player.last_name}`}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          marginRight: '20px',
          objectFit: 'cover',
        }}
      />
      <div>
        <h3>{player.first_name} {player.last_name}</h3>

        {/* Toggle Favorite Button */}
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
        <p><strong>FG%:</strong> {isNaN(player.fg_pct) || player.fg_pct === null ? 'N/A' : `${(player.fg_pct * 100).toFixed(1)}%`}</p>

        {/* Bio Section */}
        <p><strong>Bio:</strong> 
          {showFullBio ? player.bio : `${player.bio?.slice(0, 100)}${player.bio?.length > 100 ? '...' : ''}`}
        </p>

        {/* Toggle button for bio */}
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