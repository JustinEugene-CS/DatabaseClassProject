import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

const Games = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const gamesPerPage = 5; // Number of games per page

  useEffect(() => {
    fetch('http://127.0.0.1:8000/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Error fetching games:', err));
  }, []);

  // Filter games based on search term
  const filteredGames = games.filter(game =>
    game.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the games to display based on the current page
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  // Function to handle the "Next" button click
  const nextPage = () => {
    if (indexOfLastGame < filteredGames.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Function to handle the "Previous" button click
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Reset to page 1 when search term changes
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset page number to 1 when searching
  };

  return (
    <div className="container">
      <h2>Games</h2>
      <SearchBar
        placeholder="Search by opponent or home/away..."
        onSearch={handleSearch} // Use the updated search handler
      />

      {/* Display current games range and total */}
      <p>
        Showing {indexOfFirstGame + 1} - {Math.min(indexOfLastGame, filteredGames.length)} of {filteredGames.length} games
      </p>

      {currentGames.length > 0 ? (
        currentGames.map(game => (
          <div
            key={game.game_id}
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              boxShadow: '0 0 5px rgba(0,0,0,0.1)',
              display: 'flex', // Flexbox to align image with text
              justifyContent: 'space-between', // Add space between text and image
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1 }}>
              <p><strong>Date:</strong> {new Date(game.game_date).toLocaleDateString()}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Display MTSU logo first if home game, opponent logo first if away game */}
                {game.location === 'Home' ? (
                  <>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/5/50/Mt_blue_raiders_logo.png"
                      alt="MTSU Logo"
                      style={{
                        width: '112px',
                        height: '112px',
                        marginRight: '10px'
                      }}
                    />
                    {/* "vs" graphic */}
                    <img
                      src="https://logowik.com/content/uploads/images/vs-versus-symbol2575.logowik.com.webp"
                      alt="vs"
                      style={{
                        width: '67.5px',
                        height: '67.5px',
                        marginRight: '10px'
                      }}
                    />
                    <img
                      src={game.opponent_logo || 'https://via.placeholder.com/112'}
                      alt={game.opponent}
                      style={{
                        width: '112px',
                        height: '112px',
                        marginRight: '10px'
                      }}
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={game.opponent_logo || 'https://via.placeholder.com/112'}
                      alt={game.opponent}
                      style={{
                        width: '112px',
                        height: '112px',
                        marginRight: '10px'
                      }}
                    />
                    {/* "vs" graphic */}
                    <img
                      src="https://logowik.com/content/uploads/images/vs-versus-symbol2575.logowik.com.webp"
                      alt="vs"
                      style={{
                        width: '67.5px',
                        height: '67.5px',
                        marginRight: '10px'
                      }}
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/5/50/Mt_blue_raiders_logo.png"
                      alt="MTSU Logo"
                      style={{
                        width: '112px',
                        height: '112px',
                        marginRight: '10px'
                      }}
                    />
                  </>
                )}
              </div>
              <p><strong>Opponent:</strong> {game.opponent}</p>
              <p><strong>Score:</strong> {game.team_score} – {game.opponent_score}</p>
              <p><strong>Attendance:</strong> {game.attendance ?? 'N/A'}</p>
              <p><strong>Game Type:</strong> {game.location === 'Home' ? 'Home Game' : 'Away Game'}</p>
            </div>

            {/* Win or Lose Image */}
            <img
              src={game.team_score > game.opponent_score
                ? 'https://static.vecteezy.com/system/resources/previews/010/288/196/non_2x/win-celebration-of-jackpot-lettering-isolated-on-white-colourful-text-effect-design-text-or-inscriptions-in-english-the-modern-and-creative-design-has-red-orange-yellow-colors-vector.jpg'
                : 'https://thumb.ac-illust.com/3b/3be13ba99a48685ffb5ea17dd139a7cd_t.jpeg'
              }
              alt={game.team_score > game.opponent_score ? 'Win' : 'Lose'}
              style={{
                width: '150px',
                height: 'auto',
                marginLeft: '20px' // Space between the text and the image
              }}
            />
          </div>
        ))
      ) : (
        <p>No games found.</p>
      )}

      {/* Pagination Buttons Below the Games */}
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
        {indexOfLastGame < filteredGames.length && (
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

export default Games;