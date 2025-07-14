
let listings = [];

// Load listings when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadListings();
    setupForm();
});

async function loadListings() {
    try {
        const response = await axios.get('/api/listings');
        listings = response.data;
        renderListings();
    } catch (error) {
        console.error('Error loading listings:', error);
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
                    <div class="text-2xl font-bold text-green-600">
                        $${listing.price}
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
        
        const formData = new FormData();
        const images = document.getElementById('images').files;
        
        // Add images to FormData
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
        
        // Add other form fields
        formData.append('title', document.getElementById('title').value);
        formData.append('address', document.getElementById('address').value);
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
            await axios.post('/api/listings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
