// scripts/app/types.ts
export interface SearchResult { 
    address: string; 
    timestamp: Date; 
}

export interface SearchSettings {
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

export interface PlaceResult {
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  location: { 
    lat: number; 
    lng: number 
    };
  types: string[];
}

export interface CategoryResults {
  category: string;
  subcategory: string;
  places: PlaceResult[];
}

export interface SearchResponse {
  searchLocation: { 
    lat: number; 
    lng: number; 
    formattedAddress: string; 
    };
  radius: number;
  results: CategoryResults[];
}