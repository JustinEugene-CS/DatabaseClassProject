import React, { useState, useEffect } from 'react';
import AthleteCard from '../components/AthleteCard';
import SearchBar from '../components/SearchBar';

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/athletes')
      .then(res => res.json())
      .then(data => setAthletes(data))
      .catch(err => console.error('Error fetching athletes:', err));
  }, []);

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Athletes</h2>
      <SearchBar placeholder="Search athletes by name..." onSearch={setSearchTerm} />
      {filteredAthletes.length > 0 ? (
        filteredAthletes.map(a => <AthleteCard key={a.id} athlete={a} />)
      ) : (
        <p>No athletes found.</p>
      )}
    </div>
  );
};

export default Athletes;