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

// File-based storage for listings and purchases
const fs = require('fs');
const DATA_FILE = './data.json';

// Load data from file or initialize empty data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return data;
    }
  } catch (error) {
    console.log('Error loading data:', error);
  }
  
  return {
    listings: [],
    purchases: [],
    nextId: 1,
    nextPurchaseId: 1
  };
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Initialize data
let data = loadData();
let listings = data.listings;
let purchases = data.purchases;
let nextId = data.nextId;
let nextPurchaseId = data.nextPurchaseId;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// API Routes
app.post('/api/listings', upload.array('images', 5), (req, res) => {
  try {
    const { title, address, country, price, description, amenities, contact } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newListing = {
      _id: nextId++,
      title,
      address,
      country,
      price: parseFloat(price),
      description,
      amenities: JSON.parse(amenities),
      images: imagePaths,
      contact: JSON.parse(contact),
      createdAt: new Date(),
    };

    listings.push(newListing);
    
    // Save to file
    saveData({
      listings,
      purchases,
      nextId,
      nextPurchaseId
    });
    
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

app.post('/api/purchases', (req, res) => {
  try {
    const { listingId, buyer, payment, purchaseDate } = req.body;
    
    // Find the listing
    const listing = listings.find(l => l._id == listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Validate buyer age
    if (buyer.age < 18) {
      return res.status(400).json({ error: 'Buyer must be at least 18 years old' });
    }
    
    // Create purchase record (in real app, you'd process payment here)
    const newPurchase = {
      _id: nextPurchaseId++,
      listingId: parseInt(listingId),
      listing: {
        title: listing.title,
        address: listing.address,
        country: listing.country,
        price: listing.price
      },
      buyer: {
        firstName: buyer.firstName,
        lastName: buyer.lastName,
        age: buyer.age,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address
      },
      payment: {
        cardType: payment.cardType,
        cardLast4: payment.cardNumber.slice(-4), // Only store last 4 digits
        cardholderName: payment.cardholderName
      },
      purchaseDate: purchaseDate,
      status: 'completed'
    };
    
    purchases.push(newPurchase);
    
    // Save to file
    saveData({
      listings,
      purchases,
      nextId,
      nextPurchaseId
    });
    
    // In a real application, you would:
    // 1. Process the payment with a payment processor
    // 2. Send confirmation emails
    // 3. Update listing availability
    
    res.json({ 
      success: true, 
      purchaseId: newPurchase._id,
      message: 'Purchase completed successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/purchases', (req, res) => {
  try {
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/listings/:id', (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    const listingIndex = listings.findIndex(l => l._id === listingId);
    
    if (listingIndex === -1) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Remove the listing
    const deletedListing = listings.splice(listingIndex, 1)[0];
    
    // Save to file
    saveData({
      listings,
      purchases,
      nextId,
      nextPurchaseId
    });
    
    res.json({ success: true, message: 'Listing deleted successfully', deletedListing });
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