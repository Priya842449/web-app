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
    var directory = "PO";
    var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";


    // Dev Urls




    // Controller definition
    controllers.controller('PODetailsCtrl', ['$state', '$timeout', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'designServices', function($state, $timeout, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices, designServices) {
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

        var approve = commonServices.getadminServiceURL() + "/moveToNextStage";
        var sendback = commonServices.getadminServiceURL() + "/sendback?ticketSiteDetailsId=";
        var getBlobImage = commonServices.getBlobStoreURL();
        var uploadUrl = commonServices.getBlobStoreURL(); + "/uploadMultiBlob"
        var directory = "PODetails";
        $scope.fileType = "";
        $scope.showDelButton = "visible"; // To show hide the delete button on files uploaded.
        $scope.mediaArray = [];
        $scope.filename = [];
        $scope.directory = [];
        $scope.validFileExtensionsForImage = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.validFileExtensionsForPdf = [".pdf"];
        $scope.validFileExtensionsForExcel = [".xlsx", ".xls", ".cvs"];
        $scope.validFileExtensionsForText = [".txt"];
        $scope.disableSubmit = false;
        $scope.hideDelete = false;

        $scope.fileArrayTemp = [];
        var flagIndoor = 0;
        var flagOutdoor = 0;
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        //console.log(siteId);
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var dynamicURL = getSiteName + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';


        var map = document.getElementById('google-map');

        init();




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

        function init() {
            siteSummary();

            //loadSurveyData();
            $scope.fileArray = [];
        }
        $scope.cmts = '';
        $scope.sendBackfl = 'Y';

        $(".tabs-menu a").click(function(event) {
            event.preventDefault();
            $(this).parent().addClass("current");
            $(this).parent().siblings().removeClass("current");
            var tab = $(this).attr("href");
            $(".tab-content").not(tab).css("display", "none");
            $(tab).fadeIn();


        });



        /* function disableButton(){
			 var data = commonServices.getData()
			 console.log(data);
		            angular.forEach(data, function(value, key) {
                           if(value.ticketSiteDetailsId==ticketSiteDetailsId){
						        if(value.currentStageStatus=='Completed'){

								//alert('completed');
								var btnAttch = document.getElementById('btnAttch');
								console.log(btnAttch)
								btnAttch.setAttribute('disabled','');
								var btnSubmit = document.getElementById('btnSubmit');
								console.log(btnSubmit)
								btnSubmit.setAttribute('disabled','');
								}

						   }
			          });


		} */
        $scope.$on("poTicketID", function() {
            //--------------------------------------
            //For Estimated Installation date

            //---------------------------------------------------
            //alert($scope.poTicketID);
            if (typeof $scope.poTicketID != 'undefined' || $scope.poTicketID != null) {
                commonServices.getSiteSummary($scope.poTicketID).then(function(data1) {
                    var mainsurvey = data1.main_survey[0];
                    console.log(mainsurvey);
                    if (typeof mainsurvey == 'undefined') {
                        console.log('empty main');
                    } else {
                        var installationDate = new Date(data1.main_survey[0].estimated_install_date)

                        var installmonths = installationDate.getMonth() + 1;
                        var installdays = installationDate.getDate();
                        //alert(month);
                        if (installmonths < 10) {
                            installmonths = "0" + installmonths;
                        };
                        if (installdays < 10) {
                            installdays = "0" + installdays;
                        };

                        var installformattedDate = installationDate.getFullYear() + "-" + installmonths + "-" + installdays;
                        installformattedDate = installformattedDate;
                        //formattedDate =  "2013-02-08";
                        console.log(installformattedDate);
                        console.log(installationDate);

                        var estInstalldate = document.getElementById('estInstalldate');
                        estInstalldate.innerHTML = installformattedDate;
                    }
                });
            }
        });


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
                document.getElementById('myTextarea').value = data.ticketSiteComments + '\n' + month + '-' + day + '-' + year + '-' + hours + ':' + minutes + ' ' + ampm + '-  ';

                $scope.ticketcomments = data.ticketSiteComments;
                console.log('--comment--' + $scope.ticketcomments);
                console.log(JSON.stringify(data));
                $scope.pm = data.assignedTo;
                //abc = data.completedDate;
                var siteStatus = data.statusName;
                var siteStatusId = data.statusId;
                //alert(data.surveyTypeId);
                $scope.currentStage = data.stageName;

                // For Estimated shipdate---------------
                if (data.shipdate != null) {
                    var d = new Date(data.shipdate);

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
                    var defaultdate = document.getElementById('shipdate');
                    defaultdate.setAttribute('value', formattedDate);
                } else {
                    var defaultdate = document.getElementById('shipdate');
                    defaultdate.setAttribute('value', '');
                }
                //--------------------------------------
                /* //For Estimated Installation date
				var mainsurvey=data.main_survey[0];
				console.log(mainsurvey);
			if(typeof  mainsurvey == 'undefined'){
				console.log('empty main');
			}else{
				var installationDate = new Date(data.main_survey[0].estimated_install_date)

				var installmonths=installationDate.getMonth()+1;
                var installdays=installationDate.getDate();
                //alert(month);
                  if(installmonths < 10){
                      installmonths = "0"+installmonths;
                    };
                    if(installdays < 10){
                     installdays = "0"+installdays;
                     };

                                var installformattedDate = installationDate.getFullYear() + "-" + installmonths + "-" + installdays;
								installformattedDate = installformattedDate ;
                                //formattedDate =  "2013-02-08";
                                console.log(installformattedDate);
				    console.log(installationDate);

				var estInstalldate=document.getElementById('estInstalldate');
					estInstalldate.innerHTML= installformattedDate;
			 } */

                //---------------------------------------------------

                console.log(siteStatusId);
                if (siteStatusId == 2) {

                    $scope.hideDelete = true;
                    $scope.showDelButton = "hidden"; // To show hide the delete button on files uploaded.
                    var btnAttch = document.getElementById('btnAttch');
                    console.log(btnAttch)
                    btnAttch.setAttribute('disabled', '');
                    var btnSubmit = document.getElementById('btnSubmit');
                    console.log(btnSubmit)
                    btnSubmit.setAttribute('disabled', '');
                    var shipdate = document.getElementById('shipdate');
                    shipdate.setAttribute('disabled', '');
                    var myTextarea = document.getElementById('myTextarea');
                    myTextarea.setAttribute('disabled', '');

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


        $scope.submit = function() {

            $scope.disableSubmit = true;
            $scope.ticketSiteComments = document.getElementById('myTextarea').value;
            $scope.shipdate = document.getElementById('shipdate').value;

            /*var data={
              "ticketId":ticketId,
              "ticketSiteDetailsId":ticketSiteDetailsId,
              "sendBackFlag":"N",
			  "ticketSiteDetailsComment":$scope.ticketSiteComments,
			  	"shipdate":$scope.shipdate
			}*/

            // --------------------NEW Approve SYNTAX----------------------------
            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteDetailsComment": $scope.ticketSiteComments,
                "action": "approvedStage",
                "shipdate": $scope.shipdate
            }

            //commonServices.approve(data); old microservice

            commonServices.senbackRejectApprove(data).then(function(respData, status) {
                console.log("senbackRejectApprove",respData);
					$scope.submitError = respData.data.msg;
                if ((respData.data.status == 'SUCCESS')) {
                    var alert1 = document.querySelector('#submitAlert');
                    alert1.toggle();
                  disableControls();
		  //  $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                   // var okRedirect = document.getElementById('okRedirect');
                  //  okRedirect.setAttribute('onclick', "window.location = '/PODetails/" + $scope.redirectPage + "'");
                } else {
					if(!($scope.submitError == '' && $scope.submitError == null && $scope.submitError == undefined)){
                        $scope.msgApprove = $scope.submitError;
                    }else {
                         $scope.msgApprove = "Data not submitted successfully";
                    }
                    // var submitbtn = document.querySelector('#btnSubmit')
                    // submitbtn.setAttribute('enabled', '');
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
                            getAllMedia();
                        }
                    }
                }
            } else {
                returnThis = false;
            }
            return returnThis;
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

            commonServices.getAllMedia(ticketId).then(function(data) {
                var x = data.ticketsiteIdsList[1];
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    allMediaNew = data.allMedia[6];
                    angular.forEach(data.allMedia, function(value, key) {
                        displayMedia(allMediaNew)
                    });
                } else {
                    allMediaNew = data.allMedia[6];
                    angular.forEach(data.allMedia, function(value, key) {
                        displayMedia(allMediaNew);
                    });
                }
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
                    data = fileData.allMedia[6]; // 4 is the stage number, to get the files for a particular stage.
                    displayMedia(data);
                } else {
                    data = fileData.allMedia[6]; // 4 is the stage number, to get the files for a particular stage.
                    displayMedia(data); // Call the function which prepares the final data.

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
            tempArr = [];
        }



        /* function viewUploadedDesign(){
        //alert("Inside view");
        var media = document.querySelector('#after');
        		for(var i=0;i<$scope.fileArrayTemp.length;i++) {
        		//alert("Inside view fdsgs");
        		 var fileArray = $scope.fileArraytemp;
        		 var fileArrayTemp=fileArray;
        		 console.log($scope.fileArrayTemp[i].name);
        		// console.log(fileArray);
        			var remoteUrl=getBlobImage+'/getBlob?directory='+ticketSiteDetailsId+"/"+directory+'&fileName='+$scope.fileArrayTemp[i].name+'&contentType='+$scope.fileArrayTemp[i].type;
        			console.log(remoteUrl);
        		//	https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory='+directory[i]+'&filename='+fileName[i]+'&contentType=image/png';
        			var mediaobj = document.createElement('a');
        			//var space = document.createElement('div');
        			mediaobj.innerHtml = '&nbsp;';
        			// var ext = $scope.fileArray[i].substring($scope.fileArray[i].indexOf('.'),$scope.fileArray[i].length)


        			// if(ext!=null || ext !="")
        			// {

        			// console.log('----------------'+$scope.validFileExtensionsForExcel)
        			// for(var j=0;j<=$scope.validFileExtensionsForExcel.length;j++)
        			// {

        				// if(ext == $scope.validFileExtensionsForExcel[j])
        				// {

        					// $scope.fileType="excel";

        					// break;
        				// }
        			// }
        			// for(var k=0;k<=$scope.validFileExtensionsForImage.length;k++)
        			// {

        				// if(ext == $scope.validFileExtensionsForImage[k])
        				// {

        					// $scope.fileType="image";

        					// break;
        				// }
        			// }
        			// for(var l=0;l<=$scope.validFileExtensionsForPdf.length;l++)
        			// {
        				// if(ext == $scope.validFileExtensionsForPdf[l])
        				// {

        					// $scope.fileType="pdf";

        					// break;
        				// }
        			// }


        			mediaobj.setAttribute('id', 'link-'+i);
        			mediaobj.setAttribute('href', remoteUrl);
        			var child=document.createElement('i');
        			child.innerHTML='<br><span style="font-size:14px">'+$scope.fileArrayTemp[i].name+'</span>';
        			child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
        			child.setAttribute('margin-right', '10px');
        			child.setAttribute('aria-hidden', 'true');
        			child.setAttribute('style', 'color:cadetblue');
        			// if($scope.fileType == "image"){

        			// child.setAttribute('class', 'fa fa-camera-retro fa-3x');
        			// child.setAttribute('margin-right', '10px');
        			// child.setAttribute('aria-hidden', 'true');
        			// child.setAttribute('style', 'color:cadetblue');
        			// }
        			// else if($scope.fileType == "pdf"){
        			// child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
        			// child.setAttribute('margin-right', '10px');
        			// child.setAttribute('aria-hidden', 'true');
        			// child.setAttribute('style', 'color:cadetblue');
        			// }
        			// else if($scope.fileType == "excel"){
        			// child.setAttribute('class', 'fa fa-file-excel-o fa-3x');
        			// child.setAttribute('margin-right', '10px');
        			// child.setAttribute('aria-hidden', 'true');
        			// child.setAttribute('style', 'color:cadetblue');
        			// }
        			mediaobj.appendChild(child);
        			//mediaobj.appendChild(space);
        			media.appendChild(mediaobj);
        			//ext = "";
        			}
        		} */

        /* function viewUploadedDesign(){
	alert("Inside view");
	var media = document.querySelector('#after');
			for(var i=0;i<$scope.fileArrayTemp.length;i++) {

				var remoteUrl=getBlobImage+'/getBlob?directory='+ticketSiteDetailsId+"/"+directory+'&fileName='+$scope.fileArray[i].name+'&contentType='+$scope.fileArray[i].type;
				console.log(remoteUrl);
			//	https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory='+directory[i]+'&filename='+fileName[i]+'&contentType=image/png';
				var mediaobj = document.createElement('a');
				//var space = document.createElement('div');
				mediaobj.innerHtml = '&nbsp;';
				// var ext = $scope.fileArray[i].substring($scope.fileArray[i].indexOf('.'),$scope.fileArray[i].length)


				// if(ext!=null || ext !="")
				// {

				// console.log('----------------'+$scope.validFileExtensionsForExcel)
				// for(var j=0;j<=$scope.validFileExtensionsForExcel.length;j++)
				// {

					// if(ext == $scope.validFileExtensionsForExcel[j])
					// {

						// $scope.fileType="excel";

						// break;
					// }
				// }
				// for(var k=0;k<=$scope.validFileExtensionsForImage.length;k++)
				// {

					// if(ext == $scope.validFileExtensionsForImage[k])
					// {

						// $scope.fileType="image";

						// break;
					// }
				// }
				// for(var l=0;l<=$scope.validFileExtensionsForPdf.length;l++)
				// {
					// if(ext == $scope.validFileExtensionsForPdf[l])
					// {

						// $scope.fileType="pdf";

						// break;
					// }
				// }


				mediaobj.setAttribute('id', 'link-'+i);
				mediaobj.setAttribute('href', remoteUrl);
				var child=document.createElement('i');
				child.innerHTML='<br><span style="font-size:14px">'+$scope.fileArray[i].name+'</span>';
				child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
				child.setAttribute('margin-right', '10px');
				child.setAttribute('aria-hidden', 'true');
				child.setAttribute('style', 'color:cadetblue');
				// if($scope.fileType == "image"){

				// child.setAttribute('class', 'fa fa-camera-retro fa-3x');
				// child.setAttribute('margin-right', '10px');
				// child.setAttribute('aria-hidden', 'true');
				// child.setAttribute('style', 'color:cadetblue');
				// }
				// else if($scope.fileType == "pdf"){
				// child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
				// child.setAttribute('margin-right', '10px');
				// child.setAttribute('aria-hidden', 'true');
				// child.setAttribute('style', 'color:cadetblue');
				// }
				// else if($scope.fileType == "excel"){
				// child.setAttribute('class', 'fa fa-file-excel-o fa-3x');
				// child.setAttribute('margin-right', '10px');
				// child.setAttribute('aria-hidden', 'true');
				// child.setAttribute('style', 'color:cadetblue');
				// }
				mediaobj.appendChild(child);
				//mediaobj.appendChild(space);
				media.appendChild(mediaobj);
				//ext = "";
				}
			}
 */




        function moveTonextStageWithMediaData() {
            var data = '';
            //alert($scope.cmts);
            // if($scope.cmts==undefined){

            // $scope.cmts='';
            // }


            angular.forEach($scope.fileArray, function(file) {
                console.log(file);
                data = {
                    "ticketId": ticketId,
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "sendBackFlag": "N",
                    "ticketSiteDetailsComment": $scope.cmts
                }
            });
            console.log(data);
            designServices.Approve(data);


        }

        ////////////////Survey Code













        $scope.Approve = function() {
            //alert('approved called in po Details');
            //alert('moveTonextStageWithMediaData');
            //moveTonextStageWithMediaData();

            console.log(file);
            console.log(approve)
            var data;

            data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.ticketcomments,
                "action": "approvedStage"
            }

            commonServices.senbackRejectApprove(data).then(function(respData, status) {
                console.log(respData)
                if ((respData.data.status == 'SUCCESS')) {
                    var alert1 = document.querySelector('#submitAlert');
                    alert1.toggle();
                    $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                    var okRedirect = document.getElementById('okRedirect');
                    okRedirect.setAttribute('onclick', "window.location = '/pmviewDesign/" + $scope.redirectPage + "'");
                } else {
                    // var submitbtn = document.querySelector('#btnSubmit')
                    // submitbtn.setAttribute('enabled', '');
                    var alert1 = document.querySelector('#submitAlertForFail');
                    alert1.toggle();
                }
            }).catch(function(error) {
                console.error("Error in approving the survey--", error);
                $scope.disableApprove = false;
            });

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






        $scope.Approve = function() {
            //alert();
            $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
            //alert($scope.redirectPage);
            var okRedirect = document.getElementById('okRedirect');

            okRedirect.setAttribute('onclick', "window.location = '/PODetails/" + $scope.redirectPage + "'");
            console.log(okRedirect);
            console.log(approve)
            var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N"
            }
            console.log(data)
            $http.post(approve, data).success(function(data) {

                console.log(data);


            });
        }



    }]);



});