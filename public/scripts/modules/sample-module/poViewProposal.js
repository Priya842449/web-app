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
        controllers.controller('poViewProposalCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices) {
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
           // var getSiteList = commonServices.getadminServiceURL() + "/sitelist?assignedTo=" + ssoObj + "&stageName=Proposal&status=InProgress";
            var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";
           // var getSiteListSurveyor = commonServices.getadminServiceURL() + "/sitelist?assignedTo=" + ssoObj + "&stageName=Proposal&status=Completed";


            var dynamicURL = getSiteName;
            var pmList = [];

            function SortById(x, y) {
                return ((x.ticketId == y.ticketId) ? 0 : ((x.ticketId > y.ticketId) ? 1 : -1));
            }

            // $http.get(getSiteList).success(function(data) {
            //     // console.log(data);
            //     pmList = data;
            //     $http.get(getSiteListSurveyor).success(function(data) {

                commonServices.getSiteListForPM(ssoObj, "Proposal,Proposal","InProgress,Completed").then(function(data) {

                    //data = data.concat(pmList);

                    commonServices.setData(data);
                    var pmviewData = data;
                    var length = pmviewData.length;

                    angular.forEach(data, function(value, key) {

                        var trimsiteid = value.siteId;

                        var siteId = trimsiteid;
                        console.log(siteId);


                        pmviewData[key].ticketId = "<a href=/pmViewProposal/" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + " ui-sref=pmViewProposal({ticketId:'" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + "'}) 'style='text-decoration: none'>" + value.ticketId + "</a>";

                        //console.log(pmviewData[key].ticketId);
                        pmviewData[key].siteName = '';
                        //  var SiteName =  loadSiteName(siteId);
                        dynamicURL += 'siteId=' + siteId + '|';
                        if (length == 1) {
                            dynamicURL += 'siteId=' + siteId;
                           // console.log(dynamicURL);
                            //console.log(length);
                        }
                        length--;
                        //data[key].siteName = SiteName;
                    });

                    //console.log(data);
                    $scope.completedsurvey = data;
                    $scope.completedsurvey.sort(SortById);
                    dynamicURL += '&fields=siteName,siteId';
                    //$scope.finaldata.push(data);
                    loadSiteName(dynamicURL)
                //});

            });


            function loadSiteName(dynamicURL) {
                var sitename = [];
               // console.log(dynamicURL);
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
                                   // console.log($scope.completedsurvey);
                                });

                            }
                        })
                    });


            }

        }]);
    });