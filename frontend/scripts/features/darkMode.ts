// scripts/features/darkmode.ts
import { elements } from '../dom/elements.js';
import { applyMapStyle, readyForStyle } from './maps/mapManager.js';

//Styles for map api to update
export const darkModeMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

export const lightModeMapStyle = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
];

//Core dark mode handling
export function toggleDarkMode(): void {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');

  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
  updateDarkModeButtonText(isDarkMode);

  if (readyForStyle()) {
    console.log('Updating map styles for dark mode:', isDarkMode);
    applyMapStyle(isDarkMode ? darkModeMapStyle : lightModeMapStyle);
  }
}

export function loadDarkModePreference(): void {
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference === 'enabled') {
    document.body.classList.add('dark-mode');
    updateDarkModeButtonText(true);

    // Apply immediately if map already loaded
    if (readyForStyle()) {
      applyMapStyle(darkModeMapStyle);
    }
  }
}

function updateDarkModeButtonText(isDarkMode: boolean): void {
  const darkModeText = elements.darkModeToggle.querySelector('.dark-mode-text');
  if (darkModeText) {
    darkModeText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
  }
}
//exported utility
export function currTheme():boolean{
  return document.body.classList.contains('dark-mode')
}