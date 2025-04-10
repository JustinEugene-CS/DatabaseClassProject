import React from 'react';

const AthleteCard = ({ athlete }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: '#fff'
    }}>
      <h3>{athlete.name}</h3>
      <div>
        <strong>Statistics:</strong>
        <pre>{JSON.stringify(athlete.statistics, null, 2)}</pre>
      </div>
      <div>
        <strong>Injuries:</strong>
        <pre>{JSON.stringify(athlete.injuries, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AthleteCard;