/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';
    controllers.controller('viewFileUploadedByDesignerCtrl', ['$state', '$timeout', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', function($state, $timeout, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices) {
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


        var getsurveyData = "http://localhost:8080/getSurveyData?ticketid=";
        //var getsurveyData= "http://localhost:8080/GetSurveyResponse?ticketSiteDetailId=1&surveyTypeId=4";
        var getSiteSummry = "http://localhost:8080/siteData?ticketSiteDetailsId=";
        var getSiteName = "https://predix-asset.run.asv-pr.ice.predix.io/site?filter=";
        $scope.siteLat;
        $scope.siteLang;
        $scope.fileType = "";
        $scope.mediaArray = [];
        $scope.filename = [];
        $scope.directory = [];
        $scope.validFileExtensionsForImage = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.validFileExtensionsForPdf = [".pdf"];
        $scope.validFileExtensionsForExcel = [".xlsx", ".xls", ".cvs"];
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var dynamicURL = getSiteName + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';
        var map = document.getElementById('google-map');
        siteSummary();
        var sendback = commonServices.getadminServiceURL() + "/sendback?ticketSiteDetailsId=";
        var approve = commonServices.getadminServiceURL() + "/moveToNextStage";

        $scope.Approve = function() {
            alert('called');
            console.log(approve)
            var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.cmts
            }
            console.log(data)
            commonServices.approve(data);
        }

        $scope.sendBack = function() {
            //  alert($scope.cmts);
            console.log(sendback + ticketSiteDetailsId + "&sendBackComments=" + $scope.cmts)
            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": $scope.cmts
            }
            commonServices.sendback(data);
        }

        function siteSummary() {
            var surveyor;
            $scope.completedDate;
            $scope.siteName;
            var abc;
            $http.get(getSiteSummry + ticketSiteDetailsId).success(function(data) {
                surveyor = data.assignedTo;
                abc = data.completedDate;
                var d = new Date(abc);
                $scope.completedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                $scope.siteData = { 'siteId': +siteId, 'surveyor': +surveyor, 'completedDate': +$scope.completedDate };
            });

            commonServices.getAuthToken().then(function(data) {
                commonServices.getSiteData(dynamicURL, data).then(function(data) {
                    $scope.siteName = data[0].siteName;
                    $scope.siteLat = data[0].siteLocation.lat;
                    $scope.siteLang = data[0].siteLocation.lng;
                });
            });
        }

        $http.get("http://3.209.34.30:8080/siteData?ticketSiteDetailsId=1").success(function(siteDataa) {

            $scope.mediaArray = [];
            $scope.filename = [];
            $scope.directory = [];

            console.log('--' + siteDataa)
            console.log(siteDataa)

            angular.forEach(siteDataa, function(value, key) {
                console.log(value)
                if (key == 'mediaList') {
                    angular.forEach(value, function(value1, key1) {
                        angular.forEach(value1, function(value2, key2) {
                            if (key2 == 'fileName') {
                                console.log(value2)
                                $scope.filename.push(value2);
                            }

                            /* if(key2 == 'directory'){
                            console.log('---'+value2)
                            console.log(value2)
                            	$scope.directory.push(value2);
                            } */

                        });

                    });

                }

            });

            var media = document.querySelector('#after');
            //var mediaFileName;
            for (var i = 0; i < $scope.filename.length; i++) {

                var remoteUrl = 'https://dt-blobstore-microservice.run.asv-pr.ice.predix.io/getBlob?SiteId=' + siteId + '&directory=' + $scope.directory[i] + '&filename=' + $scope.filename[i];
                var mediaobj = document.createElement('a');
                var mediaFileName = document.createElement('span');
                mediaobj.innerHtml = '&nbsp;';
                var ext = $scope.filename[i].substring($scope.filename[i].indexOf('.'), $scope.filename[i].length)


                if (ext != null || ext != "") {

                    console.log('----------------' + $scope.validFileExtensionsForExcel)
                    for (var j = 0; j <= $scope.validFileExtensionsForExcel.length; j++) {

                        if (ext == $scope.validFileExtensionsForExcel[j]) {

                            $scope.fileType = "excel";
                            /* console.log('fileName'+$scope.filename[i])
                                                                                                $scope.filename[i]; */

                            break;
                        }
                    }
                    for (var k = 0; k <= $scope.validFileExtensionsForImage.length; k++) {

                        if (ext == $scope.validFileExtensionsForImage[k]) {

                            $scope.fileType = "image";

                            break;
                        }
                    }
                    for (var l = 0; l <= $scope.validFileExtensionsForPdf.length; l++) {
                        if (ext == $scope.validFileExtensionsForPdf[l]) {

                            $scope.fileType = "pdf";

                            break;
                        }
                    }


                    mediaobj.setAttribute('id', 'link-' + i);
                    mediaobj.setAttribute('href', remoteUrl);

                    var child = document.createElement('i');
                    child.innerHTML = '<br><span style="font-size:14px">' + $scope.filename[i] + '</span>';
                    if ($scope.fileType == "image") {

                        child.setAttribute('class', 'fa fa-camera-retro fa-3x');
                        child.setAttribute('margin-right', '10px');
                        child.setAttribute('aria-hidden', 'true');
                        child.setAttribute('style', 'color:cadetblue');
                        child.setAttribute('id', 'imgIcon');
                    } else if ($scope.fileType == "pdf") {
                        child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
                        child.setAttribute('margin-right', '10px');
                        child.setAttribute('aria-hidden', 'true');
                        child.setAttribute('style', 'color:cadetblue');
                    } else if ($scope.fileType == "excel") {
                        child.setAttribute('class', 'fa fa-file-excel-o fa-3x');
                        child.setAttribute('margin-right', '10px');
                        child.setAttribute('aria-hidden', 'true');
                        child.setAttribute('style', 'color:cadetblue');
                    }
                    mediaobj.appendChild(child);
                    //mediaobj.appendChild(space);
                    media.appendChild(mediaobj);
                    media.appendChild(mediaFileName);
                    ext = "";
                }
            }
        });
    }]);
});