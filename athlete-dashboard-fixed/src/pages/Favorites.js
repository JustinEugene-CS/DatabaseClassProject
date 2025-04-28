import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';

const Favorites = () => {
  const [playerFavs, setPlayerFavs] = useState([]);

  // Fetch favorites (players only) when the page loads
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    // Fetch favorite players
    fetch('http://127.0.0.1:8000/favorites')
      .then(r => r.json())
      .then(favs => {
        // If the fetched favorites are valid, load player data for each favorite player
        if (Array.isArray(favs)) {
          Promise.all(
            favs.map(f => fetch(`http://127.0.0.1:8000/players/${f.player_id}`).then(r => r.json()))
          ).then(setPlayerFavs);
        } else {
          console.error("Invalid data format for player favorites:", favs);
        }
      })
      .catch(err => console.error('Error fetching player favorites:', err));
  };

  return (
    <div className="container">
      <h2>Your Favorites</h2>

      <section>
        <h3>Players</h3>
        {playerFavs.length > 0 ? (
          playerFavs.map(p => (
            <div key={p.player_id} style={{ marginBottom: '20px' }}>
              <AthleteCard player={p} />
            </div>
          ))
        ) : (
          <p>No favorite players found.</p>
        )}
      </section>
    </div>
  );
};

export default Favorites;