
let allListings = [];
let filteredListings = [];

// Load listings when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadListings();
    setupSearch();
});

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
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            ${listing.images.length > 0 ? `
                <div class="relative h-48 bg-gray-200">
                    <img src="${listing.images[0]}" alt="${listing.title}" class="w-full h-full object-cover">
                    ${listing.images.length > 1 ? `<div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">+${listing.images.length - 1} more</div>` : ''}
                </div>
            ` : '<div class="h-48 bg-gray-200 flex items-center justify-center"><span class="text-gray-400">No Image</span></div>'}
            
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-gray-900">${listing.title}</h3>
                    <span class="text-2xl font-bold text-green-600">$${listing.price}</span>
                </div>
                
                <p class="text-gray-600 mb-2">${listing.address}</p>
                <p class="text-gray-700 mb-4">${listing.description}</p>
                
                <div class="mb-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Amenities:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${listing.amenities.map(amenity => `
                            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${amenity.trim()}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Contact Information:</h4>
                    <div class="space-y-1 text-sm text-gray-600">
                        <p><strong>Name:</strong> ${listing.contact?.name || 'Not provided'}</p>
                        <p><strong>Email:</strong> ${listing.contact?.email ? `<a href="mailto:${listing.contact.email}" class="text-blue-600 hover:underline">${listing.contact.email}</a>` : 'Not provided'}</p>
                        <p><strong>Phone:</strong> ${listing.contact?.phone ? `<a href="tel:${listing.contact.phone}" class="text-blue-600 hover:underline">${listing.contact.phone}</a>` : 'Not provided'}</p>
                    </div>
                </div>
                
                <div class="mt-4 flex space-x-2">
                    <button onclick="viewDetails('${listing._id}')" class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">View Details</button>
                    ${listing.contact?.email ? `<button onclick="contactSeller('${listing.contact.email}', '${listing.title}')" class="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Contact</button>` : ''}
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
