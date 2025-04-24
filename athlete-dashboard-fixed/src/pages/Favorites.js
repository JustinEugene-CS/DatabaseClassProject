import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';

const Favorites = () => {
  const [playerFavs, setPlayerFavs] = useState([]);
  const [gameFavs, setGameFavs]     = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/favorites?item_type=player')
      .then(r => r.json())
      .then(favs => {
        Promise.all(
          favs.map(f => fetch(`http://127.0.0.1:8000/players/${f.item_id}`).then(r => r.json()))
        ).then(setPlayerFavs);
      });

    fetch('http://127.0.0.1:8000/favorites?item_type=game')
      .then(r => r.json())
      .then(favs => {
        Promise.all(
          favs.map(f => fetch(`http://127.0.0.1:8000/games/${f.item_id}`).then(r => r.json()))
        ).then(setGameFavs);
      });
  }, []);

  return (
    <div className="container">
      <h2>Your Favorites</h2>

      <section>
        <h3>Players</h3>
        {playerFavs.map(p => <AthleteCard key={p.player_id} player={p} />)}
      </section>

      <section style={{ marginTop: 40 }}>
        <h3>Games</h3>
        {gameFavs.map(g => (
          <div key={g.game_id} style={{ /* reuse your game card styles */ }}>
            <p><strong>{new Date(g.game_date).toLocaleDateString()}</strong> vs {g.opponent}</p>
            <p>Score: {g.team_score} – {g.opponent_score}</p>
            <p>Attendance: {g.attendance}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Favorites;