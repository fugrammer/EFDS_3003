var HQapp = angular.module("HQ", ["ngRoute"]);
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

angular
  .module("HQ")
  .controller("ExecutiveOrdersController", function($scope, socket) {
    //this.executiveorders = orders;
    $scope.executiveorders = orders;
    socket.on("executiveorder", function(data) {
      //$scope.$apply(function() {
      $scope.executiveorders.push("thomas");
      //$scope.newCustomers.push(data.customer);
      // });
    });
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
