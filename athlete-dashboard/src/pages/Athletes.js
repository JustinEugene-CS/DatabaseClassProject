import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';
import SearchBar from '../components/SearchBar';

const Athletes = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players:', err));
  }, []);

  const filteredPlayers = players.filter(player =>
    (player.first_name + ' ' + player.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Players</h2>
      <SearchBar placeholder="Search players by name..." onSearch={setSearchTerm} />
      {filteredPlayers.length > 0 ? (
        filteredPlayers.map(player => (
          <AthleteCard key={player.player_id} player={player} />
        ))
      ) : (
        <p>No players found.</p>
      )}
    </div>
  );
};

export default Athletes;