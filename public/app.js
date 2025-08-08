
let listings = [];
let currentUser = null;
let sessionId = null;
let isGuest = false;
let currentLanguage = 'en';
let currentImageZoom = 1;

// Language translations
const translations = {
    en: {
        welcome: 'Welcome',
        admin: 'ADMIN', 
        myListings: 'My Listings',
        changePassword: 'Change Password',
        accountSettings: 'Account Settings',
        adminPanel: 'Admin Panel',
        signOut: 'Sign Out',
        changeProfilePicture: 'Change Profile Picture'
    },
    fr: {
        welcome: 'Bienvenue',
        admin: 'ADMIN',
        myListings: 'Mes Annonces', 
        changePassword: 'Changer le Mot de Passe',
        accountSettings: 'Paramètres du Compte',
        adminPanel: 'Panneau Admin',
        signOut: 'Déconnexion',
        changeProfilePicture: 'Changer la Photo de Profil'
    }
};

function t(key) {
    return translations[currentLanguage][key] || translations.en[key] || key;
}

// Load listings when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language preference
    currentLanguage = localStorage.getItem('language') || 'en';
    
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

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        // Update top-right user section with profile dropdown
        const topRightUserSection = document.getElementById('topRightUserSection');
        if (topRightUserSection) {
            topRightUserSection.classList.remove('hidden');
            topRightUserSection.innerHTML = `
                <div class="relative">
                    <button id="profileBtn" class="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-white border-opacity-30">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden">
                            ${currentUser.profilePicture ? 
                                `<img src="${currentUser.profilePicture}" alt="Profile" class="w-full h-full object-cover">` :
                                `<div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">${currentUser.username.charAt(0).toUpperCase()}</div>`
                            }
                        </div>
                        <span class="hidden md:block">${currentUser.username}</span>
                        <svg class="w-4 h-4 transition-transform duration-200" id="profileArrow" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    
                    <div id="profileDropdown" class="hidden absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style="z-index: 99999;">
                        <div class="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 rounded-full overflow-hidden">
                                    ${currentUser.profilePicture ? 
                                        `<img src="${currentUser.profilePicture}" alt="Profile" class="w-full h-full object-cover">` :
                                        `<div class="w-full h-full bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">${currentUser.username.charAt(0).toUpperCase()}</div>`
                                    }
                                </div>
                                <div>
                                    <h3 class="font-semibold text-lg">${currentUser.username}</h3>
                                    <p class="text-sm opacity-90">${currentUser.email}</p>
                                    ${currentUser.role === 'admin' ? `<span class="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mt-1">${t('admin')}</span>` : '<span class="inline-block bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold mt-1">User</span>'}
                                </div>
                            </div>
                        </div>
                        
                        <div class="py-2">
                            <button onclick="changeProfilePicture()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                <span class="text-purple-500 text-lg">📷</span>
                                <span class="text-gray-700">${t('changeProfilePicture')}</span>
                            </button>
                            <button onclick="viewMyListings()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                <span class="text-green-500 text-lg">📝</span>
                                <span class="text-gray-700">${t('myListings')}</span>
                            </button>
                            <button onclick="showChangePasswordModal()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                <span class="text-blue-500 text-lg">🔐</span>
                                <span class="text-gray-700">${t('changePassword')}</span>
                            </button>
                            <button onclick="viewAccountSettings()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                <span class="text-gray-500 text-lg">⚙️</span>
                                <span class="text-gray-700">${t('accountSettings')}</span>
                            </button>
                            ${currentUser.role === 'admin' ? `
                            <hr class="my-2 border-gray-200">
                            <button onclick="viewAdminPanel()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                                <span class="text-yellow-500 text-lg">👑</span>
                                <span class="text-gray-700">${t('adminPanel')}</span>
                            </button>
                            ` : ''}
                            <hr class="my-2 border-gray-200">
                            <button onclick="logout()" class="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600">
                                <span class="text-lg">🚪</span>
                                <span>${t('signOut')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        setupProfileDropdown();
        setupLanguageSelector();
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

function setupLanguageSelector() {
    const topLanguageSelector = document.getElementById('topLanguageSelector');
    if (topLanguageSelector) {
        topLanguageSelector.value = currentLanguage;
        topLanguageSelector.addEventListener('change', function(e) {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            
            // Update all UI elements with new language
            updateLanguageStrings();
            updateAuthUI();
            renderListings();
        });
    }
}

function updateLanguageStrings() {
    // Update header subtitle based on user state
    const headerSubtitle = document.getElementById('headerSubtitle');
    if (headerSubtitle) {
        if (currentUser) {
            headerSubtitle.textContent = currentLanguage === 'fr' ? 
                'Listez votre propriété locative facilement' : 
                'List your rental property with ease';
        } else if (isGuest) {
            headerSubtitle.textContent = currentLanguage === 'fr' ? 
                'Parcourir les propriétés locatives (Mode Invité)' : 
                'Browse rental properties (Guest Mode)';
        } else {
            headerSubtitle.textContent = currentLanguage === 'fr' ? 
                'Parcourir les propriétés locatives' : 
                'Browse rental properties';
        }
    }
    
    // Update guest notice
    const guestNotice = document.getElementById('guestNotice');
    if (guestNotice && !guestNotice.classList.contains('hidden')) {
        guestNotice.innerHTML = currentLanguage === 'fr' ? 
            `<p class="text-blue-800 text-center">
                <span class="font-semibold">👋 Navigation en tant qu'invité</span> - 
                <button onclick="showLoginModal()" class="underline hover:text-blue-600">Connexion</button> ou 
                <button onclick="showRegisterModal()" class="underline hover:text-blue-600">Inscription</button> 
                pour voir les détails de contact et créer des annonces
            </p>` :
            `<p class="text-blue-800 text-center">
                <span class="font-semibold">👋 Browsing as Guest</span> - 
                <button onclick="showLoginModal()" class="underline hover:text-blue-600">Login</button> or 
                <button onclick="showRegisterModal()" class="underline hover:text-blue-600">Register</button> 
                to see contact details and create listings
            </p>`;
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
                    <img src="${listing.images[0]}" alt="Property image" class="w-full h-full object-cover cursor-pointer" onclick="openImageGallery('${listing._id}', ${JSON.stringify(listing.images).replace(/"/g, '&quot;')})">
                    ${listing.images.length > 1 ? `
                        <div class="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                            +${listing.images.length - 1} photos
                        </div>
                    ` : ''}
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

                <div class="mb-4">
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
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="text-2xl font-bold text-green-600">
                        $${listing.price}/mo
                    </div>
                    <div class="flex space-x-2">
                        ${currentUser && !isGuest ? `
                            <button onclick="openBookingModal('${listing._id}', '${listing.title}', ${listing.price})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                                📅 Book
                            </button>
                            <button onclick="openChatModal('${listing._id}', '${listing.title}')" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                                💬 Chat
                            </button>
                        ` : ''}
                        ${canDeleteListing(listing) ? `
                            <button onclick="deleteListing('${listing._id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
                                🗑️
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
    
    // Setup character counter for description
    const descriptionField = document.getElementById('description');
    const descriptionCount = document.getElementById('descriptionCount');
    
    descriptionField.addEventListener('input', function() {
        const currentLength = this.value.length;
        descriptionCount.textContent = currentLength;
        
        if (currentLength > 450) {
            descriptionCount.style.color = 'red';
        } else {
            descriptionCount.style.color = '#6b7280';
        }
    });
    
    // Setup photo limit validation
    const imagesInput = document.getElementById('images');
    imagesInput.addEventListener('change', function() {
        if (this.files.length > 5) {
            alert('You can only upload a maximum of 5 images');
            this.value = '';
        }
    });

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
        <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">👑 Admin Panel</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 class="font-semibold text-blue-800 mb-2">📊 Statistics</h3>
                        <p class="text-sm text-blue-600">Total Listings: ${listings.length}</p>
                        <p class="text-sm text-blue-600">Your Listings: ${listings.filter(l => l.createdBy === currentUser._id).length}</p>
                    </div>
                    
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 class="font-semibold text-green-800 mb-2">👥 User Management</h3>
                        <button onclick="loadAllUsers()" class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors">
                            View All Users
                        </button>
                    </div>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 class="font-semibold text-yellow-800 mb-2">🏠 Listing Management</h3>
                        <button onclick="moderateListings()" class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors">
                            Moderate Listings
                        </button>
                    </div>
                </div>

                <div id="adminContent" class="mb-6">
                    <!-- Dynamic content will load here -->
                </div>
                
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 class="font-semibold text-red-800 mb-2">⚠️ Admin Actions</h3>
                    <p class="text-sm text-red-600 mb-3">Use these features carefully. They affect all users.</p>
                    <div class="space-x-2">
                        <button onclick="clearAllData()" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors">
                            Clear All Data
                        </button>
                        <button onclick="exportData()" class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors">
                            Export Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function loadAllUsers() {
    try {
        const response = await axios.get('/api/admin/users');
        const users = response.data;
        
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">👥 All Users</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-4 py-2 text-left">Username</th>
                                <th class="px-4 py-2 text-left">Email</th>
                                <th class="px-4 py-2 text-left">Role</th>
                                <th class="px-4 py-2 text-left">Created</th>
                                <th class="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="px-4 py-2">${user.username}</td>
                                    <td class="px-4 py-2">${user.email}</td>
                                    <td class="px-4 py-2">
                                        <select onchange="changeUserRole('${user._id}', this.value)" class="text-sm border rounded px-2 py-1">
                                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                        </select>
                                    </td>
                                    <td class="px-4 py-2">${new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td class="px-4 py-2">
                                        ${user._id !== currentUser._id ? `
                                            <button onclick="deleteUser('${user._id}', '${user.username}')" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                                Delete
                                            </button>
                                        ` : '<span class="text-gray-400 text-xs">Current User</span>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        alert('Error loading users: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function changeUserRole(userId, newRole) {
    try {
        await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
        alert('User role updated successfully');
    } catch (error) {
        alert('Error updating user role: ' + (error.response?.data?.error || 'Unknown error'));
        loadAllUsers(); // Reload to revert the select
    }
}

async function deleteUser(userId, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        await axios.delete(`/api/admin/users/${userId}`);
        alert('User deleted successfully');
        loadAllUsers(); // Reload the user list
    } catch (error) {
        alert('Error deleting user: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

function moderateListings() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">🏠 Listing Moderation</h3>
            <div class="grid gap-4">
                ${listings.map(listing => `
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold">${listing.title}</h4>
                                <p class="text-sm text-gray-600">${listing.address}</p>
                                <p class="text-sm text-gray-500">Created: ${new Date(listing.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deleteListing('${listing._id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function clearAllData() {
    if (!confirm('Are you sure you want to clear ALL data? This will delete all listings, users (except admin), and purchases. This action cannot be undone.')) {
        return;
    }
    
    try {
        await axios.post('/api/admin/clear-data');
        alert('All data cleared successfully');
        loadListings(); // Reload listings
    } catch (error) {
        alert('Error clearing data: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function exportData() {
    try {
        const response = await axios.get('/api/admin/export-data');
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `homehatch-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        alert('Error exporting data: ' + (error.response?.data?.error || 'Unknown error'));
    }
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

function changeProfilePicture() {
    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">📷 ${t('changeProfilePicture')}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <form id="profilePictureForm" class="space-y-4">
                    <div class="text-center mb-4">
                        <div class="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                            ${currentUser.profilePicture ? 
                                `<img src="${currentUser.profilePicture}" alt="Current Profile" class="w-full h-full object-cover">` :
                                `<div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">${currentUser.username.charAt(0).toUpperCase()}</div>`
                            }
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select New Profile Picture</label>
                        <input id="profilePictureInput" type="file" accept="image/*" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                            Upload Picture
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
    document.getElementById('profilePictureForm').addEventListener('submit', handleProfilePictureUpload);
}

async function handleProfilePictureUpload(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('profilePictureInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    try {
        const response = await axios.post('/api/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (response.data.success) {
            currentUser.profilePicture = response.data.profilePictureUrl;
            updateAuthUI();
            alert('Profile picture updated successfully!');
            document.querySelector('.fixed').remove();
        }
    } catch (error) {
        alert('Error uploading profile picture: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

// Image Gallery Functions
function openImageGallery(listingId, images) {
    currentImageZoom = 1;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="max-w-4xl w-full relative">
            <button onclick="closeImageGallery()" class="absolute top-4 right-4 text-white text-3xl z-10 hover:text-red-400 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center">×</button>
            <div class="relative overflow-hidden rounded-lg">
                <img id="galleryImage" src="${images[0]}" alt="Property image" class="w-full h-auto max-h-[80vh] object-contain transition-transform duration-200" style="transform: scale(${currentImageZoom})">
                <div class="absolute top-1/2 left-4 transform -translate-y-1/2">
                    <button onclick="previousImage()" class="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 text-xl">‹</button>
                </div>
                <div class="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <button onclick="nextImage()" class="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 text-xl">›</button>
                </div>
                <div class="absolute top-4 left-4 flex flex-col space-y-2">
                    <button onclick="zoomIn()" class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 text-lg w-10 h-10 flex items-center justify-center">+</button>
                    <button onclick="zoomOut()" class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 text-lg w-10 h-10 flex items-center justify-center">-</button>
                    <button onclick="resetZoom()" class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 text-xs w-10 h-10 flex items-center justify-center">1:1</button>
                </div>
            </div>
            <div class="flex justify-center mt-4 space-x-2">
                ${images.map((img, index) => 
                    `<img src="${img}" alt="Thumbnail" class="w-16 h-16 object-cover rounded cursor-pointer border-2 ${index === 0 ? 'border-white' : 'border-transparent'}" onclick="showImage(${index})">`
                ).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Store images for navigation
    window.currentGalleryImages = images;
    window.currentImageIndex = 0;
}

function closeImageGallery() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-90');
    if (modal) {
        modal.remove();
    }
    currentImageZoom = 1;
}

function zoomIn() {
    if (currentImageZoom < 3) {
        currentImageZoom += 0.25;
        updateImageZoom();
    }
}

function zoomOut() {
    if (currentImageZoom > 0.5) {
        currentImageZoom -= 0.25;
        updateImageZoom();
    }
}

function resetZoom() {
    currentImageZoom = 1;
    updateImageZoom();
}

function updateImageZoom() {
    const galleryImage = document.getElementById('galleryImage');
    if (galleryImage) {
        galleryImage.style.transform = `scale(${currentImageZoom})`;
    }
}

function previousImage() {
    if (window.currentImageIndex > 0) {
        window.currentImageIndex--;
        showImage(window.currentImageIndex);
    }
}

function nextImage() {
    if (window.currentImageIndex < window.currentGalleryImages.length - 1) {
        window.currentImageIndex++;
        showImage(window.currentImageIndex);
    }
}

function showImage(index) {
    window.currentImageIndex = index;
    document.getElementById('galleryImage').src = window.currentGalleryImages[index];
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.fixed img[onclick*="showImage"]');
    thumbnails.forEach((thumb, i) => {
        thumb.className = `w-16 h-16 object-cover rounded cursor-pointer border-2 ${i === index ? 'border-white' : 'border-transparent'}`;
    });
}

// Booking Functions
function openBookingModal(listingId, title, price) {
    if (!currentUser) {
        alert('Please login to make a booking');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">📅 Book Property</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <div class="mb-4">
                    <h3 class="font-semibold text-lg">${title}</h3>
                    <p class="text-green-600 font-bold">$${price}/month</p>
                </div>
                
                <form id="bookingForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                        <input type="date" id="checkInDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                        <input type="date" id="checkOutDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <span>Total Cost:</span>
                            <span id="totalCost" class="font-bold text-green-600">$0</span>
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition-colors">
                            Confirm Booking
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-semibold transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup booking form
    setupBookingForm(listingId, price);
}

function setupBookingForm(listingId, dailyPrice) {
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');
    const totalCostSpan = document.getElementById('totalCost');
    const bookingForm = document.getElementById('bookingForm');
    
    const calculateTotal = () => {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        
        if (checkIn && checkOut && checkOut > checkIn) {
            const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const total = days * (dailyPrice / 30); // Convert monthly to daily rate
            totalCostSpan.textContent = `$${total.toFixed(2)}`;
        } else {
            totalCostSpan.textContent = '$0';
        }
    };
    
    checkInInput.addEventListener('change', () => {
        checkOutInput.min = checkInInput.value;
        calculateTotal();
    });
    
    checkOutInput.addEventListener('change', calculateTotal);
    
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const totalPrice = parseFloat(totalCostSpan.textContent.replace('$', ''));
        
        try {
            const response = await axios.post('/api/bookings', {
                listingId,
                checkIn,
                checkOut,
                totalPrice
            });
            
            if (response.data.success) {
                alert('Booking confirmed successfully!');
                document.querySelector('.fixed').remove();
            }
        } catch (error) {
            alert('Booking failed: ' + (error.response?.data?.error || 'Unknown error'));
        }
    });
}

// Chat Functions
let currentChatListingId = null;
let chatRefreshInterval = null;

function openChatModal(listingId, listingTitle) {
    if (!currentUser) {
        alert('Please login to chat');
        return;
    }

    currentChatListingId = listingId;

    const modal = document.createElement('div');
    modal.id = 'chatModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full h-96 flex flex-col">
            <div class="p-4 border-b flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">💬 Chat: ${listingTitle}</h2>
                <button onclick="closeChatModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>

            <div id="chatMessages" class="flex-1 overflow-y-auto p-4 space-y-3">
                <div class="text-center text-gray-500">Loading messages...</div>
            </div>

            <div class="p-4 border-t">
                <div class="flex space-x-2">
                    <input id="chatInput" type="text" placeholder="Type your message..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button onclick="sendChatMessage()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadChatMessages();

    // Auto-refresh messages every 3 seconds
    chatRefreshInterval = setInterval(loadChatMessages, 3000);

    // Focus on input
    document.getElementById('chatInput').focus();

    // Handle Enter key to send message
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function closeChatModal() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.remove();
    }

    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }

    currentChatListingId = null;
}

async function loadChatMessages() {
    if (!currentChatListingId) return;

    try {
        const response = await axios.get(`/api/chats/${currentChatListingId}/messages`);
        const messages = response.data;

        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) return;

        if (messages.length === 0) {
            chatContainer.innerHTML = '<div class="text-center text-gray-500">No messages yet. Start the conversation!</div>';
            return;
        }

        chatContainer.innerHTML = messages.map(msg => `
            <div class="flex ${msg.userId === currentUser._id ? 'justify-end' : 'justify-start'}">
                <div class="max-w-xs lg:max-w-md ${msg.userId === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-3 py-2">
                    <div class="text-xs opacity-75 mb-1">${msg.username}</div>
                    <div class="text-sm">${msg.message}</div>
                    <div class="text-xs opacity-60 mt-1">${new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || !currentChatListingId) return;

    try {
        await axios.post(`/api/chats/${currentChatListingId}/messages`, { message });
        input.value = '';
        loadChatMessages(); // Refresh messages immediately
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
    }
}
