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
        userInfo.className = 'flex items-center space-x-4 user-info'; // Added user-info class
        userInfo.innerHTML = `
            <span class="text-white font-semibold">Welcome, ${currentUser.username}</span>
            ${currentUser.role === 'admin' ? '<span class="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">ADMIN</span>' : ''}
            <button onclick="logout()" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors">
                Logout
            </button>
        `;
        nav.appendChild(userInfo);
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
                        <div class="text-sm opacity-80">per month</div>
                    </div>
                </div>
            ` : `
                <div class="h-56 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center relative">
                    <span class="text-white text-8xl opacity-50">🏠</span>
                    <div class="absolute bottom-4 left-4 text-white">
                        <div class="text-3xl font-bold">$${listing.price}</div>
                        <div class="text-sm opacity-80">per month</div>
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