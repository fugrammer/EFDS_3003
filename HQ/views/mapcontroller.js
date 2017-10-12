angular
.module("HQ")
.controller("MapController", function($scope, socket) {
  // get past orders when first opened page
  $scope.executiveorders = [];
  $.ajax({
    type: "GET",
    url: "/HQ/getSquadLocations",
    success: function(data) {
      console.log(data);
      for (let data1 of data){
        $scope.$apply(function(){
          $scope.executiveorders.push(data1);
        })
      }
    }
  });

  // receives new squad locations
  socket.on("squadlocations", function(data) {
      locations = []
      console.log(data)
      for (let location of data){
        locations.push({
            lat:location.Lat,
            lng:location.Lon
        })
      }
      initMap();
  });

  socket.on("executiveorderHistory", function(data) {
      console.log("MESSAGE RECEIVED!");
      $scope.executiveorders.push(data);
  });
});