var map;
var markerCluster;
let GETLOCATIONSURL = "/getLocations"

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 1.367448, lng: 103.803256 }
  });
}

function updateMap() {
  if (map == null) {
    initMap();
  }
  locations = [];
  console.log("loading map");
  $.ajax({
    type: "GET",
    url: GETLOCATIONSURL,
    success: function (data) {
      if (markerCluster) {
        markerCluster.clearMarkers();
      }
      console.log(data);
      locations = [];
      for (let location of data) {

        if (location.DepartmentID === "Crisis") {
          location.Icon = crisisImage;
          if (location.SquadStatus==="Cleared"){
            location.Icon = peaceImage;
          }
        }
        locations.push(location);
      }
      var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
          position: new google.maps.LatLng(location.Lat, location.Lon),
          label: location.DepartmentID + location.SquadID,
          icon: location.Icon
        });
      });
      // Add a marker clusterer to manage the markers.
      markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
      //updateMap();
    }
  });
};

var locations = [
  { Lat: 1.367448, Lon: 103.803256, ID: "label", Type: "own reference" }
]

var crisisImage = {
  url: "/images/crisis_icon.png",
  // This marker is 20 pixels wide by 32 pixels high.
  size: new google.maps.Size(44, 30),
  // The origin for this image is (0, 0).
  origin: new google.maps.Point(0, 0),
  // The anchor for this image is the base of the flagpole at (0, 32).
  anchor: new google.maps.Point(22, 30),

  labelOrigin: new google.maps.Point(22, -10)
};

var peaceImage = {
  url: "/images/peace_icon.png",
  // This marker is 20 pixels wide by 32 pixels high.
  size: new google.maps.Size(44, 44),
  // The origin for this image is (0, 0).
  origin: new google.maps.Point(0, 0),
  // The anchor for this image is the base of the flagpole at (0, 32).
  anchor: new google.maps.Point(22, 30),

  labelOrigin: new google.maps.Point(22, -10)
};

angular
  .module("HQ")
  .controller("MapController", function ($scope, socket) {
    // get past orders when first opened page
    //updateMap();
    locations = [];
    console.log("loading map");
    $.ajax({
      type: "GET",
      url: GETLOCATIONSURL,
      success: function (data) {
          updateMap();
        }
      });

    // receives new squad locations (maybe)
    socket.on("ReceiveLocationsUpdates", function (data) {
      updateMap();
    });

    // receives new squad locations (maybe)
    socket.on("ReceiveDepartmentUpdates", function (data) {
      updateMap();
    });

    socket.on("UpdateMap", function (data) {
      updateMap();
    });

    // receives new crisis locations (maybe)
    socket.on("ReceiveCMOOrder", function (data) {
      updateMap();
    });

  });


