# HomeHatch - Rental Listing Platform

## Overview

HomeHatch is a comprehensive rental property listing platform that enables users to create, browse, and manage rental property listings. Built with Node.js and Express on the backend and vanilla JavaScript with Tailwind CSS on the frontend, the platform provides a complete rental marketplace experience with user authentication, property management, and booking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Node.js with Express.js for the REST API server
- **Data Storage**: File-based JSON storage system (`data.json`) for persistence
- **Session Management**: In-memory session storage with session IDs
- **File Uploads**: Multer middleware for handling property image uploads
- **Static File Serving**: Express static middleware for serving uploaded images and frontend assets

### Frontend Architecture
- **Framework**: Vanilla JavaScript with no frontend framework dependencies
- **Styling**: Tailwind CSS for responsive design and component styling
- **PWA Features**: Service worker implementation for offline capabilities and app-like experience
- **Internationalization**: Multi-language support (English, French, Amharic) with translation system
- **Maps Integration**: Leaflet.js for property location visualization
- **HTTP Client**: Axios for API communication

### Authentication System
- **Method**: Session-based authentication with username/password
- **Storage**: Sessions stored in memory with automatic cleanup
- **User Roles**: Support for admin and regular user roles
- **Guest Access**: Anonymous browsing capabilities for public property viewing

### Data Models
The application manages several core entities:
- **Users**: Authentication credentials, profile information, and role management
- **Listings**: Property details, images, pricing, and location data
- **Bookings**: Rental reservations and scheduling
- **Purchases**: Transaction records for property rentals
- **Chats**: Real-time messaging system (planned feature)

### File Storage Strategy
- **Property Images**: Local file system storage in `/uploads` directory
- **Data Persistence**: JSON file-based storage for rapid prototyping and development
- **Static Assets**: Served directly through Express static middleware

### Progressive Web App Features
- **Offline Support**: Service worker caching for core functionality
- **Mobile Optimization**: Responsive design with mobile-first approach
- **App Manifest**: Native app-like installation and behavior
- **Touch Gestures**: Mobile-optimized interactions and navigation

## External Dependencies

### Core Dependencies
- **Express.js** (^4.21.2): Web framework for Node.js backend
- **Multer** (^2.0.2): Multipart/form-data handling for file uploads
- **CORS** (^2.8.5): Cross-origin resource sharing middleware

### Frontend Libraries
- **Tailwind CSS** (2.2.19): Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **Leaflet.js** (1.7.1): Open-source mapping library for property locations
- **Inter Font**: Typography from Google Fonts

### Development Tools
- **Node.js** (>=18.0.0): Runtime environment requirement
- **File System**: Native Node.js fs module for data persistence

### Deployment Platform
- **Render**: Cloud platform configured for automatic deployment
- **GitHub Integration**: Repository-based deployment workflow

### Notable Architecture Decisions
- **File-based Storage**: Chosen over database for simplicity and rapid development, with JSON files providing structured data persistence
- **Session-based Auth**: Implemented over JWT for simpler server-side session management
- **Vanilla JavaScript**: Selected over modern frameworks to minimize complexity and bundle size
- **PWA Implementation**: Added for mobile app-like experience and offline functionality
- **Multi-language Support**: Built-in internationalization for global accessibility