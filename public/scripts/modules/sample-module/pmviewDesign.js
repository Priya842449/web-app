/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';
    controllers.controller('pmviewdesignCtrl', ['$state', '$rootScope', '$scope', '$log', '$timeout', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'designServices', function($state, $rootScope, $scope, $log, $timeout, PredixAssetService, $http, $location, $stateParams, commonServices, designServices) {
        var getsurveyData = commonServices.getsurveyServiceURL() + ""; // change
        //var getsurveyData= "http://localhost:8080/GetSurveyResponse?ticketSiteDetailId=1&surveyTypeId=4";
        var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";
        var getBlobImage = commonServices.getBlobStoreURL();
        var uploadUrl = commonServices.getBlobStoreURL(); + "/uploadMultiBlob"
        var approve = commonServices.getadminServiceURL() + "/moveToNextStage";
        var sendback = commonServices.getadminServiceURL() + "/sendback?ticketSiteDetailsId=";

        var directory = "PMApproveDesign";
        $scope.showDelButton = "visible"; // To hide the delete buton on files uploaded
        $scope.fileArray = [];
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
        $scope.fileArrayTemp = [];
        $scope.selectedContractorForNextStage = "";
        $scope.existingSelectedContractorNxtStg = "";
        $scope.disableSendBack = false;
        $scope.disableApprove = false;
        $scope.attchDisabled = false;
        siteSummary();

        $scope.hideDelete = false;
        tokensetup();
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


        $scope.$on("poTicketID", function() {
            //--------------------------------------
            //-------------------Estimated ship date
            //alert('bf4');
            if (typeof $scope.poTicketID != 'undefined' || $scope.poTicketID != null) {
                commonServices.getSiteSummary($scope.poTicketID).then(function(data1) {
                    //alert('fhsfsh');

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



        function siteSummary() {
            var surveyor;
            $scope.completedDate;
            $scope.siteName;
            var abc;
            commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {

                if (data.stagewiseContractorList.proposal != undefined) {
                    $scope.existingSelectedContractorNxtStg = data.stagewiseContractorList.proposal;
                    if ($scope.existingSelectedContractorNxtStg != "") {
                        $scope.selectedContractorForNextStage = $scope.existingSelectedContractorNxtStg;
                        if (document.querySelector('paper-typeahead-input-customerMaster') != undefined) {
                            document.querySelector('paper-typeahead-input-customerMaster').inputValue = $scope.selectedContractorForNextStage;
                        }
                    }
                }

                var comment = data.ticketSiteComments;
                if (comment == null) {
                    comment = '';
                } else {


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
                    document.getElementById('myTextarea').value = comment + '\n' + month + '-' + day + '-' + year + '-' + hours + ':' + minutes + ' ' + ampm + '-  ';
                }
                $scope.surveyor = data.assignedTo;
                var siteStatus = data.statusName;
                $scope.currentStage = data.stageName;

                /*
					//-------------------Estimated ship date
				//alert($scope.poTicketID);
				commonServices.getSiteSummary($scope.poTicketID).then(function(data1) {
					//alert('fhsfsh');

				console.log(data1.shipdate);
				if(data1.shipdate != null){
				var d = new Date(data1.shipdate);

                var months=d.getMonth()+1;
                var days=d.getDate();
                //alert(month);
                  if(months < 10){
                      months = "0"+months;
                    };
                    if(days < 10){
                     days = "0"+days;
                     };

                               var formattedDate = d.getFullYear() + "-" + months + "-" + days;
								formattedDate = formattedDate ;
                                //formattedDate =  "2013-02-08";
                                //alert(formattedDate);
								var defaultdate=document.getElementById('estShipdate');
								defaultdate.innerHTML= formattedDate;
				}
				else
				{//alert();
					 var defaultdate=document.getElementById('estShipdate');
                                defaultdate.innerHTML= "";
				}
				});
				//----------------------------------------------- */
                var maintenance = data.maintenance;

                var siteStatusId = data.statusId;
                if (siteStatus = 'Completed' && siteStatusId == 2) {
                    $scope.showDelButton = "hidden"; // To hide the delete buton on files uploaded
                    var btnAttch = document.getElementById('btnAttch');
                    btnAttch.setAttribute('disabled', '');
                    var btnSubmit = document.getElementById('btnApprove');
                    btnSubmit.setAttribute('disabled', '');
                    var btnSB = document.getElementById('btnSB');
                    btnSB.setAttribute('disabled', '');
                    $scope.attchDisabled = true;
                }

            });

            commonServices.getAuthToken().then(function(data) {
                console.log(dynamicURL);
                commonServices.getSiteDataForPM(dynamicURL, data).then(function(data) {
                    $scope.siteId = data[0].siteId;
                    $scope.siteName = data[0].siteName;

                });
            });
        }


        // To delete uploaded files..
        // To delete uploaded files..This function name should be same here and at other locations
        // as this function name is being used in directive to delete file..
        $scope.deleteThisFile = function(a_fileName, a_position) {
            var data = {
                'ticketSiteDetailsId': ticketSiteDetailsId,
                'fileName': a_fileName,
                'directory': ticketSiteDetailsId + "/" + directory
            }
            var forBlobDelete = {
                'fileName': a_fileName,
                'directory': ticketSiteDetailsId + "/" + directory
            };

            commonServices.deleteThisFile(data).then(function(succRes) {
                commonServices.deleteThisFileBlob(forBlobDelete).then(function(blobRes) {
                    $scope.finalData.splice(a_position, 1);
                }).catch(function(blobErr) {
                    console.error("Error deleting file from blob", blobErr);
                });
            }).catch(function(errDeleteFile) {
                console.error("Error occured in deleting file", errDeleteFile);
            });
        }

        commonServices.getAllMedia(ticketId).then(function(data) {
            //alert('1');
            console.log(data.allMedia);

            console.log(data.allMedia);
            //console.log(JSON.parse(data));
            var allMedia = data.allMedia[3];
            displayMedia(allMedia);
            angular.forEach(data.allMedia, function(value, key) {
                //	console.log(value);
            });
        });










$scope.disableSendBack = false;
$scope.sendBack = function(){
        disableControls();
        // $scope.disableSendBack = true;
        // $scope.disableApprove = true;
                var ticketSiteComments = document.getElementById('myTextarea').value;
		//alert('hi from sendback surveyDetails.js --');
		//console.log('ticketSiteComments--'+ticketSiteComments)
       // console.log(sendback+ticketSiteDetailsId+"&ticketSiteComments="+ticketSiteComments)

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

            /*var data={
            		"ticketSiteDetailsId":ticketSiteDetailsId,
            		"ticketSiteComments":day+'-'+month+'-'+year+' '+hours+':'+minutes+':'+ampm+':-'+ticketSiteComments
            }*/

            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + ampm + ':-' + ticketSiteComments,
                "action": "sendbackStage",
                "sendBackFlag": "Y",
                "sendBackComments": " "
            }

            //commonServices.sendback(data);

            commonServices.senbackRejectApprove(data).then(function(respData) {
                var status = respData.status;
                console.log('data ', status, 'as', respData)

               // if (!(status == 200 || status == 201)) {
                   if (respData.data.status == "FAILED") {
                    $scope.msgSendBack = respData.data.msg;
                    $scope.isSent = false;
                    //$scope.disableSendBack = false;
                    disableControls();
                } else if(respData.data.status == "SUCCESS"){
                    $scope.disableSendBack = true; // To disable enable send back button..
                    $scope.disableApprove = true; // To disable enable approve button..
                    $scope.attchDisabled = true;
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

        //Attachment Code

        // FIle validation before uploading
        $scope.upload = function() {
            var isValidFile = uploadFile(); // For Upload file in blobstore
            if (isValidFile) {
                updateMedia(); // for updating the media table
                $scope.fileArray = [];
            }
        }

        $scope.removeFile = function(val) {
            $scope.fileArrayToUpload.splice(val, 1);
        }

        $scope.closePopup = function() {
            $scope.fileArrayToUpload = [];
            $('.closePopup').attr('dialog-dismiss', '');
        }
        $scope.fileArrayToUpload = [];

        function updateMedia() {
            var data;
            angular.forEach($scope.fileArray, function(file) {

                data = {
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "mediaList": [{
                        "directory": ticketSiteDetailsId + "/" + directory,
                        "fileName": file.name,
                        "contentType": file.type
                    }]
                }
                commonServices.updateMedia(data);
            });

        }

        function getAllMedia() {
            //alert(ticketId);
            var allMedia;
            var allMediaNew;
            commonServices.getAllMedia(ticketId).then(function(data) {
                var x = data.ticketsiteIdsList[6];

                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    //					alert($scope.poTicketID);
                    //console.log(JSON.parse(data));
                    allMedia = data.allMedia[4];
                    //displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {
                        //	console.log(value);
                    });
                } else {
                    allMedia = data.allMedia[4];
                    //displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {
                        //	console.log(value);
                    });
                }
            });

            commonServices.getAllMedia(ticketId).then(function(data) {

                console.log(data.allMedia);
                //console.log(JSON.parse(data));
                allMediaNew = data.allMedia[3];
                //displayMedia(allMedia);
                angular.forEach(data.allMedia, function(value, key) {
                    //	console.log(value);
                    var newMedia = allMedia.concat(allMediaNew);
                    displayMedia(newMedia);
                });
                //console.log($scope.poTicketID);
                $scope.$broadcast("poTicketID");

            });
        }
        getAllMedia();

        //--------------------------------------------------------------------------------------------------------------
        // Function: getFilesUploaded
        //   Used to get files uploaded by designer or manager.
        //
        // Parameters:
        //   No Parameters.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        function getFilesUploaded() {
            var data = null; // Data as reponse to the call.
            var dataNew = null;
            // This call to service returns the media object, which consists the file data.
            commonServices.getAllMedia(ticketId).then(function(fileData) {
                var x = fileData.ticketsiteIdsList[6]
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    console.log($scope.poTicketID);
                    data = fileData.allMedia[4]; // 4 is the stage number, to get the files for a particular stage.
                    dataNew = fileData.allMedia[3]
                    var newMedia = data.concat(dataNew);
                    displayMedia(newMedia);
                } else {
                    data = fileData.allMedia[4]; // 4 is the stage number, to get the files for a particular stage.
                    dataNew = fileData.allMedia[3]
                    var newMedia = data.concat(dataNew);
                    displayMedia(newMedia); // Call the function which prepares the final data.

                }
                $scope.$broadcast("poTicketID");

            }).catch(function(error) {
                console.log('error fetching files');
            });
        }

        getFilesUploaded(); // Call the function on load of the page.

        //--------------------------------------------------------------------------------------------------------------
        // Function: displayMedia
        //   Used to prepare data to display the uploaded files.
        //
        // Parameters:
        //   mediaJson - Files data to be displayed.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
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
            $scope.finalData = tempArr;
            console.log('$scope.finalData', $scope.finalData);
            tempArr = [];
        }

        /*  commonServices.getAssignmentGridData(ticketId).then(function(data) {
				console.log("ingetAth"+data);

                 }); */

        window.addEventListener('pt-item-confirmed', function(e) {
            var selectedContractorForNextStage = document.querySelector('paper-typeahead-input-customerMaster').inputValue;
            $scope.selectedContractorForNextStage = selectedContractorForNextStage;
        });
        $scope.disableApprove = false;
        $scope.Approve = function() { // Approve Button
            $scope.disableApprove = true;
            //if($scope.selectedContractorForNextStage != ""){
            if ($scope.selectedContractorForNextStage != "") {

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

                $scope.ticketSiteComments = document.getElementById('myTextarea').value;


                // --------------------NEW Approve SYNTAX----------------------------
                var data = {
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "ticketSiteDetailsComment": month + '-' + day + '-' + year + ' ' + hours + ':' + minutes + ':' + ampm + ':-' + $scope.ticketSiteComments,
                    "action": "approvedStage",
                    "selectedContractorForNextStage": $scope.selectedContractorForNextStage
                }

                commonServices.senbackRejectApprove(data).then(function(respData, status) {
                    console.log(respData)
                    $scope.submitError = respData.data.msg;
                    if ((respData.data.status == 'SUCCESS')) {
                        var alert1 = document.querySelector('#submitAlert');
                        alert1.toggle();
                        disableControls();
                        //$scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                       // var okRedirect = document.getElementById('okRedirect');
                      //  okRedirect.setAttribute('onclick', "window.location = '/pmviewDesign/" + $scope.redirectPage + "'");
                    }

                    //  else if(respData.data.status == 'FAILED'){
                    // console.log("resp",respData.data.msg)
                    // $scope.disableApprove = true;
                 else {
                        // var submitbtn = document.querySelector('#btnSubmit')
                        // submitbtn.setAttribute('enabled', '');

                          if(!($scope.submitError == '' || $scope.submitError == null || $scope.submitError == undefined)){
                        $scope.msgApprove = $scope.submitError;
                    }else {
                         $scope.msgApprove = "Data not submitted successfully";
                    }
                        //$scope.disableApprove = false;
                        var alert1 = document.querySelector('#submitAlertForFail');
                        alert1.toggle();
                        disableControls();
                    }
                }).catch(function(error) {
                    $scope.disableApprove = false;
                    console.error("Error in approving the survey--", error);
                    $scope.disableApprove = false;
                });
            } else {
                var popModel = document.querySelector('#invalidAlertforBoth');
                popModel.toggle();
                $scope.disableApprove = false;
            }

        }

        function disableControls() {
            $scope.disableApprove = true;
            $scope.attchDisabled = true;
            $scope.disableSendBack = true;
        }
        // $scope.sendBack = function(){
        // //  alert($scope.cmts);
        // console.log(sendback+ticketSiteDetailsId+"&sendBackComments="+$scope.cmts)

        // var data={
        // "ticketSiteDetailsId":ticketSiteDetailsId,
        // "ticketSiteComments":$scope.cmts
        // }
        // commonServices.sendback(data);
        // }

        //Attachment Code



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
            var returnThis = true;
            $scope.fileArrayTemp = $scope.fileArrayToUpload;
            console.log($scope.fileArrayToUpload);
            if ($scope.fileArrayTemp.length > 0) {
                /*$scope.fileArrayTemp.forEach(function(obj) {
                    $scope.fileArray.push(obj);
                });*/
                $scope.fileArrayToUpload = [];
                var response = '';
                var xhttp = new XMLHttpRequest();
                $(".slow").show();
                console.log($scope.fileArray.length);
                console.log($scope.fileArrayTemp.length);
                if ($scope.fileArrayTemp.length > 0) {
                    var fd = new FormData();
                    //fd.append('SiteId',siteId);
                    fd.append('directory', ticketSiteDetailsId + "/" + directory);
                    angular.forEach($scope.fileArrayTemp, function(file) {
                        console.log(file);
                        fd.append('file', file);
                    })
                    console.log(fd);
                    xhttp = commonServices.uploadFileToUrl(fd, uploadUrl + "/uploadMultiBlob");
                    console.log(xhttp);
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            console.log('xhttp.responseText', xhttp.responseText);

                            response = 'Success';
                            $(".slow").hide();
                            //viewUploadedDesign();
                            getAllMedia();
                        }
                        console.log(response);

                    }
                }


            } else {
                returnThis = false;
            }
            return returnThis;
        };


    }]);
});