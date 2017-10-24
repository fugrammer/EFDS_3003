angular
.module("HQ")
.controller("MapController", function($scope, socket) {
  // get past orders when first opened page
  locations = [];
  console.log("loading map");
  $.ajax({
    type: "GET",
    url: "/HQ/getSquadLocations",
    success: function(data) {
      console.log(data);
      locations = [];
      for (let location of data){
        $scope.$apply(function(){
          locations.push({
            lat:location.Lat,
            lng:location.Lon
          });
        })
      }
      initMap();
    }
  });

  // receives new squad locations
  socket.on("squadlocations", function(data) {
      $scope.locations = [];
      console.log(data)
      for (let location of data){
        locations.push()
      }
      initMap();
  });
});