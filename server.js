const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for listings
let listings = [];
let nextId = 1;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// API Routes
app.post('/api/listings', upload.array('images', 5), (req, res) => {
  try {
    const { title, address, price, description, amenities, contact } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newListing = {
      _id: nextId++,
      title,
      address,
      price: parseFloat(price),
      description,
      amenities: JSON.parse(amenities),
      images: imagePaths,
      contact: JSON.parse(contact),
      createdAt: new Date(),
    };

    listings.push(newListing);
    res.json(newListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/listings', (req, res) => {
  try {
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});