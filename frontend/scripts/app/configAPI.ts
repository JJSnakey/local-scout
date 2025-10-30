// scripts/app/configAPI.ts
//dev
export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;
//prod
//export const API_BASE_URL = '/api';
export const GOOGLE_MAPS_BROWSER_KEY = '[key here]'
//Note that this key is exposed to the browser via placesAPI, to render a map it has to be available 
//It is securely limitted in the Google Cloud Console and is not a risk
