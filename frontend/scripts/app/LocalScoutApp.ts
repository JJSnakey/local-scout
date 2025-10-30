// scripts/app/LocalScoutApp.ts
import { elements } from '../dom/elements.js';
import { SearchResult, SearchSettings } from '../app/types.js';
import { loadGoogleMap } from '../features/maps/mapManager.js';
import { performSearch } from '../features/search.js';
import { loadDarkModePreference, toggleDarkMode } from '../features/darkMode.js';

//Main applicaiton class
export class LocalScoutApp {
  private searchHistory: SearchResult[] = [];
  private settings: SearchSettings = {
    radius: 5,
    categories: {
      dailyLiving: true,
      food: true,
      lifestyle: true,
      transportation: true,
      community: true,
      healthcare: true
    }
  };
  private isSearching: boolean = false;

  constructor() {
    this.initializeEventListeners();
    this.initializeApp();
  }

  //setup base state
  private async initializeApp(): Promise<void> {
    loadDarkModePreference();
    await loadGoogleMap();
    this.logAppReady();
  }

  //setup all listener
  private initializeEventListeners(): void {
    console.log('Initializing event listeners...');
    const { searchBtn, searchInput, closeResultsBtn, radiusSlider, darkModeToggle, dailyLiving, food, lifestyle, transportation, community, healthcare } = elements;

    // Search Function
    searchBtn.addEventListener('click', () => this.handleSearch());
    searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    // Radius slider
    radiusSlider.addEventListener('input', (e: Event) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.updateRadius(value);
    });

    // Resultts sidebar close button
    closeResultsBtn.addEventListener('click', () => elements.resultsSidebar.classList.remove('visible'));


     // Category toggles
      dailyLiving.addEventListener('change', () => {
          this.settings.categories.dailyLiving = dailyLiving.checked;
          this.logSettings();
      });

      food.addEventListener('change', () => {
          this.settings.categories.food = food.checked;
          this.logSettings();
      });

      lifestyle.addEventListener('change', () => {
          this.settings.categories.lifestyle = lifestyle.checked;
          this.logSettings();
      });

      transportation.addEventListener('change', () => {
          this.settings.categories.transportation = transportation.checked;
          this.logSettings();
      });

      community.addEventListener('change', () => {
          this.settings.categories.community = community.checked;
          this.logSettings();
      });

      healthcare.addEventListener('change', () => {
          this.settings.categories.healthcare = healthcare.checked;
          this.logSettings();
      })

    // Dark mode toggle
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => toggleDarkMode());
    }
    console.log('Event listeners initialized');
  }

  //Slider activate
  private updateRadius(value: number): void {
    this.settings.radius = value;
    if (elements.radiusValue) elements.radiusValue.textContent = value.toString();
    console.log('Search radius updated:', value);
  }

  //Search function // calling API
  private async handleSearch(): Promise<void> {
    const address = elements.searchInput.value.trim();
    //Edge Uses
    if (!address) {
        alert('Please enter an address');
        return;
    }
    if (this.isSearching) {
        return;
    }
    this.isSearching = true;
    elements.searchBtn.disabled = true;

    //Search attempt
    try {
      //this.show loading
      elements.resultsSidebar.classList.add('visible');

      //make API call
      await performSearch(address, this.settings);
      this.addToHistory(address);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      this.isSearching = false;
      elements.searchBtn.disabled = false;
    }
  }

  //Add search to in-memory histor
  private addToHistory(address: string): void {
    this.searchHistory.push({ address, timestamp: new Date() });
    console.log('Search history:', this.searchHistory);
  }

  //utilitites
  private logSettings(): void {
    console.log('Settings updated:', this.settings);
  }

  private logAppReady(): void {
    console.log('%cLocal Scout initialized', 'color: #2E8B57; font-weight: bold;');
    console.log('Initial settings:', this.settings);
  }
}