
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/homehatch', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Listing schema
const listingSchema = new mongoose.Schema({
  title: String,
  address: String,
  price: Number,
  description: String,
  amenities: [String],
  images: [String],
});

const Listing = mongoose.model('Listing', listingSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// API Routes
app.post('/api/listings', upload.array('images', 5), async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
