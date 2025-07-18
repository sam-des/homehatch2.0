
let listings = [];
let currentUser = null;
let sessionId = null;
let isGuest = false;

// Load listings when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupAuthForms();
    setupScrollGradient();
});

// Set up axios interceptor to include session ID
axios.interceptors.request.use(function (config) {
    if (sessionId) {
        config.headers['x-session-id'] = sessionId;
    }
    return config;
});

async function checkAuth() {
    sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        try {
            const response = await axios.get('/api/me');
            currentUser = response.data;
            showMainApp();
            updateAuthUI();
            loadListings();
            setupForm();
        } catch (error) {
            // Session invalid, clear it
            localStorage.removeItem('sessionId');
            sessionId = null;
            currentUser = null;
            showWelcomeScreen();
        }
    } else {
        showWelcomeScreen();
    }
}

function showWelcomeScreen() {
    document.getElementById('welcomeScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

function browseAsGuest() {
    isGuest = true;
    showMainApp();
    updateAuthUI();
    loadListings();
    document.getElementById('headerSubtitle').textContent = 'Browse rental properties (Guest Mode)';
    document.getElementById('guestNotice').classList.remove('hidden');
}

function updateAuthUI() {
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const listPropertyBtn = document.getElementById('listPropertyBtn');

    if (currentUser) {
        loginSection.classList.add('hidden');
        userSection.classList.remove('hidden');
        listPropertyBtn.classList.remove('hidden');
        document.getElementById('headerSubtitle').textContent = 'List your rental property with ease';
        document.getElementById('guestNotice').classList.add('hidden');
        
        // Update user section with profile dropdown
        userSection.innerHTML = `
            <div class="relative">
                <button id="profileBtn" class="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-white border-opacity-20">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        ${currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span class="hidden md:block">${currentUser.username}</span>
                    <svg class="w-4 h-4 transition-transform duration-200" id="profileArrow" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
                
                <div id="profileDropdown" class="hidden absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div class="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                                ${currentUser.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg">${currentUser.username}</h3>
                                <p class="text-sm opacity-90">${currentUser.email}</p>
                                ${currentUser.role === 'admin' ? '<span class="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mt-1">Administrator</span>' : '<span class="inline-block bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold mt-1">User</span>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="py-2">
                        <button onclick="viewMyListings()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <span class="text-green-500 text-lg">📝</span>
                            <span class="text-gray-700">My Listings</span>
                        </button>
                        <button onclick="showChangePasswordModal()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <span class="text-blue-500 text-lg">🔐</span>
                            <span class="text-gray-700">Change Password</span>
                        </button>
                        <button onclick="viewAccountSettings()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <span class="text-gray-500 text-lg">⚙️</span>
                            <span class="text-gray-700">Account Settings</span>
                        </button>
                        ${currentUser.role === 'admin' ? `
                        <hr class="my-2 border-gray-200">
                        <button onclick="viewAdminPanel()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <span class="text-yellow-500 text-lg">👑</span>
                            <span class="text-gray-700">Admin Panel</span>
                        </button>
                        ` : ''}
                        <hr class="my-2 border-gray-200">
                        <button onclick="logout()" class="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600">
                            <span class="text-lg">🚪</span>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        setupProfileDropdown();
    } else if (isGuest) {
        loginSection.classList.remove('hidden');
        userSection.classList.add('hidden');
        listPropertyBtn.classList.add('hidden');
    } else {
        loginSection.classList.remove('hidden');
        userSection.classList.add('hidden');
        listPropertyBtn.classList.add('hidden');
    }
}

function setupAuthForms() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post('/api/login', { username, password });
        sessionId = response.data.sessionId;
        currentUser = response.data.user;
        localStorage.setItem('sessionId', sessionId);

        hideLoginModal();
        isGuest = false;
        showMainApp();
        updateAuthUI();
        loadListings();
        setupForm();
        alert('Login successful!');
    } catch (error) {
        alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await axios.post('/api/register', { username, email, password });
        hideRegisterModal();
        alert('Registration successful! You can now login.');
    } catch (error) {
        alert('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function logout() {
    try {
        await axios.post('/api/logout');
    } catch (error) {
        console.error('Logout error:', error);
    }

    localStorage.removeItem('sessionId');
    sessionId = null;
    currentUser = null;
    isGuest = false;
    showWelcomeScreen();
    alert('Logged out successfully!');
}

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.remove('hidden');
}

function hideRegisterModal() {
    document.getElementById('registerModal').classList.add('hidden');
    document.getElementById('registerForm').reset();
}

function showListingForm() {
    if (!currentUser) {
        alert('Please login to create a listing');
        showLoginModal();
        return;
    }
    
    const formSection = document.getElementById('listingFormSection');
    formSection.classList.toggle('hidden');
    
    if (!formSection.classList.contains('hidden')) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

async function loadListings() {
    try {
        const response = await axios.get('/api/listings');
        listings = response.data;
        renderListings();
    } catch (error) {
        console.error('Error loading listings:', error);
        if (error.response?.status === 401) {
            logout();
        }
    }
}

function renderListings() {
    const listingsContainer = document.getElementById('listings');

    if (listings.length === 0) {
        listingsContainer.innerHTML = '<p class="text-gray-500">No listings yet. Add the first one!</p>';
        return;
    }

    listingsContainer.innerHTML = listings.map(listing => `
        <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg card-hover overflow-hidden border border-gray-100">
            ${listing.images.length > 0 ? `
                <div class="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                    <img src="${listing.images[0]}" alt="Property image" class="w-full h-full object-cover">
                    <div class="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                        $${listing.price}/mo
                    </div>
                </div>
            ` : `
                <div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span class="text-white text-6xl">🏠</span>
                </div>
            `}

            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${listing.title}</h3>
                <p class="text-gray-600 mb-1 flex items-center">
                    <span class="text-sm mr-1">📍</span>
                    ${listing.address}
                </p>
                <p class="text-gray-500 mb-2 flex items-center text-sm">
                    <span class="mr-1">🌍</span>
                    ${listing.country}
                </p>
                <p class="text-gray-700 mb-4 text-sm leading-relaxed">${listing.description}</p>

                <div class="mb-4">
                    <h4 class="font-semibold text-gray-800 mb-2 flex items-center">
                        <span class="text-sm mr-1">✨</span>
                        Amenities
                    </h4>
                    <div class="flex flex-wrap gap-1">
                        ${listing.amenities.map(amenity => `
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${amenity.trim()}</span>
                        `).join('')}
                    </div>
                </div>

                ${listing.images.length > 1 ? `
                    <div class="grid grid-cols-3 gap-2 mb-4">
                        ${listing.images.slice(1, 4).map(src => `
                            <img src="${src}" alt="Property image" class="h-20 w-full object-cover rounded-lg">
                        `).join('')}
                    </div>
                ` : ''}

                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="text-sm text-gray-500">
                        ${currentUser || !isGuest ? `
                            <span class="font-semibold">Contact:</span> ${listing.contact?.name || 'Anonymous'}
                            ${listing.contact?.email ? `<br><span class="text-blue-600">${listing.contact.email}</span>` : ''}
                            ${listing.contact?.phone ? `<br><span class="text-green-600">${listing.contact.phone}</span>` : ''}
                        ` : `
                            <button onclick="showLoginModal()" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                                Login to see contact
                            </button>
                        `}
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl font-bold text-green-600">
                            $${listing.price}
                        </div>
                        ${canDeleteListing(listing) ? `
                            <button onclick="deleteListing('${listing._id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
                                🗑️ Delete
                            </button>
                        `: ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupForm() {
    const form = document.getElementById('listingForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!currentUser) {
            alert('Please login to create a listing');
            showLoginModal();
            return;
        }

        const formData = new FormData();
        const images = document.getElementById('images').files;

        // Add images to FormData
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        // Add other form fields
        formData.append('title', document.getElementById('title').value);
        formData.append('address', document.getElementById('address').value);
        formData.append('country', document.getElementById('country').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('amenities', JSON.stringify(
            document.getElementById('amenities').value.split(',').map(a => a.trim())
        ));
        formData.append('contact', JSON.stringify({
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value
        }));

        try {
            const response = await axios.post('/api/listings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Session-Id': localStorage.getItem('sessionId')
                }
            });

            // Reset form and reload listings
            form.reset();
            document.getElementById('listingFormSection').classList.add('hidden');
            await loadListings();
            alert('Listing added successfully!');
        } catch (error) {
            console.error('Error adding listing:', error);
            alert('Error adding listing. Please try again.');
        }
    });
}

function canDeleteListing(listing) {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || listing.createdBy === currentUser._id;
}

async function deleteListing(listingId) {
    if (!currentUser) {
        alert('Please login to delete listings');
        return;
    }

    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await axios.delete(`/api/listings/${listingId}`);

        if (response.data.success) {
            await loadListings();
            alert('Listing deleted successfully!');
        }
    } catch (error) {
        console.error('Error deleting listing:', error);
        const errorMsg = error.response?.data?.error || 'Error deleting listing. Please try again.';
        alert(errorMsg);
    }
}

function setupScrollGradient() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrolled / maxScroll, 1);

        // Interpolate from purple (#667eea, #764ba2) to red (#ff6b6b, #ee5a24)
        const startColor1 = { r: 102, g: 126, b: 234 }; // #667eea
        const startColor2 = { r: 118, g: 75, b: 162 };  // #764ba2
        const endColor1 = { r: 255, g: 107, b: 107 };   // #ff6b6b
        const endColor2 = { r: 238, g: 90, b: 36 };     // #ee5a24

        const color1 = {
            r: Math.round(startColor1.r + (endColor1.r - startColor1.r) * scrollProgress),
            g: Math.round(startColor1.g + (endColor1.g - startColor1.g) * scrollProgress),
            b: Math.round(startColor1.b + (endColor1.b - startColor1.b) * scrollProgress)
        };

        const color2 = {
            r: Math.round(startColor2.r + (endColor2.r - startColor2.r) * scrollProgress),
            g: Math.round(startColor2.g + (endColor2.g - startColor2.g) * scrollProgress),
            b: Math.round(startColor2.b + (endColor2.b - startColor2.b) * scrollProgress)
        };

        const gradient = `linear-gradient(135deg, rgb(${color1.r}, ${color1.g}, ${color1.b}) 0%, rgb(${color2.r}, ${color2.g}, ${color2.b}) 100%)`;
        document.body.style.background = gradient;
    });
}

function setupProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileArrow = document.getElementById('profileArrow');
    
    if (!profileBtn || !profileDropdown || !profileArrow) return;
    
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isHidden = profileDropdown.classList.contains('hidden');
        
        if (isHidden) {
            profileDropdown.classList.remove('hidden');
            profileArrow.style.transform = 'rotate(180deg)';
        } else {
            profileDropdown.classList.add('hidden');
            profileArrow.style.transform = 'rotate(0deg)';
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.add('hidden');
            profileArrow.style.transform = 'rotate(0deg)';
        }
    });
}

function viewMyListings() {
    // Filter listings to show only current user's listings
    const myListings = listings.filter(listing => listing.createdBy === currentUser._id);
    
    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';
    
    // Scroll to listings section
    document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
    
    alert(`You have ${myListings.length} listings. Scroll down to see them.`);
}

function viewAccountSettings() {
    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">⚙️ Account Settings</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-semibold text-gray-800 mb-2">Account Information</h3>
                        <p><strong>Username:</strong> ${currentUser.username}</p>
                        <p><strong>Email:</strong> ${currentUser.email}</p>
                        <p><strong>Role:</strong> ${currentUser.role}</p>
                        <p><strong>Member Since:</strong> ${new Date(currentUser.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="space-y-2">
                        <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                            Change Password
                        </button>
                        <button class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors">
                            Update Email
                        </button>
                        <button class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function viewAdminPanel() {
    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">👑 Admin Panel</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 class="font-semibold text-blue-800 mb-2">📊 Statistics</h3>
                        <p class="text-sm text-blue-600">Total Listings: ${listings.length}</p>
                        <p class="text-sm text-blue-600">Your Listings: ${listings.filter(l => l.createdBy === currentUser._id).length}</p>
                    </div>
                    
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 class="font-semibold text-green-800 mb-2">👥 User Management</h3>
                        <button class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors">
                            View All Users
                        </button>
                    </div>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 class="font-semibold text-yellow-800 mb-2">🏠 Listing Management</h3>
                        <button class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors">
                            Moderate Listings
                        </button>
                    </div>
                </div>
                
                <div class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 class="font-semibold text-red-800 mb-2">⚠️ Admin Actions</h3>
                    <p class="text-sm text-red-600 mb-3">Use these features carefully. They affect all users.</p>
                    <div class="space-x-2">
                        <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors">
                            Clear All Data
                        </button>
                        <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors">
                            Export Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showChangePasswordModal() {
    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">🔐 Change Password</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <form id="changePasswordForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                        <input type="password" id="currentPassword" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter current password">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <input type="password" id="newPassword" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter new password (min 6 characters)" minlength="6">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" id="confirmPassword" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm new password" minlength="6">
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                            Change Password
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup form handler
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long');
        return;
    }
    
    try {
        const response = await axios.post('/api/change-password', {
            currentPassword,
            newPassword
        });
        
        if (response.data.success) {
            alert('Password changed successfully!');
            document.querySelector('.fixed').remove();
        }
    } catch (error) {
        alert('Error changing password: ' + (error.response?.data?.error || 'Unknown error'));
    }
}
