import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';
import SearchBar from '../components/SearchBar';

const Athletes = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 5;

  const initialNewPlayer = {
    name: '',
    position: '',
    year: '',
    age: '',
    height: '',
    weight: '',
    points: '',
    bio: '',
    image_url: ''
  };

  const [newPlayer, setNewPlayer] = useState(initialNewPlayer);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);

  // Retrieve role and token from localStorage
  const role = localStorage.getItem('role') || '';
  const isCoach = role === 'coach';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players:', err));
  }, []);

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

  const nextPage = () => {
    if (indexOfLastPlayer < filteredPlayers.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Add Player (coach only)
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/add-player/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPlayer)
      });
      const data = await response.json();
      if (response.ok) {
        setPlayers(prev => [...prev, data]);
        setNewPlayer(initialNewPlayer);
        setShowAddPlayerForm(false);
      } else {
        console.error('Error adding player:', data.detail || data);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  // Delete Player (coach only)
  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete-player/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete player');
      setPlayers(prev => prev.filter(p => p.player_id !== playerId));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  return (
    <div className="container">
      <h2>Athletes</h2>
      <SearchBar placeholder="Search players by name..." onSearch={handleSearch} />

      {/* Coach-only: Add Player */}
      {isCoach && (
        <div>
          <button onClick={() => setShowAddPlayerForm(true)}>Add Player</button>
          {showAddPlayerForm && (
            <div>
              <h3>New Player</h3>
              <form onSubmit={handleAddPlayer}>
                <input
                  type="text"
                  placeholder="Player Name"
                  value={newPlayer.name}
                  onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Jersey Number"
                  value={newPlayer.jersey_number}
                  onChange={e => setNewPlayer({ ...newPlayer, jersey_number: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newPlayer.position}
                  onChange={e => setNewPlayer({ ...newPlayer, position: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={newPlayer.year}
                  onChange={e => setNewPlayer({ ...newPlayer, year: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newPlayer.age}
                  onChange={e => setNewPlayer({ ...newPlayer, age: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={newPlayer.height}
                  onChange={e => setNewPlayer({ ...newPlayer, height: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Weight"
                  value={newPlayer.weight}
                  onChange={e => setNewPlayer({ ...newPlayer, weight: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Points"
                  value={newPlayer.points}
                  onChange={e => setNewPlayer({ ...newPlayer, points: e.target.value })}
                />
                <textarea
                  placeholder="Bio"
                  value={newPlayer.bio}
                  onChange={e => setNewPlayer({ ...newPlayer, bio: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newPlayer.image_url}
                  onChange={e => setNewPlayer({ ...newPlayer, image_url: e.target.value })}
                />
                <button type="submit">Add Player</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls Top */}
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        {currentPage > 1 && <button onClick={prevPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>Previous</button>}
        {indexOfLastPlayer < filteredPlayers.length && <button onClick={nextPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>Next</button>}
      </div>

      <p>
        Showing {indexOfFirstPlayer + 1} - {Math.min(indexOfLastPlayer, filteredPlayers.length)} of {filteredPlayers.length} players
      </p>

      {currentPlayers.length ? (
        currentPlayers.map(player => (
          <div key={player.player_id} style={{ marginBottom: 20 }}>
            <h3>{player.name}</h3>
            <AthleteCard player={player} />
            {/* Coach-only: Delete Player */}
            {isCoach && (
              <button onClick={() => handleDeletePlayer(player.player_id)}>
                Delete Player
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No players found.</p>
      )}

      {/* Pagination Controls Bottom */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {currentPage > 1 && <button onClick={prevPage}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Previous</button>}
        {indexOfLastPlayer < filteredPlayers.length && <button onClick={nextPage}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Next</button>}
      </div>
    </div>
  );
};

export default Athletes;