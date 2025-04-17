import React, { useState, useEffect } from 'react';

const Games = () => {
  const [games, setGames] = useState([]);
  const [favGames, setFavGames] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/games')
      .then(res => res.json())
      .then(data => setGames(data));

    fetch('http://127.0.0.1:8000/favorites?item_type=game')
      .then(r => r.json())
      .then(favs => setFavGames(favs.map(f => f.item_id)));
  }, []);

  const toggleFavorite = (gameId) => {
    if (!favGames.includes(gameId)) {
      fetch('http://127.0.0.1:8000/favorites', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({item_type:'game', item_id:gameId})
      }).then(() => setFavGames(prev => [...prev, gameId]));
    } else {
      fetch(`http://127.0.0.1:8000/favorites?item_type=game`)
        .then(r=>r.json()).then(favs=>{
          const fav = favs.find(f=>f.item_id===gameId);
          if(fav) fetch(`http://127.0.0.1:8000/favorites/${fav.favorite_id}`,{method:'DELETE'})
            .then(()=> setFavGames(prev=>prev.filter(id=>id!==gameId)));
        });
    }
  };

  return (
    <div className="container">
      <h2>Games</h2>
      {games.map(game => (
        <div key={game.game_id} style={{ backgroundColor:'#fff', padding:16, borderRadius:8, marginBottom:16, boxShadow:'0 0 5px rgba(0,0,0,0.1)' }}>
          <p><strong>Date:</strong> {new Date(game.game_date).toLocaleDateString()}</p>
          <p><strong>Opponent:</strong> {game.opponent}</p>
          <p><strong>Score:</strong> {game.team_score}–{game.opponent_score}</p>
          <p><strong>Attendance:</strong> {game.attendance}</p>
          <button onClick={()=>toggleFavorite(game.game_id)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color: favGames.includes(game.game_id)?'red':'gray'}}>
            {favGames.includes(game.game_id)?'❤️':'🤍'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Games;