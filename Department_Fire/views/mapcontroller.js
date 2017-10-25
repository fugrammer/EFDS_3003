angular
  .module("HQ")
  .controller("MapController", function ($scope, socket) {
    // get past orders when first opened page
    locations = [];
    console.log("loading map");
    $.ajax({
      type: "GET",
      url: "/HQ/getSquadLocations",
      success: function (data) {
        console.log(data);
        locations = [];
        for (let location of data) {
          $scope.$apply(function () {
            locations.push({
              Lat: location.Lat,
              Lon: location.Lon,
              ID: location.ID,
              Type: location.Type
            });
          })
        }
        initMap();
      }
    });

    // receives new squad locations
    socket.on("ReceiveSquadLocationUpdates", function (data) {
      console.log(data)
      for (let location of locations) {
        if (location.ID === data.ID) {
          location = data;
          break;
        }
      }
      initMap();
    });
    // receives new squad locations
    socket.on("ReceiveCMOOrder", function (data) {
      console.log(data)
      var existing = false;
      for (let location of locations) {
        if (location.ID === data.CrisisID.toString()) {
          location = data;
          existing = true;
          break;
        }
      }
      if (!existing){
        data.ID = data.CrisisID.toString();
        locations.push(data);
      }
      initMap();
    });

  });