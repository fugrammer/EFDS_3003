function updateStatus() {

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
      $.ajax({
        type: "GET",
        url: "/DeptFire/getStatus",
        success: function (data) {
          console.log(data);
          $scope.$apply(function(){
            $scope.DeptStatus = data;
          })
        }
      });
    });
  });
