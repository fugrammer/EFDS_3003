angular
  .module("DeptBomb")
  .controller("StatusController", function ($scope, socket) {
    $scope.DeptStatus = {};
    $.ajax({
      type: "GET",
      url: "/DeptBomb/getStatus",
      success: function (data) {
        console.log(data);
        $scope.$apply(function () {
          $scope.DeptStatus = data;
        })

      }
    });
    socket.on("UpdateMap", function (data) {
      $.ajax({
        type: "GET",
        url: "/DeptBomb/getStatus",
        success: function (data) {
          console.log(data);
          $scope.$apply(function(){
            $scope.DeptStatus = data;
          })
        }
      });
    });
  });

