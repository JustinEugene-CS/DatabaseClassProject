import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

const Injuries = () => {
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/athletes')
      .then(res => res.json())
      .then(data => setAthletes(data))
      .catch(err => console.error('Error fetching athletes:', err));
  }, []);

  // Filter athletes to those that have an injury field (assuming injuries is an object)
  const filteredAthletes = athletes.filter(a =>
    JSON.stringify(a.injuries)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Player Injuries</h2>
      <SearchBar placeholder="Search injuries (e.g., 'knee', 'ankle')..." onSearch={setSearchTerm} />
      {filteredAthletes.length > 0 ? (
        filteredAthletes.map(a => (
          <div key={a.id} style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: '#fff'
          }}>
            <h3>{a.name}</h3>
            <p><strong>Injury Details:</strong></p>
            <pre>{JSON.stringify(a.injuries, null, 2)}</pre>
          </div>
        ))
      ) : (
        <p>No injuries matching your search were found.</p>
      )}
    </div>
  );
};

export default Injuries;