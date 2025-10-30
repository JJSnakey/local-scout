# Local Scout

*Local Scout is a full-stack web app built with TypeScript, Node.js, and AWS that helps users discover nearby amenities using Google Maps and Places APIs.*

<img width="958" height="470" alt="1" src="https://github.com/user-attachments/assets/f6e56fee-681e-4324-92e1-e34be1c60162" />

## Overview

Local Scout is a full-stack web application that helps users discover nearby places and services within a customizable search radius. Built with modern web technologies and deployed on AWS, it provides an intuitive interface for exploring local amenities across six major categories.
This project was developed as part of my full-stack portfolio to demonstrate skills in API integration, cloud deployment, and responsive UI design. 
It showcases modern web development best practices — including RESTful architecture, containerization with Docker, and scalable deployment on AWS EC2.

### Key Features

-  **Smart Search** - Search any address with radius customization (1-100 miles)
-  **Interactive Maps** - Real-time visualization with Google Maps integration
-  **Category Filtering** - Six comprehensive categories with 20+ subcategories:
  - Daily Living & Essentials (grocery stores, gas stations, banks, etc.)
  - Food & Entertainment (restaurants, bars, theaters, etc.)
  - Lifestyle & Recreation (gyms, parks, museums, etc.)
  - Transportation (public transit, car services, etc.)
  - Community & Social (community centers, religious centers, schools)
  - Healthcare (hospitals, clinics, pharmacies, etc.)
-  **Dark Mode** - Full dark theme with persistent user preference
-  **Responsive Design** - Optimized for desktop, tablet, and mobile devices
-  **Visual Markers** - Color-coded location markers by category
-  **Real-time Results** - Dynamic search with collapsible category organization
-  **Secure API** - Environment-based configuration with CORS protection

And its hosted live right now!
[Local-Scout](http://18.117.175.135/)

## Architecture

### Tech Stack

**Frontend:**
- HTML5, CSS
- TypeScript
- ES6 Modules
- Google Maps JavaScript API
- Responsive Web Design

**Backend:**
- Node.js
- Express.js, npm
- TypeScript
- Google Places API
- CORS middleware

**Infrastructure:**
- Docker & Docker Compose
- AWS EC2, AWS ECR
- Environment-based configuration
- Nginx reverse proxy
- Git / Github

## Skills Demonstrated
- Full-stack development with TypeScript and Node.js  
- RESTful API design and Google Maps integration  
- Secure backend configuration with environment variables and CORS  
- Containerization with Docker and deployment on AWS EC2  
- Responsive UI development and mobile optimization  
- Version control and collaborative development with Git/GitHub  


## Screenshots

### Desktop View
<img width="958" height="470" alt="1" src="https://github.com/user-attachments/assets/9a9dd53f-309f-43f2-8143-cef6e33818e9" />


### Mobile Responsive
<img width="185" height="344" alt="mobile" src="https://github.com/user-attachments/assets/9f93d101-63e3-46fb-a1c7-14f322b54623" />


### Dark Mode
<img width="1912" height="980" alt="Darkmode" src="https://github.com/user-attachments/assets/c6f785e6-de45-47d5-9d1d-ab73aa3ae197" />


## Features in Detail

### Search Functionality
- **Geocoding**: Converts addresses to coordinates using Google Geocoding API
- **Radius Control**: Slider from 1-100 miles with real-time updates
- **Category Filtering**: Toggle individual categories on/off
- **Results Organization**: Collapsible categories with place counts

### Map Visualization
- **Color-Coded Markers**: Each category has a unique color
- **Search Radius Circle**: Visual representation of search area
- **Interactive InfoWindows**: Click markers to see place details with ratings
- **Automatic Bounds**: Map auto-adjusts to show all results
- **Dark Mode Integration**: Map styling changes with theme

### User Experience
- **Persistent Preferences**: Dark mode saved in localStorage
- **Responsive Design**: Breakpoints for mobile, tablet, and desktop
- **Loading States**: Spinner and status messages during searches
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation support

### System Design

```
┌─────────────────┐
│   Client Side   │
│   (Browser)     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
    ┌────▼─────┐    ┌─────▼─────┐
    │ Frontend │    │  Backend  │
    │ (Nginx)  │    │ (Express) │
    │  :80     │    │  :3000    │
    └──────────┘    └─────┬─────┘
                          │
                    ┌─────▼──────────┐
                    │  Google APIs   │
                    │ - Maps         │
                    │ - Places       │
                    │ - Geocoding    │
                    └────────────────┘
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Docker & Docker Compose
- Google Cloud Platform account with Maps/Places API enabled
- API Key with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Geocoding API

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/local-scout.git
   cd local-scout
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env and add your GOOGLE_PLACES_API_KEY
   
   # Build TypeScript
   npm run build
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install -g typescript
   
   # Compile TypeScript
   tsc
   
   # Serve with any local server (e.g., Live Server in VS Code)
   ```

4. **Access the application**
   - Frontend: `http://localhost:5500` (or your local server port)
   - Backend: `http://localhost:3000`

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   # From project root
   docker-compose up -d --build
   
   # View logs
   docker-compose logs -f
   
   # Stop containers
   docker-compose down
   ```

2. **Access the application**
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:3000`

## 🔧 Configuration

### API Keys Setup

1. **Google Cloud Console**
   - Create a project
   - Enable required APIs (Maps JavaScript, Places, Geocoding)
   - Create API credentials
   - Restrict API key (HTTP referrers for frontend, IP addresses for backend)

2. **Environment Configuration**
   ```bash
   # Backend (.env)
   GOOGLE_PLACES_API_KEY=your_api_key_here
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:5500
   ```

### Category Customization

Edit `backend/src/routes/places.ts` to modify categories:
```typescript
const CATEGORY_MAPPINGS = {
    categoryName: [
        { name: 'Subcategory Name', types: ['google_place_type'] }
    ]
};
```

## Performance

- **Average Search Time**: < 3 seconds for 6 categories
- **API Rate Limiting**: 200ms delay between requests
- **Results per Category**: Top 10 places per subcategory
- **Caching**: Browser-based with localStorage
- **Bundle Size**: 
  - Frontend: ~150KB (minified)
  - Backend: ~2MB (Docker image)

## Testing

```bash
# Backend tests
cd backend
npm test

# Type checking
npm run build

# Linting
npm run lint
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Joshua Greer**
- LinkedIn: [linkedin.com/in/joshuajgreer](https://www.linkedin.com/in/joshuajgreer/)
- GitHub: [@JJSnakey](https://github.com/JJSnakey)

## Acknowledgments

- Google Maps Platform for mapping and places data
- Icon generated by ChatGPT []
- Hosted on AWS
- Built with guidance from modern web development best practices

## Contact

For questions or feedback, please reach out:
- Email: JoshuaGreer.work@gmail.com
