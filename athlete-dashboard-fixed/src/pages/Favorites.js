import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';

const Favorites = () => {
  const [playerFavs, setPlayerFavs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const favoritesPerPage = 1; // one favorite per page

  // Fetch favorites data
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem('token');

        // 1) Fetch favorites for current user with auth header
        const favRes = await fetch('http://127.0.0.1:8000/favorites', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!favRes.ok) {
          throw new Error(`Unable to fetch favorites: ${favRes.status}`);
        }
        const favs = await favRes.json();

        // 2) Fetch all injuries with auth header
        const injRes = await fetch('http://127.0.0.1:8000/injuries', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const allInjuries = await injRes.json();

        // 3) Build array with player, games, injuries
        const favData = await Promise.all(
          favs.map(async (fav) => {
            // Fetch player info
            const pRes = await fetch(
              `http://127.0.0.1:8000/players/${fav.player_id}`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const player = await pRes.json();

            // Fetch player games
            const gRes = await fetch(
              `http://127.0.0.1:8000/player-games/${fav.player_id}`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const games = await gRes.json();

            // Filter injuries for this player
            const injuries = allInjuries.filter(i => i.player_id === fav.player_id);

            return { ...player, games, injuries };
          })
        );

        setPlayerFavs(favData);
      } catch (err) {
        console.error('Error loading favorites data:', err);
      }
    };

    loadFavorites();
  }, []);

  // Pagination logic
  const indexOfFirst = (currentPage - 1) * favoritesPerPage;
  const indexOfLast = indexOfFirst + favoritesPerPage;
  const currentFavorites = playerFavs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(playerFavs.length / favoritesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const paginationControls = (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="container">
      <h2>Your Favorites</h2>

      {/* Top Pagination */}
      {playerFavs.length > 0 && paginationControls}

      {playerFavs.length > 0 ? (
        currentFavorites.map((p) => (
          <div key={p.player_id} style={{ marginBottom: '40px' }}>
            {/* Player info */}
            <AthleteCard player={p} />

            {/* Player's Games */}
            <h4>Games Played</h4>
            {p.games.length > 0 ? (
              <ul>
                {p.games.map(g => (
                  <li key={g.game_id} style={{ marginBottom: '8px' }}>
                    Date: {new Date(g.game_date).toLocaleDateString()} &mdash; Opponent: {g.opponent} &mdash; Score: {g.team_score}–{g.opponent_score} &mdash; Minutes: {g.minutes_played} &mdash; Started: {g.games_started ? 'Yes' : 'No'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No games found for this player.</p>
            )}

            {/* Player's Injuries */}
            <h4>Injuries</h4>
            {p.injuries.length > 0 ? (
              <ul>
                {p.injuries.map(inj => (
                  <li key={inj.injury_id} style={{ marginBottom: '8px' }}>
                    {inj.injury_type} on {inj.injury_date ? new Date(inj.injury_date).toLocaleDateString() : 'N/A'} &mdash; 
                    Status: <strong style={{ color: (() => {
                      switch(inj.recovery_status?.toLowerCase()) {
                        case 'recovered': return 'green';
                        case 'in progress': return 'orange';
                        case 'out indefinitely': return 'red';
                        default: return 'gray';
                      }
                    })() }}>{inj.recovery_status}</strong> &mdash; 
                    {inj.expected_return && (`Expected Return: ${new Date(inj.expected_return).toLocaleDateString()}`)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No injuries recorded for this player.</p>
            )}
          </div>
        ))
      ) : (
        <p>No favorite players found.</p>
      )}

      {/* Bottom Pagination */}
      {playerFavs.length > 0 && paginationControls}
    </div>
  );
};

export default Favorites;