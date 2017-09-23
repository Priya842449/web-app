/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    controllers.controller('analyticsCtrl', ['$state', '$rootScope', '$scope', '$log', 'NgMap', 'PredixAssetService', '$http', '$location', '$stateParams', '$timeout', 'commonServices', '$window', '$filter', function($state, $rootScope, $scope, $log, NgMap, PredixAssetService, $http, $location, $stateParams, $timeout, commonServices, $window, $filter) {
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

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var paperSpinner = document.querySelector('#paperSpinner');
        $http.get('https://gecurrentanalyticsmicroservices.run.aws-usw02-pr.ice.predix.io/getAnalyticsData', config)
            .success(function(data) {
                //alert('Test :'+JSON.stringify(data));
                //alert('Test length:'+data.length);
                $scope.masterData = data;
                $scope.mainMethod();
                paperSpinner.removeAttribute('active');
            });

        $scope.store = true;
        $scope.state = true;
        $scope.city = true;
        $scope.storeAddress = true;
        $scope.contractor = true;
        $scope.installerContact = true;
        $scope.quantity = true;
        $scope.timeTaken = true;
        $scope.designer = true;
        $scope.storeType = true;
        $scope.poleType = true;
        $scope.fixtureType = true;
        $scope.status = true;
        $scope.requiresTenonAdapter = true;
        $scope.installer = true;
        $scope.installerContact = true;
        $scope.materials = true;
        $scope.inventoryOfProducts = true;
        $scope.otherInfoPole = true;
        $scope.shipmentRiskVariables = true;
        $scope.riskFactor = true;
        $scope.storeInShoppingPlaza = true;
        $scope.mountingHeight = true;
        $scope.siteStatus = true;
        $scope.stage = true;
        $scope.surveyComplete = true;
        $scope.cityRestrictions = true;
        $scope.lightingDesignComplete = true;
        $scope.dateApproved = true;
        $scope.quoteDate = true;
        $scope.poReceived = true;
        $scope.installer = true;
        $scope.installDrawingSent = true;
        $scope.shipped = true;
        $scope.orderStatusDeliveredDt = true;
        $scope.installed = true;
        $scope.customer = true;
        $scope.mapFilter = false;
        $scope.mapFilterKey = true;
        $scope.statusColor = "";
        $scope.infowindow = {};
        $scope.infowindow.close = false;


        /*		$scope.masterData=[{"dataId":1,"surveyComplete":"5/14/2015","firstDesignComplete":"6/3/2015","lightingDesignComplete":"6/4/2015","dateApproved":"6/4/2015","quoteDate":"6/8/2015","poReceived":"6/10/2015","installDrawingSent":"7/6/2015","shipped":"7/15/2015","orderStatusDeliveredDt":"7/15/2015","installed":"8/8/2015","store":"23","orderStatusDeliveredDt":"7/15/2015","fixtureType":"EASC5K5N550DBBLCKDF","quantity":"46","date":"6/3/2015","item":"212615","otherInfoPole":"Round No Black","dataExtratTableSheet":"Design Data Phase C","keyToMergeDefectMissingItems":"23_EASC5K5N550DBBLCKDF","typeOfRequest":"-","enterTheQty":"-","city":"RUSTON","state":"LA","storeAddress":"1201 N SERVICE RD E","contractor":"ISS","surveyUploaded":"5/14/2015","surveyUploadedyear":"2015","poleType":"Round","requiresTenonAdapter":"No","cityRestrictions":"No","fixtureColor":"Black","otherInfoLED":"","shipToAddress":"1201 N SERVICE RD E","referenceIDSalesOrder":"W0002301","checkDesignComplete":"","storeInShoppingPlaza":"","estimatedInstallDate":"7/29/2015","estimatedShipDate":"7/14/2015","deliveredDate":"7/16/0524","tracking":"0","inventoryOfProducts":"Pass","phase":"C","siteStatus":"300","installer":"ISS","installerContact":"projectsteam@issolutions.biz","folderName":"","zip":"71270","storeType":"Supercenter","div":"","designEfficiencyFactor":"","areaLights":"","estimateOfArealightsNeeded":"","configurationToUse":"#REF!","squareRound":"Round","avgRates":"","materials":"","dateSurveyScheduled":"","mountingHeight":"41","notes":"","virsPlayground":"","traceComplete":"","designer":"LSL","revisionNeeded":"","RevisionSent":"","surveyWithIssues":"Yes","surveyDesignIssueAfterContacting":"Other","surveyVsDesignCheck":"6/4/2015","designSpecCheck":"6/4/2015","quoteCheck":"","quoteDoubleCheck":"6/8/2015","bomCheckvsSAPvsLuminaire":"","salesOrder":"W0002301","other":"","contractorsInstallPlan":"","approvedDrawing":"","installdrawingSentLAS":"7/6/2015","shippedDate":"7/15/2015","delivered":"","shipmentRiskVariables":"On Track","riskFactor":"15","avgOfShippedAndInstalled":"","defineProject":"C","longitude":"32.54354","latitude":"-92.624163","stage":"design stage","pre_Qut_Drtn":"25.00","fixture3l":"EAS","fixture5l":"EASC5","fixture7l":"EASC5K5","state_seg5":"0.00","state_seg6":"0.00","state_seg8":"0.00","state_seg10":"1.00","state_seg11":"0.00","fix7l_seg4":"0.00","fix7l_seg6":"0.00","fix7l_seg7":"0.00","storeTypeSamsClub":"0.00","storeTypeSupercenter":"1.00","storeTypeWalMart":"0.00","contractorISS":"1.00","contractorLMS":"0.00","contractorLoeb":"0.00","contractorMD":"0.00","contractorMackoul":"0.00","contractorPowerhouse":"0.00","contractorSolis":"0.00","contractorStonesRiver":"0.00","designerJP":"0.00","designerKE":"0.00","designerLSL":"1.00","designerTS":"0.00","designerWasko":"0.00","statePostSeg4":"0.00","statePostSeg5":"0.00","statePostSeg6":"0.00","statePostSeg11":"0.00","statePostSeg12":"1.00","statePostSeg13":"0.00","statePostSeg14":"0.00","statePostSeg16":"0.00","statePostSeg18":"0.00","statePostSeg19":"0.00","cityRestNo":"1.00","cityRestYes":"0.00","preQuoteDurationPrediction":"15.48","preQuoteDurationLowerLimit":"14.08","preQuoteDurationUpperLimit":"17.34","postQuoteDurationPrediction":"57.69","postQuoteDurationLowerLimit":"56.30","postQuoteDurationUpperLimit":"59.53","status":"Orange", "customer":"Walmart"},
{"dataId":2,"surveyComplete":"5/14/2015","firstDesignComplete":"6/3/2015","lightingDesignComplete":"6/4/2015","dateApproved":"6/4/2015","quoteDate":"6/8/2015","poReceived":"6/10/2015","installDrawingSent":"7/6/2015","shipped":"7/15/2015","orderStatusDeliveredDt":"7/15/2015","installed":"8/8/2015","store":"23","orderStatusDeliveredDt":"7/15/2015","fixtureType":"EASC5H3F550DBBLCKDF","quantity":"4","date":"6/3/2015","item":"212849","otherInfoPole":"Round No Black","dataExtratTableSheet":"Design Data Phase C","keyToMergeDefectMissingItems":"23_EASC5H3F550DBBLCKDF","typeOfRequest":"-","enterTheQty":"-","city":"RUSTON","state":"LA","storeAddress":"1201 N SERVICE RD E","contractor":"Stones River","surveyUploaded":"5/14/2015","surveyUploadedyear":"2015","poleType":"Round","requiresTenonAdapter":"No","cityRestrictions":"No","fixtureColor":"Black","otherInfoLED":"","shipToAddress":"1201 N SERVICE RD E","referenceIDSalesOrder":"W0002301","checkDesignComplete":"","storeInShoppingPlaza":"","estimatedInstallDate":"7/29/2015","estimatedShipDate":"7/14/2015","deliveredDate":"7/16/0524","tracking":"0","inventoryOfProducts":"Pass","phase":"C","siteStatus":"300","installer":"ISS","installerContact":"projectsteam@issolutions.biz","folderName":"","zip":"71270","storeType":"Supercenter","div":"","designEfficiencyFactor":"","areaLights":"","estimateOfArealightsNeeded":"","configurationToUse":"#REF!","squareRound":"Round","avgRates":"","materials":"","dateSurveyScheduled":"","mountingHeight":"41","notes":"","virsPlayground":"","traceComplete":"","designer":"LSL","revisionNeeded":"","RevisionSent":"","surveyWithIssues":"Yes","surveyDesignIssueAfterContacting":"Other","surveyVsDesignCheck":"6/4/2015","designSpecCheck":"6/4/2015","quoteCheck":"","quoteDoubleCheck":"6/8/2015","bomCheckvsSAPvsLuminaire":"","salesOrder":"W0002301","other":"","contractorsInstallPlan":"","approvedDrawing":"","installdrawingSentLAS":"7/6/2015","shippedDate":"7/15/2015","delivered":"","shipmentRiskVariables":"On Track","riskFactor":"15","avgOfShippedAndInstalled":"","defineProject":"C","longitude":"32.54354","latitude":"-92.624163","stage":"design stage","pre_Qut_Drtn":"25.00","fixture3l":"EAS","fixture5l":"EASC5","fixture7l":"EASC5H3","state_seg5":"0.00","state_seg6":"0.00","state_seg8":"0.00","state_seg10":"1.00","state_seg11":"0.00","fix7l_seg4":"1.00","fix7l_seg6":"0.00","fix7l_seg7":"0.00","storeTypeSamsClub":"0.00","storeTypeSupercenter":"1.00","storeTypeWalMart":"0.00","contractorISS":"1.00","contractorLMS":"0.00","contractorLoeb":"0.00","contractorMD":"0.00","contractorMackoul":"0.00","contractorPowerhouse":"0.00","contractorSolis":"0.00","contractorStonesRiver":"0.00","designerJP":"0.00","designerKE":"0.00","designerLSL":"1.00","designerTS":"0.00","designerWasko":"0.00","statePostSeg4":"0.00","statePostSeg5":"0.00","statePostSeg6":"0.00","statePostSeg11":"0.00","statePostSeg12":"1.00","statePostSeg13":"0.00","statePostSeg14":"0.00","statePostSeg16":"0.00","statePostSeg18":"0.00","statePostSeg19":"0.00","cityRestNo":"1.00","cityRestYes":"0.00","preQuoteDurationPrediction":"11.47","preQuoteDurationLowerLimit":"10.06","preQuoteDurationUpperLimit":"13.33","postQuoteDurationPrediction":"58.14","postQuoteDurationLowerLimit":"56.75","postQuoteDurationUpperLimit":"59.98","status":"Orange", "customer":"Walmart"},
{"dataId":3,"surveyComplete":"5/22/2015","firstDesignComplete":"6/24/2015","lightingDesignComplete":"6/29/2015","dateApproved":"6/29/2015","quoteDate":"6/29/2015","poReceived":"7/1/2015","installDrawingSent":"7/14/2015","shipped":"7/15/2015","orderStatusDeliveredDt":"7/15/2015","installed":"8/8/2015","store":"77","orderStatusDeliveredDt":"7/15/2015","fixtureType":"EASC5F4F550DBBLCKDF","quantity":"14","date":"6/24/2015","item":"212799","otherInfoPole":"round No black","dataExtratTableSheet":"Design Data Phase C","keyToMergeDefectMissingItems":"77_EASC5F4F550DBBLCKDF","typeOfRequest":"-","enterTheQty":"-","city":"TAYLOR","state":"TX","storeAddress":"3701 N MAIN ST","contractor":"Powerhouse","surveyUploaded":"5/22/2015","surveyUploadedyear":"2015","poleType":"round","requiresTenonAdapter":"No","cityRestrictions":"No","fixtureColor":"black","otherInfoLED":"","shipToAddress":"3701 N MAIN ST","referenceIDSalesOrder":"W0007701","checkDesignComplete":"","storeInShoppingPlaza":"","estimatedInstallDate":"7/24/2015","estimatedShipDate":"7/15/2015","deliveredDate":"7/17/1359","tracking":"0","inventoryOfProducts":"","phase":"C","siteStatus":"300","installer":"Powerhouse","installerContact":"Chelsea.Nielsen@powerhouseretail.com;WMLEDRetrofit@powerhouseretail.com","folderName":"","zip":"","storeType":"Supercenter","div":"","designEfficiencyFactor":"","areaLights":"","estimateOfArealightsNeeded":"","configurationToUse":"#REF!","squareRound":"round","avgRates":"","materials":"","dateSurveyScheduled":"","mountingHeight":"","notes":"","virsPlayground":"","traceComplete":"","designer":"JP","revisionNeeded":"","RevisionSent":"","surveyWithIssues":"No","surveyDesignIssueAfterContacting":"","surveyVsDesignCheck":"6/29/2015","designSpecCheck":"6/29/2015","quoteCheck":"","quoteDoubleCheck":"6/30/2015","bomCheckvsSAPvsLuminaire":"","salesOrder":"W0007701","other":"","contractorsInstallPlan":"","approvedDrawing":"","installdrawingSentLAS":"7/14/2015","shippedDate":"7/15/2015","delivered":"","shipmentRiskVariables":"Medium Risk","riskFactor":"9","avgOfShippedAndInstalled":"","defineProject":"C","longitude":"30.598574","latitude":"-97.418442","stage":"design stage","pre_Qut_Drtn":"38.00","fixture3l":"EAS","fixture5l":"EASC5","fixture7l":"EASC5F4","state_seg5":"0.00","state_seg6":"1.00","state_seg8":"0.00","state_seg10":"0.00","state_seg11":"0.00","fix7l_seg4":"0.00","fix7l_seg6":"0.00","fix7l_seg7":"0.00","storeTypeSamsClub":"0.00","storeTypeSupercenter":"1.00","storeTypeWalMart":"0.00","contractorISS":"0.00","contractorLMS":"0.00","contractorLoeb":"0.00","contractorMD":"0.00","contractorMackoul":"0.00","contractorPowerhouse":"1.00","contractorSolis":"0.00","contractorStonesRiver":"0.00","designerJP":"1.00","designerKE":"0.00","designerLSL":"0.00","designerTS":"0.00","designerWasko":"0.00","statePostSeg4":"1.00","statePostSeg5":"0.00","statePostSeg6":"0.00","statePostSeg11":"0.00","statePostSeg12":"0.00","statePostSeg13":"0.00","statePostSeg14":"0.00","statePostSeg16":"0.00","statePostSeg18":"0.00","statePostSeg19":"0.00","cityRestNo":"1.00","cityRestYes":"0.00","preQuoteDurationPrediction":"28.61","preQuoteDurationLowerLimit":"27.20","preQuoteDurationUpperLimit":"30.46","postQuoteDurationPrediction":"110.71","postQuoteDurationLowerLimit":"109.32","postQuoteDurationUpperLimit":"112.55","status":"Orange", "customer":"Walmart"},
{"dataId":4,"surveyComplete":"5/22/2015","firstDesignComplete":"6/24/2015","lightingDesignComplete":"6/29/2015","dateApproved":"6/29/2015","quoteDate":"6/29/2015","poReceived":"7/1/2015","installDrawingSent":"7/14/2015","shipped":"7/15/2015","orderStatusDeliveredDt":"7/15/2015","installed":"8/8/2015","store":"77","orderStatusDeliveredDt":"7/15/2015","fixtureType":"EASC5K5N550DBBLCKDF","quantity":"30","date":"6/24/2015","item":"212615","otherInfoPole":"round No black","dataExtratTableSheet":"Design Data Phase C","keyToMergeDefectMissingItems":"77_EASC5K5N550DBBLCKDF","typeOfRequest":"-","enterTheQty":"-","city":"TAYLOR","state":"TX","storeAddress":"3701 N MAIN ST","contractor":"Powerhouse","surveyUploaded":"5/22/2015","surveyUploadedyear":"2015","poleType":"round","requiresTenonAdapter":"No","cityRestrictions":"No","fixtureColor":"black","otherInfoLED":"","shipToAddress":"3701 N MAIN ST","referenceIDSalesOrder":"W0007701","checkDesignComplete":"","storeInShoppingPlaza":"","estimatedInstallDate":"7/24/2015","estimatedShipDate":"7/15/2015","deliveredDate":"7/17/1359","tracking":"0","inventoryOfProducts":"","phase":"C","siteStatus":"300","installer":"Powerhouse","installerContact":"Chelsea.Nielsen@powerhouseretail.com;WMLEDRetrofit@powerhouseretail.com","folderName":"","zip":"","storeType":"Supercenter","div":"","designEfficiencyFactor":"","areaLights":"","estimateOfArealightsNeeded":"","configurationToUse":"#REF!","squareRound":"round","avgRates":"","materials":"","dateSurveyScheduled":"","mountingHeight":"","notes":"","virsPlayground":"","traceComplete":"","designer":"JP","revisionNeeded":"","RevisionSent":"","surveyWithIssues":"No","surveyDesignIssueAfterContacting":"","surveyVsDesignCheck":"6/29/2015","designSpecCheck":"6/29/2015","quoteCheck":"","quoteDoubleCheck":"6/30/2015","bomCheckvsSAPvsLuminaire":"","salesOrder":"W0007701","other":"","contractorsInstallPlan":"","approvedDrawing":"","installdrawingSentLAS":"7/14/2015","shippedDate":"7/15/2015","delivered":"","shipmentRiskVariables":"Medium Risk","riskFactor":"9","avgOfShippedAndInstalled":"","defineProject":"C","longitude":"30.598574","latitude":"-97.418442","stage":"design stage","pre_Qut_Drtn":"38.00","fixture3l":"EAS","fixture5l":"EASC5","fixture7l":"EASC5K5","state_seg5":"0.00","state_seg6":"1.00","state_seg8":"0.00","state_seg10":"0.00","state_seg11":"0.00","fix7l_seg4":"0.00","fix7l_seg6":"0.00","fix7l_seg7":"0.00","storeTypeSamsClub":"0.00","storeTypeSupercenter":"1.00","storeTypeWalMart":"0.00","contractorISS":"0.00","contractorLMS":"0.00","contractorLoeb":"0.00","contractorMD":"0.00","contractorMackoul":"0.00","contractorPowerhouse":"1.00","contractorSolis":"0.00","contractorStonesRiver":"0.00","designerJP":"1.00","designerKE":"0.00","designerLSL":"0.00","designerTS":"0.00","designerWasko":"0.00","statePostSeg4":"1.00","statePostSeg5":"0.00","statePostSeg6":"0.00","statePostSeg11":"0.00","statePostSeg12":"0.00","statePostSeg13":"0.00","statePostSeg14":"0.00","statePostSeg16":"0.00","statePostSeg18":"0.00","statePostSeg19":"0.00","cityRestNo":"1.00","cityRestYes":"0.00","preQuoteDurationPrediction":"28.17","preQuoteDurationLowerLimit":"26.76","preQuoteDurationUpperLimit":"30.02","postQuoteDurationPrediction":"110.54","postQuoteDurationLowerLimit":"109.14","postQuoteDurationUpperLimit":"112.38" ,"status":"Orange", "customer":"Walmart"},
{"dataId":5,"surveyComplete":"9/9/2014","firstDesignComplete":"9/10/2014","lightingDesignComplete":"9/12/2014","dateApproved":"9/12/2014","quoteDate":"9/15/2014","poReceived":"9/19/2014","installDrawingSent":"10/5/2014","shipped":"10/10/2014","orderStatusDeliveredDt":"10/10/2014","installed":"11/3/2014","store":"93","orderStatusDeliveredDt":"10/10/2014","fixtureType":"EASB5D3F5509BDKBZD2F","quantity":"3","date":"9/10/2014","item":"#N/A","otherInfoPole":"Round No Other","dataExtratTableSheet":"Design Data","keyToMergeDefectMissingItems":"93_EASB5D3F5509BDKBZD2F","typeOfRequest":"-","enterTheQty":"-","city":"COVINGTON","state":"TN","storeAddress":"201 Lanny Bridges Avenue","contractor":"Stones River","surveyUploaded":"9/9/2014","surveyUploadedyear":"2014","poleType":"Round","requiresTenonAdapter":"No","cityRestrictions":"No","fixtureColor":"Other","otherInfoLED":"Brown. (10) square","shipToAddress":"1244 Gallatin Pike South Madison TN 37115","referenceIDSalesOrder":"WR009301","checkDesignComplete":"","storeInShoppingPlaza":"","estimatedInstallDate":"9/9/2014","estimatedShipDate":"1/0/1900","deliveredDate":"Conway","tracking":"962-243181","inventoryOfProducts":"Pass","phase":"A","siteStatus":"100","installer":"Stones River","installerContact":"BGibler@stonesriverelectric.com","folderName":"#93 COVINGTON, TN - A508112","zip":"38019-1613","storeType":"Supercenter","div":"","designEfficiencyFactor":"","areaLights":"","estimateOfArealightsNeeded":"","configurationToUse":"Other","squareRound":"Round","avgRates":"","materials":"","dateSurveyScheduled":"","mountingHeight":"40","notes":"Wallpacks - Existing LED","virsPlayground":"#N/A","traceComplete":"","designer":"LSL","revisionNeeded":"","RevisionSent":"","surveyWithIssues":"","surveyDesignIssueAfterContacting":"","surveyVsDesignCheck":"N/A","designSpecCheck":"N/A","quoteCheck":"N/A","quoteDoubleCheck":"","bomCheckvsSAPvsLuminaire":"N/A","salesOrder":"WR009301","other":"#N/A","contractorsInstallPlan":"9/24/2014","approvedDrawing":"A508112A","installdrawingSentLAS":"10/5/2014","shippedDate":"10/10/2014","delivered":"","shipmentRiskVariables":"","riskFactor":"","avgOfShippedAndInstalled":"","defineProject":"A","longitude":"35.545824","latitude":"-89.665466","stage":"design stage","pre_Qut_Drtn":"6.00","fixture3l":"EAS","fixture5l":"EASB5","fixture7l":"EASB5D3","state_seg5":"0.00","state_seg6":"0.00","state_seg8":"1.00","state_seg10":"0.00","state_seg11":"0.00","fix7l_seg4":"0.00","fix7l_seg6":"0.00","fix7l_seg7":"1.00","storeTypeSamsClub":"0.00","storeTypeSupercenter":"1.00","storeTypeWalMart":"0.00","contractorISS":"0.00","contractorLMS":"0.00","contractorLoeb":"0.00","contractorMD":"0.00","contractorMackoul":"0.00","contractorPowerhouse":"0.00","contractorSolis":"0.00","contractorStonesRiver":"1.00","designerJP":"0.00","designerKE":"0.00","designerLSL":"1.00","designerTS":"0.00","designerWasko":"0.00","statePostSeg4":"0.00","statePostSeg5":"0.00","statePostSeg6":"0.00","statePostSeg11":"0.00","statePostSeg12":"0.00","statePostSeg13":"1.00","statePostSeg14":"0.00","statePostSeg16":"0.00","statePostSeg18":"0.00","statePostSeg19":"0.00","cityRestNo":"1.00","cityRestYes":"0.00","preQuoteDurationPrediction":"12.98","preQuoteDurationLowerLimit":"11.57","preQuoteDurationUpperLimit":"14.84","postQuoteDurationPrediction":"72.74","postQuoteDurationLowerLimit":"71.35","postQuoteDurationUpperLimit":"74.58","status":"Orange", "customer":"Walmart"},
{"dataId":6,"surveyComplete":"8/27/2014","firstDesignComplete":"9/4/2014","lightingDesignComplete":"9/4/2014","dateApproved":"9/4/2014","quoteDate":"9/5/2014","poReceived":"9/5/2014","installDrawingSent":"9/12/2014","shipped":"9/21/2014","orderStatusDeliveredDt":"9/21/2014","installed":"12/11/2014","store":"94","orderStatusDeliveredDt":"9/21/2014","fixtureType":"EESW0WEN57A1NBLCK","quantity":"3","date":"9/4/2014","item":"#N/A","otherInfoPole":"Round No Black","dataExtratTableSheet":"Design Data","keyToMergeDefectMissingItems":"94_EESW0WEN57A1NBLCK","typeOfRequest":"-","enterTheQty":"-","city":"MILLINGTON","state":"TN","storeAddress":"8445 Hwy 51 North","contractor":"Stones River","surveyUploaded":"8/27/2014","surveyUploadedyear":"2014","poleType":"Round","requiresTenonAdapter":"No","cityRestrictions":"No","fixtureColor":"Black","otherInfoLED":"","shipToAddress":"1244 Gallatin Pike South Madison TN 37115","referenceIDSalesOrder":"WM009401","checkDesignComplete":"","storeInShoppingPlaza":"","estimatedInstallDate":"8/27/2014","estimatedShipDate":"9/26/2014","deliveredDate":"Conway","tracking":"962-185560","inventoryOfProducts":"Pass","phase":"A","siteStatus":"100","installer":"Stones River","installerContact":"BGibler@stonesriverelectric.com","folderName":"#94 MILLINGTON, TN - A508113","zip":"38053","storeType":"Supercenter","div":"","designEfficiencyFactor":"","areaLights":"","estimateOfArealightsNeeded":"","configurationToUse":"#REF!","squareRound":"Round","avgRates":"","materials":"","dateSurveyScheduled":"","mountingHeight":"40","notes":"","virsPlayground":"#N/A","traceComplete":"","designer":"HEI","revisionNeeded":"Yes","RevisionSent":"11/3/2015","surveyWithIssues":"","surveyDesignIssueAfterContacting":"","surveyVsDesignCheck":"N/A","designSpecCheck":"N/A","quoteCheck":"N/A","quoteDoubleCheck":"","bomCheckvsSAPvsLuminaire":"N/A","salesOrder":"WM009401","other":"#N/A","contractorsInstallPlan":"9/26/2014","approvedDrawing":"A508113A","installdrawingSentLAS":"9/12/2014","shippedDate":"9/21/2014","delivered":"","shipmentRiskVariables":"","riskFactor":"","avgOfShippedAndInstalled":"","defineProject":"A","longitude":"35.357486","latitude":"-89.8978","stage":"design stage","pre_Qut_Drtn":"9.00","fixture3l":"EES","fixture5l":"EESW0","fixture7l":"EESW0WE","state_seg5":"0.00","state_seg6":"0.00","state_seg8":"1.00","state_seg10":"0.00","state_seg11":"0.00","fix7l_seg4":"0.00","fix7l_seg6":"0.00","fix7l_seg7":"1.00","storeTypeSamsClub":"0.00","storeTypeSupercenter":"1.00","storeTypeWalMart":"0.00","contractorISS":"0.00","contractorLMS":"0.00","contractorLoeb":"0.00","contractorMD":"0.00","contractorMackoul":"0.00","contractorPowerhouse":"0.00","contractorSolis":"0.00","contractorStonesRiver":"1.00","designerJP":"0.00","designerKE":"0.00","designerLSL":"0.00","designerTS":"0.00","designerWasko":"0.00","statePostSeg4":"0.00","statePostSeg5":"0.00","statePostSeg6":"0.00","statePostSeg11":"0.00","statePostSeg12":"0.00","statePostSeg13":"1.00","statePostSeg14":"0.00","statePostSeg16":"0.00","statePostSeg18":"0.00","statePostSeg19":"0.00","cityRestNo":"1.00","cityRestYes":"0.00","preQuoteDurationPrediction":"8.92","preQuoteDurationLowerLimit":"7.51","preQuoteDurationUpperLimit":"10.77","postQuoteDurationPrediction":"79.96","postQuoteDurationLowerLimit":"78.57","postQuoteDurationUpperLimit":"81.80" ,"status":"Orange", "customer":"Walmart"},

];*/
        $scope.mainMethod = function() {

            $scope.stageData = [{ "stage": "Survey Completed", "subhead": "Time took in survey across different stores." },
                { "stage": "Design Completed", "subhead": "Time took in design across different stores." },
                { "stage": "Quote Sent", "subhead": "Time took in sending quote." },
                { "stage": "PO Received", "subhead": "Time took in receiving PO across different stores." },
                { "stage": "Drawing Sent", "subhead": "Time took in sending installation drawing across different stores." },
                { "stage": "Delivered", "subhead": "Time took in delivery across different stores." },
                { "stage": "Installed", "subhead": "Time took in completing installation across different stores." }
            ];

            /* $scope.geoPositions =[{"state":"All", "longi":37.0902, "lat" :-95.7129},{"state":"AL", "longi":32.806671, "lat" :-86.791130},{"state":"AK", "longi":61.370716,"lat" :-152.404419},{"state":"AZ", "longi":33.729759,"lat" :-111.431221},{"state":"AR", "longi":34.969704,"lat" :-92.373123},{"state":"CA", "longi":36.116203,"lat" :-119.681564},{"state":"CO", "longi":39.059811,"lat" :-105.311104},{"state":"CT", "longi":41.597782,"lat" :-72.755371},{"state":"DE", "longi":39.318523,"lat" :-75.507141},{"state":"FL", "longi":27.766279,"lat" :-81.686783},{"state":"GA", "longi":33.040619,"lat" :-83.643074},{"state":"HI", "longi":21.094318,"lat" :-157.498337},{"state":"ID", "longi":44.240459,"lat" :-114.478828},{"state":"IL", "longi":40.349457,"lat" :-88.986137},{"state":"IN", "longi":39.849426,"lat" :-86.258278},{"state":"IA", "longi":42.011539,"lat" :-93.210526},{"state":"KS", "longi":38.5266,"lat" :-96.726486},{"state":"KY", "longi":37.66814,"lat" :-84.670067},{"state":"LA", "longi":31.169546,"lat" :-91.867805},{"state":"ME", "longi":44.693947,"lat" :-69.381927},{"state":"MD", "longi":39.063946,"lat" :-76.802101},{"state":"MA", "longi":42.230171,"lat" :-71.530106},{"state":"MI", "longi":43.326618,"lat" :-84.536095},{"state":"MN", "longi":45.694454,"lat" :-93.900192},{"state":"MS", "longi":32.741646,"lat" :-89.678696},{"state":"MO", "longi":38.456085,"lat" :-92.288368},{"state":"MT", "longi":46.921925,"lat" :-110.454353},{"state":"NE", "longi":41.12537,"lat" :-98.268082},{"state":"NV", "longi":38.313515,"lat" :-117.055374},{"state":"NH", "longi":43.452492,"lat" :-71.563896},{"state":"NJ", "longi":40.298904,"lat" :-74.521011},{"state":"NM", "longi":34.840515,"lat" :-106.248482},{"state":"NY", "longi":42.165726,"lat" :-74.948051},{"state":"NC", "longi":35.630066,"lat" :-79.806419},{"state":"ND", "longi":47.528912,"lat" :-99.784012},{"state":"OH", "longi":40.388783,"lat" :-82.764915},{"state":"OK", "longi":35.565342,"lat" :-96.928917},{"state":"OR", "longi":44.572021,"lat" :-122.070938},{"state":"PA", "longi":40.590752,"lat" :-77.209755},{"state":"RI", "longi":41.680893,"lat" :-71.51178},{"state":"SC", "longi":33.856892,"lat" :-80.945007},{"state":"SD", "longi":44.299782,"lat" :-99.438828},{"state":"TN", "longi":35.747845,"lat" :-86.692345},{"state":"TX", "longi":31.054487,"lat" :-97.563461},{"state":"UT", "longi":40.150032,"lat" :-111.862434},{"state":"VT", "longi":44.045876,"lat" :-72.710686},{"state":"VA", "longi":37.769337,"lat" :-78.169968},{"state":"WA", "longi":47.400902,"lat" :-121.490494},{"state":"WV", "longi":38.491226,"lat" :-80.954453},{"state":"WI", "longi":44.268543,"lat" :-89.616508},{"state":"WY", "longi":42.755966,"lat" :-107.30249},{"state":"DC","longi":38.897438,"lat" :-77.026817},{"state":"Jamshedpur", "longi" :-86.203110, "lat":22.805618}, {"state":"Jharkhand", "longi" :-85.279910, "lat":23.610218}]; */

            $scope.geoPositions = [{ "state": "All", "longi": -95.7129, "lat": 37.0902 }, { "state": "AL", "longi": -86.791130, "lat": 32.806671 }, { "state": "AK", "longi": -152.404419, "lat": 61.370716 }, { "state": "AZ", "longi": -111.431221, "lat": 33.729759 }, { "state": "AR", "longi": -92.373123, "lat": 34.969704 }, { "state": "CA", "longi": -119.681564, "lat": 36.116203 }, { "state": "CO", "longi": -105.311104, "lat": 39.059811 }, { "state": "CT", "longi": -72.755371, "lat": 41.597782 }, { "state": "DE", "longi": -75.507141, "lat": 39.318523 }, { "state": "FL", "longi": -81.686783, "lat": 27.766279 }, { "state": "GA", "longi": -83.643074, "lat": 33.040619 }, { "state": "HI", "longi": -157.498337, "lat": 21.094318 }, { "state": "ID", "longi": -114.478828, "lat": 44.240459 }, { "state": "IL", "longi": -88.986137, "lat": 40.349457 }, { "state": "IN", "longi": -86.258278, "lat": 39.849426 }, { "state": "IA", "longi": -93.210526, "lat": 42.011539 }, { "state": "KS", "longi": -96.726486, "lat": 38.5266 }, { "state": "KY", "longi": -84.670067, "lat": 37.66814 }, { "state": "LA", "longi": -91.867805, "lat": 31.169546 }, { "state": "ME", "longi": -69.381927, "lat": 44.693947 }, { "state": "MD", "longi": -76.802101, "lat": 39.063946 }, { "state": "MA", "longi": -71.530106, "lat": 42.230171 }, { "state": "MI", "longi": -84.536095, "lat": 43.326618 }, { "state": "MN", "longi": -93.900192, "lat": 45.694454 }, { "state": "MS", "longi": -89.678696, "lat": 32.741646 }, { "state": "MO", "longi": -92.288368, "lat": 38.456085 }, { "state": "MT", "longi": -110.454353, "lat": 46.921925 }, { "state": "NE", "longi": -98.268082, "lat": 41.12537 }, { "state": "NV", "longi": -117.055374, "lat": 38.313515 }, { "state": "NH", "longi": -71.563896, "lat": 43.452492 }, { "state": "NJ", "longi": -74.521011, "lat": 40.298904 }, { "state": "NM", "longi": -106.248482, "lat": 34.840515 }, { "state": "NY", "longi": -74.948051, "lat": 42.165726 }, { "state": "NC", "longi": -79.806419, "lat": 35.630066 }, { "state": "ND", "longi": -99.784012, "lat": 47.528912 }, { "state": "OH", "longi": -82.764915, "lat": 40.388783 }, { "state": "OK", "longi": -96.928917, "lat": 35.565342 }, { "state": "OR", "longi": -122.070938, "lat": 44.572021 }, { "state": "PA", "longi": -77.209755, "lat": 40.590752 }, { "state": "RI", "longi": -71.51178, "lat": 41.680893 }, { "state": "SC", "longi": -80.945007, "lat": 33.856892 }, { "state": "SD", "longi": -99.438828, "lat": 44.299782 }, { "state": "TN", "longi": -86.692345, "lat": 35.747845 }, { "state": "TX", "longi": -97.563461, "lat": 31.054487 }, { "state": "UT", "longi": -111.862434, "lat": 40.150032 }, { "state": "VT", "longi": -72.710686, "lat": 44.045876 }, { "state": "VA", "longi": -78.169968, "lat": 37.769337 }, { "state": "WA", "longi": -121.490494, "lat": 47.400902 }, { "state": "WV", "longi": -80.954453, "lat": 38.491226 }, { "state": "WI", "longi": -89.616508, "lat": 44.268543 }, { "state": "WY", "longi": -107.30249, "lat": 42.755966 }, { "state": "DC", "longi": -77.026817, "lat": 38.897438 }, { "state": "Jamshedpur", "longi": 86.203110, "lat": 22.805618 }, { "state": "Jharkhand", "longi": 85.279910, "lat": 23.610218 }];

            NgMap.getMap().then(function(map) {
                $scope.map = map;
                //$scope.map.showInfoWindow = false;

            });

            //// checkbox functions

            $scope.chck = function() {
                var listTemp = $filter('unique')($scope.masterData, 'stage');
                var stageList = [];
                var list = []
                for (var i = 0; i < listTemp.length; i++) {
                    if (listTemp[i].stage.length != 0) {
                        list.push(listTemp[i])
                    }
                }

                angular.forEach(list, function(i) {
                    stageList.push({ "stage": i.stage, "Selected": true });
                });
                return stageList;
            };

            $scope.checkBoxeList = $scope.chck();


            var getAllSelected = function() {
                var selectedItems = $scope.checkBoxeList.filter(function(item) {

                    return item.Selected;

                });
                return selectedItems.length === $scope.checkBoxeList.length;
            };
            var setAllSelected = function(value) {
                angular.forEach($scope.checkBoxeList, function(item) {
                    item.Selected = value;
                });
            };

            $scope.allSelected = function(value) {
                if (value !== undefined) {
                    return setAllSelected(value);
                } else {
                    return getAllSelected();
                }
            };
            //////////check box functions end
            //////////////// default values
            $scope.checkedStageList = function(obj) {
                var result = [];
                obj = $scope.checkBoxeList;
                angular.forEach(obj, function(val) {
                    if (val.Selected == true) {
                        result.push(val.stage);
                    }
                });
                return result;
            };
            //////////////// stages selected ///////////////
            //$scope.mainMethod = function () {


            $scope.selectedStages = $scope.checkedStageList();
            //console.log(selectedStages);
            $scope.stagesSelected = filterByValueList($scope.masterData, $scope.selectedStages);
            $scope.selectedCustomer = "All";
            $scope.selectedState = "All";
            $scope.selectedStoreType = "All";
            $scope.selectedContractor = "All";
            $scope.selectedsiteStatus = "All";
            //$scope.mapCoords =[$scope.geoPositions[0].longi, $scope.geoPositions[0].lat];
            $scope.mapCoords = [$scope.geoPositions[0].lat, $scope.geoPositions[0].longi];
            $scope.zoom = 1;
            $scope.showMsg = function(msg) {
                $scope.checkBoxes.push(msg);
                console.log($scope.checkBoxes);
            };
            $scope.infowindow = {
                    open: false
                }
                /*Table data operations */
            $scope.store = true;
            $scope.state = true;
            $scope.city = true;
            $scope.storeAddress = true;
            $scope.contractor = true;
            $scope.installerContact = true;
            $scope.quantity = true;
            $scope.timeTaken = true;
            $scope.designer = true;
            $scope.storeType = true;
            $scope.poleType = true;
            $scope.fixtureType = true;
            $scope.status = true;
            $scope.requiresTenonAdapter = true;
            $scope.installer = true;
            $scope.installerContact = true;
            $scope.materials = true;
            $scope.inventoryOfProducts = true;
            $scope.otherInfoPole = true;
            $scope.shipmentRiskVariables = true;
            $scope.riskFactor = true;
            $scope.storeInShoppingPlaza = true;
            $scope.mountingHeight = true;
            $scope.siteStatus = true;
            $scope.stage = true;
            $scope.surveyComplete = true;
            $scope.cityRestrictions = true;
            $scope.lightingDesignComplete = true;
            $scope.dateApproved = true;
            $scope.quoteDate = true;
            $scope.poReceived = true;
            $scope.installer = true;
            $scope.installDrawingSent = true;
            $scope.shipped = true;
            $scope.orderStatusDeliveredDt = true;
            $scope.installed = true;
            $scope.customer = true;


            // };
            /*Table data operations end */
            /*  Map bubbles functionality */
            $scope.showStatus = function(event, data) {
                $scope.infoData = data;
                $scope.infowindow.open = true;
                //$scope.map.showInfoWindow('myInfoWindow');


                $scope.$apply();
                //$scope.map.showInfoWindow = true;
                $scope.map.showInfoWindow('myInfoWindow', this);
                $scope.mapFilter = $scope.infoData.dataId;
                console.log('--------', $scope.mapFilter);
                var myabc = angular.element(document.querySelector('#myInfoWindow'));
                myabc.attr('visible', "true");
                $scope.mapFilterKey = true;
                //alert(angular.element(document.querySelector("#abc")).html());
                /* for(var i=0;i<$scope.stagesSelected.length;i++){
                	console.log('--------',$scope.infoData.dataId);
                	if($scope.stagesSelected[i].dataId != $scope.infoData.dataId ){
                		delete $scope.stagesSelected[i];
                	}
                } */



            };
            $scope.closeIcon = function() {
                var myabc = angular.element(document.querySelector('#myInfoWindow'));
                myabc.attr('visible', "false");
                $scope.mapFilterKey = false;
                $scope.mapFilter = false;
                $scope.map.hideInfoWindow('myInfoWindow');
            };

            //// filter stage data	
            //$scope.filteredStage =filterStages($scope.masterData,$scope.stageSelected);
            //	console.log($scope.filteredStage);

            //////// data apply changes 
            $scope.populate = function() {
                $scope.mapCoords = giveMeState($scope.selectedState);
                if ($scope.selectedState === "All") {
                    $scope.zoom = 1;
                } else {
                    $scope.zoom = 3;
                }
                $scope.selectedStages = $scope.checkedStageList();
                $scope.stagesSelected = filterByValueList($scope.masterData, $scope.selectedStages);
                $scope.filteredVal = filterByValueListStrict($scope.stagesSelected, getSelectedDD($scope.selectedContractor, $scope.selectedCustomer, $scope.selectedStoreType, $scope.selectedState, $scope.selectedsiteStatus));
                $scope.stagesSelected = dateFilter($scope.startDate, $scope.endDate, $scope.filteredVal);
                console.log('\\\\\\\\\\\\\\', $scope.startDate);
                console.log('\\\\\\\\\\\\\\', $scope.endDate);
                console.log("---------------", $scope.stagesSelected);
            };


            ///// utility functions

            function getSelectedDD(contractor, customer, storetype, state, status) {
                var arr = { "contractor": contractor, "customer": customer, "storeType": storetype, "state": state, "status": status };
                var result = [];
                angular.forEach(arr, function(k, v) {
                    if (k === "All") {
                        //result.push(k);
                        delete arr[v];
                    }
                });
                /*if(Object.keys(arr).length>0){
                result.push(arr);
                }else{
                	return result;
                }*/
                return arr;
            };

            function giveMeState(sel) {
                var coords = [];
                angular.forEach($scope.geoPositions, function(s) {
                    if (sel === s.state) {
                        //coords.push(s.longi,s.lat);
                        coords.push(s.lat, s.longi);

                    }
                });
                console.log(coords);
                return coords;
            };

            function filterByValueList(items, list) {
                var result = [];
                angular.forEach(items, function(item, val) {
                    angular.forEach(item, function(valu) {
                        if (list.indexOf(valu) > -1) {
                            result.push(item);
                        }
                    });
                });
                return result;

            };

            function filterByValueListStrict(items, list) {
                console.log(list);
                var result = [];
                var keys = Object.keys(list);
                var temp = [];
                if (keys.length > 0) {
                    console.log(list.length);
                    angular.forEach(items, function(item, val) {
                        var c = 0;
                        angular.forEach(list, function(k, l) {

                            if (item[l] === list[l]) {

                                c = c + 1;

                            }
                        });
                        temp.push(c);
                        //console.log(temp);
                        if (c == keys.length) {
                            result.push(item);
                        }
                    });
                    return result;
                } else {
                    return items;
                }
            };

            /*  date filter */
            function dateFilter(startDate, endDate, list) {
                var results = [];
                if (startDate != undefined || endDate != undefined) {
                    for (var i = 0; i < list.length; i++) {
                        var getData = new Date(list[i].surveyComplete);
                        if (startDate != undefined && endDate != undefined) {
                            if (getData >= startDate && getData <= endDate) {
                                results.push(list[i]);
                            }
                        } else if (startDate != undefined && endDate == undefined) {
                            if (getData >= startDate) {
                                results.push(list[i]);
                            }
                        } else if (startDate == undefined && endDate != undefined) {
                            if (getData <= endDate) {
                                results.push(list[i]);
                            }
                        }
                    }
                    return results;
                } else {
                    return list;
                }
            }

            function filterStages(obj, stage) {
                var result = [];
                angular.forEach(obj, function(item) {
                    var key = item.stage;
                    //alert(key);
                    if (key === stage) {
                        //console.log(key);
                        result.push(item);
                    }
                });
                return result;
            };

            function isAvailable(obj, k) {
                angular.forEach(obj, function(item) {
                    var key = item.k;
                    if (key === k) {
                        return true;
                    }
                });

            };
            ///////////end of utility functions
            /////////////end of controller
        };

        $scope.sort = function(keyname) {
            $scope.sortKey = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

    }]);

    controllers.filter('unique', function() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    });
    /*  controllers.filter('mapUnique', function() {
       return function(collection, keyname) {		   
    	   var keyVal=keyname.toString();
    	   
    			var output = [], 
    			  keys = [];
    			  if(collection != undefined && keyname != "" ){				  
    				for(var i=0;i<collection.length;i++){
    					if((collection[i].dataId).toString() == keyVal){
    						output.push(collection[i]);
    					}
    				}
    				var myabc = angular.element( document.getElementsByClassName( 'dott' ) );
    				myabc.attr('id',"buble1");	
    				return output;
    			  }else{
    				  return collection;
    			  }
    	   
    	  
       };
     }); */
    controllers.filter('mapUnique', function() {
        return function(collection, keyname, mapKey) {
            var keyVal = keyname.toString();
            console.log("open------", mapKey);
            if (mapKey) {
                var output = [],
                    keys = [];
                if (collection != undefined && keyname != "") {
                    for (var i = 0; i < collection.length; i++) {
                        if ((collection[i].dataId).toString() == keyVal) {
                            output.push(collection[i]);
                        }
                    }
                    var myabc = angular.element(document.getElementsByClassName('dott'));
                    myabc.attr('id', "buble1");
                    return output;
                } else {
                    return collection;
                }
            } else {
                return collection;
            }


        };
    });

});