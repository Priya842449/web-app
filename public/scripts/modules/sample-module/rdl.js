/**
 * Renders all the widgets on the tab and triggers the datasources that are used
 * by the widgets. Customize your widgets by: - Overriding or extending widget
 * API methods - Changing widget settings or options
 */
/* jshint unused: false */
define(
    ['angular', './sample-module'],
    function(angular, controllers) {
        'use strict';
        // Controller definition
        controllers.controller('RDLCtrl', ['$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices','flowServices','flowConstant', function($http, $log, PredixAssetService, $rootScope, $scope, commonServices,flowServices,flowConstant) {

            //$scope.completedsurvey = [{"ticketId":"64"}];
            //$scope.finaldata=[];

            var dynamicURL = commonServices.getAssetURL() + "/site?filter=";
            var pmList = [];
			var pmcompleted=[]
			var ssoObj=window.localStorage.getItem("SSO_ID");
			function SortById(x,y)
			{
				return ((x.ticketId == y.ticketId) ? 0 : ((x.ticketId > y.ticketId) ? 1 : -1 ));
			}

            commonServices.getSiteListForRDL(ssoObj, "Survey", "Completed").then(function(data) {
                console.log("getSiteListForRDL",data)

                commonServices.setData(data);
				data=data.concat(pmcompleted)
                commonServices.setData(data);

                var pmviewData = data;
                var length = pmviewData.length;
                angular.forEach(data, function(value, key) {
                    var trimsiteid = value.siteId;
                    var siteId = trimsiteid.trim();
                    //console.log(JSON.stringify(data));
                    pmviewData[key].ticketId = "<a href=/surveydetails/" + value.ticketId + "/" + siteId + "/" + value.ticketSiteDetailsId + " ui-sref=surveydetails({ticketId:'" + value.ticketId + "/" + value.siteId + "/" + value.ticketSiteDetailsId + "'}) 'style='text-decoration: none'>" + value.ticketId + "</a>";
                    pmviewData[key].siteName = '';
                    //  var SiteName =  loadSiteName(siteId);
                    dynamicURL += 'siteId=' + siteId + '|';
                    if (length == 1) {
                        dynamicURL += 'siteId=' + siteId;
                        // console.log(dynamicURL);
                        // console.log(length);
                    }
                    length--;
                    //data[key].siteName = SiteName;
                });
                //console.log(JSON.stringify(pmviewData));
                $scope.completedsurvey = data;
                $scope.completedsurvey.sort(SortById);
                //alert(JSON.stringify(data))
                dynamicURL += '&fields=siteName,siteId';
                //$scope.finaldata.push(data);
                loadSiteName(dynamicURL)
            });

            function loadSiteName(dynamicURL) {
                var sitename = [];
                //console.log(dynamicURL);
                commonServices.getAuthToken().then(
                    function(data) {
                        $scope.res = data;
                        commonServices.getSiteDataForPM(dynamicURL, data).then(function(data) {
                            // sitename.push(data);
                            //siteNamebuilder(sitename);
                            for (var i = 0; i < data.length; i++) {
                                angular.forEach($scope.completedsurvey, function(value, key) {
                                    //console.log(value.siteName);
                                    if (value.siteId == data[i].siteId) {
                                        //alert(data[i].siteId +value.siteId );
                                        $scope.completedsurvey[key].siteName = data[i].siteName;
                                    }
                                     console.log($scope.completedsurvey);
                                });

                            }
                        })
                    });

                var completedsurvey =  $scope.completedsurvey;;
                  $rootScope.survey = [];
                for(var i =0; i<completedsurvey.length;i++ ){
                     var compSurvey = {
                        'siteId':completedsurvey[i].siteId,
                        'surveyType':completedsurvey[i].surveyType
                    }
                    $rootScope.survey.push(compSurvey);
                }
            }


            //To download Excel//
            $scope.multiTicket = [];
            document.getElementById("pmview").addEventListener("px-row-click", function(e) {
                console.log("INSIDE Px-row-cick",e);
                var clickedRow = e.detail.row;
                console.log("clickedRow._selected ",clickedRow._selected)

                var surveyTypeId;
                var ticketSiteId;
                var siteId;

                if (clickedRow.row.hasOwnProperty('ticketSiteDetailsId')) {
                    ticketSiteId = e.detail.row.row.ticketSiteDetailsId.value;
                }

                if (clickedRow.row.hasOwnProperty('siteId')) {
                    siteId = e.detail.row.row.siteId.value;
                }

                $scope.rdlSelectedObj = {
                    "ticketSiteId": ticketSiteId,
                    "surveyTypeId":7,
                    "siteId": siteId
                }
                if(clickedRow._selected == false){
                    $scope.multiTicket.push($scope.rdlSelectedObj);
                }
                console.log("$scope.multiTicket",$scope.multiTicket);
                if(clickedRow._selected == true){
                    var ticketSiteId = e.detail.row.row.ticketSiteDetailsId.value;
                    var len = $scope.multiTicket.length;
                    for(var i=0; i<len;i++){
                        var data = $scope.multiTicket[i]
                        if(data.ticketSiteId == ticketSiteId){
                             $scope.multiTicket.splice(i,1);
                        }
                       // console.log("$scope.multiTicket after delete",$scope.multiTicket);
                    }
                }
            });

            $scope.RdlExport = function () {
                //alert("INside RDLEXport")
                console.log("multiTicket inside Edlexport",$scope.multiTicket);
                if($scope.multiTicket==''){
                    console.log("Data is empty")
                    return false;
                }
                    // Use XMLHttpRequest instead of Jquery $ajax
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                    var a;
                     if (xhttp.readyState === 4 && xhttp.status === 200) {
                    // Trick for making downloadable link
                        a = document.createElement('a');
                        a.href = window.URL.createObjectURL(xhttp.response);
                        // Give filename you wish to download
                        a.download = "RDL-Export.xls";
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                     }
                    };
                    //console.log("URL --- ",commonServices.getUrlForRDLPost());
                    // Post data to URL which handles post request
                    xhttp.open("POST", commonServices.getUrlForRDLPost());
                    xhttp.setRequestHeader("Content-Type", "application/json");
                    // You should set responseType as blob for binary responses
                    xhttp.responseType = 'blob';
                    xhttp.send(JSON.stringify($scope.multiTicket));

            }

      }]);
    });