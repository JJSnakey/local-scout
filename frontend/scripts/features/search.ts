// scripts/features/search.ts
import { API_BASE_URL } from '../app/configAPI.js';
import { elements } from '../dom/elements.js';
import { renderResults, showError } from './resultsRenderer.js';
import { SearchResponse, SearchSettings } from '../app/types.js';
import { displayOnMap } from './maps/mapManager.js'

//Main search call
export async function performSearch(address: string, settings: SearchSettings): Promise<void> {
  try {
    console.log("Attempting Search")
    showLoading()
    
    const res = await fetch(`${API_BASE_URL}/places/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: address,
        radius: settings.radius,
        categories: settings.categories
      })
    });

    if (!res.ok) throw new Error('Search failed');
    const data: SearchResponse = await res.json();
    
    renderResults(data);
    displayOnMap(data)
    
    hidePlaceholder()
    showLegend()

  } catch (err) {
    console.error(err);
    showError('Failed to search.');
  }
}

//Remove middle of screen instructions
function hidePlaceholder(): void {
    // Hide map placeholder
    if (elements.mapPlaceholder) {
        elements.mapPlaceholder.style.display = 'none';
    }
}
//Map Legend
function showLegend(): void {
  // Show map legend
    if (elements.mapLegend) {
        elements.mapLegend.style.display = 'block';
    }
}

//Load Spinner 
function showLoading(): void {
    elements.resultsContent.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Searching for places...</p>
        </div>
    `;
}