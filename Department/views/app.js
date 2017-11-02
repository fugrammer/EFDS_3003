var Departmentapp = angular.module("Department", ["ngRoute"]);
angular
    .module("Department")
    .controller("ExecutiveOrdersController", function ($scope, socket) {
        // get past orders when first opened page
        console.log("ambulance first opened");
        $scope.orders = [];
        $.ajax({
            type: "GET",
            url: "/Department/getOrders",
            success: function (data) {
                console.log(data);
                for (let data1 of data) {
                    $scope.$apply(function () {
                        $scope.orders.push(data1);
                    })
                }
            }
        });
        // receives new order
        socket.on("order", function (data) {
            //$scope.$apply(function() {
            UIkit.notification({
                message: "New order received!",
                status: "primary",
                pos: "top-right",
                timeout: 10000
            });
            $scope.orders.push(data);
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
            var url = "/Department/updateDept"; // the script where you handle the form input.
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

