function updateStatus() {
  $scope.HQStatus = {};
  $.ajax({
    type: "GET",
    url: "/HQ/getStatus",
    success: function (data) {
      console.log(data);
      $scope.$apply(function () {
        $scope.HQStatus = data;
      })
    }
  });
}

angular
  .module("HQ")
  .controller("StatusController", function ($scope, socket) {
    // get past orders when first opened page
    console.log("hq first opened");
    $scope.HQStatus = {};
    $.ajax({
      type: "GET",
      url: "/HQ/getStatus",
      success: function (data) {
        console.log(data);
        $scope.$apply(function () {
          $scope.HQStatus = data;
        })

      }
    });
    // receives new order
    socket.on("UpdateMap", function (data) {
      updateStatus();
    });
  });