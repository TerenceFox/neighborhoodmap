
var ViewModel = function (restaurants) {

  var self = this;

  // Helper function to update localStorage with current state of the
  // restaurants observableArray.
  function updateStorage () {
    localStorage.setItem('restaurants', ko.toJSON(self.restaurants()));
  }

  // Map each restaurant to a Restaurant model object and store them in a KO ob
  // servable array.
  self.restaurants = ko.observableArray(restaurants.map(function (restaurant) {
    return new Restaurant(
      restaurant.name,
      restaurant.location,
      restaurant.phone,
      restaurant.id,
      restaurant.menu,
      restaurant.visited,
      restaurant.favorited,
      restaurant.visible,
      restaurant.details,
      restaurant.noteToggle,
      restaurant.notes
      );
  }));

  loadMap();

  //Recenter the map whenever the window is resized
  function calculateCenter() {
    center = map.getCenter();
  }
  google.maps.event.addDomListener(map, 'idle', function() {
    calculateCenter();
  });
  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(center);
  });

  var InfoWindow = new google.maps.InfoWindow();


  // Load restaurant properties into infowindows for their corresponding makers
  function populateInfoWindow (marker, infowindow, restaurant) {
    if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        restaurant.details(false);
        marker.setAnimation(null);
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
    streetViewService.getPanoramaByLocation(marker.position, radius, function(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div class="infowindow_title">' + restaurant.name+ '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 15
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>'+restaurant.name+'</div>');
      }
    });
    infowindow.open(map, marker);
    }
  }

  //Create markers based on data in restaurants object.
  function makeMarkers (restaurants) {
    var markers = [];
    var image = "";
    for (i=0; i < restaurants.length; i++) {
      if (restaurants[i].visited() && !restaurants[i].favorited()){
        image = 'img/checkmarkicon.png';
      } else if (restaurants[i].favorited()) {
        image = 'img/favoriteicon.png';
      } else {
        image = 'img/restauranticon.png';
      }
      var marker = new google.maps.Marker({
        title: restaurants[i].name,
        position: restaurants[i].location,
        icon: image,
        animation: google.maps.Animation.DROP,
        id: restaurants[i].id
      });
      markers.push(marker);
      marker.setZIndex(5);
      marker.addListener('click', function() {
        var restaurant;
        for (var i=0; i < self.restaurants().length; i++){
          if (this.id === self.restaurants()[i].id){
            restaurant = self.restaurants()[i];
          }
        }
        self.showDetails(restaurant);
        populateInfoWindow(this, InfoWindow, restaurant);
      });
    }
    return markers;
  }


  var markers = makeMarkers(self.restaurants());

  // If marker falls within neighbhorhood polygon, assign it to the map to make
  // it visible. Outputs a list of ids for the next function below.
  function setNeighborhood () {
    var ids = [];
    for (var i = 0; i < markers.length; i++) {
      if (!google.maps.geometry.poly.containsLocation(markers[i].position, polygonMask)) {
        markers[i].setMap(map);
        ids.push(markers[i].id);
      }
    }
    return ids;
  }

  var ids = setNeighborhood();

  // Sort through restaurants and set the ones inside the polygon to visible.
  function resetNeighborhood(ids) {
    for (var i=0; i < ids.length; i++) {
      for (var j=0; j < self.restaurants().length; j++){
        if (ids[i] === self.restaurants()[j].id) {
          self.restaurants()[j].visible(true);
          self.restaurants()[j].details(false);
        }
      }
    }
  }
  resetNeighborhood(ids);

  // Helper function to set the marker icon to the image corresponding with
  // the stored toggles. Favorited takes priority over visited.
  function setIconImage (restaurant) {
    var image = "";
    for (i = 0; i < markers.length; i++) {
      if (markers[i].id === restaurant.id) {
        if (restaurant.visited() && !restaurant.favorited()){
          image = markers[i].setIcon('img/checkmarkicon.png');
        } else if (restaurant.favorited()) {
          image = markers[i].setIcon('img/favoriteicon.png');
        }  else {
          image = markers[i].setIcon('img/restauranticon.png');
        }
      }
    }
    return image;
  }

  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
        marker.setAnimation(null);
      }, 750);
    }
  }

  // Click Events
  // Toggle a div in the view to show more details about a restaurant and
  // change the associated marker to highlight it on the map.
  self.showDetails = function (restaurant) {
    if (!self.sidebarToggle()) {
      self.toggleSidebar();
    }
    for (var i=0; i < self.restaurants().length; i++){
        if (self.restaurants()[i] !== restaurant) {
          self.restaurants()[i].details(false);
          self.restaurants()[i].noteToggle(false);
        } else if (self.restaurants()[i] === restaurant) {
          if (restaurant.details()) {
            restaurant.details(false);
          } else {
            restaurant.details(true);
            let element = document.getElementById(restaurant.id);
            element.scrollIntoView();
          }
        }
    }
      var marker;
      for (var j=0; j < markers.length; j++) {
        if (markers[j].id === restaurant.id) {
          marker = markers[j];
          populateInfoWindow(marker, InfoWindow, restaurant);
          toggleBounce(marker);
        }
      }
    updateStorage();
  };

  // Set the restaurant associated with the button to visited, save new state
  // to localStorage and change icon acccordingly.
  self.setToVisited = function (restaurant) {
    restaurant.visited(true);
    updateStorage();
    setIconImage(restaurant);
  };

  // Set the restaurant associated with the button to favorited, save new state
  // to localStorage and change icon acccordingly.
  self.setToFavorited = function (restaurant) {
    restaurant.visited(true);
    restaurant.favorited(true);
    updateStorage();
    setIconImage(restaurant);
  };

  // Set the restaurant associated with the button to visited, save new state
  // to localStorage and change icon acccordingly.
  self.visitedHighlight = ko.observable(false);
  function visitedHighlightToggle () {
    if(self.visitedHighlight()) {
      self.visitedHighlight(false);
      $(".visited_btn").css("background-color", "#ffcc5c");
      $(".visited_btn").css("color", "#e8702a");
      self.backToHome();
    } else {
      self.visitedHighlight(true);
      $(".visited_btn").css("background-color", "#e8702a");
      $(".visited_btn").css("color", "#ffcc5c");
    }
  }

  // Filter the list of restaurants according the to the visited toggle.
  self.filterVisited = function () {
    for (var i=0; i < self.restaurants().length; i++){
      if (!self.restaurants()[i].visited()) {
        self.restaurants()[i].visible(false);
        for (var j=0; j < markers.length; j++){
          if (self.restaurants()[i].id === markers[j].id){
            markers[j].setMap(null);
          }
        }
      }
    }
  visitedHighlightToggle();
  };

  // Filter the list of restaurants according the to the visited toggle.
  self.favoritedHighlight = ko.observable(false);
  function favoritedHighlightToggle () {
    if(self.favoritedHighlight()) {
      self.favoritedHighlight(false);
      $(".favorited_btn").css("background-color", "#ffcc5c");
      $(".favorited_btn").css("color", "#e8702a");
      self.backToHome();
    } else {
      self.favoritedHighlight(true);
      $(".favorited_btn").css("background-color", "#e8702a");
      $(".favorited_btn").css("color", "#ffcc5c");
    }
  }

  // Filter the list of restaurants according the to the favorited toggle.
  self.filterFavorited = function () {
    for (var i=0; i < self.restaurants().length; i++){
      if (!self.restaurants()[i].favorited()) {
        self.restaurants()[i].visible(false);
        for (var j=0; j < markers.length; j++){
          if (self.restaurants()[i].id === markers[j].id){
            markers[j].setMap(null);
          }
        }
      }
    }
    favoritedHighlightToggle();
  };

  // Show the note input form field.
  self.toggleNoteForm = function (restaurant) {
    if (restaurant.noteToggle()) {
      restaurant.noteToggle(false);
    } else {
      restaurant.noteToggle(true);
    }
  };

  // Store the input from the form edit field.
  self.noteToAdd = ko.observable("");

  // Update the the restaurant
  self.addNote = function (restaurant) {
    restaurant.notes(self.noteToAdd());
    restaurant.noteToggle(false);
    updateStorage();
    self.noteToAdd("");
  };

  self.cancelNote = function (restaurant) {
    restaurant.noteToggle(false);
    self.noteToAdd("");
    updateStorage();
  };

  // Reset the list to display all the restaurants inside the neighborhood when
  // the title is clicked.
  self.backToHome = function () {
    var ids = setNeighborhood();
    resetNeighborhood(ids);
  };

  self.sidebarToggle = ko.observable(false);
  self.toggleSidebar = function () {
    if (self.sidebarToggle()) {
      self.sidebarToggle(false);
      $("#sidebar_toggle").children().removeClass("change");
      $("#map").css("grid-column-start", "1");
    } else {
      self.sidebarToggle(true);
      $("#sidebar_toggle").children().addClass("change");
      $("#map").css("grid-column-start", "4");
    }
  };

  self.search = ko.observable("");

  self.search.subscribe(function(query) {
    var filter = query.toUpperCase();
    for (var i=0; i < self.restaurants().length; i++){
      if (self.restaurants()[i].name.toUpperCase().indexOf(filter) < 0) {
        self.restaurants()[i].visible(false);
        for (var j=0; j < markers.length; j++){
          if (self.restaurants()[i].id === markers[j].id){
            markers[j].setMap(null);
          }
        }
      } else {
        self.restaurants()[i].visible(true);
        for (var j=0; j < markers.length; j++){
          if (self.restaurants()[i].id === markers[j].id){
            ids.forEach(function(element){
              if (markers[j].id === element) {
                markers[j].setMap(map);
              }
            });
          }
        }
      }
    };
  });

// End of View Model!
};
