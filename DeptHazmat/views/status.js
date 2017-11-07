function updateStatus() {
  $scope.DeptStatus = {};
  $.ajax({
    type: "GET",
    url: "/DeptHazmat/getStatus",
    success: function (data) {
      console.log(data);
      $scope.$apply(function () {
        $scope.HQStatus = data;
      })
    }
  });
}

angular
  .module("DeptHazmat")
  .controller("StatusController", function ($scope, socket) {
    // get past orders when first opened page
    console.log("hq first opened");
    $scope.DeptStatus = {};
    $.ajax({
      type: "GET",
      url: "/DeptHazmat/getStatus",
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
