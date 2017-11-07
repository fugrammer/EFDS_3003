function updateStatus() {
  $scope.DeptStatus = {};
  $.ajax({
    type: "GET",
    url: "/DeptFire/getStatus",
    success: function (data) {
      console.log(data);
      $scope.$apply(function () {
        $scope.DeptStatus = data;
      })
    }
  });
}

angular
  .module("DeptFire")
  .controller("StatusController", function ($scope, socket) {
    $scope.HQStatus = {};
    $.ajax({
      type: "GET",
      url: "/DeptFire/getStatus",
      success: function (data) {
        console.log(data);
        $scope.$apply(function () {
          $scope.DeptStatus = data;
        })

      }
    });
    // receives new order
    socket.on("UpdateMap", function (data) {
      updateStatus();
    });
  });

// boilerplate
DeptFireapp.factory("socket", function ($rootScope) {
  var socket = io();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        //console.log(args);
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
