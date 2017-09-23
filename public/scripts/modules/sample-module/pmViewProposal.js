/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';
    var config = '';
    var loaded = false;
    var surveyTypeId;
    //var siteListURL="https://dt-survey-microservice.run.asv-pr.ice.predix.io/sitelist?assignedTo=1&stageName=Survey&status=InProgress";
    // Controller definition
    controllers.controller('pmViewProposalCtrl', ['$state', '$timeout', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', function($state, $timeout, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices) {
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



        //Dev 
        var url = commonServices.getsurveyServiceURL() + "/getProposalData?ticketSiteDetailId="
            //var getSiteName = "";

        //Local
        //var url="http://3.209.34.62:8080/getProposal?ticketSiteDetailsId";


        var i;
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var previousStageTicketSiteDetailsId;
        //var  dynamicURL = getSiteName+'siteId='+siteId+'&fields=siteName,siteId,siteLocation';
        var map = document.getElementById('google-map');
        $scope.assetSkuIdList = [];
        $scope.cmts = '';

        //genarateTableData(jsonData);

        tokensetup();

        function tokensetup() {
            // --------------------------Getting Address---------------------------


            commonServices.getAuthToken().then(function(config) {
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId, config).success(function(data) {
                    //console.log(data[0].siteAddress)
                    var sitAdd = data[0].siteAddress
                    $scope.siteAddress = sitAdd.street + "," + sitAdd.city + "," + sitAdd.region + "," + sitAdd.country
                });
            });
        }


        siteSummary();
        commonServices.getAllMedia(ticketId).then(function(data) {
            var x = data.ticketsiteIdsList[6];
            //console.log(x);
            if (typeof x != 'undefined') {
                $scope.poTicketID = '';
                $scope.poTicketID = x[0];
                //console.log($scope.poTicketID);

                //console.log(data);
                //console.log(JSON.parse(data));
                var allticketDetail = data.ticketsiteIdsList[5];

                angular.forEach(allticketDetail, function(value, key) {
                    previousStageTicketSiteDetailsId = value;
                    getProposalData(previousStageTicketSiteDetailsId);

                });
            } else {
                var allticketDetail = data.ticketsiteIdsList[5];

                angular.forEach(allticketDetail, function(value, key) {
                    previousStageTicketSiteDetailsId = value;
                    getProposalData(previousStageTicketSiteDetailsId);

                });
            }
            $scope.$broadcast("poTicketID");
        });



        function getProposalData(previousStageTicketSiteDetailsId) {
            $http.get(url + previousStageTicketSiteDetailsId + '&surveyTypeId=' + surveyTypeId).success(function(jsonData) {
                //$scope.responseData = [];
                //$scope.postgersData = jsonData;
                //console.log($scope.responseData);
                genarateTableData(jsonData);
            });
        }

        $scope.$on("poTicketID", function() {
            //--------------------------------------
            //-------------------Estimated ship date
            //alert('bf4');
            commonServices.getSiteSummary($scope.poTicketID).then(function(data1) {
                //alert('fhsfsh');

                //console.log(data1.shipdate);
                if (data1.shipdate != null) {
                    var d = new Date(data1.shipdate);

                    var months = d.getMonth() + 1;
                    var days = d.getDate();
                    //alert(month);
                    if (months < 10) {
                        months = "0" + months;
                    };
                    if (days < 10) {
                        days = "0" + days;
                    };

                    var formattedDate = d.getFullYear() + "-" + months + "-" + days;
                    formattedDate = formattedDate;
                    //formattedDate =  "2013-02-08";
                    //alert(formattedDate);
                    var defaultdate = document.getElementById('estShipdate');
                    defaultdate.innerHTML = formattedDate;
                } else { //alert();
                    var defaultdate = document.getElementById('estShipdate');
                    defaultdate.innerHTML = "";
                }
            });
        });

        function siteSummary() {
            commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
                console.log(JSON.stringify(data));
                $scope.pm = data.assignedTo;
                $scope.currentStage = data.stageName;


                var expectedSurTypeId = ["1", "2", "3", "4"];
                //                    surveyTypeId = '';
                for (var index = 0; index < data.surveyList.length; index++) {
                    for (var i = 0; i < expectedSurTypeId.length; i++) {
                        console.log(data.surveyList[index].surveyTypeId + '  ' + expectedSurTypeId[i])
                        if (data.surveyList[index].surveyTypeId == expectedSurTypeId[i]) {
                            surveyTypeId = data.surveyList[index].surveyTypeId;
                            console.log('in if : ', surveyTypeId)
                        }
                    }
                }
                //surveyTypeId = data.surveyTypeId;
                console.log(data)
                console.log(surveyTypeId)
                    //-----------------------------------------------




            });
            commonServices.getAuthToken().then(function(data) {
                commonServices.getSiteData(siteId, data).then(function(data) {
                    //   console.log(JSON.stringify(data[0]));
                    $scope.siteId = data[0].siteId;
                    $scope.siteName = data[0].siteName;
                });
            });
        }

        var spinner = document.getElementById('spin_id');
        spinner.setAttribute('active', '');

        function genarateTableData(postgersData) {
            commonServices.getAuthToken().then(
                function(data) {

                    $scope.res = data;
                    var arr = [];

                    commonServices.GetAllSKU($scope.res, arr).then(function(data) {
                        if (data.length > 0) {
                            angular.forEach(data, function(value, key) {
                                var skuId = value.skuId;
                                var SkuDescription = value.skuDescription;

                                angular.forEach(postgersData, function(value, key) {
                                    if (skuId == value.skuId) {

                                        postgersData[key].SkuDescription = SkuDescription;
                                        $scope.tabledata = postgersData;
                                    }

                                });
                            });
                            spinner.removeAttribute('active');
                        }
                    });
                });

        }
        $scope.Approve = function() {
            //// alert();
            console.log(approve)
            var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.cmts
            }
            commonServices.approve(data);
        }
        $scope.sendBack = function() {
            //  // alert($scope.cmts);
            console.log(sendback + ticketSiteDetailsId + "&sendBackComments=" + $scope.cmts)
            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": $scope.cmts
            }
            commonServices.sendback(data);
        }








    }]);
});