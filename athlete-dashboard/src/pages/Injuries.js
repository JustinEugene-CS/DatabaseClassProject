import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

const Injuries = () => {
  const [injuries, setInjuries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/injuries')
      .then(res => res.json())
      .then(data => setInjuries(data))
      .catch(err => console.error('Error fetching injuries:', err));
  }, []);

  const filteredInjuries = injuries.filter(injury =>
    injury.injury_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Injuries</h2>
      <SearchBar placeholder="Search injuries (e.g., 'ankle', 'shoulder')..." onSearch={setSearchTerm} />
      {filteredInjuries.length > 0 ? (
        filteredInjuries.map(injury => (
          <div key={injury.injury_id} style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            boxShadow: '0 0 5px rgba(0,0,0,0.1)'
          }}>
            <p><strong>Player ID:</strong> {injury.player_id}</p>
            <p><strong>Injury Type:</strong> {injury.injury_type}</p>
            <p><strong>Date:</strong> {new Date(injury.injury_date).toLocaleDateString()}</p>
            <p><strong>Recovery Status:</strong> {injury.recovery_status}</p>
            <p><strong>Expected Return:</strong> {injury.expected_return ? new Date(injury.expected_return).toLocaleDateString() : 'N/A'}</p>
          </div>
        ))
      ) : (
        <p>No injuries found.</p>
      )}
    </div>
  );
};

export default Injuries;