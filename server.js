
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public'), {
  index: ['index.html'],
  extensions: ['html', 'htm']
}));

// File-based storage for listings and purchases
const fs = require('fs');
const DATA_FILE = './data.json';

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

// Geocoding simulation function
function geocodeAddress(address) {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        const char = address.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    const lat = 25 + (Math.abs(hash % 1000) / 1000) * 25;
    const lng = -125 + (Math.abs((hash >> 10) % 1000) / 1000) * 60;

    return { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
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
let reviews = data.reviews || [];

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
    sessions: Array.from(sessions.entries()),
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
    const { title, address, country, price, description, amenities, contact, ethiopianLocation } = req.body;
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
      ethiopianLocation: ethiopianLocation ? JSON.parse(ethiopianLocation) : null,
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

// Get listings with coordinates
app.get('/api/listings', (req, res) => {
    try {
        const data = loadData(); // Use loadData to get the current state
        let listingsData = data.listings || listings || [];
        
        // Handle sorting if requested
        const { _sort, _order } = req.query;
        if (_sort) {
            listingsData.sort((a, b) => {
                if (_sort === 'newest') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                } else if (_sort === 'oldest') {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                } else if (_sort === 'price') {
                    return _order === 'desc' ? b.price - a.price : a.price - b.price;
                }
                return 0;
            });
        }
        
        const listingsWithCoords = listingsData.map(listing => ({
            ...listing,
            coordinates: listing.coordinates || geocodeAddress(listing.address || '')
        }));
        res.json(listingsWithCoords);
    } catch (error) {
        console.error('Error reading listings:', error);
        res.status(500).json({ error: 'Internal server error', listings: [] });
    }
});

// Secure Payment Processing
app.post('/api/process-payment', requireAuth, (req, res) => {
  try {
    const { amount, cardNumber, expiryDate, cvv, cardholderName } = req.body;

    // Validate card number (simplified)
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return res.status(400).json({ error: 'Invalid card number' });
    }

    // Validate expiry date
    const [month, year] = expiryDate.split('/');
    const expiryMonth = parseInt(month);
    const expiryYear = parseInt('20' + year);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return res.status(400).json({ error: 'Card has expired' });
    }

    // Validate CVV
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      return res.status(400).json({ error: 'Invalid CVV' });
    }

    // Simulate payment processing (in real app, use Stripe/PayPal)
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (!paymentSuccess) {
      return res.status(400).json({ error: 'Payment declined. Please check your card details.' });
    }

    const paymentId = 'pay_' + Date.now() + Math.random().toString(36).substr(2);

    res.json({
      success: true,
      paymentId,
      amount,
      last4: cardNumber.slice(-4),
      message: 'Payment processed successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchases', requireAuth, (req, res) => {
  try {
    const { listingId, paymentId, totalAmount, checkIn, checkOut } = req.body;

    // Find the listing
    const listing = listings.find(l => l._id == listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Create purchase record
    const newPurchase = {
      _id: nextPurchaseId++,
      listingId: parseInt(listingId),
      userId: req.user._id,
      listing: {
        title: listing.title,
        address: listing.address,
        country: listing.country,
        price: listing.price
      },
      buyer: {
        firstName: req.user.firstName || req.user.username,
        lastName: req.user.lastName || '',
        email: req.user.email,
        username: req.user.username
      },
      payment: {
        paymentId,
        amount: totalAmount,
        status: 'completed'
      },
      booking: {
        checkIn,
        checkOut
      },
      purchaseDate: new Date().toISOString(),
      status: 'confirmed'
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

    res.json({ 
      success: true, 
      purchaseId: newPurchase._id,
      message: 'Booking confirmed successfully'
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

app.get('/view.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route for SPA - must be before admin endpoints
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Try to serve static file first
  const filePath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // Default to index.html for unknown routes
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin endpoints
app.get('/api/admin/users', requireAuth, requireAdmin, (req, res) => {
  try {
    const safeUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/users/:id/role', requireAuth, requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userIndex = users.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].role = role;

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

    res.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/users/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId === req.user._id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const userIndex = users.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    // Remove user's sessions
    for (let [sessionId, sessionUser] of sessions.entries()) {
      if (sessionUser._id === userId) {
        sessions.delete(sessionId);
      }
    }

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

    res.json({ success: true, message: 'User deleted successfully', deletedUser: { username: deletedUser.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/clear-data', requireAuth, requireAdmin, (req, res) => {
  try {
    // Keep only admin users
    users = users.filter(u => u.role === 'admin');
    listings = [];
    purchases = [];
    chats = [];
    bookings = [];

    // Reset IDs
    nextId = 1;
    nextPurchaseId = 1;
    nextChatId = 1;
    nextBookingId = 1;

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

    res.json({ success: true, message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/export-data', requireAuth, requireAdmin, (req, res) => {
  try {
    const exportData = {
      listings,
      purchases: purchases.map(p => ({ ...p, payment: undefined })), // Remove payment info for security
      users: users.map(u => ({ ...u, password: undefined })), // Remove passwords
      chats,
      bookings,
      exportDate: new Date().toISOString()
    };
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoints
app.get('/api/chats/:listingId/messages', requireAuth, (req, res) => {
  try {
    const listingId = parseInt(req.params.listingId);
    const chatMessages = chats.filter(chat => chat.listingId === listingId)
                              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json(chatMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chats/:listingId/messages', requireAuth, (req, res) => {
  try {
    const listingId = parseInt(req.params.listingId);
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const newChat = {
      _id: nextChatId++,
      listingId,
      userId: req.user._id,
      username: req.user.username,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    chats.push(newChat);

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

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is working',
    listingsCount: listings.length,
    usersCount: users.length
  });
});

// Authentication endpoints
app.post('/api/register', (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate age (must be 18+)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        return res.status(400).json({ error: 'You must be at least 18 years old to register' });
      }
    }

    // Create new user
    const newUser = {
      _id: nextUserId++,
      firstName,
      lastName,
      email,
      dateOfBirth,
      username,
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

// Username suggestions endpoint
app.post('/api/suggest-usernames', (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const emailPrefix = email.split('@')[0];

    const suggestions = [
      `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      `${emailPrefix}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
      `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
      `${lastName.toLowerCase()}${firstName.charAt(0).toLowerCase()}`,
    ].filter((suggestion, index, arr) => arr.indexOf(suggestion) === index)
     .filter(suggestion => !users.find(u => u.username === suggestion))
     .slice(0, 5);

    res.json({ suggestions });
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

// Payment and Booking System

// Get available dates for a listing
app.get('/api/listings/:id/availability', (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    const listing = listings.find(l => l._id === listingId);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Get all confirmed bookings for this listing
    const confirmedBookings = bookings.filter(b => 
      b.listingId === listingId && b.status === 'confirmed'
    );

    const unavailableDates = [];
    confirmedBookings.forEach(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        unavailableDates.push(d.toISOString().split('T')[0]);
      }
    });

    res.json({ 
      unavailableDates,
      minStay: listing.minStay || 1,
      maxStay: listing.maxStay || 30,
      basePrice: listing.price
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate booking price
app.post('/api/calculate-price', (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;
    
    const listing = listings.find(l => l._id === parseInt(listingId));
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    const basePrice = listing.price;
    const subtotal = basePrice * nights;
    const serviceFee = Math.round(subtotal * 0.15); // 15% service fee
    const cleaningFee = 50; // Fixed cleaning fee
    const taxes = Math.round((subtotal + serviceFee) * 0.08); // 8% taxes
    const total = subtotal + serviceFee + cleaningFee + taxes;

    res.json({
      nights,
      basePrice,
      subtotal,
      serviceFee,
      cleaningFee,
      taxes,
      total,
      breakdown: {
        basePrice: `$${basePrice} x ${nights} nights`,
        serviceFee: 'Service fee (15%)',
        cleaningFee: 'Cleaning fee',
        taxes: 'Taxes (8%)'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent (simulated Stripe)
app.post('/api/create-payment-intent', requireAuth, (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Simulate Stripe payment intent creation
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      created: Math.floor(Date.now() / 1000)
    };

    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment (simulated)
app.post('/api/confirm-payment', requireAuth, (req, res) => {
  try {
    const { paymentIntentId, paymentMethod } = req.body;

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate

    if (!success) {
      return res.status(400).json({ 
        error: 'Payment failed',
        code: 'card_declined'
      });
    }

    const confirmedPayment = {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: req.body.amount,
      charges: {
        data: [{
          id: `ch_${Date.now()}`,
          payment_method_details: {
            card: {
              brand: paymentMethod.card?.brand || 'visa',
              last4: paymentMethod.card?.last4 || '4242'
            }
          }
        }]
      }
    };

    res.json(confirmedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking with payment
app.post('/api/bookings', requireAuth, (req, res) => {
  try {
    const { 
      listingId, 
      checkIn, 
      checkOut, 
      guests, 
      totalPrice,
      paymentIntentId,
      guestInfo,
      specialRequests 
    } = req.body;

    const listing = listings.find(l => l._id === parseInt(listingId));
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Check availability
    const conflictingBooking = bookings.find(booking => {
      if (booking.listingId !== parseInt(listingId) || booking.status !== 'confirmed') return false;

      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);

      return (checkInDate < existingCheckOut && checkOutDate > existingCheckIn);
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Selected dates are not available' });
    }

    // Validate guest count
    const maxGuests = listing.maxGuests || 4;
    if (guests > maxGuests) {
      return res.status(400).json({ error: `Maximum ${maxGuests} guests allowed` });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const bookingNumber = `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const newBooking = {
      _id: nextBookingId++,
      bookingNumber,
      listingId: parseInt(listingId),
      userId: req.user._id,
      listing: {
        id: listing._id,
        title: listing.title,
        address: listing.address,
        images: listing.images,
        hostName: listing.contact?.name || 'Host'
      },
      guest: {
        id: req.user._id,
        name: guestInfo?.name || req.user.username,
        email: guestInfo?.email || req.user.email,
        phone: guestInfo?.phone || ''
      },
      checkIn,
      checkOut,
      nights,
      guests: parseInt(guests),
      pricing: {
        basePrice: listing.price,
        subtotal: listing.price * nights,
        serviceFee: Math.round(listing.price * nights * 0.15),
        cleaningFee: 50,
        taxes: Math.round((listing.price * nights + Math.round(listing.price * nights * 0.15)) * 0.08),
        total: totalPrice
      },
      payment: {
        paymentIntentId,
        status: 'completed',
        method: 'card'
      },
      specialRequests: specialRequests || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      confirmationSent: true
    };

    bookings.push(newBooking);

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
      booking: newBooking,
      message: 'Booking confirmed successfully!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
app.get('/api/my-bookings', requireAuth, (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.user._id)
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking details
app.get('/api/bookings/:id', requireAuth, (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = bookings.find(b => b._id === bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking or is the property owner or admin
    const listing = listings.find(l => l._id === booking.listingId);
    if (booking.userId !== req.user._id && 
        listing?.createdBy !== req.user._id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking
app.post('/api/bookings/:id/cancel', requireAuth, (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { reason } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b._id === bookingId);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[bookingIndex];

    // Check if user can cancel
    if (booking.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only cancel your own bookings' });
    }

    // Check cancellation policy
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    let refundAmount = 0;
    let cancellationFee = 0;

    if (hoursUntilCheckIn >= 48) {
      refundAmount = booking.pricing.total * 0.9; // 90% refund
      cancellationFee = booking.pricing.total * 0.1;
    } else if (hoursUntilCheckIn >= 24) {
      refundAmount = booking.pricing.total * 0.5; // 50% refund
      cancellationFee = booking.pricing.total * 0.5;
    } else {
      refundAmount = 0; // No refund
      cancellationFee = booking.pricing.total;
    }

    // Update booking
    bookings[bookingIndex] = {
      ...booking,
      status: 'cancelled',
      cancellation: {
        cancelledAt: new Date().toISOString(),
        reason: reason || 'No reason provided',
        refundAmount,
        cancellationFee,
        processedBy: req.user._id
      }
    };

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
      booking: bookings[bookingIndex],
      refundAmount,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Host's bookings management
app.get('/api/host/bookings', requireAuth, (req, res) => {
  try {
    // Get all listings owned by the user
    const hostListings = listings.filter(l => l.createdBy === req.user._id);
    const hostListingIds = hostListings.map(l => l._id);

    // Get all bookings for host's properties
    const hostBookings = bookings.filter(b => hostListingIds.includes(b.listingId))
                               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(hostBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment methods management
app.get('/api/payment-methods', requireAuth, (req, res) => {
  try {
    // Simulate saved payment methods
    const paymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        billing_details: {
          name: req.user.username
        }
      }
    ];

    res.json({ data: paymentMethods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add payment method
app.post('/api/payment-methods', requireAuth, (req, res) => {
  try {
    const { cardNumber, expMonth, expYear, cvc, name } = req.body;

    // Validate card
    if (!cardNumber || cardNumber.length < 13) {
      return res.status(400).json({ error: 'Invalid card number' });
    }

    const paymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'card',
      card: {
        brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
        last4: cardNumber.slice(-4),
        exp_month: parseInt(expMonth),
        exp_year: parseInt(expYear)
      },
      billing_details: {
        name: name || req.user.username
      }
    };

    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server - bind to 0.0.0.0 for Replit
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HomeHatch server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Browse Properties: http://localhost:${PORT}/view.html`);
  console.log(`Admin credentials: admin/admin123`);
});
