// Retreive restaurants matching the category ID and store as an object array.
function grabRestaurants (data) {
  if (data !== "error"){
    var categoryId = '4bf58dd8d48988d144941735';
    var restaurants = [];
    var response = data.response.groups[0].items;
    for (i = 0; i < response.length; i++) {
      if (response[i].venue.categories[0].id === categoryId){
        var restaurant = {
          name: response[i].venue.name,
          location: {
            lat: response[i].venue.location.lat,
            lng: response[i].venue.location.lng
          },
          phone: response[i].venue.contact.formattedPhone,
          id: i,
          visited: false,
          favorited: false,
          visible: false,
          details: false,
          noteToggle: false,
          notes: ""
        };
        if (response[i].venue.hasMenu) {
          restaurant.menu = response[i].venue.menu.url;
        } else {
          restaurant.menu = null;
        };
        restaurants.push(restaurant);
      };
    };
  } else {
    var restaurants = "error";
  };
  return restaurants;
};

var center;
var map;
var polygonMask;

function loadMap() {
  center = {lat: 40.672055, lng: -73.941921};
  map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 15
    });
  //Create a mask outlining Crown Heights
  polygonMask = new google.maps.Polygon({
  map:map,
  strokeColor: '#000000',
  strokeOpacity: 0.5,
  strokeWeight: 2,
  fillColor: '#CACACA',
  fillOpacity: 0.7,
  paths: [[new google.maps.LatLng(40.592763, -74.016566),
  new google.maps.LatLng(40.749002, -74.016566),
  new google.maps.LatLng(40.749002, -73.878036),
  new google.maps.LatLng(40.592763, -73.878036),
  new google.maps.LatLng(40.592763, -74.016566)],
  [new google.maps.LatLng(40.663322, -73.960905),
  new google.maps.LatLng(40.664331, -73.948202),
  new google.maps.LatLng(40.663452, -73.931551),
  new google.maps.LatLng(40.676928, -73.921680),
  new google.maps.LatLng(40.678653, -73.952880),
  new google.maps.LatLng(40.681159, -73.964510),
  new google.maps.LatLng(40.663322, -73.960905)]]});
};

var fsSuccess = function (data) {
  //Check if data present in localStorage, otherwise fetch it from Foursquare.
  if (localStorage.getItem('restaurants')) {
    var restaurants = Array.from(JSON.parse(localStorage.getItem('restaurants')));
  } else {
    var restaurants = grabRestaurants(data);
  }
  if (restaurants === "error"){
    alert("Couldn't load restaurants.")
    loadMap();
    $("#sidebar").hide();
    $("#map").css("grid-column", "1 / -1");
  } else {
    ko.applyBindings(new ViewModel(restaurants));
  };
};

// Callback for successful Google Maps API call
var googleSuccess = function () {
    var url = "https://api.foursquare.com/v2/venues/explore?";
    url += $.param({
      near: "40.672055, -73.941921",
      v: "20180220",
      query: "Caribbean",
      client_id: "ITY3ZMPDJ3CPIJD1QKWKKJ2EORRKHFTQFKUWTEW440X2WWJC",
      client_secret: "FTMJLKXCWWW4L4XL2524YLTOQJZYTGMDUK0Z0Q3LJFRJUJTU"
    });
    $.get(url, function (data) {
      fsSuccess(data);
    }).fail( function () {
      var data = "error";
      fsSuccess(data);
    });
};
