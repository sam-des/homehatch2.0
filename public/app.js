let listings = [];
let currentUser = null;
let sessionId = null;

// Load listings when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadListings();
    setupImagePreview();
    setupAuthForms();
    setupForm();
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
            updateAuthUI();
        } catch (error) {
            // Session invalid, clear it
            localStorage.removeItem('sessionId');
            sessionId = null;
            currentUser = null;
            updateAuthUI();
        }
    }
}

function updateAuthUI() {
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const welcomeText = document.getElementById('welcomeText');

    if (currentUser) {
        loginSection.classList.add('hidden');
        userSection.classList.remove('hidden');
        welcomeText.textContent = `Welcome, ${currentUser.username}${currentUser.role === 'admin' ? ' (Admin)' : ''}`;
    } else {
        loginSection.classList.remove('hidden');
        userSection.classList.add('hidden');
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
        updateAuthUI();
        loadListings(); // Reload to show delete buttons where appropriate
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
    updateAuthUI();
    loadListings(); // Reload to hide delete buttons
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

function setupImagePreview() {
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
                        <span class="font-semibold">Listed by:</span> ${listing.contact?.name || 'Anonymous'}
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