
# HomeHatch - Rental Listing Platform

A comprehensive rental property listing platform built with Node.js, Express, and vanilla JavaScript.

## Features

- 🏠 Property listing creation and management
- 👀 Browse and search rental properties
- 🔐 User authentication (login/register)
- 💳 Secure purchase/booking system
- 📱 Responsive design with Tailwind CSS
- 🖼️ Image upload support
- 💬 Real-time chat between users (planned)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/homehatch.git
cd homehatch
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and visit `http://localhost:5000`

## Deployment

### Deploy to Render

1. Fork this repository to your GitHub account
2. Connect your GitHub account to Render
3. Create a new Web Service on Render
4. Connect your forked repository
5. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Node Version**: 18

### Environment Variables

No environment variables are required for basic functionality. The app uses file-based storage by default.

## Project Structure

```
├── public/           # Frontend files (HTML, CSS, JS)
├── uploads/          # User uploaded images
├── server.js         # Main server file
├── data.json         # File-based data storage
└── package.json      # Dependencies and scripts
```

## API Endpoints

- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing (requires auth)
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create purchase
- `POST /api/login` - User login
- `POST /api/register` - User registration

## Default Admin Account

- Username: `admin`
- Password: `admin123`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
