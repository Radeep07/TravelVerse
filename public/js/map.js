// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var ATTR_API_KEY = "5ae2e3f221c38a28845f05b6539092183be7af15887fd47cb35ed3ff";
var ATTR_API_URL = "https://api.opentripmap.com/0.1/en/places/radius";
var map;
var markers;
var bounds;
var places = [];
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
    mapTypeControl: false,
    disableDefaultUI: true,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);  
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }   
   // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
      });      

      var infowindow = new google.maps.InfoWindow()

      google.maps.event.addListener(marker, 'click', (function (marker, place, infowindow) {
        return function () {
          infowindow.setContent('<div><strong>' + place.name + '</strong>');
          infowindow.open(map, marker);
        };
      })(marker, place, infowindow));

      markers.push(marker);

      getAttraction(place);
    });
  });
}

function createMarkers(attractions) {

  for (var i = 0; i < attractions.length; i++) {
    var attr = attractions[i];

    if (attr.name) {
      var icon = {
        path: fontawesome.markers.MAP_PIN,
        scale: 0.3,
        strokeWeight: 0.2,
        strokeColor: 'black',
        strokeOpacity: 1,
        fillColor: '#f8ae5f',
        fillOpacity: 0.9,
      };

      var attr_latlon = new google.maps.LatLng(parseFloat(attr.point.lat), parseFloat(attr.point.lon));
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: attr.name,
        position: attr_latlon
      });

      var infowindow = new google.maps.InfoWindow()

      google.maps.event.addListener(marker, 'click', (function (marker, attr, infowindow) {
        return function () {
          var rate = attr.rate ? attr.rate : 0;
          var starHtml = '';
          for (var i = 0; i < rate; i++) {
            starHtml += "<img src='../images/star.png'></img>";
          }

          var distance;

          if (attr.dist < 1000) {
            distance = parseFloat(attr.dist).toFixed(2) + 'm';
          } else {
            distance = (parseFloat(attr.dist) / 1000).toFixed(2) + 'km';
          }
          infowindow.setContent('<div><strong>' + attr.name + '</strong><br>Distance: ' + distance + '<br>' + starHtml);

          infowindow.open(map, marker);
        };
      })(marker, attr, infowindow));


      markers.push(marker);
      // Only geocodes have viewport.
      bounds.extend(marker.getPosition());
    }
  }

  //center the map to the geometric center of all markers
  map.setCenter(bounds.getCenter());

  map.fitBounds(bounds);

  //remove one zoom level to ensure no marker is on the edge.
  map.setZoom(map.getZoom() + 1);
}

function createAttractionCard(attractions) {
  var attractionCards = $('#attraction-cards');

  var cards = $();
  for (var i = 0; i < attractions.length; i++) {
    var attr = attractions[i];
    if (attr.name) {
      var type = attr.kinds.split(',').join(', ');
      var rate = attr.rate ? attr.rate : 0;
      var starHtml = '';
      for (var j = 0; j < rate; j++) {
        starHtml += "<img src='../images/star.png'></img>";
      }
      cards = cards.add(`<div class="column is-one-quarter"><div class="card"><div class="card-content">
        <p class="title is-4">${attr.name}</p>
        ${starHtml}
        <div class="content">Type: ${type}</div>
      </div></div></div>`);
      console.log(attr.name);
    }
  }
  attractionCards.html(cards);

}

function getAttraction(place) {
  const lat = place.geometry.location.lat();
  const lon = place.geometry.location.lng();
  const radius = 5000;
  let url = ATTR_API_URL + '?radius=' + radius + '&lon=' + lon + '&lat=' + lat + '&format=json&apikey=' + ATTR_API_KEY;
  console.log(url);
  $.ajax({
    url: url,
    method: "GET"
  }).then(function (response) {
    createMarkers(response);
    createAttractionCard(response);
  });
}
