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
        controllers.controller('postAuditReportCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices) {

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


            $scope.xAxisArray = [];
            $scope.yAxisArray = [];
            $scope.jsonArr = [];
            var config = '';
            $scope.postAuditCounter = 0;
            var fetchDevicesByPostAuditCategories = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=updateStatus=';
            //var googleChart = document.querySelector('#googleChart');
            $scope.postAuditCategories = ['Fixture Installed Correctly and operating', 'Fixture Missing', 'Extra Fixture Installed', 'Fixture not Operational', 'Poles not Operational', 'Pole Missing from Site', 'Fixture Positioned Incorrectly', 'Fixture Not Retrofit', 'Poles not On Map', 'Sides of Bldg with non working fixture'];
            var googleChartDivId = document.querySelector('#googleChart');
            var paperSpinner = document.querySelector('#paperSpinner');

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
                });
            });
            /*                           $scope.searchBySiteId = function (){                                       
            																	$scope.xAxisArray = [];
            																	$scope.yAxisArray = [];
            																	paperSpinner.setAttribute('active','');
            																	var textVal= document.getElementById('txtSiteId').value;
            																	
            																	$http.get(commonServices.getadminServiceURL()+"/postAuditSiteDetails?siteId="+textVal).success(function (siteResponse) {                                                       
            																									//console.log(siteResponse)
            																									for(var i=0; i< siteResponse.length; i++) {
            																																	$scope.xAxisArray.push(Object.keys(siteResponse[i])[0]);
            																																	var val=Object.keys(siteResponse[i])[0];                                                                              
            																																	$scope.yAxisArray.push(siteResponse[i][val]);                  
            																									//$scope.$broadcast("DiplayTheImage");
            																									}
            																									$scope.$broadcast("showGraph");
            																									//console.log($scope.xAxisArray)            
            																									//console.log($scope.yAxisArray)                                            
            																	});           
            																	$scope.$on("showGraph", function() {
            																									var chart = document.createElement('google-chart');
            																									var googleChartList = document.querySelectorAll('google-chart');
            																									if(!(googleChartList.length==0)) {
            																																	for (var i=0;i<googleChartList.length;i++){
            																																									googleChartDivId.removeChild(googleChartList[i]);                                                                                                                         
            																																	}                                                                                                                                                                                                              
            																									}                                                              
            																									$scope.jsonArr = [];
            																									for(var i=0;i<$scope.xAxisArray.length;i++){
            																																	$scope.jsonArr.push('["'+$scope.xAxisArray[i]+'",'+$scope.yAxisArray[i]+']');
            																									}                                                              
            																									$scope.createGraph(chart,$scope.jsonArr);                                        
            																	});
            									}; */
            $scope.$on("postAuditGraph", function() {
                if ($scope.postAuditCounter <= ($scope.postAuditCategories.length - 1)) {
                    var textVal = document.getElementById('txtSiteId').value;
                    $http.get(fetchDevicesByPostAuditCategories + $scope.postAuditCategories[$scope.postAuditCounter] + ':siteId=' + textVal + '<site[t3]', config).success(function(deviceResponse) {
                        //console.log(fetchDevicesByPostAuditCategories+$scope.postAuditCategories[$scope.postAuditCounter]+':siteId='+textVal+'<site[t3]');
                        //console.log(deviceResponse.length);
                        $scope.yAxisArray.push(deviceResponse.length);
                        //console.log($scope.yAxisArray);
                        $scope.postAuditCounter = $scope.postAuditCounter + 1;
                        $scope.$broadcast("postAuditGraph");
                    });
                } else {
                    var chart = document.createElement('google-chart');
                    var googleChartList = document.querySelectorAll('google-chart');
                    if (!(googleChartList.length == 0)) {
                        for (var i = 0; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                    }
                    $scope.jsonArr = [];
                    for (var i = 0; i < $scope.postAuditCategories.length; i++) {
                        $scope.jsonArr.push('["' + $scope.postAuditCategories[i] + '",' + $scope.yAxisArray[i] + ']');
                    }
                    $scope.createGraph(chart, $scope.jsonArr);
                }
            });

            $scope.searchBySiteId = function() {
                $scope.yAxisArray = [];
                paperSpinner.setAttribute('active', '');
                $scope.$broadcast("postAuditGraph");
            };

            window.addEventListener('google-chart-render', function(e) {
                paperSpinner.removeAttribute('active');
            });

            $scope.createGraph = function(chart, jsonArr) {
                chart.setAttribute('type', 'column');
                chart.setAttribute('options', '{"title": "Distribution of Post Audit By Categories","hAxis": {"title": "Categories", "minValue": 0, "maxValue": 10},"vAxis": {"title": "Number", "minValue": 0, "maxValue": 100}, "is3D": true, "animation": {"startup": true, "duration": 1000, "easing": "in"}}');
                chart.setAttribute('cols', '[{"label": "No. of Assets", "type": "string"},{"label": "No. of Assets", "type": "number"}]');
                chart.setAttribute('rows', '[' + jsonArr + ']');
                googleChartDivId.appendChild(chart);
            };

        }]);
    });