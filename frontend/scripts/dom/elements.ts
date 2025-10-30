// scripts/dom/elements.ts
export const elements = {
  /*Dom Elements*/
  searchInput: document.getElementById('address-input') as HTMLInputElement,
  searchBtn: document.getElementById('search-btn') as HTMLButtonElement,
  mapContainer: document.getElementById('map') as HTMLDivElement,
  googleMapDiv: document.getElementById('google-map') as HTMLDivElement,
  mapPlaceholder: document.getElementById('map-placeholder') as HTMLDivElement,
  mapLegend: document.getElementById('map-legend') as HTMLDivElement,
  radiusSlider: document.getElementById('radius-slider') as HTMLInputElement,
  radiusValue: document.getElementById('radius-value') as HTMLSpanElement,
  resultsSidebar: document.getElementById('results-sidebar') as HTMLElement,
  resultsContent: document.getElementById('results-content') as HTMLElement,
  closeResultsBtn: document.getElementById('close-results') as HTMLButtonElement,
  darkModeToggle: document.getElementById('dark-mode-toggle') as HTMLButtonElement,
  /*toggles*/ 
  dailyLiving: document.getElementById('toggle-daily-living') as HTMLInputElement,
  food: document.getElementById('toggle-food') as HTMLInputElement,
  lifestyle: document.getElementById('toggle-lifestyle') as HTMLInputElement,
  transportation: document.getElementById('toggle-transportation') as HTMLInputElement,
  community: document.getElementById('toggle-community') as HTMLInputElement,
  healthcare: document.getElementById('toggle-healthcare') as HTMLInputElement
};
