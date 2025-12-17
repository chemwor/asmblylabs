const leaflet = {
  init() {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      return;
    }

    // Fix Leaflet's default icon path issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
      iconUrl: '/images/leaflet/marker-icon.png',
      shadowUrl: '/images/leaflet/marker-shadow.png',
    });

    // Initialize the map centered on Smyrna, Georgia
    const leafletMap = L.map('map').setView([33.8839, -84.5144], 13);

    // Add tile layer with better styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    // Add marker for Asmbly Labs headquarters
    L.marker([33.8839, -84.5144]).addTo(leafletMap)
        .bindPopup('<strong>Asmbly Labs Headquarters</strong><br>Smyrna, Georgia 30080')
        .openPopup();

    // Handle window resize for responsive design
    window.addEventListener('resize', () => {
      leafletMap.invalidateSize();
    });

    // Add zoom control
    leafletMap.zoomControl.setPosition('bottomright');
  },
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  leaflet.init();
});
