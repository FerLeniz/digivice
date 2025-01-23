// src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css'; // Optional: for styling

function AdminPage() {
  const [digimons, setDigimons] = useState([]);
  const [newDigimon, setNewDigimon] = useState({ name: '', description: '' });

  // Fetch Digimon data from the server
  useEffect(() => {
    axios.get('/api/digimons')
      .then(response => setDigimons(response.data))
      .catch(error => console.error('Error fetching Digimons:', error));
  }, []);

  // Add a new Digimon
  const addDigimon = () => {
    axios.post('/api/digimons', newDigimon)
      .then(response => setDigimons([...digimons, response.data]))
      .catch(error => console.error('Error adding Digimon:', error));
  };

  // Update an existing Digimon
  const updateDigimon = (id, updatedDigimon) => {
    axios.put(`/api/digimons/${id}`, updatedDigimon)
      .then(response => {
        setDigimons(digimons.map(digimon => digimon._id === id ? response.data : digimon));
      })
      .catch(error => console.error('Error updating Digimon:', error));
  };

  // Delete a Digimon
  const deleteDigimon = (id) => {
    axios.delete(`/api/digimons/${id}`)
      .then(() => setDigimons(digimons.filter(digimon => digimon._id !== id)))
      .catch(error => console.error('Error deleting Digimon:', error));
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <div className="add-digimon">
        <h2>Add Digimon</h2>
        <input
          type="text"
          placeholder="Name"
          value={newDigimon.name}
          onChange={(e) => setNewDigimon({ ...newDigimon, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newDigimon.description}
          onChange={(e) => setNewDigimon({ ...newDigimon, description: e.target.value })}
        />
        <button onClick={addDigimon}>Add</button>
      </div>
      <div className="digimon-list">
        <h2>Digimon List</h2>
        {digimons.map(digimon => (
          <div key={digimon._id} className="digimon-card">
            <h3>{digimon.name}</h3>
            <p>{digimon.description}</p>
            <button onClick={() => updateDigimon(digimon._id, { ...digimon, name: 'Updated Name' })}>
              Update
            </button>
            <button onClick={() => deleteDigimon(digimon._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
