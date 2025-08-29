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
    },
    'login': {
        'en': 'Login',
        'am': 'ግባ',
        'fr': 'Connexion'
    },
    'register': {
        'en': 'Register',
        'am': 'ይመዝገቡ',
        'fr': 'S\'inscrire'
    }
};


function t(key) {
    return translations[key] && translations[key][currentLanguage] ? translations[key][currentLanguage] : translations[key] && translations[key]['en'] ? translations[key]['en'] : key;
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadListings();
    setupSearch();
    setupScrollGradient();
    setupLanguageSelector();
    setupCurrencyConverter();
    setupAIChatbot();
    setupMapView();

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
        }
    }

    // If not logged in and not on login page, redirect to login
    if (!currentUser && !window.location.pathname.includes('/login.html')) {
       // window.location.href = '/login.html'; // Temporarily commented out to allow viewing listings without login
    }

    updateHeader(); // Update header regardless of login status
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
    } else {
        // Handle logged out state or show login/register buttons
        const loginRegisterSection = document.getElementById('loginRegisterSection'); // Assuming you have a place for these buttons
        if (loginRegisterSection) {
            loginRegisterSection.classList.remove('hidden');
            loginRegisterSection.innerHTML = `
                <a href="/login.html" class="text-white hover:text-gray-300 px-4 py-2 rounded-lg font-semibold transition-colors">${t('login')}</a>
                <a href="/register.html" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">${t('register')}</a>
            `;
        }
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
    if (!listingsContainer) return; // Exit if container not found

    if (filteredListings.length === 0) {
        listingsContainer.innerHTML = '<div class="col-span-full text-center text-gray-500">No rentals found matching your criteria.</div>';
        return;
    }

    listingsContainer.innerHTML = filteredListings.map(listing => createPropertyCard(listing)).join('');
}

// --- Updated and New Functions ---

// Fix addEventListener errors and improve property card styling
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortFilter'); // Corrected ID
    const filterButton = document.getElementById('filterButton');
    const languageSelector = document.getElementById('languageSelector');
    const currencySelector = document.getElementById('currencySelector');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', performSearch);
    }

    // This button is likely for the advanced filters modal, not a general filter button
    // if (filterButton) {
    //     filterButton.addEventListener('click', showAdvancedFilters);
    // }

    if (languageSelector) {
        languageSelector.addEventListener('change', function(e) {
            changeLanguage(e.target.value);
        });
    }

    if (currencySelector) {
        currencySelector.addEventListener('change', function(e) {
            currentCurrency = e.target.value;
            localStorage.setItem('currency', currentCurrency);
            updatePriceDisplays();
        });
    }
}

// Enhanced property card creation with modern styling
function createPropertyCard(listing) {
    const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.jpg';
    const price = formatPrice(listing.price);
    const location = formatLocation(listing);

    return `
        <div class="property-card rounded-3xl overflow-hidden shadow-xl bg-white">
            <div class="relative overflow-hidden rounded-t-3xl">
                <img src="${imageUrl}" alt="${listing.title}" class="property-image w-full h-56 object-cover">
                <div class="absolute top-4 right-4">
                    <div class="glass-effect px-3 py-1 rounded-full">
                        <span class="text-white font-bold text-lg">${price}</span>
                    </div>
                </div>
                <div class="absolute top-4 left-4">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full">
                        <span class="text-white text-sm font-semibold">🏠 Rental</span>
                    </div>
                </div>
            </div>

            <div class="p-6">
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1">${listing.title}</h3>
                    <p class="text-gray-600 text-sm flex items-center">
                        <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        ${location}
                    </p>
                </div>

                <p class="text-gray-700 text-sm mb-4 line-clamp-2">${listing.description}</p>

                ${listing.amenities && listing.amenities.length > 0 ? `
                    <div class="mb-4">
                        <div class="flex flex-wrap gap-1">
                            ${listing.amenities.slice(0, 3).map(amenity => `
                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">${getAmenityIcon(amenity)} ${amenity}</span>
                            `).join('')}
                            ${listing.amenities.length > 3 ? `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">+${listing.amenities.length - 3}</span>` : ''}
                        </div>
                    </div>
                ` : ''}

                <div class="flex gap-2">
                    <button onclick="viewDetails('${listing._id}')" class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105">
                        View Details
                    </button>
                    <button onclick="addToFavorites('${listing._id}')" class="glass-effect hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl transition-all duration-300 border border-gray-200" id="fav-${listing._id}">
                        ${isInFavorites(listing._id) ? '❤️ Saved' : '🤍 Save'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper function to get amenity icons
function getAmenityIcon(amenity) {
    const icons = {
        'WiFi': '📶',
        'Parking': '🚗',
        'Pool': '🏊',
        'Gym': '💪',
        'Air Conditioning': '❄️',
        'Laundry': '🧺',
        'Pet Friendly': '🐕',
        'Balcony': '🌿',
        'Furnished': '🛋️',
        'Dishwasher': '🍽️',
        'Elevator': '🛗'
    };
    return icons[amenity] || '✨';
}

// Helper function to format location string
function formatLocation(listing) {
    let parts = [listing.address, listing.city, listing.country];
    return parts.filter(Boolean).join(', ');
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- Existing functions modified or kept as is ---

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterButton = document.getElementById('filterButton');

    // Add event listeners with null checks
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', performSearch);
    }

    if (filterButton) {
        filterButton.addEventListener('click', showAdvancedFilters);
    }

    // Setup advanced filters if they exist
    setupAdvancedFilters();

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);

    // Add Enter key listeners for text inputs
    [searchTitle, searchLocation, minPrice, maxPrice].forEach(input => {
        if (input) input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    });

    // Add change listeners for dropdowns to auto-search
    [countryFilter, amenityFilter, sortFilter, propertyTypeFilter, bedroomsFilter, bathroomsFilter, cityFilter, neighborhoodFilter, kebeleFilter].forEach(filter => {
        if (filter) filter.addEventListener('change', performSearch);
    });

    // Add change listener for pet friendly checkbox
    if (petFriendlyFilter) {
        petFriendlyFilter.addEventListener('change', performSearch);
    }

    // Add advanced filters setup
    setupAdvancedFilters();
    setupMapView();
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
        <option value="1">${t('bathroom')}</option>
        <option value="2">2 ${t('bathrooms')}</option>
        <option value="3">3+ ${t('bathrooms')}</option>
    `;

    // Pet-friendly filter
    const petFriendlyLabel = document.createElement('label');
    petFriendlyLabel.htmlFor = 'petFriendlyFilter';
    petFriendlyLabel.className = 'text-gray-700 flex items-center'; // Changed text color for better visibility
    petFriendlyFilter = document.createElement('input'); // Define petFriendlyFilter here
    petFriendlyFilter.type = 'checkbox';
    petFriendlyFilter.id = 'petFriendlyFilter';
    petFriendlyFilter.className = 'mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
    petFriendlyLabel.appendChild(petFriendlyFilter);
    petFriendlyLabel.innerHTML += ` 🐕 ${t('petFriendly')}`;


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
            (listing.city && listing.city.toLowerCase().includes(locationQuery)) ||
            (listing.neighborhood && listing.neighborhood.toLowerCase().includes(locationQuery));
        const matchesCountry = !countryFilter || listing.country.toLowerCase() === countryFilter.toLowerCase();
        const matchesCity = !cityFilter || (listing.city && listing.city.toLowerCase() === cityFilter.toLowerCase());
        const matchesNeighborhood = !neighborhoodFilter || (listing.neighborhood && listing.neighborhood.toLowerCase() === neighborhoodFilter.toLowerCase());
        const matchesKebele = !kebeleFilter || (listing.kebele && listing.kebele.toLowerCase() === kebeleFilter.toLowerCase());
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

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    let searchQuery = '';
    let sortBy = 'newest';

    if (searchInput) {
        searchQuery = searchInput.value.toLowerCase();
    }

    if (sortSelect) {
        sortBy = sortSelect.value;
    }

    // Filter listings based on search query
    filteredListings = allListings.filter(listing => {
        if (!searchQuery) return true;

        return listing.title.toLowerCase().includes(searchQuery) ||
               listing.description.toLowerCase().includes(searchQuery) ||
               listing.address.toLowerCase().includes(searchQuery) ||
               listing.country.toLowerCase().includes(searchQuery);
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
    }

    renderListings();
    updateResultsCount();
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = filteredListings.length;
    }
}

function showAdvancedFilters() {
    // Implementation for advanced filters modal
    alert('Advanced filters feature coming soon!');
}

function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'newest';

    filteredListings = [...allListings];
    performSearch();
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
    loadChatMessages(listingId);

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

async function loadChatMessages(listingId) {
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
        loadChatMessages(currentChatListingId); // Refresh messages immediately
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
// function t(key) {
//     return translations[key] && translations[key][currentLanguage] ? translations[key][currentLanguage] : translations[key] && translations[key]['en'] ? translations[key]['en'] : key;
// }

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
    // This might conflict with other fixed elements, consider placement carefully
    // document.body.appendChild(bottomButtonsContainer);
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
        if(button) button.innerHTML = '🤍 Save';
        alert('Removed from favorites');
    } else {
        favorites.push(listingId);
        if(button) button.innerHTML = '❤️ Saved';
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
    mapModal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
    mapModal.innerHTML = `
        <div class="bg-gradient-to-br from-gray-900 to-black rounded-3xl w-full h-full flex flex-col overflow-hidden shadow-2xl border border-gray-700">
            <!-- Header -->
            <div class="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900 to-purple-900">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <h2 class="text-2xl font-bold text-white">🌍 ${t('mapView')} - HomeHatch Global</h2>
                        <div class="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-1 rounded-full">
                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="text-green-300 text-sm font-semibold">${filteredListings.length} Properties Worldwide</span>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-red-400 hover:text-red-300 text-3xl font-bold bg-black bg-opacity-30 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-50 transition-all duration-300">×</button>
                </div>

                <!-- Map Controls Header -->
                <div class="flex items-center justify-between mt-4">
                    <div class="flex space-x-2">
                        <button onclick="focusRegion('africa')" class="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            🌍 Africa
                        </button>
                        <button onclick="focusRegion('asia')" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            🏯 Asia
                        </button>
                        <button onclick="focusRegion('europe')" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            🏰 Europe
                        </button>
                        <button onclick="focusRegion('americas')" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            🗽 Americas
                        </button>
                        <button onclick="focusRegion('oceania')" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            🏄 Oceania
                        </button>
                    </div>

                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-2 rounded-lg">
                            <span class="text-white text-sm">View:</span>
                            <button id="satelliteToggle" onclick="toggleSatelliteView()" class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-all duration-300">
                                🛰️ Satellite
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 flex">
                <!-- Enhanced Map Area -->
                <div class="flex-1 relative overflow-hidden" id="worldMapContainer">
                    <div id="mapContainer" class="w-full h-full relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-900">

                        <!-- Animated World Map Background -->
                        <div class="absolute inset-0" id="worldMapBackground">
                            ${generateWorldMapSVG()}
                        </div>

                        <!-- Property Markers Positioned by Country -->
                        <div id="propertyMarkers" class="absolute inset-0">
                            ${generateWorldwideMarkers()}
                        </div>

                        <!-- Advanced Map Controls -->
                        <div class="absolute top-6 left-6 flex flex-col space-y-3">
                            <button onclick="zoomMapIn()" class="bg-black bg-opacity-70 hover:bg-opacity-90 text-white shadow-2xl w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 border border-gray-600">
                                +
                            </button>
                            <button onclick="zoomMapOut()" class="bg-black bg-opacity-70 hover:bg-opacity-90 text-white shadow-2xl w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 border border-gray-600">
                                −
                            </button>
                            <button onclick="resetMapZoom()" class="bg-black bg-opacity-70 hover:bg-opacity-90 text-white shadow-2xl w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 transform hover:scale-110 border border-gray-600">
                                ⌂
                            </button>
                            <button onclick="toggleFullscreen()" class="bg-black bg-opacity-70 hover:bg-opacity-90 text-white shadow-2xl w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 transform hover:scale-110 border border-gray-600">
                                ⛶
                            </button>
                        </div>

                        <!-- Enhanced Legend -->
                        <div class="absolute bottom-6 left-6 bg-black bg-opacity-80 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-gray-600">
                            <h4 class="font-bold text-lg mb-3 text-white">${t('legend')}</h4>
                            <div class="space-y-2">
                                <div class="flex items-center space-x-3 text-sm">
                                    <div class="w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"></div>
                                    <span class="text-white">${t('availableRentals')}</span>
                                </div>
                                <div class="flex items-center space-x-3 text-sm">
                                    <div class="w-5 h-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg"></div>
                                    <span class="text-white">Premium Properties</span>
                                </div>
                                <div class="flex items-center space-x-3 text-sm">
                                    <div class="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                                    <span class="text-white">Featured Locations</span>
                                </div>
                            </div>
                            <div class="mt-3 pt-3 border-t border-gray-600">
                                <div class="text-xs text-gray-400">
                                    📊 Countries: <span class="text-white font-semibold">${getUniqueCountries().length}</span><br>
                                    💰 Avg Price: <span class="text-green-400 font-semibold">$${getAveragePrice()}</span><br>
                                    🏠 Total Props: <span class="text-blue-400 font-semibold">${filteredListings.length}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Live Statistics -->
                        <div class="absolute top-6 right-6 bg-black bg-opacity-80 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-gray-600">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-white mb-1">${filteredListings.length}</div>
                                <div class="text-xs text-gray-400 uppercase tracking-wider">Properties</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Sidebar -->
                <div class="w-96 bg-gray-900 border-l border-gray-700 overflow-hidden flex flex-col">
                    <!-- Filters Panel -->
                    <div class="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                        <h3 class="font-bold text-lg mb-4 text-white">🔍 Live Filters</h3>
                        <div class="grid grid-cols-2 gap-2">
                            <select id="mapPriceFilter" onchange="applyMapFilters()" class="bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1 text-sm">
                                <option value="">All Prices</option>
                                <option value="0-500">$0 - $500</option>
                                <option value="500-1000">$500 - $1000</option>
                                <option value="1000-2000">$1000 - $2000</option>
                                <option value="2000+">$2000+</option>
                            </select>
                            <select id="mapCountryFilter" onchange="applyMapFilters()" class="bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1 text-sm">
                                <option value="">All Countries</option>
                                ${getUniqueCountries().map(country => `<option value="${country}">🏳️ ${country}</option>`).join('')}
                            </select>
                            <select id="mapTypeFilter" onchange="applyMapFilters()" class="bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1 text-sm">
                                <option value="">All Types</option>
                                <option value="apartment">🏢 Apartment</option>
                                <option value="house">🏠 House</option>
                                <option value="condo">🌆 Condo</option>
                                <option value="studio">🏠 Studio</option>
                            </select>
                            <select id="mapAmenityFilter" onchange="applyMapFilters()" class="bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1 text-sm">
                                <option value="">All Amenities</option>
                                <option value="WiFi">📶 WiFi</option>
                                <option value="Parking">🚗 Parking</option>
                                <option value="Pool">🏊 Pool</option>
                                <option value="Gym">💪 Gym</option>
                            </select>
                        </div>
                    </div>

                    <!-- Properties List -->
                    <div class="flex-1 overflow-y-auto">
                        <div class="p-4">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-bold text-lg text-white">🏠 ${t('propertiesOnMap')}</h3>
                                <div class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    ${filteredListings.length}
                                </div>
                            </div>
                            <div class="space-y-3" id="mapPropertiesList">
                                ${generateEnhancedPropertyCards()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(mapModal);

    // Initialize map state
    window.mapZoomLevel = 1;
    window.satelliteView = false;
    window.currentRegionFocus = 'world';
}

function setupMapView() {
    // Add map toggle button if it doesn't exist
    const existingButton = document.getElementById('mapToggleBtn');
    if (!existingButton) {
        const headerActions = document.querySelector('.flex.space-x-4') || document.querySelector('header');
        if (headerActions) {
            const mapButton = document.createElement('button');
            mapButton.id = 'mapToggleBtn';
            mapButton.className = 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg';
            mapButton.innerHTML = '🌍 Explore Global Map';
            mapButton.onclick = toggleMapView;
            headerActions.appendChild(mapButton);
        }
    }
}

// Enhanced map utility functions
function generateWorldMapSVG() {
    return `
        <svg class="w-full h-full opacity-20" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
            <!-- Continent shapes -->
            <!-- Africa -->
            <path d="M 450 150 Q 480 140 510 160 L 520 200 Q 530 250 520 300 L 480 350 Q 450 360 420 340 L 410 300 Q 400 250 420 200 Z" fill="#4ade80" opacity="0.3" class="continent-shape" data-continent="africa"/>

            <!-- Europe -->
            <path d="M 400 100 Q 450 90 500 110 L 510 130 Q 480 140 450 135 L 420 125 Q 400 115 400 100 Z" fill="#60a5fa" opacity="0.3" class="continent-shape" data-continent="europe"/>

            <!-- Asia -->
            <path d="M 500 110 Q 600 100 700 130 L 750 180 Q 780 220 760 260 L 720 280 Q 650 290 580 270 L 520 240 Q 500 200 510 160 Z" fill="#f472b6" opacity="0.3" class="continent-shape" data-continent="asia"/>

            <!-- North America -->
            <path d="M 150 120 Q 200 100 280 130 L 320 180 Q 300 220 260 240 L 200 250 Q 150 240 120 200 L 130 160 Q 140 140 150 120 Z" fill="#fbbf24" opacity="0.3" class="continent-shape" data-continent="americas"/>

            <!-- South America -->
            <path d="M 200 250 Q 240 240 270 270 L 280 320 Q 270 380 240 420 L 200 440 Q 160 430 140 390 L 150 340 Q 170 290 200 250 Z" fill="#34d399" opacity="0.3" class="continent-shape" data-continent="americas"/>

            <!-- Australia/Oceania -->
            <path d="M 650 350 Q 700 340 750 360 L 780 380 Q 770 400 740 410 L 690 415 Q 650 405 630 380 L 640 365 Q 645 355 650 350 Z" fill="#a78bfa" opacity="0.3" class="continent-shape" data-continent="oceania"/>
        </svg>
    `;
}

function generateWorldwideMarkers() {
    const countryCoordinates = {
        'Ethiopia': { x: 52, y: 32 },
        'United States': { x: 20, y: 35 },
        'United Kingdom': { x: 42, y: 22 },
        'Canada': { x: 18, y: 25 },
        'Australia': { x: 73, y: 75 },
        'Germany': { x: 45, y: 28 },
        'France': { x: 43, y: 30 },
        'Japan': { x: 85, y: 35 },
        'Brazil': { x: 28, y: 65 },
        'South Africa': { x: 48, y: 85 },
        'India': { x: 68, y: 45 },
        'China': { x: 75, y: 35 },
        'Spain': { x: 41, y: 35 },
        'Italy': { x: 45, y: 38 },
        'Mexico': { x: 15, y: 45 },
        'Argentina': { x: 25, y: 80 },
        'Egypt': { x: 48, y: 40 },
        'Kenya': { x: 50, y: 52 },
        'Nigeria': { x: 45, y: 45 },
        'Morocco': { x: 40, y: 38 }
    };

    let markersHTML = '';
    const listingsByCountry = {};

    // Group listings by country
    filteredListings.forEach(listing => {
        const country = listing.country || 'Unknown';
        if (!listingsByCountry[country]) {
            listingsByCountry[country] = [];
        }
        listingsByCountry[country].push(listing);
    });

    // Generate markers for each country
    Object.keys(listingsByCountry).forEach(country => {
        const coords = countryCoordinates[country] || { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 };
        const listings = listingsByCountry[country];
        const avgPrice = Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length);

        markersHTML += `
            <div class="absolute marker-container" style="left: ${coords.x}%; top: ${coords.y}%;" data-country="${country}">
                <div class="relative group">
                    <div class="marker-pulse absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                    <button onclick="showCountryProperties('${country}')" class="marker-btn relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-2xl transform hover:scale-125 transition-all duration-300 border-2 border-white z-10">
                        ${listings.length}
                    </button>

                    <div class="marker-tooltip absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-xl p-3 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 min-w-max z-20 pointer-events-none border border-gray-600">
                        <div class="text-sm font-bold mb-1">🏳️ ${country}</div>
                        <div class="text-xs text-gray-300">${listings.length} ${listings.length === 1 ? 'Property' : 'Properties'}</div>
                        <div class="text-xs text-green-400 font-semibold">Avg: $${avgPrice}/mo</div>
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                    </div>
                </div>
            </div>
        `;
    });

    return markersHTML;
}

function generateEnhancedPropertyCards() {
    return filteredListings.map(listing => `
        <div id="mapListing-${listing._id}" class="property-card bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-2xl shadow-xl border border-gray-600 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105" onclick="highlightMapMarker('${listing._id}')">
            ${listing.images.length > 0 ? `
                <div class="relative mb-3 rounded-xl overflow-hidden">
                    <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-24 object-cover">
                    <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        ${formatPrice(listing.price)}
                    </div>
                    ${listing.images.length > 1 ? `
                        <div class="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs">
                            +${listing.images.length - 1} photos
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            <h4 class="font-bold text-sm text-white mb-2 line-clamp-1">${listing.title}</h4>

            <div class="flex items-center mb-2">
                <span class="text-red-400 mr-2 text-sm">📍</span>
                <p class="text-xs text-gray-300 leading-tight line-clamp-1">${listing.address}</p>
            </div>

            <div class="flex items-center mb-3">
                <span class="text-blue-400 mr-2 text-sm">🌍</span>
                <p class="text-xs text-gray-400">${listing.country}</p>
            </div>

            ${listing.amenities && listing.amenities.length > 0 ? `
                <div class="flex flex-wrap gap-1 mb-3">
                    ${listing.amenities.slice(0, 2).map(amenity => `
                        <span class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">${getAmenityIcon(amenity)} ${amenity}</span>
                    `).join('')}
                    ${listing.amenities.length > 2 ? `<span class="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">+${listing.amenities.length - 2}</span>` : ''}
                </div>
            ` : ''}

            <div class="flex justify-between items-center">
                <div class="text-lg font-bold text-green-400">${formatPrice(listing.price)}</div>
                <div class="flex space-x-1">
                    <button onclick="event.stopPropagation(); viewDetails('${listing._id}')" class="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-300">
                        View
                    </button>
                    ${currentUser ? `
                        <button onclick="event.stopPropagation(); openChatModal('${listing._id}', '${listing.title}')" class="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-300">
                            💬
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getUniqueCountries() {
    return [...new Set(filteredListings.map(listing => listing.country))].filter(Boolean);
}

function getAveragePrice() {
    if (filteredListings.length === 0) return 0;
    const total = filteredListings.reduce((sum, listing) => sum + listing.price, 0);
    return Math.round(total / filteredListings.length);
}

function focusRegion(region) {
    const mapContainer = document.getElementById('mapContainer');
    const continentShapes = document.querySelectorAll('.continent-shape');

    // Reset all continent opacities
    continentShapes.forEach(shape => {
        shape.style.opacity = region === 'world' ? '0.3' : '0.1';
    });

    // Highlight selected region
    const selectedShape = document.querySelector(`[data-continent="${region}"]`);
    if (selectedShape) {
        selectedShape.style.opacity = '0.6';
    }

    // Filter properties by region
    const regionCountries = {
        'africa': ['Ethiopia', 'South Africa', 'Egypt', 'Kenya', 'Nigeria', 'Morocco'],
        'asia': ['India', 'China', 'Japan'],
        'europe': ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy'],
        'americas': ['United States', 'Canada', 'Brazil', 'Mexico', 'Argentina'],
        'oceania': ['Australia']
    };

    if (region !== 'world') {
        const regionCountryList = regionCountries[region] || [];
        const regionListings = allListings.filter(listing =>
            regionCountryList.includes(listing.country)
        );

        // Update markers visibility
        const markers = document.querySelectorAll('.marker-container');
        markers.forEach(marker => {
            const country = marker.dataset.country;
            if (regionCountryList.includes(country)) {
                marker.style.display = 'block';
                marker.style.transform = 'scale(1.2)';
            } else {
                marker.style.display = 'none';
            }
        });
    } else {
        // Show all markers
        const markers = document.querySelectorAll('.marker-container');
        markers.forEach(marker => {
            marker.style.display = 'block';
            marker.style.transform = 'scale(1)';
        });
    }

    window.currentRegionFocus = region;
}

function toggleSatelliteView() {
    const background = document.getElementById('worldMapBackground');
    const toggleBtn = document.getElementById('satelliteToggle');

    window.satelliteView = !window.satelliteView;

    if (window.satelliteView) {
        background.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)';
        background.style.backgroundImage = 'radial-gradient(circle at 25% 25%, #ffffff08 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ffffff05 1px, transparent 1px)';
        toggleBtn.innerHTML = '🗺️ Normal';
        toggleBtn.className = 'bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-all duration-300';
    } else {
        background.style.background = '';
        background.style.backgroundImage = '';
        toggleBtn.innerHTML = '🛰️ Satellite';
        toggleBtn.className = 'bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-all duration-300';
    }
}

function showCountryProperties(country) {
    const countryListings = filteredListings.filter(listing => listing.country === country);

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-600">
            <div class="p-6 border-b border-gray-600 bg-gradient-to-r from-blue-900 to-purple-900">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-white">🏳️ Properties in ${country}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-red-400 hover:text-red-300 text-2xl font-bold bg-black bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center">×</button>
                </div>
                <p class="text-gray-300 mt-2">${countryListings.length} properties available</p>
            </div>
            <div class="p-6">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${countryListings.map(listing => `
                        <div class="bg-gray-800 rounded-xl p-4 border border-gray-600 hover:border-blue-500 transition-all duration-300">
                            ${listing.images.length > 0 ? `
                                <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-32 object-cover rounded-lg mb-3">
                            ` : ''}
                            <h3 class="font-bold text-white mb-2">${listing.title}</h3>
                            <p class="text-gray-400 text-sm mb-2">${listing.address}</p>
                            <p class="text-green-400 font-bold text-lg mb-3">${formatPrice(listing.price)}/month</p>
                            <div class="flex space-x-2">
                                <button onclick="this.closest('.fixed').remove(); viewDetails('${listing._id}')" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300">
                                    View Details
                                </button>
                                ${currentUser ? `
                                    <button onclick="this.closest('.fixed').remove(); openChatModal('${listing._id}', '${listing.title}')" class="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300">
                                        💬 Chat
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function applyMapFilters() {
    const priceFilter = document.getElementById('mapPriceFilter')?.value;
    const countryFilter = document.getElementById('mapCountryFilter')?.value;
    const typeFilter = document.getElementById('mapTypeFilter')?.value;
    const amenityFilter = document.getElementById('mapAmenityFilter')?.value;

    let filtered = allListings;

    if (priceFilter) {
        const [min, max] = priceFilter.includes('+') ? [parseInt(priceFilter.replace('+', '')), Infinity] : priceFilter.split('-').map(Number);
        filtered = filtered.filter(listing => listing.price >= min && (max === undefined || listing.price <= max));
    }

    if (countryFilter) {
        filtered = filtered.filter(listing => listing.country === countryFilter);
    }

    if (typeFilter) {
        filtered = filtered.filter(listing => listing.propertyType === typeFilter);
    }

    if (amenityFilter) {
        filtered = filtered.filter(listing => listing.amenities && listing.amenities.includes(amenityFilter));
    }

    filteredListings = filtered;

    // Update markers and list
    document.getElementById('propertyMarkers').innerHTML = generateWorldwideMarkers();
    document.getElementById('mapPropertiesList').innerHTML = generateEnhancedPropertyCards();
}

function toggleFullscreen() {
    const mapContainer = document.getElementById('worldMapContainer');
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen?.() ||
        mapContainer.mozRequestFullScreen?.() ||
        mapContainer.webkitRequestFullscreen?.() ||
        mapContainer.msRequestFullscreen?.();
    } else {
        document.exitFullscreen?.() ||
        document.mozCancelFullScreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
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
            // Optionally refresh the page or update the specific listing's rating display
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
    const symbol = currentCurrency === 'ETB' ? 'ብር' : '$'; // Simplified symbol logic

    if (currentCurrency === 'USD') {
        return `${symbol}${convertedPrice.toFixed(0)}`;
    } else {
        const usdPrice = price; // Original price in USD
        return `${symbol}${convertedPrice.toFixed(0)} (~$${usdPrice})`;
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
        } else if (lowerMessage.includes('account') || lowerMessage.includes('register')) {
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

// Add missing utility functions
function showOnMap(listingId) {
    const listing = allListings.find(l => l._id === listingId);
    if (listing) {
        alert(`Showing ${listing.title} on map - Feature coming soon!`);
    }
}

function toggleView() {
    alert('View toggle feature coming soon!');
}

function showLoginModal() {
    window.location.href = '/login.html';
}

function showRegisterModal() {
    window.location.href = '/login.html';
}

// Booking and Payment Functions
let currentBookingData = null;
let paymentIntent = null;

function openBookingModal(listingId, title, price) {
    if (!currentUser) {
        alert('Please login to make a booking');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full my-8 max-h-screen overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">📅 Book Your Stay</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <!-- Property Info -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 class="font-bold text-lg text-gray-800 mb-2">${title}</h3>
                    <p class="text-blue-600 font-semibold">Starting at ${formatPrice(price)} per night</p>
                </div>

                <!-- Booking Form -->
                <form id="bookingForm" class="space-y-6">
                    <!-- Dates and Guests -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                            <input type="date" id="checkInDate" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                            <input type="date" id="checkOutDate" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                        <select id="guestCount" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5 Guests</option>
                            <option value="6">6+ Guests</option>
                        </select>
                    </div>

                    <!-- Guest Information -->
                    <div class="border-t pt-6">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">Guest Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input type="text" id="guestName" value="${currentUser.username}" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" id="guestEmail" value="${currentUser.email}" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" id="guestPhone" placeholder="+1 (555) 123-4567" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <!-- Special Requests -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                        <textarea id="specialRequests" placeholder="Any special requests or messages for the host..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                    </div>

                    <!-- Price Breakdown -->
                    <div id="priceBreakdown" class="hidden bg-gray-50 p-4 rounded-lg border">
                        <h4 class="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span id="basePriceText">$0 x 0 nights</span>
                                <span id="basePriceAmount">$0</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Service fee</span>
                                <span id="serviceFeeAmount">$0</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Cleaning fee</span>
                                <span id="cleaningFeeAmount">$50</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Taxes</span>
                                <span id="taxesAmount">$0</span>
                            </div>
                            <hr class="my-2">
                            <div class="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span id="totalAmount">$0</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex space-x-3 pt-4">
                        <button type="button" onclick="calculatePrice()" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors" id="calculateBtn">
                            Calculate Price
                        </button>
                        <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors hidden" id="proceedBtn">
                            Proceed to Payment
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

    // Setup booking form
    setupAdvancedBookingForm(listingId, price);
}

function setupAdvancedBookingForm(listingId, nightlyPrice) {
    currentBookingData = { listingId, nightlyPrice };

    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');
    const bookingForm = document.getElementById('bookingForm');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    checkInInput.addEventListener('change', () => {
        if (checkInInput.value) {
            const nextDay = new Date(checkInInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];

            // Clear checkout if it's before the new minimum
            if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                checkOutInput.value = '';
            }
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        proceedToPayment();
    });
}

async function calculatePrice() {
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guestCount').value;

    if (!checkIn || !checkOut) {
        alert('Please select both check-in and check-out dates');
        return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        alert('Check-out date must be after check-in date');
        return;
    }

    try {
        const response = await axios.post('/api/calculate-price', {
            listingId: currentBookingData.listingId,
            checkIn,
            checkOut,
            guests: parseInt(guests)
        });

        const pricing = response.data;

        // Update price breakdown
        document.getElementById('basePriceText').textContent = pricing.breakdown.basePrice;
        document.getElementById('basePriceAmount').textContent = `$${pricing.subtotal}`;
        document.getElementById('serviceFeeAmount').textContent = `$${pricing.serviceFee}`;
        document.getElementById('cleaningFeeAmount').textContent = `$${pricing.cleaningFee}`;
        document.getElementById('taxesAmount').textContent = `$${pricing.taxes}`;
        document.getElementById('totalAmount').textContent = `$${pricing.total}`;

        // Show breakdown and enable proceed button
        document.getElementById('priceBreakdown').classList.remove('hidden');
        document.getElementById('calculateBtn').classList.add('hidden');
        document.getElementById('proceedBtn').classList.remove('hidden');

        // Store pricing data
        currentBookingData.pricing = pricing;

    } catch (error) {
        alert('Error calculating price: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function proceedToPayment() {
    if (!currentBookingData.pricing) {
        alert('Please calculate price first');
        return;
    }

    const guestInfo = {
        name: document.getElementById('guestName').value,
        email: document.getElementById('guestEmail').value,
        phone: document.getElementById('guestPhone').value
    };

    if (!guestInfo.name || !guestInfo.email) {
        alert('Please fill in guest name and email');
        return;
    }

    // Close booking modal and open payment modal
    document.querySelector('.fixed').remove();
    openPaymentModal();
}

function openPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full my-8 max-h-screen overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">💳 Complete Payment</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
            </div>

            <div class="p-6">
                <!-- Booking Summary -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                    <div class="text-sm space-y-1">
                        <p><strong>Check-in:</strong> ${new Date(document.getElementById('checkInDate').value).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> ${new Date(document.getElementById('checkOutDate').value).toLocaleDateString()}</p>
                        <p><strong>Guests:</strong> ${document.getElementById('guestCount').value}</p>
                        <p><strong>Nights:</strong> ${currentBookingData.pricing.nights}</p>
                        <p class="text-lg font-bold text-green-600 pt-2">Total: $${currentBookingData.pricing.total}</p>
                    </div>
                </div>

                <!-- Payment Form -->
                <form id="paymentForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                            <input type="text" id="cvcCode" placeholder="123" maxlength="4" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input type="text" id="cardholderName" placeholder="John Doe" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div class="flex items-center">
                            <span class="text-yellow-600 mr-2">🔒</span>
                            <p class="text-sm text-yellow-800">Your payment information is encrypted and secure</p>
                        </div>
                    </div>

                    <div class="flex items-center">
                        <input type="checkbox" id="termsAgreement" required class="mr-2">
                        <label for="termsAgreement" class="text-sm text-gray-600">
                            I agree to the <a href="#" class="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" class="text-blue-600 hover:underline">Cancellation Policy</a>
                        </label>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors" id="payButton">
                            Pay $${currentBookingData.pricing.total}
                        </button>
                        <button type="button" onclick="this.closest('.fixed').remove(); openBookingModal(${currentBookingData.listingId}, '${document.querySelector('h3').textContent}', ${currentBookingData.nightlyPrice})" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors">
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupPaymentForm();
}

function setupPaymentForm() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const cvcInput = document.getElementById('cvcCode');
    const paymentForm = document.getElementById('paymentForm');

    // Format card number input
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedInputValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedInputValue;
    });

    // Format expiry date input
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0,2) + '/' + value.substring(2,4);
        }
        e.target.value = value;
    });

    // CVC input restriction
    cvcInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    paymentForm.addEventListener('submit', processPayment);
}

async function processPayment(e) {
    e.preventDefault();

    const payButton = document.getElementById('payButton');
    const originalText = payButton.textContent;
    payButton.textContent = 'Processing...';
    payButton.disabled = true;

    try {
        // Create payment intent
        const paymentIntentResponse = await axios.post('/api/create-payment-intent', {
            amount: currentBookingData.pricing.total,
            currency: 'usd'
        });

        paymentIntent = paymentIntentResponse.data;

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Confirm payment
        const confirmResponse = await axios.post('/api/confirm-payment', {
            paymentIntentId: paymentIntent.id,
            amount: currentBookingData.pricing.total,
            paymentMethod: {
                card: {
                    brand: 'visa',
                    last4: document.getElementById('cardNumber').value.slice(-4)
                }
            }
        });

        if (confirmResponse.data.status === 'succeeded') {
            // Create booking
            await createBooking(paymentIntent.id);
        } else {
            throw new Error('Payment failed');
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed: ' + (error.response?.data?.error || 'Please check your card details and try again'));
        payButton.textContent = originalText;
        payButton.disabled = false;
    }
}

async function createBooking(paymentIntentId) {
    try {
        const bookingData = {
            listingId: currentBookingData.listingId,
            checkIn: document.getElementById('checkInDate').value,
            checkOut: document.getElementById('checkOutDate').value,
            guests: parseInt(document.getElementById('guestCount').value),
            totalPrice: currentBookingData.pricing.total,
            paymentIntentId,
            guestInfo: {
                name: document.getElementById('guestName').value,
                email: document.getElementById('guestEmail').value,
                phone: document.getElementById('guestPhone').value
            },
            specialRequests: document.getElementById('specialRequests').value
        };

        const response = await axios.post('/api/bookings', bookingData);

        if (response.data.success) {
            // Close payment modal and show success
            document.querySelector('.fixed').remove();
            showBookingConfirmation(response.data.booking);
        }

    } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

function showBookingConfirmation(booking) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6 text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h2 class="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>

                <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 class="font-semibold text-gray-800 mb-2">Booking Details</h3>
                    <div class="text-sm space-y-1">
                        <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
                        <p><strong>Property:</strong> ${booking.listing.title}</p>
                        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p><strong>Guests:</strong> ${booking.guests}</p>
                        <p><strong>Total Paid:</strong> $${booking.pricing.total}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <button onclick="viewMyBookings(); this.closest('.fixed').remove()" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                        View My Bookings
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors">
                        Continue Browsing
                    </button>
                </div>

                <p class="text-xs text-gray-500 mt-4">
                    A confirmation email has been sent to ${booking.guest.email}
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

async function viewMyBookings() {
    if (!currentUser) {
        alert('Please login to view your bookings');
        return;
    }

    try {
        const response = await axios.get('/api/my-bookings');
        const bookings = response.data;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-4xl w-full my-8 max-h-screen overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold text-gray-800">📅 My Bookings</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                </div>

                <div class="p-6">
                    ${bookings.length === 0 ? `
                        <div class="text-center text-gray-500 py-8">
                            <div class="text-4xl mb-4">📅</div>
                            <p>No bookings yet</p>
                            <button onclick="this.closest('.fixed').remove()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                                Start Browsing Properties
                            </button>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            ${bookings.map(booking => `
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                    <div class="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 class="font-semibold text-lg">${booking.listing.title}</h3>
                                            <p class="text-gray-600">${booking.listing.address}</p>
                                            <p class="text-xs text-gray-500">Booking #${booking.bookingNumber}</p>
                                        </div>
                                        <div class="text-right">
                                            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p class="text-gray-500">Check-in</p>
                                            <p class="font-semibold">${new Date(booking.checkIn).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">Check-out</p>
                                            <p class="font-semibold">${new Date(booking.checkOut).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">Guests</p>
                                            <p class="font-semibold">${booking.guests}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">Total</p>
                                            <p class="font-semibold text-green-600">$${booking.pricing.total}</p>
                                        </div>
                                    </div>

                                    <div class="flex space-x-2 mt-4">
                                        <button onclick="viewBookingDetails(${booking._id})" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                            View Details
                                        </button>
                                        ${booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() ? `
                                            <button onclick="cancelBooking(${booking._id})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                                Cancel
                                            </button>
                                        ` : ''}
                                        <button onclick="openChatModal('${booking.listingId}', '${booking.listing.title}')" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                            💬 Contact Host
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;

        document.body.appendChild(modal);

    } catch (error) {
        console.error('Error loading bookings:', error);
        alert('Error loading bookings: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function viewBookingDetails(bookingId) {
    try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        const booking = response.data;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full my-8 max-h-screen overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold text-gray-800">📋 Booking Details</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                </div>

                <div class="p-6 space-y-6">
                    <!-- Property Info -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-bold text-lg mb-2">${booking.listing.title}</h3>
                        <p class="text-gray-600">${booking.listing.address}</p>
                        <p class="text-sm text-gray-500 mt-1">Host: ${booking.listing.hostName}</p>
                    </div>

                    <!-- Booking Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3">Booking Information</h4>
                            <div class="space-y-2 text-sm">
                                <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
                                <p><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></p>
                                <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
                                <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
                                <p><strong>Nights:</strong> ${booking.nights}</p>
                                <p><strong>Guests:</strong> ${booking.guests}</p>
                                <p><strong>Booked:</strong> ${new Date(booking.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3">Guest Information</h4>
                            <div class="space-y-2 text-sm">
                                <p><strong>Name:</strong> ${booking.guest.name}</p>
                                <p><strong>Email:</strong> ${booking.guest.email}</p>
                                <p><strong>Phone:</strong> ${booking.guest.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Price Breakdown -->
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>$${booking.pricing.basePrice} x ${booking.nights} nights</span>
                                    <span>$${booking.pricing.subtotal}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Service fee</span>
                                    <span>$${booking.pricing.serviceFee}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Cleaning fee</span>
                                    <span>$${booking.pricing.cleaningFee}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Taxes</span>
                                    <span>$${booking.pricing.taxes}</span>
                                </div>
                                <hr class="my-2">
                                <div class="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>$${booking.pricing.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${booking.specialRequests ? `
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3">Special Requests</h4>
                            <div class="bg-blue-50 rounded-lg p-4">
                                <p class="text-sm">${booking.specialRequests}</p>
                            </div>
                        </div>
                    ` : ''}

                    ${booking.cancellation ? `
                        <div>
                            <h4 class="font-semibold text-red-800 mb-3">Cancellation Details</h4>
                            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div class="text-sm space-y-2">
                                    <p><strong>Cancelled:</strong> ${new Date(booking.cancellation.cancelledAt).toLocaleDateString()}</p>
                                    <p><strong>Reason:</strong> ${booking.cancellation.reason}</p>
                                    <p><strong>Refund Amount:</strong> $${booking.cancellation.refundAmount}</p>
                                    <p><strong>Cancellation Fee:</strong> $${booking.cancellation.cancellationFee}</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Actions -->
                    <div class="flex space-x-3">
                        ${booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() ? `
                            <button onclick="cancelBooking(${booking._id})" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                Cancel Booking
                            </button>
                        ` : ''}
                        <button onclick="openChatModal('${booking.listingId}', '${booking.listing.title}')" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            💬 Contact Host
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

    } catch (error) {
        console.error('Error loading booking details:', error);
        alert('Error loading booking details: ' + (error.response?.data?.error || 'Unknown error'));
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking? Cancellation fees may apply based on our policy.')) {
        return;
    }

    const reason = prompt('Please provide a reason for cancellation (optional):') || 'No reason provided';

    try {
        const response = await axios.post(`/api/bookings/${bookingId}/cancel`, { reason });

        if (response.data.success) {
            alert(`Booking cancelled successfully. Refund amount: $${response.data.refundAmount}`);

            // Close any open modals and refresh bookings
            document.querySelectorAll('.fixed').forEach(modal => modal.remove());
            setTimeout(() => viewMyBookings(), 500);
        }

    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking: ' + (error.response?.data?.error || 'Unknown error'));
    }
}