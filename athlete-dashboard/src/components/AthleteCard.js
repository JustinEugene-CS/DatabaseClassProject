import React from 'react';

const AthleteCard = ({ player }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: '#fff'
    }}>
      <h3>{player.name}</h3>
      <p><strong>Position:</strong> {player.position}</p>
      <p><strong>Jersey Number:</strong> {player.jersey_number}</p>
      <p><strong>Year:</strong> {player.year}</p>
      {/* Performance Data */}
      <div style={{ marginTop: 10 }}>
        <strong>Performances:</strong>
        {player.performances && player.performances.length > 0 ? (
          player.performances.map(perf => (
            <div key={perf.performance_id} style={{ borderTop: '1px solid #eee', marginTop: 5, paddingTop: 5 }}>
              <p><strong>Game ID:</strong> {perf.game_id}</p>
              <p><strong>Points:</strong> {perf.points}, <strong>Rebounds:</strong> {perf.rebounds}</p>
              <p><strong>Assists:</strong> {perf.assists}, <strong>Minutes:</strong> {perf.minutes_played}</p>
            </div>
          ))
        ) : (
          <p>No performance records available.</p>
        )}
      </div>
    </div>
  );
};

export default AthleteCard;