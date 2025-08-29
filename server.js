
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

// Booking endpoints
app.post('/api/bookings', requireAuth, (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests, totalPrice } = req.body;

    const listing = listings.find(l => l._id === parseInt(listingId));
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflictingBooking = bookings.find(booking => {
      if (booking.listingId !== parseInt(listingId) || booking.status !== 'confirmed') return false;

      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);

      return (checkInDate < existingCheckOut && checkOutDate > existingCheckIn);
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Selected dates are not available' });
    }

    const newBooking = {
      _id: nextBookingId++,
      listingId: parseInt(listingId),
      userId: req.user._id,
      listingTitle: listing.title,
      checkIn,
      checkOut,
      guests: guests || 1,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);

    saveData({
      listings,
      purchases,
      users,
      chats,
      bookings,
      reviews,
      sessions: Array.from(sessions.entries()),
      nextId,
      nextPurchaseId,
      nextUserId,
      nextChatId,
      nextBookingId
    });

    res.json({ success: true, booking: newBooking });
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
