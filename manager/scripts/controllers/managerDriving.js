/**
 * Created by TungNguyen on 6/24/2014.
 *
 * Table Drivers Schema
 deviceId: {type: String},
 username: {type: String, required: true},
 fullname: {type: String, index: true},
 birthday: {type: Date},
 avatar: {type: String},
 bio: {type: String},
 location: {type: String},
 like: {type: Number, default: 0},
 phone: {type: Number, required: true},
 company: {type: ObjectId, ref: 'TaxiCompany'},
 type: {type: ObjectId, ref: 'DriverTypes'},
 salt: {type: String, required: true },
 hash: {type: String, required: true},
 role: {type: String, required: true, "default": 'taxi'}
 */
'use strict';

angular.module('itaxiManagerApp')
    .controller('managerDrivingCtrl', ['$rootScope', '$scope', 'appConfig', '$logger', '$timeout', '$fetchData', 'appDataStore' , '$baseModel', '$upload', '$restful', '$http', '$auth',
        function ($rootScope, $scope, appConfig, $logger, $timeout, $fetchData, appDataStore, $baseModel, $upload, $restful, $http, $auth) {
            console.log('Log Driving');



            $scope.driving = {};

            $scope.activeForm = 0;

            $scope.checkCarType = false;
            $scope.checkCarTypeSeat = false;
            $scope.showCarType = function () {
                $scope.checkCarType = true;
                console.log('OK click');
            };
            $scope.selectSearchSeatNum = 'Tất cả';
            $scope.selectSearch = 'Search by name';
            $scope.myCheckCar = 'All Bodabodas';


            $scope.select = function (data) {
                if (data == 'Search by Motorcycle') {
                    $scope.myCheckCar = 'All Bodabodas';
                    $scope.checkCarType = true;
                    $scope.checkCarTypeSeat = false;
                    $scope.listDriving = dataDriving;
                }
                if (data == 'Search by Number Properties') {
                    $scope.selectSearchSeatNum = 'Tất cả';
                    $scope.checkCarTypeSeat = true;
                    $scope.checkCarType = false;
                    $scope.listDriving = dataDriving;
                }
                if (data == 'Search by name') {
                    $scope.listDriving = dataDriving;
                    $scope.checkCarType = false;
                    $scope.checkCarTypeSeat = false;
                }
            };


            var dataDriving;
            $scope.selectCar = function (data) {
                $scope.listDriving = [];

                for (var i = 0; i < dataDriving.length; i++) {
                    if (dataDriving[i].type._id == data._id) {
                        $scope.listDriving.push(dataDriving[i]);
                    }
                }
            }
            $scope.selectSeat = function (seat) {
                if (seat == '7 Properties') {
                    $scope.listDriving = [];
                    $scope.searchData(7, dataDriving);
                } else if (seat == '4 Properties') {
                    $scope.listDriving = [];
                    $scope.searchData(4, dataDriving);
                } else if (seat == 'Tất cả') {
                    $scope.listDriving = dataDriving;
                }
            };

            $scope.searchData = function (type, data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].type.seatNum == type) {
                        $scope.listDriving.push(data[i]);
                    }
                }
            };

            var data = {};

            $scope.exportFunc = function () {
                exportDay();
            };

            var exportDay = function () {
                var openUrl = 'http://localhost:3000/report/' + Date.now() + '.xlsx';
                $http.get(openUrl, data)
                    .success(function (data) {
                        window.open(openUrl);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            };

            $scope.back = function () {
                $scope.activeForm = 0;
            };


            var loadType = function () {
                if (appDataStore.DriverTypes.size() > 0) {
                    $scope.listDriverTypes = appDataStore.DriverTypes.all();
                    console.log('load Data from appDataStorage !');
                } else {
                    $fetchData.getData('driverTypes', null, null, null, null).then(function (resp) {
                        appDataStore.DriverTypes.addAll(resp.all());
                        $scope.listDriverTypes = appDataStore.DriverTypes.all();
                        console.log('listDriverTypes', $scope.listDriverTypes);
                    }, function (err) {
                        console.log('err : ', err);
                    });
                }
            };

            $scope.createDriving = function (item) {
                item.company = '53aa37bba7e7997f69000001';
                var itemData = new $baseModel('Drivers', item);
                console.log('item', itemData);

                itemData.save(function (err, resp) {
                    if (!err) {
                        toastr.success('Succesfuly Added Bodaboda!');
                        $scope.listDriving.unshift(itemData);
                        appDataStore.Drivings.add(itemData);
                        $scope.activeForm = 0;
                    } else {
                        toastr.error('Error Adding new bodaboda');
                    }
                })
            };

            $scope.deleteDriving = function (item, index) {

                if (window.confirm('Are you sure you want to Delete  : ' + item.username)) {
                    var destroyItem = item;

                    destroyItem.isDestroy = true;
                    destroyItem.save(function (err, result) {
                        if (!err) {
                            toastr.success('User Details Successfuly Deleted');
                            $scope.listDriving.splice(index, 1);
                            appDataStore.Drivings.remove(item);
                        } else {
                            toastr.error('Error Failed to Delete User Details');
                        }
                    })
                }
            };

            var start = 0;
            var limit = 100;

            $scope.scroll = function () {
                console.log('scroll');
            };
            $scope.loadDriving = function () {
                // console.log('start scroll');
                var sorters = [
                    {
                        property: 'post_time',
                        direction: 'DESC'
                    }
                ];

                var filters = [
                    {
                        property: 'isDestroy',
                        type: 'string',
                        value: 'false',
                        comparison: 'eq'
                    }
                ];


                if (appDataStore.Drivings.size() > start * limit) {
                    $scope.listDriving = appDataStore.Drivings.all();
                    dataDriving = $scope.listDriving;
                    console.log('load list Driving from to appDataStore !', $scope.listDriving);
                } else {
                    $fetchData.getData('drivers', start, limit, filters, null).then(function (resp) {
                        start += 5;
                        $scope.listDriving = resp.all();
                        appDataStore.Drivings.addAll(resp.all());
                        console.log('listDriving :', $scope.listDriving);
                        dataDriving = $scope.listDriving;
                    }, function (err) {
                        console.log('err : ', err);
                    });
                }
            };

            $scope.checkSeatShow = false;
            $scope.findSeatNum = function (data) {
                $scope.checkSeatShow = true;
                $scope.CarSeatNum = appDataStore.DriverTypes.get(data).seatNum;
            };
            loadType();
            $scope.loadDriving();

        }]);
