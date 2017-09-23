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
    controllers.controller('createProposalCtrl', ['$state', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'proposalServices', '$timeout', 'designService', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices, proposalServices, $timeout, designService) {

        var count = 0;
        var length = 0;
        var skuList = [];
        var existingData = [];
        $scope.existingData = [];
        var url = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku';
        var powerWattUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/classinfo';
        //Dev Url
        var getRate = "http://localhost:8080/getRate";

        var siteId = $stateParams.siteId;
        var ticketId = $stateParams.ticketId;
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        $scope.skuId = '';
        $scope.skuIdTbl = '';
        $scope.skuDescription = '';
        $scope.jsonData = [];
        $scope.jsonData2 = [];
        $scope.jsonDataCopy = [];
        $scope.jsonDataCopy1 = [];
        $scope.jsonDataCopySurvey = [];
        $scope.siteName = '';
        $scope.disableSubmit = false;
        $scope.disableAddSKU = false; // To enable disable add sku button.
        $scope.disableDeleteSKU = false;
        var jsonData1 = {};

        //[ToDo]
        $scope.isNewVersion = 'N';
        $scope.versionId = "";
        $scope.items = [];
        $scope.propName = "";
        $scope.savedProposal = [];

        $scope.selectedProposal = "";
        $scope.payBackRoi = "";
        $scope.update = false;
        $scope.disablesave = false;

        $scope.showcheck = false;
        $scope.disabledelete = false;
        $scope.showCommonMsg = false;
        $scope.isSurveyNoExists = false;
        $scope.showsurveyerror = false;
        $scope.isSave = false;
        //[ToDo]  ends
        // Directory
        var directory = 'PMApproveDesign';

        //Code to load spinner and hide data untill all data loaded.
        var ps = document.querySelector('paper-spinner');
        var spinner1 = document.getElementById('view-spinner');
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

        ps.setAttribute('active', '');
        $scope.isAllDataLoaded = false;
        $scope.tokensetup = function() {
            commonServices.getAuthToken().then(function(data) {
                var inputSkuElement = document.querySelector('paper-typeahead-input-sku');
                inputSkuElement.setAttribute('cnf', data.headers.Authorization);
                inputSkuElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                commonServices.getAuthToken().then(function(config) {
                    $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId, config).success(function(data) {
                        if (data.length > 0) {
                            console.log(data[0].siteAddress);
                            var sitAdd = data[0].siteAddress;
                            $scope.siteAddress = sitAdd.street + "," + sitAdd.city + "," + sitAdd.region + "," + sitAdd.country
                        }
                    });
                });
            });
        };
        //[ToDo]
        //[TODO] RMOVE this multi version proposal starts
        $scope.showTableNSearch = true; // To hide the section to be displayed on click of add new version.
        $scope.showtextbox = true;
        $scope.noExistingProposal = true; // To disable addnew button and display default add proposal page if none added.
        $scope.showfinalproposal = true;
        $scope.selected = "";

        $scope.createFinalData = function(selected) {
            console.log(selected);
            $scope.selected = selected;
            if ($scope.finalversion) {
                var finaldata = {
                    "ticketisteDetailId": ticketSiteDetailsId,
                    "versionId": selected.versionId
                };
            }
            proposalServices.submitFinalProposal(finaldata).then(function(response) {
                console.log(response);
                if (response.Status == "SUCCESS") {
                    $scope.disableSubmit = true;
                } else {
                    $scope.disableSubmit = false;
                }
            }).catch(function(VersionErr) {
                console.error("Error saving verison ", VersionErr);
            });
        };

        function getProposalVersionList() {
            proposalServices.getPropVersionList(ticketSiteDetailsId).then(function(response) {
                var responseDataList = response.data;
                for (var i = 1; i <= responseDataList.length; i++) {
                    $scope.savedProposaldata[i] = responseDataList[i - 1];
                }
                if ($scope.savedProposaldata.length > 1) {
                    console.log("Length >  1");
                    $scope.isNewVersion = "Y";
                    $scope.showTableNSearch = false; // To show hide add sku section
                    $scope.showtextbox = false;
                    $scope.isAddNewVersion = false; // To disable/enable add new version button..
                    $scope.showfinalproposal = false;
                } else {
                    console.log("Dont have already saved version");
                    $scope.showfinalproposal = true;
                    $scope.showTableNSearch = true; // To show hide add sku section
                    $scope.showtextbox = true;
                    $scope.isAddNewVersion = true; // To disable/enable add new version button..
                    $scope.isNewVersion = "N";
                }
            });
        }

        getProposalVersionList();
        $scope.savedProposaldata = [{ 'proposalName': 'Select Proposal', 'versionId': 'none' }];
        $scope.selected = $scope.savedProposaldata[0] // Default selected value.

        $scope.savePropVersion = function(a_updateData) {
            $scope.flagPropName = false;
            var isValidName = true,
                len = $scope.jsonData2.length,
                tempData = $scope.jsonData2,
                boolSave = true,
                isValidSNO = true,
                requestdatajson = [],
                proposaldata = {};

            isValidSNO = validateSurveyNo($scope.jsonData2, $scope.propSurveyDet, true); // Validate Survey Serial Number
            if (!isValidSNO) {
                $scope.showsurveyerror = true;
                $scope.surveyerr = 'Survey Serial Number do not exists';
                return false;
            } else {
                $scope.showsurveyerror = false;
                $scope.surveyerr = '';
            }

            boolSave = chkZeroQuantity(tempData);
            if (!boolSave) {
                $scope.surveyerr = "Quantity should not be zero";
                $scope.showsurveyerror = true;
                return false;
            } else {
                $scope.surveyerr = "";
                $scope.showsurveyerror = false;
            }


            isValidName = validatePropName($scope.propName, $scope.savedProposaldata);

            if ($scope.propName == '' || $scope.propName == undefined || $scope.propName == "Selected Proposal" && a_updateData.versionId == 'none') {
                $scope.commonMsg = 'Please enter version name';
                $scope.showCommonMsg = true;
                return false;
            } else if (!isValidName && a_updateData.versionId === 'none') {
                $scope.commonMsg = 'Version Name already exists';
                $scope.showCommonMsg = true;
                return false;
            } else {
                $scope.commonMsg = "";
                $scope.showCommonMsg = false;
            }
            console.log(tempData);
            tempData.forEach(function(value) {
                var requestdata = {
                    "surveySerialNumber": value.surveySerialNo.toString(),
                    "skuId": value.skuId.toString(),
                    "quantity": value.quantity.toString(),
                    "wattage": (Number(value.watts)).toFixed(2),
                    "ballastFactor": value.ballastFactor.toString(),
                    "burnHours": value.burnHours.toString(),
                    "energyRate": value.energyRate.toString()
                };
                requestdatajson.push(requestdata);
                requestdata = {};
            });
            //Get total saving  and ROI
            //getTotals(requestdatajson); // To cal totals and newt saving, ROi.
            proposaldata = {
                "isNewVersion": $scope.isNewVersion,
                "proposalName": $scope.propName,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "surveyTypeId": $scope.surveyTypeId,
                "roi": ($scope.payBackRoi || 0.00),
                "proposal": requestdatajson,
                "survey" : [],
                "summary" : []
            };
            if (a_updateData && a_updateData.versionId != 'none') {
                //$scope.isNewVersion = "N";
                proposaldata['versionId'] = a_updateData.versionId;
                //proposaldata['isNewVersion'] = $scope.isNewVersion;
            }
            $scope.disablesave = true;
            console.log("Proposal Data-----------", proposaldata);
            proposalServices.saveProposalData(proposaldata).then(function(response) {

                console.log("response=====", response);
                if (response.Status == "SUCCESS") {
                    $scope.jsonData2 = []; // Nullify the data..
                    $scope.isSave = true;
                    $scope.propName = '';
                    $scope.showcheck = false;
                    $scope.disablesave = true;
                    $scope.showTableNSearch = false; // To hide the section to be displayed on click of add new version.
                    $scope.showtextbox = true;
                    $scope.isAddNewVersion = false; // To disable addnew button.
                    $scope.showfinalproposal = true;
                    $scope.showsurveyerror = true;
                    $scope.surveyerr = "Data saved sucessfully";
                    $timeout(function() {
                        //   $scope.isSave = true;
                        $scope.surveyerr = "";
                        $scope.showsurveyerror = false;
                    }, 3000);

                    document.getElementById('propform').reset();
                    for (var i = 1; i <= response.ProposalList.length; i++) {
                        $scope.savedProposaldata[i] = response.ProposalList[i - 1];
                    }
                    $scope.selected = $scope.savedProposaldata[0]; // Reset the drop down list
                    clearTotals(); // Clear the calculated value.
                    var alert2 = document.querySelector('#validAlertForSave');
                    alert2.toggle();
                } else {
                    $scope.showcheck = false;
                    $scope.isSave = false;
                    $scope.showsurveyerror = true;
                   // $scope.disablesave = false;
                    $scope.surveyerr = "Error saving data";
                }


            }).catch(function(VersionErr) {
                console.error("Error saving verison ", VersionErr);
            });

        };

        $scope.addNewProposal = function(isDesignLoading) {

            clearTotals(); // Clear the calculated value.
            $scope.disabledelete = false;
            $scope.propName = '';
            //$scope.isAddNewVersion = true;
            $scope.showfinalproposal = false;
            $scope.showTableNSearch = true;
            $scope.showtextbox = true;
            $scope.showcheck = false;
            $scope.showfinalproposal = true;
            $scope.isSave = false;
            $scope.showsurveyerror = false;
            console.log("$scope.savedProposaldata", $scope.savedProposaldata);
            if ($scope.savedProposaldata.length > 1) {
                $scope.isNewVersion = "Y";
            } else {
                $scope.isNewVersion = "N";
            }
            if (!isDesignLoading) {
                $scope.jsonData2 = [];
                $scope.isAddNewVersion = true;
            }
            if ($scope.isStatusSubmitted) {
                $scope.disablesave = true;
            } else {
                $scope.disablesave = false;
            }
            document.getElementById('propform').reset();
        };
        $scope.flagPropName = false;

        $scope.viewproposaldata = function(selected_proposal) {

            if (selected_proposal.versionId === 'none') {
                return false; // Dont do anything..
            }
            $scope.flagPropName = true;
            spinner1.setAttribute('active', '');
            $scope.disablesave = false;
            $scope.disabledelete = true;
            $scope.showCommonMsg = false;
            $scope.jsonData2 = [];
            $scope.showTableNSearch = false;
            $scope.showtextbox = true;

            $scope.showfinalproposal = true;
            $scope.disableSubmit = false;
            $scope.addNewProposal(true);
            getAllProposalData(selected_proposal.versionId);
            $scope.showcheck = true;
            $scope.showsurveyerror = false;
            $timeout(function() {

                $scope.propName = selected_proposal.proposalName;
                $scope.isAddNewVersion = false; // Enable add new version button
                spinner1.removeAttribute('active'); // Remove spinner
                if ($scope.isStatusSubmitted) {
                    $scope.disablesave = true;
                    $scope.isAddNewVersion = true; // Enable add new version button
                }
            }, 3000);


        };

        $scope.isStatusSubmitted = false;

        function disableControls(a_statusId) {

            $scope.isStatusSubmitted = (a_statusId == 2) ? true : false;

        }

        function validatePropName(propName, propData) {
            var returnThis = true;

            for (var i = 1; i < propData.length; i++) {
                console.log(propData);
                if (propName == propData[i].proposalName) {
                    $scope.disablesave = false;
                    returnThis = false;
                }
            }
            return returnThis;
        };

        function chkDuplSKU(a_data, a_currentSKU) {
            var returnValue = true;
            if (a_data.length === 0) {
                returnValue = true;
            } else {
                a_data.forEach(function(obj) {
                    if (obj.skuId == a_currentSKU) {
                        returnValue = false;
                    }
                });
            }
            return returnValue;

        }


        function validateSurveyNo(currentPropData, surveyData, isSaving) {
            $scope.isSave = false;
            $scope.showsurveyerror = false;
            var index = currentPropData.dataIndex;
            var matchCount = 0,
                returnValue = true;
            if (!isSaving) {
                var surveyNumber = Number(currentPropData.surveySerialNo.value);
                $scope.jsonData2[index].surveySerialNo = surveyNumber;
            }
            var propDatalen = $scope.jsonData2.length;
            for (var i = 0; i < propDatalen; i++) {
                for (var j = 0; j < surveyData.length; j++) {
                    if ($scope.jsonData2[i].surveySerialNo == surveyData[j].surveySerialNo) {
                        matchCount++;
                    }

                }

            }
            if (matchCount != propDatalen) {
                $scope.showsurveyerror = true;
                $scope.surveyerr = 'Survey Serial Number do not exists';
                returnValue = false;

            } else {
                $scope.showsurveyerror = false;
                returnValue = true;
            }
            return returnValue;

        }

        //[TODO]  Ends


        getFilesUploaded(); // Call the function on load of the page.

        $scope.tokensetup();
        getRateData();

        function getRateData() {
            proposalServices.getRateData().then(function(data) {
                $scope.rateJson = data;
            });
        }


        function setShipDate(data1) {
            if (typeof $scope.poTicketID != 'undefined' || $scope.poTicketID != null) {

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
            }
        }

        window.addEventListener('pt-item-confirmed', function(e) {
            var srcElement2 = e.srcElement;
            var data = srcElement2.__data__;
            $scope.skuId = data.keyid;
        });


        // To delete uploaded files..This function name should be same here and at other locations
        // as this function name is being used in directive to delete file..
        $scope.deleteThisFile = function(a_fileName, a_position) {
            var data = {
                'ticketSiteDetailsId': $scope.designTicketId,
                'fileName': a_fileName,
                'directory': $scope.designTicketId + "/" + directory
            }
            var forBlobDelete = {
                'fileName': a_fileName,
                'directory': $scope.designTicketId + "/" + directory
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
        };


        $scope.tempCopyJson2 = [];
        $scope.addSku = function() {

            if (!($scope.flagPropName)) {
                $scope.propName = '';
            }

            $scope.showsurveyerror = false;

            $scope.skuIdTbl = '';
            $scope.skuDescription = '';
            $scope.isSave = false;
            //Validate for duplicate SKU
            var isValid = chkDuplSKU($scope.jsonData2, $scope.skuId); // To validate that same sku is not added for same proposal
            if (!isValid) {
                $scope.errorMessage = "This SKU is already added, add another one";
                $scope.isDataNotFound = true;
                return false;

            } else {
                $scope.errorMessage = "";
                $scope.isDataNotFound = false;
                $scope.showcheck = false;


            }
            $scope.jsonDataCopy = $scope.jsonData2;
            $scope.jsonData2 = [];

            // Start the spinner..
            var spinner = document.getElementById('onDeleteSpinner');
            spinner.setAttribute('active', '');
            var dynamicURL = url + '?filter=skuId=' + $scope.skuId + '&fields=skuId,skuDescription';
            var powerWattageUrl = powerWattUrl + '?filter=skuId=' + $scope.skuId + '<specification[t3]&fields=powerWatts,specification';

            $http.get(dynamicURL, $scope.authData).success(function(response) {
                proposalServices.getSkuDataBySkuId($scope.skuId).then(function(skuDataRes) { // get rate data
                    $http.get(powerWattageUrl, $scope.authData).success(function(powerWattageRes) {
                        proposalServices.getColumnHeaders($scope.surveyTypeId).then(function(headerRes) {
                            $scope.headerRes = headerRes;
                            $scope.responseSKU = powerWattageRes;
                            if (skuDataRes && response.length > 0 && powerWattageRes.length > 0) {
                                $scope.isDataNotFound = false;
                                var tempJson = {
                                    'surveySerialNo': '',
                                    "skuId": skuDataRes.skuId.toString(),
                                    "skuDescription": response[0].skuDescription,
                                    "quantity": (skuDataRes.quantity || 0),
                                    "watts": (powerWattageRes[0].powerWatts || 0),
                                    "materialCostPerSku": (skuDataRes.price || 0),
                                    "labourCostPerSku": (skuDataRes.laborCost || 0),
                                    "maintenance": (skuDataRes.maintenance || 0),
                                    "rebate": (skuDataRes.rebate || 0)
                                };
                                var tempObj = {};

                                // Add the dynamic headers and dynamic key value
                                $scope.headerRes.forEach(function(obj) {
                                    tempObj[obj.proposalTemplateFieldId] = (skuDataRes[obj.proposalTemplateFieldId] || 0);
                                    $scope.headers[obj.proposalTemplateFieldId] = obj.proposalFieldName;
                                });

                                var matLabCost = getMatnLabCost(tempJson),
                                    totWatnCost = getTotWattPerRow(tempJson, 'proposal');
                                tempObj['totalWatts'] = (Number($scope.totWattsProp.toFixed(2)) || 0);
                                tempObj['totalCost'] = (Number($scope.totalCostPerRowProp.toFixed(2)) || 0);
                                tempObj['materialCost'] = (Number(matLabCost.materialCost.toFixed(2)) || 0);
                                tempObj['labourCost'] = (Number(matLabCost.labourCost.toFixed(2)) || 0);
                                angular.extend(tempJson, tempObj);
                                angular.forEach($scope.rateJson, function(value, key) {
                                    if (value.skuId == skuDataRes.skuId) {
                                        //jsonData1.sap_article_no = value.sapArticleNo;
                                        tempJson.materialCostPerSku = value.price;
                                    }
                                });
                                var tempJson1 = $scope.jsonDataCopy;
                                tempJson1.push(tempJson);
                                $scope.jsonDataCopy = tempJson1;
                                $scope.jsonData2 = $scope.jsonDataCopy;
                                $scope.disablesave = false; // Enable the save button..
                            } else {
                                $scope.jsonData2 = $scope.jsonDataCopy;
                                $scope.isDataNotFound = true;
                                $scope.errorMessage = "Data not found for this SKU";
                                spinner.removeAttribute('active');
                                return;
                            }
                            //updateProposalTable($scope.jsonData2);
                            if ($scope.jsonData2.length === 1 && $scope.isOnceAdded != true) {
                                createDataTable(true, false, true);
                            }
                            spinner.removeAttribute('active');
                            console.log('$scope.jsonData2---final', $scope.jsonData2);
                        }).catch(function(errPowerWattage) {
                            $scope.errorMessage = "Power wattage not found for this SKU";
                            spinner.removeAttribute('active');
                            console.error('Error fetching power wattage while adding SKU', powerWattageRes);
                        });
                    }).catch(function(hearderErr) {
                        $scope.errorMessage = "Data not found for this SKU";
                        spinner.removeAttribute('active');
                        console.error('Error fetching hearder details details by ID while adding SKU', hearderErr);
                    });
                }).catch(function(otherDataBySKUId) {
                    $scope.errorMessage = "Data not found for this SKU";
                    spinner.removeAttribute('active');
                    console.error('Error fetching proposal details by ID while adding SKU', otherDataBySKUId);
                });
            }).catch(function(errorSKUDesc) {
                $scope.errorMessage = "SKU description not found for this SKU";
                spinner.removeAttribute('active');
                console.error('Error fetching SKU desc by SKU id', errorSKUDesc);
            });
        }

        //[TODO] Start
        function finalDataSurvey(a_data) {
            $scope.propSurveyDet = [];
            var tempObj = {},
                tempArr = [];

            for (var index = 0; index < a_data.length; index++) {
                var obj = a_data[index],
                    totWatnCost = getTotWattPerRow(obj, 'survey');
                tempObj = {
                    'totalWatts': Number($scope.totWatts.toFixed(2)), //TODO-differentiate
                    'totalCost': Number($scope.totalCostPerRow.toFixed(2))
                }
                angular.extend(obj, tempObj);
                tempArr.push(obj);
                obj = '';
            }
            console.log('Survey Details data tempArr---', tempArr);
            $scope.propSurveyDet = tempArr;
            totCostBefInst($scope.propSurveyDet); // Get total cost before installation...
            createDataTable(false, true, false); // Create table for proposal and survey.
        }

        function finalDataPropo(a_data) {
            console.log("Final data propodall", a_data);
            var tempObj = {},
                tempArr = [];
            $scope.jsonData2 = [];
            for (var index = 0; index < a_data.length; index++) {
                var obj = a_data[index],
                    matLabCost = getMatnLabCost(obj),
                    totWatnCost = getTotWattPerRow(obj, 'proposal');
                tempObj = {
                    'totalWatts': Number($scope.totWattsProp.toFixed(2)),
                    'totalCost': Number($scope.totalCostPerRowProp.toFixed(2)),
                    'materialCost': Number(matLabCost.materialCost.toFixed(2)),
                    'labourCost': Number(matLabCost.labourCost.toFixed(2))
                }
                angular.extend(obj, tempObj);
                tempArr.push(obj);
                obj = {};
            }
            $scope.jsonData2 = tempArr;
            if ($scope.jsonData2.length > 0) {
                $scope.isOnceAdded = true;
            }
            getTotals($scope.jsonData2);
            createDataTable(false, false, true); // Create table for proposal and survey.
        }

        $scope.headers = {
            surveySerialNo: 'Survey SNO',
            fixtureType: 'Fixture Type',
            quantity: 'Qty',
            watts: 'Watts',
            totalWatts: 'Total Watts',
            totalCost: 'Total Cost',
            skuId: 'SKU Id',
            skuDescription: 'SKU Description',
            other: 'Other',
            materialCostPerSku: 'Material Cost/SKU',
            labourCostPerSku: 'Labour Cost/SKU',
            maintenance: 'Maintenance',
            rebate: 'Rebate',
            materialCost: 'Material Cost',
            labourCost: 'Labour Cost',
            burnHours: 'Burn Hours',
            energyRate: 'Energy Rate (KWh)',
            ballastFactor: 'Ballast Factor'

        }

        function totCostBefInst(a_data) {
            if (a_data) {
                var totalCost = 0;
                $scope.surTotCost = 0;
                for (var index = 0; index < a_data.length; index++) {
                    totalCost += Number(a_data[index].totalCost);
                }
                $scope.surTotCost = (totalCost || 0);
            }
        }
        // Gives Net savings and ROI.
        function getNetSavings(a_propTotCost) {
            $scope.netSavings = Number($scope.surTotCost - a_propTotCost);
            $scope.payBackRoi = Number((($scope.materialCostTotal + $scope.labourCostTotal) / ($scope.rebateTotal + $scope.netSavings + $scope.maintenanceTotal)).toFixed(2));

        }

        $scope.isCreatedOnce = false;

        function createDataTable(isFirstPropRec, surveyTable, proposalTable) {
            var editableFieldsProposal = {
                    energyRate: '',
                    other: '',
                    ballastFactor: '',
                    watts: '',
                    maintenance: '-',
                    rebate: '',
                    quantity: '',
                    burnHours: '',
                    labourCostPerSku: '',
                    surveySerialNo: ''
                },

                editableFieldsSurvey = {
                    'energyRate': '',
                    'burnHours': ''
                };

            if (isFirstPropRec) {
                $scope.isOnceAdded = true;
                /* var tableSku = document.querySelector('#pTable');
                for (var key in $scope.jsonData2[0]) {
                    var column = document.createElement('px-data-table-column');
                    column.setAttribute('name', key);
                    column.setAttribute('label', ($scope.headers[key] || key));
                    column.setAttribute('filterable', '');
                    if (key in editableFieldsProposal) {
                        column.setAttribute('editable', '');
                    }
                    Polymer.dom(tableSku).appendChild(column);
                } */
            }

            if (surveyTable) {
                var tableSurveyDet = document.querySelector('#surveyDetTbl');
                for (var key in $scope.propSurveyDet[0]) {
                    var column = document.createElement('px-data-table-column');
                    column.setAttribute('name', key);
                    column.setAttribute('label', $scope.headers[key]);
                    column.setAttribute('filterable', '');
                    if (key in editableFieldsSurvey) {
                        column.setAttribute('editable', '');
                    }
                    Polymer.dom(tableSurveyDet).appendChild(column);
                }

            }
            if (proposalTable && !$scope.isCreatedOnce) {

                $scope.isCreatedOnce = true;

                console.log("Only proposal table creation..");
                var tableSku = document.querySelector('#pTable');
                for (var key in $scope.jsonData2[0]) {

                    var column = document.createElement('px-data-table-column');
                    column.setAttribute('name', key);
                    column.setAttribute('label', ($scope.headers[key] || key));
                    column.setAttribute('filterable', '');
                    if (key in editableFieldsProposal) {
                        column.setAttribute('editable', '');
                    }
                    Polymer.dom(tableSku).appendChild(column);

                }
                $scope.datanotexist = false;
            }

        }

        // Get total watt per row.
        function getTotWattPerRow(a_data, a_section) {
            var totWattsSurvey = a_data.quantity * a_data.watts;
            if (a_section == 'proposal') {
                $scope.totWattsProp = totWattsSurvey;
            } else {
                $scope.totWatts = totWattsSurvey;
            }
            getTotCostPerRow(totWattsSurvey, a_data, a_section);
        }
        // Get Total cost per row
        function getTotCostPerRow(a_totWatts, a_data, a_section) {
            var totalCostPerRow = a_data.burnHours * (a_totWatts / 1000) * a_data.energyRate;
            if (a_section == 'proposal') {
                $scope.totalCostPerRowProp = totalCostPerRow;
            } else {
                $scope.totalCostPerRow = totalCostPerRow;
            }

        }

        // To return sum
        function clearTotals() {
            $scope.proposalTotalCost = 0;
            $scope.materialCostTotal = 0;
            $scope.labourCostTotal = 0;
            $scope.maintenanceTotal = 0;
            $scope.rebateTotal = 0;
            $scope.netSavings = 0;
            $scope.payBackRoi = 0;
        };

        function getTotals(a_data) {
            var totalCost = 0,
                materialCostTotal = 0,
                labourCostTotal = 0,
                maintenanceTotal = 0,
                rebateTotal = 0;

            for (var index = 0; index < a_data.length; index++) {
                totalCost += Number(a_data[index].totalCost);
                materialCostTotal += Number(a_data[index].materialCost);
                labourCostTotal += Number(a_data[index].labourCost);
                maintenanceTotal += Number(a_data[index].maintenance);
                rebateTotal += Number(a_data[index].rebate);
            }

            $timeout(function() {
                $scope.proposalTotalCost = totalCost;
                $scope.materialCostTotal = materialCostTotal;
                $scope.labourCostTotal = labourCostTotal;
                $scope.maintenanceTotal = maintenanceTotal;
                $scope.rebateTotal = rebateTotal;
                //totCostBefInst($scope.propSurveyDet);
                getNetSavings(totalCost);
            }, 500);

        }

        // Get material n Labour cost.
        function getMatnLabCost(a_data) {
            var materialCost = a_data.quantity * a_data.materialCostPerSku,
                labourCost = a_data.quantity * a_data.labourCostPerSku;
            return { materialCost: materialCost, labourCost: labourCost };
        }

        function updateSurveyJSON(a_rowData, a_table_id, a_columnName) {
            var tmpObj = $scope.propSurveyDet[a_rowData.dataIndex];
            $scope.jsonDataCopySurvey = $scope.propSurveyDet;
            $scope.propSurveyDet = [];
            $scope.propSurveyDet.length = 0;
            // if a_table_id === "surveyDetTbl" update survey list data else
            if (a_table_id == 'surveyDetTbl') {
                tmpObj[a_columnName] = (Number(a_rowData[a_columnName].value)).toFixed(2);
                tmpObj["totalWatts"] = (Number(tmpObj.quantity * tmpObj.watts)).toFixed(2);
                tmpObj["totalCost"] = (Number(tmpObj.burnHours * (tmpObj.watts / 1000) * tmpObj.energyRate)).toFixed(2);
                $scope.propSurveyDet = [];

                $scope.propSurveyDet.length = 0;
                var tempJson1 = $scope.jsonDataCopySurvey;
                tempJson1[a_rowData.dataIndex] = tmpObj;
                $scope.jsonDataCopySurvey = tempJson1;
                $scope.propSurveyDet = $scope.jsonDataCopySurvey;

            }
            $scope.$apply(function() {
                totCostBefInst($scope.propSurveyDet);
                //getTotals($scope.jsonData2); //[TODO] $scope.jsonData2 refers to final data for proposal table
            });
        }


        function updateUserValue(a_rowData, a_table_id, a_columnName) {
            var tmpObj = $scope.jsonData2[a_rowData.dataIndex];
            $scope.jsonDataCopy1 = $scope.jsonData2;
            $scope.jsonData2 = [];
            $scope.jsonData2.length = 0;
            // if a_table_id === "pTable" update proposal list data else
            // update survey data.
            if (a_table_id == 'pTable') {
                if (a_columnName == 'quantity') {
                    tmpObj[a_columnName] = Number(a_rowData[a_columnName].value);
                } else if (a_columnName == 'surveySerialNo') {
                    tmpObj[a_columnName] = Number(a_rowData[a_columnName].value);
                } else {
                    tmpObj[a_columnName] = (Number(a_rowData[a_columnName].value)).toFixed(2);
                }

                tmpObj["totalWatts"] = (Number(tmpObj.quantity * tmpObj.watts)).toFixed(2);
                tmpObj["totalCost"] = (Number(tmpObj.burnHours * (tmpObj.watts / 1000) * tmpObj.energyRate)).toFixed(2);
                tmpObj["materialCost"] = (Number(tmpObj.quantity * tmpObj.materialCostPerSku)).toFixed(2);
                tmpObj["labourCost"] = (Number(tmpObj.quantity * tmpObj.labourCostPerSku)).toFixed(2);
                $scope.jsonData2 = [];
                $scope.jsonData2.length = 0;
                var tempJson1 = $scope.jsonDataCopy1;
                tempJson1[a_rowData.dataIndex] = tmpObj;
                $scope.jsonDataCopy1 = tempJson1;
                $scope.jsonData2 = $scope.jsonDataCopy1;
            }

            $scope.$apply(function() {
                getTotals($scope.jsonData2); // $scope.jsonData2 refers to final data for proposal table
            });

        }

        $scope.deleteSKUFromUI = function() {
                //var multiPropLen = $scope.multiProposal.length;
                var multiPropLen = $scope.softDeleteSKU.length;
                var len = $scope.jsonData2.length;
                var positionsTodelete = [];
                if (len > 0) {
                    for (var j = 0; j < multiPropLen; j++) {
                        /*for (var i = 0; i < len; i++) {
                            if ($scope.jsonData2[i].skuId == $scope.multiProposal[j].skuId) {
                                positionsTodelete.push(i);
                            }
                        }*/
                        $scope.jsonData2.splice($scope.softDeleteSKU[j], 1);
                    }
                    /*for (var k = 0; k < positionsTodelete.length; k++) {
                        $scope.jsonData2.splice(positionsTodelete[k], 1);
                    }*/
                    $scope.multiProposal = [];
                    $scope.softDeleteSKU = [];
                    getTotals($scope.jsonData2);
                } else {
                    $scope.msgNoItemToDele = 'SKU must be selected to be deleted';
                    $scope.showDeleteMsg = true;
                    return;
                }
            }
            // ROI End

        $scope.saveData = function() {
            var status;
            if ($scope.multiProposal.length > 0) {

                var data = $scope.multiProposal;

                console.log(JSON.stringify(data));

                angular.forEach(data, function(value, key) {
                    angular.forEach(value, function(value1, key1) {
                        if (value1 != null) {

                            if (key1 == 'cost') {

                                $scope.cost = value1;
                                console.log($scope.cost)
                                status = true;

                            }

                        } else {

                            status = false;
                        }
                    });
                });
                if (status == true) {

                    proposalServices.saveProposalData(data).then(
                        function(response) {
                            console.log(response)
                            var alert1 = document.querySelector('#validAlertForSave');
                            alert1.toggle();

                        });
                } else {
                    var alert1 = document.querySelector('#validAlertForCost');
                    alert1.toggle();
                }
            }
        }
        $scope.deleteData = function() {
            var status;
            console.log($scope.multiProposal)

            if ($scope.multiProposal.length > 0) {

                var data = $scope.multiProposal;
                console.log(JSON.stringify(data));

                angular.forEach(data, function(value, key) {
                    angular.forEach(value, function(value1, key1) {
                        if (value1 != null) {

                            if (key1 == 'proposalId') {

                                var proposalId = value1;
                                console.log(proposalId);
                                status = true;

                            }
                        } else {
                            status = false;
                        }
                    });
                });
                console.log(status)
                if (status == true) {
                    proposalServices.deleteProposalData(data).then(
                        function(response) {
                            $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                            var okRedirect = document.getElementById('okRedirect1');
                            okRedirect.setAttribute('onclick', "window.location = '/createproposal/" + $scope.redirectPage + "'");
                            console.log(okRedirect);
                            var alert1 = document.querySelector('#validAlertForDelete');
                            alert1.toggle();
                        });
                } else {
                    var alert1 = document.querySelector('#invalidAlertForDelete');
                    alert1.toggle();
                }
            }
        }

        // For survey data table handle enter event
        document.getElementById("surveyDetTbl").addEventListener("after-save", function(e) {
            var clickedRow = e.detail.row;
            if (clickedRow.row != undefined && clickedRow.row.quantity.value != 0 &&
                clickedRow.row.quantity.value != "" && !isNaN(clickedRow.row.quantity.value)) {}
            updateSurveyJSON(clickedRow.row, e.currentTarget.id, e.detail.column.name); // To update the json displayed for proposal and survey table.
        });

        // For proposal data table handle enter event ..
        document.getElementById("pTable").addEventListener("after-save", function(e) {

            var surveyDataCopy = $scope.propSurveyDet;
            var clickedRow = e.detail.row;

            if (clickedRow.row != undefined) {
                var surveyno = Number(clickedRow.row.surveySerialNo.value);
                console.log($scope.propSurveyDet);
                validateSurveyNo(clickedRow.row, surveyDataCopy);
            }
            if (clickedRow.row != undefined && clickedRow.row.quantity.value != 0 &&
                clickedRow.row.quantity.value != "" && !isNaN(clickedRow.row.quantity.value)) {}

            updateUserValue(clickedRow.row, e.currentTarget.id, e.detail.column.name); // To update the json displayed for proposal and survey table.
        });

        // Get all data required on proposal screen.
        function getAllProposalData(a_versionId) {
            //commonServices.getAuthToken().then(function(authData) {
            //$scope.authData = authData; // Set on scope to be reused when ever needed..
            commonServices.getSiteSummary(ticketSiteDetailsId).then(function(siteSummary) {
                commonServices.getSiteData(siteId, $scope.authData).then(function(siteDataRes) {
                    var expectedSurTypeId = ["1", "2", "3", "4"];
                    $scope.surveyTypeId = '';
                    for (var index = 0; index < siteSummary.surveyList.length; index++) {
                        for (var i = 0; i < expectedSurTypeId.length; i++) {
                            if (siteSummary.surveyList[index].surveyTypeId == expectedSurTypeId[i]) {
                                $scope.surveyTypeId = siteSummary.surveyList[index].surveyTypeId;
                            }
                        }
                    }
                    //proposalServices.getSurveyData($scope.surveyTicketId, $scope.surveyTypeId).then(function(surveyDataRes) {
                    proposalServices.getProposalData(ticketSiteDetailsId, a_versionId).then(function(data) {
                        proposalServices.getColumnHeaders($scope.surveyTypeId).then(function(headerRes) {
                            //setShipDate(siteSummary); // Set the shit date.
                            //To disable submit and add sku button
                            console.log("proposal data..........", data);
                            if (data.length <= 0) {
                                $scope.commonMessage = "Data not found";
                                $scope.showCommonMessage = true;
                                return false;
                            }
                            var siteStatusId = siteSummary.statusId;
                            $scope.pm = siteSummary.assignedTo;
                            $scope.currentStage = siteSummary.stageName;
                            if (siteDataRes.length > 0) {
                                $scope.siteId = siteDataRes[0].siteId;
                                $scope.siteName = siteDataRes[0].siteName;
                            }
                            // $scope.headerRes = headerRes; // set on the scope to be used while adding SKUs.

                            // Form URL for asset to fetch all sku description for SKU IDs
                            // skuId=195420|skuId=11150219|skuId=18677
                            var urlStr = '';
                            data.forEach(function(obj, index) {
                                if (obj.hasOwnProperty('skuId')) {
                                    if (index === (data.length - 1)) {
                                        urlStr = urlStr + 'skuId=' + obj.skuId;
                                    } else {
                                        urlStr = urlStr + 'skuId=' + obj.skuId + '|';
                                    }
                                }
                            });

                            proposalServices.getSkusByIds($scope.authData, urlStr).then(function(respSkusByIds) {
                                // Collect and prepare data for survey details table..
                                var surveyTempArr = [];
                                /*surveyDataRes.forEach(function(obj) {
                                    var tempSurObj = {
                                        "fixtureType": obj.survey_type,
                                        "quantity": obj.tot_fix_qty,
                                        "watts": obj.wattage,
                                        "ballastFactor": (obj.ballastFactor || 0),
                                        "burnHours": (obj.burnHours || 0),
                                        "energyRate": (obj.energyRate || 0)
                                    }
                                    surveyTempArr.push(tempSurObj);
                                    tempSurObj = {};
                                });*/
                                length = data.length;
                                var arrayProposal = [];
                                angular.forEach(data, function(valueOld, index) {
                                    var skuId = valueOld.skuId;
                                    var skuDesc = "";
                                    var oldJsonData = "";
                                    count = count + 1;

                                    angular.forEach(respSkusByIds.data, function(valueSKU, key) {
                                        if (valueSKU.skuId != null && valueSKU.skuId != "" && valueSKU.skuId == skuId) {
                                            skuId = valueSKU.skuId;
                                            skuDesc = valueSKU.skuDescription;
                                            oldJsonData = {
                                                "surveySerialNo": (Number(valueOld.surveySerialNumber) || 0),
                                                "skuId": skuId,
                                                "skuDescription": skuDesc,
                                                "quantity": valueOld.quantity,
                                                "watts": (valueOld.wattage || 0),
                                                "materialCostPerSku": (valueOld.price || 0),
                                                "labourCostPerSku": (valueOld.laborCost || 0),
                                                "maintenance": (valueOld.maintenance || 0),
                                                "rebate": (valueOld.rebate || 0)
                                            };
                                            // Add the dynamic headers and dynamic key value
                                            headerRes.forEach(function(obj) {
                                                console.log("obj---valueOld", obj, valueOld);
                                                oldJsonData[obj.proposalTemplateFieldId] = (valueOld.valueList[obj.proposalTemplateFieldId] || 0);
                                                $scope.headers[obj.proposalTemplateFieldId] = obj.proposalFieldName;
                                            });
                                            arrayProposal.push(oldJsonData);
                                            oldJsonData = {};
                                        }
                                    });
                                });
                                //finalDataSurvey(surveyTempArr); // Create final data for survey.
                                //surveyTempArr = [];
                                finalDataPropo(arrayProposal); // Create final data for proposal.
                                arrayProposal = [];
                                //});
                                /*var ps = document.querySelector('paper-spinner');
                                ps.removeAttribute('active');
                                $scope.isAllDataLoaded = true;*/

                            }).catch(function(skuByIdErr) {
                                console.error('Error fetching skuByIdErr ', skuByIdErr);
                            });
                        }).catch(function(columnheadererr) {
                            console.error('Error fetching columnheader ', columnheadererr);
                        });
                    }).catch(function(errPropoData) {
                        console.error('Error fetching proposal data', errPropoData);
                    });
                }).catch(function(errSiteData) {
                    console.error('Error fetching site summary', errSiteData);
                });
            }).catch(function(errSiteSummary) {
                console.error('Error fetching site summary', errSiteSummary);
            });
        }


        getPropSurveyData(); // Display the survey data..
        function getPropSurveyData() {
            commonServices.getAuthToken().then(function(authData) {
                $scope.authData = authData; // Set on scope to be reused when ever needed..
                commonServices.getSiteSummary(ticketSiteDetailsId).then(function(siteSummary) {
                    if (siteSummary.statusId == 2) {
                        $scope.disablesave = true;
                        $scope.isAddNewVersion = true;
                        $scope.disableSubmit = true;
                        $scope.disableAddSKU = true;
                        $scope.disableDeleteSKU = true;
                        $scope.finalversion = true;
                    }
                    disableControls(siteSummary.statusId); // To disable the controls if status id is 2 means submitted
                    commonServices.getSiteData(siteId, authData).then(function(siteDataRes) {
                        var expectedSurTypeId = ["1", "2", "3", "4"];
                        $scope.surveyTypeId = '';
                        for (var index = 0; index < siteSummary.surveyList.length; index++) {
                            for (var i = 0; i < expectedSurTypeId.length; i++) {
                                if (siteSummary.surveyList[index].surveyTypeId == expectedSurTypeId[i]) {
                                    $scope.surveyTypeId = siteSummary.surveyList[index].surveyTypeId;
                                }
                            }
                        }
                        if (siteDataRes.length > 0) {
                            $scope.siteId = siteDataRes[0].siteId;
                            $scope.siteName = siteDataRes[0].siteName;
                            //$scope.pm = siteDataRes[0].
                        }

                        if ($scope.surveyTicketId) {
                            proposalServices.getSurveyData($scope.surveyTicketId, $scope.surveyTypeId).then(function(surveyDataRes) {
                                console.log("surveyDataRes---", surveyDataRes);
                                // Collect and prepare data for survey details table..
                                var surveyTempArr = [];
                                surveyDataRes.forEach(function(obj) {
                                    var tempSurObj = {
                                        "surveySerialNo": obj.Row,
                                        "fixtureType": obj.survey_type,
                                        "quantity": obj.tot_fix_qty,
                                        "watts": obj.wattage,
                                        "ballastFactor": (obj.ballastFactor || 0),
                                        "burnHours": (obj.burnHours || 0),
                                        "energyRate": (obj.energyRate || 0)
                                    }
                                    surveyTempArr.push(tempSurObj);
                                    tempSurObj = {};
                                });

                                finalDataSurvey(surveyTempArr); // Create final data for survey.
                                surveyTempArr = [];
                                setShipDate(siteSummary); // Set the shit date.
                                var ps = document.querySelector('paper-spinner');
                                ps.removeAttribute('active');
                                $scope.isAllDataLoaded = true;

                            }).catch(function(errSurveyData) {
                                console.error('Error fetching survey data', errSurveyData);
                                ps.removeAttribute('active');
                                $scope.isAllDataLoaded = true;
                            });

                        }
                    }).catch(function(errSiteData) {
                        ps.removeAttribute('active');
                        $scope.isAllDataLoaded = true;
                        console.error('Error fetching site data', errSiteData);
                    });

                }).catch(function(errSiteSummary) {
                    ps.removeAttribute('active');
                    $scope.isAllDataLoaded = true;
                    console.error('Error fetching site summary', errSiteSummary);
                });
            }).catch(function(errAuthToken) {
                ps.removeAttribute('active');
                $scope.isAllDataLoaded = true;
                console.error('Error fetching site summary', errAuthToken);
            });
        }

        $scope.multiProposal = [];
        $scope.softDeleteSKU = [];
        document.getElementById("pTable").addEventListener("px-row-click", function(e) {
            console.log('px-row-click---==-');
            window.setTimeout(function() {
                var clickedRow = e.detail.row;
                if (clickedRow._selected === true) {
                    var skuId = e.detail.row.row.skuId.value;
                    $scope.skuIdTodeleteFromUI = skuId;
                    //var proposalId = e.detail.row.row.proposalId.value;
                    var rateId;
                    var cost;
                    angular.forEach($scope.rateJson, function(value, key) {
                        if (skuId == value.skuId) {
                            rateId = value.rateId;
                            cost = value.price;
                        }
                    });
                    console.log('e.detail.row0000', e.detail.row);
                    var proposaldata = {
                            "skuId": skuId.toString(),
                            "ticketSiteDetailId": ticketSiteDetailsId.toString(),
                            "surveyTypeId": $scope.surveyTypeId.toString(),
                            "quantity": (e.detail.row.row.quantity.value).toString(),
                            "wattage": (e.detail.row.row.watts.value).toString()
                        }
                        // Keys to be added dynamicaly if found.
                    console.log('$scope.headerRes in px-row-click', $scope.headerRes);
                    // Add the dynamic headers and dynamic key value
                    if ($scope.headerRes && $scope.headerRes.length > 0) {
                        $scope.headerRes.forEach(function(obj) {
                            proposaldata[obj.proposalTemplateFieldId] = (e.detail.row.row[obj.proposalTemplateFieldId].value).toString();
                        });
                    }


                    $scope.softDeleteSKU.push(e.detail.row.row.dataIndex);
                    $scope.multiProposal.push(proposaldata);
                    proposaldata = {};
                }
                if (clickedRow._selected == false) {
                    var skuId = e.detail.row.row.skuId.value;
                    var dataIndex = e.detail.row.row.dataIndex; // Data index
                    $scope.softDeleteSKU.splice(dataIndex, 1);
                    var len = $scope.multiProposal.length;
                    for (var i = 0; i < len; i++) {
                        var data = $scope.multiProposal[i];
                        if (data.skuId == skuId) {
                            $scope.multiProposal.splice(i, 1);
                        }
                    }
                }
            }, 200);

        });

        document.getElementById("pTable").addEventListener("px-select-all-click", function(e) {
            var allSelectedRows = e.detail;
            $scope.multiProposal = [];

            angular.forEach(allSelectedRows, function(value, key) {
                var rateId;
                var cost;
                var skuId = value.row.skuId.value;
                //var proposalId = value.row.proposalId.value;
                angular.forEach($scope.rateJson, function(value, key) {
                    if (skuId == value.skuId) {
                        rateId = value.rateId;
                        cost = value.price;
                    }
                });
                var proposaldata = {
                    "skuId": skuId.toString(),
                    "ticketSiteDetailId": ticketSiteDetailsId.toString(),
                    "surveyTypeId": $scope.surveyTypeId.toString(), //[TODO] remove hardcoded surveyTypeId
                    "quantity": e.detail.row.row.quantity.value,
                    "wattage": e.detail.row.row.watts.value,
                    "ballastFactor": e.detail.row.row.ballastFactor.value,
                    "burnHours": e.detail.row.row.burnHours.value,
                    "energyRate": e.detail.row.row.energyRate.value
                };
                $scope.multiProposal.push(proposaldata);
                proposaldata = {};
            });
        });

        
        
        function approve() {
            console.log("poorna rao",$scope.stageselect.StageId);
            var dataToSend = $scope.jsonData2;
            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteDetailsComment": "",
                "sendBackFlag": "N",
                "action": "approvedStage",
                "sendBackComments": "",
                "ticketSiteComments": "",
                "shipdate": "",
                "maintenance": dataToSend.maintenance,
                "rebate": dataToSend.rebate,
                "createdBy": dataToSend.createdBy,
                "selectedContractorForNextStage": "",
                "selectedNextStage": $scope.stageselect.StageId,
                "mediaList": [{
                    "directory": "",
                    "fileName": "",
                    "contentType": ""
                }]

            }
            
            console.log("Datdddddddd",data);
            commonServices.senbackRejectApprove(data).then(function(respData) {
                console.log("Appvove response", respData);
                $scope.submitError = respData.data.msg;
                //if (respData.data.status == "SUCCESS" && respData.status == 201 || respData.status == 200) {
                    if (respData.data.status == "SUCCESS") {
                    // var submitbtn = document.querySelector('#btnSubmit')
                    // submitbtn.setAttribute('disabled', '');
                    // var approvebtn = document.querySelector('#btnApprove')
                    // approvebtn.setAttribute('disabled', '');

                    // $scope.disableSubmit = true;
                    // $scope.disablesave = true;
                    // $scope.isAddNewVersion = true;
                    // $scope.disableAddSKU = true;
                    // $scope.disableDeleteSKU = true;
                    // $scope.finalversion = true;
                    disable_Controls();
                    var alert1 = document.querySelector('#submitAlert');

                    alert1.toggle();
                } else if(respData.data.status == "FAILED"){
                    if(!($scope.submitError == '' && $scope.submitError == null && $scope.submitError == undefined)){
                        $scope.msgApprove = $scope.submitError;
                    }else {
                         $scope.msgApprove = "Data not submitted successfully";
                    }
                    var alert1 = document.querySelector('#submitAlertForFail');
                                alert1.toggle();
                    $scope.disableSubmit = true;
                    disable_Controls();
                }
            }).catch(function(error) {

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
                getDesignVersionList(fileData.ticketsiteIdsList[3]); //To get the final version of design.. 3 is the stage index for design
                if (fileData.ticketsiteIdsList[2]) {
                    $scope.surveyTicketId = fileData.ticketsiteIdsList[2][0];
                } else {
                    ps.removeAttribute('active');
                    $scope.isAllDataLoaded = true;
                }

                $scope.designTicketId = fileData.ticketsiteIdsList[4][0];
                console.log($scope.designTicketId)
                var x = fileData.ticketsiteIdsList[6]
                if (typeof x != 'undefined') {
                    $scope.poTicketID = '';
                    $scope.poTicketID = x[0];
                    console.log($scope.poTicketID);
                    data = fileData.allMedia[4]; // 4 is the stage number, to get the files for a particular stage.
                    displayMedia(data);
                } else {
                    data = fileData.allMedia[4]; // 4 is the stage number, to get the files for a particular stage.
                    if (data.length > 0) {
                        displayMedia(data); // Call the function which prepares the final data.
                    } else {
                        $scope.$evalAsync(function() {
                            $scope.showFileUploadedSec = false;
                        });
                    }

                }
                //$scope.$broadcast("poTicketID"); //[TODO] enable if ship date not set
            }).catch(function(error) {
                console.log('error fetching files');
            });
        }



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
            $scope.showFileUploadedSec = true; // Display files header.
            var tempArr = [];
            for (var i = 0; i < mediaJson.length; i++) {
                var fileName = mediaJson[i].fileName; // Cache the file extension.
                remoteUrl = commonServices.getBlobStoreURL() + '/getBlob?directory=' + mediaJson[i].directory + '&fileName=' + fileName + '&contentType=' + mediaJson[i].contentType;
                var ext = '.' + fileName.split('.')[1];
                fileType = commonServices.getFileName(ext, validFileExtensions);
                var tempClass = uploadedFileCls[fileType];
                console.log(uploadedFileCls['defaultClass'])
                console.log(tempClass || uploadedFileCls['defaultClass'])
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

        //--------------------------------------------------------------------------------------------------------------
        // Function: exportCSV
        //   Used to export data to csv file.
        // Parameters:
        //   mediaJson - Files data to be displayed.
        // Returns:
        //   No value.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        $scope.exportCSV = function() {
            var reportTitle = "Site Proposal Summary",
                CSV = '',
                URI = '',
                fileName = 'Site_Proposal_Summary',
                rowData = '', // Data for each row.
                link = '', // link for downloading the file.
                siteProposalSummary = {}, // Summary of site proposal data.

                siteProposalSummary = {
                    'SiteID': $scope.siteId,
                    'SiteName': $scope.siteName,
                    'ProjectManager': $scope.pm,
                    'CurrentStage': $scope.currentStage,
                    'address': $scope.siteAddress
                },

                roiParams = {
                    'TotalCostBeforeInstallation': $scope.surTotCost,
                    'TotalCostAfterInstallation': $scope.proposalTotalCost,
                    'TotalMaterialCost': $scope.materialCostTotal,
                    'TotalLabourCost': $scope.labourCostTotal,
                    'TotalMaintenaceCost': $scope.maintenanceTotal,
                    'TotalRebate': $scope.rebateTotal,
                    'Savings': $scope.netSavings,
                    'PaybackROI': $scope.payBackRoi
                };

            CSV = CSV + '' + reportTitle + "\r\n\n";

            // Write Summary here
            for (var key in siteProposalSummary) {
                CSV = CSV + '' + key + ',' + siteProposalSummary[key] + '\n';
            }
            CSV = CSV + '\n';

            // Code to export Survey details..
            CSV = CSV + 'Survey Details' + '\n\n';
            // Write header\label
            var headerLabel = '';
            for (var label in $scope.propSurveyDet[0]) {
                console.log('label---', label);
                headerLabel = headerLabel + ',' + $scope.headers[label];
            }
            CSV = CSV + '' + headerLabel + '\n';
            // loop to get the entire survey data into excel.
            rowData = '';
            for (var index = 0; index < $scope.propSurveyDet.length; index++) {
                for (var key in $scope.propSurveyDet[index]) {
                    rowData = rowData + ',' + $scope.propSurveyDet[index][key];
                }
                CSV = CSV + '' + rowData + '\n';
                rowData = '';
            }
            CSV = CSV + '\n';
            // Export proposal list..
            CSV = CSV + 'Proposal List' + '\n\n';
            // Write header\label
            var headerLabel = '';
            for (var label in $scope.jsonData2[0]) {
                headerLabel = headerLabel + ',' + $scope.headers[label];
            }
            CSV = CSV + '' + headerLabel + '\n';
            headerLabel = '';
            // loop to get the entire proposal list data into excel.
            rowData = '';
            for (var index = 0; index < $scope.jsonData2.length; index++) {
                for (var key in $scope.jsonData2[index]) {
                    rowData = rowData + ',' + $scope.jsonData2[index][key];
                }
                CSV = CSV + '' + rowData + '\n';
                rowData = '';
            }

            // Export total costs, savings and other details.
            CSV = CSV + '\n';
            for (var key in roiParams) {
                CSV = CSV + '' + key + ',' + roiParams[key] + '\n';
            }
            URI = 'data:text/csv;charset=utf-8,' + escape(CSV);
            link = document.createElement("a");
            link.href = URI;
            link.style = "visibility:hidden";
            link.download = fileName + '.csv';
            link.click();
        }


        $scope.submit = function() {
            
            console.log("**************ssss"+$scope.stageform.stageformdata.$invalid);
               if($scope.stageform.stageformdata.$invalid)
                {
                  $scope.stageNameSelect = "Please Select Next Stage";
                     return false;
                    
                }
            
            $scope.disableSubmit = false;
            $scope.disablesave = true;
            $scope.isAddNewVersion = true;
            $scope.disableAddSKU = true;
            $scope.disableDeleteSKU = true;
            $scope.finalversion = true;

            $scope.showQuanMsg = false;
            var boolSubmit = true; // Flag to check whether all values are valid.
            if ($scope.finalversion) {
                var data = $scope.jsonData2;
                boolSubmit = chkZeroQuantity($scope.jsonData2);
                   if(boolSubmit) {
                       console.log("$scope.selected", $scope.selected);
                       if($scope.finalversion) {
                           $scope.quantityZeroMsg = "";
                            $scope.showQuanMsg = false;
                            // Checkbox must be selected..
                           $scope.createFinalData($scope.selected);
                       } else {
                           $scope.quantityZeroMsg = "Please select a final version";
                            $scope.showQuanMsg = true;
                           $scope.disableSubmit = true;
                            return false;
                       }

                        document.getElementById('check').checked = false
                        $scope.finalversion = false;
                        approve();
                        $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                        var okRedirect = document.getElementById('okRedirect');
                        okRedirect.setAttribute('onclick', "window.location = '/createproposal/" + $scope.redirectPage + "'");

                } else {
                    $scope.quantityZeroMsg = "Quantity should not be zero";
                    $scope.showQuanMsg = true;
                    $scope.disableSubmit = false;
                }
            } else {
                $scope.quantityZeroMsg = "Please select a final version";
                $scope.showQuanMsg = true;
                $scope.disableSubmit = false;
                return false;
            }
        }

        function disable_Controls() {
            $scope.finalversion = true;
            $scope.disableSubmit = true;
            $scope.disableAddSKU = true;
            $scope.disableDeleteSKU = true;
            $scope.disablesave = true;
	    $scope.isAddNewVersion = true;
        }

        function chkZeroQuantity(a_data) {
            var returnVal = true;
            console.log('a_data chk quantity', a_data);
            a_data.forEach(function(obj) {
                if (obj.quantity == 0) {
                    returnVal = false;
                }
            });
            return returnVal;
        }

        // Section to display design final verson data..
        function getDesignVersionList(a_designTicketSiteDetails) {
            console.log("a_designTicketSiteDetails[0][0]", a_designTicketSiteDetails[0]);
            designService.retriveVersions(a_designTicketSiteDetails[0]).then(function(list) {
                console.log("Design version list----", list);
                list.data.forEach(function(obj, key) {
                    if (obj.hasOwnProperty('finalFlag') && obj.finalFlag == 'Y') {
                        getDesignDetailData(a_designTicketSiteDetails[0], obj.versionId);
                    }
                });
            }).catch(function(err) {
                console.error("Error fetching design version list");
            });
        }

        function getDesignDetailData(a_ticketSiteDetailsId, a_versionId) {
            console.log("Final Version id", a_ticketSiteDetailsId, a_versionId);
            designService.getVersionViewData(a_ticketSiteDetailsId, a_versionId).then(function(resp) {
                console.log("resp of design data--RAHUL RC", resp);
                var solutionArr = resp.data.solution,
                    tempArr = [],
                    tmpObj = {};
                for (var i = 0; i < solutionArr.length; i++) {
                    console.log("Data solution to level");
                    var subData = solutionArr[i].data;
                    for (var j = 0; j < subData.length; j++) {
                        console.log("Data solution");
                        tmpObj = {
                            "surveySerialNo": solutionArr[i].row,
                            "sku": subData[j].sku,
                            "qty": subData[j].qty
                        }
                        tempArr.push(tmpObj);
                        tmpObj = {};
                    }

                }
                fetchRateDataDesign(tempArr);

            }).catch(function(error) {
                console.error("Error fetching Design Data", error);
            });
        }

        var designCnt = 0;
        $scope.designArray = [];
        var rowsData = [];

        function fetchRateDataDesign(a_data) {
            rowsData = a_data;
            if (rowsData.length > 0) {
                var skuId = rowsData[designCnt].sku;
                proposalServices.getSkuDataBySkuId(skuId).then(function(skuDataRes) { // get rate data
                    proposalServices.getSkuDescById($scope.authData, skuId).then(function(skuDesc) {
                        var obj = {
                            "surveySerialNo": (Number(rowsData[designCnt].surveySerialNo)),
                            "skuId": skuDataRes.skuId.toString(),
                            "skuDescription": skuDesc.data[0].skuDescription,
                            "quantity": (Number(rowsData[designCnt].qty) || 0),
                            "watts": 0,
                            "materialCostPerSku": (skuDataRes.price || 0),
                            "labourCostPerSku": (skuDataRes.laborCost || 0),
                            "maintenance": (skuDataRes.maintenance || 0),
                            "rebate": (skuDataRes.rebate || 0),
                            "ballastFactor": 0,
                            "burnHours": 0,
                            "energyRate": 0
                        };
                        $scope.designArray.push(obj);
                        obj = {};
                        designCnt++;
                        if (designCnt < rowsData.length) {

                            fetchRateDataDesign(rowsData); //Recurisve call
                        } else {
                            designCnt = 0;
                            prepareDataDesign($scope.designArray);
                        }
                    }).catch(function(errorDesc) {
                        console.error("Error fetching SKU description", errorDesc);
                    });
                }).catch(function(error) {
                    console.error("Error fetching data by sku id from asset", error);
                });
            }


        }

        function prepareDataDesign(a_data) {

            $scope.jsonData2 = [];
            $scope.jsonData2 = a_data;

            console.log('$scope.designArray final-------------', a_data);
            finalDataPropo($scope.jsonData2);
            $scope.addNewProposal(true);

            /*$timeout(function() {
                 getTotals($scope.jsonData2); // $scope.jsonData2 refers to final data for proposal table
             }, 300);
             createDataTable(true, false, true);*/
        }
        // Design Table display section END
        
           
      function getInstallationDataStatus(){
          
          $scope.installationRejectStatus = "";
          
         commonServices.getInstallRejectStatus(ticketId).then(function(respData) {
                console.log("InstallStatusData", respData.installRejectStatus);
                  $scope.installationRejectStatus  = respData.installRejectStatus == "N" ? false : true;
                }).catch(function(error) {
                    $scope.errorMessage = "Please Select Next Stage";;
            });
      } 
        getInstallationDataStatus();
        
    function getStagesNames(){

      $scope.createProposalStageData = "";
      $scope.StageId = "";

     commonServices.getStageIdName().then(function(respData) {
            console.log("getAllStagesNames", respData);
              $scope.createProposalStageData  = respData;
        // console.log("***********************************************"+respData.StageId);
              //$scope.StageId = respData.StageId; 
                
              
            }).catch(function(error) {
            
        });
      } 
        getStagesNames();

        
        

    }]);
});