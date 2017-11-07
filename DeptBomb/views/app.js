var DeptBombapp = angular.module("DeptBomb", ["ngRoute"]);
angular
  .module("DeptBomb")
  .controller("ReceiveHQOrdersController", function($scope, socket) {
    // get past orders when first opened page
    console.log("DeptBomb first opened");
    $scope.DeptBombOrders = [];
    $.ajax({
      type: "GET",
      url: "/DeptBomb/getPastOrders",
      success: function(data) {
        console.log(data);
        for (let data1 of data){
          $scope.$apply(function(){
            $scope.DeptBombOrders.push(data1);
          })
        }
      }
    });
    // receives new order
    socket.on("ReceiveHQOrder", function(data) {
      //$scope.$apply(function() {
        UIkit.notification({
          message: "New order received!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
      console.log(data);
      $scope.DeptBombOrders.push(data);
      //$scope.newCustomers.push(data.customer);
      // });
    });
  });

angular
  .module("DeptBomb")
  .controller("ReceiveSquadUpdatesController", function($scope, socket) {
    // get past updates when first opened page
    console.log("DeptBomb first opened");
    $scope.squadUpdates = [];
    console.log("making ajax");
    $.ajax({
      type: "GET",
      url: "/DeptBomb/getPastUpdates",
      success: function(data) {
        console.log(data);
        for (let data1 of data){
          $scope.$apply(function(){
            $scope.squadUpdates.push(data1);
          })
        }
      },
      failure: function(result){
        console.log("FAILED");
        console.log(result);
    }
    });
    console.log("after ajax");
    // receives new updates
    socket.on("ReceiveSquadUpdates", function(data) {
        UIkit.notification({
          message: "New updates received!",
          status: "primary",
          pos: "top-right",
          timeout: 10000
        });
      console.log(`ReceiveSquadUpdates data:`);
      console.log(data);
      $scope.squadUpdates.push(data);
    });
  });

// boilerplate
DeptBombapp.factory("socket", function($rootScope) {
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
