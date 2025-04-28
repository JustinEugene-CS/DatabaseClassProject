import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';
import SearchBar from '../components/SearchBar';

const Athletes = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // Pagination state
  const playersPerPage = 5;  // Number of players per page
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    year: '',
    age: '',
    height: '',
    weight: '',
    points: '',
    bio: '',
    image_url: ''
  });
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players:', err));
  }, []);

  const userRole = localStorage.getItem('role');

  // Filter players based on the search term
  const filteredPlayers = players.filter(player =>
    player.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic: Get the players for the current page
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

  // Go to the next page
  const nextPage = () => {
    if (indexOfLastPlayer < filteredPlayers.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Reset to page 1 when the search term changes
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);  // Reset to page 1 when searching
  };

  // Handle Add Player form submission
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/add-player/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });

      const data = await response.json();
      if (response.ok) {
        setPlayers([...players, data]); // Add the new player to the list
        setNewPlayer({}); // Reset the form after adding
        setShowAddPlayerForm(false); // Hide the form
      } else {
        console.error('Error adding player:', data.detail);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  // Handle Delete Player
  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete-player/${playerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      // Remove the deleted player from the state
      setPlayers(players.filter(player => player.player_id !== playerId));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  return (
    <div className="container">
      <h2>Athletes</h2>
      <SearchBar
        placeholder="Search players by name..."
        onSearch={handleSearch}  // Use the updated search handler
      />

      {/* Display "Add Player" button for coaches */}
      {userRole === 'coach' && (
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
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={newPlayer.year}
                  onChange={(e) => setNewPlayer({ ...newPlayer, year: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newPlayer.age}
                  onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={newPlayer.height}
                  onChange={(e) => setNewPlayer({ ...newPlayer, height: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Weight"
                  value={newPlayer.weight}
                  onChange={(e) => setNewPlayer({ ...newPlayer, weight: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Points"
                  value={newPlayer.points}
                  onChange={(e) => setNewPlayer({ ...newPlayer, points: e.target.value })}
                />
                <textarea
                  placeholder="Bio"
                  value={newPlayer.bio}
                  onChange={(e) => setNewPlayer({ ...newPlayer, bio: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newPlayer.image_url}
                  onChange={(e) => setNewPlayer({ ...newPlayer, image_url: e.target.value })}
                />
                <button type="submit">Add Player</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        {currentPage > 1 && (
          <button
            onClick={prevPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Previous
          </button>
        )}
        {indexOfLastPlayer < filteredPlayers.length && (
          <button
            onClick={nextPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Next
          </button>
        )}
      </div>

      <p>
        Showing {indexOfFirstPlayer + 1} - {Math.min(indexOfLastPlayer, filteredPlayers.length)} of {filteredPlayers.length} players
      </p>

      {currentPlayers.length > 0 ? (
        currentPlayers.map((player) => (
          <div key={player.player_id} style={{ marginBottom: '20px' }}>
            <h3>{player.name}</h3>
            <AthleteCard player={player} />
            {/* Delete Button */}
            {userRole === 'coach' && (
              <button
                onClick={() => handleDeletePlayer(player.player_id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Delete Player
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No players found.</p>
      )}
    </div>
  );
};

export default Athletes;