/**
 * Renders all the widgets on the tab and triggers the datasources that are used
 * by the widgets. Customize your widgets by: - Overriding or extending widget
 * API methods - Changing widget settings or options
 */
/* jshint unused: false */

define(
    ['angular', './sample-module'],
    function(angular, controllers) {
        'use strict';
        // Controller definition
        controllers.controller('myInstallCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices) {
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
            var ssoObj = window.localStorage.getItem("SSO_ID");

            var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";

            var dynamicURL = getSiteName;
            var pmList = [];

            function SortById(x, y) {
                return ((x.ticketId == y.ticketId) ? 0 : ((x.ticketId > y.ticketId) ? 1 : -1));
            }

                commonServices.getSiteListForPM(ssoObj, "PM Install Drawing Approval,PM Install Drawing Approval","InProgress,Completed").then(function(data) {

                    commonServices.setData(data);
                    var pmviewData = data;
                    var length = pmviewData.length;
                    angular.forEach(data, function(value, key) {
                        var trimsiteid = value.siteId;
                        var siteId = trimsiteid.trim();
                        //console.log(JSON.stringify(data));
                        pmviewData[key].ticketId = "<a href=/approvedrawingdetails/" + value.ticketId + "/" + siteId + "/" + value.ticketSiteDetailsId + " ui-sref=approvedrawingdetails({ticketId:'" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + "'}) 'style='text-decoration: none'>" + value.ticketId + "</a>";

                        pmviewData[key].siteName = '';

                        dynamicURL += 'siteId=' + siteId + '|';
                        if (length == 1) {
                            dynamicURL += 'siteId=' + siteId;

                        }
                        length--;

                    });

                    $scope.completedsurvey = data;
                    $scope.completedsurvey.sort(SortById);

                    dynamicURL += '&fields=siteName,siteId';

                    loadSiteName(dynamicURL)

            });

            function loadSiteName(dynamicURL) {
                var sitename = [];

                commonServices.getAuthToken().then(
                    function(data) {
                        $scope.res = data;
                        commonServices.getSiteDataForPM(dynamicURL, data).then(function(data) {

                            console.log(sitename.length);

                            for (var i = 0; i < data.length; i++) {
                                angular.forEach($scope.completedsurvey, function(value, key) {

                                    if (value.siteId == data[i].siteId) {

                                        $scope.completedsurvey[key].siteName = data[i].siteName;
                                    }

                                });

                            }
                        })
                    });
            }


        }]);
    });