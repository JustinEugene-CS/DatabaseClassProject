import React from 'react';

const AthleteCard = ({ player }) => {
  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      boxShadow: '0 0 5px rgba(0,0,0,0.1)'
    }}>
      <h3>{player.first_name} {player.last_name}</h3>
      <p><strong>Position:</strong> {player.position || 'N/A'}</p>
      <p><strong>Jersey #:</strong> {player.jersey_number}</p>
      <p><strong>Class:</strong> {player.year}</p>

      <hr />

      <p><strong>Games Played:</strong> {player.games_played}</p>
      <p><strong>Points/Game:</strong> {player.points_per_game}</p>
      <p><strong>Rebounds/Game:</strong> {player.rebounds_per_game}</p>
      <p><strong>Assists:</strong> {player.assists}</p>
      <p><strong>FG%:</strong> {(player.fg_pct * 100).toFixed(1)}%</p>
    </div>
  );
};

export default AthleteCard;