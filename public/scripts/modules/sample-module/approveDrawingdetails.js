/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    controllers.controller('ApprovedrawingdetailsCtrl', ['$state', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', '$timeout', 'commonServices', '$window', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, $timeout, commonServices, $window) {

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
        //Local URLs
        // var approve = "http://localhost:8080/moveToNextStage";
        // var sendback = "http://localhost:8080/sendback?ticketSiteDetailsId=";

        // Dev Urls

        var approve = commonServices.getadminServiceURL() + "/moveToNextStage";
        var sendback = commonServices.getadminServiceURL() + "/sendback?ticketSiteDetailsId=";

        var fileUploadedData1 = commonServices.getsurveyServiceURL() + "/siteData?ticketSiteDetailsId="
        var uploadUrl = commonServices.getBlobStoreURL(); + "/uploadMultiBlob"
        var directory = "ApproveInstallDrawing";
        $scope.selectedContractorForNextStage = "";
        $scope.existingSelectedContractorNxtStg = "";

        var getsurveyData = commonServices.getsurveyServiceURL() + "/getSurveyData?ticketid=";
        var getSiteSummry = commonServices.getsurveyServiceURL() + "/siteData?ticketSiteDetailsId=";
        var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";
        $scope.siteLat;
        $scope.siteLang;
        $scope.fileType = "";
        $scope.mediaArray = [];
        $scope.filename = [];
        $scope.directory = [];
        $scope.validFileExtensionsForImage = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.validFileExtensionsForPdf = [".pdf"];
        $scope.validFileExtensionsForExcel = [".xlsx", ".xls", ".cvs"];
        $scope.validFileExtensionsForText = [".txt"];
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var dynamicURL = getSiteName + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';
        var map = document.getElementById('google-map');
        fileUploadedData();
        //------------------------
        var siteId = $stateParams.siteId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var ticketId = $stateParams.ticketId;
        var surveyor;
        $scope.completedDate;
        $scope.siteName;
        var abc;
        $scope.fileArray = [];
        tokensetup();

        $scope.disableSendBack = false;
        $scope.disableApprove = false;


        function tokensetup() {
            // --------------------------Getting Address---------------------------


            commonServices.getAuthToken().then(function(config) {
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId, config).success(function(data) {
                    console.log(data[0].siteAddress)
                    var sitAdd = data[0].siteAddress
                    $scope.siteAddress = sitAdd.street + "," + sitAdd.city + "," + sitAdd.region + "," + sitAdd.country
                });
            });
        }

        commonServices.getAuthToken().then(function(data) {
            //alert(siteId);
            commonServices.getSiteData(siteId, data).then(function(data) {
                console.log(data);
                console.log(JSON.stringify(data[0]));
                console.log(siteId);
                $scope.siteId = data[0].siteId;
                $scope.siteName = data[0].siteName;
                // **********multiplefile upload***********
                init();

                function init() {
                    siteSummary();
                }

                //File upload event
                $('input[type="file"]').unbind('change');
                $('input[type="file"]').change(function() {
                    var file = this.files[0];
                    $("#test").append('Filename : ' + file.name + '  Type:' + file.type + '<br />');
                    $scope.fileArray.push(file);
                    //fileArray[0]=file;
                    console.log('fileArray' + $scope.fileArray);
                });

                $scope.removeFile = function(val) {
                    //var parent = $element.parentNode;
                    //console.log(parent.id);
                    console.log($scope.fileArray);
                    console.log(val);
                    $scope.fileArray.splice(val, 1);
                    console.log('in remove');
                    console.log($scope.fileArray);

                }

                function uploadFile() {
                    var fileArray = $scope.fileArray;
                    var response = '';
                    var xhttp = new XMLHttpRequest();
                    console.log(fileArray.length);
                    if (fileArray.length > 0) {
                        var fd = new FormData();
                        fd.append('SiteId', siteId);
                        fd.append('directory', directory);
                        //fd.append('directory',directory);
                        fd.append('directory', +ticketSiteDetailsId + '/' + directory);
                        angular.forEach(fileArray, function(file) {
                            fd.append('file', file);
                            console.log('--file--' + file)
                        })
                        console.log('--fd--' + fd);
                        xhttp = commonServices.uploadFileToUrl(fd, uploadUrl);
                        console.log(xhttp);
                        xhttp.onreadystatechange = function() {
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                console.log(xhttp.responseText);
                                response = 'Success';
                            }
                            console.log(response);
                        }
                    }

                };

            });
        });


        window.addEventListener('pt-item-confirmed', function(e) {
            var selectedContractorForNextStage = document.querySelector('paper-typeahead-input-customerMaster').inputValue;
            $scope.selectedContractorForNextStage = selectedContractorForNextStage;
        });

        $scope.Approve = function() {

		if($scope.selectedContractorForNextStage != ""){
			$scope.disableApprove = true;
			$scope.disableSendBack = true;
            /*var data={
				"ticketId":ticketId,
				"ticketSiteDetailsId":ticketSiteDetailsId,
				"sendBackFlag":"N",
				"ticketSiteDetailsComment":$scope.cmts,
				"selectedContractorForNextStage": $scope.selectedContractorForNextStage
			}*/

                // --------------------NEW Approve SYNTAX----------------------------
                var data = {
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "ticketSiteDetailsComment": $scope.cmts,
                    "action": "approvedStage",
                    "selectedContractorForNextStage": $scope.selectedContractorForNextStage
                }
                
                 var installRejectStatus = {
                    "ticketId": ticketId,
                    "installRejectStatus": "N"
                }


                //commonServices.approve(data); Old microservice

                commonServices.senbackRejectApprove(data).then(function(respData, status) {
                    console.log(respData);
                    $scope.submitError = respData.data.msg;
                    if ((respData.data.status == 'SUCCESS')) {
                        var alert1 = document.querySelector('#submitAlert');
                        alert1.toggle();
                        disableControls();
                        // $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                        // var okRedirect = document.getElementById('okRedirect');
                        // okRedirect.setAttribute('onclick', "window.location = '/approvedrawingdetails/" + $scope.redirectPage + "'");
                    } else {
                        // var submitbtn = document.querySelector('#btnSubmit')
                        // submitbtn.setAttribute('enabled', '');
                        if(!($scope.submitError == '' || $scope.submitError == null || $scope.submitError == undefined)){
                            $scope.msgSendBack = $scope.submitError;
                        }else {
                                $scope.msgSendBack = "Data not submitted successfully";
                        }
                        //$scope.disableApprove = false;
                        var alert1 = document.querySelector('#submitAlertForFail');
                        alert1.toggle();
                        disableControls();
                    }
                }).catch(function(error) {
                    $scope.disableApprove = false;
                    console.error("Error in approving the survey--", error);
                });
                
                commonServices.updateInstallationRejectStatus(installRejectStatus).then(function(respData, status) {
                    console.log(respData);
                    $scope.submitErrormessage = respData.status;
                    if ((respData.status == 'Success')) {
                        var alert1 = document.querySelector('#submitAlert');
                       alert1.toggle();
                       disableControls();
                        
                    } else {
                        
                        if(!($scope.submitErrormessage == '' || $scope.submitErrormessage  == null || $scope.submitErrormessage  == undefined)){
                            $scope.msgSendBack = $scope.submitErrormessage;
                        }else {
                                $scope.msgSendBack = "No rows found to update Status";
                        }
                       
                        var alert1 = document.querySelector('#submitAlertForFail');
                        alert1.toggle();
                        disableControls();
                    }
                }).catch(function(error) {
                    $scope.disableApprove = false;
                    console.error("Error in approving the survey--", error);
                });
            } else {
                var popModel = document.querySelector('#invalidAlertforBoth');
                popModel.toggle();
            }
        }

        function disableControls() {
            $scope.disableApprove = true;
            $scope.disableSendBack = true;

        }


        $scope.sendBack = function() {
            $scope.disableSendBack = true;
            $scope.cmts = document.getElementById('myTextarea').value;
            console.log(sendback + ticketSiteDetailsId + "&sendBackComments=" + $scope.cmts)
            console.log(sendback + ticketSiteDetailsId + "&sendBackComments=" + $scope.cmts)

            /*var data={
            				"ticketSiteDetailsId":ticketSiteDetailsId,
            				"ticketSiteComments":$scope.cmts
            }*/

            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": $scope.cmts,
                "action": "sendbackStage",
                "sendBackFlag": "Y",
                "sendBackComments": " "
            }

            //commonServices.sendback(data);

            commonServices.senbackRejectApprove(data).then(function(respData) {
                var status = respData.status;
                console.log('data ', status, 'as', respData)

                if (!(status == 200 || status == 201)) {
                    $scope.disableSendBack = false;
                    $scope.msgSendBack = "Survey could not be sent back!";
                    $scope.isSent = false;
                } else {
                    $scope.disableSendBack = true; // To disable enable send back button..
                    $scope.disableApprove = true; // To disable enable send back button..

                    $scope.msgSendBack = 'Survey sent back successfully!';
                    $scope.isSent = true;
                }
                $timeout(function() {
                    $scope.msgSendBack = '';
                }, 5000);
            }).catch(function(error) {
                $scope.disableSendBack = false;
                console.error("Error in sending back the survey--", error);
            });

        }


        //-----------------------------------------

        /* function Approve(){
                       // alert('called');
                console.log(approve)
                data={
                "ticketId":ticketId,
                "ticketSiteDetailsId":ticketSiteDetailsId,
                "sendBackFlag":"N",
                "ticketSiteDetailsComment":$scope.cmts,
                "mediaList":[{
                "directory":ticketSiteDetailsId+"/"+directory,
                "fileName":file.name,
                "contentType":file.type
                        }]
                }

                 console.log(data)
                 $http.post(approve,data).success(function(data){
                    console.log(data);
                    });
                }

                function sendBack(){
                    //  alert($scope.cmts);
                        console.log(sendback+ticketSiteDetailsId+"&sendBackComments="+$scope.cmts)
        				var data={
        				"ticketSiteDetailsId":ticketSiteDetailsId,
        				"ticketSiteComments":$scope.cmts
        				}
        				commonServices.sendback(data);
                         if($scope.cmts!=undefined){
                        $http.get(sendback+ticketSiteDetailsId+"&sendBackComments="+$scope.cmts).success(function(data){
                        console.log(data);
                        });
                        }else{
                     alert("Please Enter Send Back Comments");
                           }
                     } */

        $scope.$on("poTicketID", function() {
            //--------------------------------------
            //-------------------Estimated ship date
            //alert('bf4');
            if (typeof $scope.poTicketID != 'undefined' || $scope.poTicketID != null) {
                commonServices.getSiteSummary($scope.poTicketID).then(function(data1) {


                    console.log(data1.shipdate);
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
            }
        });


        //---------------------------------

        function siteSummary() {
            commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {

                var currentTime = new Date();
                var month = currentTime.getMonth() + 1;
                var day = currentTime.getDate();
                var year = currentTime.getFullYear();
                var hours = currentTime.getHours();
                var minutes = currentTime.getMinutes();
                var ampm;
                if (hours > 11) {
                    ampm = 'PM';
                } else {
                    ampm = 'AM';
                }
                //document.getElementById('myTextarea').value = data.ticketSiteComments+'\n'+month+'-'+day+'-'+year+'-'+hours+':'+minutes+' '+ampm+'-';
                console.log('surveyDetails');
                console.log(data);
                console.log(data.ticketSiteComments);



                //-----------------------------------------------




                //var datee =new Date().toLocaleString();
                document.getElementById('myTextarea').value = data.ticketSiteComments + '\n' + month + '-' + day + '-' + year + '-' + hours + ':' + minutes + ' ' + ampm + '-  ';


                console.log(JSON.stringify(data));
                $scope.surveyor = data.assignedTo;
                var siteStatus = data.statusName;
                var siteStatusId = data.statusId;
                $scope.currentStage = data.stageName;
                if (siteStatusId == 2) {

                    //alert('completed');
                    var btnAttch = document.getElementById('btnSubmit');
                    console.log(btnAttch)
                    btnAttch.setAttribute('disabled', '');
                    var btnSubmit = document.getElementById('btnSB');
                    console.log(btnSubmit)
                    btnSubmit.setAttribute('disabled', '');
                    /* var shipdate=document.getElementById('shipdate');
                                shipdate.setAttribute('disabled',''); */

                }
                // alert("pm name:"+$scope.surveyor);

                if (data.stagewiseContractorList.installation != undefined) {
                    $scope.existingSelectedContractorNxtStg = data.stagewiseContractorList.installation;
                    if ($scope.existingSelectedContractorNxtStg != "") {
                        $scope.selectedContractorForNextStage = $scope.existingSelectedContractorNxtStg;
                        if (document.querySelector('paper-typeahead-input-customerMaster') != undefined) {
                            document.querySelector('paper-typeahead-input-customerMaster').inputValue = $scope.selectedContractorForNextStage;
                        }
                    }
                }

            });
            commonServices.getAuthToken().then(function(data) {
                commonServices.getSiteData(siteId, data).then(function(data) {
                    //   console.log(JSON.stringify(data[0]));
                    $scope.siteId = data[0].siteId;
                    $scope.siteName = data[0].siteName;
                });
            });
        }


        function getAllMedia() {
            var allFiles = [];
            commonServices.getAllMedia(ticketId).then(function(data) {
                var x = data.ticketsiteIdsList[6];
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    angular.forEach(data.allMedia, function(value, key) {
                        if (key != 1) {
                            var allMedia = data.allMedia[key];
                            allMedia.forEach(function(obj) {
                                allFiles.push(obj);
                            });
                            //displayMedia(allMedia);
                        }
                    });
                } else {
                    angular.forEach(data.allMedia, function(value, key) {
                        if (key != 1) {
                            var allMedia = data.allMedia[key];
                            allMedia.forEach(function(obj) {
                                allFiles.push(obj);
                            });
                            //displayMedia(allMedia);
                        }
                    });
                }
                displayMedia(allFiles);
                $scope.$broadcast("poTicketID");
            });
        }
        getAllMedia();

        // Display media files uploaded..
        function displayMedia(mediaJson) {
            var remoteUrl = null, // Blob URL.
                validFileExtensions = commonServices.validFileExtensions, // List of valid file extentions.
                tempFinalObj = {}, // Tem data object, holds fileds used to display uploaded fils info.
                fileType = null, // Type of file uploaded.
                uploadedFileCls = commonServices.uploadedFileCls; // Class of various types of files.

            $scope.finalData = []; // Final data, bind to UI to be displayed.
            var tempArr = [];
            for (var i = 0; i < mediaJson.length; i++) {
                var fileName = mediaJson[i].fileName; // Cache the file extension.
                var res = encodeURIComponent(fileName);
                remoteUrl = commonServices.getBlobStoreURL() + '/getBlob?directory=' + mediaJson[i].directory + '&fileName=' + res + '&contentType=' + mediaJson[i].contentType;
                var ext = '.' + fileName.split('.')[1];
                fileType = commonServices.getFileName(ext, validFileExtensions);
                var tempClass = uploadedFileCls[fileType];
                tempFinalObj = {};
                tempFinalObj = {
                    'fileName': fileName,
                    'blobUrl': remoteUrl,
                    'class': (tempClass || uploadedFileCls['defaultClass'])
                }
                tempArr.push(tempFinalObj);

            }
            $('.buttonStyle').css("display", "none");
            $scope.finalData = tempArr;
            tempArr = [];
        }


        function fileUploadedData() {
            $http.get(fileUploadedData1 + siteId).success(function(siteDataa) {

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
                media.innerHTML = '';
                for (var i = 0; i < $scope.filename.length; i++) {

                    var remoteUrl = commonServices.getBlobStoreURL(); + '/getBlob?SiteId=' + siteId + '&directory=' + $scope.directory[i] + '&filename=' + $scope.filename[i];
                    var mediaobj = document.createElement('a');
                    //var space = document.createElement('div');
                    mediaobj.innerHtml = '&nbsp;';
                    var ext = $scope.filename[i].substring($scope.filename[i].indexOf('.'), $scope.filename[i].length)


                    if (ext != null || ext != "") {

                        console.log('----------------' + $scope.validFileExtensionsForExcel)
                        for (var j = 0; j <= $scope.validFileExtensionsForExcel.length; j++) {
                            if (ext == $scope.validFileExtensionsForExcel[j]) {
                                $scope.fileType = "excel";
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
                        for (var l = 0; l <= $scope.validFileExtensionsForText.length; l++) {
                            if (ext == $scope.validFileExtensionsForText[l]) {
                                $scope.fileType = "txt";
                                break;
                            }
                        }
                        mediaobj.setAttribute('id', 'link-' + i);
                        mediaobj.setAttribute('href', remoteUrl);
                        var child = document.createElement('i');
                        child.innerHTML = '<br><span style="font-size:14px">' + $scope.filename[i] + '</span>';
                        if ($scope.fileType == "image") {
                            child.setAttribute('style', 'padding-right:10px;');
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
                        } else if ($scope.fileType == "txt") {
                            child.setAttribute('class', 'fa fa-file-text-o fa-3x');
                            child.innerHTML = '<br><span style="font-size:14px">' + $scope.filename[i] + '</span>';
                            child.setAttribute('margin-right', '10px');
                            child.setAttribute('aria-hidden', 'true');
                            child.setAttribute('style', 'color:cadetblue');
                        }
                        mediaobj.appendChild(child);
                        //mediaobj.appendChild(space);
                        media.appendChild(mediaobj);
                        ext = "";
                    }
                }
            });

        }
        //------------------------------------




    }]);

});