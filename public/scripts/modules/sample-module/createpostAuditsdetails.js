/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    controllers.controller('CreatePostAuditsDetailsCtrl', ['$state', '$timeout', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', '$timeout', 'commonServices', '$window', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, $timeout, commonServices, $window) {
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
        var approveAdmin = commonServices.getadminServiceURL() + "/moveToNextStage";
        var sendback = commonServices.getadminServiceURL() + "/sendback?ticketSiteDetailsId=";
        var getBlobImage = commonServices.getBlobStoreURL();
        var uploadUrl = commonServices.getBlobStoreURL();
        var directory = "CreateInstallDrawing";
        //var getsurveyData = "http://localhost:8080/getSurveyData?ticketid=";
        //var getSiteSummry = "http://localhost:8080/siteData?ticketSiteDetailsId=";
        var getSiteName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=";
        //--------------------------------

        //var getsurveyData= "http://localhost:8080/GetSurveyResponse?ticketSiteDetailId=1&surveyTypeId=4";


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
        $scope.selectedContractorForNextStage = "";
        $scope.existingSelectedContractorNxtStg = "";
        fileUploadedData();
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
            console.log(data.allMedia);
            //console.log(JSON.parse(data));
            var allMedia = data.allMedia[6];
            fileUploadedData(allMedia);
            angular.forEach(data.allMedia, function(value, key) {
                //	console.log(value);
            });
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

        /*  commonServices.getAssignmentGridData(ticketId).then(function(data) {
				console.log("ingetAth"+data);

                 }); */

        window.addEventListener('pt-item-confirmed', function(e) {
            var selectedContractorForNextStage = document.querySelector('paper-typeahead-input-customerMaster').inputValue;
            $scope.selectedContractorForNextStage = selectedContractorForNextStage;
        });
        $scope.disableCreateAudit = false;
        $scope.onSubmit = function() {
            $scope.disableCreateAudit = true;
            if ($scope.selectedContractorForNextStage != "") {
                $scope.ticketSiteComments = document.getElementById('myTextarea').value;
                var data = {
                    "ticketId": ticketId,
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "sendBackFlag": "N",
                    "ticketSiteDetailsComment": $scope.ticketSiteComments,
                    "action": "approvedStage",
                    "selectedContractorForNextStage": $scope.selectedContractorForNextStage
                }
                commonServices.senbackRejectApprove(data).then(function(respData, status) {
                    console.log(respData);
					$scope.submitError = respData.data.msg;
                    if ((respData.data.status == 'SUCCESS')) {
                        var alert1 = document.querySelector('#submitAlert');
                        alert1.toggle();
                        disableControls();
                        // $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                        // var okRedirect = document.getElementById('okRedirect');
                        // okRedirect.setAttribute('onclick', "window.location = '/createpostAuditsdetails/" + $scope.redirectPage + "'");
                    } else {
						if(!($scope.submitError == '' || $scope.submitError == null || $scope.submitError == undefined)){
                                     $scope.msgApprove = $scope.submitError;
                                }else {
                                    $scope.msgApprove = "Data not submitted successfully";
                                }
                        $scope.disableCreateAudit = true;
                        var alert1 = document.querySelector('#submitAlertForFail');
                        alert1.toggle();
                    }
                    $timeout(function() {
                        $scope.msgSendBack = '';
                    }, 5000);
                }).catch(function(error) {
                    console.error("Error in approving the survey--", error);
                });
            } else {
                $scope.disableCreateAudit = false;
                var popModel = document.querySelector('#invalidAlertforBoth');
                popModel.toggle();
            }
        }

        function disableControls() {
            $scope.disableCreateAudit = true;
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

        $scope.upload = function() {
            //alert('scxdacvasncb');
            uploadFile();
            updateMedia();
            $scope.fileArray = [];

        }


        function approve() {
            //console.log(approve)
            var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.ticketcomments
            }
            console.log(data);
            commonServices.approveAdmin(data);

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
                console.log(file);


                data = {
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "mediaList": [{
                        "directory": ticketSiteDetailsId + "/" + directory,
                        "fileName": file.name,
                        "contentType": file.type
                    }]
                }
                console.log(data);
                commonServices.updateMedia(data);
            });

        }


        /* function viewUploadedDesign(){
        alert("Inside view");
        var media = document.querySelector('#after');
        		for(var i=0;i<$scope.fileArrayTemp.length;i++) {
        		alert("Inside view fdsgs");
        		 var fileArray = $scope.fileArraytemp;
        		 var fileArrayTemp=fileArray;
        		 console.log($scope.fileArrayTemp[i].name);
        		//console.log(fileArray);
        			var remoteUrl=getBlobImage+'/getBlob?directory='+ticketSiteDetailsId+"/"+directory+'&fileName='+$scope.fileArrayTemp[i].name+'&contentType='+$scope.fileArrayTemp[i].type;
        			console.log(remoteUrl);
        		//	https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory='+directory[i]+'&filename='+fileName[i]+'&contentType=image/png';
        			var mediaobj1 = document.createElement('a');
        			//var space = document.createElement('div');
        			mediaobj1.innerHtml = '&nbsp;';
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


        			mediaobj1.setAttribute('id', 'link-'+i);
        			mediaobj1.setAttribute('href', remoteUrl);
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
        			mediaobj1.appendChild(child);
        			//mediaobj.appendChild(space);
        			media.appendChild(mediaobj1);
        			console.log("In View"+mediaobj1);
        			//ext = "";
        			}
        		} */



        function uploadFile() {
            $scope.fileArrayTemp = $scope.fileArray;
            var response = '';
            var xhttp = new XMLHttpRequest();
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
                        console.log(xhttp.responseText);
                        response = 'Success';

                        //viewUploadedDesign();
                        getAllMedia();
                    }
                    console.log(response);
                }
            }

        };

        function getAllMedia() {

            //	alert(ticketId);
            commonServices.getAllMedia(ticketId).then(function(data) {
                console.log(data.allMedia);
                //console.log(JSON.parse(data));
                var x = data.ticketsiteIdsList[6];
                console.log(x);
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    var allMedia = data.allMedia[7];
                    displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {
                        //	console.log(value);
                    });
                } else {
                    var allMedia = data.allMedia[7];
                    displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {
                        //	console.log(value);
                    });
                }
                $scope.$broadcast("poTicketID");
            });
        }
        getAllMedia();


        function displayMedia(mediaJson) {
            //	$http.get(getsurveyData+"/GetSurveyResponse?ticketSiteDetailId="+ticketSiteDetailsId+"&surveyTypeId=4").success(function(siteDataa){
            console.log(mediaJson);
            $scope.mediaArray = [];
            $scope.filename = [];
            $scope.directory = [];
            $scope.contentType = [];
            // angular.forEach(siteDataa, function(value, key) {
            // angular.forEach(value, function(value1, key1) {
            angular.forEach(mediaJson, function(value2, key2) {
                angular.forEach(value2, function(value3, key3) {
                    console.log(value3)
                    if (key3 == 'fileName') {
                        $scope.filename.push(value3);
                        $scope.mediaArray.push(value3);
                    }
                    if (key3 == 'directory') {
                        $scope.mediaArray.push(value3);
                        $scope.directory.push(value3);
                    }
                    if (key3 == 'contentType') {
                        $scope.mediaArray.push(value3);
                        $scope.contentType.push(value3);
                    }
                });
            });
            //	});
            //});

            var media = document.querySelector('#after');
            media.innerHTML = '';
            for (var i = 0; i < $scope.filename.length; i++) {

                var remoteUrl = getBlobImage + '/getBlob?directory=' + $scope.directory[i] + '&fileName=' + $scope.filename[i] + '&contentType=' + $scope.contentType[i];
                console.log(remoteUrl);
                //	https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory='+directory[i]+'&filename='+fileName[i]+'&contentType=image/png';
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
                            //alert('yo')
                            $scope.fileType = "txt";

                            break;
                        }
                    }


                    mediaobj.setAttribute('id', 'link-' + i);
                    mediaobj.setAttribute('href', remoteUrl);
                    var child = document.createElement('i');
                    if ($scope.fileType == "image") {

                        child.setAttribute('class', 'fa fa-camera-retro fa-3x');
                        child.innerHTML = '<br><span style="font-size:14px">' + $scope.filename[i] + '</span>';
                        child.setAttribute('margin-right', '10px');
                        child.setAttribute('aria-hidden', 'true');
                        child.setAttribute('style', 'color:cadetblue');
                    } else if ($scope.fileType == "pdf") {
                        child.setAttribute('class', 'fa fa-file-pdf-o fa-3x');
                        child.innerHTML = '<br><span style="font-size:14px">' + $scope.filename[i] + '</span>';
                        child.setAttribute('margin-right', '10px');
                        child.setAttribute('aria-hidden', 'true');
                        child.setAttribute('style', 'color:cadetblue');
                    } else if ($scope.fileType == "excel") {
                        child.setAttribute('class', 'fa fa-file-excel-o fa-3x');
                        child.innerHTML = '<br><span style="font-size:14px">' + $scope.filename[i] + '</span>';
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
                    $scope.fileType = "";
                }
            }
            //	});
        }



        /* 	function uploadFile(){
				console.log("inside upload file")
        var fileArray = $scope.fileArray;
		console.log(fileArray.length);
		var response='';
		var xhttp = new XMLHttpRequest();
		console.log(fileArray.length);

		if(fileArray.length>0){
        var fd = new FormData();
		//fd.append('SiteId',siteId);
		fd.append('directory',ticketSiteDetailsId+"/"+directory);
		angular.forEach(fileArray, function(file){
		fd.append('file', file);
		})
		console.log(fd);
        xhttp= commonServices.uploadFileToUrl(fd, uploadUrl) ;
		console.log(xhttp);
		 xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
		console.log(xhttp.responseText);
		response = 'Success';

		viewUploadedDesign();
        }
		console.log(response);
		}
		}

    };  */


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
        });



        //-----------------------------------------

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

                    //alert('completed');
                    var btnSubmit = document.getElementById('btnApprove');
                    console.log(btnSubmit)
                    btnSubmit.setAttribute('disabled', '');

                }

                if (data.stagewiseContractorList.postAudit != undefined) {
                    $scope.existingSelectedContractorNxtStg = data.stagewiseContractorList.postAudit;
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

        /* function siteSummary(){
                                                var surveyor;
                                                $scope.completedDate;
                                                $scope.siteName;
                                                var abc;
												//console.log(data);
                                                $http.get(getSiteSummry+ticketSiteDetailsId).success(function(data){

                                                                surveyor =   data.assignedTo;
                                                    abc = data.completedDate;
                                                                var d = new Date(abc);
                                                                $scope.completedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                                                                $scope.siteData={'siteId':+siteId,'surveyor':+surveyor,'completedDate':+$scope.completedDate };
                                                });

                                                commonServices.getAuthToken().then(function(data){
                                                    commonServices.getSiteData(dynamicURL,data).then(function(data){
																				console.log(data);
                                                                                $scope.siteName = data[0].siteName;
                                                                                $scope.siteLat = data[0].siteLocation.lat;
                                                                                $scope.siteLang = data[0].siteLocation.lng;
                                                                });
                                                });
                                 */
        //-----------------------------------
        function fileUploadedData(mediaJson) {


            //	$http.get("https://3.209.34.30:8080/siteData?ticketSiteDetailsId=1").success(function(siteDataa){

            console.log(mediaJson);
            $scope.mediaArray = [];
            $scope.filename = [];
            $scope.directory = [];
            $scope.contentType = [];
            // angular.forEach(siteDataa, function(value, key) {
            // angular.forEach(value, function(value1, key1) {
            angular.forEach(mediaJson, function(value2, key2) {
                angular.forEach(value2, function(value3, key3) {
                    console.log(value3)
                    if (key3 == 'fileName') {
                        $scope.filename.push(value3);
                        $scope.mediaArray.push(value3);
                    }
                    if (key3 == 'directory') {
                        $scope.mediaArray.push(value3);
                        $scope.directory.push(value3);
                    }
                    if (key3 == 'contentType') {
                        $scope.mediaArray.push(value3);
                        $scope.contentType.push(value3);
                    }
                });
            });

            var media = document.querySelector('#after');
            for (var i = 0; i < $scope.filename.length; i++) {

                var remoteUrl = 'https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?SiteId=' + siteId + '&directory=' + $scope.directory[i] + '&fileName=' + $scope.filename[i] + '&contentType=' + $scope.contentType[i];;
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
            //  });

        }
        //------------------------------------



    }]);

});