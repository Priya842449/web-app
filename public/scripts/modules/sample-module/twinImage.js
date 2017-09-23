/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */

define(['angular',
    './sample-module'
], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('TwinImageCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$scope', '$rootScope', '$q', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $scope, $rootScope, $q, commonServices) {
        var urlPathArr = [];
        urlPathArr.push($state.current.name);
      var ssoObj = window.localStorage.getItem("SSO_ID");
        const ssoPrivilegeData = {
            contractorId: ssoObj
        };
        function privilegeAccess() {
            commonServices.getPrivilegeData(ssoPrivilegeData).then(function(privilege_Data) {
                console.log(ssoPrivilegeData, privilege_Data);
                let privilegeData = privilege_Data.data;
                console.log(privilegeData);
                angular.forEach(privilegeData, function(objTmp) {
                    if (urlPathArr.indexOf(objTmp.state) >= 0) {
                        $scope.isReadonly = (objTmp.access_id == 2) ? true : false;
                    }
                });
                console.log("privilegeAccess----", privilegeData);
                console.log($scope.isReadonly);
            });
        }
        privilegeAccess();


        var config = '';
        $scope.specification = '';
        $scope.productionOrderNumber = '';
        $scope.skuId = '';
        var twinURL = 'https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=10/Survey&fileName=img_201853800.jpeg&contentType=image/png';
        var twimImage = document.querySelector('#twimImage');
        var fetchDeviceBySerialNumber = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=serialNo=';
        var fetchSkuByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=';
        var fetchBomByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/bom?filter=uri=/bom/';

        $(document).ready(function() {
            // Do stuff			 
            var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';
            var headersConfig = {
                headers: {
                    'content-Type': 'application/x-www-form-urlencoded',
                    'authorization': 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
                }
            };

            $http.post(commonServices.getauthTokenURL(), data, headersConfig).success(function(data, headers, status, XMLHTTPResponse) {
                var accessToken = data.access_token;

                var auth = 'bearer ' + accessToken;

                config = {
                    headers: {
                        'Authorization': auth,
                        'Content-Type': 'application/json',
                        'Predix-Zone-Id': '0da112ff-f441-4362-ac52-c5bc1752e404',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Expose-Headers': 'Link'
                    }
                };

                $scope.$on("sku", function() {
                    $scope.skuId = '';
                    $http.get(fetchSkuByUri + $scope.specification, config).success(function(skuResponse) {
                        for (var i = 0; i < skuResponse.length; i++) {
                            $scope.skuId = skuResponse[i].skuId;
                        }
                        console.log($scope.skuId);
                        $scope.$broadcast("bom");
                    });
                });

                $scope.$on("bom", function() {
                    $http.get(fetchBomByUri + $scope.skuId + '-' + $scope.productionOrderNumber, config).success(function(bomResponse) {
                        console.log(bomResponse);
                    });
                });
            });
        });
        $scope.fetchImage = function() {
            twimImage.setAttribute('src', twinURL);
        }

        $scope.fetchManufacturingInfo = function(value) {
            $scope.specification = '';
            $scope.productionOrderNumber = '';
            $http.get(fetchDeviceBySerialNumber + '1227938-001', config).success(function(deviceResponse) {
                for (var i = 0; i < deviceResponse.length; i++) {
                    $scope.specification = deviceResponse[i].specification;
                    $scope.productionOrderNumber = deviceResponse[i].productionOrderNumber;
                }
                console.log($scope.productionOrderNumber);
                $scope.$broadcast("sku");
            });
        }
    }]);
});