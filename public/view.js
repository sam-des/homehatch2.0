
let allListings = [];
let filteredListings = [];

// Load listings when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadListings();
    setupSearch();
    setupScrollGradient();
});

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
                
                <div class="flex space-x-3">
                    <button onclick="viewDetails('${listing._id}')" class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                        👁️ View Details
                    </button>
                    <button onclick="openPurchaseModal('${listing._id}', '${listing.title}', ${listing.price})" class="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg">
                        💰 Purchase
                    </button>
                    ${listing.contact?.email ? `<button onclick="contactSeller('${listing.contact.email}', '${listing.title}')" class="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg">📧 Contact</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchTitle = document.getElementById('searchTitle');
    const maxPrice = document.getElementById('maxPrice');
    
    searchBtn.addEventListener('click', performSearch);
    searchTitle.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    maxPrice.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

function performSearch() {
    const titleQuery = document.getElementById('searchTitle').value.toLowerCase();
    const maxPriceValue = parseFloat(document.getElementById('maxPrice').value);
    
    filteredListings = allListings.filter(listing => {
        const matchesTitle = !titleQuery || listing.title.toLowerCase().includes(titleQuery);
        const matchesPrice = !maxPriceValue || listing.price <= maxPriceValue;
        return matchesTitle && matchesPrice;
    });
    
    renderListings();
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
