import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

const Games = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 5;

  const initialNewGame = {
    opponent: '',
    team_score: '',
    opponent_score: '',
    game_date: '',
    location: 'Home',
    opponent_logo: '',
  };

  const [newGame, setNewGame] = useState(initialNewGame);
  const [showAddGameForm, setShowAddGameForm] = useState(false);

  // Auth info
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  const isCoach = role === 'coach';

  // Fetch games
  useEffect(() => {
    fetch('http://127.0.0.1:8000/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Error fetching games:', err));
  }, []);

  // Search filter
  const filteredGames = games.filter(
    game =>
      game.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const nextPage = () => {
    if (indexOfLastGame < filteredGames.length) setCurrentPage(prev => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Add Game (coach)
  const handleAddGame = async e => {
    e.preventDefault();
    try {
      const resp = await fetch('http://127.0.0.1:8000/add-game/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGame)
      });
      const data = await resp.json();
      if (resp.ok) {
        setGames(prev => [...prev, data]);
        setNewGame(initialNewGame);
        setShowAddGameForm(false);
      } else {
        console.error('Error adding game:', data.detail || data);
      }
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  // Delete Game (coach)
  const handleDeleteGame = async id => {
    try {
      const resp = await fetch(`http://127.0.0.1:8000/delete-game/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error('Delete failed');
      setGames(prev => prev.filter(g => g.game_id !== id));
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  return (
    <div className="container">
      <h2>Games</h2>
      <SearchBar placeholder="Search by opponent or location..." onSearch={handleSearch} />

      {/* Pagination Top */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        {currentPage > 1 && <button onClick={prevPage}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Previous</button>}&nbsp;
        {indexOfLastGame < filteredGames.length && <button onClick={nextPage}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Next</button>}
      </div>

      {/* Coach-only Add Game */}
      {isCoach && (
        <div>
          <button onClick={() => setShowAddGameForm(true)}>Add Game</button>
          {showAddGameForm && (
            <div style={{ marginTop: 10 }}>
              <h3>New Game</h3>
              <form onSubmit={handleAddGame} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
                <input
                  type="text"
                  placeholder="Opponent"
                  value={newGame.opponent}
                  onChange={e => setNewGame({ ...newGame, opponent: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Team Score"
                  value={newGame.team_score}
                  onChange={e => setNewGame({ ...newGame, team_score: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Opponent Score"
                  value={newGame.opponent_score}
                  onChange={e => setNewGame({ ...newGame, opponent_score: e.target.value })}
                />
                <input
                  type="date"
                  value={newGame.game_date}
                  onChange={e => setNewGame({ ...newGame, game_date: e.target.value })}
                />
                <select
                  value={newGame.location}
                  onChange={e => setNewGame({ ...newGame, location: e.target.value })}
                >
                  <option value="Home">Home</option>
                  <option value="Away">Away</option>
                </select>
                <input
                  type="url"
                  placeholder="Opponent Logo URL"
                  value={newGame.opponent_logo}
                  onChange={e => setNewGame({ ...newGame, opponent_logo: e.target.value })}
                />
                <button type="submit">Add Game</button>
              </form>
            </div>
          )}
        </div>
      )}

      <p>
        Showing {indexOfFirstGame + 1} - {Math.min(indexOfLastGame, filteredGames.length)} of {filteredGames.length} games
      </p>

      {/* Game List with Images */}
      {currentGames.length ? (
        currentGames.map(game => (
          <div key={game.game_id} style={{ marginBottom: 20, padding: 16, borderRadius: 8, boxShadow: '0 0 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p><strong>Date:</strong> {new Date(game.game_date).toLocaleDateString()}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {game.location === 'Home' ? (
                  <>
                    <img src="https://upload.wikimedia.org/wikipedia/en/5/50/Mt_blue_raiders_logo.png" alt="MTSU" style={{ width: 80, marginRight: 8 }} />
                    <img src="https://logowik.com/content/uploads/images/vs-versus-symbol2575.logowik.com.webp" alt="vs" style={{ width: 40, marginRight: 8 }} />
                    <img src={game.opponent_logo || 'https://via.placeholder.com/80'} alt={game.opponent} style={{ width: 80 }} />
                  </>
                ) : (
                  <>
                    <img src={game.opponent_logo || 'https://via.placeholder.com/80'} alt={game.opponent} style={{ width: 80, marginRight: 8 }} />
                    <img src="https://logowik.com/content/uploads/images/vs-versus-symbol2575.logowik.com.webp" alt="vs" style={{ width: 40, marginRight: 8 }} />
                    <img src="https://upload.wikimedia.org/wikipedia/en/5/50/Mt_blue_raiders_logo.png" alt="MTSU" style={{ width: 80 }} />
                  </>
                )}
              </div>
              <p><strong>Opponent:</strong> {game.opponent}</p>
              <p><strong>Score:</strong> {game.team_score} – {game.opponent_score}</p>
              <p><strong>Type:</strong> {game.location}</p>
            </div>

            {/* Coach-only Delete */}
            {isCoach && (
              <button onClick={() => handleDeleteGame(game.game_id)} style={{ marginRight: 16, backgroundColor: 'red', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>
                Delete Game
              </button>
            )}

            {/* Win/Lose Image */}
            <img
              src={
                game.team_score > game.opponent_score
                  ? 'https://static.vecteezy.com/system/resources/previews/010/288/196/non_2x/win-celebration-of-jackpot-lettering-isolated-on-white-colourful-text-effect-design-text-or-inscriptions-in-english-the-modern-and-creative-design-has-red-orange-yellow-colors-vector.jpg'
                  : 'https://thumb.ac-illust.com/3b/3be13ba99a48685ffb5ea17dd139a7cd_t.jpeg'
              }
              alt={game.team_score > game.opponent_score ? 'Win' : 'Lose'}
              style={{ width: 80, height: 'auto' }}
            />
          </div>
        ))
      ) : (
        <p>No games found.</p>
      )}

      {/* Pagination Bottom */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {currentPage > 1 && <button onClick={prevPage}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066CC',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Previous</button>}&nbsp;
        {indexOfLastGame < filteredGames.length && <button onClick={nextPage}
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

export default Games;
