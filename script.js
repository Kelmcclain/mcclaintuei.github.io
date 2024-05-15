document.addEventListener('DOMContentLoaded', function () {
  // Hide the loading screen when the page is fully loaded
  window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
  });
});

function displayUTCTime() {
  const utcTimeElement = document.getElementById('utc-time');

  function updateUTC() {
    const now = new Date();
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const minute = now.getUTCMinutes().toString().padStart(2, '0');
    const second = now.getUTCSeconds().toString().padStart(2, '0');

    const timeString = `${hour}:${minute}:${second} UTC`;

    utcTimeElement.textContent = timeString;
  }

  updateUTC();
  setInterval(updateUTC, 1000);
}
displayUTCTime();
let isProfileMenuVisible = false;
document.querySelector('.profile-icon-container')
  .addEventListener('click', () => {
    const profileMenu = document.querySelector('.profile-popup')
    if (isProfileMenuVisible) {
      profileMenu.style.height = "0px"
    } else {
      profileMenu.style.height = "7rem"
    }
    isProfileMenuVisible = !isProfileMenuVisible;

  })








let map;
let autocomplete;
let marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.730610, lng: -73.935242 },
    zoom: 8,
    styles: [{
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }] // Hide business names
    }, {
      elementType: 'geometry',
      stylers: [{ color: '#242f3e' }]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#242f3e' }]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }]
    }],
    mapTypeControl: false, // Disable map/satellite toggle
    fullscreenControl: false, // Disable fullscreen control
    streetViewControl: false // Disable street view control
  });


  autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'));

  // Optional: Add an event listener for when a place is selected
  autocomplete.addListener('place_changed', function () {
    var place = autocomplete.getPlace();

    // Center the map on the selected location
    map.setCenter(place.geometry.location);
    map.setZoom(15);

    // Move the existing marker to the selected location
    if (marker) {
      marker.setPosition(place.geometry.location);
    } else {
      // If marker doesn't exist, create a new one
      marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        clickable: false // Disable click events on the marker

      });
    }

    // You can access place details here
    console.log(place);
  });

  // Add click event listener to the map
  google.maps.event.addListener(map, 'click', function (event) {
    // Get the clicked coordinates
    var clickedLocation = event.latLng;

    // Perform reverse geocoding to get the address
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'location': clickedLocation
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // Update the input field with the clicked address
          document.getElementById('address').value = results[0].formatted_address;

          // Move the marker to the clicked location
          if (marker) {
            marker.setPosition(clickedLocation);
          } else {
            // If marker doesn't exist, create a new one
            marker = new google.maps.Marker({
              map: map,
              position: clickedLocation,
              title: results[0].formatted_address,
              clickable: false // Disable click events on the marker

            });
          }

          // Center the map on the clicked location
          map.setCenter(clickedLocation);
          map.setZoom(15);
        }
      }
    });
  });
}