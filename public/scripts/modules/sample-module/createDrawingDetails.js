/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

     controllers.controller('CreateDrawingDetailsCtrl', ['$state', '$timeout', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', '$timeout', 'commonServices', '$window', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, $timeout, commonServices, $window) {

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
        // var getSiteListSurveyor =commonServices.getadminServiceURL()+"/sitelist?assignedTo=1&stageName=Survey&status=InProgress";
        var approve = commonServices.getadminServiceURL() + "/moveToNextStage";
        var sendback = commonServices.getadminServiceURL() + "/sendback?ticketSiteDetailsId=";
        var getBlobImage = commonServices.getBlobStoreURL();
        var uploadUrl = commonServices.getBlobStoreURL(); + "/uploadMultiBlob"

        var directory = "CreateInstallDrawing";
        //var getsurveyData = "http://localhost:8080/getSurveyData?ticketid=";
        //var getSiteSummry = "http://localhost:8080/siteData?ticketSiteDetailsId=";
        var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";
        //--------------------------------

        //var getsurveyData= "http://localhost:8080/GetSurveyResponse?ticketSiteDetailId=1&surveyTypeId=4";

        $scope.showDelButton = "visible";
        $scope.siteLat;
        $scope.siteLang;
        $scope.fileType = "";
        $scope.mediaArray = [];
        $scope.filename = [];
        $scope.directory = [];
	$scope.attchDisabled = false;
        $scope.validFileExtensionsForImage = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.validFileExtensionsForPdf = [".pdf"];
        $scope.validFileExtensionsForExcel = [".xlsx", ".xls", ".cvs"];
        $scope.validFileExtensionsForText = [".txt"];
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var dynamicURL = getSiteName + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';
        var map = document.getElementById('google-map');
        // fileUploadedData();
        $scope.cmts = '';
        //------------------------


        var siteId = $stateParams.siteId;

        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var ticketId = $stateParams.ticketId;
        //var surveyor;
        $scope.completedDate;
        $scope.siteName;
        var abc;


        $scope.fileArray = [];

        tokensetup();

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
                console.log("ingetAth" + data);
                console.log(JSON.stringify(data[0]));
                console.log(siteId);
                $scope.siteId = data[0].siteId;
                $scope.siteName = data[0].siteName;


            });
        });

        commonServices.getAllMedia(ticketId).then(function(data) {
            var x = data.ticketsiteIdsList[6];
            console.log(x);
            if (typeof x != 'undefined') {
                $scope.poTicketID = '';
                $scope.poTicketID = x[0];
                console.log($scope.poTicketID);
                //console.log(JSON.parse(data));
                var allMedia = data.allMedia[6];
                //fileUploadedData(allMedia);
                angular.forEach(data.allMedia, function(value, key) {
                    //	console.log(value);
                });
            } else {
                var allMedia = data.allMedia[6];
                //fileUploadedData(allMedia);
                angular.forEach(data.allMedia, function(value, key) {
                    //	console.log(value);
                });
            }
        });

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
            console.log("********" + $scope.fileArray);

        }

        $scope.onSubmit = function() {
            $scope.disableSubmit = true;
            $scope.attchDisabled = true;
            $scope.ticketSiteComments = document.getElementById('myTextarea').value;


            /*var data={
            	"ticketId":ticketId,
            	"ticketSiteDetailsId":ticketSiteDetailsId,
            	"sendBackFlag":"N",
            	"ticketSiteDetailsComment":$scope.ticketSiteComments
            }*/

            // --------------------NEW Approve SYNTAX----------------------------
            var data = {
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "ticketSiteDetailsComment": $scope.ticketSiteComments,
                    "action": "approvedStage",
                }
                //commonServices.approve(data); //old microservice

            commonServices.senbackRejectApprove(data).then(function(respData, status) {
                console.log("respdata",respData)
                $scope.submitError = respData.data.msg;
                if ((respData.data.status == 'SUCCESS')) {
                    var alert1 = document.querySelector('#submitAlert');
                    alert1.toggle();
                    disableControls();
                    // $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                    // var okRedirect = document.getElementById('okRedirect');
                    // okRedirect.setAttribute('onclick', "window.location = '/createdrawingdetails/" + $scope.redirectPage + "'");
                } else {
                    // var submitbtn = document.querySelector('#btnSubmit')
                    // submitbtn.setAttribute('enabled', '');
                    if(!($scope.submitError == '' || $scope.submitError == null || $scope.submitError == undefined)){
                    $scope.msgSendBack = $scope.submitError;
                    }else {
                         $scope.msgSendBack = "Data not submitted successfully";
                    }
                   // $scope.disableSubmit = false;
                    var alert1 = document.querySelector('#submitAlertForFail');
                    alert1.toggle();
                    disableControls();
                }
            }).catch(function(error) {
                $scope.disableSubmit = false;
                console.error("Error in approving the survey--", error);
            });

        }

        function disableControls() {
            $scope.disableSubmit = true;
            $scope.attchDisabled = true;
        }
        /* approve = function(){
		//console.log(approve)
		alert('--create drawing details--'+$scope.cmts);
        var data={
              "ticketId":ticketId,
              "ticketSiteDetailsId":ticketSiteDetailsId,
              "sendBackFlag":"N",
			  "ticketSiteDetailsComment":$scope.cmts
        }
		commonServices.approve(data);

	    } */

        // Upload file and validation

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

        $scope.fileArrayToUpload = []; // The file selcted to upload.
        function uploadFile() {
            var returnThis = true;
            $scope.fileArrayTemp = $scope.fileArrayToUpload;

            if ($scope.fileArrayTemp.length > 0) {
                $scope.fileArrayToUpload = [];
                var response = '';
                var xhttp = new XMLHttpRequest();
                $(".slow").show();
                if ($scope.fileArrayTemp.length > 0) {
                    var fd = new FormData();
                    fd.append('directory', ticketSiteDetailsId + "/" + directory);
                    angular.forEach($scope.fileArrayTemp, function(file) {
                        fd.append('file', file);
                    })
                    xhttp = commonServices.uploadFileToUrl(fd, uploadUrl + "/uploadMultiBlob");
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            response = 'Success';
                            $(".slow").hide();
                            //viewUploadedDesign();
                            getAllMedia();
                        }
                    }
                }

            } else {
                returnThis = false;
            }
            return returnThis;
        }


        /*function uploadFile() {
           $scope.fileArrayTemp = $scope.fileArray;
            var response='';
            var xhttp = new XMLHttpRequest();
            $(".slow").show();
            console.log($scope.fileArray.length);
             console.log($scope.fileArrayTemp.length);
            if($scope.fileArrayTemp.length>0){
            var fd = new FormData();
            //fd.append('SiteId',siteId);
            fd.append('directory',ticketSiteDetailsId+"/"+directory);
            angular.forEach($scope.fileArrayTemp, function(file){
            console.log(file);
            fd.append('file', file);
            })
            console.log(fd);
            xhttp= commonServices.uploadFileToUrl(fd, uploadUrl+"/uploadMultiBlob") ;
            console.log(xhttp);
             xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
            response = 'Success';
                    $(".slow").hide();
            //viewUploadedDesign();
                getAllMedia();
            }
            console.log(response);
            }
		}

    }*/



        function approve() {
            var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.ticketcomments
            }
            commonServices.approve(data);
        }

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


        $scope.sendBack = function() {
            //alert('--create drawing details--'+$scope.cmts);
            //  alert($scope.cmts);
            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": $scope.cmts
            }
            commonServices.sendback(data);
        }


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

            var allMedia;
            var allMediaNew;
            //alert(ticketId);
            commonServices.getAllMedia(ticketId).then(function(data) {
                var x = data.ticketsiteIdsList[6];
                console.log(x);
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    allMedia = data.allMedia[6];
                    angular.forEach(data.allMedia, function(value, key) {});
                } else {
                    allMedia = data.allMedia[6];
                    //displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {
                        //	console.log(value);
                    });
                }
            });

            commonServices.getAllMedia(ticketId).then(function(data) {

                console.log(data.allMedia);
                //console.log(JSON.parse(data));
                allMediaNew = data.allMedia[7];
                //displayMedia(allMedia);
                angular.forEach(data.allMedia, function(value, key) {
                    //	console.log(value);
                    var newMedia = allMedia.concat(allMediaNew);
                    displayMedia(newMedia)
                });
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
                    data = fileData.allMedia[6]; // 4 is the stage number, to get the files for a particular stage.
                    dataNew = fileData.allMedia[7]
                    var newMedia = data.concat(dataNew);
                    displayMedia(newMedia);
                } else {
                    data = fileData.allMedia[6]; // 4 is the stage number, to get the files for a particular stage.
                    dataNew = fileData.allMedia[7]
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
                remoteUrl = commonServices.getBlobStoreURL() + '/getBlob?directory=' + mediaJson[i].directory + '&fileName=' + fileName + '&contentType=' + mediaJson[i].contentType;
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

        function viewUploadedDesign() {
            var media = document.querySelector('#after1');
            for (var i = 0; i < $scope.fileArray.length; i++) {

                var remoteUrl = getBlobImage + '/getBlob?directory=' + ticketSiteDetailsId + "/" + directory + '&fileName=' + $scope.fileArray[i].name + '&contentType=' + $scope.fileArray[i].type;
                console.log('b4 ');
                console.log(remoteUrl);
                //	https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory='+directory[i]+'&filename='+fileName[i]+'&contentType=image/png';
                var mediaobj = document.createElement('a');
                //var space = document.createElement('div');
                mediaobj.innerHtml = '&nbsp;';

                mediaobj.setAttribute('id', 'link-' + i);
                mediaobj.setAttribute('href', remoteUrl);
                var child = document.createElement('i');
                child.innerHTML = '<br><span style="font-size:14px">' + $scope.fileArray[i].name + '</span>';
                child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
                child.setAttribute('margin-right', '10px');
                child.setAttribute('aria-hidden', 'true');
                child.setAttribute('style', 'color:cadetblue');

                mediaobj.appendChild(child);
                //mediaobj.appendChild(space);
                media.appendChild(mediaobj);
                //ext = "";
            }
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
                        var defaultdate = document.getElementById('estShipdate');
                        defaultdate.innerHTML = formattedDate;
                    } else {
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
                //var datee =new Date().toLocaleString();
                document.getElementById('myTextarea').value = data.ticketSiteComments + '\n' + month + '-' + day + '-' + year + '-' + hours + ':' + minutes + ' ' + ampm + '-  ';

                $scope.ticketcomments = data.ticketSiteComments;

                console.log(JSON.stringify(data));
                $scope.surveyor = data.assignedTo;
                abc = data.completedDate;
                var siteStatus = data.statusName;
                var siteStatusId = data.statusId;
                $scope.currentStage = data.stageName;
                if (siteStatusId == 2) {
                    var btnAttch = document.getElementById('btnAttch');
                    console.log(btnAttch)
                    btnAttch.setAttribute('disabled', '');
                    var btnSubmit = document.getElementById('btnSubmit');
                    console.log(btnSubmit)
                    btnSubmit.setAttribute('disabled', '');
                    $timeout(function() {
                        $scope.showDelButton = "hidden";
                    }, 1000);
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
    }]);

});