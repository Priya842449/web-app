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
    controllers.controller('NewrequestCtrl', ['$http', '$log', 'commonServices', '$rootScope', '$scope', function($http, $log, commonServices, $rootScope, $scope) {



        // $scope.compareSite();																
        // });			
        $scope.compareAssetSite = function(siteid, refkey, surveyType, ContractorId, CustomerId) {
            //console.log( $scope.assetServiceData);
            angular.forEach($scope.assetServiceData, function(value, key) {

                // console.log(JSON.stringify(value.siteAddress));
                //$scope.assetServiceData[key].siteAddress = JSON.stringify(value.siteAddress);
                if (siteid == value.siteId) {
                    //alert('in if')
                    //alert(key);
                    $scope.assetServiceData[key].refKey = refkey;
                    $scope.assetServiceData[key].surveyType = surveyType;
                    $scope.assetServiceData[key].contractorId = "<a href='javascript:void(0)' id='" + ContractorId + key + "'onclick='gotoLink(this)' style='text-decoration: none'>" + ContractorId + "</a>";
                } else {
                    if (value.refKey == undefined) {
                        //alert('in no ref')
                        $scope.assetServiceData[key].refKey = '-';
                        $scope.assetServiceData[key].surveyType = '-';
                        $scope.assetServiceData[key].contractorId = '-';
                    }
                }
            });
            // console.log(JSON.stringify($scope.assetServiceData));
            $scope.data = $scope.assetServiceData;
            //$scope.data = JSON.stringify($scope.assetServiceData);
            // console.log($scope.data);
        };



        $scope.compareSite = function(postgresdata) {
            //console.log(postgresdata);
            angular.forEach(postgresdata, function(value, key) {
                $scope.compareAssetSite(value.siteId, value.refKey, value.surveyType, value.contractorName);
            });
        };


        commonServices.getAuthToken().then(
            function(data) {

                $scope.res = data;
                commonServices.getAssetdata($scope.res).then(function(data) {
                    $scope.assetServiceData = data;
                    console.log($scope.assetServiceData);
                    var city = '';
                    var city = '';
                    var country = '';
                    var district = '';
                    var poBox = '';
                    var postalCode = '';
                    var region = '';
                    var street = '';
                    var trainStation = '';
                    var lat = '';
                    var lng = '';
                    angular.forEach($scope.assetServiceData, function(value, key) {
                        if (value.siteAddress.city != null) {
                            city = JSON.stringify(value.siteAddress.city) + ",";
                        }
                        if (value.siteAddress.country != null) {
                            country = JSON.stringify(value.siteAddress.country) + ",";
                        }
                        if (value.siteAddress.district != null) {
                            district = JSON.stringify(value.siteAddress.district) + ",";
                        }
                        if (value.siteAddress.poBox != null) {
                            poBox = JSON.stringify(value.siteAddress.poBox) + ",";
                        }
                        if (value.siteAddress.postalCode != null) {
                            postalCode = JSON.stringify(value.siteAddress.postalCode) + ",";
                        }
                        if (value.siteAddress.region != null) {
                            region = JSON.stringify(value.siteAddress.region) + ",";
                        }
                        if (value.siteAddress.street != null) {
                            street = JSON.stringify(value.siteAddress.street) + ",";
                        }
                        if (value.siteAddress.trainStation != null) {
                            trainStation = JSON.stringify(value.siteAddress.trainStation);
                        }
                        if (value.siteAddress.lat != null) {
                            lat = JSON.stringify(value.siteLocation.lat) + ",";
                        }
                        if (value.siteAddress.lng != null) {
                            lng = JSON.stringify(value.siteLocation.lng);
                        }

                        $scope.assetServiceData[key].siteAddress = (city + country + district + poBox + postalCode + region + street + trainStation).replace(/\"/g, "");
                        $scope.assetServiceData[key].siteLocation = (lat + lng).replace(/\"/g, "");


                    });
                    console.log($scope.assetServiceData);
                    $scope.compareSite($scope.postgresdata); ////////////// Please comment to access data from postgres
                    commonServices.getPostgresdata().then(function(data) {
                        console.log("after");
                        $scope.postgresdata = data;
                        $scope.compareSite($scope.postgresdata);
                    });
                });

            });

        $scope.dropdown = ['IndoorSurvey', 'OutdoorSurvey', 'Indoor/Outdoor'];

        //PX-model   

        $scope.editcancelForm = function() {
            $("#five").css("visibility", "hidden");
        };

        window.addEventListener('pt-item-confirmed', function(e) {
            var srcElement2 = e.srcElement;
            //console.log(srcElement2)	;	  
            var dta = srcElement2.__data__;
            console.log(dta);
            $scope.prjctIdNeeded = dta.inputValue;
        });



        $scope.editsubmitForm = function() {
            var cvalue = $scope.prjctIdNeeded;
            var refid = ($('#refID').val());
            //console.log(area1);
            // console.log(area);

            if (cvalue === undefined || refid === '') {
                $("#myModal1").css("visibility", "visible");
            } else {
                $("#myModal1").css("visibility", "hidden");
                //console.log($scope.data);
                angular.forEach($scope.data, function(value, key) {
                    var id = value.contractorId;
                    var idFormatted = id.substring(33, 37);
                    console.log(idFormatted);
                    if (idFormatted == refid) {
                        //alert(idFormatted);
                        $scope.data[key].contractorId = cvalue;

                    }
                });
            }

        };


        $scope.multiTicket = [];
        document.getElementById("mytable").addEventListener("px-row-click", function(e) {

            // console.log(e.detail.row.row.ContractorId);
            // console.log(e.detail.row.row.siteId.value);
            // console.log(e.detail.row.row.siteDescription.value);
            // console.log(e.detail.row.row.surveyType.value);
            // $scope.multiTicket =[];
            var clickedRow = e.detail.row;

            if (clickedRow._selected === false) {
                var contractorId;
                var siteId = 0; // Keep this in mind
                if (e.detail.row.row.contractorId.value == '-') {
                    contractorId = 0;
                } else {
                    var id = e.detail.row.row.contractorId.value;
                    contractorId = id.substring(93, id.length - 4)
                }

                if (!(isNaN(e.detail.row.row.siteId.value))) {
                    siteId = e.detail.row.row.siteId.value;
                }

                //alert(contractorId);
                $scope.ticketData = {
                    'ticketDescription': 'ABC',
                    'siteId': siteId,
                    'ticketSiteDetailsDto': [{
                        'assignedTo': contractorId,
                        'surveyType': e.detail.row.row.surveyType.value,
                        'sendBackFlag': 'N'
                    }]
                };
                $scope.multiTicket.push($scope.ticketData);

                //console.log("in if");	
            }
            if (clickedRow._selected == true) {

                var siteid = e.detail.row.row.siteId.value
                    //alert(siteid);
                for (var i = 0; i < $scope.multiTicket.length; i++) {
                    var data = $scope.multiTicket[i];
                    //alert(data.siteId);
                    if (data.siteId == siteid) {
                        $scope.multiTicket.splice(i, 1);
                    }
                }
            }
            // console.log($scope.multiTicket);
            //console.log($scope.ticketData);	
            //console.log("Row clicked", clickedRow, " _selected: ", clickedRow._selected);

        });

        document.getElementById("mytable").addEventListener("px-select-all-click", function(e) {
            var allSelectedRows = e.detail;
            console.log("Select/unselect all", allSelectedRows);
            $scope.multiTicket = [];

            angular.forEach(allSelectedRows, function(value, key) {
                // console.log(value.row.contractorId.value);
                var contractorId;
                var siteId = 0;
                if (value.row.contractorId.value == '-') {

                    contractorId = 0;
                } else {
                    id = value.row.contractorId.value;
                    contractorId = id.substring(94, id.length - 4)
                }
                if (!(isNaN(e.detail.row.row.siteId.value))) {
                    siteId = e.detail.row.row.siteId.value;
                }
                //alert(contractorId);
                $scope.ticketData = {
                    'ticketDescription': 'ABC',
                    'siteId': value.row.siteId.value,
                    'ticketSiteDetailsDto': [{
                        'assignedTo': contractorId,
                        'surveyType': value.row.surveyType.value,
                    }]
                };
                $scope.multiTicket.push($scope.ticketData);
            });

            console.log('Satz>>>'+$scope.multiTicket);
        });


        console.log($scope.returndata);

        $scope.returnticketdata = [];
        $scope.saveRequestData = function() {
            $scope.hidecard = true;
            if ($scope.multiTicket.length != 0) {
                for (var i = 0; i < $scope.multiTicket.length; i++) {

                    var data = $scope.multiTicket[i];
                    var ticketHeader = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    console.log(data);
                    $http.post('http://localhost:8080/SaveSite', data, ticketHeader)
                        .success(function(data) {

                            $scope.returnticketdata.push(data);

                            $scope.$broadcast("ReturnDataCompleted");
                        });
                }

            }

            //  console.log($scope.ticketData);
            $scope.$on("ReturnDataCompleted", function() {
                if ($scope.multiTicket.length == $scope.returnticketdata.length) {
                    console.log($scope.returnticketdata.length);
                    $scope.returndata = $scope.returnticketdata;
                }
                //console.log($scope.returndata);
                $scope.ticketdata = [];
            });
        }



    }]);
});