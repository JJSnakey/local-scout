// /src/routes/places.ts
import express, { Request, Response, Router } from 'express';
import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js';

const router: Router = express.Router();
const client = new Client({});

interface SearchQuery {
    address: string;
    radius: number;
    categories: {
        dailyLiving: boolean;
        food: boolean;
        lifestyle: boolean;
        transportation: boolean;
        community: boolean;
        healthcare: boolean;
    };
}

interface PlaceResult {
    name: string;
    address: string;
    rating?: number;
    userRatingsTotal?: number;
    location: {
        lat: number;
        lng: number;
    };
    types: string[];
}

interface CategoryResults {
    category: string;
    subcategory: string;
    places: PlaceResult[];
}

// Map categories to Google Places types
const CATEGORY_MAPPINGS = {
    dailyLiving: [
    { name: 'Grocery Stores', types: ['supermarket', 'convenience_store'] },
    { name: 'Shops & Services', types: ['store', 'hardware_store', 'home_goods_store', 'electronics_store', 'clothing_store'] },
    { name: 'Gas Stations & EV Charging', types: ['gas_station', 'electric_vehicle_charging_station'] },
    { name: 'Post Office & Shipping', types: ['post_office'] },
    { name: 'Banks & ATMs', types: ['bank', 'atm'] },
    { name: 'Laundromats & Dry Cleaners', types: ['laundry'] }
  ],

  food: [
    { name: 'Restaurants', types: ['restaurant'] },
    { name: 'Cafes & Bakeries', types: ['cafe', 'bakery'] },
    { name: 'Bars & Nightlife', types: ['bar', 'night_club'] },
  ],

  lifestyle: [
    { name: 'Gyms & Fitness', types: ['gym'] },
    { name: 'Parks & Recreation', types: ['park'] },
    { name: 'Golf Courses', types: ['golf_course'] },
    { name: 'Libraries & Museums', types: ['library', 'museum', 'art_gallery'] },
    { name: 'Entertainment Venues', types: ['movie_theater', 'bowling_alley', 'amusement_park', 'stadium'] }
  ],

  transportation: [
    { name: 'Public Transit', types: ['transit_station', 'bus_station', 'subway_station', 'train_station'] },
    { name: 'Airports', types: ['airport'] },
    { name: 'Bicycle & Scooter Rentals', types: ['bicycle_store'] },
    { name: 'Car Services', types: ['car_repair', 'car_wash', 'car_rental', 'car_dealer', 'parking'] }
  ],

  community: [
    { name: 'Community Centers', types: ['city_hall'] }, // no native 'community_center' type
    { name: 'Religious Centers', types: ['church', 'mosque', 'synagogue', 'hindu_temple'] },
    { name: 'Police & Fire Departments', types: ['police', 'fire_station'] },
    { name: 'Courthouses & Public Services', types: ['courthouse'] },
    { name: 'Schools & Universities', types: ['school', 'primary_school', 'secondary_school', 'university'] }
  ],

  healthcare: [
    { name: 'Hospitals & Clinics', types: ['hospital', 'doctor'] },
    { name: 'Urgent Care', types: ['health'] },
    { name: 'Dental & Vision', types: ['dentist'] },
    { name: 'Veterinary', types: ['veterinary_care'] },
    { name: 'Pharmacies', types: ['pharmacy'] }
  ]
};

//API Routes

// Search for places near an address
router.post('/search', async (req: Request, res: Response) => {
    try {
        console.log('Received search request:', req.body);

        const { address, radius, categories }: SearchQuery = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            console.error('Google Places API key not configured');
            return res.status(500).json({ error: 'Google Places API key not configured' });
        }

        console.log('Geocoding address:', address);

        // Geocode the address
        const geocodeResponse = await client.geocode({
            params: {
                address: address,
                key: apiKey
            }
        });

        if (geocodeResponse.data.results.length === 0) {
            console.log('Address not found:', address);
            return res.status(404).json({ error: 'Address not found' });
        }

        const location = geocodeResponse.data.results[0].geometry.location;
        const radiusInMeters = radius * 1609.34;

        console.log('Search location:', location);
        console.log('Radius in meters:', radiusInMeters);
        console.log('Categories:', categories);

        const results: CategoryResults[] = [];

        // Search for each enabled category
        for (const [categoryKey, categoryConfig] of Object.entries(CATEGORY_MAPPINGS)) {
            const categoryEnabled = categories[categoryKey as keyof typeof categories];
            console.log(`Category ${categoryKey}: ${categoryEnabled}`);
            
            if (!categoryEnabled) {
                continue;
            }

            for (const subcategory of categoryConfig) {
                console.log(`Searching for: ${subcategory.name}`);
                const places: PlaceResult[] = [];

                // Search for each type in the subcategory
                for (const type of subcategory.types) {
                    try {
                        console.log(`  - Searching type: ${type}`);
                        const searchResponse = await client.placesNearby({
                            params: {
                                location: location,
                                radius: radiusInMeters,
                                type: type,
                                key: apiKey
                            }
                        });

                        console.log(`  - Found ${searchResponse.data.results.length} results for ${type}`);

                        // Add places to results (limit to top 5 per type)
                        for (const place of searchResponse.data.results.slice(0, 5)) {
                            if (place.geometry?.location && place.name) {
                                places.push({
                                    name: place.name,
                                    address: place.vicinity || 'Address not available',
                                    rating: place.rating,
                                    userRatingsTotal: place.user_ratings_total,
                                    location: {
                                        lat: place.geometry.location.lat,
                                        lng: place.geometry.location.lng
                                    },
                                    types: place.types || []
                                });
                            }
                        }

                        // Add delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } catch (error: any) {
                        console.error(`Error searching for ${type}:`, error.message);
                        if (error.response) {
                            console.error('API Error Response:', error.response.data);
                        }
                    }
                }

                // Remove duplicates and sort by rating
                const uniquePlaces = Array.from(
                    new Map(places.map(p => [p.name, p])).values()
                ).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);

                if (uniquePlaces.length > 0) {
                    results.push({
                        category: categoryKey,
                        subcategory: subcategory.name,
                        places: uniquePlaces
                    });
                }
            }
        }

        console.log(`Search completed. Found ${results.length} result groups`);

        res.json({
            searchLocation: {
                lat: location.lat,
                lng: location.lng,
                formattedAddress: geocodeResponse.data.results[0].formatted_address
            },
            radius: radius,
            results: results
        });

    } catch (error: any) {
        console.error('Error searching places:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('API Error Response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to search places',
            details: error.message 
        });
    }
});

// Autocomplete address suggestions
router.get('/autocomplete', async (req: Request, res: Response) => {
    try {
        const input = req.query.input as string;

        if (!input) {
            return res.status(400).json({ error: 'Input is required' });
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Google Places API key not configured' });
        }

        const response = await client.placeAutocomplete({
            params: {
                input: input,
                key: apiKey
            }
        });

        res.json({
            predictions: response.data.predictions
        });

    } catch (error) {
        console.error('Error with autocomplete:', error);
        res.status(500).json({ error: 'Failed to get autocomplete suggestions' });
    }
});

export default router;
