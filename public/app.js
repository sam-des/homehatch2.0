
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
        <div class="border p-4 rounded shadow bg-white">
            <h3 class="text-xl font-bold mb-2">${listing.title}</h3>
            <p class="text-gray-600 mb-2">${listing.address} • $${listing.price}</p>
            <p class="mb-3">${listing.description}</p>
            <div class="mb-3">
                <h4 class="font-semibold mb-1">Amenities:</h4>
                <ul class="text-sm">
                    ${listing.amenities.map(amenity => `<li>✔ ${amenity.trim()}</li>`).join('')}
                </ul>
            </div>
            ${listing.images.length > 0 ? `
                <div class="grid grid-cols-2 gap-2">
                    ${listing.images.map(src => `
                        <img src="${src}" alt="Property image" class="h-32 w-full object-cover rounded">
                    `).join('')}
                </div>
            ` : ''}
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
