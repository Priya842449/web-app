/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';



    // Controller definition
    controllers.controller('designSiteDetailsCtrl', ['$state', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'designServices', 'proposalServices', '$timeout', 'designService', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices, designServices, proposalServices, $timeout, designService) {
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

        var directory = "Design";
        console.log("MAIN designSiteDetailsCtrl");
        $scope.fileType = "";
        $scope.mediaArray = [];
        $scope.filename = [];
        $scope.directory = [];
        $scope.validFileExtensionsForImage = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.validFileExtensionsForPdf = [".pdf"];
        $scope.validFileExtensionsForExcel = [".xlsx", ".xls", ".cvs"];
        $scope.validFileExtensionsForText = [".txt"];
        $scope.disableSendBack = false; // To disable enable send back button..
        var url = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku';

        var count = 0;
        var length = 0;
        var skuList = [];
        var existingData = [];
        $scope.existingData = [];

        $scope.skuId = '';
        $scope.skuIdTbl = '';
        $scope.skuDescription = '';
        $scope.jsonData = [];
        $scope.jsonDataCopy = [];
        $scope.siteName = '';
        var jsonData1 = {};

        $scope.hideDelete = false;
        $scope.attchDisabled = false;
        var uploadUrl = commonServices.getBlobStoreURL();
        console.log(uploadUrl);
        $scope.fileArrayTemp = [];
        var flagIndoor = 0;
        var flagOutdoor = 0;
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var surveyTicketSiteDetailsId;

        var defaultDummyVersionData = {
            "ticketsitedetailsId": ticketSiteDetailsId,
            "designName": "Default Version",
            "assignedTo": "",
            "isFinalFlag": "Y",
            "isNewFlag": "N",
            "solution": [{
                "surveyserialnum": "1",
                "DoNothing": []
            }]
        };

        var dynamicURL = commonServices.getAssetURL() + "/site?filter=" + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';
        var map = document.getElementById('google-map');
        map.notifyResize();
        init();
        $scope.tokensetup = function() {
            commonServices.getAuthToken().then(function(config) {
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId, config).success(function(data) {
                    console.log("Auth data--Old version", data);
                    var sitAdd = data[0].siteAddress;
                    $scope.siteAddress = sitAdd.street + "," + sitAdd.city + "," + sitAdd.region + "," + sitAdd.country;
                });
            });
        }

        $scope.tokensetup();
        getRateData();

        function getRateData() {
            proposalServices.getRateData().then(function(data) {
                $scope.rateJson = data;
            });
        }
        window.addEventListener('pt-item-confirmed', function(e) {
            var srcElement2 = e.srcElement;
            var data = srcElement2.__data__;
            $scope.skuId = data.keyid;
            commonServices.getAuthToken().then(function(data1) {
                commonServices.getWattage(data1, $scope.skuId).then(function(data) {
                    $scope.wattage = data[0].ballastWatts;
                });
            });
        });

        $scope.saveData = function() {
                var status = false;
                console.log('line 157', $scope.multiProposal)
                if ($scope.multiProposal.length > 0) {
                    var data = $scope.multiProposal;
                    angular.forEach(data, function(value, key) {
                        angular.forEach(value, function(value1, key1) {
                            if (value1 != null) {
                                if (key1 == 'cost') {
                                    $scope.cost = value1;
                                    status = true;
                                }
                            } else {
                                status = false;
                            }
                        });
                    });
                    if (status == false) {
                        proposalServices.saveProposalData(data).then(function(response) {});
                    } else {}
                }
            }
            /*commonServices.getAuthToken().then(function(data) {
            commonServices.GetAllSKU(data, skuList).then(function(response) {
                skuList = response;
                proposalServices.getProposalData(ticketSiteDetailsId).then(function(data) {
                    length = data.length;
                    angular.forEach(data, function(valueOld, key) {
                        var skuId = valueOld.skuId;
                        var skuDesc = "";
                        var oldJsonData = "";
                        count = count + 1;
                        angular.forEach(skuList, function(valueSKU, key) {
                            if (valueSKU.skuId != null && valueSKU.skuId != "" && valueSKU.skuId == skuId) {
                                skuId = valueSKU.skuId;
                                skuDesc = valueSKU.skuDescription;
                                oldJsonData = {
                                    "proposalId": valueOld.proposalId,
                                    "SkuId": skuId,
                                    "SkuDescription": skuDesc,
                                    "quantity": valueOld.quantity,
                                    "sap_article_no": "",
                                    "wattage":$scope.wattage
                                };
                                angular.forEach($scope.rateJson, function(value, key) {
                                    if (value.skuId == skuId) {
                                        oldJsonData.sap_article_no = value.sapArticleNo;
                                        //oldJsonData.wattage = $scope.wattage,;		//set wattage here
                                        existingData.push(oldJsonData);
                                        if (count == length) {
                                            var temp = $scope.existingData;
                                            temp = temp.concat(existingData);
                                            $scope.existingData = temp;
                                            $scope.jsonData = $scope.existingData;
                                        }
                                    }

                                });
                            }
                        });
                    });
                });
            });
        });*/

        $scope.multiProposal = [];

        function init() {
            siteSummary();
            loadMarkers();
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
            loadMarkers();

        });

        $scope.$on("poTicketID", function() {
            //-------------------Estimated ship date
            if (typeof $scope.poTicketID != 'undefined' || $scope.poTicketID != null) {
                commonServices.getSiteSummary($scope.poTicketID).then(function(data1) {
                    console.log(data1.shipdate);
                    if (data1.shipdate != null) {
                        var d = new Date(data1.shipdate);
                        var months = d.getMonth() + 1;
                        var days = d.getDate();
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

            $scope.surveyTypeId = [];
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
                $scope.cmts = data.ticketSiteComments + '\n' + month + '-' + day + '-' + year + '-' + hours + ':' + minutes + ' ' + ampm + '-  ';
                surveyor = data.assignedTo;
                abc = data.completedDate;
                var siteStatus = data.statusName;
                var siteStatusId = data.statusId;
                $scope.currentStage = data.stageName;

                //-----------------------------------------------
                var maintenance = data.maintenance;
                var rebate = data.rebate;
                if (rebate == null) {
                    rebate = "";
                }
                if (siteStatusId == 2 || siteStatusId == 3) {
                    //$scope.disableSendBack = true; // To disable enable send back button.. //TODO
                    $scope.hideDelete = true;
                    $rootScope.$broadcast('hideDelete', {});
                    var btnAttch = document.getElementById('btnAttch');
                    $scope.disableReject = true;
                    btnAttch.setAttribute('disabled', '');
                    $scope.attchDisabled = true;
                    var btnSubmit = document.getElementById('btnSubmit');
                    console.log(btnSubmit)
                    btnSubmit.setAttribute('disabled', '');
                    var btnMaintenance = document.getElementById('maintenance');
                    btnMaintenance.style.backgroundColor = "#efeff4";
                    btnMaintenance.setAttribute('readonly', '');
                    btnMaintenance.setAttribute('value', maintenance);
                    var btnRebate = document.getElementById('rebate');
                    btnRebate.style.backgroundColor = "#efeff4";
                    btnRebate.setAttribute('readonly', '');
                    btnRebate.setAttribute('value', rebate);
                    btnRebate.setAttribute("backgroundColor", "color: red;");
                    //console.log(btnAttch)
                }
                var d = new Date(abc);
                surveyTicketSiteDetailsId = data.surveyorTicketSiteDetailsId;
                $scope.completedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                if (data.surveyList != undefined) {
                    for (var i = 0; i < data.surveyList.length; i++) {
                        $scope.surveyTypeId.push(data.surveyList[i].surveyTypeId);
                    }
                }
                $scope.siteData = {
                    'siteId': siteId,
                    'surveyor': surveyor,
                    'completedDate': $scope.completedDate
                };
                if (jQuery.inArray("5", $scope.surveyTypeId) == -1) {
                    document.getElementById('main').style.display = 'none';
                }
                if (jQuery.inArray("3", $scope.surveyTypeId) != -1 || jQuery.inArray("1", $scope.surveyTypeId) != -1) {
                    //// alert('indoor')
                    var surveyTypeId;
                    if (jQuery.inArray("1", $scope.surveyTypeId) != -1) {

                        surveyTypeId = 1;
                        //// alert(surveyTypeId +' :one')
                    }
                    if (jQuery.inArray("3", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 3;
                        //// alert(surveyTypeId +' :three')
                    }
                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        $scope.Indoorsequence = data;
                        if (jQuery.inArray("4", $scope.surveyTypeId) == -1 && jQuery.inArray("2", $scope.surveyTypeId) == -1) {
                            //// alert('Indoor');
                            document.getElementById('tab2').style.display = 'none';
                        }
                    });
                }
                if (jQuery.inArray("4", $scope.surveyTypeId) != -1 || jQuery.inArray("2", $scope.surveyTypeId) != -1 || jQuery.inArray("9", $scope.surveyTypeId) != -1) {
                    //// alert('outdoor')
                    var surveyTypeId;
                    if (jQuery.inArray("2", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 2;
                    }
                    if (jQuery.inArray("4", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 4;
                    }
                    if (jQuery.inArray("9", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 9;
                    }

                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        $scope.Outdoorsequence = data;
                        if (jQuery.inArray("3", $scope.surveyTypeId) == -1 && jQuery.inArray("1", $scope.surveyTypeId) == -1) {
                            document.getElementById('tab1').style.display = 'none';
                            if ($('#tab1:visible').length == 0) {
                                $("#tab-1").fadeOut();
                                $("#tab-2").fadeIn();
                                $("#li2").addClass("current");
                            }
                        }
                    });
                }
                if (jQuery.inArray("5", $scope.surveyTypeId) != -1) {
                    var surveyTypeId = 5;
                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        $scope.Mainsequence = data;
                    });
                }
                $scope.$broadcast("ReturnSequenceCompleted");
            });
            $scope.$on("ReturnSequenceCompleted", function() {
                commonServices.getMainData(surveyTicketSiteDetailsId).then(function(data) {
                    $scope.mainData = data;
                    $scope.$broadcast("ReturnMainCompleted");
                });
            });

            commonServices.getAuthToken().then(function(data) {
                commonServices.getSiteData(siteId, data).then(function(data) {
                    console.log(JSON.stringify(data[0]));
                    $scope.siteId = data[0].siteId;
                    $scope.siteName = data[0].siteName;
                    $scope.siteLat = data[0].siteLocation.lat;
                    $scope.siteLang = data[0].siteLocation.lng;
                    if ($scope.siteLat == undefined || $scope.siteLang == undefined) {
                        map.setAttribute('zoom', 3);
                        map.notifyResize();
                    } else {
                        map.setAttribute('latitude', $scope.siteLat);
                        map.setAttribute('longitude', $scope.siteLang);
                        map.setAttribute('additional-map-options', '{"mapTypeId":"satellite"}');
                        map.setAttribute('zoom', 15);
                        map.notifyResize();
                    }
                });
            });

        }

        function getAllMedia() {
            commonServices.getAllMedia(ticketId).then(function(data) {
                var x = data.ticketsiteIdsList[6];
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    var allMedia = data.allMedia[3];
                    displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {});
                } else {
                    var allMedia = data.allMedia[3];
                    displayMedia(allMedia);
                    angular.forEach(data.allMedia, function(value, key) {});
                }
                $scope.$broadcast("poTicketID");
            });
        }
        getAllMedia();
        $scope.submit = function() {  // Submit Function
            disableControls();
            $scope.Approve();
            saveDummyVersion(defaultDummyVersionData);
        }

        // To delete uploaded files..This function name should be same here and at other locations
        // as this function name is being used in directive to delete file..
        $scope.deleteThisFile = function(a_fileName, a_position) {
            console.log("Delete file in controller", a_fileName, a_position);
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
                    console.log("File deleted successfully--blobRes", succRes, blobRes);
                    $scope.finalData.splice(a_position, 1);
                }).catch(function(blobErr) {
                    console.error("Error deleting file from blob", blobErr);
                });
            }).catch(function(errDeleteFile) {
                console.error("Error occured in deleting file", errDeleteFile);
            });
        }

        $scope.sendBackSurvey = function() {
            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sequencetoGoBack": "10",
                "ticketSiteDetailsComment": $scope.cmts
            }

            console.log("Data to send back", data);
            commonServices.sendBackSurvey(data).then(function(respData) {
                console.log("respData0000",respData)

                if (!(respData.data.status == 'SUCCESS')) {
                    //$scope.msgSendBack = $scope.submitError;
                    $scope.msgSendBack = "Survey could not be sent back!";
                    $scope.isSent = false;
                } else {
                    $scope.disableSendBack = true; // To disable enable send back button..
                    $scope.msgSendBack = 'Survey sent back successfully!';
                    $scope.isSent = true;
                }
                $timeout(function() {
                    $scope.msgSendBack = '';
                }, 5000);
            }).catch(function(error) {
                console.error("Error in sending back the survey--", error);
            });
        }

        function saveDummyVersion(a_data) {
            designService.saveDesignVersion(a_data).then(function(response) {
                console.log("Default version saved", response);
                var dataToSave = {
                    'ticketsitedetailsId': ticketSiteDetailsId,
                    'versionid': 1,
                    'isFinalFlag': 'Y'
                };
                console.log("Data to submit", dataToSave);
                designService.submitFinalVer(dataToSave).then(function(res) {
                    console.log("Flag saved", res);
                });
            });
        }

        $scope.disableSubmit = false; // To enable submit button on load
        $scope.Approve = function() {
                $scope.ticketSiteComments = document.getElementById('myTextarea').value;
                $scope.maintenance = document.getElementById('maintenance').value;
                $scope.rebate = document.getElementById('rebate').value;
                /*var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.ticketSiteComments,
				  "maintenance":$scope.maintenance,
				"rebate":$scope.rebate
            }*/
                var data = {
                        "ticketSiteDetailsId": ticketSiteDetailsId,
                        "ticketSiteDetailsComment": $scope.ticketSiteComments,
                        "action": "approvedStage",
                        "maintenance": $scope.maintenance,
                        "rebate": $scope.rebate
                    }
                    /* commonServices.approve(data);
                     $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                     var okRedirect = document.getElementById('okRedirect');
                     okRedirect.setAttribute('onclick', "window.location = '/designSiteDetails/" + $scope.redirectPage + "'");*/
                commonServices.senbackRejectApprove(data).then(function(respData, status) {
                    console.log('senbackRejectApprove', respData)
                    $scope.submitError = respData.data.msg;

                    if ((respData.data.status == 'SUCCESS')) {
                        var alert1 = document.querySelector('#submitAlert');
                        alert1.toggle();
                    disableControls();
                    $scope.disableSubmit = true;
                    $scope.disableReject = true;
                    $scope.disableApprove = true;
                    $scope.attchDisabled = true;
                    // $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                    // var okRedirect = document.getElementById('okRedirect');
                    // okRedirect.setAttribute('onclick', "window.location = '/designSiteDetails/" + $scope.redirectPage + "'");
                }else {
                     if(!($scope.submitError == '' && $scope.submitError == null && $scope.submitError == undefined)){
                        $scope.msgApprove = $scope.submitError;
                    }else {
                         $scope.msgApprove = "Data not submitted successfully";
                    }
                    $scope.disableSubmit = true;
                    $scope.disableReject = true;
                    $scope.disableApprove = true;
                    $scope.attchDisabled = true;
                    var alert1 = document.querySelector('#submitAlertForFail');
                    alert1.toggle();
                }
                // $timeout(function() {
                //     $scope.msgSendBack = '';
                // }, 5000);
            }).catch(function(error) {
                $scope.disableSubmit = false;
                console.error("Error in approving the survey--", error);
            });
        }

        function disableControls() {
            $scope.disableReject = true;
            $scope.disableSubmit = true;
            $scope.attchDisabled = true;
            $scope.disableApprove = true;
        }
        // Reject Surve
        $scope.disableReject = false;
        $scope.rejectSurvey = function() {
            disableControls();
            $scope.ticketSiteComments = document.getElementById('myTextarea').value;

            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": $scope.ticketSiteComments,
                "action": "rejectedStage",
            }
            commonServices.senbackRejectApprove(data).then(function(respData, status) {
                console.log('reject response', respData);
                $scope.rejectError = respData.data.msg;

                if (!(respData.data.status == 'SUCCESS')) {

                     if(!($scope.rejectError == '' || $scope.rejectError == null || $scope.rejectError == undefined)){
                        $scope.msgSendBack = $scope.rejectError;
                    }else {
                         $scope.msgSendBack = "Data not submitted successfully!";
                    }
                     $scope.disableSubmit = true;
                    // var alert1 = document.querySelector('#submitAlertForFail');
                    // alert1.toggle();
                    $scope.isReject = false;
                    $scope.disableReject = true;
                    $scope.disableApprove = true;
                    $scope.attchDisabled = true;
                    $scope.disableSendBack = true;
                } else {
                    $scope.msgSendBack = 'Survey rejected successfully!';
                    $scope.isReject = true;
                    $scope.disableApprove = true;
                    $scope.disableSendBack = true;
                    $scope.disableReject = true;
                    $scope.attchDisabled = true;
                }
                $timeout(function() {
                    $scope.msgSendBack = '';
                }, 5000);
            }).catch(function(error) {
                $scope.disableReject = false;
                console.error("Error in rejecting--", error);
            });
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
                        console.log(file);
                        fd.append('file', file);
                    })
                    xhttp = commonServices.uploadFileToUrl(fd, uploadUrl + "/uploadMultiBlob");
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            console.log('xhttp.responseText', xhttp.responseText);
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
            // This call to service returns the media object, which consists the file data.
            commonServices.getAllMedia(ticketId).then(function(fileData) {
                console.log("fileData--------", fileData)
                var x = fileData.ticketsiteIdsList[6]
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    console.log($scope.poTicketID);
                    data = fileData.allMedia[3]; // 4 is the stage number, to get the files for a particular stage.
                    displayMedia(data);
                } else {
                    data = fileData.allMedia[3]; // 4 is the stage number, to get the files for a particular stage.
                    displayMedia(data); // Call the function which prepares the final data.
                }
                $scope.$broadcast("poTicketID");

            }).catch(function(error) {
                console.log('error fetching files');
            });
        }

        getFilesUploaded(); // Call the function on load of the page.
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
                console.log(res)
                remoteUrl = commonServices.getBlobStoreURL() + '/getBlob?directory=' + mediaJson[i].directory + '&fileName=' + res + '&contentType=' + mediaJson[i].contentType;
                console.log('-------------------remoteUrl ', remoteUrl)
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
        $scope.Ok = function() {
            $("#myModal1").css("visibility", "hidden");
        };
        $scope.$on("ReturnSequenceCompleted", function() {
            var surveyIdOut = 0;
            if (jQuery.inArray("4", $scope.surveyTypeId) != -1) {
                surveyIdOut = 4;
            }
            if (jQuery.inArray("2", $scope.surveyTypeId) != -1) {
                surveyIdOut = 2;
            }
            if (surveyIdOut != 0) {
                commonServices.getOutdoorData(surveyTicketSiteDetailsId, surveyIdOut).then(function(data) {
                    console.log("getOutdoorData loadmarkers",data)
                    if (!($scope.Outdoorsequence == undefined)) {
                        var image = {
                            "surveyTemplateFieldId": "image",
                            "fieldName": "Image",
                            "fieldType": "TEXT"
                        };
                        $scope.Outdoorsequence.push(image);
                    }
                    $scope.outdoorData = data;
                    angular.forEach($scope.outdoorData, function(value, key) {
                        var media = value.media;
                        var fileName = [];
                        var directory = [];
                        for (var i = 0; i < media.length; i++) {
                            directory.push(media[i].directory);
                            fileName.push(media[i].fileName);
                        }
                        if (fileName.length == 1) {
                            var id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=image/png';
                            $scope.outdoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>";
                        } else {
                            var id = '';
                            for (var i = 0; i < fileName.length; i++) {
                                if (i == 0) {

                                    id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                } else {
                                    id = id + ',' + commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                    $scope.outdoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory[0] + "&fileName=" + fileName[0] + "&contentType=image/png /></paper-button></a>";
                                }
                            }
                        }
                    });

                    loadMarkers(data);

                    var data1 = angular.copy(data);
                    $scope.outdoorExcelData = data1;
                    for (var i = 0; i < data1.length; i++) {
                        delete data1[i].media;
                        delete data1[i].image;
                    }
                    $scope.$broadcast("ReturnOutdoorCompleted");
                });
            }
        });
        $scope.$on("ReturnSequenceCompleted", function() {
            var surveyIdIn = 0;
            if (jQuery.inArray("3", $scope.surveyTypeId) != -1) {
                surveyIdIn = 3;
            }
            if (jQuery.inArray("1", $scope.surveyTypeId) != -1) {
                surveyIdIn = 1;
            }
            if (surveyIdIn != 0) {
                commonServices.getIndoorData(surveyTicketSiteDetailsId, surveyIdIn).then(function(data) {
                    console.log("getIndoorData loadmarkers",data)
                    if (!($scope.Indoorsequence == undefined)) {
                        var image = {
                            "surveyTemplateFieldId": "image",
                            "fieldName": "Image",
                            "fieldType": "TEXT"
                        };
                        $scope.Indoorsequence.push(image);
                    }
                    loadMarkers(data);
                    var i = 0;
                    $scope.indoorData = data;

                    angular.forEach($scope.indoorData, function(value, key) {
                        console.log(value);
                        var media = value.media;
                        var fileName = [];
                        var directory = [];
                        for (var i = 0; i < media.length; i++) {
                            directory.push(media[i].directory);
                            fileName.push(media[i].fileName);
                        }
                        if (fileName.length == 1) {
                            var id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=image/png ';
                            console.log("<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>")
                            $scope.indoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>";
                        } else {
                            var id = '';
                            for (var i = 0; i < fileName.length; i++) {
                                if (i == 0) {
                                    id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                } else {
                                    id = id + ',' + commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                    $scope.indoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory[0] + "&fileName=" + fileName[0] + "&contentType=image/png /></paper-button></a>";
                                }
                            }
                        }
                    });
                    var data1 = angular.copy(data);
                    //$scope.outdoorExcelData = data1;
                    for (i = 0; i < data1.length; i++) {
                        delete data1[i].media;
                        delete data1[i].image;
                    }
                    $scope.excelData = data1;
                    var excelData = $scope.excelData;
                    angular.forEach($scope.Indoorsequence, function(value, key) {
                        excelData = JSON.parse(JSON.stringify(excelData).split('"' + value.surveyTemplateFieldId + '":').join('"' + value.fieldName + '":'));
                    });
                    $scope.excelData = excelData;
                    $('#indoorExport').click(function() {
                        if (data == '')
                            return;
                        JSONToCSVConvertor($scope.excelData, "Survey", true);
                    });

                    $scope.completedsurvey = data;

                    $scope.$broadcast("ReturnIndoorCompleted");
                });
            }
        });

        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    //console.log(JSON.stringify(arrData[i]));
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);
                //// alert(row);
                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                //// alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "Report_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


        function red(outdoorsurveyData) {
            $scope.outdoorsurveyFinalData = [];
            $scope.siteLan = [];
            var outdoorsurveyDataGas = [];
            var outdoorsurveyDataWall = [];
            var outdoorsurveyDataParking = [];
            var outdoorsurveyPic = [];
            var outdoorsurveyDataSofit = [];
            var outdoorsurveyDataSketches = [];
            var count = 0;



            // console.log($scope.outdoorsurveyDataMap);
            angular.forEach(outdoorsurveyData, function(value, key) {
                //$scope.siteLan.push(value.outDoorSurveyTypeId)
                if (value.outDoorSurveyTypeId == 'GAS CANOPY') {
                    if (outdoorsurveyDataGas.length != 0) {
                        if (outdoorsurveyDataGas[0].outDoorSurveyTypeId == 'GAS CANOPY') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }
                    outdoorsurveyDataGas.push(value);
                    outdoorsurveyData[key].image = "<a href='#' id='' ><paper-button data-dialog='dialog'></paper-button></a>";
                    //onclick ='gotoLink(this,event)'
                    //"<a href='javascript:void(0)' id='"+ContractorId+key+"'onclick='gotoLink(this)' style='text-decoration: none'>"+ContractorId+"</a>";
                    //<img  src=https://dt-blobstore-microservice.run.asv-pr.ice.predix.io/getBlob?SiteId=95&directory=tester&filename=TestImg.jpg />
                }
                if (value.outDoorSurveyTypeId == 'WALLPACKS') {
                    if (outdoorsurveyDataWall.length != 0) {
                        if (outdoorsurveyDataWall[0].outDoorSurveyTypeId == 'WALLPACKS') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }
                    outdoorsurveyDataWall.push(value);

                    //console.log(outdoorsurveyDataGas);

                }
                if (value.outDoorSurveyTypeId == 'PARKING') {
                    if (outdoorsurveyDataParking.length != 0) {
                        if (outdoorsurveyDataParking[0].outDoorSurveyTypeId == 'PARKING') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }

                    outdoorsurveyDataParking.push(value);

                    // console.log(outdoorsurveyDataGas);
                    count++;
                }
                if (value.outDoorSurveyTypeId == 'PICTURES') {
                    if (outdoorsurveyPic.length != 0) {
                        if (outdoorsurveyPic[0].outDoorSurveyTypeId == 'PICTURES') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }

                    outdoorsurveyPic.push(value);
                    count++;
                }
                if (value.outDoorSurveyTypeId == 'SOFFIT LIGHTS') {
                    if (outdoorsurveyDataSofit.length != 0) {
                        if (outdoorsurveyDataSofit[0].outDoorSurveyTypeId == 'SOFFIT LIGHTS') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }

                    outdoorsurveyDataSofit.push(value);
                    count++;
                }

                if (value.outDoorSurveyTypeId == 'SKETCHES') {
                    if (outdoorsurveyDataSketches.length != 0) {
                        if (outdoorsurveyDataSketches[0].outDoorSurveyTypeId == 'SKETCHES') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }

                    outdoorsurveyDataSketches.push(value);

                }
            });


            $scope.outdoorsurveyFinalData = $scope.outdoorsurveyFinalData.concat(outdoorsurveyDataGas).concat(outdoorsurveyDataWall).concat(outdoorsurveyDataParking).concat(outdoorsurveyPic).concat(outdoorsurveyDataSofit).concat(outdoorsurveyDataSketches);
        }


        function loadMarkers(outdoorsurveyDataMap) {
            console.log("INSIDE LOADMAREKRS design")
            var gmap = document.querySelector('google-map');
            gmap.notifyResize();
            var poly = document.createElement('google-map-poly');
            poly.setAttribute('closed', '');
            poly.setAttribute('fill-color', '');
            poly.setAttribute('stroke-color',"red");
            poly.setAttribute('stroke-weight', '2')
            poly.setAttribute('fill-opacity', '.25')
            Polymer.dom(gmap).appendChild(poly);
            gmap.notifyResize();
            commonServices.getAuthToken().then(function(config) {
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId + '&fields=siteName,siteId,siteLocation,propertyLineCordinate', config).success(function(data) {
                    console.log(data)
                    if (data[0].propertyLineCordinate != undefined) {
                        for (var z = 0; z < data[0].propertyLineCordinate.length; z++) {
                            var polyPoint = document.createElement('google-map-point');
                            polyPoint.setAttribute('latitude', data[0].propertyLineCordinate[z].lat);
                            polyPoint.setAttribute('longitude', data[0].propertyLineCordinate[z].lng);
                            Polymer.dom(poly).appendChild(polyPoint);
                        }
                    }
                })
            });
            // console.log("outdoorsurveyDataMap",outdoorsurveyDataMap);
            angular.forEach(outdoorsurveyDataMap, function(item) {

           var arrow_heading = 0;
            if(item.degree == undefined || item.degree == ""){
                arrow_heading = 0;
            } else {
                arrow_heading = parseInt(item.degree);
            }
            var Single = {
               "path" : 'M30.000002,6.000004l0,5l-14.5,0c-9,0 -14.5,0.4 -14.5,1c0,0.6 5.5,1 14.5,1l14.5,0l0,4.5l0,4.5l10.5,0l10.5,0l0,-4.5c0,-4.2 0.2,-4.5 2.6,-4.5c2.6,0 2.6,0 1,2.6c-1,1.4 -1.6,3 -1.4,3.6c0.2,0.6 1.6,-0.8 3.1,-3.1l2.8,-4.2l-2.7,-4.7c-1.5,-2.6 -2.9,-4.1 -3.1,-3.5c-0.3,0.7 0.3,2.3 1.1,3.5c2.2,3.1 2,3.8 -0.9,3.8c-2.3,0 -2.5,-0.3 -2.5,-5l0,-5l-10.5,0l-10.5,0l0,5zm8.4,-2.1c0.3,0.5 -0.1,2.4 -0.9,4.2c-0.8,1.9 -1.4,2.6 -1.5,1.7c0,-1.8 -4,-4.7 -4,-2.9c0,0.5 0.7,1.1 1.5,1.5c0.8,0.3 1.5,1 1.5,1.6c0,0.6 -0.7,0.5 -2,-0.2c-1.9,-1.2 -2.7,-4.8 -1.3,-6.1c1,-1 6.1,-0.8 6.7,0.2zm10,1.3c0.8,3 0.8,11.2 0,13.2c-0.6,1.5 -7.4,2.4 -7.4,1c0,-0.3 1.3,-1.8 2.9,-3.4c2.9,-2.6 3,-2.6 3.4,-0.6c0.2,1.2 0.4,-0.4 0.5,-3.4c0,-3.9 -0.2,-4.8 -0.7,-3l-0.7,2.5l-0.8,-2.3c-0.4,-1.2 -1.2,-2.2 -1.9,-2.2c-0.8,0 -0.8,0.3 0.1,1.2c2.1,2.1 0.8,7.8 -1.7,7.8c-0.4,0 -0.7,-2.9 -0.9,-6.5l-0.3,-6.5l3.4,0c2.7,0 3.6,0.5 4.1,2.2zm-8.9,12.5c-0.4,1.9 -1.2,2.3 -4.5,2.3c-2.2,0 -4,-0.2 -4,-0.4c0,-0.3 1.3,-1.7 2.9,-3.3l2.9,-2.9l1,2.5c0.8,2.3 0.9,2.2 0.5,-1.1c-0.3,-2 -0.2,-5 0.3,-6.5c0.8,-2.5 0.9,-2.3 1.2,2.1c0.2,2.7 0.1,6 -0.3,7.3zm-7.2,-6c-0.5,1.2 -0.2,1.5 1,1c2,-0.7 2.2,0.4 0.5,2.1c-1.8,1.8 -2.4,1.5 -2.6,-1.8c-0.1,-1.7 0.2,-3 0.8,-3c0.5,0 0.6,0.8 0.3,1.7z M42.600002,11.300004c0.3,1 0.9,1.5 1.2,1.2c0.3,-0.3 0,-1.1 -0.7,-1.8c-1,-0.9 -1.1,-0.8 -0.5,0.6z',
               "strokeColor": 'red',
               "strokeOpacity": 1,
               "strokeWeight": 0.5,
               "fillColor" : '#fefe99',
               "fillOpacity": 1,
               "anchor" : { x: 0, y: 12 },
               "rotation": arrow_heading,
               "scale": 0.6
            };

            var Double90Degree = {
              "path": 'M34.054325,1.381865c-0.453762,0.172735 -0.542754,0.531935 -0.124492,0.520718c0.218224,-0.005853 0.274618,0.331607 0.283131,1.901356l0.010448,1.92651l-2.90994,0.024521l-2.910037,0.006683l0.03115,5.743855l0.031053,5.726017l2.90936,-0.131549l2.90936,-0.131549l0.006001,7.814045l-0.012281,7.796695l-7.910515,0.229995l-7.910611,0.212157l-0.032019,-2.550355l-0.032019,-2.550355l-5.78293,0.155094l-5.764744,0.154606l-0.004352,2.55133l-0.022537,2.551818l-1.909361,0.069048c-1.25469,0.051491 -1.909748,-0.002304 -1.965078,-0.143545c-0.036951,-0.106053 0.126233,-0.199633 0.380827,-0.206461c0.418262,-0.011218 1.033177,-0.652132 1.030759,-1.098083c-0.000484,-0.08919 0.143644,-0.342825 0.32453,-0.526083c0.578447,-0.657777 0.758946,-0.912387 0.757979,-1.090768c-0.000484,-0.08919 0.126233,-0.199633 0.271329,-0.274887c0.145192,-0.057416 0.21716,-0.202071 0.16183,-0.343313c-0.129232,-0.353347 -0.982878,-0.134206 -0.980846,0.240393c0.000871,0.160543 -0.19733,0.504831 -0.450473,0.779229c-0.253143,0.274399 -0.451634,0.565173 -0.45115,0.654363c0.00058,0.107028 -0.126136,0.217471 -0.271232,0.292725c-0.145192,0.057416 -0.271716,0.203534 -0.271038,0.328401c-0.016637,0.285897 -1.010832,1.418681 -1.265426,1.425509c-0.090927,0.002439 -0.181176,0.129744 -0.180402,0.272448c0.000774,0.142704 0.110563,0.264645 0.256045,0.260743c0.127297,-0.003414 0.291836,0.152739 0.347552,0.365333c0.073999,0.229944 0.183594,0.316208 0.328593,0.223116c0.163184,-0.09358 0.199942,-0.023203 0.110563,0.264645c-0.053202,0.251196 0.002322,0.428113 0.166376,0.495076c0.145773,0.049612 0.255659,0.189391 0.256432,0.332095c0.000774,0.142704 0.128652,0.246319 0.274134,0.242417c0.145483,-0.003902 0.273457,0.117551 0.274424,0.295931c0.000871,0.160543 0.203037,0.547615 0.459373,0.861872c0.256336,0.314257 0.458406,0.683491 0.45918,0.826196c0.001838,0.338923 0.857515,0.494381 0.983071,0.169882c0.053879,-0.12633 -0.037822,-0.266595 -0.183594,-0.316208c-0.145773,-0.049612 -0.255755,-0.207229 -0.256626,-0.367771c-0.000774,-0.142704 -0.074192,-0.26562 -0.183304,-0.262694c-0.090927,0.002439 -0.219288,-0.190366 -0.293287,-0.42031c-0.05591,-0.24827 -0.220836,-0.475775 -0.366608,-0.525387c-0.145773,-0.049612 -0.255949,-0.242905 -0.257013,-0.439123c-0.000967,-0.178381 -0.129425,-0.389023 -0.293383,-0.438148c-0.18224,-0.066475 -0.255755,-0.207229 -0.183981,-0.38756c0.071677,-0.19817 -0.019927,-0.320597 -0.256626,-0.367771c-0.200329,-0.048149 -0.364867,-0.204302 -0.365544,-0.329169c-0.001064,-0.196219 0.398723,-0.260463 1.817177,-0.298505l1.836717,-0.049259l-0.021183,2.801551l-0.002901,2.818901l5.764744,-0.154606l5.78293,-0.155094l-0.051655,-2.817438l-0.051559,-2.7996l8.237947,-0.220936l8.238044,-0.203098l-0.007355,-8.063778l-0.007355,-8.063778l2.655249,-0.035531l2.637064,-0.035043l-0.031053,-5.726017l-0.03115,-5.743855l-2.672951,0.125209l-2.654766,0.124721l0.010156,-1.481047c-0.00445,-0.820551 0.028148,-1.51721 0.064325,-1.553862c0.162894,-0.147094 0.873862,0.15497 0.875023,0.369027c0.000774,0.142704 0.165022,0.245343 0.365061,0.239978c0.200038,-0.005365 0.363996,0.04376 0.36448,0.13295c0.000387,0.071352 0.365448,0.311331 0.821435,0.548871c0.455987,0.23754 0.821048,0.477518 0.821435,0.548871c0.000484,0.08919 0.164442,0.138315 0.36448,0.13295c0.200038,-0.005365 0.363223,-0.098945 0.362739,-0.188135c-0.001645,-0.303247 -1.316695,-1.320577 -2.191621,-1.671766c-0.145773,-0.049612 -0.456277,-0.291054 -0.675759,-0.517096c-0.457148,-0.451597 -0.784871,-0.51417 -0.782742,-0.121733c0.000774,0.142704 -0.07129,0.269522 -0.180402,0.272448c-0.236409,0.00634 -0.238634,-0.403935 -0.003483,-0.64217c0.271329,-0.274887 -0.385084,-0.578414 -0.87512,-0.386865zm-4.044392,5.478504c-0.035597,0.14368 0.165022,0.245343 0.456181,0.273216c0.345714,0.026409 0.490907,-0.031006 0.489843,-0.227225c-0.001258,-0.231895 0.271232,-0.292725 1.616945,-0.328816c0.963822,-0.025849 1.691621,0.025995 1.746854,0.149398c0.219965,0.315232 -0.052428,0.3939 -1.398238,0.412153c-1.473107,0.021667 -2.217447,0.273558 -1.361674,0.446854c0.273167,0.064036 1.000676,0.062366 1.582412,0.011083l1.090732,-0.100615l0.004934,0.909741c0.004547,0.838389 -0.049429,0.94688 -0.719287,1.517906c-0.398336,0.331815 -0.72364,0.715193 -0.722866,0.857897c0.001451,0.267571 -0.325594,0.329864 -0.79938,0.164164c-0.36448,-0.13295 -0.384213,-0.417871 -0.020507,-0.427626c0.145483,-0.003902 0.272199,-0.114344 0.271425,-0.257049c-0.001741,-0.321085 0.757785,-1.126444 1.247918,-1.300155c0.526503,-0.174686 0.378893,-0.563222 -0.16628,-0.477238c-0.581446,0.104797 -1.322884,0.89183 -1.663665,1.775162c-0.251015,0.666836 -0.341651,0.722789 -1.032403,0.794836l-0.745308,0.073511l-0.010738,-1.980024c-0.009287,-1.712454 -0.047109,-1.979049 -0.283034,-1.883518c-0.181466,0.076229 -0.272876,-0.010522 -0.274134,-0.242417c-0.001258,-0.231895 0.125362,-0.360175 0.361771,-0.366516c0.200038,-0.005365 0.346101,0.097762 0.328496,0.205278zm7.856346,-0.15718c0.000967,0.178381 0.183304,0.262694 0.54701,0.252939c0.363706,-0.009754 0.545076,-0.103822 0.544108,-0.282202c-0.001741,-0.321085 0.470883,-0.369442 0.654381,-0.071072c0.073322,0.105077 0.001548,0.285409 -0.161443,0.414665c-0.253627,0.185209 -0.306151,0.561271 -0.298122,2.04183l0.009771,1.801644l-1.455115,-0.014497c-0.800251,0.003622 -1.455212,-0.032335 -1.455502,-0.085849c-0.000871,-0.160543 -1.262526,-1.393392 -1.426194,-1.389003c-0.072741,0.001951 -0.129619,-0.424699 -0.114239,-0.942491l-0.00503,-0.927579l1.236892,0.020349c1.327818,0.017911 2.199359,-0.255232 1.379859,-0.447342c-0.254885,-0.046686 -0.927838,-0.046479 -1.509478,0.022642c-0.563551,0.050795 -1.091119,0.029263 -1.146158,-0.058464l1.670243,-0.562174c1.236601,-0.033165 1.527857,0.012546 1.529017,0.226603zm-8.558316,4.868098c-0.090443,0.091629 -0.13165,-0.799299 -0.119753,-1.95926l0.024762,-2.141542l0.119753,1.95926c0.06036,1.06882 0.047399,2.032563 -0.024762,2.141542zm4.957625,-1.417487c-0.017798,0.07184 -0.016637,0.285897 -0.015573,0.482115c0.001451,0.267571 -0.125362,0.360175 -0.452698,0.368954c-0.527374,0.014144 -0.583188,-0.216288 -0.13107,-0.69227c0.289127,-0.346727 0.616076,-0.426858 0.599341,-0.158799zm1.073611,0.096091c0.511897,0.48581 0.458696,0.737006 -0.123621,0.68126c-0.3639,-0.025922 -0.510059,-0.146886 -0.529599,-0.396132c-0.022055,-0.713035 0.141323,-0.770938 0.65322,-0.285129zm-5.264551,1.836054c0.000774,0.142704 0.165119,0.263181 0.346972,0.258304c0.181853,-0.004877 0.381214,-0.135108 0.453182,-0.279764c0.07158,-0.216008 0.453182,-0.279764 1.744339,-0.314392l1.636678,-0.043895l0.002999,0.55298c0.002902,0.535142 -0.015186,0.553468 -0.761171,0.502112c-0.600309,-0.019581 -0.781968,0.020972 -0.780808,0.235029c0.001064,0.196219 0.219675,0.261718 0.81979,0.245624c0.600115,-0.016095 0.818726,0.049405 0.81979,0.245624c0.000967,0.178381 -0.180402,0.272448 -0.562294,0.28269c-0.836428,0.040273 -1.886629,0.906949 -1.882953,1.584796c0.003096,0.570818 0.276552,0.688369 0.4556,0.166188c0.125072,-0.413689 1.048073,-1.259114 1.484134,-1.342171c0.254401,-0.042504 0.345908,0.062086 0.384794,0.5249c0.057555,0.551517 0.039466,0.569842 -0.397562,0.474519c-0.418746,-0.077973 -0.473108,-0.040834 -0.470787,0.38728c0.001451,0.267571 -0.07042,0.430064 -0.179918,0.361638c-0.091217,-0.051076 -0.18195,-0.012961 -0.181369,0.094067c0.001645,0.303247 -1.163086,0.173918 -1.31031,-0.143265c-0.092087,-0.211618 -0.128458,-0.210643 -0.127104,0.03909c-0.016831,0.250221 -0.180112,0.325962 -0.834783,0.34352l-0.818339,0.021947l-0.010158,-1.872996c-0.008416,-1.551911 -0.064713,-1.871533 -0.282937,-1.86568c-0.145483,0.003902 -0.27365,-0.153227 -0.274714,-0.349445c-0.001258,-0.231895 0.125362,-0.360175 0.361771,-0.366516c0.200038,-0.005365 0.364383,0.115112 0.365157,0.257817zm8.001538,-0.214596c0.000774,0.142704 0.092378,0.265132 0.219675,0.261718c0.109112,-0.002926 0.364383,0.115112 0.547204,0.288615c0.274037,0.224579 0.330431,0.562039 0.337977,1.953408l0.009093,1.676777l-1.036853,-0.025714c-1.055038,-0.025227 -1.055038,-0.025227 -1.02157,-0.561344c0.068291,-0.822502 -1.009769,-1.739143 -2.010058,-1.730157c-0.563745,0.015119 -0.512091,-0.521486 0.051557,-0.554443c1.018184,-0.062988 1.29077,-0.10598 1.198973,-0.264084c-0.05504,-0.087727 0.235538,-0.166883 0.635615,-0.177613c0.418165,-0.029056 0.799767,-0.092812 0.854033,-0.147789c0.180982,-0.16542 -0.311279,-0.384146 -0.747533,-0.336765c-0.218127,0.023691 -0.545269,0.068146 -0.70884,0.090373c-0.181853,0.004877 -0.326658,0.133645 -0.325981,0.258512c0.002225,0.410275 -1.308762,0.142144 -1.383728,-0.26618c-0.037435,-0.195243 -0.02041,-0.409788 0.033662,-0.500441c0.054169,-0.072815 0.817565,-0.164652 1.726831,-0.189038c1.309343,-0.035116 1.618783,0.010107 1.619944,0.224164zm1.546235,0.047734c0.000774,0.142704 -0.143935,0.289311 -0.307409,0.329376c-0.236216,0.042016 -0.327626,-0.044735 -0.329077,-0.312306c-0.001451,-0.267571 0.088992,-0.3592 0.325594,-0.329864c0.163861,0.031287 0.310118,0.170089 0.310892,0.312794zm-10.222079,3.271379c0.040143,0.694709 0.006965,1.28434 -0.065776,1.286291c-0.090927,0.002439 -0.131747,-0.817137 -0.119076,-1.834394c0.007931,-1.891322 0.100018,-1.679704 0.184852,0.548103zm6.471069,-0.708769c1.023795,0.971619 1.209421,1.662426 0.463339,1.593232c-0.345714,-0.026409 -0.528341,-0.164237 -0.602824,-0.483371c-0.074289,-0.283458 -0.238828,-0.439611 -0.438866,-0.434246c-0.290965,0.007803 -0.60234,-0.394181 -0.641129,-0.839157c-0.037822,-0.266595 0.908685,-0.131414 1.21948,0.163542zm-1.485101,1.163791c0.165216,0.281019 -0.215031,0.594509 -0.561326,0.461071c-0.255078,-0.082362 -0.27365,-0.153227 -0.092958,-0.372161c0.271038,-0.328401 0.47098,-0.351604 0.654284,-0.08891zm0.946797,0.188695c0.037531,0.213081 -0.052911,0.30471 -0.307506,0.311538c-0.218224,0.005853 -0.382472,-0.096786 -0.383149,-0.221653c-0.002999,-0.55298 0.578641,-0.622101 0.690655,-0.089885zm-25.01012,13.105689l1.854902,-0.049747l-0.029696,1.231801c-0.014606,0.660496 0.025247,1.301691 0.098666,1.424606c0.073322,0.105077 0.001354,0.249733 -0.198297,0.32645c-0.471851,0.191061 -1.322304,0.998859 -1.320756,1.284267c0.001451,0.267571 -0.089475,0.270009 -0.672179,0.142912c-0.473495,-0.112186 -0.585219,-0.590887 -0.148772,-0.602592c0.145483,-0.003902 0.272296,-0.096506 0.271716,-0.203534c-0.001548,-0.285409 0.812825,-1.038717 1.19433,-1.120311c0.52689,-0.103334 0.50648,-0.513122 -0.002709,-0.499466c-0.672857,0.018046 -1.667922,0.990287 -1.863607,1.798365c-0.088798,0.394876 -0.2692,0.667324 -0.414683,0.671226c-0.218224,0.005853 -0.274231,-0.260255 -0.278971,-1.13432c-0.022152,-0.730873 -0.097311,-1.174873 -0.243084,-1.224486c-0.163958,-0.049125 -0.216579,0.3091 -0.211646,1.218841c0.006095,1.123798 -0.029502,1.267478 -0.302572,1.221279c-0.291255,-0.045711 -0.310408,-0.223604 -0.26214,-1.384541c0.032017,-0.803688 0.137937,-1.39527 0.282742,-1.524038c0.307893,-0.240186 0.138227,-1.341756 -0.207294,-1.332489c-0.30915,0.008291 -0.348133,-0.472361 -0.021378,-0.588168c0.108822,-0.05644 0.309344,0.027385 0.419133,0.149325c0.14645,0.174479 0.692396,0.2312 2.056295,0.194621zm3.291155,-0.159629c0.001354,0.249733 -0.380054,0.349165 -0.599438,0.140961c-0.164538,-0.156153 0.23312,-0.612834 0.433836,-0.493333c0.091217,0.051076 0.164829,0.209667 0.165603,0.352372zm3.914292,0.715691c-0.034049,0.429089 -0.067808,0.911692 -0.066937,1.072234c-0.016831,0.250221 -0.143935,0.289311 -0.653607,0.213776c-0.418649,-0.060135 -0.636679,-0.018606 -0.635906,0.124098c0.00058,0.107028 -0.126233,0.199633 -0.271716,0.203534c-0.163668,0.004389 -0.344747,0.151971 -0.398432,0.313977c-0.071774,0.180331 -0.179918,0.361638 -0.252369,0.417103c-0.126814,0.092604 -0.215612,0.48748 -0.177306,0.843266c0.038402,0.373624 0.346972,0.258304 0.490133,-0.173711c0.178661,-0.593533 0.920776,-1.2557 1.466142,-1.306007c0.545366,-0.050308 0.783903,0.335789 0.293867,0.527338c-0.453665,0.190574 -0.779163,0.538276 -0.777422,0.859361c0.002032,0.374599 0.183788,0.351884 0.472625,-0.048357c0.180596,-0.236772 0.271425,-0.257049 0.454149,-0.101383c0.109692,0.104102 0.165409,0.316696 0.129716,0.442537c-0.071774,0.180331 -0.526116,0.246039 -1.799185,0.262341l-1.709516,0.028007l0.031147,-0.964231c0.033468,-0.536117 -0.006191,-1.141636 -0.043819,-1.372555c-0.148868,-0.62043 -0.492455,-0.254403 -0.452021,0.493821c0.080771,1.478608 0.010738,1.980024 -0.262042,1.98734c-0.218224,0.005853 -0.274424,-0.295931 -0.281583,-1.615948c-0.004837,-0.891903 0.064228,-1.5717 0.155445,-1.520624c0.18253,0.119989 0.380344,-0.295651 0.377635,-0.795117c-0.002418,-0.445951 0.215515,-0.505318 2.215803,-0.576805l1.745693,-0.064659l-0.050493,0.750662zm-4.691811,0.125831c-0.053782,0.144168 -0.108628,0.092117 -0.109692,-0.104102c-0.019249,-0.195731 0.034726,-0.304222 0.089669,-0.234333c0.054846,0.052051 0.073902,0.212106 0.020023,0.338435zm-0.582799,3.209107c0.002418,0.445951 -0.396594,0.6529 -0.925033,0.470825c-0.236893,-0.08285 -0.219191,-0.172528 0.14258,-0.539043c0.524569,-0.531448 0.779357,-0.502599 0.782452,0.068218zm-3.879565,2.334129c0.00416,0.767037 0.0799,1.318065 0.189012,1.315139c0.181853,-0.004877 0.26833,-0.827866 0.170922,-2.020578c-0.039563,-0.58768 0.014509,-0.678334 0.305764,-0.632623c0.218417,0.029824 0.310214,0.187927 0.275295,0.456474c-0.03521,0.215032 0.038499,0.391462 0.129425,0.389023c0.109112,-0.002926 0.200619,0.101663 0.201296,0.22653c0.002709,0.499466 1.463338,1.530732 2.191041,1.564737c0.200135,0.012473 0.274037,0.224579 0.277133,0.795397l0.00416,0.767037l-1.909264,0.086886c-1.509284,0.058319 -1.909071,0.122563 -1.908007,0.318781c0.000774,0.142704 -0.144031,0.271473 -0.307506,0.311538c-0.218127,0.023691 -0.327723,-0.062573 -0.32898,-0.294468c-0.000967,-0.178381 0.125459,-0.342337 0.270942,-0.346239c0.145483,-0.003902 0.290191,-0.150508 0.289224,-0.328889c0.033565,-0.518279 -0.06007,-1.015306 -0.206036,-1.100595c-0.218998,-0.136852 -0.324532,-2.82796 -0.106792,-2.923003c0.381214,-0.135108 0.45531,0.112673 0.462372,1.414852zm5.274225,-0.052248c0.00416,0.767037 0.080384,1.407256 0.17131,1.404817c0.290965,-0.007803 0.378699,-0.598898 0.281485,-1.755933l-0.096924,-1.103521l1.091216,-0.011425c0.600212,0.001743 1.091602,0.059927 1.092086,0.149118c0.000484,0.08919 0.218611,0.0655 0.472721,-0.030519c0.74405,-0.305405 0.980846,-0.240393 0.983458,0.241234c0.002805,0.517304 -0.305958,0.596947 -0.635712,0.159775c-0.128168,-0.157129 -0.310408,-0.223604 -0.437221,-0.130999c-0.271909,0.167858 0.441768,0.969388 0.86003,0.95817c0.181853,-0.004877 0.237086,0.118526 0.147611,0.388536c-0.053298,0.233358 -0.106597,0.466716 -0.10621,0.538068c0.001451,0.267571 -0.362932,0.152459 -0.364383,-0.115112c-0.000774,-0.142704 -0.146934,-0.263669 -0.346972,-0.258304c-0.363706,0.009754 -1.296575,-0.964303 -1.298703,-1.356741c-0.000677,-0.124866 -0.110273,-0.21113 -0.219094,-0.15469c-0.127104,0.03909 -0.216869,0.255585 -0.179241,0.486505c0.075256,0.461839 1.118204,1.611351 1.3905,1.514845c0.108918,-0.038602 0.40027,0.024946 0.637357,0.143472c0.364674,0.168626 0.456761,0.380244 0.496227,0.950087l0.04024,0.712547l-1.964014,0.052673c-1.800346,0.048284 -1.96382,0.08835 -2.053006,0.411873c-0.053298,0.233358 -0.180112,0.325962 -0.380537,0.259975c-0.400948,-0.149813 -0.366705,-0.543225 0.069162,-0.661959c0.435867,-0.118734 0.48665,-0.815881 0.085799,-0.947856c-0.218707,-0.083338 -0.275198,-0.438636 -0.281776,-1.651624c-0.004643,-0.856227 0.045753,-1.624726 0.100018,-1.679704c0.307603,-0.2937 0.437415,0.166675 0.444574,1.486692zm-2.916035,-1.099277c0.000774,0.142704 0.074192,0.26562 0.146934,0.263669c0.090927,-0.002439 0.273844,0.188903 0.402495,0.435222c0.128652,0.246319 0.38431,0.435709 0.547978,0.43132c0.418262,-0.011218 0.509866,0.11121 0.403463,0.613602c-0.088315,0.484066 -0.578544,0.639939 -0.580963,0.193988c-0.000774,-0.142704 -0.110563,-0.264645 -0.23786,-0.261231c-0.290965,0.007803 -1.222382,-0.698683 -1.22364,-0.930578c-0.000387,-0.071352 -0.128652,-0.246319 -0.274908,-0.385122c-0.420487,-0.399058 -0.330625,-0.597715 0.269491,-0.61381c0.363706,-0.009754 0.546043,0.074559 0.54701,0.252939zm1.309826,0.054075c0.310601,0.25928 0.347746,0.401009 0.184949,0.565941c-0.144709,0.146606 -0.308667,0.097481 -0.655929,-0.214337c-0.420487,-0.399058 -0.476591,-0.683004 -0.094699,-0.693246c0.090927,-0.002439 0.364577,0.150788 0.565679,0.341642zm0.83788,3.581341c-0.053782,0.144168 -0.108628,0.092117 -0.109692,-0.104102c-0.019249,-0.195731 0.034726,-0.304222 0.089669,-0.234333c0.054846,0.052051 0.073902,0.212106 0.020023,0.338435zm-0.123137,0.770451c0.000871,0.160543 -0.162217,0.27196 -0.398626,0.278301c-0.381892,0.010242 -0.381892,0.010242 -0.037822,-0.266595c0.434706,-0.33279 0.434706,-0.33279 0.436448,-0.011705zm5.092371,-0.047371c0.000484,0.08919 -0.144515,0.182282 -0.308183,0.186672c-0.27278,0.007316 -0.291158,-0.027873 -0.055523,-0.176917c0.34436,-0.223323 0.362545,-0.223811 0.363706,-0.009754z M35.185204,8.684044c0.055233,0.123403 0.23786,0.261231 0.438092,0.291542c0.400464,0.060622 0.748113,0.443793 1.006287,1.096973c0.11066,0.282483 0.275198,0.438636 0.365835,0.382683c0.217547,-0.130719 0.194815,-0.96862 -0.023409,-0.962767c-0.090927,0.002439 -0.182434,-0.102151 -0.183207,-0.244856c-0.000677,-0.124866 -0.20207,-0.369234 -0.457535,-0.522949c-0.529212,-0.324779 -1.238633,-0.341434 -1.146062,-0.040626z M31.295193,12.445705c-0.163474,0.040066 -0.271909,0.167858 -0.216869,0.255585c0.146643,0.210155 1.310503,0.178941 1.454728,-0.056855c0.053976,-0.108492 -0.000967,-0.178381 -0.164635,-0.173991c-0.145483,0.003902 -0.3639,-0.025922 -0.509576,-0.057696c-0.127491,-0.032262 -0.382085,-0.025434 -0.563648,0.032957z M33.185591,2.172311c-0.053685,0.162006 -0.271232,0.292725 -0.453085,0.297602c-0.181853,0.004877 -0.345134,0.080619 -0.344554,0.187647c0.000484,0.08919 -0.12633,0.181795 -0.271812,0.185696c-0.163668,0.004389 -0.326658,0.133645 -0.380441,0.277813c-0.071967,0.144655 -0.234958,0.273911 -0.362255,0.277325c-0.145483,0.003902 -0.363319,0.081107 -0.490036,0.191549c-1.32182,1.088049 -1.321917,1.070211 -0.975719,1.185811c0.200522,0.083825 0.45473,0.005645 0.653801,-0.1781c0.180982,-0.16542 0.416714,-0.296626 0.525826,-0.299553c0.127297,-0.003414 0.217837,-0.077205 0.217353,-0.166395c-0.000484,-0.08919 0.198878,-0.219422 0.453182,-0.279764c0.254207,-0.07818 0.453569,-0.208412 0.453085,-0.297602c-0.00058,-0.107028 0.1627,-0.18277 0.362739,-0.188135c0.200038,-0.005365 0.417585,-0.136084 0.471367,-0.280252c0.071967,-0.144655 0.271329,-0.274887 0.453182,-0.279764c0.254594,-0.006828 0.326755,-0.115807 0.288837,-0.400241c-0.093539,-0.479189 -0.458019,-0.612139 -0.60147,-0.233638z',
                "strokeColor": '#fefe99',
                "strokeOpacity": 1,
                "strokeWeight": 1,
                "fillColor": 'red',
                "fillOpacity": 1,
                "anchor": { x : 35, y : 34 },
                "rotation": arrow_heading,
                "scale": 1.0
            };

            var Double180Degree = {
                "path": 'M18.1,5.099999c-5.9,4.2 -5.4,5.1 0.9,1.9c2.2,-1.1 4.1,-2 4.2,-2c0.2,0 0.3,1.6 0.3,3.5l0,3.5l-6.5,0l-6.5,0l0,13l0,13l6.2,0l6.2,0l0.3,11.5l0.3,11.5l-6.5,0l-6.5,0l0,13l0,13l6.5,0l6.5,0l-0.2,3.7c-0.1,2.1 -0.2,3.9 -0.2,4.1c-0.1,0.2 -1.6,-0.8 -3.4,-2.1c-4.5,-3.4 -5.7,-4 -5.7,-2.8c0,0.5 2.2,2.6 5,4.6l5,3.6l4.7,-3.3c2.7,-1.8 5,-3.4 5.2,-3.5c0.1,-0.1 0.1,-0.7 -0.1,-1.3c-0.2,-0.7 -2.1,0.1 -4.6,1.9l-4.2,3.1l0,-4l0,-4l6,0l6,0l0,-13l0,-13l-6,0l-6,0l0,-11.5l0,-11.5l6,0l6,0l0,-13l0,-13l-6,0l-6,0l0,-3.6c0,-3.7 0.1,-3.7 5.2,-0.2c1.5,1 2.9,1.5 3.2,1c0.2,-0.4 -1.5,-2 -4,-3.6c-2.4,-1.5 -4.4,-3.2 -4.4,-3.7c0,-1.5 -1.2,-0.9 -6.9,3.2zm0.3,9.9c0.8,-0.6 2.5,-1 3.8,-0.8l2.3,0.5l-2.5,1.1l-2.5,1.1l2.5,0.2c2.1,0.1 2.2,0.2 0.5,0.6c-2.6,0.7 -5.5,3.3 -5.5,5c0,0.7 -0.7,1.3 -1.5,1.3c-1.1,0 -1.5,-1.2 -1.5,-5.1c0,-4.5 0.2,-5 1.5,-3.9c1.2,1 1.8,1 2.9,0zm10.4,0.2c0.8,0.8 1.5,0.8 2.6,-0.2c1.8,-1.4 2.2,-0.7 2.8,5.2c0.4,3.4 0.1,3.8 -1.8,3.8c-1.5,0 -2.4,-0.8 -2.8,-2.4c-0.3,-1.4 -1.6,-2.8 -2.7,-3.1c-1.7,-0.6 -1.9,-0.9 -0.8,-1.6c1,-0.6 1.1,-0.9 0.2,-0.9c-0.7,0 -1.3,-0.5 -1.3,-1c0,-1.4 2.3,-1.3 3.8,0.2zm-4.8,4.8c0,0.5 -0.7,1 -1.5,1c-0.8,0 -1.5,0.4 -1.5,1c0,0.5 0.7,0.6 1.7,0.3c1,-0.4 1.4,-0.2 1,0.4c-0.7,1.1 -5.7,1.5 -5.7,0.5c0,-0.3 0.7,-1.4 1.7,-2.4c1.7,-1.9 4.3,-2.4 4.3,-0.8zm3.4,0.6c2.2,2.1 2,3.4 -0.4,3.4c-1.1,0 -2,-0.5 -2,-1.1c0,-0.5 0.6,-0.7 1.3,-0.3c1,0.6 1,0.4 0,-0.7c-2.5,-2.6 -1.4,-3.9 1.1,-1.3zm-3.8,6.1c-1,1.1 -5.6,1.1 -5.6,0.1c0,-0.4 1.4,-0.8 3.2,-0.8c1.7,0 2.8,0.3 2.4,0.7zm7.7,0.2c2,0.8 2.6,1.8 2.9,5c0.3,3.6 0.1,4.1 -1.7,4.1c-1.1,0 -2.5,-1 -3,-2.2c-0.6,-1.2 -1.7,-2.4 -2.5,-2.6c-1.1,-0.4 -1,0.1 0.4,1.7c1.1,1.1 1.6,2.4 1.2,2.8c-0.9,0.9 -3,-2.4 -3.2,-5c-0.1,-1.2 0.6,-1.7 2.5,-1.7c1.9,0 2.2,-0.3 1.2,-0.9c-0.8,-0.5 -2,-0.7 -2.8,-0.4c-0.7,0.3 -1.3,0 -1.3,-0.6c0,-1.3 3,-1.4 6.3,-0.2zm-13.8,1.1c0.3,0.5 2.1,1 3.8,1l3.2,0.1l-3.3,1.4c-1.9,0.8 -3.6,2.4 -3.9,3.5c-1,4 -3.3,2.2 -3.3,-2.5c0,-3.3 0.4,-4.5 1.4,-4.5c0.8,0 1.8,0.4 2.1,1zm6.5,3.7c-0.1,1.3 -5.1,4.5 -5.8,3.8c-0.4,-0.4 0.4,-1.5 1.7,-2.6c2.4,-2 4.1,-2.5 4.1,-1.2zm1,3.3c1.2,0.8 0.9,1 -1.3,1c-1.6,0 -2.6,-0.4 -2.2,-1c0.8,-1.2 1.6,-1.2 3.5,0zm-8,29.2c0,1.5 3,4.8 4.3,4.8c0.6,0 0,-1.1 -1.3,-2.5c-1.3,-1.4 -2,-2.8 -1.6,-3.2c1,-1 4.9,3.3 5.1,5.7c0.1,1.6 -0.4,2 -2.6,2c-1.5,0 -3.8,0.4 -5.1,0.9c-2.2,0.8 -2.3,0.7 -2,-4c0.3,-3.4 0.8,-4.9 1.8,-4.9c0.8,0 1.4,0.5 1.4,1.2zm9,-0.4c0,1.1 -3.9,1.2 -4.5,0.1c-0.4,-0.5 0.5,-0.9 1.9,-0.9c1.4,0 2.6,0.4 2.6,0.8zm3,0.1c0,1.2 -3.1,4.3 -3.7,3.7c-0.6,-0.6 2,-4.6 2.9,-4.6c0.5,0 0.8,0.4 0.8,0.9zm5,3.1c0,5.1 -1.8,6.1 -10.7,5.8l-6.8,-0.2l7,-0.6c3.9,-0.4 5.8,-0.7 4.3,-0.8c-2.9,-0.2 -4,-2.2 -1.2,-2.2c0.9,0 2.1,-1.4 2.7,-3c0.7,-1.8 1.9,-3 2.9,-3c1.4,0 1.8,0.8 1.8,4zm-16.3,11c0.7,1.8 1.8,3 2.9,3c1.6,0 1.5,-0.3 -0.4,-2.3c-1.2,-1.3 -2.2,-2.6 -2.2,-2.9c0,-1 5,-0.6 5.7,0.5c0.4,0.6 0,0.8 -1,0.4c-1,-0.3 -1.7,-0.2 -1.7,0.2c0,0.5 0.6,1.1 1.2,1.3c2.3,0.8 1.4,4.3 -1.2,4.9c-1.7,0.5 -0.9,0.7 2.5,0.7c2.8,0 4.2,-0.2 3.3,-0.5c-2.1,-0.5 -2.4,-4.3 -0.5,-6.2c1,-1.1 1,-1.3 0,-0.7c-0.7,0.4 -1.3,0.2 -1.3,-0.3c0,-0.6 0.9,-1.1 2,-1.1c2.4,0 2.6,1.7 0.3,4.2c-0.9,1 -1.2,1.8 -0.7,1.8c1.6,0 3.4,-2.3 3.4,-4.2c0,-1.2 0.8,-1.8 2.4,-1.8c2,0 2.3,0.4 1.9,2.7c-1.1,7.1 -1.2,7.4 -3.3,6.3c-1.4,-0.8 -2,-0.8 -2,0c0,0.7 -2.7,1 -7.5,0.8l-7.5,-0.2l0,-4.8c0,-5.6 1.9,-6.5 3.7,-1.8z',
                "strokeColor": 'red',
                "strokeOpacity": 1,
                "strokeWeight": 0.5,
                "fillColor": '#fefe99',
                "fillOpacity": 1,
                "anchor": { x : 23, y : 50 },
                "rotation": arrow_heading,
                "scale": 0.5
            };

            var Triple90Degree = {
                "path": 'M7.845,5.834439c-3.9245,2.687815 -4.342,4.189829 -0.501,2.055388c1.67,-0.948641 3.2565,-1.739174 3.507,-1.739174c0.167,0 0.334,1.027694 0.334,2.371601c0,2.371601 -0.0835,2.371601 -4.5925,2.371601l-4.5925,0l0,8.300604l0,8.300604l4.5925,0l4.5925,0l0,15.415408l0,15.415408l-4.5925,0l-4.5925,0l0,8.300604l0,8.300604l4.5925,0c4.509,0 4.5925,0 4.5925,2.371601c0,2.845922 -0.2505,2.845922 -3.507,0.71148c-3.7575,-2.608761 -3.674,-1.185801 0.167,1.660121l3.4235,2.529708l3.507,-2.213495c1.9205,-1.264854 3.674,-2.371601 3.841,-2.450655c0.167,-0.158107 0.167,-0.395267 -0.0835,-0.632427c-0.2505,-0.23716 -1.837,0.316214 -3.507,1.264854l-3.006,1.660121l0,-2.450655c0,-2.450655 0.0835,-2.450655 4.175,-2.450655l4.175,0l0,-8.300604l0,-8.300604l-4.175,0l-4.175,0l0,-7.510071l0,-7.510071l7.9325,0l7.9325,0l0,4.110776l0,4.189829l8.7675,0l8.7675,0l0,-4.189829c0,-4.031722 0,-4.110776 2.5885,-4.110776l2.5885,0l-1.837,2.845922c-1.002,1.502014 -1.67,2.924975 -1.503,3.162135c0.501,0.395267 4.843,-5.61279 4.843,-6.56143c0,-1.106747 -4.2585,-6.719537 -4.7595,-6.245217c-0.2505,0.23716 0.4175,1.660121 1.4195,3.162135l1.837,2.845922l-2.5885,0c-2.505,0 -2.5885,-0.079053 -2.5885,-3.952669l0,-3.952669l-8.7675,0l-8.7675,0l0,3.952669l0,3.952669l-7.9325,0l-7.9325,0l0.0835,-11.541793c0.0835,-11.462739 0.0835,-11.541793 1.837,-11.067473c1.002,0.23716 2.505,0.47432 3.34,0.47432c1.0855,0 1.4195,0.632427 1.4195,2.766868c0,3.162135 -1.837,3.794562 -3.34,1.185801c-0.501,-0.869587 -1.336,-1.581068 -1.837,-1.581068c-0.7515,0 -0.7515,0.23716 0,0.948641c1.2525,1.185801 1.336,2.529708 0.167,1.818228c-0.4175,-0.23716 -0.835,0.079053 -0.835,0.790534c0,1.027694 0.7515,1.264854 3.5905,1.027694l3.507,-0.23716l0.2505,-8.142498l0.2505,-8.063444l-4.2585,0c-4.0915,0 -4.175,0 -4.175,-2.450655l0,-2.450655l2.9225,1.739174c1.5865,0.948641 2.9225,1.422961 2.9225,1.027694c0,-0.553374 -6.179,-5.059416 -6.847,-4.901309c-0.0835,0 -1.5865,0.948641 -3.173,1.976334zm2.0875,7.431017c-1.4195,0.553374 -1.4195,0.71148 -0.167,0.71148c1.5865,0.079053 2.004,2.450655 0.4175,2.529708c-0.835,0 -0.835,0.158107 0,0.47432c2.004,0.790534 0.9185,1.581068 -2.338,1.660121c-3.34,0.158107 -3.34,0.158107 -3.34,-2.845922c0,-3.004028 0,-3.004028 3.5905,-3.083082c2.5885,-0.079053 3.0895,0.079053 1.837,0.553374zm8.7675,2.450655c0,3.083082 0,3.083082 -3.34,3.083082c-1.837,0 -3.34,-0.395267 -3.34,-0.869587c0,-0.395267 0.4175,-0.553374 0.9185,-0.316214c0.501,0.316214 0.4175,-0.23716 -0.2505,-1.185801c-0.9185,-1.502014 -0.9185,-1.818228 0.0835,-2.213495c0.835,-0.23716 0.835,-0.47432 0.0835,-0.948641c-0.501,-0.316214 0.5845,-0.553374 2.4215,-0.553374c3.4235,0 3.4235,0 3.4235,3.004028zm-7.515,5.84995c0,1.106747 -0.7515,2.687815 -1.67,3.557402c-1.2525,1.185801 -1.67,1.264854 -1.67,0.395267c0,-0.553374 0.668,-1.502014 1.503,-1.897281c0.7515,-0.47432 1.002,-0.869587 0.4175,-0.869587c-0.501,0 -1.503,0.632427 -2.0875,1.422961c-2.2545,2.924975 -3.173,2.766868 -3.173,-0.553374c0,-3.241188 0,-3.241188 5.678,-3.952669c0.5845,0 1.002,0.790534 1.002,1.897281zm23.797499,14.782981c-1.4195,6.245217 -1.336,6.08711 -4.0915,6.008057c-1.4195,-0.079053 -2.0875,-0.23716 -1.4195,-0.47432c0.9185,-0.316214 0.9185,-0.47432 0,-1.027694c-0.5845,-0.316214 -0.835,-0.869587 -0.501,-1.185801c0.334,-0.316214 1.4195,0.079053 2.338,0.948641c1.336,1.106747 1.7535,1.185801 1.4195,0.316214c-0.167,-0.632427 -1.169,-1.502014 -2.171,-1.976334c-2.839,-1.185801 -2.171,-2.608761 1.336,-3.004028c1.67,-0.158107 3.173,-0.316214 3.2565,-0.395267c0.0835,-0.079053 0,0.316214 -0.167,0.790534zm1.837,3.162135c-0.167,1.027694 -0.334,0.395267 -0.334,-1.343907c-0.0835,-1.739174 0.0835,-2.529708 0.334,-1.818228c0.167,0.790534 0.167,2.213495 0,3.162135zm6.346,-2.766868c0.167,0.395267 -0.0835,1.897281 -0.7515,3.399295c-0.5845,1.502014 -1.0855,2.134441 -1.0855,1.422961c-0.0835,-0.790534 -0.835,-1.818228 -1.7535,-2.371601c-2.4215,-1.502014 -2.0875,-3.004028 0.7515,-3.004028c1.4195,0 2.672,0.23716 2.839,0.553374zm1.0855,5.61279c-1.002,0.869587 -1.503,-0.553374 -0.835,-2.371601l0.668,-1.818228l0.334,1.818228c0.167,1.027694 0.0835,2.055388 -0.167,2.371601zm-9.1015,-0.47432c-0.2505,0.553374 -0.4175,0.158107 -0.4175,-0.948641c0,-1.106747 0.167,-1.502014 0.4175,-1.027694c0.167,0.553374 0.167,1.502014 0,1.976334zm5.2605,-0.079053c0,1.502014 -2.171,0.632427 -2.2545,-0.948641c-0.167,-1.343907 0.0835,-1.422961 1.0855,-0.71148c0.668,0.553374 1.169,1.264854 1.169,1.660121zm-6.5965,3.320242c0.0835,1.660121 0.167,1.581068 0.7515,-0.23716c0.5845,-1.660121 0.7515,-1.422961 0.5845,1.185801c-0.2505,3.004028 -0.334,3.162135 -3.34,3.399295c-3.507,0.316214 -4.2585,-1.343907 -1.2525,-2.608761c1.002,-0.47432 2.004,-1.343907 2.171,-1.976334c0.334,-0.948641 0.0835,-0.869587 -1.2525,0.158107c-1.9205,1.660121 -3.34,1.897281 -2.004,0.316214c0.7515,-0.869587 0.7515,-1.185801 -0.0835,-1.422961c-0.5845,-0.23716 0.167,-0.395267 1.67,-0.47432c2.171,0 2.672,0.23716 2.7555,1.660121zm6.5965,-1.106747c0,0.395267 -0.501,1.106747 -1.169,1.660121c-1.002,0.71148 -1.2525,0.632427 -1.0855,-0.71148c0.0835,-1.581068 2.2545,-2.450655 2.2545,-0.948641zm2.9225,3.636455l1.002,2.371601l-3.2565,-0.23716c-3.507,-0.316214 -4.2585,-1.897281 -1.503,-3.320242c0.9185,-0.47432 1.67,-1.422961 1.7535,-2.213495c0,-1.106747 0.167,-1.106747 0.501,-0.158107c0.2505,0.632427 0.9185,2.292548 1.503,3.557402zm1.2525,-2.213495c0,1.739174 -0.167,1.976334 -0.835,1.027694c-1.0855,-1.581068 -1.0855,-3.162135 0,-3.162135c0.501,0 0.835,0.948641 0.835,2.134441zm-7.7655,3.952669c-0.167,1.264854 -0.334,0.395267 -0.334,-1.739174c0,-2.213495 0.167,-3.162135 0.334,-2.213495c0.167,1.027694 0.167,2.766868 0,3.952669zm-29.642499,11.462739c0.167,0.948641 0.7515,1.818228 1.336,2.055388c0.9185,0.23716 1.002,0 0.2505,-1.264854c-1.336,-2.450655 -1.0855,-2.687815 0.7515,-0.948641c2.0875,1.976334 2.171,3.162135 0.2505,3.241188c-1.2525,0 -1.2525,0.158107 0.167,0.71148c1.2525,0.47432 0.7515,0.632427 -1.837,0.553374c-3.5905,-0.079053 -3.5905,-0.079053 -3.5905,-3.083082c0,-3.320242 2.171,-4.347936 2.672,-1.264854zm4.008,-0.948641c0,0.395267 -0.167,0.790534 -0.334,0.790534c-0.2505,0 -0.668,-0.395267 -0.9185,-0.790534c-0.2505,-0.47432 -0.0835,-0.790534 0.334,-0.790534c0.501,0 0.9185,0.316214 0.9185,0.790534zm3.173,-0.158107c1.169,-0.869587 1.169,-0.71148 -0.0835,1.106747c-0.835,1.264854 -1.0855,2.213495 -0.5845,2.213495c0.501,0 1.336,-0.869587 1.837,-1.976334c1.503,-3.083082 3.34,-2.529708 3.006,0.948641c-0.2505,2.845922 -0.4175,2.924975 -3.5905,3.162135c-2.338,0.079053 -2.9225,-0.079053 -2.0875,-0.553374c0.7515,-0.47432 0.835,-0.790534 0.2505,-0.790534c-0.5845,0 -0.9185,-1.106747 -0.9185,-2.608761c0.0835,-1.343907 0.2505,-2.055388 0.501,-1.502014c0.2505,0.790534 0.5845,0.790534 1.67,0zm-6.2625,7.03575c-1.0855,0.158107 -2.7555,0.158107 -3.7575,0c-1.0855,-0.158107 -0.2505,-0.316214 1.837,-0.316214c2.0875,0 2.9225,0.158107 1.9205,0.316214zm10.02,0c-1.0855,0.158107 -2.7555,0.158107 -3.7575,0c-1.0855,-0.158107 -0.2505,-0.316214 1.837,-0.316214c2.0875,0 2.9225,0.158107 1.9205,0.316214zm-10.855,2.608761c0.2505,0.869587 1.0855,1.581068 2.004,1.581068c1.4195,-0.079053 1.4195,-0.079053 0.0835,-0.869587c-0.835,-0.395267 -1.503,-1.185801 -1.503,-1.660121c0,-0.47432 0.5845,-0.395267 1.4195,0.23716c0.9185,0.790534 1.169,0.790534 0.7515,0.079053c-0.334,-0.47432 -0.167,-0.948641 0.2505,-0.948641c0.501,0 0.9185,1.027694 0.9185,2.371601c0,2.055388 -0.334,2.371601 -2.2545,2.450655l-2.338,0.079053l2.505,0.632427c2.171,0.553374 2.004,0.632427 -1.2525,0.47432l-3.7575,-0.079053l0.334,-3.004028c0.2505,-3.162135 2.0875,-4.031722 2.839,-1.343907zm11.4395,1.027694c0,2.845922 -1.4195,3.794562 -5.4275,3.636455c-1.0855,-0.079053 -0.835,-0.316214 0.835,-0.71148l2.505,-0.632427l-2.2545,-0.079053c-2.004,-0.079053 -2.338,-0.395267 -2.338,-2.292548c0,-2.055388 0.2505,-2.213495 3.34,-2.371601c3.2565,-0.23716 3.34,-0.158107 3.34,2.450655z M7.2605,16.032325c-0.7515,1.897281 0.0835,2.134441 1.2525,0.395267c0.668,-1.027694 0.668,-1.581068 0.167,-1.581068c-0.501,0 -1.0855,0.553374 -1.4195,1.185801z M13.857,16.427591c0.5845,0.869587 1.336,1.581068 1.7535,1.581068c0.334,0 0.2505,-0.71148 -0.2505,-1.581068c-0.501,-0.869587 -1.2525,-1.581068 -1.67,-1.581068c-0.501,0 -0.4175,0.71148 0.167,1.581068z M13.69,69.78862c-0.668,0.71148 -0.668,1.185801 -0.167,1.185801c1.002,0 2.171,-1.502014 1.5865,-2.055388c-0.167,-0.158107 -0.835,0.158107 -1.4195,0.869587z',
                "strokeColor": 'red',
                "strokeOpacity": 1,
                "strokeWeight": 1,
                "fillColor": '#fefe99',
                "fillOpacity": 1,
                "anchor": { x : 10, y : 44 },
                "rotation": arrow_heading,
                "scale": 0.7
            };

            var Triple120Degree = {
                "path": 'M7.6,9.599999c-1.6,3 -2.6,5.7 -2.3,6c0.3,0.3 1.5,-1.2 2.6,-3.4c1.1,-2.3 2.5,-4.3 3,-4.6c0.8,-0.5 3.8,5.1 3,5.8c-0.2,0.1 -2.2,1.3 -4.4,2.6c-2.2,1.3 -4.1,2.4 -4.3,2.5c-0.2,0.2 10.3,18.3 11.2,19.2c0.3,0.3 5,-2 10.5,-5.1l9.9,-5.7l-5.5,-9.7c-3.1,-5.3 -5.7,-9.8 -5.8,-10c-0.1,-0.1 -2.3,1 -4.9,2.4c-4.6,2.5 -4.8,2.6 -6.1,0.8c-2.2,-2.9 -1.8,-3.4 2.5,-3.4c2.2,0 4,-0.5 4,-1.1c0,-0.6 -1.7,-0.9 -4.3,-0.8c-2.4,0.2 -4.7,0 -5.3,-0.3c-0.5,-0.4 -2.2,1.8 -3.8,4.8zm19.8,5.4c2.8,4.3 1.9,5.3 -2.2,2.4c-1.3,-0.9 -3.4,-1.4 -4.8,-1.1c-1.3,0.2 -2.4,0.3 -2.4,0.1c0,-0.1 -0.3,-0.9 -0.6,-1.7c-0.3,-0.8 0.2,-1.7 1.2,-2.1c1.4,-0.5 1.5,-0.4 0.4,0.9c-1.9,2.3 0.4,1.8 2.5,-0.5c2.5,-2.7 2.8,-2.6 5.9,2zm-9,6c0.6,1.9 0.5,2.1 -0.3,1c-0.9,-1.2 -1.1,-1.1 -1.1,0.8c0,1.8 0.4,2.2 1.9,1.7c2.1,-0.6 3.7,2.1 2.2,3.9c-0.5,0.6 -1.1,2.4 -1.3,4c-0.4,4.2 -2.1,4.2 -4.1,0.1c-1.6,-3.4 -1.6,-3.6 0.1,-4.1c0.9,-0.3 2.6,-1 3.7,-1.5c1.7,-0.8 1.7,-0.9 -0.6,-0.6c-2.6,0.4 -2.7,0.2 -2.5,-4c0.1,-3.7 -0.1,-4.1 -1.2,-2.6c-0.6,0.9 -1,2.4 -0.7,3.3c0.3,0.9 -0.1,2.3 -0.7,3.1c-0.7,0.8 -1.2,1.2 -1.1,1c0.1,-0.2 -0.6,-1.6 -1.7,-3.1c-2.6,-3.6 -2.6,-3.7 1.1,-7.3l3.2,-3l1.2,2.4c0.7,1.3 1.6,3.5 1.9,4.9zm4,-3.4c0.9,0.3 1.6,1.3 1.6,2.1c0,1 0.6,1.3 1.7,0.9c1.5,-0.6 1.5,-0.4 -0.2,1.4c-2.4,2.7 -0.8,2.6 2.1,-0.1l2.3,-2.1l2,3.3c2.5,4.2 1.5,5.4 -2.8,3.3c-1.8,-0.9 -3.5,-1.3 -3.8,-1c-0.3,0.3 0.7,1 2.2,1.6c1.5,0.6 2.6,1.3 2.3,1.6c-0.3,0.2 -1.7,0 -3.1,-0.5c-3.1,-1.2 -5.1,-4.3 -3.6,-5.8c0.6,-0.6 0.4,-1.5 -0.7,-2.4c-1.2,-0.9 -1.5,-1 -1,-0.2c0.4,0.7 0.2,1.3 -0.3,1.3c-0.6,0 -1.1,-0.2 -1.1,-0.4c0,-0.2 -0.3,-1.1 -0.6,-2c-0.6,-1.7 0.4,-2 3,-1zm2,12c0.4,0.9 0.4,1.9 0.1,2.2c-0.3,0.3 -0.5,-0.1 -0.6,-0.9c0,-0.8 -0.5,-0.3 -1,1c-1.2,3 -2.3,2 -1.5,-1.4c0.7,-2.9 2.1,-3.3 3,-0.9z M13,16.999999c-1.3,0.8 -1.3,1 0.2,1c0.9,0 2,-0.5 2.3,-1c0.8,-1.3 -0.5,-1.3 -2.5,0z M42.200001,35.499999l0.3,5.5l-5.2,0c-5.2,0 -5.3,-0.1 -7.4,-4.3c-1.2,-2.3 -2.4,-3.6 -2.6,-3c-0.3,0.7 0.5,2.9 1.7,4.8l2.1,3.5l-2.2,4c-3.2,5.6 -1.7,6.1 1.5,0.5c2.6,-4.3 2.9,-4.5 7.4,-4.5l4.7,0l-0.3,6l-0.4,6l12.1,0l12.1,0l0,-6l0,-6l3.6,0l3.6,0l-2.6,4.5c-3.4,5.7 -2.1,5.8 2.1,0l3.2,-4.3l-3.2,-5.1c-4,-6.2 -5.8,-6.7 -2.4,-0.6l2.6,4.5l-3.5,0l-3.4,0l0,-5.5l0,-5.5l-12.1,0l-12.1,0l0.4,5.5zm10.4,0.2c0.3,1.6 0.7,3.4 1,4c0.2,0.7 -0.1,1.3 -0.6,1.3c-0.6,0 -1.1,-1.2 -1.1,-2.8l-0.1,-2.7l-0.7,2.5c-0.5,2 -1.3,2.5 -4.1,2.7c-2.1,0.1 -2.9,-0.1 -2.1,-0.6c1.1,-0.7 1.1,-0.9 0,-1.3c-0.8,-0.3 -1.1,-0.9 -0.7,-1.3c0.5,-0.5 1.8,0 2.9,1.1c1.6,1.4 2.1,1.5 1.7,0.4c-0.2,-0.8 -1.4,-1.9 -2.6,-2.5c-3.6,-1.6 -2.7,-3.5 1.8,-3.5c3.5,0 4,0.3 4.6,2.7zm11.4,-1.8c0,0.6 -0.4,1.3 -1,1.6c-0.5,0.3 -1,1.8 -1,3.3l-0.1,2.7l-2,-2.8c-1.1,-1.5 -2.7,-2.7 -3.5,-2.7c-0.8,0 -1.4,-0.7 -1.4,-1.5c0,-1.1 1.2,-1.5 4.5,-1.5c2.5,0 4.5,0.4 4.5,0.9zm-5.5,4.7c0.9,0.9 1.4,1.8 1.1,2.1c-0.6,0.6 -4.6,-2 -4.6,-2.9c0,-1.3 1.8,-0.9 3.5,0.8zm5.2,1.6c-0.3,0.7 -0.5,0.2 -0.5,-1.2c0,-1.4 0.2,-1.9 0.5,-1.3c0.2,0.7 0.2,1.9 0,2.5zm-17.7,2.2c0,0.3 -0.4,0.8 -1,1.1c-0.5,0.3 -1,0.1 -1,-0.4c0,-0.6 0.5,-1.1 1,-1.1c0.6,0 1,0.2 1,0.4zm5.2,2.8l0.1,3.3l0.4,-3.3c0.2,-1.7 0.8,-3.2 1.3,-3.2c0.4,0 0.7,0.8 0.5,1.7c-1.5,7.6 -1.3,7.3 -5.5,7.3c-2.9,0 -4,-0.4 -4,-1.5c0,-0.8 0.5,-1.5 1.2,-1.5c1.5,0 4.8,-3 4.8,-4.3c0,-0.6 -1.1,0 -2.5,1.3c-2.9,2.8 -4.5,2.1 -1.8,-0.8c2.9,-3.2 5.3,-2.8 5.5,1zm5.8,-2.2c0,0.5 -0.5,1 -1.1,1c-0.5,0 -0.7,-0.5 -0.4,-1c0.3,-0.6 0.8,-1 1.1,-1c0.2,0 0.4,0.4 0.4,1zm3,-0.2c0,1.3 -3.9,4.6 -4.6,3.9c-0.3,-0.3 0.3,-1.4 1.3,-2.5c1.9,-2.2 3.3,-2.7 3.3,-1.4zm3.1,5.6c1.8,1.9 0.8,2.6 -3.6,2.6c-3.3,0 -4.5,-0.4 -4.5,-1.5c0,-0.8 0.7,-1.5 1.5,-1.5c0.9,0 2.4,-1.3 3.3,-3l1.7,-3l0.3,2.8c0.2,1.5 0.8,3.1 1.3,3.6zm0.6,-1.7c-0.3,1 -0.5,0.2 -0.5,-1.7c0,-1.9 0.2,-2.7 0.5,-1.8c0.2,1 0.2,2.6 0,3.5z M12.8,52.2c-1.9,3.5 -4.5,7.9 -5.7,10l-2.2,3.6l4.3,2.4c4.2,2.4 4.7,3.4 3.3,7.3c-0.6,1.9 -0.6,1.9 0.9,0.1c0.8,-1 1.7,-2.3 1.8,-2.8c0.2,-0.5 2.5,0.3 5.1,1.8c2.7,1.4 4.9,2.5 5.1,2.3c0.3,-0.5 6.5,-11.1 9.4,-16.1l2.1,-3.7l-9.8,-5.6c-5.3,-3 -9.9,-5.5 -10.2,-5.5c-0.3,0 -2.1,2.8 -4.1,6.2zm7.2,-0.2c0.3,2.1 1.5,4.1 3.3,5.4c2.7,2 3,2 5.6,0.5c4.3,-2.5 5.9,-0.9 3.2,3c-2.6,3.6 -3.2,3.8 -4.9,1.1c-0.7,-1.1 -1.7,-2 -2.3,-2c-0.8,0 -0.8,0.4 0,1.3c0.8,1 0.6,1.9 -1,3.5c-2,2.3 -4.9,3 -4.9,1.2c0,-0.6 0.8,-1 1.9,-1c1,0 2.4,-0.6 3,-1.4c0.9,-1.1 0.8,-1.5 -0.6,-2c-1.5,-0.6 -1.5,-0.8 -0.3,-1.6c1.1,-0.7 0.6,-1.3 -2.2,-2.5c-2.1,-0.8 -4.4,-1.5 -5.3,-1.5c-1.9,0 -1.9,-0.1 0.2,-4.5c2,-4.2 3.6,-4.1 4.3,0.5zm3,0.8c0,1.5 0.2,1.5 1.1,0.2c0.8,-1.2 0.9,-1 0.4,0.9c-0.7,2.2 -0.5,2.3 2.5,1.6c2.1,-0.5 3,-0.4 2.6,0.3c-1.2,1.9 -4.5,2 -6.5,0c-2.1,-1.9 -3,-6.5 -1.1,-5.3c0.6,0.3 1,1.4 1,2.3zm5,0.6c0,0.3 -0.4,0.8 -1,1.1c-0.5,0.3 -1,0.1 -1,-0.4c0,-0.6 0.5,-1.1 1,-1.1c0.6,0 1,0.2 1,0.4zm-11.6,4.1c1.1,0.1 2.7,0.3 3.4,0.4c0.6,0 1.2,0.6 1.2,1.1c0,0.6 -0.8,1 -1.7,0.8c-1.1,-0.2 -1.9,0.5 -2.1,1.7c-0.3,1.7 -0.1,1.8 0.8,0.5c1,-1.3 1.1,-1.2 0.6,0.3c-0.3,1 -0.6,2.3 -0.6,2.8c0,0.6 -0.4,0.7 -1,0.4c-1.4,-0.8 -1.3,-4.8 0.1,-6.2c0.9,-0.9 0.7,-1.2 -0.8,-1c-2.2,0.1 -2.5,3.7 -0.5,7.3c1.6,3.1 0.2,4.5 -2.8,2.8c-2.5,-1.5 -2.5,-1.5 -0.1,-0.8c1.6,0.4 2.1,0.3 1.7,-0.5c-0.4,-0.6 -1.8,-1.1 -3.2,-1.1c-2.8,0 -3,-1 -0.7,-5.3c0.9,-1.8 1.6,-3.6 1.5,-4c-0.1,-0.5 0.3,-0.5 0.9,-0.1c0.6,0.4 2.1,0.8 3.3,0.9zm11.9,9.3c-0.5,1.4 -2.8,5.5 -4,7.1c-0.1,0.2 -1.2,-0.8 -2.4,-2.2c-1.1,-1.5 -2.5,-2.7 -3.1,-2.7c-0.6,0 -0.3,1 0.8,2.1c1.9,2.2 1.9,2.2 -0.4,1c-2.8,-1.5 -2.4,-3.5 0.9,-3.9c3.3,-0.4 6.9,-2.3 6.3,-3.3c-0.3,-0.5 0.2,-0.6 1,-0.3c0.9,0.3 1.2,1.2 0.9,2.2z M6,69.7c0,2 4.7,11.3 5.4,10.6c0.3,-0.4 2.9,-0.6 5.6,-0.4c3.8,0.2 5,-0.1 5,-1.2c0,-1.1 -1.1,-1.3 -4.9,-0.9l-5,0.4l-3,-4.8c-1.7,-2.6 -3.1,-4.3 -3.1,-3.7z',
                "strokeColor": 'red',
                "strokeOpacity": 1,
                "strokeWeight": 0.2,
                "fillColor": '#fefe99',
                "fillOpacity": 1,
                "anchor": { x : 27, y : 41 },
                "rotation": arrow_heading,
                "scale": 0.5
            };

            var Quad = {
                "path": 'M293,698l2,-93l42,-3l42,-3l0,-80l-1,-79l-84,0l-84,0l0,40l0,40l-90,0l-90,0l0,-90l0,-90l90,0l90,0l0,43l0,42l82,-2l83,-1l3,-76l3,-76l-45,0l-45,0l1,-95l0,-95l88,0l88,0l4,36c2,19 2,62 0,95l-4,59l-39,0l-39,0l0,78l0,77l82,-2l82,-1l0,-39l1,-38l88,-3l87,-3l0,91l0,90l-91,0l-92,0l6,-40l5,-40l-84,0l-84,0l0,80l0,80l39,0c38,0 39,0 43,43c2,23 2,66 0,95l-4,52l-89,0l-88,0l2,-92zm94,60c-3,-8 -6,-5 -6,6c-1,11 2,17 5,13c3,-3 4,-12 1,-19zm-17,-1c0,-7 -9,-18 -20,-25c-11,-7 -20,-23 -20,-37c0,-14 9,-30 20,-37c29,-18 25,-38 -7,-38l-28,0l0,75l0,75l28,0c15,0 27,-6 27,-13zm86,-59l-1,-73l-32,-3c-40,-4 -41,2 -5,38c16,15 29,35 29,44c0,9 -2,14 -4,12c-6,-6 -43,32 -43,44c0,6 13,10 29,10l29,0l-2,-72zm-33,10c5,-15 -10,-48 -22,-48c-4,0 -8,7 -8,15c0,8 4,15 9,15c4,0 8,5 8,11c0,5 -5,7 -12,3c-7,-4 -8,-3 -4,4c8,13 -4,15 -28,6c-19,-7 -22,-35 -3,-30c6,1 9,1 4,-1c-4,-3 -5,-9 -1,-14c3,-5 1,-9 -5,-9c-5,0 -13,10 -17,22c-9,29 29,62 56,48c10,-5 20,-15 23,-22zm-327,-218c18,0 64,-29 64,-41c0,-11 -23,-7 -32,5c-4,6 -13,4 -22,-3c-19,-16 -22,-1 -4,17c9,9 9,12 0,12c-6,0 -16,-9 -22,-20c-16,-29 -30,-25 -30,9c0,27 21,49 28,30c2,-5 10,-9 18,-9zm73,14c26,-6 31,-11 31,-35c0,-19 -5,-29 -15,-29c-8,0 -15,7 -15,15c0,9 -10,20 -22,25c-21,8 -22,9 -3,10c17,2 16,3 -5,10c-31,10 -13,12 29,4zm520,0c26,-6 31,-11 31,-35c0,-34 -25,-40 -33,-9c-3,11 -11,20 -18,20c-10,0 -10,-3 -1,-12c16,-16 15,-25 -3,-25c-8,0 -12,4 -9,9c3,4 0,8 -5,8c-6,0 -11,-6 -11,-12c0,-9 -3,-8 -9,2c-6,8 -7,18 -5,22c3,4 1,8 -5,8c-6,0 -15,-9 -21,-20c-6,-11 -15,-20 -20,-20c-15,0 -12,58 3,63c18,8 70,8 106,1zm-69,-54c0,-5 -5,-10 -11,-10c-5,0 -7,5 -4,10c3,6 8,10 11,10c2,0 4,-4 4,-10zm-535,-47c18,-21 27,-25 49,-19c16,4 30,16 33,26c9,35 35,24 31,-12l-3,-33l-72,-1l-73,-1l0,33c0,41 8,42 35,7zm19,12c7,-19 26,-20 26,-2c0,8 7,14 15,14c18,0 19,-9 3,-25c-18,-18 -46,-14 -58,8c-6,11 -7,20 -1,20c5,0 11,-7 15,-15zm501,-12c18,-21 27,-25 49,-19c16,4 30,16 33,26c9,35 35,24 31,-12l-3,-33l-72,-1l-73,-2l0,34c0,41 7,42 35,7zm15,15c0,-9 4,-8 11,2c9,13 10,12 5,-2c-3,-12 0,-18 10,-18c9,0 14,6 11,13c-3,8 1,14 9,14c18,0 18,-11 -1,-27c-17,-14 -51,-5 -59,15c-3,8 -1,15 4,15c6,0 10,-6 10,-12zm-269,-204c-27,-19 -27,-60 -1,-76c29,-18 25,-38 -8,-38l-28,0l0,70c1,66 2,69 26,72c32,4 38,-10 11,-28zm106,-30c2,-41 0,-53 -7,-39c-6,14 -9,16 -9,4c-1,-8 4,-20 11,-27c13,-13 5,-17 -45,-25c-30,-5 -29,-2 19,50c11,12 21,29 21,38c0,8 -2,13 -4,11c-6,-5 -52,37 -48,44c2,3 16,5 32,5c27,-2 28,-3 30,-61zm-83,20c-5,-2 -9,-18 -8,-35c1,-19 -2,-29 -9,-26c-28,9 -13,68 17,66c7,0 7,-2 0,-5zm45,-13c7,-13 6,-24 -3,-37c-13,-17 -14,-16 -9,10c4,18 2,27 -4,23c-5,-3 -10,0 -10,8c0,21 14,19 26,-4z M628,493c12,-2 30,-2 40,0c9,3 -1,5 -23,4c-22,0 -30,-2 -17,-4z',
                "strokeColor": 'red',
                "strokeOpacity": 1,
                "strokeWeight": 0.4,
                "fillColor": '#fefe99',
                "fillOpacity": 1,
                "anchor": { x : 360, y : 450 },
                "rotation": arrow_heading,
                "scale": 0.06
            };

            var Wallpacks = {
                "path": 'M5.999371,16.999528c-0.3,9.1 -0.3,24.1 0,33.5c0.3,9.3 0.7,13.3 0.8,8.8l0.2,-8.2l8.3,-0.3l8.2,-0.3l0,-16.5l0,-16.5l-8.2,-0.3l-8.2,-0.3l-0.3,-8.2c-0.2,-5.5 -0.5,-2.7 -0.8,8.3zm16,17l0,15l-7.5,0l-7.5,0l0,-6.3c0,-3.6 0.5,-6.8 1.2,-7.5c0.9,-0.9 0.9,-1.5 0,-2.4c-0.7,-0.7 -1.2,-3.9 -1.2,-7.5l0,-6.3l7.5,0l7.5,0l0,15z',
                "strokeColor": 'red',
                "strokeOpacity": 1,
                "strokeWeight": 0.6,
                "fillColor": '#fefe99',
                "fillOpacity": 3,
                "anchor": { x : 7, y : 35 },
                "rotation": arrow_heading,
                "scale": 0.8
            };

                       var marker = document.createElement("google-map-marker");
                        marker.setAttribute('latitude',item.latitude);
                        marker.setAttribute('longitude',item.longitude);
                        marker.setAttribute('title', "Survey Serial No - "+item.Row);
                        marker.setAttribute('draggable', 'false');

                        if(item.survey_type == undefined || item.survey_type == ""){
                             marker.setAttribute('icon', 'images/pin.png');
                        } else
                        if(item.survey_type == "Wallpacks"){
                            if (item.degree == undefined || item.degree == ""){
                                marker.setAttribute('icon', 'images/pin.png');
                            } else {
                            marker.setAttribute('icon',JSON.stringify(eval(item.survey_type)));
                            }
                        }  else
                        if(item.survey_type == "Parking"){
                            if(item.no_of_heads == undefined && item.head_angle ==undefined){
                                marker.setAttribute('icon', 'images/pin.png');
                            } else {
                                if(item.no_of_heads == ""){
                                    marker.setAttribute('icon', 'images/pin.png');
                                } else{
                                    var headAngle = item.head_angle;
                                    var headAngleSplitted = headAngle.replace(/ /g,'');
                                    marker.setAttribute('icon',JSON.stringify(eval(item.no_of_heads + headAngleSplitted)));
                                }
                            }
                            if(item.no_of_heads == undefined || item.head_angle ==undefined){
                                marker.setAttribute('icon', 'images/pin.png');
                            }
                        } else {
                            marker.setAttribute('icon', 'images/pin.png');
                        }

                $scope.item1 = item;
                var keyData = ""
                var tempOutSeq = [];
                var tempOutSeq1 = [];
                angular.forEach($scope.Outdoorsequence, function(value, key) {
                    tempOutSeq.push(value.fieldName);
                    tempOutSeq1.push(value.surveyTemplateFieldId);

                });
                var i = 0;
                angular.forEach(item, function(value, key) {
                    var key1 = key;
                    for (var i = 0; i < tempOutSeq1.length; i++) {
                        if (key != 'media' & tempOutSeq1[i] == key) {
                            keyData = keyData + '<tr><td>' + '<b>' + tempOutSeq[i] + '</b>' + '</td><td>' + value + '</td></tr>'
                            i++;
                        }
                    }
                });
                marker.innerHTML = '<table style="width:302px;font-family: "GE Inspira Regular", sans-serif;">' + keyData + '</table>';
                marker.animation = "DROP";

                Polymer.dom(map).appendChild(marker);
                map.notifyResize();
            });
        }

        $scope.$on("ReturnOutdoorCompleted", function() {
            console.log("ReturnOutdoorCompleted loadmarker",$scope.outdoorData)
            loadMarkers($scope.outdoorData);
            var excelData = $scope.outdoorData;
            angular.forEach($scope.Outdoorsequence, function(value, key) {
                excelData = JSON.parse(JSON.stringify(excelData).split('"' + value.surveyTemplateFieldId + '":').join('"' + value.fieldName + '":'));
            });

            for (var i = 0; i < excelData.length; i++) {
                delete excelData[i].media;
                delete excelData[i].Image;
            }
            $scope.excelData1 = excelData;

            $('#outdoorExport').click(function() {
                // var data = $('#txt').val();
                if ($scope.outdoorExcelData == '')
                    return;

                JSONToCSVConvertor($scope.excelData1, "Survey", true);
            });
            var outdoorTable = document.getElementById("outdoorTable");
            outdoorTable.setAttribute("table-data", JSON.stringify($scope.outdoorData));
            // console.log(JSON.stringify($scope.sequence));
            angular.forEach($scope.Outdoorsequence, function(value, key) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', value.surveyTemplateFieldId);
                //$scope.tempOutseq.push(value.fieldName);
                colOut.setAttribute('label', value.fieldName);
                colOut.setAttribute('sortable', true);
                colOut.setAttribute('type', 'html');
                Polymer.dom(outdoorTable).appendChild(colOut);
                flagOutdoor = 1;
            });
            if (flagOutdoor == 1) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', 'createdBy');
                colOut.setAttribute('label', 'Created By');
                colOut.setAttribute('sortable', true);
                colOut.setAttribute('type', 'html');
                Polymer.dom(outdoorTable).appendChild(colOut);
            }
        });

        $scope.$on("ReturnIndoorCompleted", function() {
            // // alert('indoorin')
            var indoorTable = document.getElementById("indoorTable");
            indoorTable.setAttribute("table-data", JSON.stringify($scope.indoorData));
            // console.log(JSON.stringify($scope.sequence));

            angular.forEach($scope.Indoorsequence, function(value, key) {
                var colIn = document.createElement('px-data-table-column');
                colIn.setAttribute('name', value.surveyTemplateFieldId);
                colIn.setAttribute('label', value.fieldName);
                colIn.setAttribute('type', 'html');
                colIn.setAttribute('sortable', true);

                flagIndoor = 1;
                Polymer.dom(indoorTable).appendChild(colIn);
            });

            if (flagIndoor == 1) {
                var colIn = document.createElement('px-data-table-column');
                colIn.setAttribute('name', 'createdBy');
                colIn.setAttribute('label', 'Created By');
                colIn.setAttribute('sortable', true);
                Polymer.dom(indoorTable).appendChild(colIn);
            }
        });

        $scope.$on("ReturnMainCompleted", function() {
            var mainTable = document.getElementById("mainTable");
            //alert('sdsad')
            console.log(JSON.stringify($scope.mainData))
            mainTable.setAttribute("table-data", JSON.stringify($scope.mainData));

            angular.forEach($scope.Mainsequence, function(value, key) {
                var colIn = document.createElement('px-data-table-column');
                colIn.setAttribute('name', value.surveyTemplateFieldId);
                colIn.setAttribute('label', value.fieldName);
                colIn.setAttribute('sortable', true);
                //console.log(JSON.stringify(colIn));
                Polymer.dom(mainTable).appendChild(colIn);
            });
        });

    }]);
});