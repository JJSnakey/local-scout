// scripts/features/resultRenderer.ts
import { elements } from '../dom/elements.js';
import { CategoryResults, SearchResponse } from '../app/types.js';

//create presentation of search results
export function renderResults(data: SearchResponse): void {
    if (data.results.length === 0) {
        elements.resultsContent.innerHTML = `
            <div class="results-placeholder">
                <p>No places found</p>
                <p class="results-placeholder-sub">Try increasing your search radius or enabling more categories</p>
            </div>
        `;
        return;
    }

    // Group results by category
    const categoryMap = new Map<string, CategoryResults[]>();
    for (const result of data.results) {
        if (!categoryMap.has(result.category)) {
            categoryMap.set(result.category, []);
        }
        categoryMap.get(result.category)!.push(result);
    }

    // Category display names
    const categoryNames: { [key: string]: string } = {
        dailyLiving: 'Daily Living & Essentials',
        food: 'Food & Entertainment',
        lifestyle: 'Lifestyle & Recreation',
        transportation: 'Transportation & Commute',
        community: 'Community & Social',
        healthcare: 'Healthcare'
    };

    let html = `<div class="search-info">
        <strong>${data.searchLocation.formattedAddress}</strong><br>
        <span>Search radius: ${data.radius} miles</span>
    </div>`;

    // Render each category
    for (const [category, results] of categoryMap) {
        const categoryId = `category-${category}`;
        html += `<div class="category-group">
            <h3 class="category-title collapsible" data-target="${categoryId}">
                <span class="collapse-icon">▼</span>
                ${categoryNames[category] || category}
                <span class="category-count">(${results.reduce((sum, r) => sum + r.places.length, 0)})</span>
            </h3>
            <div class="category-content" id="${categoryId}">`;

        for (const subcategoryResult of results) {
            html += `<div class="subcategory-group">
                <h4 class="subcategory-title">${subcategoryResult.subcategory}</h4>`;

            for (const place of subcategoryResult.places) {
                html += `<div class="place-card">
                    <div class="place-name">${escapeHtml(place.name)}</div>
                    <div class="place-address">${escapeHtml(place.address)}</div>`;

                if (place.rating) {
                    html += `<div class="place-rating">
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <span>${place.rating.toFixed(1)}</span>
                        <span class="place-rating-text">(${place.userRatingsTotal || 0})</span>
                    </div>`;
                }

                html += `</div>`;
            }

            html += `</div>`;
        }

        html += `</div></div>`;
    }

    elements.resultsContent.innerHTML = html;

    // Add click handlers for collapsible categories - use setTimeout to ensure DOM is ready
    setTimeout(() => {
        const collapsibles = document.querySelectorAll('.collapsible');
        console.log('Found collapsibles:', collapsibles.length);
        
        collapsibles.forEach(collapsible => {
            collapsible.addEventListener('click', function(this: HTMLElement) {
                const target = this.getAttribute('data-target');
                const content = document.getElementById(target!);
                const icon = this.querySelector('.collapse-icon');
                
                console.log('Clicked category:', target);
                
                if (content && icon) {
                    content.classList.toggle('collapsed');
                    icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
                    console.log('Toggled:', content.classList.contains('collapsed') ? 'collapsed' : 'expanded');
                }
            });
        });
    }, 0);
}

//Utility - escape special chars
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
//Search Error Display
export function showError(message: string): void {
    elements.resultsContent.innerHTML = `
        <div class="results-placeholder">
            <p style="color: #d93025;">${message}</p>
        </div>
    `;
}