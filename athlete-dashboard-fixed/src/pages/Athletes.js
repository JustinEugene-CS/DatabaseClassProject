import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';
import SearchBar from '../components/SearchBar';

const Athletes = () => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // Pagination state
  const playersPerPage = 5;  // Number of players per page

  useEffect(() => {
    fetch('http://127.0.0.1:8000/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players:', err));
  }, []);

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

  return (
    <div className="container">
      <h2>Athletes</h2>
      <SearchBar
        placeholder="Search players by name..."
        onSearch={handleSearch}  // Use the updated search handler
      />

      {/* Pagination Buttons - Displaying "Previous" and "Next" */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        {/* Previous Button */}
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
              marginRight: '10px'
            }}
          >
            Previous
          </button>
        )}

        {/* Next Button */}
        {indexOfLastPlayer < filteredPlayers.length && (
          <button
            onClick={nextPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
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
        currentPlayers.map(player => (
          <div key={player.player_id} style={{ marginBottom: '20px' }}>
            <h3>{player.name}</h3>  {/* Displaying player's name */}
            <AthleteCard player={player} />
          </div>
        ))
      ) : (
        <p>No players found.</p>
      )}

      {/* Pagination Buttons at the bottom */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {/* Previous Button */}
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
              marginRight: '10px'
            }}
          >
            Previous
          </button>
        )}

        {/* Next Button */}
        {indexOfLastPlayer < filteredPlayers.length && (
          <button
            onClick={nextPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Athletes;