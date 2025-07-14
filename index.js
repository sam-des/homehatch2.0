// HomeHatch: A simple rental listing app
// React frontend + Express backend (MERN-style layout)

// ===== 📁 BACKEND: /backend/server.js =====
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/homehatch', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const listingSchema = new mongoose.Schema({
  title: String,
  address: String,
  price: Number,
  description: String,
  amenities: [String],
  images: [String],
});

const Listing = mongoose.model('Listing', listingSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/api/listings', upload.array('images', 5), async (req, res) => {
  const { title, address, price, description, amenities } = req.body;
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

  const newListing = new Listing({
    title,
    address,
    price,
    description,
    amenities: JSON.parse(amenities),
    images: imagePaths,
  });
  await newListing.save();
  res.json(newListing);
});

app.get('/api/listings', async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// ===== 📁 FRONTEND: /src/App.js =====
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    description: '',
    amenities: '',
    images: [],
  });
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/listings').then(res => setListings(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    for (let i = 0; i < formData.images.length; i++) {
      data.append('images', formData.images[i]);
    }
    data.append('title', formData.title);
    data.append('address', formData.address);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('amenities', JSON.stringify(formData.amenities.split(',')));

    await axios.post('http://localhost:5000/api/listings', data);
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">HomeHatch - List Your Rental</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="amenities" placeholder="Amenities (comma-separated)" onChange={handleChange} required />
        <input type="file" multiple onChange={handleFileChange} required />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">Submit Listing</button>
      </form>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">Current Listings</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {listings.map(listing => (
          <div key={listing._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{listing.title}</h3>
            <p>{listing.address} • ${listing.price}</p>
            <p>{listing.description}</p>
            <ul>
              {listing.amenities.map((a, idx) => (
                <li key={idx}>✔ {a}</li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {listing.images.map((src, i) => (
                <img key={i} src={`http://localhost:5000${src}`} alt="house" className="h-32 w-full object-cover" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


// ===== 📁 STYLING: /src/App.css =====
body {
  font-family: 'Inter', sans-serif;
  background: #f9fafb;
  margin: 0;
  padding: 0;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  width: 100%;
}

button {
  cursor: pointer;
}
