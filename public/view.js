let allListings = [];
let filteredListings = [];
let currentUser = null;
let sessionId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadListings();
    setupSearch();
    setupPurchaseForm();
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
        } catch (error) {
            // Session invalid, clear it
            localStorage.removeItem('sessionId');
            sessionId = null;
            currentUser = null;
        }
    } else {
        window.location.href = '/login.html';
        return;
    }

    setupAuthenticatedApp();
}

function setupAuthenticatedApp() {
    updateHeader();
    //loadListings(); // Load listings is already called in document load
    //setupSearch(); // Setup search is already called in document load
    //setupPurchaseForm(); // Setup purchase form is already called in document load
    //setupScrollGradient(); // Setup scroll gradient is already called in document load
}


function updateHeader() {
    const nav = document.querySelector('nav');
    if (nav && currentUser) {
        // Clear existing user info if it exists
        let existingUserInfo = nav.querySelector('.user-info');
        if (existingUserInfo) {
            nav.removeChild(existingUserInfo);
        }

        const userInfo = document.createElement('div');
        userInfo.className = 'flex items-center space-x-4 user-info relative'; // Added user-info class and relative positioning
        userInfo.innerHTML = `
            <span class="text-white font-semibold">${t('welcome')}, ${currentUser.username}</span>
            ${currentUser.role === 'admin' ? `<span class="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">${t('admin')}</span>` : ''}
            <div class="relative" style="z-index: 9998;">
                <button id="profileBtn" class="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-white border-opacity-20">
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

                <div id="profileDropdown" class="hidden absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style="z-index: 9999;">
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
                            <span class="text-blue-500 text-lg">🏠</span>
                            <span class="text-gray-700">${t('myListings')}</span>
                        </button>
                        <button onclick="viewMyPurchases()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <span class="text-green-500 text-lg">💰</span>
                            <span class="text-gray-700">${t('myPurchases')}</span>
                        </button>
                        <button onclick="openProfilePictureModal()" class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <span class="text-purple-500 text-lg">📷</span>
                            <span class="text-gray-700">${t('changeProfilePicture')}</span>
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
        nav.appendChild(userInfo);

        // Add event listeners for profile dropdown
        setupProfileDropdown();
    }
}

async function logout() {
    try {
        await axios.post('/api/logout');
    } catch (error) {
        console.log('Logout error:', error);
    }

    localStorage.removeItem('sessionId');
    currentUser = null;
    sessionId = null;
    window.location.href = '/login.html';
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

async function loadListings() {
    try {
        const response = await axios.get('/api/listings');
        allListings = response.data;
        filteredListings = [...allListings];
        renderListings();
    } catch (error) {
        console.error('Error loading listings:', error);
        document.getElementById('listings').innerHTML = '<div class="col-span-full text-center text-red-500">Error loading listings. Please try again later.</div>';
    }
}

function renderListings() {
    const listingsContainer = document.getElementById('listings');

    if (filteredListings.length === 0) {
        listingsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500">No rentals found matching your criteria.</div>';
        return;
    }

    listingsContainer.innerHTML = filteredListings.map(listing => `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden card-hover animate-fade-in">
            ${listing.images.length > 0 ? `
                <div class="relative h-56 bg-gradient-to-r from-blue-400 to-purple-500">
                    <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black from-opacity-50 to-transparent"></div>
                    ${listing.images.length > 1 ? `<div class="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">+${listing.images.length - 1} photos</div>` : ''}
                    <div class="absolute bottom-4 left-4 text-white">
                        <div class="text-3xl font-bold">$${listing.price}</div>
                        <div class="text-sm opacity-80">${t('perMonth')}</div>
                    </div>
                </div>
            ` : `
                <div class="h-56 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center relative">
                    <span class="text-white text-8xl opacity-50">🏠</span>
                    <div class="absolute bottom-4 left-4 text-white">
                        <div class="text-3xl font-bold">$${listing.price}</div>
                        <div class="text-sm opacity-80">${t('perMonth')}</div>
                    </div>
                </div>
            `}

            <div class="p-6">
                <div class="mb-4">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${listing.title}</h3>
                    <p class="text-gray-600 flex items-center">
                        <span class="text-lg mr-2">📍</span>
                        ${listing.address}
                    </p>
                    <p class="text-gray-500 flex items-center text-sm mt-1">
                        <span class="text-sm mr-2">🌍</span>
                        ${listing.country}
                    </p>
                </div>

                <p class="text-gray-700 mb-6 leading-relaxed">${listing.description}</p>

                <div class="mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                        <span class="text-lg mr-2">✨</span>
                        Amenities
                    </h4>
                    <div class="flex flex-wrap gap-2">
                        ${listing.amenities.map(amenity => `
                            <span class="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">${amenity.trim()}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                        <span class="text-lg mr-2">👤</span>
                        Contact Information
                    </h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center">
                            <span class="font-medium text-gray-700 w-16">Name:</span>
                            <span class="text-gray-600">${listing.contact?.name || 'Not provided'}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium text-gray-700 w-16">Email:</span>
                            ${listing.contact?.email ? `<a href="mailto:${listing.contact.email}" class="text-blue-600 hover:text-blue-800 transition-colors">${listing.contact.email}</a>` : '<span class="text-gray-600">Not provided</span>'}
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium text-gray-700 w-16">Phone:</span>
                            ${listing.contact?.phone ? `<a href="tel:${listing.contact.phone}" class="text-blue-600 hover:text-blue-800 transition-colors">${listing.contact.phone}</a>` : '<span class="text-gray-600">Not provided</span>'}
                        </div>
                    </div>
                </div>

                <div class="flex space-x-2">
                    <button onclick="viewDetails('${listing._id}')" class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm">
                        👁️ Details
                    </button>
                    <button onclick="openChatModal('${listing._id}', '${listing.title}')" class="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm">
                        💬 Chat
                    </button>
                    <button onclick="openPurchaseModal('${listing._id}', '${listing.title}', ${listing.price})" class="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg text-sm">
                        💰 Purchase
                    </button>
                    ${listing.contact?.email ? `<button onclick="contactSeller('${listing.contact.email}', '${listing.title}')" class="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg text-sm">📧 Contact</button>` : ''}
                    ${canDeleteListing(listing) ? `<button onclick="deleteListing(${listing._id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl font-semibold transition-colors shadow-lg text-sm">
                        🗑️
                    </button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchTitle = document.getElementById('searchTitle');
    const searchLocation = document.getElementById('searchLocation');
    const maxPrice = document.getElementById('maxPrice');
    const minPrice = document.getElementById('minPrice');

    searchBtn.addEventListener('click', performSearch);
    clearBtn.addEventListener('click', clearFilters);

    // Add Enter key listeners for text inputs
    [searchTitle, searchLocation, maxPrice, minPrice].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    });

    // Add change listeners for dropdowns to auto-search
    document.getElementById('countryFilter').addEventListener('change', performSearch);
    document.getElementById('amenityFilter').addEventListener('change', performSearch);
    document.getElementById('sortFilter').addEventListener('change', performSearch);
}

function performSearch() {
    const titleQuery = document.getElementById('searchTitle').value.toLowerCase();
    const locationQuery = document.getElementById('searchLocation').value.toLowerCase();
    const countryFilter = document.getElementById('countryFilter').value;
    const amenityFilter = document.getElementById('amenityFilter').value.toLowerCase();
    const minPriceValue = parseFloat(document.getElementById('minPrice').value);
    const maxPriceValue = parseFloat(document.getElementById('maxPrice').value);
    const sortBy = document.getElementById('sortFilter').value;

    // Filter listings
    filteredListings = allListings.filter(listing => {
        const matchesTitle = !titleQuery || listing.title.toLowerCase().includes(titleQuery);
        const matchesLocation = !locationQuery || 
            listing.address.toLowerCase().includes(locationQuery) ||
            listing.country.toLowerCase().includes(locationQuery);
        const matchesCountry = !countryFilter || listing.country.toLowerCase().includes(countryFilter.toLowerCase());
        const matchesAmenity = !amenityFilter || 
            listing.amenities.some(amenity => amenity.toLowerCase().includes(amenityFilter));
        const matchesMinPrice = !minPriceValue || listing.price >= minPriceValue;
        const matchesMaxPrice = !maxPriceValue || listing.price <= maxPriceValue;

        return matchesTitle && matchesLocation && matchesCountry && 
               matchesAmenity && matchesMinPrice && matchesMaxPrice;
    });

    // Sort listings
    switch(sortBy) {
        case 'newest':
            filteredListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filteredListings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'price-low':
            filteredListings.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredListings.sort((a, b) => b.price - a.price);
            break;
        case 'title':
            filteredListings.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    renderListings();
}

function clearFilters() {
    document.getElementById('searchTitle').value = '';
    document.getElementById('searchLocation').value = '';
    document.getElementById('countryFilter').value = '';
    document.getElementById('amenityFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortFilter').value = 'newest';

    filteredListings = [...allListings];
    performSearch(); // Apply default sorting
}

function viewDetails(listingId) {
    const listing = allListings.find(l => l._id === listingId);
    if (!listing) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold">${listing.title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                ${listing.images.length > 0 ? `
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        ${listing.images.map(src => `
                            <img src="${src}" alt="Property image" class="w-full h-32 object-cover rounded">
                        `).join('')}
                    </div>
                ` : ''}

                <div class="space-y-4">
                    <div><strong>Address:</strong> ${listing.address}</div>
                    <div><strong>Country:</strong> ${listing.country}</div>
                    <div><strong>Price:</strong> $${listing.price}</div>
                    <div><strong>Description:</strong> ${listing.description}</div>
                    <div>
                        <strong>Amenities:</strong>
                        <ul class="list-disc list-inside mt-2">
                            ${listing.amenities.map(amenity => `<li>${amenity.trim()}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="border-t pt-4">
                        <strong>Contact Information:</strong>
                        <div class="mt-2 space-y-1">
                            <p>Name: ${listing.contact?.name || 'Not provided'}</p>
                            <p>Email: ${listing.contact?.email || 'Not provided'}</p>
                            <p>Phone: ${listing.contact?.phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function contactSeller(email, propertyTitle) {
    const subject = encodeURIComponent(`Inquiry about: ${propertyTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in your rental property "${propertyTitle}". Could you please provide more information?\n\nThanks!`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
}

function openPurchaseModal(listingId, title, price) {
    document.getElementById('purchasePropertyTitle').textContent = title;
    document.getElementById('purchasePropertyPrice').textContent = `$${price}/month`;
    document.getElementById('purchaseModal').classList.remove('hidden');

    // Store listing ID for form submission
    document.getElementById('purchaseForm').dataset.listingId = listingId;

    // Setup form handlers
    setupPurchaseForm();
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').classList.add('hidden');
    document.getElementById('purchaseForm').reset();
}

function setupPurchaseForm() {
    const form = document.getElementById('purchaseForm');

    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedInputValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedInputValue;
    });

    // Format expiry date input
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0,2) + '/' + value.substring(2,4);
        }
        e.target.value = value;
    });

    // CVV input restriction
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    form.removeEventListener('submit', handlePurchaseSubmit);
    form.addEventListener('submit', handlePurchaseSubmit);
}

async function handlePurchaseSubmit(e) {
    e.preventDefault();

    const formData = {
        listingId: e.target.dataset.listingId,
        buyer: {
            firstName: document.getElementById('buyerFirstName').value,
            lastName: document.getElementById('buyerLastName').value,
            age: parseInt(document.getElementById('buyerAge').value),
            email: document.getElementById('buyerEmail').value,
            phone: document.getElementById('buyerPhone').value,
            address: document.getElementById('buyerAddress').value
        },
        payment: {
            cardType: document.getElementById('cardType').value,
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
            cardholderName: document.getElementById('cardholderName').value
        },
        purchaseDate: new Date().toISOString()
    };

    try {
        const response = await axios.post('/api/purchases', formData);

        if (response.status === 200) {
            alert('🎉 Purchase completed successfully! You will receive a confirmation email shortly.');
            closePurchaseModal();
        }
    } catch (error) {
        console.error('Purchase error:', error);
        alert('❌ Purchase failed. Please check your information and try again.');
    }
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

let currentChatListingId = null;
let chatRefreshInterval = null;

function openChatModal(listingId, listingTitle) {
    if (!currentUser) {
        alert('Please login to chat with property owners');
        return;
    }

    currentChatListingId = listingId;

    const modal = document.createElement('div');
    modal.id = 'chatModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full h-96 flex flex-col">
            <div class="p-4 border-b flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800">💬 Chat about: ${listingTitle}</h2>
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
    filteredListings = allListings.filter(listing => listing.createdBy === currentUser._id);
    renderListings();

    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';

    // Scroll to listings
    document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });

    alert(`Showing ${filteredListings.length} of your listings`);
}

function viewMyPurchases() {
    // Close dropdown
    document.getElementById('profileDropdown').classList.add('hidden');
    document.getElementById('profileArrow').style.transform = 'rotate(0deg)';

    // Show purchases modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">💰 My Purchases</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div id="purchasesList" class="space-y-4">
                    <div class="text-center text-gray-500">Loading purchases...</div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadUserPurchases();
}

async function loadUserPurchases() {
    try {
        const response = await axios.get('/api/my-purchases');
        const purchases = response.data;

        const container = document.getElementById('purchasesList');
        if (!container) return;

        if (purchases.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500">No purchases yet.</div>';
            return;
        }

        container.innerHTML = purchases.map(purchase => `
            <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold text-lg text-gray-800">Purchase #${purchase._id}</h3>
                <p class="text-gray-600">Property: ${purchase.listingTitle || 'Unknown'}</p>
                <p class="text-gray-600">Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                <p class="text-green-600 font-semibold">Buyer: ${purchase.buyer.firstName} ${purchase.buyer.lastName}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading purchases:', error);
        const container = document.getElementById('purchasesList');
        if (container) {
            container.innerHTML = '<div class="text-center text-red-500">Error loading purchases.</div>';
        }
    }
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
                        <p class="text-sm text-blue-600">Total Listings: ${allListings.length}</p>
                        <p class="text-sm text-blue-600">Total Users: ${allListings.reduce((acc, listing) => acc + (listing.createdBy ? 1 : 0), 0)}</p>
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

// Function to include translation
function t(key) {
    const translations = {
        'perMonth': {
            'en': 'per month',
            'fr': 'par mois'
        },
        'welcome': {
            'en': 'Welcome',
            'fr': 'Bienvenue'
        },
        'admin': {
            'en': 'ADMIN',
            'fr': 'ADMIN'
        },
        'myListings': {
            'en': 'My Listings',
            'fr': 'Mes Annonces'
        },
        'myPurchases': {
            'en': 'My Purchases',
            'fr': 'Mes Achats'
        },
        'accountSettings': {
            'en': 'Account Settings',
            'fr': 'Paramètres du Compte'
        },
        'adminPanel': {
            'en': 'Admin Panel',
            'fr': 'Panneau Admin'
        },
        'signOut': {
            'en': 'Sign Out',
            'fr': 'Déconnexion'
        },
        'changeProfilePicture': {
            'en': 'Change Profile Picture',
            'fr': 'Changer la Photo de Profil'
        }
    };
    const lang = localStorage.getItem('language') || 'en';
    return translations[key] && translations[key][lang] ? translations[key][lang] : translations[key]['en'];
}

// Function to change language
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    renderListings();
    updateHeader();
}

// Call this function on the body of the html
function setupLanguageSwitcher() {
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'fixed bottom-4 left-4 bg-white bg-opacity-70 rounded-full shadow-lg z-50';
    languageSwitcher.innerHTML = `
        <button onclick="changeLanguage('en')" class="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">English</button>
        <button onclick="changeLanguage('fr')" class="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Français</button>
    `;
    document.body.appendChild(languageSwitcher);
}

// Modify setupAuthenticatedApp to include Language Switcher

function setupAuthenticatedApp() {
    updateHeader();
    setupLanguageSwitcher();
}
// Modify renderListings to use t() for translations

// Add the button to go back to the main page
function setupBottomButtons() {
    const bottomButtonsContainer = document.createElement('div');
    bottomButtonsContainer.className = 'fixed bottom-0 left-0 w-full bg-gray-100 py-4 border-t border-gray-200 flex justify-center';
    bottomButtonsContainer.innerHTML = `
        <button onclick="goToHomePage()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md">
            Return to Home Page
        </button>
    `;
    document.body.appendChild(bottomButtonsContainer);
}

function goToHomePage() {
    // Reload listings to go to the "home page"
    loadListings();

    // Scroll to listings
    document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadListings();
    setupSearch();
    setupPurchaseForm();
    setupScrollGradient();
    setupBottomButtons();
    setupLanguageSelector();
});

function setupLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        const currentLanguage = localStorage.getItem('language') || 'en';
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', function(e) {
            localStorage.setItem('language', e.target.value);
            // Reload page to apply language changes
            window.location.reload();
        });
    }
}

// Add profile picture option

// Account Settings Page

// Add a button to change profile picture in the Account Settings Modal

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
                        <button onclick="openProfilePictureModal()" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">
                            Change Profile Picture
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

function openProfilePictureModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">📸 Change Profile Picture</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <div class="space-y-4">
                    <p>Upload a new profile picture:</p>
                    <input type="file" id="profilePictureInput" accept="image/*">
                    <button onclick="uploadProfilePicture()" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">Upload</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

async function uploadProfilePicture() {
    const input = document.getElementById('profilePictureInput');
    const file = input.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
        const response = await axios.post('/api/upload-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            alert('Profile picture updated successfully!');
            // Optionally refresh the page or update the profile picture in the header
            window.location.reload();
        } else {
            alert('Failed to upload profile picture. Please try again.');
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture. Please try again.');
    }
}