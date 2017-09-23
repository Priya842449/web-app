define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

        // Controller definition
        controllers.controller('mySurveyCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', 'flowServices', 'flowConstant', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices, flowServices, flowConstant) {
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

            //$scope.completedsurvey = [{"ticketId":"64"}];
            //$scope.finaldata=[];

            var dynamicURL = commonServices.getAssetURL() + "/site?pageSize=1000&filter=";
            var pmList = [];
            //var pmcompleted = []
            var ssoObj = window.localStorage.getItem("SSO_ID");

            function SortById(x, y) {
                return ((x.ticketId == y.ticketId) ? 0 : ((x.ticketId > y.ticketId) ? 1 : -1));
            }
            //console.log(flowConstant.stageIdONE);
            commonServices.getSiteListForPM(ssoObj, "Survey,Survey","InProgress,Completed").then(function(data) {

               console.log("PMAPPROVESURVEY",data);

                        commonServices.setData(data);
                        var pmviewData = data;
                        var length = pmviewData.length;
                        angular.forEach(data, function(value, key) {
                            var trimsiteid = value.siteId;
                            var siteId = trimsiteid.trim();
                            //console.log(JSON.stringify(data));

                            pmviewData[key].ticketId = "<a href=/surveydetails/" + value.ticketId + "/" + siteId + "/" + value.ticketSiteDetailsId + " ui-sref=surveydetails({ticketId:'" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + "'}) 'style='text-decoration: none'>" + value.ticketId + "</a>";

                            pmviewData[key].siteName = '';
                            //  var SiteName =  loadSiteName(siteId);
                            dynamicURL += 'siteId=' + siteId + '|';
                            if (length == 1) {
                                dynamicURL += 'siteId=' + siteId;
                                 //console.log("Inside dynamicURL",dynamicURL);
                                // console.log(length);
                            }
                            length--;
                            //data[key].siteName = SiteName;
                        });
                        //console.log(JSON.stringify(pmviewData));
                        $scope.completedsurvey = data;
                        console.log("List sUrvey data",data);
                        $scope.completedsurvey.sort(SortById);
                        console.log("completedsurvey",$scope.completedsurvey);
                        //alert(JSON.stringify(data))
                        dynamicURL += '&fields=siteName,siteId';
                        //$scope.finaldata.push(data);
                        loadSiteName(dynamicURL)
                   // });
                //});
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
                                            //$scope.completedsurvey[key].refKey = shwRefKey(data[i].siteId);
                                        }
                                        // console.log($scope.completedsurvey);
                                    });

                                }

                    });
            });
            }



      }]);
    });