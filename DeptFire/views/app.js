var HQapp = angular.module("HQ", ["ngRoute"]);
angular
  .module("HQ")
  .controller("ReceiveCMOOrdersController", function($scope, socket) {
    // get past orders when first opened page
    console.log("hq first opened");
    $scope.CMOOrders = [];
    $.ajax({
      type: "GET",
      url: "/HQ/getPastOrders",
      success: function(data) {
        console.log(data);
        for (let data1 of data){
          $scope.$apply(function(){
            $scope.CMOOrders.push(data1);
          })
        }
      }
    });
    // receives new order
    socket.on("CMOOrders", function(data) {
      //$scope.$apply(function() {
        UIkit.notification({
          message: "New order received!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
      $scope.CMOOrders.push(data);
      //$scope.newCustomers.push(data.customer);
      // });
    });
    socket.on("CMOOrderHistory", function(data) {
        console.log("MESSAGE RECEIVED!");
        $scope.CMOOrders.push(data);
    });
  });

angular
  .module("HQ")
  .controller("ReceiveDeptUpdatesController", function($scope, socket) {
    // get past orders when first opened page
    console.log("hq first opened");
    $scope.deptUpdates = [];
    $.ajax({
      type: "GET",
      url: "/HQ/getPastUpdates",
      success: function(data) {
        console.log(data);
        for (let data1 of data){
          $scope.$apply(function(){
            $scope.deptUpdates.push(data1);
          })
        }
      }
    });
    // receives new order
    socket.on("deptUpdates", function(data) {
      //$scope.$apply(function() {
        UIkit.notification({
          message: "New order received!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
      $scope.deptUpdates.push(data);
      //$scope.newCustomers.push(data.customer);
      // });
    });
    socket.on("deptUpdateHistory", function(data) {
        console.log("MESSAGE RECEIVED!");
        $scope.deptUpdates.push(data);
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


// $("#submitUpdate").submit(function(e) {
//   var url = "/HQ/updateCMO"; // the script where you handle the form input.
//   $.ajax({
//     type: "POST",
//     url: url,
//     data: $("#submitUpdate").serialize(), // serializes the form's elements.
//     success: function(data) {
//       UIkit.notification({
//         message: "Update sent!",
//         status: "primary",
//         pos: "top-right",
//         timeout: 10000
//       });
//       //alert(JSON.stringify(data)); // show response from the php script.
//       $("#submitUpdate")[0].reset();
//     },
//     statusCode: {
//       404: function() {
//         alert("Incorrect data entered!");
//       }
//     }
//   });
//   e.preventDefault(); // avoid to execute the actual submit of the form.
// });
