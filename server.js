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

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

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
    users: [
      {
        _id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@homehatch.com',
        createdAt: new Date()
      }
    ],
    sessions: [],
    chats: [],
    nextId: 1,
    nextPurchaseId: 1,
    nextUserId: 2,
    nextChatId: 1,
    bookings: [],
    nextBookingId: 1
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
let users = data.users || [];
let chats = data.chats || [];
let bookings = data.bookings || [];

// Ensure admin account exists
const adminExists = users.find(u => u.username === 'admin');
if (!adminExists) {
  users.push({
    _id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    isAdmin: true,
    email: 'admin@homehatch.com',
    createdAt: new Date()
  });

  // Save the updated data with admin account
  saveData({
    listings,
    purchases,
    users,
    chats: chats,
    bookings,
    sessions: [],
    nextId: data.nextId || 1,
    nextPurchaseId: data.nextPurchaseId || 1,
    nextUserId: data.nextUserId || 2,
    nextChatId: data.nextChatId || 1,
    nextBookingId: data.nextBookingId || 1
  });
}

// Simple session storage (in production, use Redis or database)
let sessions = new Map();
let nextId = data.nextId;
let nextPurchaseId = data.nextPurchaseId;
let nextUserId = data.nextUserId || 2;
let nextChatId = data.nextChatId || 1;
let nextBookingId = data.nextBookingId || 1;

// Authentication middleware
function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.user = sessions.get(sessionId);
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// API Routes
app.post('/api/listings', requireAuth, upload.array('images', 5), (req, res) => {
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
      createdBy: req.user._id,
    };

    listings.push(newListing);

    // Save to file
    saveData({
      listings,
      purchases,
      users,
      chats,
      bookings,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
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
      users,
      chats,
      bookings,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
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

app.delete('/api/listings/:id', requireAuth, (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    const listing = listings.find(l => l._id === listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if user owns the listing or is admin
    if (listing.createdBy !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    const listingIndex = listings.findIndex(l => l._id === listingId);
    const deletedListing = listings.splice(listingIndex, 1)[0];

    // Save to file
    saveData({
      listings,
      purchases,
      users,
      chats,
      bookings,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
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

// Authentication endpoints
app.post('/api/register', (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = {
      _id: nextUserId++,
      username,
      email,
      password, // In production, hash this password
      role: 'user',
      createdAt: new Date()
    };

    users.push(newUser);

    // Save to file
    saveData({
      listings,
      purchases,
      users,
      chats,
      bookings,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
    });

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2);
    sessions.set(sessionId, user);

    res.json({ 
      success: true, 
      sessionId, 
      user: { ...user, password: undefined, isAdmin: user.role === 'admin' } // Don't send password back
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json(req.user);
});

app.post('/api/logout', requireAuth, (req, res) => {
  const sessionId = req.headers['x-session-id'];
  sessions.delete(sessionId);
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Find user and verify current password
    const userIndex = users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1 || users[userIndex].password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    users[userIndex].password = newPassword;

    // Update session with new user data
    const sessionId = req.headers['x-session-id'];
    sessions.set(sessionId, users[userIndex]);

    // Save to file
    saveData({
      listings,
      purchases,
      users,
      chats,
      bookings,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/my-purchases', requireAuth, (req, res) => {
  try {
    // For now, return empty array since we don't have user-specific purchase tracking
    // In a real app, you'd filter purchases by user ID
    const userPurchases = purchases.filter(purchase => 
      purchase.buyer && purchase.buyer.email === req.user.email
    );
    res.json(userPurchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile-picture', requireAuth, upload.single('profilePicture'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const profilePictureUrl = `/uploads/${req.file.filename}`;

    // Update user's profile picture
    const userIndex = users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].profilePicture = profilePictureUrl;

    // Update session with new user data
    const sessionId = req.headers['x-session-id'];
    sessions.set(sessionId, users[userIndex]);

    // Save to file
    saveData({
      listings,
      purchases,
      users,
      chats,
      bookings,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
    });

    res.json({ 
      success: true, 
      profilePictureUrl,
      message: 'Profile picture updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});