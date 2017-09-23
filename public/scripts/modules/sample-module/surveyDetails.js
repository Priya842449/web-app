
/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    controllers.controller('surveyDetailsCtrl', ['$state', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', '$timeout', 'commonServices', 'adminServices', '$window', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, $timeout, commonServices, adminServices, $window) {




        $scope.disableApprove = true;

        $scope.disableSendBack = true;

        $scope.aggregatedSurvey = true;

        $scope.showGeneratePdf = true;

        $scope.showImageTag = false;

        $scope.showStageDrop = false;

        $scope.statusId="";

        $scope.stageValidation = 'Select Stage Name';

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

        var flagIndoor = 0;
        var flagOutdoor = 0;

        var ticketSiteComments;
        $scope.siteLat;
        $scope.siteLang;
        //$scope.sequence=[{"surveyTemplateFieldId":"store_recommend","fieldName":"Store Recommendation","fieldType":"TEXT"},{"surveyTemplateFieldId":"mounting_light","fieldName":"Mounting Height","fieldType":"TEXT"},{"surveyTemplateFieldId":"minimum_light","fieldName":"Minimum Light Level","fieldType":"TEXT"},{"surveyTemplateFieldId":"maximum_light","fieldName":"Maximum Light Level","fieldType":"TEXT"},{"surveyTemplateFieldId":"minimum_average","fieldName":"Minimum average","fieldType":"TEXT"},{"surveyTemplateFieldId":"maximum_average","fieldName":"Maximum average","fieldType":"TEXT"},{"surveyTemplateFieldId":"light_level_property","fieldName":"Property line light level","fieldType":"TEXT"},{"surveyTemplateFieldId":"other_restrictions","fieldName":"Other Restrictions","fieldType":"TEXT"}]
        var energyCodeObjectIndoor = {};
        var energyCodeObjectOutdoor = {};

        var siteId = $stateParams.siteId;
        //  console.log("cscbs"+siteId);
        // var ticketSiteDetailsId = '39'
        // var ticketId = '39'
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        // var surveyType;
        // console.log("$rootScope.survey-",$rootScope.survey)
        // var surveyRoot = $rootScope.survey;
        // for(var i =0;i<surveyRoot.length;i++){
        //     if(siteId == surveyRoot[i].siteId){
        //             surveyType = surveyRoot[i].surveyType;
        //     }
        // }

        //console.log("surveyType=====",surveyType);
var surveyTypeId;
        commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
            console.log("commonServices Survey type",data);
              surveyTypeId = data.surveyTypeId;
              $scope.surveyIdForSolar = data.surveyTypeId;
              //console.log($scope.surveyIdForSolar)
if($scope.surveyIdForSolar==9){
        $scope.aggregatedSurvey = false;
        $scope.showImageTag = true;
}
             $scope.surveyTypeIdwalmart = surveyTypeId;
             console.log("Inside Get /summary survey",$scope.surveyTypeIdwalmart);
        $scope.outdoor = false;
        console.log("surveyTypeId=========",data.surveyTypeId);
        if((surveyTypeId == 4) || (surveyTypeId == 6)){
            $scope.outdoor = true;
        }
        });

        commonServices.getInstallRejectStatus(ticketId).then(function(data){
            if(data.installRejectStatus == "Y"){
                $scope.showStageDrop = true;
            }
        });

        stageDropdown(); //to load stgae name dropdown

		$scope.selectedContractorForNextStage = "";
		$scope.existingSelectedContractorNxtStg = "";
				//alert(ticketId)
        //// alert(ticketId);
        //var dynamicURL = getSiteName + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';
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

        var map = document.getElementById('google-map');
        map.notifyResize();
        //console.log(dynamicURL);
        //loadMarkers();
        siteSummary();
		var surveyTicketSiteDet = '';
		  commonServices.getAllMedia(ticketId).then(function(data) {
              commonServices.getSiteSummary(ticketSiteDetailsId).then(function(summaryRes) {
              console.log("data get Al media", data, summaryRes.surveyTypeId);
              if(data.ticketsiteIdsList[1]) {
                surveyTicketSiteDet = data.ticketsiteIdsList[1][0];
                  console.log('surveyTicketSiteDet', surveyTicketSiteDet);
                solarImageLoad(surveyTicketSiteDet, summaryRes.surveyTypeId);
                imageDropDown(); // Calling to load dropdown
              }
				var x=data.ticketsiteIdsList[6];
				if(typeof  x != 'undefined'){
					$scope.poTicketID='';
					$scope.poTicketID=x[0];
				}
				$scope.$broadcast("poTicketID");
			}).catch(function(error) {
                console.error("Error in get site data", error);
              });
                  }).catch(function(errAuth) {
            console.error("Error in get auth data", errAuth);
          });
        // loadSurveyData();
        $(".tabs-menu a").click(function(event) {
            event.preventDefault();
            $(this).parent().addClass("current");
            $(this).parent().siblings().removeClass("current");
            var tab = $(this).attr("href");
            $(".tab-content").not(tab).css("display", "none");
            $(tab).fadeIn();
            $scope.station=$scope.stationData[0];
            //loadMarkers();
            //loadSurveyData();
            map.notifyResize();

        });
        console.log("REJECTED COMMENTS :::::::::", ticketId);
        commonServices.getRejectedComments(ticketId).then(function(data) {
            var rejectedComments = "";

            for (var i = 0; i < data.length; i++) {
                rejectedComments = rejectedComments + data[i].workflowVersionNo + ", " + data[i].comments + "\n";
            }

            document.getElementById('myTextarea1').value = rejectedComments;
            console.log("REJECTED COMMENTS :::::::::", rejectedComments);
        });


        //var ssoObj='502627312';
        $scope.hideAnchor=true;
        var ssoObj = window.localStorage.getItem("SSO_ID");
        //commonServices.getSiteListForPM(ssoObj, "Survey", "InProgress").then(function(data) {
        commonServices.getSiteListForPM(ssoObj, "Survey,PM Survey Approval,PM Survey Approval","InProgress,InProgress,Completed").then(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].ticketId == ticketId) {
                    $scope.siteIdFromJobId = data[i].siteId;

                    var paperStation = document.querySelector('paper-typeahead-input-station');
                    var remoteUrl = adminServices.getAssetURL() + '/station?filter=parent=/site/' + $scope.siteIdFromJobId + ':stationName=%QUERY*&fields=stationId,stationName';
                    console.log(remoteUrl)
                        //paperStation.setAttribute('remote-url', remoteUrl);
                }
            }
            $scope.hideAnchor=false;
        });

        // commonServices.getSiteListForPM(ssoObj, "Survey", "Completed").then(function(data) {
        //     console.log(data)
        //     for (var i = 0; i < data.length; i++) {
        //         if (data[i].ticketId == ticketId) {
        //             $scope.siteIdFromJobId = data[i].siteId;
        //             console.log($scope.siteIdFromJobId)
        //                 // var paperStation = document.querySelector('paper-typeahead-input-station');

        //             // var remoteUrl = adminServices.getAssetURL() + '/station?filter=parent=/site/' + $scope.siteIdFromJobId + ':stationName=%QUERY*&fields=stationId,stationName';
        //             // console.log(remoteUrl)
        //             // paperStation.setAttribute('remote-url', remoteUrl);
        //         }
        //     }
        // });
        commonServices.getAuthToken().then(function(config) {
            $scope.config = config;
            console.log($scope.config)
                // $http.get(adminServices.getAssetURL() + '/site/113456', $scope.config).success(function(data) {
                // console.log(data)
                // })
        });

        function displayImage() {
            var directory = $scope.sectionObjSelected.directory;
            var fileName = $scope.sectionObjSelected.fileName;
            $scope.src = adminServices.getAssetURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=image/png'
            console.log('after res :', $scope.src)
            $(".FloorImgDiv").show();
            $('#showImage').css({}).html('<img src="' + $scope.src + '" style="height:500px">').show();
        }

        function showFloors(data) {
            $scope.selectedFloor = null;
            $scope.floor = data[0].floor;
            console.log('floor data for repeat--', $scope.floor);
        }

        function showSection(data) {
            $scope.section = data.section;
        }

        function removeAllOptions() {
            $('#floorList')
                .find('option')
                .remove()
        }

        function getAllStation() {
            return $http.get(adminServices.getAssetURL() + '/station/' + $scope.KeyStation, $scope.config);
        }

        function removeAllSectionOptions() {
            $('#sectionList')
                .find('option')
                .remove()
        }

        // function stageDropdown(){
        //     $scope.stageNameDropdown = [];
        //     var stageName = {

        //     };
        //      var dummyObj = [
        //             'Select Image Tag'
        //         ];
        //     $scope.dropdownStage = $scope.stageNameDropdown[0];
        // }

        // function stageDropdownFunction(){
        //     alert("INSIDE STAGE");
        // }

        window.addEventListener('pt-item-confirmed', function(e) {
            var srcElement2 = e.srcElement;
            var dta = srcElement2.__data__;
            console.log(e);
            var keyCust; //to get custid or site id
            $scope.typeaheadType = srcElement2.localName;

            if (srcElement2.localName == "paper-typeahead-input-station") {
                $scope.KeyStation = dta.keyid;
                var allStatnPromise = getAllStation();
                allStatnPromise.then(function(data) {
                    console.log('promise data ', data);
                    var selectedStationData = data.data
                    $scope.StatnData = selectedStationData;
                    console.log("floorNo : ", selectedStationData[0].floor)
                    var floorList = document.querySelector('#floorList');
                    removeAllOptions()
                    showFloors(selectedStationData)
                })
                $(".bldgfloorTd").show();
                $(".floorTd").show();
            }
        });


        $scope.getFloor = function(floorNo) {
            $scope.floorNumber = floorNo;
            console.log('a_model-------------', floorNo);
            var allStatnPromise = getAllStation();
            allStatnPromise.then(function(data) {
                console.log('promise data ', data);
                var selectedStationData = data.data
                console.log(selectedStationData)
                var floorObj = selectedStationData[0].floor;
                var floorLen = floorObj.length;
                $scope.floorObjSelected;
                for (var i = 0; i < floorLen; i++) {
                    if (floorObj[i].floorNo == floorNo)
                        $scope.floorObjSelected = floorObj[i];
                }
                console.log($scope.floorObjSelected)
                $scope.section = $scope.floorObjSelected.section
                removeAllSectionOptions()
                showSection($scope.floorObjSelected);
            })
            $(".sectionTd").show();
        }
        $scope.getSection = function(sectionId) {
                $scope.sectionId = sectionId;
                console.log($scope.section);
                $scope.sectionObjSelected;
                var sectionLen = $scope.section.length;
                for (var i = 0; i < sectionLen; i++) {
                    if ($scope.section[i].sectionId == sectionId)
                        $scope.sectionObjSelected = $scope.section[i];
                }
                displayImage()
            }
            /* $http.get("images/indoor-outdoor.json").success(function (data) {
		var surveyIds=[];
		for(var i=0;i<=data.length;i++)
		{
			if(data[i]!=undefined)
			{
				//// alert(data[i].surveyTypeId);
				surveyIds.push(data[i].surveyTypeId)
			}
		}
		if(jQuery.inArray( "3", surveyIds )!=-1 && jQuery.inArray( "4", surveyIds )!=-1 && jQuery.inArray( "5", surveyIds )!=-1)
		{
			// alert('all');
		}
		else if(jQuery.inArray( "3", surveyIds )!=-1 && jQuery.inArray( "4", surveyIds )==-1 && jQuery.inArray( "5", surveyIds )!=-1)
		{
			// alert('Indoor');
			document.getElementById('tab2').style.display = 'none';

		}
		else if(jQuery.inArray( "3", surveyIds )==-1 && jQuery.inArray( "4", surveyIds )!=-1 && jQuery.inArray( "5", surveyIds )!=-1)
		{
			// alert('Outdoor');
			document.getElementById('tab1').style.display = 'none';
			if($('#tab1:visible').length == 0)
			{
				$("#tab-1").fadeOut();
				$("#tab-2").fadeIn();
				$("#li2").addClass("current");
			}
		}
		document.getElementById('main').style.display = 'block';

			console.log(data)
		}); */

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

            // var selectedSiteData = commonServices.getData();

            // angular.forEach(selectedSiteData,function(item){
            // console.log(item.ticketId);
            // });

            //$http.get(getSiteSummry + ticketSiteDetailsId).
            $scope.surveyTypeId = [];
            commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
                var comments = data.ticketSiteComments;
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
                if (data.ticketSiteComments != null) {
                    //alert('hello');
                    document.getElementById('myTextarea').value = comments + '\n' + month + '-' + day + '-' + year + '-' + hours + ':' + minutes + ' ' + ampm + '-';
                } else {
                    document.getElementById('myTextarea').value = '';
                }

				if(data.stagewiseContractorList.design != undefined){
				$scope.existingSelectedContractorNxtStg = data.stagewiseContractorList.design;
				if($scope.existingSelectedContractorNxtStg != ""){
				$scope.selectedContractorForNextStage = $scope.existingSelectedContractorNxtStg;
				if(document.querySelector('paper-typeahead-input-customerMaster') != undefined){
				document.querySelector('paper-typeahead-input-customerMaster').inputValue = $scope.selectedContractorForNextStage;
				}
				}
				}

                //console.log(JSON.stringify(data));
                surveyor = data.assignedTo;
                abc = data.completedDate;
                var d = new Date(abc);
                var stageName = data.stageName;

                /* //-------------------Estimated ship date
				//alert('bf4');
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
				}); */
                //-----------------------------------------------

                //var stageId;
                var siteStatus = data.statusName;
                var siteStatusId = data.statusId;
                var stageId = data.stageId;

                $scope.currentStage = data.stageName;
                //if ((stageName == 'Survey' && siteStatusId == 1) || (stageName == 'PM Survey Approval' && siteStatusId == 2)) {
                     if (stageId == commonServices.STAGE_ID.pmSurveyApproval && siteStatusId == 1) {

                    //alert('completed');
                   // console.log("INSIDE IF =============")
                    //var btnApprove = document.getElementById('btnApprove');
                    //console.log(btnAttch)
                    //btnApprove.setAttribute('disabled', '');
                    //var btnSend = document.getElementById('btnSB');
                    //console.log(btnSubmit)
                    //btnSend.setAttribute('disabled', '');
                    $scope.disableApprove = false;
                    $scope.disableSendBack = false;
                    console.log("$scope.disableApprove",$scope.disableApprove)
                }

                // commonServices.getJobStatus(ticketId).then(function(data) {
                //     console.log("getJobStatus==========",data)
                //     if ((data.stageId == commonServices.STAGE_ID.survey && data.statusId == 1) || (data.stageId == commonServices.STAGE_ID.pmSurveyApproval && data.statusId == 2) || (data.stageId == commonServices.STAGE_ID.survey && data.statusId == 2)){
                //   //  alert('completed');
                //     var btnApprove = document.getElementById('btnApprove');
                //     //console.log(btnAttch)
                //     btnApprove.setAttribute('disabled', '');
                //     var btnSend = document.getElementById('btnSB');
                //     //console.log(btnSubmit)
                //     btnSend.setAttribute('disabled', '');
                //     $scope.disableApprove = true;
                //     $scope.disableSendBack = true;
                //     }
                // });

                // commonServices.getJobStatus(ticketId).then(function(data) {
                //     console.log("getJobStatus==========",data)
                //     if (data.stageId == 1 || data.statusId == 2){

                //    alert('completed');

                //     $scope.disableApprove = true;
                //     $scope.disableSendBack = true;
                //     }
                // });

                //console.log(new Date(completedDate).format("dd-MM-yyyy")); d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
                $scope.completedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                //console.log(completedDate);
                //// alert($scope.completedDate);
               // console.log(data);
                // // alert(data.surveyList.length);
                if (data.surveyList != undefined) {
                    for (var i = 0; i < data.surveyList.length; i++) {
                        //// alert(data.surveyList[i].surveyTypeId);
                        $scope.surveyTypeId.push(data.surveyList[i].surveyTypeId);
                    }
                }
                $scope.siteData = {
                    'siteId': siteId,
                    'surveyor': surveyor,
                    'completedDate': $scope.completedDate
                };
                // if(jQuery.inArray( "5", $scope.surveyTypeId )==-1 && jQuery.inArray( "5", $scope.surveyTypeId )==-1 && jQuery.inArray( "5", $scope.surveyTypeId )==-1)
                // {
                // document.getElementById('main').style.display = 'none';
                // document.getElementById('tabcard').style.display = 'none';
                // }
                if (jQuery.inArray("5", $scope.surveyTypeId) == -1) {
                    document.getElementById('main').style.display = 'none';
                }
                if (jQuery.inArray("3", $scope.surveyTypeId) != -1 || jQuery.inArray("1", $scope.surveyTypeId) != -1 || jQuery.inArray("7", $scope.surveyTypeId) != -1) {
                    //// alert('indoor')
                    var surveyTypeId;
                    if (jQuery.inArray("1", $scope.surveyTypeId) != -1) {

                        surveyTypeId = 1;
                        $scope.surveyTypeIdForFloor = surveyTypeId;
                        //// alert(surveyTypeId +' :one')
                    }
                    if (jQuery.inArray("3", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 3;
                        $scope.surveyTypeIdForFloor = surveyTypeId;
                        //// alert(surveyTypeId +' :three')
                    }
                    if (jQuery.inArray("7", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 7;
                        $scope.surveyTypeIdForFloor = surveyTypeId;
                        //// alert(surveyTypeId +' :three')
                    }
                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        console.log(data);
                        // angular.forEach(data, function(value, key) {
                        // // data[key].surveyTemplateFieldId='Image';
                        // data[key].Image='Image';
                        // });
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
                        console.log(data);
                        // angular.forEach(data, function(value, key) {
                        // // data[key].surveyTemplateFieldId='Image';
                        // data[key].Image='Image';
                        // });
                        $scope.Outdoorsequence = data;
                        if (jQuery.inArray("3", $scope.surveyTypeId) == -1 && jQuery.inArray("1", $scope.surveyTypeId) == -1) {
                            //// alert('Outdoor');
                            document.getElementById('tab1').style.display = 'none';
                            if ($('#tab1:visible').length == 0) {
                                $("#tab-1").fadeOut();
                                $("#tab-2").fadeIn();
                                $("#li2").addClass("current");
                            }
                        }

                    });
                }
                //alert($scope.surveyTypeId);
                if (jQuery.inArray("5", $scope.surveyTypeId) != -1) {
                    //// alert('main')
                    var surveyTypeId = 5;
                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        console.log(data);
                        // angular.forEach(data, function(value, key) {
                        // // data[key].surveyTemplateFieldId='Image';
                        // data[key].Image='Image';
                        // });
                        console.log(data);
                        $scope.Mainsequence = data;

                    });
                }
                $scope.$broadcast("ReturnSequenceCompleted");
            }).catch(function(err){
console.error("NO Data Found",err)
            })


            $scope.$on("ReturnSequenceCompleted", function() {
                // $http.get(devURL+"GetSurveyResponse?ticketSiteDetailId="+ticketSiteDetailsId+"&surveyTypeId=5").success(function (data) {
                commonServices.getMainData(ticketSiteDetailsId).then(function(data) {
                    console.log("Inside ReturnSequenceCompleted",data);

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

        $scope.Ok = function() {
            $("#myModal1").css("visibility", "hidden");
        };
        // $http.get("https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=10/Survey&fileName=img_201853800.jpeg&contentType=").success(function (data) {
        // $scope.resImg='data:image/jpeg;base64,'+data;
        // });

        // commonServices.getSurveyData(ticketId).then(function(data) {
        // commonServices.getSurveyData(ticketId).then(function(data) {
        $scope.$on("ReturnSequenceCompleted", function() {
            var surveyIdOut = 0;
            if (jQuery.inArray("4", $scope.surveyTypeId) != -1) {
                surveyIdOut = 4;
            }
            if (jQuery.inArray("2", $scope.surveyTypeId) != -1) {
                surveyIdOut = 2;
            }

            //// alert('surveyIdOut :' + surveyIdOut);
            if (surveyIdOut != 0) {
                // $http.get(devURL+"GetSurveyResponse?ticketSiteDetailId="+ticketSiteDetailsId+"&surveyTypeId="+surveyIdOut).success(function (data) {
                commonServices.getOutdoorData(ticketSiteDetailsId, surveyIdOut).then(function(data) {
                    if (!($scope.Outdoorsequence == undefined)) {
                        var image = {
                            "surveyTemplateFieldId": "image",
                            "fieldName": "Image",
                            "fieldType": "TEXT"
                        };
                        $scope.Outdoorsequence.push(image);
                    }
                    console.log("getOutdoorData",data);
                    $scope.outdoorData = data;
                console.log("684 $scope.outdoorData",$scope.outdoorData);
                    var energyCodes = [];
                    //var tempArr={};
                    angular.forEach($scope.outdoorData, function(value, key) {
                        if (value.energy_code != undefined) {
                            energyCodes.push(value.energy_code);
                        }
                        //console.log(value);
                        var media = value.media;
                        var fileName = [];
                        var directory = [];
                        //console.log(media[0].contentType)

                        for (var i = 0; i < media.length; i++) {

                            //var contentType=media[i].contentType;
                            directory.push(media[i].directory);
                            fileName.push(media[i].fileName);
                        }
                        // $scope.indoorData[key].image="<a href='#' id='' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=Testing&fileName=Untitled.png&contentType=image/png /></paper-button></a>";
                        //// alert(directory + ' directory');
                        if (fileName.length == 1) {
                            var id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=image/png';
                            console.log("<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>")
                                //console.log("<a href='#' id='"+id+"' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=https://dt-blobstore-microservice.run.asv-pr.ice.predix.io/getBlob?SiteId=95&directory=tester&filename=TestImg.jpg /></paper-button></a>");
                            $scope.outdoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png /></paper-button></a>";
                        } else {
                            var id = '';
                            for (var i = 0; i < fileName.length; i++) {
                                if (i == 0) {

                                    id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                } else {
                                    id = id + ',' + commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                    //console.log("<a href='#' id='"+id+"' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory"+directory[i]+"&filename="+fileName[i]+" /></paper-button></a>");

                                    $scope.outdoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory[0] + "&fileName=" + fileName[0] + "&contentType=image/png /></paper-button></a>";
                                }
                            }
                        }


                    });



                    energyCodeObjectOutdoor = {
                            "energyCodeList": energyCodes,
                            "createdBy": window.localStorage.getItem("SSO_ID")
                        }
                        //  energyCodeObjectOutdoor = tempArr;


                    var data1 = angular.copy(data);
                    $scope.outdoorExcelData = data1;
                    for (var i = 0; i < data1.length; i++) {
                        delete data1[i].media;
                        delete data1[i].image;
                    }
                    //// alert('b4');
                    $scope.$broadcast("ReturnOutdoorCompleted");
                });
            }
        });
        $scope.$on("ReturnSequenceCompleted", function() {
            var surveyIdIn = 0;
            //alert(jQuery.inArray("3", $scope.surveyTypeId))
            if (jQuery.inArray("3", $scope.surveyTypeId) != -1) {
                surveyIdIn = 3;
            }
            if (jQuery.inArray("1", $scope.surveyTypeId) != -1) {
                surveyIdIn = 1;
            }
            if (jQuery.inArray("7", $scope.surveyTypeId) != -1) {
                surveyIdIn = 7;
            }
            console.log(surveyIdIn)
            if (surveyIdIn != 0) {
                // $http.get(devURL+"GetSurveyResponse?ticketSiteDetailId="+ticketSiteDetailsId+"&surveyTypeId="+surveyIdIn).success(function (data) {
                commonServices.getOutdoorData(ticketSiteDetailsId, surveyIdIn).then(function(data) {
                    if (!($scope.Indoorsequence == undefined)) {
                        var image = {
                            "surveyTemplateFieldId": "image",
                            "fieldName": "Image",
                            "fieldType": "TEXT"
                        };
                        $scope.Indoorsequence.push(image);
                    }
                    //loadMarkers(data);
                    var i = 0;
                    // for (i = 0; i < data.length; i++) {
                    // delete data[i].media;
                    // }
                    // console.log(JSON.stringify(data));

                    $scope.indoorData = data;

                    // console.log("INDOOOOOOOOOOORRRR DATAAAAAAA",$scope.indoorData);
                    var energyCodes = [];
                    //var tempArr={};

                    angular.forEach($scope.indoorData, function(value, key) {

                        if (value.energy_code != undefined) {
                            energyCodes.push(value.energy_code);
                        }
                        var media = value.media;
                        var fileName = [];
                        var directory = [];
                        //console.log(media[0].contentType)

                        for (var i = 0; i < media.length; i++) {

                            //var contentType=media[i].contentType;
                            directory.push(media[i].directory);
                            fileName.push(media[i].fileName);
                        }
                        // $scope.indoorData[key].image="<a href='#' id='' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=Testing&fileName=Untitled.png&contentType=image/png /></paper-button></a>";
                        //// alert(directory + ' directory');
                        if (fileName.length == 1) {
                            var id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=plain/text ';
                            console.log("<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>")
                                //console.log("<a href='#' id='"+id+"' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=https://dt-blobstore-microservice.run.asv-pr.ice.predix.io/getBlob?SiteId=95&directory=tester&filename=TestImg.jpg /></paper-button></a>");
                            $scope.indoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>";
                        } else {
                            var id = '';
                            for (var i = 0; i < fileName.length; i++) {
                                if (i == 0) {

                                    id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=image/png';
                                } else {
                                    id = id + ',' + commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory[i] + '&fileName=' + fileName[i] + '&contentType=plain/text';
                                    //console.log("<a href='#' id='"+id+"' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory"+directory[i]+"&filename="+fileName[i]+" /></paper-button></a>");

                                    $scope.indoorData[key].image = "<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory[0] + "&fileName=" + fileName[0] + "&contentType=image/png /></paper-button></a>";
                                }
                            }
                        }


                    });
                    energyCodeObjectIndoor = {
                            "energyCodeList": energyCodes,
                            "createdBy": window.localStorage.getItem("SSO_ID")
                        }
                        // energyCodeObjectIndoor = tempArr;


                    // console.log("DDDDDDDDAAAAAAAAAAA",energyCodes);
                    //console.log("DDDDDDDDAAAAAAAAAAA",tempArr);
                    var data1 = angular.copy(data);
                    //$scope.outdoorExcelData = data1;
                    for (i = 0; i < data1.length; i++) {
                        delete data1[i].media;
                        delete data1[i].image;
                    }
                    $scope.excelData = data1;

                    var excelData = $scope.excelData;
                    console.log("Indoor Data",$scope.indoorData);

                    //$scope.sequenceIndoor=[{"area_description":"Reception","no_of_fixture":"2","average_lux_level":"","lamp_type":"Led T8","media":[],"lamp_wattage":"18","building":"Maintenance bhawan","cable_type":"","product_type_office":"","area_dimension_length":"","ceiling_type":"","ceiling_cutout_dimension":"","colour_temp":"White","floor":"Grnd","comments3":"","comments2":"","ambient_temp":"","comments1":"","indoor_type":"Office","no_of_product":"3","area_dimension_width":"","product_type_plant":"","area_dimension_mounting_height_luminaire":"","createdBy":320006529,"mounting":"Suspended","room_environment":""}]
                    angular.forEach($scope.Indoorsequence, function(value, key) {
                        //console.log('id'+value.surveyTemplateFieldId);
                        //console.log('field'+value.fieldName);
                        excelData = JSON.parse(JSON.stringify(excelData).split('"' + value.surveyTemplateFieldId + '":').join('"' + value.fieldName + '":'));
                        //$scope.sequence[key].image='';
                       // console.log($scope.Indoorsequence);

                    });
                    $scope.excelData = excelData;
                    //console.log(JSON.stringify(excelData[0]));




                    $('#indoorExport').click(function() {
                        // var data = $('#txt').val();
                        if (data == '')
                            return;

                        JSONToCSVConvertor($scope.excelData, "Survey", true);
                    });
                    // $('#outdoorExport').click(function() {
                    // // var data = $('#txt').val();
                    // if (data == '')
                    // return;

                    // JSONToCSVConvertor($scope.excelData, "Survey", true);
                    // });


                    $scope.completedsurvey = data;
                    // angular.forEach(data,function(value,key){
                    // data[key].ticketId = "<a href=/surveydetails/"+value.ticketId+" ui-sref=surveydetails({ticketId:'"+value.ticketId+"'}) 'style='text-decoration: none'>"+value.ticketId+"</a>";

                    // });
                    // $scope.completedsurvey=data;

                    //$scope.$broadcast("ReturnIndoorCompleted");
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

                    // console.log(outdoorsurveyDataGas);
                    count++;
                }
                if (value.outDoorSurveyTypeId == 'SOFFIT LIGHTS') {
                    if (outdoorsurveyDataSofit.length != 0) {
                        if (outdoorsurveyDataSofit[0].outDoorSurveyTypeId == 'SOFFIT LIGHTS') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }

                    outdoorsurveyDataSofit.push(value);

                    //console.log(outdoorsurveyDataGas);
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

                //console.log(value.media);

                //outdoorsurveyData[key].image = "<a href='#' onclick='gotoLink()'><img src =images/favicon.png></a>";

                // console.log(count);
            });

            //$scope.outdoorsurveyFinalData.push(outdoorsurveyDataGas,outdoorsurveyDataWall,outdoorsurveyDataParking,outdoorsurveyPic,outdoorsurveyDataSofit,outdoorsurveyDataSketches);
            $scope.outdoorsurveyFinalData = $scope.outdoorsurveyFinalData.concat(outdoorsurveyDataGas).concat(outdoorsurveyDataWall).concat(outdoorsurveyDataParking).concat(outdoorsurveyPic).concat(outdoorsurveyDataSofit).concat(outdoorsurveyDataSketches);
        }

        // For SOLAR loading image on the map..
        function clearMapMarkers() {
            var markerarr = map.markers;
            console.log("markerarr--", markerarr);
            if(!(markerarr == undefined))
            {
                for(var i=0;i<markerarr.length;i++)
                {
                    console.log("id",markerarr[i].getAttribute("id"))
                   // if(markerarr[i].getAttribute("id")== "siteBoundryMarkers"){
                        Polymer.dom((Polymer.dom(markerarr[i]).parentNode)).removeChild(markerarr[i]);
                        Polymer.dom.flush();
                    //}
                }

            }
        }
        var gmap = '';
        $scope.solarRespData = [];
         function solarImageLoad(surveyTicketSite, surveyType, isFiltered) {
          console.log("in solar image loag", surveyTicketSite, surveyType, isFiltered);
           if(!isFiltered) {
              commonServices.solarSurveyData(surveyTicketSite, surveyType).then(function(solarResp) {
                  console.log("solarResp", solarResp);
                  $scope.solarRespData = solarResp.data;
                  displayOnMap(solarResp.data);
                  $scope.outdoorSurveyTableData();
              }).catch(function(error) {
                  console.error("error loading solar data", error);
              });
            } else {
              displayOnMap($scope.solarRespData, isFiltered);
            }
         }

        function displayOnMap(a_data, isFiltered) {
            console.log("Inside displayOnMap a-data",a_data)
            gmap = document.querySelector('google-map');
            gmap.notifyResize();

            for(var indx=0; indx < a_data.length; indx++) {
                let dataTemp = a_data[indx];
                 if(dataTemp.type_data == 'Image' && !isFiltered) {
                     var marker = document.createElement('google-map-marker');
                     marker.setAttribute('latitude', dataTemp.latitude);
                     marker.setAttribute('longitude', dataTemp.longitude);
                    marker.setAttribute('click-events', 'true');
                    marker.setAttribute('icon', 'images/camerahi.png');
                    marker.setAttribute('dataImage', JSON.stringify(dataTemp));
                    //marker.animation = "DROP";
                    Polymer.dom(map).appendChild(marker);
                    map.notifyResize();
                      gmap.notifyResize();
                } else
                if(dataTemp.type_data == 'Area') {
                    if(dataTemp.media.length<=0 && dataTemp.hasOwnProperty('area_coordinates')) {
                        if(dataTemp.area_coordinates != '' || dataTemp.area_coordinates != undefined) {
                            if(dataTemp.line_color == "" || dataTemp.line_color == undefined){
                                $scope.lineColor = "#FF0000";
                            } else
                                if(dataTemp.line_color == "Red"){
                                    $scope.lineColor = "#FF0000";
                                } else if(dataTemp.line_color == "Blue"){
                                    $scope.lineColor = "#0000FF";
                                } else if(dataTemp.line_color == "Yellow"){
                                    $scope.lineColor = "#FFFF00";
                                } else if(dataTemp.line_color == "Black"){
                                    $scope.lineColor = "#000000";
                                } else if(dataTemp.line_color == "White"){
                                    $scope.lineColor = "#FFFFFF";
                                }
                           $scope.areaName = dataTemp.area_name;
                           var parsedData  = JSON.parse(dataTemp.area_coordinates);
                            if(parsedData.length > 0) {
                                displayAreaLine(parsedData);
                            }
                        }
                    }
                } else if (dataTemp.type_data == 'Room/Place Detail') {
                    displayRoomName(dataTemp);
                }
            }
        }

        function displayRoomName(a_data) {
           console.log(a_data);
             var marker = document.createElement('google-map-marker');
                    marker.setAttribute('latitude', a_data.latitude);
                    marker.setAttribute('longitude', a_data.longitude);
                    marker.setAttribute('click-events', 'true');
                    marker.setAttribute('icon', 'images/showroom.png');
                    marker.setAttribute('title',"Room Name - "+a_data.room_name);
                    //marker.animation = "DROP";
                    Polymer.dom(map).appendChild(marker);
                    map.notifyResize();
        }

        $scope.imagePopup = [];

        function displayAreaLine(a_data) {
            var gmap = document.querySelector('google-map');
            if(!document.getElementById("poly1")){
                console.log("google-map-poly",document.getElementById("poly1"));
                var poly = document.createElement('google-map-poly');
            poly.setAttribute('id',"poly1")
            poly.setAttribute('closed', '');
            poly.setAttribute('stroke-color', $scope.lineColor);
            poly.setAttribute('fill-color', '')
            poly.setAttribute('stroke-weight', '2')
            poly.removeAttribute('fill-opacity')
            poly.setAttribute('fill-opacity', '.25')
           // poly.setAttribute('title', "Area Name - "+a_data.area_name);
            Polymer.dom(gmap).appendChild(poly);
            }else{
                var poly = document.createElement('google-map-poly');
            poly.setAttribute('id',"poly1")
            poly.setAttribute('closed', '');
            poly.setAttribute('stroke-color', $scope.lineColor);
            poly.setAttribute('fill-color', '')
            poly.setAttribute('stroke-weight', '0')
            //poly.removeAttribute('fill-opacity')
            //poly.setAttribute('fill-opacity', '.25')
           // poly.setAttribute('title', "Area Name - "+a_data.area_name);
            Polymer.dom(gmap).appendChild(poly);
            }

            // in for loop
            for (var indx = 0; indx < a_data.length; indx++) {
                var pt = a_data[indx];
                var polyPoint = document.createElement('google-map-point');
                polyPoint.setAttribute('latitude', pt.lat);
                polyPoint.setAttribute('longitude', pt.lng);
                //polyPoint.setAttribute('title', "Area Name - "+pt.area_name);
                Polymer.dom(poly).appendChild(polyPoint);
            }
                gmap.notifyResize();
                //console.log("a_data",a_data)
                for (var indx = 0; indx < a_data.length; indx++) {
                var pt = a_data[0];
                var marker = document.createElement('google-map-marker');
                marker.setAttribute('latitude', JSON.parse(pt.lat));
                marker.setAttribute('longitude', JSON.parse(pt.lng));
                //console.log("areas name",pt,a_data);
                marker.setAttribute('title', "Area Name - "+$scope.areaName);
                marker.setAttribute('icon', 'images/new_group.PNG');
                Polymer.dom(map).appendChild(marker);
            }
        }

        window.addEventListener('google-map-marker-click', function(e) {
            var blobURL = '',
                urlArray = [];
            var srcElement1 = e.srcElement;
            var skuid=srcElement1.innerHTML;
            var data = srcElement1.getAttribute('dataImage');
            var parsedData = JSON.parse(data);
            console.log('data for media', data);
            if (data && parsedData.hasOwnProperty('media')) {
                console.log("data icon image", data);
                var media = parsedData.media; // Consider first image
                // form the array of URLs
                media.forEach(function(item, key) {
                    blobURL = commonServices.getBlobStoreURL() +
                        "/getBlob?directory=" + item.directory +
                        "&fileName=" + item.fileName +
                        "&contentType=" + item.contentType;
                    urlArray.push(blobURL);
                    blobURL = '';
                });
                $('#popup-container').css({ 'display': 'block' });
            } else if(parsedData.hasOwnProperty('fileName')){
                blobURL = commonServices.getBlobStoreURL() +
                        "/getBlob?directory=" + parsedData.directory +
                        "&fileName=" + parsedData.fileName +
                        "&contentType=" + parsedData.contentType;
                    urlArray.push(blobURL);
                    blobURL = '';
                    $('#popup-container').css({ 'display': 'block' });
            } else {
                $('#popup-container').css({ 'display': 'none' });
            }
            $scope.$apply(function() {
                $scope.imagePopup =  urlArray;
                console.log('$scope.imagePopup----------------', $scope.imagePopup);
            });
        });



        //TO SHOW STAGE NAME DROPDOWN

         function stageDropdown(){
            $scope.stageNameDropdown = [];
            //$scope.stageName=[];
            commonServices.getStageIdName().then(function(stageInfo) {
                console.log("stageInfo===",stageInfo);
                console.log("length stage info",stageInfo.length)

                for(var i=0; i<stageInfo.length; i++) {
                     $scope.stageName = stageInfo[i].stageName;
                    $scope.stageNameDropdown.push(stageInfo[i]);
                 }
                  var dummyObj = {
                     "stageName" : 'Select Stage Name'
                  };
                     $scope.stageNameDropdown.unshift(dummyObj);

                    console.log("$scope.stageNameDropdown",$scope.stageNameDropdown);
                    $scope.stageDropModel = $scope.stageNameDropdown[0];
                    console.log("$scope.stageDropModel",$scope.stageDropModel);
            }).catch(function(err) {
            console.error("Error fetching stage name dropdown", err);
          });
        //    var stageName = [
        //         'Survey','Proposal','Design','Post Audit'
        //      ];
        //      var dummyObj = [
        //             'Select Stage Name'
        //         ];
        //     stageName.unshift(dummyObj);
        //     $scope.stageNameDropdown = JSON.parse(JSON.stringify(stageName));
        //     $scope.stageDropModel = $scope.stageNameDropdown[0];
        //     console.log("$scope.stageDropModel",$scope.stageDropModel);
        }

        $scope.stageDropdownFunction = function (stageDropModel){
            //alert("INSIDE STAGE");
            console.log(stageDropModel.StageId,stageDropModel);
            $scope.stageValidation = stageDropModel.stageName;

            if($scope.stageDropModel != undefined) {
                $scope.statusId = stageDropModel.StageId;
            }
        }


        //END SHOW STAGE NAME DROPDOWN

        function imageDropDown() {
        $scope.imageTagID = [];

            commonServices.getImageTagData(surveyTicketSiteDet).then(function(walmartResponse) {
                console.log("$scope.imageTagID;=======",walmartResponse);
                var dummyObj = [
                    'Select Image Tag'
                ];
                walmartResponse.unshift(dummyObj);
                console.log("data==================================",walmartResponse);
                $scope.imageTagID = JSON.parse(JSON.stringify(walmartResponse));
                $scope.dropdownModel = $scope.imageTagID[0];
                console.log("$scope.dropdownModel============",$scope.dropdownModel);
          }).catch(function(err) {
            console.error("Error fetching image tag dropdown", err);
          });
        }


        $scope.imageTagfunction = function(){
             var imgUrlArray = [];
            var BlobURlImage = '';
            console.log("scope.dropdownModel.fileName",$scope.dropdownModel)
            if($scope.dropdownModel != 'Select Image Tag') {
                $('#popup-container').css({'display':'none'});
              console.log("dropdownModel------------",$scope.dropdownModel);

              commonServices.getMediaData(surveyTicketSiteDet,$scope.dropdownModel).then(function(mediaResponse) {

             // createGogleMap(false); // Recreate the map
              clearMapMarkers();
              console.log("BLOBURL=================",BlobURlImage);

              for(var i=0; i<mediaResponse.length; i++){
                   BlobURlImage = commonServices.getBlobStoreURL() +
                         "/getBlob?directory=" + mediaResponse[i].directory +
                         "&fileName=" + mediaResponse[i].fileName +
                         "&contentType=" + mediaResponse[i].contentType;

                     imgUrlArray.push(BlobURlImage);
                    BlobURlImage = '';

                 console.log("imgUrlArray", imgUrlArray);
                 $scope.imgUrlArray1 = imgUrlArray;
                 $scope.createImgOnMap(mediaResponse[i]);
              }
                 });
            }
            else{
                console.log("summaryRes.surveyTypeId",surveyTypeId);
                       solarImageLoad(surveyTicketSiteDet, surveyTypeId);
            }
        }

        $scope.createImgOnMap = function(dataTemp){
            console.log("dataTemp0000000000000",dataTemp);
            gmap = document.querySelector('google-map');
            //if(dataTemp.type_data == 'Image') {
                    var marker = document.createElement('google-map-marker');
                    marker.setAttribute('latitude', dataTemp.latitude);
                    marker.setAttribute('longitude', dataTemp.longitude);
                    marker.setAttribute('click-events', 'true');
                    marker.setAttribute('icon', 'images/camerahi.png');
                    marker.setAttribute('dataImage', JSON.stringify(dataTemp));
                    //marker.animation = "DROP";
                    Polymer.dom(gmap).appendChild(marker);
                    gmap.notifyResize();
                //}
        }

        loadMarkers();
        // SOLAR END
        function loadMarkers(outdoorsurveyDataMap) {
            console.log("INSIDE LOADMAREKRS SURVEY")
            var gmap = document.querySelector('google-map');
            var poly = document.createElement('google-map-poly');
            poly.setAttribute('closed', '');
            poly.setAttribute('fill-color','');
            poly.setAttribute('stroke-color',"red");
            poly.setAttribute('stroke-weight','2');
            poly.setAttribute('fill-opacity','.25');

            Polymer.dom(gmap).appendChild(poly);
            gmap.notifyResize();
            commonServices.getAuthToken().then(function(config) {
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId + '&fields=siteName,siteId,siteLocation,propertyLineCordinate', config).success(function(data) {
                    console.log("Inside loadMarkers",data);
                    if (data[0].propertyLineCordinate != undefined) {
                        for (var z = 0; z < data[0].propertyLineCordinate.length; z++) {
                            var polyPoint = document.createElement('google-map-point');
                            polyPoint.setAttribute('latitude', data[0].propertyLineCordinate[z].lat);
                            polyPoint.setAttribute('longitude', data[0].propertyLineCordinate[z].lng);
                            Polymer.dom(poly).appendChild(polyPoint);
                            gmap.notifyResize();
                        }
                    }
                })
                  //gmap.notifyResize();
            });
            console.log("outdoorsurveyDataMap",outdoorsurveyDataMap);

            angular.forEach(outdoorsurveyDataMap, function(item) {

        //   var marker = document.createElement('google-map-marker');

        //         //delete outdoorsurveyDataMap[item].media;

        //         marker.setAttribute('latitude', item.latitude);
        //         marker.setAttribute('longitude', item.longitude);
        //         // var hover = 'Luminaire Type : ' + item.luminaire_type + '\n' + 'Lamp Type : ' + item.lamp_type
        //         marker.setAttribute('title', "Survey Serial No - "+item.Row);
        //         marker.setAttribute('click-events', 'true');
        //         marker.setAttribute('icon', 'images/pin.png');

        //         marker.setAttribute('background-color', 'black');



        // TO DISPLAY SVG ICON for WALMART OUTDOOR



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

                // console.log("item",item);
                 $scope.item1 = item;
                 var keyData = ""
                 var tempOutSeq = [];
                 var tempOutSeq1 = [];
                 angular.forEach($scope.Outdoorsequence, function(value, key) {

                   tempOutSeq.push(value.fieldName);
                     //alert(value.fieldName);

                     tempOutSeq1.push(value.surveyTemplateFieldId);

                 });
                //alert(tempOutSeq);

                angular.forEach(item, function(value, key) {
                    var key1 = key;
                    //console.log('key : '+key1)
                    for (var i = 0; i < tempOutSeq1.length; i++) {
                        if (key != 'media' & tempOutSeq1[i] == key) {
                            keyData = keyData + '<tr><td>' + '<b>' + tempOutSeq[i] + '</b>' + '</td><td>' + value + '</td></tr>'
                        }
                    }
                });
                marker.innerHTML = '<table style="width:302px;font-family: "GE Inspira Regular", sans-serif;">' + keyData + '</table>';
                marker.animation = "DROP";

                Polymer.dom(map).appendChild(marker);
                map.notifyResize();
            });
        }

        /*  commonServices.getAssignmentGridData(ticketId).then(function(data) {
				console.log("ingetAth"+data);

                 }); */
        //$scope.existingSelectedContractorNxtStg = "Sathish";

        window.addEventListener('pt-item-confirmed', function(e) {
            //var selectedContractorForNextStage = document.querySelector('paper-typeahead-input-customerMaster').inputValue;
            var selectedContractorForNextStage = e.detail.innerText;
            var trimmedVal = selectedContractorForNextStage.trim();
            $scope.selectedContractorForNextStage = trimmedVal;
            //console.log("---selectedContractorForNextStage---",selectedContractorForNextStage);
           // $scope.selectedContractorForNextStage = selectedContractorForNextStage;
        });

        $scope.Approve = function() {
            $scope.disableApprove = true;
            console.log("$scope.stageDropModel 1612",$scope.stageDropModel)
        if($scope.stageValidation == 'Select Stage Name'){
                var popModel = document.querySelector('#invalidAlertForStage');
                popModel.toggle();
                $scope.disableApprove = false;
                return false;
        }

            // $scope.disableApprove = true;
            if ($scope.selectedContractorForNextStage != ""  ) {
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
                //alert('------'+$scope.ticketSiteComments);
                //console.log(approve)
                /* var data={
                  "ticketId":ticketId,
                  "ticketSiteDetailsId":ticketSiteDetailsId,
                  "sendBackFlag":"N"
                } */

                // ----------------------OLD Approve SYNTAX-------------------------------------
                // var data = {
                // "ticketId": ticketId,
                // "ticketSiteDetailsId": ticketSiteDetailsId,
                // "sendBackFlag": "N",
                // "ticketSiteDetailsComment": month + '-' + day + '-' + year + ' ' + hours + ':' + minutes + ':' + ampm + ':-' + $scope.ticketSiteComments,
                // "selectedContractorForNextStage": $scope.selectedContractorForNextStage
                // }

                // --------------------NEW Approve SYNTAX----------------------------
                var data = {
                        "ticketSiteDetailsId": ticketSiteDetailsId,
                        "ticketSiteDetailsComment": month + '-' + day + '-' + year + ' ' + hours + ':' + minutes + ':' + ampm + ':-' + $scope.ticketSiteComments,
                        "action": "approvedStage",
                        "selectedContractorForNextStage": $scope.selectedContractorForNextStage,
                        "selectedNextStage" : $scope.statusId
                    }
                    console.log("JSOJNDATA",data)

                // commonServices.approve(data);  // old microservice


                // ---------------NEW MICROSERVICE--------------

                //           console.log("ENERGY CODE OBJECT",energyCodeObject);
                console.log("indoor", energyCodeObjectIndoor);
                console.log("outdoor", energyCodeObjectOutdoor);
                var notIndoorCheck = angular.equals(energyCodeObjectIndoor, {});
                var notOutdoorCheck = angular.equals(energyCodeObjectOutdoor, {});
                var energyCodeObject = {};
                if (!(notIndoorCheck) && !(notOutdoorCheck)) {
                    var energyCodeArray = [];
                    console.log(energyCodeObjectIndoor.energyCodeList.length);
                    for (var i = 0; i < energyCodeObjectIndoor.energyCodeList.length; i++) {
                        //console.log("indoor array",energyCodeObjectIndoor.energyCodeList[i]);
                        energyCodeArray.push(energyCodeObjectIndoor.energyCodeList[i]);
                    }
                    for (var i = 0; i < energyCodeObjectOutdoor.energyCodeList.length; i++) {
                        //console.log("indoor array",energyCodeObjectIndoor.energyCodeList[i]);
                        energyCodeArray.push(energyCodeObjectOutdoor.energyCodeList[i]);
                    }
                    console.log("array", energyCodeArray);

                    var energyCodeList = energyCodeObjectIndoor.energyCodeList;
                    energyCodeList.concat(energyCodeObjectOutdoor.energyCodeList);
                    //console.log("list",energyCodeList);
                    var createdBy = energyCodeObjectIndoor.createdBy;
                    energyCodeObject = {
                        "energyCodeList": energyCodeArray,
                        "createdBy": createdBy
                    }

        }else if(!(notIndoorCheck) && (notOutdoorCheck)) {
            energyCodeObject = energyCodeObjectIndoor;
        }else if((notIndoorCheck) && !(notOutdoorCheck)){
            energyCodeObject = energyCodeObjectOutdoor;
        }
            console.log("object",energyCodeObject);
                $scope.disableSendBack = true;
                commonServices.saveEnergyCodes(energyCodeObject).then(function(respData1, status) {
                    if ((respData1.data.status == 'SUCCESS')) {
                        console.log("senbackrejarct-----------",data)
                        commonServices.senbackRejectApprove(data).then(function(respData, status) {
                            console.log("senbackrejarct-------------------",respData,status)
                            $scope.submitError = respData.data.msg;
                            if ((respData.data.status == 'SUCCESS')) {
                                console.log('SUCCESS Resolve');
                                var alert1 = document.querySelector('#submitAlert');
                                alert1.toggle();
                                disableControls(); // To dispable the controls
                                //$scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                                //var okRedirect = document.getElementById('okRedirect');
                                //okRedirect.setAttribute('onclick', "window.location = '/surveydetails/" + $scope.redirectPage + "'");
                            } else {
                                // var submitbtn = document.querySelector('#btnSubmit')
                                // submitbtn.setAttribute('enabled', '');
                                if(!($scope.submitError == '' || $scope.submitError == null || $scope.submitError == undefined)){
                                     $scope.msgApprove = $scope.submitError;
                                }else {
                                    $scope.msgApprove = "Data not submitted successfully";
                                }
                                var alert1 = document.querySelector('#submitAlertForFail');
                                alert1.toggle();
                                //$scope.disableApprove = false; //To enable approve button if approve condition fails
                                disableControls();
                        }
                        }).catch(function(error) {
                            console.error("Error in approving the survey--", error);
                            $scope.disableApprove = false; //To enable approve button if approve condition fails
                        });
                    }

                });

            } else {
                var popModel = document.querySelector('#invalidAlertforBoth');
                popModel.toggle();
                $scope.disableApprove = false; //To enable approve button if approve condition fails
            }
        }

        function disableControls() {
            $scope.disableApprove = true;
            $scope.disableSendBack = true;

        }


        $scope.sendBack = function() {
            $scope.disableSendBack = true;
            $scope.disableApprove = true;
            //  // alert($scope.cmts);

            ticketSiteComments = document.getElementById('myTextarea').value;
            //alert('hi from sendback surveyDetails.js --');
            console.log('ticketSiteComments--' + ticketSiteComments)


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

            // ----------------------OLD SEND BACK SYNTAX-------------------------------------

            // var data = {
            // "ticketSiteDetailsId": ticketSiteDetailsId,
            // "ticketSiteComments": day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + ampm + ':-' + ticketSiteComments
            // }


            // --------------------NEW SEND BACK SYNTAX----------------------------

            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + ampm + ':-' + ticketSiteComments,
                "action": "sendbackStage",
                "sendBackFlag": "Y",
                "sendBackComments": " "
            }
            console.log("SendBACKREJE===============787978978900000",data);
            // commonServices.sendback(data);   //----------Old microservice

            commonServices.senbackRejectApprove(data).success(function(respData,status) {
                console.log("SendBACKREJE===============00000",respData)
                //var status = respData.status;
                console.log('data ', status, 'as', respData)


                if (respData.status == "FAILED") {
                    $scope.msgSendBack = respData.msg;
                    $scope.isSent = false;
                    $scope.disableApprove = true; //To enable submit button if approve condition fails
                    $scope.disableSendBack = true; //To enable sendback button if approve condition fails
                } else if(respData.status == "SUCCESS") {
                    $scope.disableSendBack = true; // To disable enable send back button..
                    $scope.disableApprove = true; // To disable enable approve button..
                    $scope.msgSendBack = 'Survey sent back successfully!';
                    $scope.isSent = true;
                }

            }).error(function(error) {
                console.error("Error in sending back the survey--", error);
                $scope.msgSendBack = "Survey could not be sent back!";
                $scope.isSent = false;
                $scope.disableApprove = false; //To enable approve button if approve condition fails
                $scope.disableSendBack = false; //To enable sendback button if approve condition fails
            });

            $timeout(function() {
                $scope.msgSendBack = '';
            }, 5000);

            // $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
            // var sbRedirect = document.getElementById('sbRedirect');
            // sbRedirect.setAttribute('onclick', "window.location = '/pmviewsurvey'"); //for redirectPage


        }
        $scope.$on("ReturnOutdoorCompleted", function() {
            //alert('as');

            loadMarkers($scope.outdoorData);
            console.log("INSIDE ReturnOutdoorCompleted",$scope.outdoorData);
            var excelData = $scope.outdoorData;
            angular.forEach($scope.Outdoorsequence, function(value, key) {
                //console.log('id'+value.surveyTemplateFieldId);
                //console.log('field'+value.fieldName);
                excelData = JSON.parse(JSON.stringify(excelData).split('"' + value.surveyTemplateFieldId + '":').join('"' + value.fieldName + '":'));
                //$scope.sequence[key].image='';
                console.log($scope.Indoorsequence);

            });
            // for (var i = 0; i < excelData.length; i++) {
            // delete excelData[i].media;
            // delete excelData[i].image;
            // }

            for (var i = 0; i < excelData.length; i++) {
                delete excelData[i].media;
                delete excelData[i].Image;
            }
            console.log(excelData)
            $scope.excelData1 = excelData;


            $('#outdoorExport').click(function() {
                // var data = $('#txt').val();
                if ($scope.outdoorExcelData == '')
                    return;

                JSONToCSVConvertor($scope.excelData1, "Survey", true);
            });
            //// alert('in');
            //// alert($scope.Outdoorsequence)
            $scope.outdoorSurveyTableData();

});

            //OUTDOOR SURVEY DATA TAB
            $scope.surveyTblCreated = false;

            $scope.outdoorSurveyTableData = function(){

                if(surveyTypeId == 9){
                    $scope.outdoorData = $scope.solarRespData;
                }

                //console.log("Inside outdoorSurveyTableData",$scope.outdoorData);
                commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {

             var surveyTypeId = data.surveyTypeId;
             console.log("surveyTypeId",surveyTypeId)
             $scope.surveyTypeIdWalmart = surveyTypeId;
           if(surveyTypeId == 6){
                 //surveyTypeId = 4;
                 for( var i=0; i<data.surveyList.length; i++){
                     if(data.surveyList[i].surveyTypeNm == "WALMART - Outdoor")
                 surveyTypeId = data.surveyList[i].surveyTypeId;
            commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        console.log("getFieldsForSurvey============",data);
                        $scope.Outdoorsequence = data;
                 $scope.hideWalmart = true;


                $scope.showWalmart = false;
             var outdoorTable = document.getElementById("outdoorTable");


             console.log("$scope.outdoorData",$scope.outdoorData,$scope.Outdoorsequence)
             if(!$scope.surveyTblCreated){
                console.log("$scope.surveyTblCreated",$scope.surveyTblCreated,$scope.Outdoorsequence,$scope.outdoorData);
                angular.forEach($scope.Outdoorsequence, function(value, key) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', value.surveyTemplateFieldId);
                console.log("value.fieldName=============",value.fieldName)
                //$scope.tempOutseq.push(value.fieldName);

                colOut.setAttribute('label', value.fieldName);
                colOut.setAttribute('sortable', true);
                colOut.setAttribute('type', 'html');
                Polymer.dom(outdoorTable).appendChild(colOut);
                 $scope.surveyTblCreated = true;
                flagOutdoor = 1;
            });
            if (flagOutdoor == 1) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', 'createdBy');
                colOut.setAttribute('label', 'Created By');
                colOut.setAttribute('sortable', true);
                colOut.setAttribute('type', 'html');
                Polymer.dom(outdoorTable).appendChild(colOut);
                 $scope.surveyTblCreated = true;
            }
            }
            $timeout(function(){
            $scope.showOutdoor = true;
            outdoorTable.setAttribute("table-data", JSON.stringify($scope.outdoorData));
            },200)
            document.getElementById('outdoorId').style.background = "#47575C";
            document.getElementById('walmartId').style.background = 'grey';

       // });
            //}
            });
                }
                }else{
                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        console.log("getFieldsForSurvey============",data);
                        $scope.Outdoorsequence = data;
                 $scope.hideWalmart = true;
                 console.log("$scope.hideWalmart========",$scope.hideWalmart);

                $scope.showWalmart = false;
             var outdoorTable = document.getElementById("outdoorTable");

            // console.log($scope.Outdoorsequence);
             console.log("$scope.outdoorData",$scope.outdoorData)
             if(!$scope.surveyTblCreated){
                console.log("$scope.surveyTblCreated",$scope.surveyTblCreated,$scope.Outdoorsequence,$scope.outdoorData);
                angular.forEach($scope.Outdoorsequence, function(value, key) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', value.surveyTemplateFieldId);
                //console.log("value.fieldName=============",value.fieldName)
                //$scope.tempOutseq.push(value.fieldName);

                colOut.setAttribute('label', value.fieldName);
                colOut.setAttribute('sortable', true);
                colOut.setAttribute('type', 'html');
                Polymer.dom(outdoorTable).appendChild(colOut);
                 $scope.surveyTblCreated = true;
                flagOutdoor = 1;
            });
            if (flagOutdoor == 1) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', 'createdBy');
                colOut.setAttribute('label', 'Created By');
                colOut.setAttribute('sortable', true);
                colOut.setAttribute('type', 'html');
                Polymer.dom(outdoorTable).appendChild(colOut);
                 $scope.surveyTblCreated = true;
            }
            }
            $timeout(function(){
            $scope.showOutdoor = true;
            outdoorTable.setAttribute("table-data", JSON.stringify($scope.outdoorData));
            },200)
            document.getElementById('outdoorId').style.background = "#47575C";
            document.getElementById('walmartId').style.background = 'grey';
            });
                }
                });
            }


         //$scope.outdoorSurveyTableData();
        $scope.outdoorData = [];
        ////OUTDOOR SURVEY DATA TAB END

        //AGGREGATWD SURVEY DATA TAB
        $scope.walmartOutdoor = function(){

		$scope.showWalmart = true;
		$scope.showOutdoor = false;
        console.log("NG change");
 		//var surveyTypeId = $scope.surveyTypeIdwalmart;
         commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
            console.log("commonServices Survey type",data);
             var surveyTypeId = data.surveyTypeId;
             console.log("surveyTypeId",surveyTypeId)
             $scope.surveyTypeIdWalmart = surveyTypeId;
         if(surveyTypeId == 6){
                 //surveyTypeId = 4;
                 for( var i=0; i<data.surveyList.length; i++){
                     if(data.surveyList[i].surveyTypeNm == "WALMART - Outdoor")
                 surveyTypeId = data.surveyList[i].surveyTypeId;

               commonServices.getAggregatedSurveyData(ticketSiteDetailsId, surveyTypeId).then(function(walmartResponse) {
               console.log("response---",walmartResponse);
               createDataTable(walmartResponse);
               var dropdownOutdoorTable = document.getElementById("dropdownOutdoorTable");
               $timeout(function(){
                        $scope.showWalmart = true;
                        dropdownOutdoorTable.setAttribute("table-data", JSON.stringify(walmartResponse));
                },200)
                document.getElementById('outdoorId').style.background = 'grey ';
                document.getElementById('walmartId').style.background = '#47575C';
            });
        }
    }else{
        commonServices.getAggregatedSurveyData(ticketSiteDetailsId, surveyTypeId).then(function(walmartResponse) {
               console.log("response---",walmartResponse);
               createDataTable(walmartResponse);
               var dropdownOutdoorTable = document.getElementById("dropdownOutdoorTable");
               $timeout(function(){
                        $scope.showWalmart = true;
                        dropdownOutdoorTable.setAttribute("table-data", JSON.stringify(walmartResponse));
                },200)
                document.getElementById('outdoorId').style.background = 'grey ';
                document.getElementById('walmartId').style.background = '#47575C';
            });
        }
         });
       }

       $scope.outdoorTblCreated = false;
       function createDataTable(a_data, a_tableId) {
            var surveyOutdoor = surveyOutdoor = document.querySelector('#dropdownOutdoorTable');
	        if(!$scope.outdoorTblCreated) {
            for (var key in a_data[0]) {
               var column = document.createElement('px-data-table-column');
               column.setAttribute('name', key);

               for(var i=0;i<$scope.Outdoorsequence.length; i++){
                  if(key == $scope.Outdoorsequence[i].surveyTemplateFieldId){
                        column.setAttribute('label', $scope.Outdoorsequence[i].fieldName);
                        console.log("$scope.Outdoorsequence[i].fieldName-------",$scope.Outdoorsequence[i].fieldName)
                  }
                }
                    column.setAttribute('filterable', '');
                    column.setAttribute('sortable', '');
                    column.setAttribute('type', 'html');
                    Polymer.dom(surveyOutdoor).appendChild(column);
                    $scope.outdoorTblCreated = true;
            }
        }
    }
    //AGGREGATWD SURVEY DATA TAB END


$scope.indoorTblCreated = false; // To avoid duplicate creation of table column.
        function loadIndoorTable(a_data) {
            // // alert('indoorin')
            console.log("$scope.Indoorsequence0000000000000000", $scope.Indoorsequence);
            var indoorTable = document.getElementById("indoorTable");
            indoorTable.setAttribute("table-data", JSON.stringify(a_data));
            // console.log(JSON.stringify($scope.sequence));
            if (!$scope.indoorTblCreated) {
                angular.forEach($scope.Indoorsequence, function(value, key) {
                    var colIn = document.createElement('px-data-table-column');
                    colIn.setAttribute('name', value.surveyTemplateFieldId);
                    colIn.setAttribute('label', value.fieldName);
                    colIn.setAttribute('type', 'html');
                    colIn.setAttribute('sortable', true);

                    flagIndoor = 1;
                    Polymer.dom(indoorTable).appendChild(colIn);
                });
                $scope.indoorTblCreated = true


                if (flagIndoor == 1) {
                    var colIn = document.createElement('px-data-table-column');
                    colIn.setAttribute('name', 'createdBy');
                    colIn.setAttribute('label', 'Created By');
                    colIn.setAttribute('sortable', true);
                    Polymer.dom(indoorTable).appendChild(colIn);
                }
            }
        };


        $scope.$on("ReturnMainCompleted", function() {
            var mainTable = document.getElementById("mainTable");
            mainTable.setAttribute("table-data", JSON.stringify($scope.mainData));

            angular.forEach($scope.Mainsequence, function(value, key) {
                var colIn = document.createElement('px-data-table-column');
                colIn.setAttribute('name', value.surveyTemplateFieldId);
                colIn.setAttribute('label', value.fieldName);
                colIn.setAttribute('sortable', true);
                Polymer.dom(mainTable).appendChild(colIn);
            });
        });

        // Indoor survey floor plan code

        $scope.$on('$locationChangeStart', function(angularEvent, next, current) {

            $scope.showFloorPlanImage = false;
            $('.viewport img').remove();
            angularEvent = null;
            next = null;
            current = null;
        });

        //--------------------------------------------------------------------------------------------------------------
        // Function: hideImage
        //   To Hide the floor plan loaded.
        //
        // Parameters:
        //   No Parameters.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.hideImage = function() {
            $scope.showFloorPlanImage = false;
            $('.viewport img').remove(); // Remove the floor plan image added in view port.
            // Hide all the drop downs and button.
            $scope.showFloors = false;
            $scope.showSections = false;
            $scope.isAllSelected = false;
        }

        $scope.showTabThree = false; // To show/hide contents of Tab 3.
        //--------------------------------------------------------------------------------------------------------------
        // Function: showTab3
        //   To display content of Tab 3
        //
        // Parameters:
        //   No Parameters.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.showTab3 = function() {
            $scope.showTabThree = true;
            $('#tab3').css('display', 'block');
            getStation(); // get all the stattion for a particular site.
        }

        //--------------------------------------------------------------------------------------------------------------
        // Function: showPlanImage
        //   To display the floor plan image.
        //
        // Parameters:
        //   a_coordinatesData - Coordinates of the points to be plotted on image.
        //   a_BlobURl - Blob URL for the floor plan image.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.showPlanImage = function(a_coordinatesData, a_BlobURl) {
            if ($('#imageNotes').length) {
                $('#imageNotes').remove();
            }
            var image = document.createElement("img");
            image.id = 'imageNotes';
            image.src = a_BlobURl;
            image.style.cssText = 'padding-right:30px;';
            $('#imagediv').append(image);
            var $img = $("#imageNotes").imgNotes();
            $img.imgNotes("import", a_coordinatesData);
            $scope.showFloorPlanImage = true;
            $('#imageNotes').css('visibility', 'hidden'); // Hide the background image.
            $('span.marker.black').css('font-size', '0'); // Hide the text on markers

        }

        $scope.showMessage = false; // Hide the span which shows the messages on error.

        //--------------------------------------------------------------------------------------------------------------
        // Function: showFloorPlan
        //   To display floor plan image with all the data neccessary like marker popup and coordinates data.
        //
        // Parameters:
        //   a_sectionDetail - Selected section data.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.showFloorPlan = function(a_sectionDetail) {
            var BlobURl = null, // Blob URL.
                tempMarkerData = {}, // Temp obj.
                tr = '', // table row data for marker popup.
                selectedImageCoords = [];

            if (a_sectionDetail.sectionId == "Select Section" || $scope.station.stationName === "Select Station" ||
                $scope.floorsModel.floorNo === 'Select Floor No') {
                $scope.showMessage = true;
                $scope.errorMessage = 'Please select values from all drop down..';
                $scope.isAllSelected = false;
                return;
            } else {
                $scope.showMessage = false;
                $scope.isAllSelected = true;
            }

            BlobURl = commonServices.getBlobStoreURL() + '/getBlob?directory=' + a_sectionDetail.directory + '&fileName=' + a_sectionDetail.fileName + '&contentType=image/png';
            BlobURl = BlobURl + "?random=" + new Date().getTime();
            $scope.markers = [];
            commonServices.getIndoorData(ticketSiteDetailsId, $scope.surveyTypeIdForFloor).then(function(imgCoord) {
                var imgCoord = getCurrentPlottedData(imgCoord);
                console.log('Image coords after filtration', imgCoord);
                $scope.imgCoord = imgCoord;
                for (var index = 0; index < imgCoord.length; index++) {
                    if (imgCoord[index].hasOwnProperty('positionX') && imgCoord[index].hasOwnProperty('positionY')) {
                        tr = getFixtureMetaData(imgCoord[index]);
                        tempMarkerData = {
                            x: (imgCoord[index].positionX),
                            y: (imgCoord[index].positionY),
                            row: imgCoord[index].Row,
                            note: '<table>' + tr + '</table>'
                        }
                        $scope.markers.push(tempMarkerData);
                        tempMarkerData = {};
                    }
                }
                $scope.showPlanImage($scope.markers, BlobURl);
            });
        }

        //--------------------------------------------------------------------------------------------------------------
        // Function: getCurrentPlottedData
        //   Returns array of x, y positions for the current selected floor details.
        //
        // Parameters:
        //   a_allData - All data for selected sitedetails id.
        // Returns:
        //   Array of coordinates values plotted.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------

        function getCurrentPlottedData(a_allData) {
            var currentImgCord = [];

            a_allData.forEach(function(obj, index) {
                if (obj.station == $scope.station.stationId && obj.floor == $scope.floorsModel.floorNo &&
                    obj.section == $scope.sectionsModel.sectionId &&
                    obj.hasOwnProperty('positionX') && obj.hasOwnProperty('positionY')) {

                    currentImgCord.push(obj);
                }
            });
            loadIndoorTable(currentImgCord);
            return currentImgCord;
        }

        //--------------------------------------------------------------------------------------------------------------
        // Function: getFixtureMetaData
        //   Returns fixtures meta data per plotting.
        //
        // Parameters:
        //   a_data - Current fixture.
        // Returns:
        //   tr - Table row data.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------

        function getFixtureMetaData(a_data) {
            var tempObj = {}, // Temp obj.
                tableData = [], // Table data.
                tr = '', // Table row data.
                metaKey = null, // Temp meta data key.
                key = null; // Meta key.

            for (var key in a_data) {
                metaKey = getKeyToDisplay(key);
                tempObj = {
                    [metaKey]: a_data[key]
                }
                tableData.push(tempObj);
                tempObj = {};
            }

            tableData.forEach(function(data, index) {
                key = Object.keys(data)[0];
                tr = tr + '<tr><td>' + '<b>' + key + '</b>' + '</td><td>' + data[key] + '</td></tr>';
            });
            return tr;
        }
        // A map which holds the text to be displyed instead of the key for the fixture meta data.
        var metaDataKeyMap = {
            'location': 'Location',
            'location_detail': 'Location Detail',
            'dimming': 'Dimming',
            'number_of_rows': 'Number Of Rows',
            'fixture_qty': 'Fixture Qty',
            'lamps_per_fixture': 'Lamps Per Fixture',
            'technology': 'Technology',
            'existing_lamp_selection': 'Existing Lamp Selection',
            'mounting_height': 'Mounting Height (ft)',
            'ballast_factor': 'Ballast Factor',
            'positionX': 'Position X',
            'positionY': 'Position Y',
            'station': 'Station',
            'floor': 'Floor',
            'section': 'Section',
            'createdBy': 'Created',
            'media': 'Image',
            'Row': 'Row'
        }

        //--------------------------------------------------------------------------------------------------------------
        // Function: getKeyToDisplay
        //   Returns the fixture meta data key to be displayed
        //
        // Parameters:
        //   a_key - JSON key
        // Returns:
        //  Key to be displayed to user.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        function getKeyToDisplay(a_key) {
            if (metaDataKeyMap.hasOwnProperty(a_key)) {
                return metaDataKeyMap[a_key];
            } else {
                return a_key;
            }
        }
$scope.stationData = [];
        $scope.errorMessage = ''; // Error message to be displayed if any error occurs.

        //--------------------------------------------------------------------------------------------------------------
        // Function: getStation
        //   Get the stations based on the site id.
        //
        // Parameters:
        //   a_siteid - Site ID.
        // Returns:
        //  Key to be displayed to user.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        function getStation(a_siteid) {
           // $scope.siteId = a_siteid; // Set the site id on scope for further excess.
            $scope.stationData = [];
            $scope.stationData[0] = { stationName: "Select Station" };
            $scope.station = $scope.stationData[0];
            var URL = adminServices.getAssetURL() + '/station?filter=siteId=' + $scope.siteIdFromJobId + '<parent[t3]';
            console.log("URL",URL)
            $http.get(URL, $scope.config).success(function(data) {
                console.log("data",data)
                if (data.length === 0 || data === undefined) {
                    $scope.showMessage = true;
                    $scope.errorMessage = 'No data found to access floor plan..';
                    return;
                } else {

                    $scope.showMessage = false;
                    $scope.errorMessage = '';
                        data.forEach(function(obj, index) {
                    $scope.stationData.push(obj);
                });
                }

            }).error(function(error) {
                console.error('station data not fetched..', error);
            });
        }


        //--------------------------------------------------------------------------------------------------------------
        // Function: getFloors
        //   Get the floors based on the station id.
        //
        // Parameters:
        //   a_stationObj - Selected station Obj.
        // Returns:
        //  Key to be displayed to user.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.getFloors = function(a_stationObj) {
            console.log("a_stationObj",a_stationObj)
            var floors = null; // Floors for the particular station.

            if (a_stationObj.stationName == "Select Station" || a_stationObj === undefined) {
                $scope.showMessage = true;
                $scope.errorMessage = 'Please select station to proceed..';
                return;
            } else {
                $scope.showMessage = false;
                $scope.errorMessage = '';
            }
            floors = a_stationObj['floor'];
            if (floors.length === 0) {
                $scope.showMessage = true;
                $scope.errorMessage = 'Floor data not found for the selected station..';
                return;
            } else {
                $scope.showMessage = false;
                $scope.errorMessage = '';
            }
            $scope.floors = [];
            $scope.floors[0] = { floorNo: 'Select Floor No' };
            $scope.floorsModel = $scope.floors[0];
            floors.forEach(function(obj, index) {
                $scope.floors.push(obj);
            });
            $scope.showFloors = true; // Show the dropdown for selecting floors.
        }

        //--------------------------------------------------------------------------------------------------------------
        // Function: getSection
        //   Get the sections based on the floors selected.
        //
        // Parameters:
        //   a_floorData - Selected floor Obj.
        // Returns:
        //  Key to be displayed to user.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.getSection = function(a_floorData) {
                var sections = null; // Sections for a floor.

                if (a_floorData.floorNo == "Select Floor No" || a_floorData === undefined) {
                    $scope.showMessage = true;
                    return;
                }
                sections = a_floorData['section'];
                if (sections.length === 0) {
                    $scope.showMessage = true;
                    $scope.errorMessage = 'Section data not found for the selected floor..';
                    return;
                } else {
                    $scope.showMessage = false;
                    $scope.errorMessage = '';
                }
                $scope.sections = [];
                $scope.sections[0] = { sectionId: 'Select Section' };
                sections.forEach(function(obj, index) {
                    $scope.sections.push(obj);
                });
                $scope.sectionsModel = $scope.sections[0];
                $scope.showSections = true;
            }
            // To show the button to load the floor plan.
        $scope.showApplyButton = function() {
            $scope.isAllSelected = true; // Show the button.
        }

        /*  Indoor survey floor plan code END */


/****************************** below POORNA'S CODE*******************************/

        //Generate PDF
            var docDefination = {"docDefinition":[],"styles":{}};
            var docDefinition = {};

            $scope.getPdfData = function (){
               docDefinition['content'] = [];
                docDefinition['header'] = [];
                var spinner = document.getElementById('spinnerPdf');
                //spinner.setAttribute('active', '');
                 spinner.removeAttribute('active', '');
                    var mainHeader = { text: 'SOLAR', style: 'headerMain' };
                     var solarData1 = {
                        main_survey: []
                    }
                    docDefinition.content.push(mainHeader);
                    var pdfPopUp = document.querySelector('#pdfPopUp');
                    pdfPopUp.toggle();
             commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
              $scope.pdfSurveyTypeId = data.surveyList;

             console.log("surveyType Id00000000",$scope.surveyTypeIdWalmart);
          commonServices.getPdfData(ticketSiteDetailsId, $scope.surveyTypeIdWalmart).then(function(pdfData){
                solarData1.main_survey.push(pdfData);
                    var basicInformation = solarData1.main_survey[0];
                    console.log("basic infor0000000000",basicInformation);
                    var dataForPdf = [];
                    for (var key in basicInformation) {
                       var keys = Object.keys(basicInformation[key]);
                       var dataForPdf = basicInformation[key];
                        console.log("pdf", dataForPdf);
                        var finalPdfHeader = {
                            text: basicInformation[key].name,
                            text: basicInformation[key].value,
                            style: 'header'
                        }
                        var finalPdfData = {
                            table: {
                                body: pdfData
                            },
                            layout: 'noBorders'
                        }
                        docDefinition.content.push(finalPdfHeader);
                        docDefinition.content.push(finalPdfData);
                    }
                    console.log(docDefinition.content);
              });
            })
            }


    $scope.generatePDF = function(pdfData) {
            docDefinition.styles = {
                header: {
                    fontSize: 15,
                    bold: true,
                    background: '#ff1',
                    margin: [0, 20, 0, 8]
                },
                headerMain: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'center',
                    color: '#ff9821'
                },
                tableHeader: {
                    color: 'white',
                    fillColor: '#8b8d8f',
                    fontSize: 8,
                    bold: true
                },
                tableHeaderVertical: {
                    bold: true,
                    fontSize: 10,
                    margin: [0, 10, 0, 8]
                },
                tableRows: {
                    fontSize: 10,
                    margin: [0, 10, 0, 8]
                }
            }

            pdfMake.createPdf(docDefinition).download('Solar.pdf');
            console.log(docDefinition)
        }

/****************************** above POORNA'S CODE*******************************/

   /*     //Generate PDF
       $scope.solarData = [];
        $scope.dataForPdf = [];
        var docDefinition = {};
        $scope.getSolarData = function() {
            docDefinition['content'] = [];

            var spinner = document.getElementById('spinnerPdf');
            spinner.setAttribute('active', '');

            $http.get('../sample-data/fan-vibration-cruise.json')
                .success(function(solarData) {
                    spinner.removeAttribute('active', '');
                    var mainHeader = { text: 'SOLAR', style: 'headerMain' };
                    docDefinition.content.push(mainHeader);
                    var solarData1 = {
                        main_survey: []
                    }
                    var solarPdfData1 = {}
                        // solarPdfData1['basicInfo'] = solarData.main_survey[0];
                        // if (solarData.main_survey.length == 0) {
                        //     var dialogPdf = document.querySelector('#dialogPdf');
                        //     dialogPdf.toggle();
                        //     return false;
                        // }
                    var pdfPopUp = document.querySelector('#pdfPopUp');
                    pdfPopUp.toggle();
                    //var surveyIdOut;
                    commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
                        $scope.pdfSurveyTypeId = data.surveyTypeId;
                        console.log("surveyType Id00000000",$scope.surveyTypeIdWalmart);
                    commonServices.getPdfData(ticketSiteDetailsId, $scope.surveyTypeIdWalmart).then(function(solarPdfData)


                    var solarPdfData = {
                        basicInfo: {
                            customer: 'Walmart',
                            projectName: 'outdoor',
                            Title: 'Walmart',
                            Phone: 'outdoor',
                            Email: 'Walmart',
                            LegalEntity: 'outdoor',
                            Proposed: 'Walmart'

                        },
                        custUtility: {
                            Utility: 'Walmart',
                            UtilityAccMgr: 'Walmart',
                            AvgElecRates: 'Walmart',
                            avgAnnualElecRates: 'Walmart',
                            anyUtitlityRequirements: 'Walmart'
                        },
                        custUtility1: {
                            Utility: 'Walmart',
                            UtilityAccMgr: 'Walmart',
                            AvgElecRates: 'Walmart',
                            avgAnnualElecRates: 'Walmart',
                            anyUtitlityRequirements: 'Walmart'
                        },
                        custUtility10: {
                            Utility: 'Walmart',
                            UtilityAccMgr: 'Walmart',
                            AvgElecRates: 'Walmart',
                            avgAnnualElecRates: 'Walmart',
                            requirements: {
                                UtilityAccMgr: 'Walmart',
                                AvgElecRate: 'Walmart',
                                UtilityAccMg: 'Walmart',
                                AvgElecRates: 'Walmart',
                                avgAnnualElecRates: 'Walmart'
                            }
                        },
                        custUtility101: {
                            Utility: 'Walmart',
                            UtilityAccMgr: 'Walmart',
                            AvgElecRates: 'Walmart',
                            avgAnnualElecRates: 'Walmart'
                        }
                    }



                    solarData1.main_survey.push(solarPdfData);
                    var basicInformation = solarData1.main_survey[0];
                    console.log("basic infor0000000000",basicInformation);
                    $scope.solarData = basicInformation;
                    var dataPdf = [];
                    var dataForPdf = [];
                    var nestedDataForPdf = [];
                    var nestedDataPdf = [];
                    var nestedPdfData = [];
                    for (var key in basicInformation) {
                        for (var key1 in basicInformation[key]) {
                            console.log(typeof(key1));
                            if (typeof(basicInformation[key][key1]) == 'object') {
                                for (var key2 in basicInformation[key][key1]) {

                                    $scope.headers = {
                                        AvgElecRates: 'Average Electric Rates'
                                    };


                                    nestedDataForPdf = [{
                                            text: key2,
                                            fontSize: 14
                                        },
                                        {
                                            text: basicInformation[key][key1][key2],
                                            fontSize: 14
                                        }
                                    ];
                                    nestedDataPdf.push(nestedDataForPdf);
                                    nestedDataForPdf = [];
                                }

                                nestedPdfData = {
                                    table: {
                                        body: nestedDataPdf
                                    },
                                    layout: 'noBorders'
                                }

                                nestedDataPdf = [];
                                dataForPdf = [{
                                    text: key1,
                                    // fontSize: 14,
                                    style: {
                                        fontSize: 15,
                                        bold: true,
                                        background: '#ff1',
                                        margin: [0, 20, 0, 8]
                                    }
                                }]
                                dataForPdf.push(JSON.parse(JSON.stringify(nestedPdfData)));
                                dataPdf.push(JSON.parse(JSON.stringify(dataForPdf)));
                                dataForPdf = [];
                            } else {
                                dataForPdf = [{
                                    text: key1,
                                    fontSize: 14
                                }, {
                                    text: basicInformation[key][key1],
                                    fontSize: 14
                                }]
                                dataPdf.push(JSON.parse(JSON.stringify(dataForPdf)));
                                dataForPdf = [];
                            }
                        }

                        var finalPdfHeader = {
                            text: key,
                            style: 'header'
                        }
                        var finalPdfData = {
                            table: {
                                body: dataPdf
                            },
                            layout: 'noBorders'
                        }
                        docDefinition.content.push(finalPdfHeader);
                        docDefinition.content.push(finalPdfData);
                        dataPdf = [];

                    }
                    console.log(docDefinition.content);
              });
                      });
            }).error(function() {
                    console.log('error');
                });

        }

        $scope.generatePDF = function(data) {

            docDefinition.styles = {
                header: {
                    fontSize: 15,
                    bold: true,
                    background: '#ff1',
                    margin: [0, 20, 0, 8]
                },
                headerMain: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'center',
                    color: '#ff9821'
                },
                tableHeader: {
                    color: 'white',
                    fillColor: '#8b8d8f',
                    fontSize: 8,
                    bold: true
                },
                tableHeaderVertical: {
                    bold: true,
                    fontSize: 10,
                    margin: [0, 10, 0, 8]
                },
                tableRows: {
                    fontSize: 10,
                    margin: [0, 10, 0, 8]
                }
            }

            pdfMake.createPdf(docDefinition).download('Solar.pdf');

        }*/


        // //SOlAR PDF trail............ 11-07-2017****************//


        // $scope.solarData = [];
        // $scope.dataForPdf = [];
        // var docDefinition = {};
        // $scope.getSolarData = function() {
        //     docDefinition['content'] = [];

        //     var spinner = document.getElementById('spinnerPdf');
        //     spinner.setAttribute('active', '');

        //     $http.get('../sample-data/fan-vibration-cruise.json')
        //         .success(function(solarData) {
        //             spinner.removeAttribute('active', '');
        //             var mainHeader = { text: 'SOLAR', style: 'headerMain' };
        //             docDefinition.content.push(mainHeader);
        //             var solarData1 = {
        //                 main_survey: []
        //             }
        //             var solarPdfData1 = {}
        //                 // solarPdfData1['basicInfo'] = solarData.main_survey[0];
        //                 // if (solarData.main_survey.length == 0) {
        //                 //     var dialogPdf = document.querySelector('#dialogPdf');
        //                 //     dialogPdf.toggle();
        //                 //     return false;
        //                 // }
        //             var pdfPopUp = document.querySelector('#pdfPopUp');
        //             pdfPopUp.toggle();
        //             //var surveyIdOut;
        //             commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
        //                 $scope.pdfSurveyTypeId = data.surveyTypeId;
        //                 console.log("surveyType Id00000000",$scope.surveyTypeIdWalmart);
        //            // commonServices.getPdfData(ticketSiteDetailsId, $scope.surveyTypeIdWalmart).then(function(solarPdfData)

        //            commonServices.getFieldNameForSolarPDF(ticketSiteDetailsId, $scope.pdfSurveyTypeId).then(function(fieldNameData) {
        //            commonServices.getDataForSolarPDF($scope.pdfSurveyTypeId).then(function(solarPdfData) {
        //                console.log("solarPdfData",solarPdfData);
        //            });
        //         });

        //             solarData1.main_survey.push(solarPdfData);
        //             var basicInformation = solarData1.main_survey[0];
        //             console.log("basic infor0000000000",basicInformation);
        //             $scope.solarData = basicInformation;
        //             var dataPdf = [];
        //             var dataForPdf = [];
        //             var nestedDataForPdf = [];
        //             var nestedDataPdf = [];
        //             var nestedPdfData = [];
        //             for (var key in basicInformation) {
        //                 for (var key1 in basicInformation[key]) {
        //                     console.log(typeof(key1));
        //                     if (typeof(basicInformation[key][key1]) == 'object') {
        //                         for (var key2 in basicInformation[key][key1]) {

        //                             $scope.headers = {
        //                                 AvgElecRates: 'Average Electric Rates'
        //                             };


        //                             nestedDataForPdf = [{
        //                                     text: key2,
        //                                     fontSize: 14
        //                                 },
        //                                 {
        //                                     text: basicInformation[key][key1][key2],
        //                                     fontSize: 14
        //                                 }
        //                             ];
        //                             nestedDataPdf.push(nestedDataForPdf);
        //                             nestedDataForPdf = [];
        //                         }

        //                         nestedPdfData = {
        //                             table: {
        //                                 body: nestedDataPdf
        //                             },
        //                             layout: 'noBorders'
        //                         }

        //                         nestedDataPdf = [];
        //                         dataForPdf = [{
        //                             text: key1,
        //                             // fontSize: 14,
        //                             style: {
        //                                 fontSize: 15,
        //                                 bold: true,
        //                                 background: '#ff1',
        //                                 margin: [0, 20, 0, 8]
        //                             }
        //                         }]
        //                         dataForPdf.push(JSON.parse(JSON.stringify(nestedPdfData)));
        //                         dataPdf.push(JSON.parse(JSON.stringify(dataForPdf)));
        //                         dataForPdf = [];
        //                     } else {
        //                         dataForPdf = [{
        //                             text: key1,
        //                             fontSize: 14
        //                         }, {
        //                             text: basicInformation[key][key1],
        //                             fontSize: 14
        //                         }]
        //                         dataPdf.push(JSON.parse(JSON.stringify(dataForPdf)));
        //                         dataForPdf = [];
        //                     }
        //                 }

        //                 var finalPdfHeader = {
        //                     text: key,
        //                     style: 'header'
        //                 }
        //                 var finalPdfData = {
        //                     table: {
        //                         body: dataPdf
        //                     },
        //                     layout: 'noBorders'
        //                 }
        //                 docDefinition.content.push(finalPdfHeader);
        //                 docDefinition.content.push(finalPdfData);
        //                 dataPdf = [];

        //             }
        //             console.log(docDefinition.content);
        //       });
        //               });
        //     }).error(function() {
        //             console.log('error');
        //         });

        // }


        //      $scope.generatePDF = function(data) {

        //     docDefinition.styles = {
        //         header: {
        //             fontSize: 15,
        //             bold: true,
        //             background: '#ff1',
        //             margin: [0, 20, 0, 8]
        //         },
        //         headerMain: {
        //             fontSize: 20,
        //             bold: true,
        //             alignment: 'center',
        //             color: '#ff9821'
        //         },
        //         tableHeader: {
        //             color: 'white',
        //             fillColor: '#8b8d8f',
        //             fontSize: 8,
        //             bold: true
        //         },
        //         tableHeaderVertical: {
        //             bold: true,
        //             fontSize: 10,
        //             margin: [0, 10, 0, 8]
        //         },
        //         tableRows: {
        //             fontSize: 10,
        //             margin: [0, 10, 0, 8]
        //         }
        //     }

        //     pdfMake.createPdf(docDefinition).download('Solar.pdf');

        // }
    }]);
});