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
        controllers.controller('viewPostAuditCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices) {
            var urlPathArr = [];
            urlPathArr.push($state.current.name);
         var ssoObj = window.localStorage.getItem("SSO_ID");
        const ssoPrivilegeData = {
            contractorId: ssoObj
        };
            function privilegeAccess() {
                commonServices.getPrivilegeData(ssoPrivilegeData).then(function(privilege_Data) {
                    let privilegeData = privilege_Data.data;
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


            // // var getSiteList = commonServices.getadminServiceURL()+"/sitelist?assignedTo="+ssoObj+"&stageName=Install%20Drawing&status=InProgress";
            // var getSiteList = commonServices.getadminServiceURL()+"/sitelist?assignedTo=502616892&stageName=Install%20Drawing&status=InProgress";
            // //var getSiteList = "http://localhost:8080/sitelist?assignedTo=320006560&stageName=PM%20Design%20Approval&status=InProgress";
            // / var getSiteName ="https://predix-asset.run.asv-pr.ice.predix.io/site?filter=siteId=51957769221|siteId=78742033471&fields=siteName,siteId";
            var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";
            // // var getSiteListSurveyor =commonServices.getadminServiceURL()+"/sitelist?assignedTo=1&stageName=Install%20Drawing&status=Completed";
            // var getSiteListSurveyor =commonServices.getadminServiceURL()+"/sitelist?assignedTo="+ssoObj+"&stageName=Install%20Drawing&status=Completed";
            var dynamicURL = getSiteName;
            var pmList = [];

            function SortById(x, y) {
                return ((x.ticketId == y.ticketId) ? 0 : ((x.ticketId > y.ticketId) ? 1 : -1));
            }


            commonServices.getSiteListForPM(ssoObj, "Ready For Post Audit,Ready For Post Audit","InProgress,Completed").then(function(data) {
                // console.log(data);
                //pmList = data;
                //commonServices.getSiteListForPM(ssoObj, "Ready For Post Audit", "Completed").then(function(data) {

                   // data = data.concat(pmList)

                    console.log(data);
                    commonServices.setData(data);
                    var pmviewData = data;
                    var length = pmviewData.length;

                    angular.forEach(data, function(value, key) {

                        var trimsiteid = value.siteId;

                        var siteId = trimsiteid;
                        console.log(siteId);
                        // pmviewData[key].ticketId = "<a href=/createpostAuditsdetails/" + value.ticketId + "/" + siteId + "/" + value.ticketSiteDetailsId + " ui-sref=createpostAuditsdetails({ticketId:'" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + "'}) 'style='text-decoration: none'>" + value.ticketId + "</a>";

                        // pmviewData[key].ticketId = "<a href='/createpostAuditsdetails/"+parseInt(value.ticketId)+"/"+parseInt(siteId)+"/"+ parseInt(value.ticketSiteDetailsId)+"'>"+ value.ticketId + "</a>";

                        console.log(pmviewData[key].ticketId);
                        pmviewData[key].siteName = '';
                        var SiteName = loadSiteName(siteId);
                        dynamicURL += 'siteId=' + siteId + '|';
                        if (length == 1) {
                            dynamicURL += 'siteId=' + siteId;
                            console.log(dynamicURL);
                            console.log(length);
                        }
                        length--;
                        //data[key].siteName = SiteName;
                    });

                    console.log(data);
                    $scope.completedsurvey = data;
                    $scope.completedsurvey.sort(SortById);
                    dynamicURL += '&fields=siteName,siteId';
                    //$scope.finaldata.push(data);
                    loadSiteName(dynamicURL)
               // });

            });


            function loadSiteName(dynamicURL) {
                var sitename = [];
                //console.log(dynamicURL);
                commonServices.getAuthToken().then(
                    function(data) {
                        $scope.res = data;
                        commonServices.getSiteDataForPM(dynamicURL, data).then(function(data) {
                            // sitename.push(data);
                            console.log(sitename.length);
                            //siteNamebuilder(sitename);
                            for (var i = 0; i < data.length; i++) {
                                angular.forEach($scope.completedsurvey, function(value, key) {
                                    //console.log(value.siteName);
                                    if (value.siteId == data[i].siteId) {
                                        //alert(data[i].siteId +value.siteId );
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