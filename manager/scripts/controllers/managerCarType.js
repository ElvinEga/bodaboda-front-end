/**
 * Created by TungNguyen on 6/24/2014.
 *
 *
 * *  */
'use strict';

angular.module('itaxiManagerApp')
    .controller('managerHrCtrl', ['$scope', '$logger', '$timeout', '$fetchData', 'appDataStore' , '$baseModel', '$restful', '$http', function ($scope, $logger, $timeout, $fetchData, appDataStore, $baseModel, $restful, $http) {

        $scope.activeForm = 0;

        $scope.dataType = {};
        $scope.selectType = 'All Bodabodas';
        var dataTypeCar;
        $scope.chooseType = function (typeCar) {
          if ('2 Properties' == typeCar) {
              $scope.loadSearch(2);
          }
            if ('4 Properties' == typeCar) {
                $scope.loadSearch(4);
            }
            else if ('7 Properties' == typeCar) {
                $scope.loadSearch(7);
            } else {
                $scope.listDriverTypes = dataTypeCar;
            }
        };

        $scope.loadSearch = function (seat) {
            $scope.listDriverTypes = [];
            for (var i = 0; i < dataTypeCar.length; i++) {
                if (dataTypeCar[i].seatNum == seat) {
                    $scope.listDriverTypes.push(dataTypeCar[i]);
                }
            }
        }
        $scope.back = function () {
            $scope.activeForm = 0;
        }
        var loadType = function () {
            if (appDataStore.DriverTypes.size() > 0) {
                $scope.listDriverTypes = appDataStore.DriverTypes.all();
                dataTypeCar = $scope.listDriverTypes;
            } else {
                $fetchData.getData('driverTypes', null, null, null, null).then(function (resp) {
                    $scope.listDriverTypes = resp.all();
                    appDataStore.DriverTypes.addAll(resp.all());
                    dataTypeCar = $scope.listDriverTypes;
                }, function (err) {
                    console.log('err : ', err);
                })
            }
        };

        loadType();


        $scope.createDriverType = function (item) {

            var itemData = new $baseModel('driverTypes', item);
            console.log('item', item);

            itemData.save(function (err, resp) {
                if (!err) {
                    toastr.success('Add New Successful!');
                    $scope.listDriverTypes.push(itemData);
                    appDataStore.DriverTypes.add(itemData);
                    $scope.back();
                } else {
                    toastr.error('Error Adding New');
                }
            })
        };
        $scope.deleteDrivertype = function (item, index) {
            console.log('item delete : ', item, index);

            if (window.confirm('Do you want to delete Bodaboda : ' + item.username + ' Now ?')) {
                item.destroy(function (err, result) {
                    if (!err) {
                        toastr.success('Bodaboda Deleted Successfull!');
                        $scope.DriverTypes.splice(index, 1);
                        appDataStore.DriverTypes.remove(item);
                    } else {
                        toastr.error('Error Deleting the bodaboda');
                    }
                })
            }
        };


    }]);
