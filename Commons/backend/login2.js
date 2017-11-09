var EFDSapp = angular.module("EFDS", ["ngRoute"]);
angular
    .module("EFDS")
    .controller("EFDSController", function ($scope) {
        $scope.depts = ["Fire","Bomb","Hazmat"];
        $scope.ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    });