
const axios = require('axios');

async function testAPI() {
  try {
    const response = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend is running:', response.data);
    
    const listingsResponse = await axios.get('http://localhost:5000/api/listings');
    console.log('✅ Listings endpoint working. Found', listingsResponse.data.length, 'listings');
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();
