let allListings = [];
let filteredListings = [];
let currentUser = null;
let sessionId = null;
let currentImageZoom = 1;
let currentLanguage = 'en';
let currentCurrency = 'USD';
let exchangeRates = { USD: 1, ETB: 57.00 }; // Example rates, should be fetched dynamically

// Add Amharic language support
const translations = {
    'perMonth': {
        'en': 'per month',
        'am': 'በወር',
        'fr': 'par mois'
    },
    'welcome': {
        'en': 'Welcome',
        'am': 'እንኳን ደህና መጡ',
        'fr': 'Bienvenue'
    },
    'searchFiltersTitle': {
        'en': 'Search Filters',
        'am': 'የፍለጋ ማጣሪያዎች',
        'fr': 'Filtres de Recherche'
    },
    'applyFilters': {
        'en': 'Apply Filters',
        'am': 'ማጣሪያዎችን ተግብር',
        'fr': 'Appliquer les Filtres'
    },
    'contactInformation': {
        'en': 'Contact Information',
        'am': 'የመገናኛ መረጃ',
        'fr': 'Informations de Contact'
    },
    'address': {
        'en': 'Address',
        'am': 'አድራሻ',
        'fr': 'Adresse'
    },
    'country': {
        'en': 'Country',
        'am': 'አገር',
        'fr': 'Pays'
    },
    'city': {
        'en': 'City',
        'am': 'ከተማ',
        'fr': 'Ville'
    },
    'neighborhood': {
        'en': 'Neighborhood',
        'am': 'ሰፈር',
        'fr': 'Quartier'
    },
    'kebele': {
        'en': 'Kebele',
        'am': 'ቀበሌ',
        'fr': 'Kebele'
    },
    'price': {
        'en': 'Price',
        'am': 'ዋጋ',
        'fr': 'Prix'
    },
    'description': {
        'en': 'Description',
        'am': 'መግለጫ',
        'fr': 'Description'
    },
    'admin': {
        'en': 'ADMIN',
        'am': 'አስተዳዳሪ',
        'fr': 'ADMIN'
    },
    'myListings': {
        'en': 'My Listings',
        'am': 'የእኔ ማስታወቂያዎች',
        'fr': 'Mes Annonces'
    },
    'myPurchases': {
        'en': 'My Purchases',
        'am': 'የእኔ ግዢዎች',
        'fr': 'Mes Achats'
    },
    'accountSettings': {
        'en': 'Account Settings',
        'am': 'የመለያ ቅንብሮች',
        'fr': 'Paramètres du Compte'
    },
    'adminPanel': {
        'en': 'Admin Panel',
        'am': 'የአስተዳዳሪ ፓነል',
        'fr': 'Panneau Admin'
    },
    'signOut': {
        'en': 'Sign Out',
        'am': 'ውጣ',
        'fr': 'Déconnexion'
    },
    'changeProfilePicture': {
        'en': 'Change Profile Picture',
        'am': 'የመገለጫ ስዕል ቀይር',
        'fr': 'Changer la Photo de Profil'
    },
    'searchFilters': {
        'en': 'Search Filters',
        'am': 'የፍለጋ ማጣሪያዎች',
        'fr': 'Filtres de Recherche'
    },
    'searchByTitle': {
        'en': 'Search by title...',
        'am': 'በስም ይፈልጉ...',
        'fr': 'Rechercher par titre...'
    },
    'searchByLocation': {
        'en': 'Search by location...',
        'am': 'በቦታ ይፈልጉ...',
        'fr': 'Rechercher par lieu...'
    },
    'allCountries': {
        'en': 'All Countries',
        'am': 'ሁሉም አገሮች',
        'fr': 'Tous les Pays'
    },
    'minPrice': {
        'en': 'Min Price',
        'am': 'ዝቅተኛ ዋጋ',
        'fr': 'Prix Min'
    },
    'maxPrice': {
        'en': 'Max Price',
        'am': 'ከፍተኛ ዋጋ',
        'fr': 'Prix Max'
    },
    'amenities': {
        'en': 'Amenities',
        'am': 'መገልገያዎች',
        'fr': 'Équipements'
    },
    'anyAmenities': {
        'en': 'Any Amenities',
        'am': 'ማንኛውም መገልገያዎች',
        'fr': 'Tous Équipements'
    },
    'sortBy': {
        'en': 'Sort By',
        'am': 'በዚህ ደርድር',
        'fr': 'Trier Par'
    },
    'newestFirst': {
        'en': 'Newest First',
        'am': 'በአዲስ ቅደም ተከተል',
        'fr': 'Plus Récent'
    },
    'oldestFirst': {
        'en': 'Oldest First',
        'am': 'በአሮጌ ቅደም ተከተል',
        'fr': 'Plus Ancien'
    },
    'priceLowHigh': {
        'en': 'Price: Low to High',
        'am': 'ዋጋ: ዝቅተኛ-ከፍተኛ',
        'fr': 'Prix: Bas à Élevé'
    },
    'priceHighLow': {
        'en': 'Price: High to Low',
        'am': 'ዋጋ: ከፍተኛ-ዝቅተኛ',
        'fr': 'Prix: Élevé à Bas'
    },
    'titleAZ': {
        'en': 'Title A-Z',
        'am': 'ርዕስ: A-Z',
        'fr': 'Titre A-Z'
    },
    'applyFilters': {
        'en': 'Apply Filters',
        'am': 'ማጣሪያዎችን ተግብር',
        'fr': 'Appliquer les Filtres'
    },
    'clearAll': {
        'en': 'Clear All',
        'am': 'ሁሉንም ሰርዝ',
        'fr': 'Effacer Tout'
    },
    'details': {
        'en': 'Details',
        'am': 'ዝርዝሮች',
        'fr': 'Détails'
    },
    'virtualTour': {
        'en': 'Virtual Tour',
        'am': 'ምናባዊ ጉብኝት',
        'fr': 'Visite Virtuelle'
    },
    'chat': {
        'en': 'Chat',
        'am': 'ቻት',
        'fr': 'Discuter'
    },
    'save': {
        'en': 'Save',
        'am': 'አስቀምጥ',
        'fr': 'Sauvegarder'
    },
    'saved': {
        'en': 'Saved',
        'am': 'የተቀመጠ',
        'fr': 'Sauvegardé'
    },
    'schedule': {
        'en': 'Schedule',
        'am': 'ጊዜ ቀጠሮ',
        'fr': 'Planifier'
    },
    'apply': {
        'en': 'Apply',
        'am': 'አስገባ',
        'fr': 'Postuler'
    },
    'contact': {
        'en': 'Contact',
        'am': 'አግኙ',
        'fr': 'Contacter'
    },
    'findPerfectRental': {
        'en': 'Find your perfect rental home',
        'am': 'ፍጹም የኪራይ ቤትዎን ያግኙ',
        'fr': 'Trouvez votre maison de location parfaite'
    },
    'listProperty': {
        'en': 'List Property',
        'am': 'ንብረት አስመዝግቡ',
        'fr': 'Lister une Propriété'
    },
    'browseRentals': {
        'en': 'Browse Rentals',
        'am': 'የኪራይ ቤቶችን ይመልከቱ',
        'fr': 'Parcourir les Locations'
    },
    'mapView': {
        'en': 'Map View',
        'am': 'የካርታ እይታ',
        'fr': 'Vue Carte'
    },
    'legend': {
        'en': 'Legend',
        'am': 'አፈ ታሪክ',
        'fr': 'Légende'
    },
    'availableRentals': {
        'en': 'Available Rentals',
        'am': 'የሚገኙ ኪራዮች',
        'fr': 'Locations Disponibles'
    },
    'propertiesOnMap': {
        'en': 'Properties on Map',
        'am': 'በካርታው ላይ ያሉ ንብረቶች',
        'fr': 'Propriétés sur la Carte'
    },
    'month': {
        'en': 'month',
        'am': 'ወር',
        'fr': 'mois'
    },
    'viewFullDetails': {
        'en': 'View Full Details',
        'am': 'ሙሉ ዝርዝር ይመልከቱ',
        'fr': 'Voir Tous les Détails'
    },
    'currency': {
        'en': 'Currency',
        'am': 'ምንዛሬ',
        'fr': 'Currency'
    },
    'propertyType': {
        'en': 'Property Type',
        'am': 'የንብረት አይነት',
        'fr': 'Type de Propriété'
    },
    'apartment': {
        'en': 'Apartment',
        'am': 'አፓርትመንት',
        'fr': 'Appartement'
    },
    'house': {
        'en': 'House',
        'am': 'ቤት',
        'fr': 'Maison'
    },
    'condo': {
        'en': 'Condo',
        'am': 'ኮንዶ',
        'fr': 'Condo'
    },
    'studio': {
        'en': 'Studio',
        'am': 'ስቱዲዮ',
        'fr': 'Studio'
    },
    'loft': {
        'en': 'Loft',
        'am': 'ሎፍት',
        'fr': 'Loft'
    },
    'bedrooms': {
        'en': 'Bedrooms',
        'am': 'መኝታ ቤቶች',
        'fr': 'Chambres'
    },
    'bedroom': {
        'en': 'Bedroom',
        'am': 'መኝታ ቤት',
        'fr': 'Chambre'
    },
    'bathrooms': {
        'en': 'Bathrooms',
        'am': 'መታጠቢያ ቤቶች',
        'fr': 'Salles de bain'
    },
    'bathroom': {
        'en': 'Bathroom',
        'am': 'መታጠቢያ ቤት',
        'fr': 'Salle de bain'
    },
    'petFriendly': {
        'en': 'Pet Friendly',
        'am': 'ለቤት እንስሳት ተስማሚ',
        'fr': 'Animaux acceptés'
    },
    'selectCity': {
        'en': 'Select City',
        'am': 'ከተማ ምረጥ',
        'fr': 'Sélectionner une ville'
    },
    'selectNeighborhood': {
        'en': 'Select Neighborhood',
        'am': 'ሰፈር ምረጥ',
        'fr': 'Sélectionner un quartier'
    },
    'selectKebele': {
        'en': 'Select Kebele',
        'am': 'ቀበሌ ምረጥ',
        'fr': 'Sélectionner un kebele'
    }
};


document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadListings();
    setupSearch();
    setupPurchaseForm();
    setupScrollGradient();
    setupBottomButtons();
    setupLanguageSelector();
    setupCurrencyConverter();
    setupAIChatbot();
    setupMapView(); // Setup map view button


    // Update UI text after setup
    setTimeout(() => {
        updateAllUIText();
    }, 100);
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
            window.location.href = '/login.html';
            return;
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

        // Update top-right profile section instead of nav
        const topRightProfileSection = document.getElementById('topRightProfileSection');
        if (topRightProfileSection) {
            topRightProfileSection.classList.remove('hidden');
            topRightProfileSection.innerHTML = `
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
        }

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
        // The original API call was missing the sort parameter, which caused issues.
        // We'll add a default sort by date to ensure consistency and handle server-side sorting expectations.
        const response = await axios.get('/api/listings', {
            params: {
                sort: 'createdAt:desc' // Default sort by newest first
            }
        });
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
                    <div class="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">+${listing.images.length - 1} photos</div>
                    <div class="absolute bottom-4 left-4 text-white">
                        <div class="text-3xl font-bold" data-price="${listing.price}">${formatPrice(listing.price)}</div>
                        <div class="text-sm opacity-80">${t('perMonth')}</div>
                    </div>
                </div>
            ` : `
                <div class="h-56 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center relative">
                    <span class="text-white text-8xl opacity-50">🏠</span>
                    <div class="absolute bottom-4 left-4 text-white">
                        <div class="text-3xl font-bold" data-price="${listing.price}">${formatPrice(listing.price)}</div>
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
                    ${listing.city ? `<p class="text-gray-500 flex items-center text-sm mt-1">
                        <span class="text-sm mr-2">🏙️</span>
                        ${listing.city}
                    </p>` : ''}
                    ${listing.neighborhood ? `<p class="text-gray-500 flex items-center text-sm mt-1">
                        <span class="text-sm mr-2">🏘️</span>
                        ${listing.neighborhood}
                    </p>` : ''}
                    ${listing.kebele ? `<p class="text-gray-500 flex items-center text-sm mt-1">
                        <span class="text-sm mr-2">🏠</span>
                        ${listing.kebele}
                    </p>` : ''}
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

                <!-- Rating and Reviews -->
                <div class="mb-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <div class="flex">
                            ${generateStarRating(listing.rating || 4.5)}
                        </div>
                        <span class="text-sm text-gray-600">(${listing.reviewCount || 12} reviews)</span>
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${listing.available !== false ? '✅ Available' : '❌ Not Available'}</span>
                    </div>
                </div>

                <!-- Quick Features -->
                <div class="mb-4">
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span class="flex items-center">🛏️ ${listing.bedrooms || 2} bed</span>
                        <span class="flex items-center">🚿 ${listing.bathrooms || 1} bath</span>
                        <span class="flex items-center">📐 ${listing.sqft || 850} sqft</span>
                        ${listing.petFriendly ? '<span class="flex items-center text-green-600">🐕 Pet OK</span>' : ''}
                    </div>
                </div>

                <!-- Availability Status -->
                <div class="mb-4">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${listing.available !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${listing.available !== false ? '✅ Available Now' : '❌ Not Available'}
                    </span>
                    ${listing.moveInDate ? `<span class="text-xs text-gray-500 ml-2">Move-in: ${new Date(listing.moveInDate).toLocaleDateString()}</span>` : ''}
                </div>

                <div class="grid grid-cols-2 gap-2 mb-4">
                    <button onclick="viewDetails('${listing._id}')" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm">
                        👁️ ${t('details')}
                    </button>
                    <button onclick="startVirtualTour('${listing._id}')" class="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg text-sm">
                        🥽 ${t('virtualTour')}
                    </button>
                    <button onclick="openChatModal('${listing._id}', '${listing.title}')" class="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm">
                        💬 ${t('chat')}
                    </button>
                    <button onclick="addToFavorites('${listing._id}')" class="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm" id="fav-${listing._id}">
                        ${isInFavorites(listing._id) ? '❤️ ' + t('saved') : '🤍 ' + t('save')}
                    </button>
                    <button onclick="scheduleViewing('${listing._id}', '${listing.title}')" class="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg text-sm">
                        📅 ${t('schedule')}
                    </button>
                    <button onclick="openPurchaseModal('${listing._id}', '${listing.title}', ${listing.price})" class="bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg text-sm">
                        💰 ${t('apply')}
                    </button>
                    <button onclick="openReviewModal('${listing._id}', '${listing.title}')" class="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg text-sm">
                        ⭐ Review
                    </button>
                    ${listing.contact?.email ? `<button onclick="contactSeller('${listing.contact.email}', '${listing.title}')" class="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg text-sm">📧 ${t('contact')}</button>` : ''}
                    ${canDeleteListing(listing) ? `<button onclick="deleteListing('${listing._id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl font-semibold transition-colors shadow-lg text-sm">
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

    // Add advanced filters
    setupAdvancedFilters();
    setupMapView(); // Ensure map view button is set up
    setupSavedSearches();
}

function setupAdvancedFilters() {
    // Property type filter
    const propertyTypeFilter = document.createElement('select');
    propertyTypeFilter.id = 'propertyTypeFilter';
    propertyTypeFilter.className = 'px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    propertyTypeFilter.innerHTML = `
        <option value="">${t('propertyType')}</option>
        <option value="apartment">${t('apartment')}</option>
        <option value="house">${t('house')}</option>
        <option value="condo">${t('condo')}</option>
        <option value="studio">${t('studio')}</option>
        <option value="loft">${t('loft')}</option>
    `;

    // Bedrooms filter
    const bedroomsFilter = document.createElement('select');
    bedroomsFilter.id = 'bedroomsFilter';
    bedroomsFilter.className = 'px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    bedroomsFilter.innerHTML = `
        <option value="">${t('bedrooms')}</option>
        <option value="0">${t('studio')}</option>
        <option value="1">1 ${t('bedroom')}</option>
        <option value="2">2 ${t('bedrooms')}</option>
        <option value="3">3+ ${t('bedrooms')}</option>
    `;

    // Bathrooms filter
    const bathroomsFilter = document.createElement('select');
    bathroomsFilter.id = 'bathroomsFilter';
    bathroomsFilter.className = 'px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    bathroomsFilter.innerHTML = `
        <option value="">${t('bathrooms')}</option>
        <option value="1">1 ${t('bathroom')}</option>
        <option value="2">2 ${t('bathrooms')}</option>
        <option value="3">3+ ${t('bathrooms')}</option>
    `;

    // Pet-friendly filter
    const petFriendlyLabel = document.createElement('label');
    petFriendlyLabel.htmlFor = 'petFriendlyFilter';
    petFriendlyLabel.className = 'text-white flex items-center';
    petFriendlyLabel.innerHTML = `<input type="checkbox" id="petFriendlyFilter" class="mr-2"> 🐕 ${t('petFriendly')}`;

    // Add location filters for Ethiopia
    const cityFilter = document.createElement('select');
    cityFilter.id = 'cityFilter';
    cityFilter.className = 'px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    cityFilter.innerHTML = `
        <option value="">${t('selectCity')}</option>
        <option value="Addis Ababa">Addis Ababa</option>
        <option value="Adama">Adama</option>
        <option value="Mekelle">Mekelle</option>
        <option value="Bahir Dar">Bahir Dar</option>
        <option value="Hawassa">Hawassa</option>
    `;

    const neighborhoodFilter = document.createElement('select');
    neighborhoodFilter.id = 'neighborhoodFilter';
    neighborhoodFilter.className = 'px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    neighborhoodFilter.innerHTML = `
        <option value="">${t('selectNeighborhood')}</option>
        <option value="Bole">Bole</option>
        <option value="Gulele">Gulele</option>
        <option value="Arada">Arada</option>
        <option value="Lideta">Lideta</option>
        <option value="Kirkos">Kirkos</option>
    `;

    const kebeleFilter = document.createElement('select');
    kebeleFilter.id = 'kebeleFilter';
    kebeleFilter.className = 'px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
    kebeleFilter.innerHTML = `
        <option value="">${t('selectKebele')}</option>
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
    `;

    // Add to search container
    const searchContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
    if (searchContainer) {
        searchContainer.appendChild(propertyTypeFilter);
        searchContainer.appendChild(bedroomsFilter);
        searchContainer.appendChild(bathroomsFilter);
        searchContainer.appendChild(petFriendlyLabel);
        searchContainer.appendChild(cityFilter);
        searchContainer.appendChild(neighborhoodFilter);
        searchContainer.appendChild(kebeleFilter);

        // Add event listeners
        [propertyTypeFilter, bedroomsFilter, bathroomsFilter, petFriendlyFilter, cityFilter, neighborhoodFilter, kebeleFilter].forEach(filter => {
            filter.addEventListener('change', performSearch);
        });
    }
}

function performSearch() {
    const titleQuery = document.getElementById('searchTitle').value.toLowerCase();
    const locationQuery = document.getElementById('searchLocation').value.toLowerCase();
    const countryFilter = document.getElementById('countryFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const neighborhoodFilter = document.getElementById('neighborhoodFilter').value;
    const kebeleFilter = document.getElementById('kebeleFilter').value;
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
        const matchesCity = !cityFilter || listing.city.toLowerCase().includes(cityFilter.toLowerCase());
        const matchesNeighborhood = !neighborhoodFilter || listing.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase());
        const matchesKebele = !kebeleFilter || listing.kebele.toLowerCase().includes(kebeleFilter.toLowerCase());
        const matchesAmenity = !amenityFilter ||
            listing.amenities.some(amenity => amenity.toLowerCase().includes(amenityFilter));
        const matchesMinPrice = isNaN(minPriceValue) || listing.price >= minPriceValue;
        const matchesMaxPrice = isNaN(maxPriceValue) || listing.price <= maxPriceValue;


        // Advanced Filters
        const propertyTypeFilter = document.getElementById('propertyTypeFilter');
        const bedroomsFilter = document.getElementById('bedroomsFilter');
        const bathroomsFilter = document.getElementById('bathroomsFilter');
        const petFriendlyFilter = document.getElementById('petFriendlyFilter');

        const matchesPropertyType = !propertyTypeFilter || !propertyTypeFilter.value || listing.propertyType === propertyTypeFilter.value;
        const matchesBedrooms = !bedroomsFilter || !bedroomsFilter.value ||
            (bedroomsFilter.value === '3' ? (listing.bedrooms || 0) >= 3 : (listing.bedrooms || 0) == parseInt(bedroomsFilter.value));
        const matchesBathrooms = !bathroomsFilter || !bathroomsFilter.value ||
            (bathroomsFilter.value === '3' ? (listing.bathrooms || 0) >= 3 : (listing.bathrooms || 0) == parseInt(bathroomsFilter.value));
        const matchesPetFriendly = !petFriendlyFilter || !petFriendlyFilter.checked || listing.petFriendly;

        return matchesTitle && matchesLocation && matchesCountry && matchesCity && matchesNeighborhood && matchesKebele &&
               matchesAmenity && matchesMinPrice && matchesMaxPrice &&
               matchesPropertyType && matchesBedrooms && matchesBathrooms && matchesPetFriendly;
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
    updateMapView(); // Update map markers if map is open
}

function clearFilters() {
    document.getElementById('searchTitle').value = '';
    document.getElementById('searchLocation').value = '';
    document.getElementById('countryFilter').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('neighborhoodFilter').value = '';
    document.getElementById('kebeleFilter').value = '';
    document.getElementById('amenityFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortFilter').value = 'newest';
    if (document.getElementById('propertyTypeFilter')) document.getElementById('propertyTypeFilter').value = '';
    if (document.getElementById('bedroomsFilter')) document.getElementById('bedroomsFilter').value = '';
    if (document.getElementById('bathroomsFilter')) document.getElementById('bathroomsFilter').value = '';
    if (document.getElementById('petFriendlyFilter')) document.getElementById('petFriendlyFilter').checked = false;


    filteredListings = [...allListings];
    performSearch(); // Apply default sorting
}

function viewDetails(listingId) {
    const listing = allListings.find(l => l._id === listingId);
    if (!listing) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold">${listing.title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                ${listing.images.length > 0 ? `
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        ${listing.images.map((src, index) => `
                            <img src="${src}" alt="Property image" class="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" onclick="openImageGallery('${listing._id}', ${JSON.stringify(listing.images).replace(/"/g, '&quot;')}, ${index})">
                        `).join('')}
                    </div>
                ` : ''}

                <div class="space-y-4">
                    <div><strong>${t('address')}:</strong> ${listing.address}</div>
                    <div><strong>${t('country')}:</strong> ${listing.country}</div>
                    ${listing.city ? `<div><strong>${t('city')}:</strong> ${listing.city}</div>` : ''}
                    ${listing.neighborhood ? `<div><strong>${t('neighborhood')}:</strong> ${listing.neighborhood}</div>` : ''}
                    ${listing.kebele ? `<div><strong>${t('kebele')}:</strong> ${listing.kebele}</div>` : ''}
                    <div><strong>${t('price')}:</strong> <span data-price="${listing.price}">${formatPrice(listing.price)}</span></div>
                    <div><strong>${t('description')}:</strong> ${listing.description}</div>
                    <div>
                        <strong>${t('amenities')}:</strong>
                        <ul class="list-disc list-inside mt-2">
                            ${listing.amenities.map(amenity => `<li>${amenity.trim()}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="border-t pt-4">
                        <strong>${t('contactInformation')}:</strong>
                        <div class="mt-2 space-y-1">
                            <p>Name: ${listing.contact?.name || 'Not provided'}</p>
                            <p>Email: ${listing.contact?.email ? `<a href="mailto:${listing.contact.email}" class="text-blue-600 hover:text-blue-800 transition-colors">${listing.contact.email}</a>` : 'Not provided'}</p>
                            <p>Phone: ${listing.contact?.phone ? `<a href="tel:${listing.contact.phone}" class="text-blue-600 hover:text-blue-600 transition-colors">${listing.contact.phone}</a>` : 'Not provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Image Gallery Functions for view.js
function openImageGallery(listingId, images, startIndex = 0) {
    currentImageZoom = 1;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="max-w-4xl w-full relative">
            <button onclick="closeImageGallery()" class="absolute top-4 right-4 text-white text-3xl z-10 hover:text-red-400 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center">×</button>
            <div class="relative overflow-hidden rounded-lg">
                <img id="galleryImage" src="${images[startIndex]}" alt="Property image" class="w-full h-auto max-h-[80vh] object-contain transition-transform duration-200" style="transform: scale(${currentImageZoom})">
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
                    `<img src="${img}" alt="Thumbnail" class="w-16 h-16 object-cover rounded cursor-pointer border-2 ${index === startIndex ? 'border-white' : 'border-transparent'}" onclick="showImage(${index})">`
                ).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store images for navigation
    window.currentGalleryImages = images;
    window.currentImageIndex = startIndex;
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

    // Reset zoom when changing images
    currentImageZoom = 1;
    updateImageZoom();
}

function contactSeller(email, propertyTitle) {
    const subject = encodeURIComponent(`Inquiry about: ${propertyTitle}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in your rental property "${propertyTitle}". Could you please provide more information?\n\nThanks!`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
}

function openPurchaseModal(listingId, title, price) {
    document.getElementById('purchasePropertyTitle').textContent = title;
    document.getElementById('purchasePropertyPrice').textContent = formatPrice(price); // Use formatted price
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
    return translations[key] && translations[key][currentLanguage] ? translations[key][currentLanguage] : translations[key]['en'];
}

// Function to change language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update the language selector value
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = lang;
    }

    // Update all UI text immediately without reloading
    updateAllUIText();

    // Update profile dropdown if visible
    if (currentUser) {
        updateHeader();
    }
}

function updateAllUIText() {
    // Update header subtitle based on user state
    const headerSubtitle = document.getElementById('headerSubtitle');
    if (headerSubtitle) {
        if (currentUser) {
            headerSubtitle.textContent = t('findPerfectRental');
        } else {
            headerSubtitle.textContent = t('findPerfectRental');
        }
    }

    // Update all static text elements
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][currentLanguage]) {
            element.textContent = translations[key][currentLanguage];
        }
    });

    // Update form placeholders
    const searchTitle = document.getElementById('searchTitle');
    if (searchTitle) searchTitle.placeholder = t('searchByTitle');

    const searchLocation = document.getElementById('searchLocation');
    if (searchLocation) searchLocation.placeholder = t('searchByLocation');

    // Update dropdown options
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter && countryFilter.children[0]) {
        countryFilter.children[0].textContent = t('allCountries');
    }

    const amenityFilter = document.getElementById('amenityFilter');
    if (amenityFilter && amenityFilter.children[0]) {
        amenityFilter.children[0].textContent = t('anyAmenities');
    }

    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        const options = sortFilter.children;
        if (options[0]) options[0].textContent = t('newestFirst');
        if (options[1]) options[1].textContent = t('oldestFirst');
        if (options[2]) options[2].textContent = t('priceLowHigh');
        if (options[3]) options[3].textContent = t('priceHighLow');
        if (options[4]) options[4].textContent = t('titleAZ');
    }

    // Update buttons
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.innerHTML = `🔍 ${t('applyFilters')}`;

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.innerHTML = `🗑️ ${t('clearAll')}`;

    const mapToggleBtn = document.getElementById('mapToggleBtn');
    if (mapToggleBtn) mapToggleBtn.innerHTML = `🗺️ ${t('mapView')}`;

    // Re-render listings to update all listing text
    renderListings();
}

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

function setupLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        currentLanguage = localStorage.getItem('language') || 'en';
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', function(e) {
            if (e.target.value !== currentLanguage) {
                changeLanguage(e.target.value);
            }
        });
    }
}

// Advanced Features Functions

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<span class="text-yellow-400">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<span class="text-yellow-400">☆</span>';
        } else {
            stars += '<span class="text-gray-300">☆</span>';
        }
    }
    return stars;
}

function isInFavorites(listingId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(listingId);
}

function addToFavorites(listingId) {
    if (!currentUser) {
        alert('Please login to save favorites');
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const button = document.getElementById(`fav-${listingId}`);

    if (favorites.includes(listingId)) {
        favorites = favorites.filter(id => id !== listingId);
        button.innerHTML = '🤍 Save';
        alert('Removed from favorites');
    } else {
        favorites.push(listingId);
        button.innerHTML = '❤️ Saved';
        alert('Added to favorites');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function startVirtualTour(listingId) {
    const listing = allListings.find(l => l._id === listingId);
    if (!listing) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="max-w-6xl w-full h-5/6 bg-white rounded-lg overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center">
                <h2 class="text-xl font-bold">🥽 Virtual Tour: ${listing.title}</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div class="text-center">
                    <div class="text-6xl mb-4">🏠</div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">360° Virtual Tour</h3>
                    <p class="text-gray-600 mb-6">Experience this property in immersive 3D</p>
                    <div class="space-y-4">
                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold mr-4">📱 AR View</button>
                        <button class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold mr-4">🖥️ Desktop Tour</button>
                        <button class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">📹 Video Tour</button>
                    </div>
                    <div class="mt-8 text-sm text-gray-500">
                        Virtual tours coming soon! This feature will provide 360° property views.
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function scheduleViewing(listingId, title) {
    if (!currentUser) {
        alert('Please login to schedule viewings');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-800">📅 Schedule Viewing</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <h3 class="font-semibold mb-4">${title}</h3>

                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md" min="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                            <option value="">Select Time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                        <input type="tel" placeholder="(555) 123-4567" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <textarea placeholder="Any special requests or questions..." class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3"></textarea>
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold">
                            Schedule Viewing
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-semibold">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Viewing scheduled successfully! The property owner will contact you to confirm.');
        modal.remove();
    });
}

function toggleMapView() {
    const mapModal = document.createElement('div');
    mapModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    mapModal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-6xl w-full h-5/6 flex flex-col">
            <div class="p-4 border-b flex justify-between items-center">
                <h2 class="text-xl font-bold">${t('mapView')}</h2>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="flex-1 flex">
                <!-- Map Area -->
                <div class="flex-1 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
                    <div id="mapContainer" class="w-full h-full relative">
                        <!-- Simulated Map with Markers -->
                        <div class="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200">
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20">🗺️</div>

                            <!-- Property Markers with Address Labels -->
                            ${filteredListings.map((listing, index) => {
                                const x = 15 + (index % 6) * 12; // Better distribution
                                const y = 15 + Math.floor(index / 6) * 15; // Stack in rows
                                const shortAddress = listing.address.length > 25 ? listing.address.substring(0, 25) + '...' : listing.address;
                                return `
                                    <div class="absolute" style="left: ${x}%; top: ${y}%;">
                                        <div class="relative group">
                                            <button onclick="showMapListingDetails('${listing._id}')" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold shadow-lg transform hover:scale-110 transition-all duration-200">
                                                📍
                                            </button>
                                            <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-max z-10 pointer-events-none">
                                                <div class="text-xs font-semibold text-gray-800">${listing.title}</div>
                                                <div class="text-xs text-gray-600">${shortAddress}</div>
                                                <div class="text-xs font-bold text-green-600">${formatPrice(listing.price)}</div>
                                                <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <!-- Map Controls -->
                        <div class="absolute top-4 left-4 flex flex-col space-y-2">
                            <button onclick="zoomMapIn()" class="bg-white hover:bg-gray-100 shadow-lg w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold">+</button>
                            <button onclick="zoomMapOut()" class="bg-white hover:bg-gray-100 shadow-lg w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold">−</button>
                            <button onclick="resetMapZoom()" class="bg-white hover:bg-gray-100 shadow-lg w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold">⌂</button>
                        </div>

                        <!-- Legend -->
                        <div class="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
                            <h4 class="font-semibold text-sm mb-2">${t('legend')}</h4>
                            <div class="flex items-center space-x-2 text-xs">
                                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span>${t('availableRentals')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar with Listings -->
                <div class="w-80 bg-gray-50 border-l overflow-y-auto">
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-4">${t('propertiesOnMap')} (${filteredListings.length})</h3>
                        <div class="space-y-3">
                            ${filteredListings.map(listing => `
                                <div id="mapListing-${listing._id}" class="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-l-4 border-transparent hover:border-blue-500" onclick="highlightMapMarker('${listing._id}')">
                                    ${listing.images.length > 0 ? `
                                        <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-20 object-cover rounded mb-2">
                                    ` : ''}
                                    <h4 class="font-semibold text-sm">${listing.title}</h4>
                                    <div class="flex items-start mb-1">
                                        <span class="text-red-500 mr-1 text-xs">📍</span>
                                        <p class="text-xs text-gray-600 leading-tight">${listing.address}</p>
                                    </div>
                                    <div class="flex items-center mb-2">
                                        <span class="text-gray-400 mr-1 text-xs">🌍</span>
                                        <p class="text-xs text-gray-500">${listing.country}</p>
                                    </div>
                                    <p class="text-sm font-bold text-green-600">${formatPrice(listing.price)}</p>
                                    <div class="flex space-x-1 mt-2">
                                        <button onclick="event.stopPropagation(); viewDetails('${listing._id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex-1">
                                            ${t('details')}
                                        </button>
                                        <button onclick="event.stopPropagation(); openChatModal('${listing._id}', '${listing.title}')" class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs flex-1">
                                            💬
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(mapModal);

    // Store current map zoom level
    window.mapZoomLevel = 1;
}

function setupMapView() {
    // Add map toggle button if it doesn't exist
    const existingButton = document.getElementById('mapToggleBtn');
    if (!existingButton) {
        const headerActions = document.querySelector('.flex.space-x-4') || document.querySelector('header'); // Try to find a common place for buttons
        if (headerActions) {
            const mapButton = document.createElement('button');
            mapButton.id = 'mapToggleBtn';
            mapButton.className = 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors';
            mapButton.innerHTML = '🗺️ Map View';
            mapButton.onclick = toggleMapView;
            headerActions.appendChild(mapButton);
        }
    }
}

function updateMapView() {
    // Update map markers when listings change
    if (document.getElementById('mapContainer')) {
        // Map is currently open, refresh it
        const mapModal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        if (mapModal) {
            mapModal.remove();
            toggleMapView();
        }
    }
}

function showMapListingDetails(listingId) {
    const listing = filteredListings.find(l => l._id === listingId);
    if (!listing) return;

    // Highlight the listing in sidebar
    highlightMapMarker(listingId);

    // Show quick preview
    const preview = document.createElement('div');
    preview.className = 'absolute bg-white p-4 rounded-lg shadow-xl border z-20 max-w-sm';
    preview.style.left = '50%';
    preview.style.top = '50%';
    preview.style.transform = 'translate(-50%, -50%)';
    preview.innerHTML = `
        <div class="relative">
            <button onclick="this.closest('.absolute').remove()" class="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-xl bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">&times;</button>
            ${listing.images.length > 0 ? `
                <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-32 object-cover rounded mb-3">
            ` : ''}
            <h4 class="font-semibold text-lg mb-2">${listing.title}</h4>
            <div class="flex items-start mb-2">
                <span class="text-red-500 mr-2">📍</span>
                <p class="text-sm text-gray-600 leading-relaxed">${listing.address}</p>
            </div>
            <div class="flex items-center mb-3">
                <span class="mr-2">🌍</span>
                <p class="text-sm text-gray-500">${listing.country}</p>
            </div>
            <p class="text-xl font-bold text-green-600 mb-3">${formatPrice(listing.price)}</p>
            <div class="flex space-x-2">
                <button onclick="this.closest('.absolute').remove(); viewDetails('${listing._id}')" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-semibold">
                    ${t('viewFullDetails')}
                </button>
                <button onclick="this.closest('.absolute').remove(); openChatModal('${listing._id}', '${listing.title}')" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded text-sm font-semibold">
                    💬 ${t('chat')}
                </button>
            </div>
        </div>
    `;

    document.getElementById('mapContainer').appendChild(preview);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (preview.parentNode) {
            preview.remove();
        }
    }, 5000);
}

function highlightMapMarker(listingId) {
    // Remove previous highlights
    document.querySelectorAll('[id^="mapListing-"]').forEach(el => {
        el.classList.remove('border-blue-500', 'bg-blue-50');
        el.classList.add('border-transparent');
    });

    // Highlight selected listing
    const listingElement = document.getElementById(`mapListing-${listingId}`);
    if (listingElement) {
        listingElement.classList.remove('border-transparent');
        listingElement.classList.add('border-blue-500', 'bg-blue-50');
        listingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function zoomMapIn() {
    window.mapZoomLevel = Math.min(window.mapZoomLevel + 0.2, 2);
    updateMapZoom();
}

function zoomMapOut() {
    window.mapZoomLevel = Math.max(window.mapZoomLevel - 0.2, 0.5);
    updateMapZoom();
}

function resetMapZoom() {
    window.mapZoomLevel = 1;
    updateMapZoom();
}

function updateMapZoom() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        const mapContent = mapContainer.querySelector('.absolute.inset-0');
        if (mapContent) {
            mapContent.style.transform = `scale(${window.mapZoomLevel})`;
            mapContent.style.transformOrigin = 'center';
        }
    }
}

function saveCurrentSearch() {
    if (!currentUser) {
        alert('Please login to save searches');
        return;
    }

    const searchCriteria = {
        title: document.getElementById('searchTitle').value,
        location: document.getElementById('searchLocation').value,
        minPrice: document.getElementById('minPrice').value,
        maxPrice: document.getElementById('maxPrice').value,
        country: document.getElementById('countryFilter').value,
        city: document.getElementById('cityFilter').value,
        neighborhood: document.getElementById('neighborhoodFilter').value,
        kebele: document.getElementById('kebeleFilter').value,
        amenity: document.getElementById('amenityFilter').value,
        propertyType: document.getElementById('propertyTypeFilter')?.value,
        bedrooms: document.getElementById('bedroomsFilter')?.value,
        bathrooms: document.getElementById('bathroomsFilter')?.value,
        petFriendly: document.getElementById('petFriendlyFilter')?.checked
    };

    const searchName = prompt('Enter a name for this saved search:');
    if (!searchName) return;

    let savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    savedSearches.push({
        id: Date.now(),
        name: searchName,
        criteria: searchCriteria,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    alert('Search saved successfully!');
}

// Property Comparison Feature
function addToComparison(listingId) {
    let comparison = JSON.parse(localStorage.getItem('comparison') || '[]');

    if (comparison.length >= 3) {
        alert('You can only compare up to 3 properties at once');
        return;
    }

    if (comparison.includes(listingId)) {
        alert('Property already added to comparison');
        return;
    }

    comparison.push(listingId);
    localStorage.setItem('comparison', JSON.stringify(comparison));

    updateComparisonCounter();
    alert('Property added to comparison');
}

function updateComparisonCounter() {
    const comparison = JSON.parse(localStorage.getItem('comparison') || '[]');
    const counter = document.getElementById('comparisonCounter');
    if (counter) {
        counter.textContent = comparison.length;
        counter.parentElement.style.display = comparison.length > 0 ? 'block' : 'none';
    }
}

function showComparison() {
    const comparison = JSON.parse(localStorage.getItem('comparison') || '[]');
    const properties = comparison.map(id => allListings.find(l => l._id === id)).filter(Boolean);

    if (properties.length === 0) {
        alert('No properties to compare');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">📊 Property Comparison</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <div class="grid grid-cols-${properties.length} gap-4">
                    ${properties.map(property => `
                        <div class="border border-gray-200 rounded-lg p-4">
                            <img src="${property.images[0] || '/placeholder.jpg'}" alt="${property.title}" class="w-full h-32 object-cover rounded mb-4">
                            <h3 class="font-bold text-lg mb-2">${property.title}</h3>
                            <div class="space-y-2 text-sm">
                                <div><strong>Price:</strong> ${formatPrice(property.price)}</div>
                                <div><strong>Location:</strong> ${property.address}</div>
                                <div><strong>Bedrooms:</strong> ${property.bedrooms || 'N/A'}</div>
                                <div><strong>Bathrooms:</strong> ${property.bathrooms || 'N/A'}</div>
                                <div><strong>Sq Ft:</strong> ${property.sqft || 'N/A'}</div>
                                <div><strong>Pet Friendly:</strong> ${property.petFriendly ? 'Yes' : 'No'}</div>
                                <div><strong>Rating:</strong> ⭐ ${property.rating || '4.5'}</div>
                            </div>
                            <button onclick="removeFromComparison('${property._id}')" class="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                                Remove
                            </button>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-6 text-center">
                    <button onclick="clearComparison()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function removeFromComparison(listingId) {
    let comparison = JSON.parse(localStorage.getItem('comparison') || '[]');
    comparison = comparison.filter(id => id !== listingId);
    localStorage.setItem('comparison', JSON.stringify(comparison));

    // Close and reopen comparison modal
    document.querySelector('.fixed').remove();
    if (comparison.length > 0) {
        showComparison();
    }
    updateComparisonCounter();
}

function clearComparison() {
    localStorage.setItem('comparison', JSON.stringify([]));
    document.querySelector('.fixed').remove();
    updateComparisonCounter();
}

// Add Profile Picture Option

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

// Review Functionality
function openReviewModal(listingId, listingTitle) {
    if (!currentUser) {
        alert('Please login to leave a review');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-800">⭐ Review: ${listingTitle}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <form id="reviewForm" data-listing-id="${listingId}" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div class="flex space-x-1">
                            <button type="button" data-rating="1" class="star-button text-2xl text-gray-400">☆</button>
                            <button type="button" data-rating="2" class="star-button text-2xl text-gray-400">☆</button>
                            <button type="button" data-rating="3" class="star-button text-2xl text-gray-400">☆</button>
                            <button type="button" data-rating="4" class="star-button text-2xl text-gray-400">☆</button>
                            <button type="button" data-rating="5" class="star-button text-2xl text-gray-400">☆</button>
                        </div>
                        <input type="hidden" id="ratingInput" name="rating" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea id="commentInput" name="comment" placeholder="Share your thoughts..." class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="4" required></textarea>
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold">Submit Review</button>
                        <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-semibold">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add star rating functionality
    const starButtons = modal.querySelectorAll('.star-button');
    const ratingInput = document.getElementById('ratingInput');

    starButtons.forEach(button => {
        button.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;

            starButtons.forEach(btn => {
                const btnRating = parseInt(btn.getAttribute('data-rating'));
                if (btnRating <= rating) {
                    btn.classList.remove('text-gray-400');
                    btn.classList.add('text-yellow-400');
                } else {
                    btn.classList.remove('text-yellow-400');
                    btn.classList.add('text-gray-400');
                }
            });
        });
    });

    // Handle form submission
    modal.querySelector('#reviewForm').addEventListener('submit', handleReviewSubmit);
}

async function handleReviewSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const listingId = form.dataset.listingId;
    const rating = document.getElementById('ratingInput').value;
    const comment = document.getElementById('commentInput').value;

    if (!rating || !comment) {
        alert('Please provide both a rating and a comment.');
        return;
    }

    try {
        const response = await axios.post('/api/reviews', {
            listingId,
            rating: parseInt(rating),
            comment
        });

        if (response.status === 201) {
            alert('Review submitted successfully!');
            // Optionally refresh listings or update the specific listing's rating display
            window.location.reload(); // Simple reload to reflect changes
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    }
}

// New functions for currency conversion and AI chatbot
function setupCurrencyConverter() {
    // Add currency selector to the page
    const currencyContainer = document.createElement('div');
    currencyContainer.className = 'fixed top-4 right-4 z-40';
    currencyContainer.innerHTML = `
        <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <label class="block text-sm font-medium text-gray-700 mb-1">${t('currency')}</label>
            <select id="currencySelector" class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="USD">US Dollar ($)</option>
                <option value="ETB">Ethiopian Birr (ብር)</option>
            </select>
        </div>
    `;
    document.body.appendChild(currencyContainer);

    const currencySelector = document.getElementById('currencySelector');
    currencySelector.value = currentCurrency;
    currencySelector.addEventListener('change', function(e) {
        currentCurrency = e.target.value;
        localStorage.setItem('currency', currentCurrency);
        updatePriceDisplays();
    });

    // Load saved currency preference
    currentCurrency = localStorage.getItem('currency') || 'USD';
    currencySelector.value = currentCurrency;
}

function formatPrice(price) {
    const convertedPrice = price * (exchangeRates[currentCurrency] / exchangeRates.USD);
    const symbol = currentCurrency === 'ETB' ? 'ብር' : '$';

    if (currentCurrency === 'USD') {
        return `${symbol}${convertedPrice.toFixed(0)}`;
    } else {
        const usdPrice = price; // Original price in USD
        return `ብር${convertedPrice.toFixed(0)} (~$${usdPrice})`;
    }
}

function updatePriceDisplays() {
    // Update all price displays on the page
    document.querySelectorAll('[data-price]').forEach(element => {
        const originalPrice = parseFloat(element.dataset.price);
        element.textContent = formatPrice(originalPrice);
    });

    // Re-render listings to update prices
    renderListings();
}

function setupAIChatbot() {
    // Add AI chatbot button
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'fixed bottom-4 right-4 z-50';
    chatbotContainer.innerHTML = `
        <button id="aiChatToggle" class="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110">
            <span class="text-2xl">🤖</span>
        </button>

        <div id="aiChatModal" class="hidden fixed bottom-20 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
            <div class="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold">${currentLanguage === 'am' ? 'AI አጋዥ' : currentLanguage === 'fr' ? 'Assistant IA' : 'AI Assistant'}</h3>
                    <button id="closeChatbot" class="text-white hover:text-gray-200">&times;</button>
                </div>
                <p class="text-sm opacity-90 mt-1">${currentLanguage === 'am' ? 'ስለ HomeHatch ጠይቅ' : currentLanguage === 'fr' ? 'Posez des questions sur HomeHatch' : 'Ask questions about HomeHatch'}</p>
            </div>

            <div id="aiChatMessages" class="flex-1 overflow-y-auto p-4 space-y-3">
                <div class="bg-gray-100 rounded-lg p-3 text-sm">
                    <div class="font-semibold text-blue-600 mb-1">AI Assistant</div>
                    <div>${currentLanguage === 'am' ? 'ሰላም! HomeHatch ላይ እንዴት ልረዳዎት እችላለሁ?' : currentLanguage === 'fr' ? 'Bonjour! Comment puis-je vous aider avec HomeHatch?' : 'Hello! How can I help you with HomeHatch?'}</div>
                </div>
            </div>

            <div class="p-4 border-t">
                <div class="flex space-x-2">
                    <input id="aiChatInput" type="text" placeholder="${currentLanguage === 'am' ? 'መልእክትዎን ይተይቡ...' : currentLanguage === 'fr' ? 'Tapez votre message...' : 'Type your message...'}" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <button id="sendAiMessage" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                        ${currentLanguage === 'am' ? 'ላክ' : currentLanguage === 'fr' ? 'Envoyer' : 'Send'}
                    </button>
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 text-xs px-2 py-1 rounded-full transition-colors" data-question="${currentLanguage === 'am' ? 'ቤት እንዴት አስቀምጣለሁ?' : currentLanguage === 'fr' ? 'Comment lister une propriété?' : 'How to list a property?'}">
                        ${currentLanguage === 'am' ? 'ቤት እንዴት አስቀምጣለሁ?' : currentLanguage === 'fr' ? 'Comment lister?' : 'How to list?'}
                    </button>
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 text-xs px-2 py-1 rounded-full transition-colors" data-question="${currentLanguage === 'am' ? 'ክፍያ እንዴት ይሰራል?' : currentLanguage === 'fr' ? 'Comment fonctionnent les paiements?' : 'How do payments work?'}">
                        ${currentLanguage === 'am' ? 'ክፍያ' : currentLanguage === 'fr' ? 'Paiements' : 'Payments'}
                    </button>
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 text-xs px-2 py-1 rounded-full transition-colors" data-question="${currentLanguage === 'am' ? 'መለያ እንዴት እሰራለሁ?' : currentLanguage === 'fr' ? 'Comment créer un compte?' : 'How to create account?'}">
                        ${currentLanguage === 'am' ? 'መለያ' : currentLanguage === 'fr' ? 'Compte' : 'Account'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // Setup chatbot event listeners
    document.getElementById('aiChatToggle').addEventListener('click', toggleAIChatbot);
    document.getElementById('closeChatbot').addEventListener('click', closeAIChatbot);
    document.getElementById('sendAiMessage').addEventListener('click', sendAIMessage);
    document.getElementById('aiChatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendAIMessage();
    });

    // Quick questions
    document.querySelectorAll('.quick-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            document.getElementById('aiChatInput').value = question;
            sendAIMessage();
        });
    });
}

function toggleAIChatbot() {
    const modal = document.getElementById('aiChatModal');
    modal.classList.toggle('hidden');
}

function closeAIChatbot() {
    document.getElementById('aiChatModal').classList.add('hidden');
}

function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('aiChatMessages');

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'flex justify-end';
    userMessage.innerHTML = `
        <div class="bg-blue-500 text-white rounded-lg p-3 max-w-xs text-sm">
            <div class="font-semibold mb-1">${currentLanguage === 'am' ? 'እርስዎ' : currentLanguage === 'fr' ? 'Vous' : 'You'}</div>
            <div>${message}</div>
        </div>
    `;
    messagesContainer.appendChild(userMessage);

    input.value = '';

    // Simulate AI response
    setTimeout(() => {
        const aiResponse = getAIResponse(message);
        const aiMessage = document.createElement('div');
        aiMessage.innerHTML = `
            <div class="bg-gray-100 rounded-lg p-3 text-sm">
                <div class="font-semibold text-blue-600 mb-1">AI Assistant</div>
                <div>${aiResponse}</div>
            </div>
        `;
        messagesContainer.appendChild(aiMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (currentLanguage === 'am') {
        if (lowerMessage.includes('ቤት') || lowerMessage.includes('list')) {
            return 'ቤት ለማስቀመጥ፣ "ቤት አስቀምጥ" ቁልፍን ይጫኑ። ስሞችዎትን፣ አድራሻ፣ ዋጋ እና ፎቶዎችን ይሙሉ። የተሟላ መረጃ የበለጠ ተከራዮችን ይሳባል።';
        } else if (lowerMessage.includes('ክፍያ') || lowerMessage.includes('payment')) {
            return 'የክፍያ ሂደታችን ደህንነቱ የተጠበቀ ነው። ክሬዲት ካርድ፣ ዴቢት ካርድ እና የባንክ ዝውውር ተቀባይነት አላቸው። ሁሉም ግብይቶች በኢንክሪፕሽን የተጠበቁ ናቸው።';
        } else if (lowerMessage.includes('መለያ') || lowerMessage.includes('account')) {
            return 'መለያ ለመፍጠር "ይመዝገቡ" ቁልፍን ይጫኑ። የኢሜል አድራሻ፣ የተጠቃሚ ስም እና የይለፍ ቃል ያስፈልጋል። 18 አመት እና ከዚያ በላይ መሆን አለብዎት።';
        } else {
            return 'HomeHatch የኢትዮጵያ የቤት ኪራይ መድረክ ነው። ቤት መፈለግ፣ ማስቀመጥ እና መከራየት ይችላሉ። ተጨማሪ እርዳታ ከፈለጉ ይጠይቁኝ!';
        }
    } else if (currentLanguage === 'fr') {
        if (lowerMessage.includes('list') || lowerMessage.includes('propriété')) {
            return 'Pour lister une propriété, cliquez sur "Lister une Propriété". Remplissez les détails, l\'adresse, le prix et ajoutez des photos. Plus d\'informations attirent plus de locataires.';
        } else if (lowerMessage.includes('payment') || lowerMessage.includes('paiement')) {
            return 'Notre processus de paiement est sécurisé. Nous acceptons les cartes de crédit, débit et virements bancaires. Toutes les transactions sont cryptées.';
        } else if (lowerMessage.includes('account') || lowerMessage.includes('compte')) {
            return 'Pour créer un compte, cliquez sur "S\'inscrire". Vous avez besoin d\'une adresse email, nom d\'utilisateur et mot de passe. Vous devez avoir 18 ans ou plus.';
        } else {
            return 'HomeHatch est une plateforme de location éthiopienne. Vous pouvez chercher, lister et louer des propriétés. Demandez-moi si vous avez besoin d\'aide!';
        }
    } else { // English
        if (lowerMessage.includes('list') || lowerMessage.includes('property')) {
            return 'To list a property, click "List Property" button. Fill in the details, address, price, and add photos. Complete information attracts more tenants.';
        } else if (lowerMessage.includes('payment')) {
            return 'Our payment process is secure. We accept credit cards, debit cards, and bank transfers. All transactions are encrypted for your safety.';
        } else if (lowerMessage.includes('account') || lowerMessage.includes('register')) {
            return 'To create an account, click "Register" button. You need an email address, username, and password. You must be 18 years or older.';
        } else if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
            return 'Use our search filters to find properties by location, price range, amenities, and more. You can also browse by Ethiopian regions and kebeles.';
        } else {
            return 'HomeHatch is Ethiopia\'s rental property platform. You can search, list, and rent properties. Ask me anything about how to use the platform!';
        }
    }
}