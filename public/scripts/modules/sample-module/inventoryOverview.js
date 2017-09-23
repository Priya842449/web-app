/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('inventoryOverviewCtrl', ['$state', '$timeout', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'proposalServices', 'adminServices', function($state, $timeout, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices, proposalServices, adminServices) {

        $http.get("https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/getSiteLevelDetails?customerId=441912").success(function(data) {
            console.log(data)

            angular.forEach(data, function(value, key) {
                data[key].siteId = "<a href='javascript:void(0)' onclick='popUp(\"" + value.siteId + "\")' id = 'locationId' style='text-decoration: none'>" + value.siteId + "</a>"

                data[key].status = "<div style='margin-left: 19px;height: 20px;width: 20px; border-radius: 108%;background:" + value.status + "'> &nbsp;</div>"
            });
            $scope.inventoryData = data;
        })
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

        $scope.locationPopUp = function(location) {
            $scope.popUp = [];
            $http.get("https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/getMaterialLevelDetails?siteId=" + location).success(function(data) {
                angular.forEach(data, function(value, key) {

                    data[key].status = "<div style='margin-left: 19px;height: 20px;width: 20px; border-radius: 108%;background:" + value.status + "'> &nbsp;</div>"
                });
                $scope.popUp = data;
            });
        }





    }]);
});