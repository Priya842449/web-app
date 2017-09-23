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
        controllers.controller('installationSurveyCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices) {
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

            //  var getSiteList = "https://dt-survey-microservice.run.asv-pr.ice.predix.io/sitelist?assignedTo=1&stageName=Survey&status=InProgress";
            //Below is for PROD
            /*  var getSiteList = "https://dt-admin-microservice.run.aws-usw02-pr.ice.predix.io/sitelist?assignedTo=1&stageName=PM Survey Approval&status=InProgress";
            var getSiteListSurveyor = "https://dt-admin-microservice.run.aws-usw02-pr.ice.predix.io/sitelist?assignedTo=1&stageName=Survey&status=InProgress";
		  		   
            var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter="; */

            //Below is for DEV
            var getSiteList = commonServices.getadminServiceURL() + "/sitelist?assignedTo=1&stageName=PM Survey Approval&status=InProgress";
            var getSiteListSurveyor = commonServices.getadminServiceURL() + "/sitelist?assignedTo=1&stageName=Survey&status=InProgress";

            var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";

            //$scope.completedsurvey = [{"ticketId":"64"}];
            //$scope.finaldata=[];
            var dynamicURL = getSiteName;
            var pmList = [];
            $http.get(getSiteList).success(function(data) {
                // console.log(data);
                pmList = data;
                $http.get(getSiteListSurveyor).success(function(data) {

                    data = data.concat(pmList);

                    commonServices.setData(data);
                    var pmviewData = data;
                    var length = pmviewData.length;
                    angular.forEach(data, function(value, key) {
                        var trimsiteid = value.siteId;
                        var siteId = trimsiteid.trim();
                        //console.log(JSON.stringify(data));
                        pmviewData[key].ticketId = "<a href=/viewFileUploadedByDesigner/" + value.ticketId + "/" + siteId + "/" + value.ticketSiteDetailsId + " ui-sref=surveydetails({ticketId:'" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + "'}) 'style='text-decoration: none'>" + value.ticketId + "</a>";
                        pmviewData[key].siteName = '';
                        //  var SiteName =  loadSiteName(siteId);
                        dynamicURL += 'siteId=' + siteId + '|';
                        if (length == 1) {
                            dynamicURL += 'siteId=' + siteId;
                            // console.log(dynamicURL);
                            // console.log(length);
                        }
                        length--;
                        //data[key].siteName = SiteName;
                    });
                    //console.log(JSON.stringify(pmviewData));
                    $scope.completedsurvey = data;
                    //alert(JSON.stringify(data))
                    dynamicURL += '&fields=siteName,siteId';
                    //$scope.finaldata.push(data);
                    loadSiteName(dynamicURL)
                });
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

            // if(document.getElementById("pmview")){
            // alert(document.getElementById("pmview").selectedRows);
            // document.getElementById("pmview").addEventListener("px-row-click", function(e) {
            // alert();
            // console.log(e.detail.row);


            // });              
            // }

        }]);
    });