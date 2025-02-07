// src/pages/AdminPage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminPage.css'; // Optional: for styling
import MenuBar from '../components/MenuBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AdminPage() {
  const [digimons, setDigimons] = useState([]);
  const [newDigimon, setNewDigimon] = useState({
    name: '',
    attribute: '',
    level: '',
    type: '',
    image: null
  });
  const [editingDigimon, setEditingDigimon] = useState(null);
  const formRef = useRef(null);

  //  Fetch Digimon data from the server
  useEffect(() => {
    axios.get('http://localhost:3001/api/items')
      .then(response => {
        setDigimons(response.data)
      })
      .catch(error => console.log('UseEffect is not working well', error));
  }, []);



  // Add a new Digimon
  const addDigimon = () => {
    // Trim whitespace from inputs
    const trimmedName = newDigimon.name.trim();

    // Validate empty fields
    if (!trimmedName || !newDigimon.attribute || !newDigimon.level || !newDigimon.type) {
      toast.error('Please fill in all fields before adding a Digimon.');
      return;
    }

    // Prevent duplicate Digimon names (case-insensitive)
    if (digimons.some(d => d.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('This Digimon already exists.');
      return;
    }

    // Validate image type (only JPG & PNG allowed)
    if (newDigimon.image && !['image/jpeg', 'image/png', 'image/webp'].includes(newDigimon.image.type)) {
      toast.error('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }

    // Validate image size (max 2MB)
    if (newDigimon.image && newDigimon.image.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    // Create FormData for sending to backend
    const formData = new FormData();
    formData.append('name', trimmedName);
    formData.append('attribute', newDigimon.attribute);
    formData.append('level', newDigimon.level);
    formData.append('type', newDigimon.type);
    if (newDigimon.image) {
      formData.append('image', newDigimon.image);
    }

    // Send request to backend
    axios.post('http://localhost:3001/api/digimons', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(response => {
        setDigimons([response.data, ...digimons]);
        setNewDigimon({ name: '', attribute: '', level: '', type: '', image: null });
        toast.success('Digimon added successfully!');
      })
      .catch(error => {
        console.error('Error adding Digimon:', error);
        toast.error('Error adding Digimon. Please try again.');
      });
  };

  // Update an existing Digimon
  const updateDigimon = () => {
    if (!editingDigimon) return;

    const formData = new FormData();
    formData.append('name', editingDigimon.name.trim());
    formData.append('attribute', editingDigimon.attribute);
    formData.append('level', editingDigimon.level);
    formData.append('type', editingDigimon.type);

    if (editingDigimon.image) {
      formData.append('image', editingDigimon.image);
    }

    axios
      .put(`http://localhost:3001/api/digimons/${editingDigimon._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((response) => {
        setDigimons(digimons.map(d => (d._id === editingDigimon._id ? response.data : d)));
        setEditingDigimon(null); // Clear edit state
        toast.success('Digimon updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating Digimon:', error);
        toast.error('Error updating Digimon. Please try again.');
      });
  };


  // Delete a Digimon
  const deleteDigimon = (id) => {
    axios.delete(`http://localhost:3001/api/digimons/${id}`)
      .then(() => {
        setDigimons(digimons.filter(digimon => digimon._id !== id));
        toast.success("Digimon deleted successfully!");
      })
      .catch(error => {
        toast.error('Error deleting digimon!');

      });
  };

    // Scroll to the form when an "Edit" button is clicked
    const handleEditClick = (digimon) => {
      setEditingDigimon(digimon);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  

  return (
    <>
      <MenuBar />
      <ToastContainer />
      <div className="admin-page">
        <h1>Admin Page</h1>
        <div ref={formRef} className="add-digimon">
          <h2>Add Digimon</h2>
          <input
            type="text"
            placeholder="Name"
            value={editingDigimon ? editingDigimon.name : newDigimon.name}
            onChange={(e) =>
              editingDigimon
                ? setEditingDigimon({ ...editingDigimon, name: e.target.value })
                : setNewDigimon({ ...newDigimon, name: e.target.value })
            }
          />
          <select
            value={editingDigimon ? editingDigimon.attribute : newDigimon.attribute}
            onChange={(e) => editingDigimon ? setEditingDigimon({ ...editingDigimon, attribute: e.target.value }) : setNewDigimon({ ...newDigimon, attribute: e.target.value })}
          >
            <option value="">Select Attribute</option>
            <option value="Vaccine">Vaccine</option>
            <option value="Virus">Virus</option>
            <option value="Data">Data</option>
            <option value="Free">Free</option>
          </select>
          <select
            value={editingDigimon ? editingDigimon.level : newDigimon.level}
            onChange={(e) => editingDigimon ? setEditingDigimon({...editingDigimon, level: e.target.value}) : setNewDigimon({ ...newDigimon, level: e.target.value })}
          >
            <option value="">Select Level</option>
            <option value="Rookie">Rookie</option>
            <option value="Champion">Champion</option>
            <option value="Ultimate">Ultimate</option>
            <option value="Mega">Mega</option>
          </select>
          <select
            value={editingDigimon ? editingDigimon.type : newDigimon.type}
            onChange={(e) => editingDigimon ? setEditingDigimon({...editingDigimon, type: e.target.value }): setNewDigimon({ ...newDigimon, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Dragon">Dragon</option>
            <option value="Beast">Beast</option>
            <option value="Aquatic">Aquatic</option>
            <option value="Bird">Bird</option>
          </select>
          <input
            type="file"
            onChange={(e) => { editingDigimon ? setEditingDigimon({...editingDigimon, image: e.target.files[0]}):
              setNewDigimon({ ...newDigimon, image: e.target.files[0] })
            }}
          />
          <button onClick={editingDigimon ? updateDigimon : addDigimon}>
            {editingDigimon ? 'Update' : 'Add'}
          </button>
        </div>
        <h2>Digimon List</h2>
        <div className="list-column">
          {digimons.map((digimon) => (
            <div className='list-item' key={digimon._id}>
              <p>{digimon.name}</p>
              <div className='edit-delete'>
                <p onClick={() => handleEditClick(digimon)}>Edit</p>
                <p onClick={() => deleteDigimon(digimon._id)}>Delete</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

  );
}

export default AdminPage;
