import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

const Injuries = () => {
  const [injuries, setInjuries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddInjuryForm, setShowAddInjuryForm] = useState(false);

  const initialNewInjury = {
    player_id: '',
    injury_type: '',
    injury_date: '',
    recovery_status: '',
    expected_return: ''
  };
  const [newInjury, setNewInjury] = useState(initialNewInjury);

  const [playersList, setPlayersList] = useState([]);

  // Auth info
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';
  const isCoach = role === 'coach';

  // Fetch injuries
  useEffect(() => {
    fetch('http://127.0.0.1:8000/injuries')
      .then(res => res.json())
      .then(data => setInjuries(data))
      .catch(err => console.error('Error fetching injuries:', err));

    // Fetch players for dropdown
    fetch('http://127.0.0.1:8000/players')
      .then(res => res.json())
      .then(data => setPlayersList(data))
      .catch(err => console.error('Error fetching players list:', err));
  }, []);

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'recovered': return 'green';
      case 'in progress': return 'orange';
      case 'out indefinitely': return 'red';
      default: return 'gray';
    }
  };

  const filteredInjuries = injuries
    .sort((a, b) => new Date(b.injury_date) - new Date(a.injury_date))
    .filter(injury =>
      injury.injury_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Add Injury (coach only)
  const handleAddInjury = async e => {
    e.preventDefault();
    try {
      const resp = await fetch('http://127.0.0.1:8000/add-injury/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newInjury,
          // send null instead of empty string for expected_return
          expected_return: newInjury.expected_return || null
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        setInjuries(prev => [data, ...prev]);
        setNewInjury(initialNewInjury);
        setShowAddInjuryForm(false);
      } else {
        console.error('Error adding injury:', data.detail || data);
      }
    } catch (error) {
      console.error('Error adding injury:', error);
    }
  };

  // Delete Injury (coach only)
  const handleDeleteInjury = async id => {
    try {
      const resp = await fetch(`http://127.0.0.1:8000/delete-injury/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error('Delete failed');
      setInjuries(prev => prev.filter(i => i.injury_id !== id));
    } catch (error) {
      console.error('Error deleting injury:', error);
    }
  };

  return (
    <div className="container">
      <h2>Injuries</h2>
      <SearchBar placeholder="Search injuries (e.g., 'ankle')..." onSearch={setSearchTerm} />

      {/* Coach-only: Add Injury */}
      {isCoach && (
        <div style={{ margin: '20px 0' }}>
          <button onClick={() => setShowAddInjuryForm(true)}>Add Injury</button>
          {showAddInjuryForm && (
            <form onSubmit={handleAddInjury} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, maxWidth: 400 }}>
              {/* Player Select */}
              <label>Player:</label>
              <select
                value={newInjury.player_id}
                onChange={e => setNewInjury({ ...newInjury, player_id: e.target.value })}
                required
              >
                <option value="">Select player</option>
                {playersList.map(p => (
                  <option key={p.player_id} value={p.player_id}>{p.name}</option>
                ))}
              </select>

              {/* Injury Type */}
              <label>Injury Type:</label>
              <input
                type="text"
                placeholder="Injury Type"
                value={newInjury.injury_type}
                onChange={e => setNewInjury({ ...newInjury, injury_type: e.target.value })}
                required
              />

              {/* Injury Date */}
              <label>Injury Date:</label>
              <input
                type="date"
                value={newInjury.injury_date}
                onChange={e => setNewInjury({ ...newInjury, injury_date: e.target.value })}
              />

              {/* Recovery Status */}
              <label>Recovery Status:</label>
              <select
                value={newInjury.recovery_status}
                onChange={e => setNewInjury({ ...newInjury, recovery_status: e.target.value })}
              >
                <option value="">Select status</option>
                <option value="recovered">Recovered</option>
                <option value="in progress">In Progress</option>
                <option value="out indefinitely">Out Indefinitely</option>
              </select>

              {/* Recovery Date: only if not recovered */}
              {newInjury.recovery_status.toLowerCase() !== 'recovered' && (
                <>
                  <label>Recovery Date:</label>
                  <input
                    type="date"
                    value={newInjury.expected_return}
                    onChange={e => setNewInjury({ ...newInjury, expected_return: e.target.value })}
                  />
                </>
              )}

              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}

      {/* Injury List */}
      {filteredInjuries.length > 0 ? (
        filteredInjuries.map(injury => (
          <div key={injury.injury_id} style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
            <p><strong>Player:</strong> {injury.name}</p>
            <p><strong>Injury Type:</strong> {injury.injury_type}</p>
            <p><strong>Date:</strong> {injury.injury_date ? new Date(injury.injury_date).toLocaleDateString() : 'N/A'}</p>
            <p>
              <strong>Recovery Status:</strong>{' '}
              <span style={{ color: getStatusColor(injury.recovery_status), fontWeight: 'bold' }}>
                {injury.recovery_status || 'N/A'}
              </span>
            </p>
            <p><strong>Expected Return:</strong> {injury.expected_return ? new Date(injury.expected_return).toLocaleDateString() : 'N/A'}</p>

            {/* Coach-only: Delete Injury */}
            {isCoach && (
              <button onClick={() => handleDeleteInjury(injury.injury_id)} style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>
                Delete Injury
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No injuries found.</p>
      )}
    </div>
  );
};

export default Injuries;
