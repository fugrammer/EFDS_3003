var HQapp = angular.module("HQ", ["ngRoute"]);
angular
  .module("HQ")
  .controller("ExecutiveOrdersController", function($scope, socket) {
    // get past orders when first opened page
    $scope.executiveorders = [];
    $.ajax({
      type: "GET",
      url: "/HQ/getPastOrders",
      success: function(data) {
        console.log(data);
        for (let data1 of data){
          $scope.$apply(function(){
            $scope.executiveorders.push(data1);
          })
        }
      }
    });
    // receives new order
    socket.on("executiveorder", function(data) {
      //$scope.$apply(function() {
        UIkit.notification({
          message: "New order received!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
      $scope.executiveorders.push(data);
      //$scope.newCustomers.push(data.customer);
      // });
    });
    socket.on("executiveorderHistory", function(data) {
        console.log("MESSAGE RECEIVED!");
        $scope.executiveorders.push(data);
        // Create an array of alphabetical characters used to label the markers.
        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        locations = [
          {lat: 1.367448, lng: 103.803256},
          {lat: 1.35, lng: 103.803256},
          {lat: 1.378448, lng: 103.853256}
        ]
        initMap();
    });
  });
// boilerplate
HQapp.factory("socket", function($rootScope) {
  var socket = io();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        //console.log(args);
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});


  


$("#submitUpdate").submit(function(e) {
  var url = "/HQ/updateCMO"; // the script where you handle the form input.
  $.ajax({
    type: "POST",
    url: url,
    data: $("#submitUpdate").serialize(), // serializes the form's elements.
    success: function(data) {
      UIkit.notification({
        message: "Update sent!",
        status: "primary",
        pos: "top-right",
        timeout: 10000
      });
      //alert(JSON.stringify(data)); // show response from the php script.
      $("#submitUpdate")[0].reset();
    },
    statusCode: {
      404: function() {
        alert("Incorrect data entered!");
      }
    }
  });
  e.preventDefault(); // avoid to execute the actual submit of the form.
});

