var Squadapp = angular.module("Squad", ["ngRoute"]);
angular
    .module("Squad")
    .controller("ReceiveDeptOrdersController", function ($scope, socket) {
        // get past orders when first opened page
        console.log("squad first opened");
        $scope.DeptOrders = [];
        $.ajax({
            type: "GET",
            url: "/Squad/getPastOrders?dept="+findGetParameter(dept)+"&squad="+findGetParameter(squad),
            success: function (data) {
                console.log(data);
                for (let data1 of data) {
                    $scope.$apply(function () {
                        $scope.DeptOrders.push(data1);
                    })
                }
            }
        });
        // receives new order
        socket.on("DeptOrder", function (data) {
            //$scope.$apply(function() {
            UIkit.notification({
                message: "New order received!",
                status: "primary",
                pos: "top-right",
                timeout: 10000
            });
            $scope.DeptOrders.push(data);
            //$scope.newCustomers.push(data.customer);
            // });
        });

        // boilerplate
        Squadapp.factory("socket", function ($rootScope) {
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


        $("#submitUpdate").submit(function (e) {
            var url = "/Squad/updateDept"; // the script where you handle the form input.
            $.ajax({
                type: "POST",
                url: url,
                data: $("#submitUpdate").serialize(), // serializes the form's elements.
                success: function (data) {
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
                    404: function () {
                        alert("Incorrect data entered!");
                    }
                }
            });
            e.preventDefault(); // avoid to execute the actual submit of the form.
        })
