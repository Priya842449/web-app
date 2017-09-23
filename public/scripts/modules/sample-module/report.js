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
    controllers.controller('ReportCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$scope', '$rootScope', '$q', 'commonServices',
        function($state, $timeout, $http, $log, PredixAssetService, $scope, $rootScope, $q, commonServices) {
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
            $scope.siteResult = "";
            $scope.customerResult = "";
            $scope.stationResult = "";
            var fetchCustomersUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=uri=/customer/401830..*&pageSize=10';
            var fetchDevicesBasedOnCustomerUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=customerId=';
            var fetchDevicesBasedOnSiteUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=siteId=';
            //var fetchSitesBasedOnCustomerUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=customerId=';
            var fetchSitesBasedOnCustomerUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?pageSize=10&filter=customerId=';
            var fetchSiteBasedOnId = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=';
            var fetchDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=siteId=';
            var fetchSkuByDeviceUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=';
            var fetchCustomerByIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=customerId=';
            var fetchSiteById = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=';
            var fetchStationBySiteIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/station?filter=siteId=';
            var fetchDevicesBasedOnStationUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=stationId=';
            var filterSiteCust = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=parent=/customer/';
            var fetchCustomerById = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=customerId=';
            var fetchCustomerBySiteId = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=siteId=';
            var fetchCustomerBasedOnSiteIdForSku = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=uri=';
            var fetchDevicesBasedOnSkuId = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=skuId=';
            var fetchSkuDescriptionById = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=skuId='
            $scope.chartType = 'line';
            //var chartType = 'line';
            $scope.link;
            $scope.url = [];
            $scope.xAxisTitle = '';
            $scope.chartTitle = '';
            $scope.jsonArr = [];
            $scope.siteLinkArr = [];
            $scope.customerLinkArr = [];
            $scope.stationLinkArr = [];
            $scope.jsonSkuArr = [];
            $scope.idList = [];
            $scope.customerIdArr = [];
            $scope.siteIdArr = [];
            $scope.skuIdArr = [];
            $scope.skuDescriptionIdArr = [];
            $scope.siteIdBySkuArr = [];
            $scope.customerIdBySkuArr = [];
            $scope.customerXaxisArray = [];
            $scope.customerYaxisArray = [];
            $scope.customerByIdXaxisArray = [];
            $scope.customerByIdYaxisArray = [];
            $scope.siteXaxisArray = [];
            $scope.siteYaxisArray = [];
            $scope.siteByIdXaxisArray = [];
            $scope.siteByIdYaxisArray = [];
            $scope.stationXaxisArray = [];
            $scope.stationYaxisArray = [];
            $scope.skuXaxisArray = [];
            $scope.skuYaxisArray = [];
            $scope.skuDescriptionXaxisArray = [];
            $scope.skuDescriptionYaxisArray = [];
            var googleChart = document.querySelector('#googleChart');
            var skuGoogleChart = document.querySelector('#skuGoogleChart');
            var paperSpinner = document.querySelector('#paperSpinner');
            var googleChartDivId = document.querySelector('#googleChart');
            $scope.customerId;
            $scope.siteId;
            $scope.skuId;
            $scope.siteIdForSku;
            $scope.isCustomerSelected = false;
            $scope.isSiteSelected = false;
            $scope.isSkuSelected = false;
            $scope.customerCounter = 0;
            $scope.siteCounter = 0;
            $scope.stationCounter = 0;
            $scope.customerByIdCounter = 0;
            $scope.siteByIdCounter = 0;
            $scope.siteCustomerChartDrawnCounter = 0;
            $scope.skuCounter = 0;
            $scope.skuDescriptionCounter = 0;
            $scope.startTime = "";
            $scope.renderTime = "";
            $scope.endTime = "";
            $scope.executionTime = "";
            $scope.customerFlag = false;
            $scope.siteFlag = false;
            $scope.stationFlag = false;
            $scope.skuFlag = false;

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

                    var inputCustElement = document.querySelector('paper-typeahead-input-customer');
                    inputCustElement.setAttribute('cnf', auth);
                    inputCustElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                    var inputSiteElement = document.querySelector('paper-typeahead-input-site');
                    inputSiteElement.setAttribute('cnf', auth);
                    inputSiteElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');

                    var inputSkuElement = document.querySelector('paper-typeahead-input-sku');
                    inputSkuElement.setAttribute('cnf', auth);
                    inputSkuElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');

                    $scope.$on("customerChart", function() {
                        if ($scope.customerCounter <= ($scope.customerXaxisArray.length - 1)) {
                            $http.get(fetchDevicesBasedOnCustomerUrl + $scope.idList[$scope.customerCounter] + '<parent[t3]', config).success(function(deviceResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("Page Load Customer Chart End Time (After Y-axis HTTP call): " + $scope.endTime);
                                $scope.customerYaxisArray.push(deviceResponse.length);
                                $scope.customerCounter = $scope.customerCounter + 1;
                                $scope.$broadcast("customerChart");
                            });
                            paperSpinner.setAttribute('active', '');
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.customerYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.customerXaxisArray[i] + '",' + $scope.customerYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 0; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 0);
                            $scope.xAxisTitle = 'Customers';
                            $scope.chartTitle = 'Distribution of Devices by Customers';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.idList);
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (Page Load Customer Chart in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering Page Load Customer Chart Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.customerYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.customerXaxisArray[i] + '",' + $scope.customerYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 0; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 0);
                            $scope.xAxisTitle = 'Customers';
                            $scope.chartTitle = 'Distribution of Devices by Customers';
                            var custPrevNextDiv = document.querySelector('#customerPrevNext');
                            $scope.createGraph(chart, $scope.jsonArr, $scope.idList);
                            googleChartDivId.appendChild(custPrevNextDiv);
                            $("#customerPrevNext").show();
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering Page Load Customer Chart End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for Page Load Customer Chart: ' + $scope.msToHMS($scope.renderTime));
                            $scope.customerCounter = 0;
                            $scope.customerXaxisArray = [];
                            $scope.customerYaxisArray = [];
                            $scope.xAxisTitle = '';
                            $scope.chartTitle = '';
                            /* 					$scope.customerId = ''; */
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                        }
                    });

                    $scope.customerNext = function() {
                        var chartIndex = 0;
                        $('#customerPrevious').prop('disabled', false);
                        $("#customerPrevNext").hide();
                        $("#sitePrevNext").hide();
                        var googleChartList = document.querySelectorAll('google-chart');
                        if (!(googleChartList.length == 0)) {
                            for (var i = chartIndex; i < googleChartList.length; i++) {
                                googleChartDivId.removeChild(googleChartList[i]);
                            }
                            $scope.createCustomerChartNext();
                        }
                    };

                    $scope.customerPrevious = function() {
                        var chartIndex = 0;
                        $('#customerNext').prop('disabled', false);
                        $("#customerPrevNext").hide();
                        var googleChartList = document.querySelectorAll('google-chart');
                        if (!(googleChartList.length == 0)) {
                            for (var i = chartIndex; i < googleChartList.length; i++) {
                                googleChartDivId.removeChild(googleChartList[i]);
                            }
                            $scope.createCustomerChartPrev();
                        }
                    };

                    $scope.createCustomerChart = function() {
                        if ($scope.customerLinkArr.length == 0) {
                            $scope.customerLinkArr.push(fetchCustomersUrl);
                            $('#customerPrevious').prop('disabled', true);
                        }
                        $scope.startTime = $scope.getIstTime();
                        console.log("Page Load Customer Chart Start Time (Before X-axis HTTP call): " + $scope.startTime);
                        $http.get(fetchCustomersUrl, config).success(function(response, headers, status, XMLHTTPResponse, Link) {
                            $scope.endTime = $scope.getIstTime();
                            console.log("Page Load Customer Chart End Time (After X-axis HTTP call): " + $scope.endTime);
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (Page Load Customer Chart in fetching Customer Name for X-axis): ' + $scope.msToHMS($scope.executionTime));
                            if (!(status().link == undefined)) {
                                var str = status().link;
                                $scope.customerResult = str.substr(1, str.lastIndexOf(">") - 1);
                            }
                            paperSpinner.setAttribute('active', '');
                            var xAxisArray = new Array();
                            var yAxisArray = new Array();
                            $scope.idList = [];
                            var custArr = new Array(response.length - 1);
                            for (var i = 0; i < response.length; i++) {
                                $scope.customerXaxisArray.push(response[i].customerName1);
                                $scope.idList.push(response[i].customerId);
                            }
                            $scope.startTime = $scope.getIstTime();
                            console.log("Page Load Customer Chart Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                            $scope.$broadcast("customerChart");
                        });
                    };

                    $scope.createCustomerChart();

                    $scope.createCustomerChartNext = function(value) {
                        if ($scope.customerResult != "") {
                            $scope.customerLinkArr.push(fetchCustomersUrl);
                            fetchCustomersUrl = $scope.customerResult;
                        }
                        $scope.createCustomerChart();
                    };

                    $scope.createCustomerChartPrev = function() {
                        paperSpinner.setAttribute('active', '');
                        var xAxisArray = new Array();
                        var yAxisArray = new Array();
                        $scope.idList = [];
                        if ($scope.customerLinkArr.length == 0) {
                            $('#previous').prop('disabled', true);
                            fetchCustomersUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=uri=/customer/0..*&pageSize=10';
                            $('#customerPrevious').prop('disabled', true);
                            $scope.customerResult = "";
                        } else {
                            fetchCustomersUrl = $scope.customerLinkArr.pop();
                        }
                        $scope.createCustomerChart();
                    };

                    $scope.$on("customerByIdChart", function() {
                        if ($scope.customerByIdCounter <= ($scope.customerByIdXaxisArray.length - 1)) {
                            $http.get(fetchDevicesBasedOnCustomerUrl + $scope.customerIdArr[$scope.customerByIdCounter] + '<parent[t3]', config).success(function(deviceResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("Customer Chart By Id End Time (After Y-axis HTTP call): " + $scope.endTime);
                                $scope.customerByIdYaxisArray.push(deviceResponse.length);
                                $scope.customerByIdCounter = $scope.customerByIdCounter + 1;
                                $scope.$broadcast("customerByIdChart");
                            });
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.customerByIdYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.customerByIdXaxisArray[i] + '",' + $scope.customerByIdYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 0; i < 1; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 1);
                            $scope.xAxisTitle = 'Customers';
                            $scope.chartTitle = 'Distribution of Devices by Customers';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.customerIdArr);
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (Customer Chart By Id in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering Customer Chart By Id Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.customerByIdYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.customerByIdXaxisArray[i] + '",' + $scope.customerByIdYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 0; i < 1; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 1);
                            $scope.xAxisTitle = 'Customers';
                            $scope.chartTitle = 'Distribution of Devices by Customers';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.customerIdArr);
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering Customer Chart By Id End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for Customer Chart By Id: ' + $scope.msToHMS($scope.renderTime));
                            $scope.customerByIdCounter = 0;
                            $scope.customerByIdXaxisArray = [];
                            $scope.customerByIdYaxisArray = [];
                            $scope.xAxisTitle = '';
                            $scope.chartTitle = '';
                            /* 					$scope.customerId = ''; */
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                            if (($scope.customerFlag)) {
                                $rootScope.$broadcast("customerChartDrawn");
                            } else if (($scope.siteFlag)) {
                                $rootScope.$broadcast("siteCustomerChartDrawn");
                            } else if (($scope.skuFlag)) {
                                $rootScope.$broadcast("siteByIdChartDrawn");
                            }
                        }
                    });

                    $scope.$on("siteChart", function() {
                        if ($scope.siteCounter <= ($scope.siteXaxisArray.length - 1)) {
                            $http.get(fetchDevicesBasedOnSiteUrl + $scope.idList[$scope.siteCounter] + '<parent[t3]', config).success(function(deviceResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("Site Chart End Time (After Y-axis HTTP call): " + $scope.endTime);
                                $scope.siteYaxisArray.push(deviceResponse.length);
                                $scope.siteCounter = $scope.siteCounter + 1;
                                $scope.$broadcast("siteChart");
                            });
                            paperSpinner.setAttribute('active', '');
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.siteYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.siteXaxisArray[i] + '",' + $scope.siteYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 1; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 2);
                            $scope.xAxisTitle = 'Sites';
                            $scope.chartTitle = 'Distribution of Devices by Sites';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.idList);
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (Site Chart in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering Site Chart Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.siteYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.siteXaxisArray[i] + '",' + $scope.siteYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 1; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 2);
                            $scope.xAxisTitle = 'Sites';
                            $scope.chartTitle = 'Distribution of Devices by Sites';
                            var sitePrevNextDiv = document.querySelector('#sitePrevNext');
                            $scope.createGraph(chart, $scope.jsonArr, $scope.idList);
                            googleChartDivId.appendChild(sitePrevNextDiv);
                            $("#sitePrevNext").show();
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering Site Chart End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for Site Chart: ' + $scope.msToHMS($scope.renderTime));
                            $scope.siteCounter = 0;
                            $scope.siteXaxisArray = [];
                            $scope.siteYaxisArray = [];
                            $scope.xAxisTitle = '';
                            $scope.chartTitle = '';
                            /* 					$scope.customerId = ''; */
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                        }
                    });

                    $scope.$on("siteByIdChart", function() {
                        if ($scope.siteByIdCounter <= ($scope.siteByIdXaxisArray.length - 1)) {
                            $http.get(fetchDevicesBasedOnSiteUrl + $scope.siteIdArr[$scope.siteByIdCounter] + '<parent[t3]', config).success(function(deviceResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("Site Chart By Id End Time (After Y-axis HTTP call): " + $scope.endTime);
                                $scope.siteByIdYaxisArray.push(deviceResponse.length);
                                $scope.siteByIdCounter = $scope.siteByIdCounter + 1;
                                $scope.$broadcast("siteByIdChart");
                            });
                            paperSpinner.setAttribute('active', '');
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.siteByIdYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.siteByIdXaxisArray[i] + '",' + $scope.siteByIdYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 1; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 2);
                            $scope.xAxisTitle = 'Sites';
                            $scope.chartTitle = 'Distribution of Devices by Sites';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.siteIdArr);
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (Site Chart By Id in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering Site Chart By Id Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.siteByIdYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.siteByIdXaxisArray[i] + '",' + $scope.siteByIdYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 1; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 2);
                            $scope.xAxisTitle = 'Sites';
                            $scope.chartTitle = 'Distribution of Devices by Sites';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.siteIdArr);
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering Site Chart By Id End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for Site Chart By Id: ' + $scope.msToHMS($scope.renderTime));
                            $scope.siteByIdCounter = 0;
                            $scope.siteByIdXaxisArray = [];
                            $scope.siteByIdYaxisArray = [];
                            $scope.customerFlag = false;
                            $scope.siteFlag = false;
                            $scope.xAxisTitle = '';
                            $scope.chartTitle = '';
                            /* 					$scope.customerId = ''; */
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                            if (($scope.skuFlag)) {
                                $rootScope.$broadcast("siteByIdChartDrawn");
                            }
                        }
                    });

                    $scope.siteNext = function() {
                        var chartIndex = 1;
                        $('#sitePrevious').prop('disabled', false);
                        $("#sitePrevNext").hide();
                        var googleChartList = document.querySelectorAll('google-chart');
                        if (!(googleChartList.length == 0)) {
                            for (var i = chartIndex; i < googleChartList.length; i++) {
                                googleChartDivId.removeChild(googleChartList[i]);
                            }
                            $scope.createSiteChartNext();
                        }
                    }

                    $scope.sitePrevious = function() {
                        var chartIndex = 1;
                        $('#siteNext').prop('disabled', false);
                        $("#sitePrevNext").hide();
                        var googleChartList = document.querySelectorAll('google-chart');
                        if (!(googleChartList.length == 0)) {
                            for (var i = chartIndex; i < googleChartList.length; i++) {
                                googleChartDivId.removeChild(googleChartList[i]);
                            }
                            $scope.createSiteChartPrev();
                        }
                    }

                    $scope.createSiteChartNext = function() {
                        if ($scope.siteResult != "") {
                            $scope.siteLinkArr.push(fetchSitesBasedOnCustomerUrl);
                            fetchSitesBasedOnCustomerUrl = $scope.siteResult;
                        }
                        $scope.selectedSite($scope.customerId);
                    };

                    $scope.createSiteChartPrev = function() {
                        paperSpinner.setAttribute('active', '');
                        if ($scope.siteLinkArr.length == 0) {
                            $('#sitePrevious').prop('disabled', true);
                            var custId = $scope.customerId;
                            fetchSitesBasedOnCustomerUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?pageSize=10&filter=customerId=' + custId.trim() + '<parent[t3]';
                            $scope.siteResult = "";
                        } else {
                            fetchSitesBasedOnCustomerUrl = $scope.siteLinkArr.pop();
                        }
                        $scope.selectedSite($scope.customerId);
                    };

                    $scope.$on("stationChart", function() {
                        if ($scope.stationCounter <= ($scope.stationXaxisArray.length - 1)) {
                            $http.get(fetchDevicesBasedOnStationUrl + $scope.idList[$scope.stationCounter] + '<parent[t3]', config).success(function(deviceResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("Station Chart End Time (After Y-axis HTTP call): " + $scope.endTime);
                                $scope.stationYaxisArray.push(deviceResponse.length);
                                $scope.stationCounter = $scope.stationCounter + 1;
                                $scope.$broadcast("stationChart");
                            });
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (Station Chart in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering Station Chart Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            for (var i = 0; i < $scope.stationYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.stationXaxisArray[i] + '",' + $scope.stationYaxisArray[i] + ']');
                            }
                            var googleChartList = document.querySelectorAll('google-chart');
                            if (!(googleChartList.length == 0)) {
                                for (var i = 2; i < googleChartList.length; i++) {
                                    googleChartDivId.removeChild(googleChartList[i]);
                                }
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 3);
                            $scope.xAxisTitle = 'Station Type';
                            $scope.chartTitle = 'Distribution of Devices by Station (Building/Parking Lot)';
                            $scope.createGraph(chart, $scope.jsonArr, $scope.idList);
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering Station Chart By Id End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for Station Chart By Id: ' + $scope.msToHMS($scope.renderTime));
                            $scope.stationCounter = 0;
                            $scope.stationXaxisArray = [];
                            $scope.stationYaxisArray = [];
                            $scope.xAxisTitle = '';
                            $scope.chartTitle = '';
                            /* 					$scope.customerId = ''; */
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                            if (($scope.stationFlag)) {
                                $rootScope.$broadcast("stationChartDrawn");
                            }
                        }
                    });

                    $rootScope.$on("siteCustomerChartDrawn", function() {
                        $scope.selectedSiteById($scope.siteId);
                    });

                    $rootScope.$on("customerChartDrawn", function() {
                        $scope.selectedSiteById($scope.siteId);
                    });

                    $scope.$on("skuChart", function() {
                        if ($scope.skuCounter <= ($scope.skuYaxisArray.length - 1)) {
                            $http.get(fetchSkuByDeviceUrl + $scope.skuIdArr[$scope.skuCounter], config).success(function(deviceResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("SKU Chart End Time (After X-axis HTTP call): " + $scope.endTime);
                                //console.log("Response: "+deviceResponse);
                                /* 						angular.forEach(deviceResponse, function(value, key) {
                                							angular.forEach(value, function(value1, key1) {
                                								if (key1 == 'skuDescription') {
                                									$scope.skuXaxisArray.push(value1);
                                									console.log($scope.skuXaxisArray);
                                								}
                                							});	
                                						}); */
                                for (var i = 0; i < deviceResponse.length; i++) {
                                    $scope.skuXaxisArray.push(deviceResponse[i].skuDescription);
                                    console.log($scope.skuXaxisArray);
                                }
                                $scope.skuCounter = $scope.skuCounter + 1;
                                $scope.$broadcast("skuChart");
                            });
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (SKU Chart in fetching SKU Description for X-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering SKU Chart Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            $scope.xAxisTitle = 'SKU';
                            $scope.chartTitle = 'Distribution of Devices by SKU';
                            for (var i = 0; i < $scope.skuYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.skuXaxisArray[i] + '",' + $scope.skuYaxisArray[i] + ']');
                            }
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 4);
                            $scope.createGraph(chart, $scope.jsonArr, $scope.skuIdArr);
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering SKU Chart End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for SKU Chart: ' + $scope.msToHMS($scope.renderTime));
                            $scope.skuCounter = 0;
                            $scope.skuXaxisArray = [];
                            $scope.skuYaxisArray = [];
                            $scope.stationFlag = false;
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                        }
                    });

                    $rootScope.$on("stationChartDrawn", function() {
                        $scope.selectedSku($scope.siteIdForSku);
                    });

                    $scope.$on("skuDescriptionChart", function() {
                        if ($scope.skuDescriptionCounter <= ($scope.skuDescriptionYaxisArray.length - 1)) {
                            //alert($scope.skuDescriptionIdArr[$scope.skuDescriptionCounter]);
                            $http.get(fetchSkuDescriptionById + $scope.skuDescriptionIdArr[$scope.skuDescriptionCounter], config).success(function(skuResponse) {
                                $scope.endTime = $scope.getIstTime();
                                console.log("SKU Chart By Description End Time (After X-axis HTTP call): " + $scope.endTime);
                                for (var i = 0; i < skuResponse.length; i++) {
                                    $scope.skuDescriptionXaxisArray.push(skuResponse[i].skuDescription);
                                }
                                $scope.skuDescriptionCounter = $scope.skuDescriptionCounter + 1;
                                $scope.$broadcast("skuDescriptionChart");
                            });
                        } else {
                            $scope.executionTime = $scope.endTime - $scope.startTime;
                            console.log('Execution time between the HTTP calls (SKU Chart By Description in fetching SKU Description for X-axis): ' + $scope.msToHMS($scope.executionTime));
                            $scope.startTime = $scope.getIstTime();
                            console.log("Rendering SKU Chart By Description Start Time: " + $scope.startTime);
                            $scope.jsonArr = [];
                            $scope.xAxisTitle = 'SKU';
                            $scope.chartTitle = 'Distribution of Devices by SKU';
                            for (var i = 0; i < $scope.skuDescriptionYaxisArray.length; i++) {
                                $scope.jsonArr.push('["' + $scope.skuDescriptionXaxisArray[i] + '",' + $scope.skuDescriptionYaxisArray[i] + ']');
                            }
                            /* 					var googleChartList = document.querySelectorAll('google-chart');
                            					if(!(googleChartList.length==0)) {
                            						for (var i=0;i<googleChartList.length;i++){
                            							googleChartDivId.removeChild(googleChartList[i]);								
                            						}													
                            					} */
                            var chart = document.createElement('google-chart');
                            chart.setAttribute('index', 4);
                            $scope.createGraph(chart, $scope.jsonArr, $scope.skuDescriptionIdArr);
                            $scope.endTime = $scope.getIstTime();
                            console.log("Rendering SKU By Description Chart End Time: " + $scope.endTime);
                            $scope.renderTime = $scope.endTime - $scope.startTime;
                            console.log('Render time for SKU Chart By Description: ' + $scope.msToHMS($scope.renderTime));
                            $scope.skuDescriptionCounter = 0;
                            $scope.skuDescriptionXaxisArray = [];
                            $scope.skuDescriptionYaxisArray = [];
                            $scope.skuFlag = false;
                            $scope.startTime = "";
                            $scope.renderTime = "";
                            $scope.endTime = "";
                            $scope.executionTime = "";
                        }
                    });

                    $rootScope.$on("siteByIdChartDrawn", function() {
                        $scope.selectedSkuDescription($scope.skuId);
                    });
                });
            });

            $scope.swapChartType = function() {
                var googleChartList = document.querySelectorAll('google-chart');
                if (!(googleChartList.length == 0)) {
                    for (var i = 0; i < googleChartList.length; i++) {
                        googleChartDivId.removeChild(googleChartList[i]);
                    }
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                }
                if (!(googleChartList.length == 0)) {
                    for (var i = 0; i < googleChartList.length; i++) {
                        if (googleChartList[i].getAttribute('type') == 'line') {
                            var chart = document.createElement('google-chart');
                            $scope.createAreaChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'), googleChartList[i].getAttribute('idList'));
                            $scope.chartType = 'area';
                        } else if (googleChartList[i].getAttribute('type') == 'area') {
                            var chart = document.createElement('google-chart');
                            $scope.createPieChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'), googleChartList[i].getAttribute('idList'));
                            $scope.chartType = 'pie';
                        } else if (googleChartList[i].getAttribute('type') == 'pie') {
                            var chart = document.createElement('google-chart');
                            $scope.createSteppedAreaChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'), googleChartList[i].getAttribute('idList'));
                            $scope.chartType = 'stepped-area';
                        } else if (googleChartList[i].getAttribute('type') == 'stepped-area') {
                            var chart = document.createElement('google-chart');
                            $scope.createColumnChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'), googleChartList[i].getAttribute('idList'));
                            $scope.chartType = 'column';
                        } else {
                            var chart = document.createElement('google-chart');
                            $scope.createLineChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'), googleChartList[i].getAttribute('idList'));
                            $scope.chartType = 'line';
                        }
                        if (googleChartList[i].getAttribute('index') == 0) {
                            var custPrevNextDiv = document.querySelector('#customerPrevNext');
                            googleChartDivId.appendChild(custPrevNextDiv);
                            $("#customerPrevNext").show();
                        } else if (googleChartList[i].getAttribute('index') == 2) {
                            var sitePrevNextDiv = document.querySelector('#sitePrevNext');
                            googleChartDivId.appendChild(sitePrevNextDiv);
                            $("#sitePrevNext").show();
                        }
                    }
                }
            }

            $scope.addZero = function(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

            $scope.getIstTime = function() {
                var sec_num = new Date();
                var h = $scope.addZero(sec_num.getHours());
                var m = $scope.addZero(sec_num.getMinutes());
                var s = $scope.addZero(sec_num.getSeconds());
                return sec_num;
            };

            $scope.msToHMS = function(ms) {
                var seconds = ms / 1000;
                var hours = parseInt(seconds / 3600);
                seconds = seconds % 3600;
                var minutes = parseInt(seconds / 60);
                seconds = seconds % 60;
                return hours + ":" + minutes + ":" + seconds;
            };

            $scope.reset = function() {
                $scope.clear();
                var googleChartList = document.querySelectorAll('google-chart');
                if (!(googleChartList.length == 0)) {
                    for (var i = 1; i < googleChartList.length; i++) {
                        googleChartDivId.removeChild(googleChartList[i]);
                    }
                }
                $("#customerPrevNext").hide();
                $("#sitePrevNext").hide();
                if (!($scope.customerResponseData == null)) {
                    $scope.customerResponseData = "";
                }
                if (!($scope.siteResponseData == null)) {
                    $scope.siteResponseData = "";
                }
                $scope.createCustomerChart();
                $scope.customerFlag = false;
                $scope.siteFlag = false;
            };

            $scope.createLineChart = function(chart, index, options, cols, rows, idList) {
                chart.setAttribute('index', index);
                chart.setAttribute('type', 'line');
                chart.setAttribute('options', options);
                chart.setAttribute('cols', cols);
                chart.setAttribute('rows', rows);
                chart.setAttribute('idList', idList);
                googleChartDivId.appendChild(chart);
            };

            $scope.createAreaChart = function(chart, index, options, cols, rows, idList) {
                chart.setAttribute('index', index);
                chart.setAttribute('type', 'area');
                chart.setAttribute('options', options);
                chart.setAttribute('cols', cols);
                chart.setAttribute('rows', rows);
                chart.setAttribute('idList', idList);
                googleChartDivId.appendChild(chart);
            };

            $scope.createPieChart = function(chart, index, options, cols, rows, idList) {
                chart.setAttribute('index', index);
                chart.setAttribute('type', 'pie');
                chart.setAttribute('options', options);
                chart.setAttribute('cols', cols);
                chart.setAttribute('rows', rows);
                chart.setAttribute('idList', idList);
                googleChartDivId.appendChild(chart);
            };

            $scope.createSteppedAreaChart = function(chart, index, options, cols, rows, idList) {
                chart.setAttribute('index', index);
                chart.setAttribute('type', 'stepped-area');
                chart.setAttribute('options', options);
                chart.setAttribute('cols', cols);
                chart.setAttribute('rows', rows);
                chart.setAttribute('idList', idList);
                googleChartDivId.appendChild(chart);
            };

            $scope.createColumnChart = function(chart, index, options, cols, rows, idList) {
                chart.setAttribute('index', index);
                chart.setAttribute('type', 'column');
                chart.setAttribute('options', options);
                chart.setAttribute('cols', cols);
                chart.setAttribute('rows', rows);
                chart.setAttribute('idList', idList);
                googleChartDivId.appendChild(chart);
            };

            $scope.createGraph = function(chart, jsonArr, idList) {
                chart.setAttribute('type', $scope.chartType);
                chart.setAttribute('options', '{"title": "' + $scope.chartTitle + '","hAxis": {"title": "' + $scope.xAxisTitle + '", "minValue": 0, "maxValue": 10},"vAxis": {"title": "No. of Devices", "minValue": 0, "maxValue": 1000}, "is3D": true, "animation": {"startup": true, "duration": 1000, "easing": "in"}}');
                chart.setAttribute('cols', '[{"label": "Type of Devices", "type": "string"},{"label": "No. of Devices", "type": "number"}]');
                chart.setAttribute('rows', '[' + jsonArr + ']');
                chart.setAttribute('idList', idList);
                googleChartDivId.appendChild(chart);
            };

            /* 		window.addEventListener('WebComponentsReady', function(e) {
            			$scope.createCustomerChart();
            		}); */

            $scope.clear = function() {
                document.getElementById('serchselection').innerHTML = '';
                var inputCust = document.querySelector('paper-typeahead-input-customer');
                inputCust.inputValue = '';
                inputCust.keyid = '';
                var inputSite = document.querySelector('paper-typeahead-input-site');
                inputSite.inputValue = '';
                inputSite.keyid = '';
                var inputSku = document.querySelector('paper-typeahead-input-sku');
                inputSku.inputValue = '';
                var paperSite = document.querySelector('paper-typeahead-input-site');
                var remoteUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteName=%QUERY*&fields=siteId,siteName';
                paperSite.setAttribute('remote-url', remoteUrl);
                $scope.isCustomerSelected = false;
                $scope.isSiteSelected = false;
                $scope.isSkuSelected = false;
            };

            $scope.searchCriteria = function() {
                var i = 0;
                if ($scope.isCustomerSelected) {
                    if (document.getElementById('serchselection').hasChildNodes()) {
                        if (document.getElementById("cust") != null) {
                            document.getElementById("cust").parentNode.removeChild(document.getElementById("cust"));
                        }
                    }
                    var inputCust = document.querySelector('paper-typeahead-input-customer');
                    i++;
                    //var title = document.getElementById('test').value;
                    var node = document.createElement('label');
                    node.innerHTML = '<label  style=" margin-right: 4px;color: Black; font-size: initial;" id="cust" for="check  ' + i + '"> Customer:' + inputCust.inputValue + '</label>';
                    document.getElementById('serchselection').appendChild(node);
                }

                if ($scope.isSiteSelected) {
                    if (document.getElementById('serchselection').hasChildNodes()) {
                        if (document.getElementById("site") != null) {
                            document.getElementById("site").parentNode.removeChild(document.getElementById("site"));
                        }
                    }
                    var inputSite = document.querySelector('paper-typeahead-input-site');
                    i++;
                    //var title = document.getElementById('test').value;
                    var node = document.createElement('label');
                    node.innerHTML = '<label   style=" margin-right: 4px;color: Black; font-size: initial;" id="site" for="check ' + i + '">Site:' + inputSite.inputValue + '</label>';
                    document.getElementById('serchselection').appendChild(node);
                }

                if (document.querySelector('paper-typeahead-input-site').inputValue == "") {
                    if (document.getElementById("site") != null) {
                        document.getElementById("site").parentNode.removeChild(document.getElementById("site"));
                    }
                }

                if (!($scope.customerResponseData == null)) {
                    $scope.customerResponseData = "";
                }
                if (!($scope.siteResponseData == null)) {
                    $scope.siteResponseData = "";
                }

                if (($scope.isCustomerSelected) && !($scope.isSiteSelected) && !($scope.isSkuSelected)) {
                    //alert("Hi");
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    var chartIndex = 1;
                    if (!(googleChartList.length == 0)) {
                        for (var i = chartIndex; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        $scope.selectedCustomer($scope.customerId);
                    } else {
                        $scope.selectedCustomer($scope.customerId);
                    }
                } else if (($scope.isSiteSelected) && !($scope.isCustomerSelected) && !($scope.isSkuSelected)) {
                    paperSpinner.setAttribute('active', '');
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    var chartIndex = 0;
                    if (!(googleChartList.length == 0)) {
                        for (var i = chartIndex; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        if ($scope.customerId == undefined || $scope.customerId == '') {
                            $http.get(fetchCustomerBySiteId + $scope.siteId + '>parent[t3]', config).success(function(customerResponse) {
                                for (var i = 0; i < customerResponse.length; i++) {
                                    $scope.customerId = customerResponse[i].customerId;
                                }
                                $scope.siteFlag = true;
                                $scope.selectedCustomer($scope.customerId);
                            });
                        } else {
                            $scope.siteFlag = true;
                            $scope.selectedCustomer($scope.customerId);
                        }
                    } else {
                        if ($scope.customerId == undefined || $scope.customerId == '') {
                            $http.get(fetchCustomerBySiteId + $scope.siteId + '>parent[t3]', config).success(function(customerResponse) {
                                for (var i = 0; i < customerResponse.length; i++) {
                                    $scope.customerId = customerResponse[i].customerId;
                                }
                                $scope.siteFlag = true;
                                $scope.selectedCustomer($scope.customerId);
                            });
                        } else {
                            $scope.siteFlag = true;
                            $scope.selectedCustomer($scope.customerId);
                        }
                    }
                } else if (($scope.isCustomerSelected) && !($scope.isSiteSelected) && ($scope.isSkuSelected)) {
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    var chartIndex = 0;
                    if (!(googleChartList.length == 0)) {
                        for (var i = chartIndex; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        $scope.skuFlag = true;
                        $scope.selectedCustomer($scope.customerId);
                    } else {
                        $scope.skuFlag = true;
                        $scope.selectedCustomer($scope.customerId);
                    }
                } else if (!($scope.isCustomerSelected) && ($scope.isSiteSelected) && ($scope.isSkuSelected)) {
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    var chartIndex = 0;
                    if (!(googleChartList.length == 0)) {
                        for (var i = chartIndex; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        $scope.siteFlag = true;
                        $scope.skuFlag = true;
                        $scope.selectedCustomer($scope.customerId);
                    } else {
                        $scope.siteFlag = true;
                        $scope.skuFlag = true;
                        $scope.selectedCustomer($scope.customerId);
                    }
                } else if (($scope.isCustomerSelected) && ($scope.isSiteSelected) && !($scope.isSkuSelected)) {
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    var chartIndex = 0;
                    if (!(googleChartList.length == 0)) {
                        for (var i = chartIndex; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        if ($scope.customerId == undefined || $scope.customerId == '') {
                            $http.get(fetchCustomerBySiteId + $scope.siteId + '>parent[t3]', config).success(function(customerResponse) {
                                for (var i = 0; i < customerResponse.length; i++) {
                                    $scope.customerId = customerResponse[i].customerId;
                                }
                                $scope.customerFlag = true;
                                $scope.selectedCustomer($scope.customerId);
                            });
                        } else {
                            $scope.customerFlag = true;
                            $scope.selectedCustomer($scope.customerId);
                        }
                    } else {
                        if ($scope.customerId == undefined || $scope.customerId == '') {
                            $http.get(fetchCustomerBySiteId + $scope.siteId + '>parent[t3]', config).success(function(customerResponse) {
                                for (var i = 0; i < customerResponse.length; i++) {
                                    $scope.customerId = customerResponse[i].customerId;
                                }
                                $scope.customerFlag = true;
                                $scope.selectedCustomer($scope.customerId);
                            });
                        } else {
                            $scope.customerFlag = true;
                            $scope.selectedCustomer($scope.customerId);
                        }
                    }
                } else if (($scope.isCustomerSelected) && ($scope.isSiteSelected) && ($scope.isSkuSelected)) {
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    var chartIndex = 0;
                    if (!(googleChartList.length == 0)) {
                        for (var i = chartIndex; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        if ($scope.customerId == undefined || $scope.customerId == '') {
                            $http.get(fetchCustomerBySiteId + $scope.siteId + '>parent[t3]', config).success(function(customerResponse) {
                                for (var i = 0; i < customerResponse.length; i++) {
                                    $scope.customerId = customerResponse[i].customerId;
                                }
                                $scope.customerFlag = true;
                                $scope.skuFlag = true;
                                $scope.selectedCustomer($scope.customerId);
                            });
                        } else {
                            $scope.customerFlag = true;
                            $scope.skuFlag = true;
                            $scope.selectedCustomer($scope.customerId);
                        }
                    } else {
                        if ($scope.customerId == undefined || $scope.customerId == '') {
                            $http.get(fetchCustomerBySiteId + $scope.siteId + '>parent[t3]', config).success(function(customerResponse) {
                                for (var i = 0; i < customerResponse.length; i++) {
                                    $scope.customerId = customerResponse[i].customerId;
                                }
                                $scope.customerFlag = true;
                                $scope.skuFlag = true;
                                $scope.selectedCustomer($scope.customerId);
                            });
                        } else {
                            $scope.customerFlag = true;
                            $scope.skuFlag = true;
                            $scope.selectedCustomer($scope.customerId);
                        }
                    }
                } else if (($scope.isSkuSelected) && !($scope.isCustomerSelected) && !($scope.isSiteSelected)) {
                    $("#customerPrevNext").hide();
                    $("#sitePrevNext").hide();
                    var googleChartList = document.querySelectorAll('google-chart');
                    if (!(googleChartList.length == 0)) {
                        for (var i = 0; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                    }
                    $scope.selectedSkuDescription($scope.skuId);
                }
                // $scope.isCustomerSelected = false;
                // $scope.isSiteSelected = false;
                // $scope.isSkuSelected = false;
            };

            window.addEventListener('pt-item-confirmed', function(e) {
                var srcElement2 = e.srcElement;
                var data = srcElement2.__data__;
                var keyCust;
                if (srcElement2.localName == "paper-typeahead-input-customer") {
                    keyCust = data.keyid;
                    $scope.customerId = data.keyid;
                    $scope.isCustomerSelected = true;
                    //alert(keyCust);
                    /* 				var googleChartList = document.querySelectorAll('google-chart');
                    				var chartIndex = 0;
                    				if ($scope.flag == true){
                    					chartIndex = 1;
                    				}				
                    				if(!(googleChartList.length==0)) {
                    					for (var i=chartIndex;i<googleChartList.length;i++){						
                    						googleChartDivId.removeChild(googleChartList[i]);
                    					}
                    					$scope.selectedCustomer(data.keyid);
                    				} else {				
                    					$scope.selectedCustomer(data.keyid);
                    				} */
                    var paperSite = document.querySelector('paper-typeahead-input-site');
                    var remoteUrl = filterSiteCust + keyCust + ':siteName=%QUERY*&fields=siteId,siteName';
                    paperSite.setAttribute('remote-url', remoteUrl);
                } else if (srcElement2.localName == "paper-typeahead-input-site") {
                    //var googleChartList = document.querySelectorAll('google-chart');
                    $scope.siteId = data.keyid;
                    $scope.isSiteSelected = true;
                    /* 				var chartIndex = 1;				
                    				if ($scope.flag == true){
                    					chartIndex = 2;
                    				}				
                    				if(!(googleChartList.length==0)) {
                    					for (var i=chartIndex;i<googleChartList.length;i++){
                    						googleChartDivId.removeChild(googleChartList[i]);
                    					}
                    					$scope.selectedSite(data.keyid);
                    				}else {				
                    					$scope.selectedSite(data.keyid);
                    				} */
                } else if (srcElement2.localName == "paper-typeahead-input-sku") {
                    $scope.skuId = data.keyid;
                    //alert($scope.skuId);
                    $scope.isSkuSelected = true;
                }
            });

            window.addEventListener('google-chart-render', function(e) {
                paperSpinner.removeAttribute('active');
            });

            window.addEventListener('google-chart-select', function(e) {
                var srcElem = e.srcElement;
                var objArr = srcElem.getAttribute('idList');
                var objArray = new Array();
                objArray = objArr.split(',');
                var selectedIndex = srcElem.__data__.selection[0].row;
                var chartIndex = srcElem.getAttribute('index');
                if (!($scope.customerResponseData == null)) {
                    $scope.customerResponseData = "";
                }
                if (!($scope.siteResponseData == null)) {
                    $scope.siteResponseData = "";
                }
                var googleChartList = document.querySelectorAll('google-chart');
                if (!(googleChartList.length == 0)) {
                    if (chartIndex == 0) {
                        $("#customerPrevNext").hide();
                        $("#sitePrevNext").hide();
                        for (var i = parseInt(chartIndex) + 1; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        $scope.selectedCustomer(objArray[selectedIndex]);
                    } else if (chartIndex == 1) {
                        for (var i = parseInt(chartIndex) + 1; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        $scope.selectedSite(objArray[selectedIndex]);
                    } else if (chartIndex == 2) {
                        for (var i = parseInt(chartIndex) + 1; i < googleChartList.length; i++) {
                            googleChartDivId.removeChild(googleChartList[i]);
                        }
                        $scope.stationFlag = true;
                        $scope.siteIdForSku = objArray[selectedIndex];
                        $scope.selectedStation(objArray[selectedIndex]);
                    }
                }
            });

            $scope.selectedCustomer = function(value) {
                paperSpinner.setAttribute('active', '');
                $scope.customerIdArr = [];
                $scope.startTime = $scope.getIstTime();
                console.log("Customer Chart By Id Start Time (Before X-axis HTTP call): " + $scope.startTime);
                $http.get(fetchCustomerById + value, config).success(function(response, headers, status, XMLHTTPResponse, Link) {
                    $scope.endTime = $scope.getIstTime();
                    console.log("Customer Chart By Id End Time (After X-axis HTTP call): " + $scope.endTime);
                    $scope.executionTime = $scope.endTime - $scope.startTime;
                    console.log('Execution time between the HTTP calls (Customer Chart By Id in fetching Customer Name for X-axis): ' + $scope.msToHMS($scope.executionTime));
                    for (var i = 0; i < response.length; i++) {
                        $scope.customerByIdXaxisArray.push(response[i].customerName1);
                        $scope.customerIdArr.push(response[i].customerId);
                    }
                    $scope.$broadcast("customerByIdChart");
                    $scope.startTime = $scope.getIstTime();
                    console.log("Customer Chart By Id Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                });

                $http.get(fetchCustomerByIdUrl + value, config).success(function(customerResponse) {
                    $scope.customerResponseData = customerResponse;
                });
            };

            $scope.selectedSiteById = function(value) {
                if (!($scope.customerResponseData == null)) {
                    $scope.customerResponseData = "";
                }
                if (!($scope.siteResponseData == null)) {
                    $scope.siteResponseData = "";
                }
                $http.get(fetchCustomerBySiteId + value + '>parent[t3]', config).success(function(customerResponse) {
                    $scope.customerResponseData = customerResponse;
                });

                $http.get(fetchSiteById + value, config).success(function(siteResponse) {
                    $scope.siteResponseData = siteResponse;
                });

                $scope.siteIdArr = [];
                $scope.startTime = $scope.getIstTime();
                console.log("Site Chart By Id Start Time (Before X-axis HTTP call): " + $scope.startTime);
                $http.get(fetchSiteBasedOnId + value, config).success(function(response) {
                    $scope.endTime = $scope.getIstTime();
                    console.log("Site Chart By Id End Time (After X-axis HTTP call): " + $scope.endTime);
                    $scope.executionTime = $scope.endTime - $scope.startTime;
                    console.log('Execution time between the HTTP calls (Site Chart By Id in fetching Site Name for X-axis): ' + $scope.msToHMS($scope.executionTime));
                    for (var i = 0; i < response.length; i++) {
                        $scope.siteByIdXaxisArray.push(response[i].siteName);
                        $scope.siteIdArr.push(response[i].siteId);
                    }
                    $scope.$broadcast("siteByIdChart");
                    $scope.startTime = $scope.getIstTime();
                    console.log("Site Chart By Id Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                });
            };

            $scope.selectedSite = function(value) {
                paperSpinner.setAttribute('active', '');

                $http.get(fetchCustomerById + value, config).success(function(customerResponse) {
                    $scope.customerResponseData = customerResponse;
                });

                if ($scope.siteLinkArr.length == 0) {
                    $scope.siteLinkArr.push(fetchSitesBasedOnCustomerUrl + value + '<parent[t3]');
                    $('#sitePrevious').prop('disabled', true);
                }
                $scope.idList = [];
                $scope.startTime = $scope.getIstTime();
                console.log("Site Chart Start Time (Before X-axis HTTP call): " + $scope.startTime);
                $http.get(fetchSitesBasedOnCustomerUrl + value + '<parent[t3]', config).success(function(customerResponse, headers, status, XMLHTTPResponse, Link) {
                    $scope.endTime = $scope.getIstTime();
                    console.log("Site Chart End Time (After X-axis HTTP call): " + $scope.endTime);
                    $scope.executionTime = $scope.endTime - $scope.startTime;
                    console.log('Execution time between the HTTP calls (Site Chart in fetching Site Name for X-axis): ' + $scope.msToHMS($scope.executionTime));
                    if (!(status().link == undefined)) {
                        var str = status().link;
                        $scope.siteResult = str.substr(1, str.lastIndexOf(">") - 1);
                    }
                    for (var i = 0; i < customerResponse.length; i++) {
                        $scope.siteXaxisArray.push(customerResponse[i].siteName);
                        $scope.idList.push(customerResponse[i].siteId);
                    }
                    $scope.$broadcast("siteChart");
                    $scope.startTime = $scope.getIstTime();
                    console.log("Site Chart Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                });
            };

            $scope.selectedStation = function(value) {
                paperSpinner.setAttribute('active', '');
                $http.get(fetchCustomerBySiteId + value + '>parent[t3]', config).success(function(customerResponse) {
                    $scope.customerResponseData = customerResponse;
                });

                $http.get(fetchSiteById + value, config).success(function(siteResponse) {
                    $scope.siteResponseData = siteResponse;
                });

                if ($scope.stationLinkArr.length == 0) {
                    $scope.stationLinkArr.push(fetchStationBySiteIdUrl);
                    $('#stationPrevious').prop('disabled', true);
                }
                paperSpinner.setAttribute('active', '');
                $scope.idList = [];

                $scope.startTime = $scope.getIstTime();
                console.log("Station Chart Start Time (Before X-axis HTTP call): " + $scope.startTime);
                $http.get(fetchStationBySiteIdUrl + value + '<parent[t3]', config).success(function(stationResponse, headers, status, XMLHTTPResponse, Link) {
                    $scope.endTime = $scope.getIstTime();
                    console.log("Station Chart End Time (After X-axis HTTP call): " + $scope.endTime);
                    $scope.executionTime = $scope.endTime - $scope.startTime;
                    console.log('Execution time between the HTTP calls (Station Chart in fetching Station Name for X-axis): ' + $scope.msToHMS($scope.executionTime));
                    if (!(status().link == undefined)) {
                        var str = status().link;
                        $scope.stationResult = str.substr(1, str.lastIndexOf(">") - 1);
                    }
                    for (var i = 0; i < stationResponse.length; i++) {
                        $scope.stationXaxisArray.push(stationResponse[i].stationName);
                        $scope.idList.push(stationResponse[i].stationId);
                    }
                    $scope.$broadcast("stationChart");
                    $scope.startTime = $scope.getIstTime();
                    console.log("Station Chart Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                });
            };

            $scope.selectedSku = function(value) {
                $http.get(fetchCustomerBySiteId + value + '>parent[t3]', config).success(function(customerResponse) {
                    $scope.customerResponseData = customerResponse;
                });

                $http.get(fetchSiteById + value, config).success(function(siteResponse) {
                    $scope.siteResponseData = siteResponse;
                });
                paperSpinner.setAttribute('active', '');
                $scope.skuIdArr = [];
                $scope.startTime = $scope.getIstTime();
                console.log("SKU Chart Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                $http.get(fetchDevicesBySkuUrl + value + '<site&fields=serialNo,specification', config).success(function(siteResponse) {
                    $scope.endTime = $scope.getIstTime();
                    console.log("SKU Chart End Time (After Y-axis HTTP call): " + $scope.endTime);
                    $scope.executionTime = $scope.endTime - $scope.startTime;
                    console.log('Execution time between the HTTP calls (SKU Chart in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                    var groups = {};
                    $.each(siteResponse, function(i, item) {
                        var level = item.specification;
                        delete item.specification;
                        if (groups[level]) {
                            groups[level].push(item);
                        } else {
                            groups[level] = [item];
                        }
                    });

                    var result = $.map(groups, function(group, key) {
                        var obj = {};
                        obj[key] = group;
                        return obj;
                    });

                    angular.forEach(result, function(value, key) {
                        angular.forEach(value, function(value1, key1) {
                            $scope.skuYaxisArray.push(value1.length);
                            $scope.skuIdArr.push(key1);
                            //alert($scope.skuIdArr);
                        });
                    });
                    $scope.$broadcast("skuChart");
                    $scope.startTime = $scope.getIstTime();
                    console.log("SKU Chart Start Time (Before X-axis HTTP call): " + $scope.startTime);
                });
            };

            $scope.selectedSkuDescription = function(value) {
                paperSpinner.setAttribute('active', '');
                $scope.skuDescriptionIdArr = [];
                $scope.startTime = $scope.getIstTime();
                console.log("SKU Chart By Description Start Time (Before Y-axis HTTP call): " + $scope.startTime);
                $http.get(fetchDevicesBasedOnSkuId + value + '<specification[t3]', config).success(function(skuResponse) {
                    $scope.endTime = $scope.getIstTime();
                    console.log("SKU Chart By Description End Time (After Y-axis HTTP call): " + $scope.endTime);
                    $scope.executionTime = $scope.endTime - $scope.startTime;
                    console.log('Execution time between the HTTP calls (SKU Chart By Description in fetching Device Count for Y-axis): ' + $scope.msToHMS($scope.executionTime));
                    $scope.skuDescriptionIdArr.push(value);
                    $scope.skuDescriptionYaxisArray.push(skuResponse.length);
                    console.log("Response" + skuResponse.length);
                    $scope.$broadcast("skuDescriptionChart");
                    $scope.startTime = $scope.getIstTime();
                    console.log("SKU Chart By Description Start Time (Before X-axis HTTP call): " + $scope.startTime);
                });
            };
        }
    ]);
});