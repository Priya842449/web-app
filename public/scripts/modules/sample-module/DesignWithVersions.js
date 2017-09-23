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
    controllers.controller('designSiteDetailsCtrlWithVersion', ['$state', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'designServices', 'adminServices', 'proposalServices', '$timeout', '$compile', 'designService', function($state, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices, designServices, adminServices, proposalServices, $timeout, $compile, designService) {
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
        $scope.fileType = "";
        $scope.showDelButton = "visible"; // To show hide the delete button on files uploaded..
        $scope.mediaArray = [];
        $scope.filename = [];
        $scope.directory = [];
        $scope.validFileExtensionsForImage = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        $scope.validFileExtensionsForPdf = [".pdf"];
        $scope.validFileExtensionsForExcel = [".xlsx", ".xls", ".cvs"];
        $scope.validFileExtensionsForText = [".txt"];
        $scope.disableSendBack = false; // To disable enable send back button..
        var url = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku';
        $scope.fromDropDownFlag = false;
        var count = 0;
        var length = 0;
        var skuList = [];
        var existingData = [];
        $scope.existingData = [];
        $scope.tempForTable = []
        $scope.idArray = [];
        $scope.updateVersionId = "";
        $scope.isFinalDesign = false;
        $scope.updateVerNameDisable = false;
        $scope.config;
        $scope.hideFinalCheckBox = true;
        $scope.finalFlag = "N"
        $scope.submitCheck = false;
        $scope.Neither = true;
        $scope.skuId = '';
        $scope.skuIdTbl = '';
        $scope.skuDescription = '';
        $scope.jsonData = [];
        $scope.jsonDataCopy = [];
        $scope.siteName = '';
        $scope.surveyTypeOnAdd = '';
        $scope.onOutdoorTab = false;
        $scope.onIndoorTab = false;
        $scope.saveDisabled = true;


        var jsonData1 = {};

        $scope.hideDelete = false;

        var uploadUrl = commonServices.getBlobStoreURL();
        $scope.fileArrayTemp = [];
        var flagIndoor = 0;
        var flagOutdoor = 0;
        var ticketId = $stateParams.ticketId;
        var siteId = $stateParams.siteId;
        //console.log(siteId);
        var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;
        var surveyTicketSiteDetailsId;
        var dynamicURL = commonServices.getAssetURL() + "/site?filter=" + 'siteId=' + siteId + '&fields=siteName,siteId,siteLocation';

        /* 	var okRedirect=document.getElementById('okRedirect');
        	
        		okRedirect.setAttribute('onclick',"window.location = '/designSiteDetails/"+$scope.redirectPage+"'");
        		console.log(okRedirect);
        	 */

        var map = document.getElementById('google-map');

        init();


        $scope.tokensetup = function() {
            //alert();
            commonServices.getAuthToken().then(function(config) {
                $scope.config = config;
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId, config).success(function(data) {
                    var sitAdd = data[0].siteAddress
                    $scope.siteAddress = sitAdd.street + "," + sitAdd.city + "," + sitAdd.region + "," + sitAdd.country
                });
            });
        }

        $scope.tokensetup();
        getRateData();





        $('#tab1').click(function() {
            $scope.onIndoorTab = true;
            $scope.surveyTypeOnAdd = 'Indoor';
            $scope.isAddVersionIndoor = true; // To show indoor table
            if ($scope.isAddClickNew) {
                $scope.addVersion("Indoor");
            } else if ($scope.isdropdownselected) {
                $scope.viewSavedVersion($scope.toPassDatatoFunction);
            }
        });

        $('#tab2').click(function() {
            loadMarkers($scope.outdoorData);
            $scope.onOutdoorTab = true;
            $scope.surveyTypeOnAdd = '';
            if ($scope.isAddClickNew) {
                $scope.addVersion("");
            } else if ($scope.isdropdownselected) {
                console.log($scope.toPassDatatoFunction)
                $scope.viewSavedVersion($scope.toPassDatatoFunction);
            }
            var map = document.getElementById('google-map');
            map.notifyResize();
            map.resize();

        });
        //**************************Load floor plan starts here**************************************************


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




        var ssoObj = window.localStorage.getItem("SSO_ID");
        commonServices.getSiteListForPM(ssoObj, "Design", "InProgress").then(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].ticketId == ticketId) {
                    $scope.siteIdFromJobId = data[i].siteId;
                    var paperStation = document.querySelector('paper-typeahead-input-station');
                    var remoteUrl = adminServices.getAssetURL() + '/station?filter=parent=/site/' + $scope.siteIdFromJobId + ':stationName=%QUERY*&fields=stationId,stationName';
                }
            }
        });

        commonServices.getSiteListForPM(ssoObj, "Design", "Completed").then(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].ticketId == ticketId) {
                    $scope.siteIdFromJobId = data[i].siteId;
                }
            }
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
            commonServices.getIndoorData(surveyTicketSiteDetailsId, $scope.surveyTypeIdForFloor).then(function(imgCoord) {
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

                if ($scope.isAddClickNew) {
                    $scope.addVersion("Indoor");
                } else if ($scope.isdropdownselected) {
                    $scope.viewSavedVersion($scope.toPassDatatoFunction);
                }

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
            $scope.siteId = a_siteid; // Set the site id on scope for further excess.
            $scope.stationData = [];
            $scope.stationData[0] = { stationName: "Select Station" };
            $scope.station = $scope.stationData[0];
            var URL = adminServices.getAssetURL() + '/station?filter=siteId=' + $scope.siteIdFromJobId + '<parent[t3]';
            $http.get(URL, $scope.config).success(function(data) {
                if (data.length === 0 || data === undefined) {
                    $scope.showMessage = true;
                    $scope.errorMessage = 'No data found to access floor plan..';
                    return;
                } else {
                    $scope.showMessage = false;
                    $scope.errorMessage = '';
                }
                data.forEach(function(obj, index) {
                    $scope.stationData.push(obj);
                });

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

        // *********************************Load FLoor plan ends here************************************************************     



        function getRateData() {
            proposalServices.getRateData().then(function(data) {
                $scope.rateJson = data;
            });
        }

        $scope.popupSKUs = [];
        window.addEventListener('pt-item-confirmed', function(e) {
            var srcElement2 = e.srcElement;
            if (srcElement2.className == 'popupSKU') {
                var tmp = {
                    'id': e.srcElement.id,
                    'skuId': srcElement2.__data__.keyid,
                    'skuDescription': srcElement2.__data__.inputValue
                }
                var len = $scope.popupSKUs.length;
                var boolPush = true;
                if (len == 0) {
                    $scope.popupSKUs.push(tmp);
                } else {
                    for (var i = 0; i < len; i++) {
                        if ($scope.popupSKUs[i].id == tmp.id) {
                            $scope.popupSKUs[i] = tmp;
                            boolPush = false;
                        }
                    }
                    if (boolPush) {
                        $scope.popupSKUs.push(tmp);
                    }
                }

                return false;
            }
            var data = srcElement2.__data__;
            $scope.skuId = data.keyid;
            //alert($scope.skuId);

            commonServices.getAuthToken().then(function(data1) {
                commonServices.getWattage(data1, $scope.skuId).then(function(data) {
                    $scope.wattage = data[0].ballastWatts;
                });
            });

        });

        $scope.solutionList = [{ solutionName: 'Select Solution', solutionId: 'no' },
            { solutionName: 'Retrofit', solutionId: 'retrofit' },
            { solutionName: 'Replace', solutionId: 'replace' },
            { solutionName: 'Install', solutionId: 'install' },
            { solutionName: 'Do Nothing', solutionId: 'donothing' },
            { solutionName: 'Remove', solutionId: 'remove' },
        ];
        $scope.selectedSoln = $scope.solutionList[0];
        var dropDownSelected = [];
        $scope.viewSelectedSoln = function(a_dataSelected) {
            //$scope.solSelected=a_dataSelected.solutionId;
            console.log(dropDownSelected)

            console.log($scope.fromDropDownFlag)
            if ($scope.fromDropDownFlag) {
                for (var i = 0; i < $scope.disableDropDown.length; i++) {
                    console.log(parseInt($scope.disableDropDown[i].srNo) - 1, " == ", $scope.btnIndex)
                    if (parseInt($scope.disableDropDown[i].srNo) - 1 == $scope.btnIndex) {

                        console.log($scope.disableDropDown[i].solution.toLowerCase())
                        dropDownSelected.push($scope.disableDropDown[i].solution.toLowerCase())
                    }
                }

            }
            angular.forEach(solForSave[$scope.btnIndex], function(key, value) {
                console.log(solForSave[$scope.btnIndex])
                console.log(value)
                if (solForSave[$scope.btnIndex][value].length > 0) {
                    if ((jQuery.inArray(value.toLowerCase(), dropDownSelected)) == -1) {
                        console.log(value)
                        dropDownSelected.push(value.toLowerCase())
                    }
                }
            });
            console.log(dropDownSelected)
            if ((jQuery.inArray(a_dataSelected.solutionId, dropDownSelected)) == -1) {
                dropDownSelected.push(a_dataSelected.solutionId)
                    //                createSection(a_dataSelected.solutionId)
            }


        }

        //[TODO] code for version creation
        $scope.savedDesignList = [{ designName: 'Select To View/Modify', versionId: 'none' }];
        $scope.selectedDesign = $scope.savedDesignList[0]; // To show default selected..
        function retriveVersions() {
            designService.retriveVersions(ticketSiteDetailsId).then(function(responseList) {
                //            designService.retriveVersions("1678").then(function(responseList) {
                console.log("Proposal list responseList", responseList);
                if (responseList.data.length > 0) {
                    $scope.isNewFlag = 'Y';

                    responseList.data.forEach(function(obj) {
                        console.log(obj.finalFlag)
                        if (obj.finalFlag == "P") {
                            $scope.submitCheck = true;
                        }
                        $scope.savedDesignList.push(obj);
                    });
                } else {
                    $scope.isNewFlag = 'N';
                }
            });
        }
        $scope.isNewFlag = 'N';

        retriveVersions(); // To retrive the design list..        
        function prepareVersionData(a_existingData) {
            finalVersionData(a_existingData, [], false, true); // Prepare finalData
        }


        function finalVersionData(a_existingData, a_solution, isViewData, isOnLoad, isSolnData) {
            var arrayData = [],
                tempObj = {};
            var noSoln = false;
            console.log('$scope.finalSolution---------- ', $scope.finalSolution)
            console.log("a_existingData---->", a_existingData)
            if (a_existingData != undefined) {
                a_existingData.forEach(function(obj, key) {
                    if ($scope.isFinalDesign) {
                        var addData = '<div id="btnDiv"><input type="button" id="btnid" onclick="callControllerFn(' + a_existingData[key].Row + ')" class="buttonPosition" style="bottom:0px;background:#ff9821" value="Add/Edit" disabled="disabled"></button></div>';
                        tempObj['addData'] = addData;
                    } else {
                        var addData = '<div id="btnDiv"><input type="button" id="btnid" onclick="callControllerFn(' + a_existingData[key].Row + ')" class="buttonPosition" style="bottom:0px;background:#ff9821" value="Add/Edit" ng-disabled="isFinalDesign"></button></div>';
                    }
                    tempObj['addData'] = addData;
                    tempObj['Row'] = obj.Row;
                    for (var i = 0; i < $scope.finalSolution.length; i++) {
                        if (isSolnData && a_existingData[key].Row == $scope.finalSolution[i].indexCount) {
                            tempObj['solution'] = $scope.finalSolution[i].soln;
                            noSoln = true;
                        } else if (isSolnData && a_existingData[key].Row != $scope.finalSolution[i].indexCount) {}
                    }
                    if (isSolnData && !(noSoln)) {
                        tempObj['solution'] = "-";
                    }
                    for (var key in obj) {
                        tempObj[key] = obj[key]
                    }
                    arrayData.push(tempObj);
                    tempObj = {};
                });
                //        console.log("arrayData", arrayData);
                $scope.autoUpdate = arrayData;
                if (isOnLoad) {
                    $scope.dropdownItems = a_solution; // Update on load only
                    $scope.designSurveyExist = arrayData;
                }
            }


            return arrayData;
        }

        function setRadioButton(a_dataSelected) {

            designService.retriveVersions(ticketSiteDetailsId).then(function(responseList) {
                if (responseList.data.length > 0) {
                    responseList.data.forEach(function(obj) {
                        if (obj.versionId == a_dataSelected.versionId) {
                            if (obj.finalFlag == "Y") {
                                $scope.Neither = false;
                                $scope.Preferred = false;
                                $scope.Final = true;


                            } else if (obj.finalFlag == "N") {
                                $scope.Final = false;
                                $scope.Neither = true;
                                $scope.Preferred = false;
                            } else if (obj.finalFlag == "P") {
                                $scope.Final = false;
                                $scope.Neither = false;
                                $scope.Preferred = true;
                            }
                        }
                        createRadioBtns($scope.Preferred, $scope.Final, $scope.Neither)
                    });
                }
            });

        }

        function createRadioBtns(preferred, final, neither) {
            var radioDiv = document.getElementById("radioDiv");
            var inputRadio1 = document.createElement('input');
            var inputRadio2 = document.createElement('input');
            var inputRadio3 = document.createElement('input');
            radioDiv.innerHTML = "";


            inputRadio1.setAttribute('type', 'radio');
            inputRadio1.setAttribute('ng-checked', preferred);
            inputRadio1.setAttribute('ng-model', 'versionStatus');
            inputRadio1.setAttribute('ng-click', 'finalDesignChecked(selectedDesign)');
            inputRadio1.setAttribute('value', 'P');


            inputRadio2.setAttribute('type', 'radio');
            inputRadio2.setAttribute('ng-checked', final);
            inputRadio2.setAttribute('ng-model', 'versionStatus');
            inputRadio2.setAttribute('ng-click', 'finalDesignChecked(selectedDesign)');
            inputRadio2.setAttribute('value', 'Y');


            inputRadio3.setAttribute('type', 'radio');
            inputRadio3.setAttribute('ng-checked', neither);
            inputRadio3.setAttribute('ng-model', 'versionStatus');
            inputRadio3.setAttribute('ng-click', 'finalDesignChecked(selectedDesign)');
            inputRadio3.setAttribute('value', 'N');
            angular.element(radioDiv).append($compile(inputRadio1)($scope));
            angular.element(radioDiv).append("Preferred ");
            angular.element(radioDiv).append($compile(inputRadio2)($scope));
            angular.element(radioDiv).append("Final ");
            angular.element(radioDiv).append($compile(inputRadio3)($scope));
            angular.element(radioDiv).append("Neither");
        }


        //----------------Proposal Design function end--------------------
        $scope.viewSavedVersion = function(a_dataSelected) {

            setRadioButton(a_dataSelected)
            $scope.updateVerNameDisable = true;
            $scope.toPassDatatoFunction = a_dataSelected; // To pass data later to this same function
            $scope.finalSolution = [];
            $scope.tempForTable = [];
            $scope.solnForService = [];
            solForSave = [];
            var solutionsArr = [];

            $scope.finalVersionData = true; //to disable addversion on click of addversion
            $scope.onAddDisable = true; //to disable addversion on
            $scope.isAddClickNew = false; //To diffrentiate new version from the version selected from dropdown
            $scope.isdropdownselected = true; //To diffrentiate new version from the version selected from dropdown
            $scope.versionName = a_dataSelected.designName; // Selected Design..
            $scope.finalVersonId = a_dataSelected.versionId
                //TODO
            designService.getVersionViewData(ticketSiteDetailsId, a_dataSelected.versionId).then(function(resp) {
                $scope.updateVersionId = resp.data.versionId;
                console.log("resp of design data-- RC", resp);
                var solutionArr = resp.data.solution,
                    tempArr = [],
                    tmpObj = {};
                solutionArr.forEach(function(objData, key) {
                    objData.data.forEach(function(dataObj) {
                        tmpObj = {
                            "surveySerialNo": objData.row,
                            "sku": dataObj.sku,
                            "qty": dataObj.qty,
                            "solutionValue": dataObj.solutionValue
                        }
                        tempArr.push(tmpObj);
                        tmpObj = {};
                    });
                });
                var skuIdString = "";
                for (var i = 0; i < tempArr.length; i++) {
                    if (skuIdString == "") {
                        skuIdString = skuIdString + "skuId=" + tempArr[i].sku;
                    } else {
                        skuIdString = skuIdString + "|" + "skuId=" + tempArr[i].sku;
                    }
                }
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=' + skuIdString, $scope.config).success(function(data) {
                    var skuIdArr = [];
                    var skuIdObjTemp = {};
                    for (var i = 0; i < data.length; i++) {
                        var key = data[i].skuDescription
                        var value = data[i].skuId
                        skuIdObjTemp[value] = key;
                        skuIdArr.push(skuIdObjTemp);
                    }
                    //                    console.log("skuIdArr-->",skuIdArr)
                    for (var i = 0; i < tempArr.length; i++) {
                        tempArr[i]["sku"] = skuIdArr[0][tempArr[i].sku]
                    }
                    showSavedVersion(tempArr); // Display the data..
                });
                $scope.hideFinalCheckBox = false;
            }).catch(function(error) {
                console.error("Error fetching version data", error);
            });



        }


        function showSavedVersion(a_data) {
            //console.log(a_data)
            $scope.fromDropDownFlag = true;
            var designShowData = [];
            var i = 0;
            designShowData = a_data;
            var rows = [];
            for (var i = 0; i < designShowData.length; i++) {

                if ((jQuery.inArray(designShowData[i].surveySerialNo, rows)) == -1) {
                    //                        if(designShowData[i].surveySerialNo=="9" || designShowData[i].surveySerialNo=="10")
                    rows.push(designShowData[i].surveySerialNo)
                }

            }

            var tempDisbale = {},
                tempArr = {};
            $scope.disableDropDown = [];
            for (var i = 0; i < rows.length; i++) {
                var retrofit = [];
                var replace = [];
                var donothing = [],
                    remove = [],
                    install = [];
                for (var j = 0; j < designShowData.length; j++) {
                    tempDisbale = {};
                    if (rows[i] == designShowData[j].surveySerialNo) {
                        tempDisbale = {
                            "srNo": designShowData[j].surveySerialNo,
                            "solution": designShowData[j].solutionValue
                        }
                        $scope.disableDropDown.push(tempDisbale);
                        $scope.btnIndex = parseInt(designShowData[j].surveySerialNo)
                        switch (designShowData[j].solutionValue) {
                            case 'Retrofit':
                                tempArr = {
                                    "sku": designShowData[j].sku,
                                    "qty": designShowData[j].qty
                                };
                                retrofit.push(tempArr)
                                tempArr = {};
                                break;
                            case 'Replace':
                                tempArr = {
                                    "sku": designShowData[j].sku,
                                    "qty": designShowData[j].qty
                                };
                                replace.push(tempArr)
                                break;
                                tempArr = {};
                            case 'DoNothing':
                                tempArr = {
                                    "sku": designShowData[j].sku,
                                    "qty": designShowData[j].qty
                                };
                                donothing.push(tempArr)
                                break;
                                tempArr = {};
                            case 'Remove':
                                tempArr = {
                                    "sku": designShowData[j].sku,
                                    "qty": designShowData[j].qty
                                };
                                remove.push(tempArr)
                                break;
                                tempArr = {};
                            case 'Install':
                                tempArr = {
                                    "sku": designShowData[j].sku,
                                    "qty": designShowData[j].qty
                                };
                                install.push(tempArr)
                                break;
                                tempArr = {};
                        }

                        $scope.isViewing = true; // Flag to tell view or create new
                        $scope.isNewFlag = 'U';
                        //Remove added table and button
                        //$('#viewTable-'+i).remove();
                        $('#surveDesignExisting' + $scope.surveyTypeOnAdd).remove(); //To stop multiple creation of px tables
                        // Remove button
                        $('#saveVersion-' + i).remove();
                        //remove checkbox
                        $('#chkDiv').remove();
                        $scope.isAddVersion = false; // To hide the new version table..
                        //							$scope.isFinalDesign = false; //Default the checkbox should be unchecked..[TODO] this should be set based on data returned on selection from drop down..
                        $scope.viewVersion = true; // To show saved version
                        // Get a copy of existing data i.e outdoorData..
                        var newSol = solnViewData({ "retrofit": retrofit, "replace": replace, "donothing": donothing, "install": install, "remove": remove })
                            // Get a copy of existing data i.e outdoorData..
                        if ($scope.surveyTypeOnAdd == "Indoor") {
                            var copyExistingData = $scope.imgCoord;
                        } else {
                            var copyExistingData = $scope.outdoorData;
                        }
                        var processedData = finalVersionData(copyExistingData, newSol, false, false, true);
                        //var surveyserialNotMatched= surveyserialNotMatchedCheck(copyExistingData,{"retrofit":retrofit,"replace":replace,"donothing":donothing})
                        var savedVersion = createDataTableButton(i, processedData, true, "surveDesignExisting" + $scope.surveyTypeOnAdd);
                        var viewVersionSection = document.getElementById('viewVersion' + $scope.surveyTypeOnAdd);
                        viewVersionSection.appendChild(savedVersion.newTable);
                        var saveButton = savedVersion.saveButton;
                        $compile(saveButton)($scope); // Compile the DOM
                        viewVersionSection.appendChild(savedVersion.divChk);
                        createDataTable(processedData, "surveDesignExisting" + $scope.surveyTypeOnAdd);
                        changeListener(); // To listen to change in option...


                    }

                }
                retrofit = [];
                replace = [];
                donothing = [];
            }
        }
        $scope.headers = {
            "Row": "Survey #",
            "survey_type": "Survey Type",
            "tot_fix_qty": "Total Fixture Quantity",
            "fix_color": "Fixture Color",
            "mounting_hit": "Mounting Height",
            "voltage": "Voltage",
            'solution': "Solution",
            'wattage': 'Wattage',
            'technology': 'Technology',
            'fixture_manufacturer': 'Fixture Manufacturer',
            'fixture_model_number': 'Fixture Model #',
            'pole_type': 'Pole Type',
            'pole_style': 'Pole Style',
            'pole_color': 'Pole Color',
            'tenon_mounting': 'Tenon Mounting',
            'tenon_post_diameter': 'Tenon Post Diameter (inch)',
            'tenon_post_ht': 'Tenon Post Ht (inch)',
            'pole_outside_diameter': 'Pole Outside Diameter At Pole Top',
            'shields': 'Shields',
            'pole_condition': 'Pole Condition',
            'fixture_length': 'Fixture Length',
            'latitude': 'Latitude',
            'longitude': 'Longitude',
            'area': 'Area',
            'comments': 'Comments',
            'image': 'Image',
            'createdBy': 'Created By',
            'addData': 'Add Solution'
        }

        var finalforNotMatched = [];
        //        function surveyserialNotMatchedCheck(dataForCurrentTable,allDataSavedArr){
        //            console.log("dataForCurrentTable--",dataForCurrentTable);
        //            console.log("allDataSaved--",allDataSavedArr);
        //            var retrofit=[],
        //            replace=[],
        //            donothing=[],
        //            tempArr={},
        //            allDataSaved,
        //            fieldId="",
        //            counter=0, 
        //            currentRow,
        //            solArr={};
        // 
        //            angular.forEach(allDataSavedArr,function(value,key){
        //                for(var i=0;i<allDataSavedArr[key].length;i++)
        //                {
        //                    currentRow=allDataSavedArr[key][0].temprow
        //                }
        //            });
        //            dataForCurrentTable.forEach(function(obj, key) {
        //                if(dataForCurrentTable[key].Row!=currentRow){
        //                    counter++
        //                }
        //            });
        //            if(counter==dataForCurrentTable.length){
        //               angular.forEach(allDataSavedArr,function(value,key){
        //                   allDataSaved=allDataSavedArr[key]
        //                    for(var j=0;j<allDataSavedArr[key].length;j++)
        //                    {
        //                        fieldId=allDataSavedArr[key]
        //                         switch(fieldId) {
        //                            case 'Retrofit' :
        //                                tempArr = {                    
        //                                    "sku":allDataSaved[j].sku,
        //                                    "qty" : allDataSaved[j].qty
        //                                };
        //                                retrofit.push(tempArr)
        //                                break;
        //                            case 'Replace' :
        //                                tempArr = {                    
        //                                    "sku":allDataSaved[j].sku,
        //                                    "qty" : allDataSaved[j].qty
        //                                };
        //                                replace.push(tempArr)
        //                                break;
        //                            case 'DoNothing' :
        //                                tempArr = {                    
        //                                    "sku":allDataSaved[j].sku,
        //                                    "qty" : allDataSaved[j].qty
        //                                };
        //                                donothing.push(tempArr)
        //                                break;
        //                        }
        //                    }
        //               });
        //            }
        //            counter=0;
        //            solArr={"retrofit":retrofit,"replace":replace,"donothing":donothing}
        //            solArr["surveyserialnum"]=currentRow;
        //            finalforNotMatched.push(solArr)
        //            console.log("finalforNotMatched-------",finalforNotMatched)
        //            
        ////            for(var i=0;i<allDataSavedArr.length;i++)
        ////                {
        ////                    if(allDataSavedArr[i]!=undefined)
        ////                    {
        ////                        allDataSaved=allDataSavedArr[i]
        ////                        for(var j=0;j<allDataSaved.length;j++){
        ///*                        dataForCurrentTable.forEach(function(obj, key) {
        //                            if(dataForCurrentTable[key].Row!=allDataSaved[j].indexCount){
        //                                counter++
        //                            }
        //                        });*/
        ////                            if(counter==dataForCurrentTable.length){
        ////                                tempArr={};
        ////                                fieldId = allDataSaved[j].sol;
        ///*                                switch(fieldId) {
        //                                    case 'Retrofit' :
        //                                        tempArr = {                    
        //                                            "sku":allDataSaved[j].sku,
        //                                            "qty" : allDataSaved[j].qty,
        //                                            "row":allDataSaved[j].indexCount
        //                                        };
        //                                        retrofit.push(tempArr)
        //                                        break;
        //                                    case 'Replace' :
        //                                        tempArr = {                    
        //                                            "sku":allDataSaved[j].sku,
        //                                            "qty" : allDataSaved[j].qty,
        //                                            "row":allDataSaved[j].indexCount
        //                                        };
        //                                        replace.push(tempArr)
        //                                        break;
        //                                    case 'DoNothing' :
        //                                        tempArr = {                    
        //                                            "sku":allDataSaved[j].sku,
        //                                            "qty" : allDataSaved[j].qty,
        //                                            "row":allDataSaved[j].indexCount
        //                                        };
        //                                        donothing.push(tempArr)
        //                                        break;
        //                                } */
        ////                            }
        ////                            counter=0;
        ////                        }
        ////                    }
        ////                }
        //
        ////            finalforNotMatched.push({"retrofit":retrofit,"replace":replace,"donothing":donothing})
        ////            console.log("finalforNotMatched-------",finalforNotMatched)
        ////            formatnotMatch(finalforNotMatched,dataForCurrentTable,allDataSavedArr)
        //        }

        //        function formatnotMatch(data,dataForCurrentTable,allDataSavedArr)
        //        {
        //            
        //            var retrofit=[],
        //            replace=[],
        //            donothing=[],
        //            tempArr={},
        //            fieldId="",
        //            arraySols={},
        //            allDataSaved,
        //            rows=[];
        //            $scope.preparedNotMatched=[];
        //            angular.forEach(data[0],function(value,key){
        //                  for(var i=0;i<data[0][key].length;i++)
        //                  {
        //                    if((jQuery.inArray(data[0][key][i].row, rows))==-1)
        //                    {
        //                     rows.push(data[0][key][i].row)
        //                    }
        //                  }
        //              });
        //            for(var i=0;i<allDataSavedArr.length;i++)
        //            {       
        //                if(allDataSavedArr[i]!=undefined)
        //                {
        //                allDataSaved=allDataSavedArr[i]
        //                    for(var j=0;j<allDataSaved.length;j++){
        //                        
        //                      fieldId = allDataSaved[j].sol;
        //                        switch(fieldId) {
        //                            case 'Retrofit' :
        //                                tempArr = {                    
        //                                    "sku":allDataSaved[j].sku,
        //                                    "qty" : allDataSaved[j].qty
        //                                };
        //                                retrofit.push(tempArr)
        //                                break;
        //                            case 'Replace' :
        //                                tempArr = {                    
        //                                    "sku":allDataSaved[j].sku,
        //                                    "qty" : allDataSaved[j].qty
        //                                };
        //                                replace.push(tempArr)
        //                                break;
        //                            case 'DoNothing' :
        //                                tempArr = {                    
        //                                    "sku":allDataSaved[j].sku,
        //                                    "qty" : allDataSaved[j].qty
        //                                };
        //                                donothing.push(tempArr)
        //                                break;
        //                        }    
        //                    }
        //                }
        //            }
        //        }


        function createDataTable1(a_data, a_tableId) {
            console.log("a_data in create table columns", a_data);
            var designSurExist = '';
            if (a_tableId) {
                designSurExist = document.querySelector('#' + a_tableId);
            }

            for (var key in $scope.designSurveyExist[0]) {
                if (key in $scope.headers) {
                    var column = document.createElement('px-data-table-column');
                    column.setAttribute('name', key);
                    column.setAttribute('label', $scope.headers[key]);
                    column.setAttribute('filterable', '');
                    column.setAttribute('sortable', '');
                    if (key == 'solution') {
                        column.setAttribute("type", 'dropdown');
                        column.setAttribute('dropdown-items', JSON.stringify($scope.dropdownItems));
                    }
                    if (key == 'image' || key == 'addData') {
                        column.setAttribute('type', 'html');
                    }

                    Polymer.dom(designSurExist).appendChild(column);
                }
            }
        }

        function createDataTable(a_data, a_tableId) {

            //            console.log("a_data in create table columns", a_data);
            var designSurExist = '';
            if (a_tableId) {
                designSurExist = document.querySelector('#' + a_tableId);
            }

            for (var key in a_data[0]) {
                if (key in $scope.headers) {
                    var column = document.createElement('px-data-table-column');
                    column.setAttribute('name', key);
                    column.setAttribute('label', $scope.headers[key]);
                    column.setAttribute('filterable', '');
                    column.setAttribute('sortable', '');
                    // if(key == 'solution') {
                    // column.setAttribute("type", 'dropdown');
                    // column.setAttribute('dropdown-items', JSON.stringify($scope.dropdownItems));
                    // }
                    if (key == 'image' || key == 'solution' || key == 'addData') {
                        column.setAttribute('type', 'html');
                    }

                    Polymer.dom(designSurExist).appendChild(column);
                }

            }
        }

        $scope.finalDesignChecked = function(a_data) {
            console.log("$scope.versionStatus", $scope.versionStatus);
            console.log("--a_data", a_data);
            var preferred, neither, final;
            if ($scope.versionStatus == "P") {
                preferred = true;
                neither = false;
                final = false;
            }
            if ($scope.versionStatus == "Y") {
                preferred = false;
                neither = false;
                final = true;
            }
            if ($scope.versionStatus == "N") {
                preferred = false;
                neither = true;
                final = false;
            }
            createRadioBtns(preferred, final, neither)


            if ($scope.versionStatus == "P") {
                $scope.showPrefferedMsg = "Previous preference discarded.This will be marked as preffered !"
                $timeout(function() {
                    $scope.showPrefferedMsg = '';
                }, 5000);
            }
            if ($scope.versionStatus) {
                if (a_data.versionId != "none") {
                    $scope.finalVersonId = a_data.versionId;
                    $scope.finalFlag = $scope.versionStatus;
                }
                console.log(" $scope.finalVersonId", $scope.finalVersonId)

            } else {
                $scope.finalVersonId = '';
            }
        }



        var versionCounter = 0;
        $scope.addVersion = function(surveyType) {
            if ($scope.versionName == '' || $scope.versionName === undefined) {
                console.error("Please enter design name");
                $scope.isSave = "false"
                $scope.versionValidMsg = "Please enter design name"
                $timeout(function() {
                    $scope.versionValidMsg = '';
                }, 5000);
                return false;
            }
            var isFileValid = validateVersionName($scope.versionName);
            if (isFileValid == 'invalidName') {
                console.error("The design name already exists.. enter different one");
                $scope.isSave = "false"
                $scope.versionValidMsg = "The design name already exists.. enter different one"
                $timeout(function() {
                    $scope.versionValidMsg = '';
                }, 5000);
                return false;
            }
            createRadioBtns(false, false, true);
            $scope.versionStatus = "N";
            $scope.onAddDisable = true; //to disable addversion on click of addversion
            $scope.isAddClickNew = true; //To diffrentiate new version from the version selected from dropdown
            $scope.finalSolution = [];
            $scope.updateVerNameDisable = true;
            $scope.tempForTable = [];
            $scope.solnForService = [];
            solForSave = [];
            $scope.hideFinalCheckBox = false;
            $scope.selectedSoln = $scope.solutionList[0];
            $scope.selectedDesign = $scope.savedDesignList[0];
            $scope.finalVersonId = "";
            //            $scope.isNewFlag="N"
            //Aseem Comments
            //            if($scope.isNewFlag!="U")
            //            {
            //                $scope.updateVerNameDisable=false
            //            }
            $scope.disableDropDown = false;
            //aseem Comments
            //            $scope.versionName = '';

            $scope.isViewing = false; // Flag to tell view or create new
            $('#surveDesignExisting' + $scope.surveyTypeOnAdd).remove();
            // Remove button
            $('#saveVersion-' + versionCounter).remove();
            //remove checkbox
            $('#chkDiv').remove();
            versionCounter++;
            $scope.isAddVersion = true;
            $scope.viewVersion = false; // To hide saved version
            if ($scope.isNewFlag !== 'N' && $scope.isNewFlag !== 'U') {
                $scope.isNewFlag = 'Y';
            }
            if ($scope.isNewFlag == 'U') {
                $scope.isNewFlag = 'Y';
            }

            //           if(surveyType=="Indoor")
            //            {
            //                $scope.surveyTypeOnAdd=surveyType;
            //            }
            console.log("$scope.surveyTypeOnAdd", $scope.surveyTypeOnAdd)
            pxPopulate($scope.surveyTypeOnAdd, true);
        }

        function pxPopulate(surveyType, isAddClick, newSol) {
            if (surveyType == "Indoor") {
                $scope.surveyTypeOnAdd = surveyType;
                $scope.isAddVersionIndoor = true;
                var copyExistingData = $scope.imgCoord;
            } else {
                $scope.surveyTypeOnAdd = "";
                surveyType = "";
                // Get a copy of existing data i.e outdoorData..
                var copyExistingData = $scope.outdoorData;
            }
            if (isAddClick) {
                var processedData = finalVersionData(copyExistingData); // true for viewing data creation
            } else {

                var processedData = finalVersionData(copyExistingData, newSol, false, false, true);
            }
            var newVersionTable = createDataTableButton(versionCounter, processedData, false, "surveDesignExisting" + surveyType);
            console.log("Processed data for adding version", processedData);
            var newVersionSection = document.getElementById('addNewVersion' + surveyType);
            newVersionSection.appendChild(newVersionTable.newTable);
            //Polymer.dom(newVersionTable).appendChild(column);
            var saveButton = newVersionTable.saveButton;
            $compile(saveButton)($scope); // Compile the DOM
            newVersionSection.appendChild(saveButton);
            createDataTable(processedData, "surveDesignExisting" + surveyType); // Create table columns surveDesignExistingIndoor
            changeListener(); // To listen to change in option...




        }
        // a_data requires versionCounter
        function createDataTableButton(a_counter, a_tableData, a_isViewTbl, tableId) {
            $scope.propDataDisplayed = a_tableData; // Data currently displayed on proposal table...
            var returnThis = {};
            var newTable = document.createElement('px-data-table');
            newTable.setAttribute('id', tableId);
            newTable.setAttribute('striped', "");
            newTable.setAttribute('table-data', JSON.stringify(a_tableData));
            newTable.setAttribute('filterable', "");
            var saveButton = document.createElement('button');
            saveButton.setAttribute("id", 'saveVersion-' + a_counter);
            saveButton.setAttribute("ng-click", 'saveVersion()');
            saveButton.setAttribute("ng-disabled", "isFinalDesign");
            var btnText = document.createTextNode("Save");
            saveButton.setAttribute("class", "buttonPosition");
            saveButton.setAttribute("ng-hide", "saveDisabled")
            saveButton.setAttribute("ng-disabled", "saveDisabled")
            saveButton.appendChild(btnText);
            returnThis = { 'newTable': newTable, 'saveButton': saveButton };
            if (a_isViewTbl) {
                var divChk = document.createElement('div');
                divChk.id = "chkDiv";
                divChk.class = '';
                divChk.style = 'display:inline-block;left:30px;position:relative;bottom:30px;';
                returnThis['divChk'] = divChk;
            }
            return returnThis;
        }

        // Save version
        $scope.saveVersion = function() {
            console.log("$scope.solnForService sat--", $scope.solnForService);
            var tempAllData = $scope.solnForService.slice();
            console.log("tempAllData----", tempAllData);
            var isNewVersion = 'N',
                isFileValid = '';
            $scope.isAddVersion = true;
            $scope.viewVersion = false; // To hide saved version table
            //Prepare data to be saved
            var solutionsSelected = [];
            if ($scope.versionName == '' || $scope.versionName === undefined) {
                console.error("Please enter design name");
                $scope.isSave = "false"
                $scope.versionValidMsg = "Please enter design name"
                $timeout(function() {
                    $scope.versionValidMsg = '';
                }, 5000);
                return false;
            }
            if ($scope.isNewFlag != 'U') {
                isFileValid = validateVersionName($scope.versionName);
                if (isFileValid == 'invalidName') {
                    console.error("The design name already exists.. enter different one");
                    $scope.isSave = "false"
                    $scope.versionValidMsg = "The design name already exists.. enter different one"
                    $timeout(function() {
                        $scope.versionValidMsg = '';
                    }, 5000);
                    return false;
                }
            }
            $scope.propDataDisplayed.forEach(function(obj) {
                solutionsSelected.push(obj.solution);
            });

            var skuDescString = "";
            for (var i = 0; i < tempAllData.length; i++) {
                angular.forEach(tempAllData[i], function(key, value) {
                    for (var j = 0; j < tempAllData[i][value].length; j++) {
                        var desc = tempAllData[i][value][j].sku;
                        if (skuDescString == "") {
                            skuDescString = skuDescString + "skuDescription=" + desc
                        } else {
                            skuDescString = skuDescString + "|" + "skuDescription=" + desc
                        }
                    }
                });

            }
            var skuIdArr = [];
            $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=' + skuDescString, $scope.config).success(function(data) {
                var skuIdObjTemp = {};
                for (var i = 0; i < data.length; i++) {
                    var key = data[i].skuDescription
                    var value = data[i].skuId
                    skuIdObjTemp[key] = value;
                    skuIdArr.push(skuIdObjTemp);
                }
                for (var i = 0; i < tempAllData.length; i++) {
                    angular.forEach(tempAllData[i], function(key, value) {
                        for (var j = 0; j < tempAllData[i][value].length; j++) {
                            console.log(value)
                            if (skuIdArr[0][tempAllData[i][value][j].sku] != undefined) {
                                tempAllData[i][value][j]["sku"] = skuIdArr[0][tempAllData[i][value][j].sku] + "";
                            }
                        }
                    });

                }


                //                   -------------------------Save Funtionality-----------------------------------------------------

                var tempObj = {
                    'ticketsitedetailsId': ticketSiteDetailsId,
                    'designName': $scope.versionName,
                    'isFinalFlag': $scope.versionStatus,
                    'solution': tempAllData,
                    'isNewFlag': $scope.isNewFlag
                }
                if ($scope.updateVersionId != "" && $scope.isNewFlag == 'U') {
                    tempObj["versionid"] = $scope.updateVersionId;
                }

                console.log(tempObj)
                designService.saveDesignVersion(tempObj).then(function(response) {
                    console.log(response)
                    var resData = response.data;
                    var resLen = response.data.length;
                    for (var i = 1; i <= resData.length; i++) {
                        $scope.finalVersonId = resData[i - 1].versionId;
                        $scope.savedDesignList[i] = resData[i - 1];
                        $scope.toPassDatatoFunction = resData[i - 1];
                    }
                    $scope.selectedDesign = $scope.savedDesignList[resData.length]
                    $scope.saveMsg = "Save successful"
                    $scope.isSave = true;
                    console.log("$scope.savedProposalList--", $scope.savedProposalList);
                    $scope.hideFinalCheckBox = false;
                    $scope.saveDisabled = true;
                    $scope.isNewFlag = 'U';
                    $scope.updateVerNameDisable = true;
                    $scope.isdropdownselected = true;
                    $scope.isAddClickNew = false;



                    var dataToSave = {
                        'ticketSiteDetailsId': ticketSiteDetailsId,
                        'versionid': $scope.finalVersonId,
                        'isFinalFlag': $scope.versionStatus
                    };
                    console.log("Data to submit", dataToSave);
                    designService.submitFinalVer(dataToSave).then(function(res) {
                        console.log("Flag saved", res)
                    });

                }).catch(function(error) {
                    console.error("error saving design version", error);
                    $scope.saveMsg = "Save unsuccessful";
                    $scope.isSave = false;

                });

                $timeout(function() {
                    $scope.saveMsg = '';
                }, 5000);


            });

        }

        $scope.finalSaveVersion = function() {
            $scope.submitSummary = "Please fill and save  the data for the following :<br/>";
            var clearToSubmit = true;
            var dataSummary = {
                "ticketSiteDetailsIdDesign": ticketSiteDetailsId,
                "ticketSiteDetailsIdSurvey": surveyTicketSiteDetailsId,
                "versionId": $scope.finalVersonId
            }

            // TODO for summary service
            designService.designSummary(dataSummary).then(function(res) {
                //            $http.post("images/designSummary.json").success(function(data){
                console.log(res.data)
                var data = res.data
                var solSummaryStaion = data[0].station;
                for (var i = 0; i < solSummaryStaion.length; i++) {
                    if (solSummaryStaion[i].floors != undefined) {
                        var solSummaryFloor = solSummaryStaion[i].floors
                        for (var j = 0; j < solSummaryFloor.length; j++) {
                            if (solSummaryFloor[j].section != undefined) {
                                var solSummarySection = solSummaryFloor[j].section
                                for (var k = 0; k < solSummarySection.length; k++) {
                                    if (solSummarySection[k].count == 0) {
                                        clearToSubmit = false;
                                        $scope.submitSummary = $scope.submitSummary + "Station Name : " + solSummaryStaion[i].stationName + ", Floor Name : " + solSummaryFloor[j].floorName + ", Section : " + solSummarySection[k].sectionName + "<br>"
                                    }
                                }
                            }
                        }
                    }
                }
                console.log($scope.surveyTypeId)
                if ((jQuery.inArray("3", $scope.surveyTypeId) == -1 || jQuery.inArray("1", $scope.surveyTypeId) == -1) && (jQuery.inArray("2", $scope.surveyTypeId) != -1 || jQuery.inArray("4", $scope.surveyTypeId) != -1)) {
                    if (data[0].others == "0") {
                        $scope.submitSummary = $scope.submitSummary + "Outdoor ";
                        clearToSubmit = false;
                    }
                }

                if (!clearToSubmit) {
                    $('.cleartoSubmit').css("color", "red").html($scope.submitSummary)
                    $timeout(function() {
                        $('.cleartoSubmit').css({}).html("")
                    }, 10000);
                } else {
                    $scope.onAddDisable = false;
                    submitFinalVer();
                }
            });
        }

        function submitFinalVer() {
            if ($scope.finalVersonId != '' && $scope.finalVersonId != undefined) {
                var dataToSave = {
                    'ticketSiteDetailsId': ticketSiteDetailsId,
                    'versionid': $scope.finalVersonId,
                    'isFinalFlag': $scope.versionStatus
                };
                console.log("Data to submit", dataToSave);
                designService.submitFinalVer(dataToSave).then(function(res) {
                    console.log("submitted final", res);
                    $('.cleartoSubmit').css("color", "green").html("Data Submitted Successfully")
                    $scope.updateVerNameDisable = false;
                    $scope.onAddDisable = false;
                    $scope.hideFinalCheckBox = true;
                    $timeout(function() {
                        $('.cleartoSubmit').css("color", "green").html("")
                    }, 5000);
                }).catch(function(err) {
                    console.error("Error saving final version--", err);
                });
            } else {
                console.error("Please select a version to submit");
                $('.cleartoSubmit').css("color", "green").html("Please select a version to submit")
                $scope.updateVerNameDisable = false;
                $timeout(function() {
                    $('.cleartoSubmit').css("color", "red").html("");

                }, 5000);
            }

        }

        function validateVersionName(a_name) {
            var msg = 'validName';

            $scope.savedDesignList.forEach(function(obj) {
                if (obj.designName == a_name) {
                    msg = 'invalidName';
                }
            });
            return msg;
        }
        var retrofitCounter = 0;

        $scope.clickMe = function(a_btnIndex) {

            var container = document.getElementById('retrofit-container');
            container.innerHTML = "";
            var container1 = document.getElementById('replace-container');
            container1.innerHTML = "";
            var container2 = document.getElementById('install-container');
            container2.innerHTML = "";
            var container3 = document.getElementById('donothing-container');
            container3.innerHTML = "";
            var container4 = document.getElementById('remove-container');
            container4.innerHTML = "";
            $scope.finalSolnArr = [];
            var tempRetrofitArr = [];
            var tempReplaceArr = [];
            var tempSolnObj = [];
            var splitSoln = [];
            console.log($scope.tempForTable)
            if ($scope.tempForTable.length > a_btnIndex && $scope.tempForTable[a_btnIndex] != undefined) {
                for (var i = 0; i < $scope.tempForTable[a_btnIndex].length; i++) {
                    var solnValue = $scope.tempForTable[a_btnIndex][i].sol;
                    var skuSpan = $scope.tempForTable[a_btnIndex][i].sku;
                    var finalQty = $scope.tempForTable[a_btnIndex][i].qty;
                    if (solnValue == "Retrofit") {
                        tempSolnObj = {
                            "sku": skuSpan,
                            "solution": solnValue,
                            "qty": finalQty
                        }
                        tempRetrofitArr.push(tempSolnObj)
                        tempSolnObj = {};
                    }
                    if (solnValue == "Replace") {
                        tempSolnObj = {
                            "sku": skuSpan,
                            "solution": solnValue,
                            "qty": finalQty
                        }
                        tempReplaceArr.push(tempSolnObj)
                        tempSolnObj = {};
                    }
                    if (solnValue == "Install") {
                        tempSolnObj = {
                            "sku": skuSpan,
                            "solution": solnValue,
                            "qty": finalQty
                        }
                        tempReplaceArr.push(tempSolnObj)
                        tempSolnObj = {};
                    }
                    if (solnValue == "DoNothing") {
                        tempSolnObj = {
                            "sku": skuSpan,
                            "solution": solnValue,
                            "qty": finalQty
                        }
                        tempReplaceArr.push(tempSolnObj)
                        tempSolnObj = {};
                    }
                    if (solnValue == "Remove") {
                        tempSolnObj = {
                            "sku": skuSpan,
                            "solution": solnValue,
                            "qty": finalQty
                        }
                        tempReplaceArr.push(tempSolnObj)
                        tempSolnObj = {};
                    }
                }
                createElements1(tempRetrofitArr)

                createElements1(tempReplaceArr)



            }

            $scope.btnIndex = a_btnIndex;
            $('#popupScreen').toggle();
        }


        $scope.finalSolution = [];
        $scope.cancelPopup = function() {
            $('#frmPopUp')[0].reset();
            $('#popupScreen').toggle();
            $scope.popupSKUs = [];
            $scope.showDuplicateMsg = "";
            $scope.idArray = [];
            dropDownSelected = [];
            $scope.selectedDesign = $scope.savedDesignList[0]; // To show default selected..
            $scope.selectedSoln = $scope.solutionList[0];
        }




        function validationForDuplicateSKU(sku_obj) {
            var isValid = true;
            var tempSKU = [];

            for (var i = 0; i < sku_obj.length; i++) {
                if ((jQuery.inArray(sku_obj[i].sku, tempSKU)) == -1) {

                    tempSKU.push(sku_obj[i].sku)
                } else {
                    $scope.showDuplicateMsg = "Duplicate SKUs entered. Please enter different SKUs"
                    isValid = false;
                }
            }
            return isValid;
        }

        $scope.updateAll = function() {
            document.getElementById("UpdateConfirm").toggle();
        }
        $scope.cancelUpdate = function() {
            document.getElementById("UpdateConfirm").toggle();
        }
        $scope.updateConfirm = function() {
            $scope.okPopup(true);
        }

        $scope.okPopup = function(isBulkUpdate) {

            if ($scope.isNewFlag == "U") {
                $scope.updateVerNameDisable = true;
            }
            var retrofit = [],
                replace = [],
                install = [],
                remove = [],
                donothing = [];
            var blankFlag = true;
            var inputAll = document.forms["frmPopUp"].getElementsByTagName("input");
            var typeaheadAll = document.forms["frmPopUp"].getElementsByTagName("paper-material");
            for (i = 0; i < inputAll.length; i++) {
                if (inputAll[i].value == "") {
                    blankFlag = false;
                    $scope.showDuplicateMsg = "Please enter all the values";
                    return false;
                }
            }
            var PopUpData = [];
            console.log("$scope.idArray------>", $scope.idArray)
            if ($scope.idArray.length == 0) {
                $scope.showDuplicateMsg = "Please select a Solution and click on Add";
                $timeout(function() {
                    $scope.showDuplicateMsg = '';
                }, 5000);
                return false;
            }
            for (var i = 0; i < $scope.idArray.length; i++) {
                var tempSol = $scope.idArray[i].skuId.split('-')[0]
                var sol = tempSol.substr(3, tempSol.length)
                var tempFinalId = {};
                tempFinalId = {
                    "skuId": $scope.idArray[i].skuId,
                    "qtyId": $scope.idArray[i].qtyId,
                    "solution": sol
                }
                PopUpData.push(tempFinalId)
                tempFinalId = {};

            }
            console.log("PopUpData----->", PopUpData)

            // This mapping is based on ID of the fields..

            var solutionName = {
                    'skuretrofit': 'Retrofit',
                    'skureplace': 'Replace',
                    'skudonothing': 'Do Nothing',
                    'skuinstall': 'Install',
                    'skuremove': 'Remove'
                },
                idSuffix = '',
                fieldId = '',
                tempArr = {};


            for (var i = 0; i < PopUpData.length; i++) {
                fieldId = PopUpData[i].solution;


                switch (fieldId) {
                    case 'retrofit':
                        tempArr = {
                            "sku": $('#' + PopUpData[i].skuId)[0].__data__.inputValue,
                            "qty": $('#' + PopUpData[i].qtyId).val()
                        };
                        if (tempArr.qty == 0) {
                            $scope.showDuplicateMsg = "Quantity cannot be Zero or alphabet";
                            return false;
                        } else {
                            retrofit.push(tempArr);
                            break;
                        }
                    case 'replace':
                        tempArr = {
                            "sku": $('#' + PopUpData[i].skuId)[0].__data__.inputValue,
                            "qty": $('#' + PopUpData[i].qtyId).val()
                        };
                        if (tempArr.qty == 0) {
                            $scope.showDuplicateMsg = "Quantity cannot be Zero or alphabet";
                            return false;
                        } else {
                            replace.push(tempArr)
                            break;
                        }

                    case 'donothing':
                        tempArr = {
                            "sku": $('#' + PopUpData[i].skuId)[0].__data__.inputValue,
                            "qty": $('#' + PopUpData[i].qtyId).val()
                        };
                        donothing.push(tempArr)
                        break;

                    case 'remove':
                        tempArr = {
                            "sku": $('#' + PopUpData[i].skuId)[0].__data__.inputValue,
                            "qty": $('#' + PopUpData[i].qtyId).val()
                        };
                        remove.push(tempArr)
                        break;

                    case 'install':
                        tempArr = {
                            "sku": $('#' + PopUpData[i].skuId)[0].__data__.inputValue,
                            "qty": $('#' + PopUpData[i].qtyId).val()
                        };
                        if (tempArr.qty == 0) {
                            $scope.showDuplicateMsg = "Quantity cannot be Zero or alphabet";
                            return false;
                        } else {
                            install.push(tempArr)
                            break;
                        }
                }
            }
            var retrofitFlag = validationForDuplicateSKU(retrofit);
            var replaceFlag = validationForDuplicateSKU(replace);
            var installFlag = validationForDuplicateSKU(install);
            //                        var donothingFlag=validationForDuplicateSKU(donothing);

            if (retrofitFlag && replaceFlag && install) {
                $scope.isViewing = false; // Flag to tell view or create new
                $('#surveDesignExisting' + $scope.surveyTypeOnAdd).remove();
                // Remove button
                $('#saveVersion-' + versionCounter).remove();
                //remove checkbox
                $('#chkDiv').remove();
                versionCounter++;
                $scope.isAddVersion = true;
                $scope.viewVersion = false; // To hide saved version
                if ($scope.isNewFlag !== 'N' && $scope.isNewFlag !== 'U') {
                    $scope.isNewFlag = 'Y';
                }

                var newSol = solnViewData({ "retrofit": retrofit, "replace": replace, "donothing": donothing, "install": install, "remove": remove }, isBulkUpdate)
                pxPopulate($scope.surveyTypeOnAdd, false, newSol);


                $('#frmPopUp')[0].reset();
                $('#popupScreen').toggle();
                $scope.popupSKUs = [];
                $scope.showDuplicateMsg = "";
                $scope.idArray = [];
                dropDownSelected = [];
                $scope.selectedDesign = $scope.savedDesignList[0]; // To show default selected..
                $scope.selectedSoln = $scope.solutionList[0];
            }
            $scope.onAddDisable = true;
            $scope.saveDisabled = false;
            $scope.hideFinalCheckBox = false;
        }

        var solForSave = [];

        function solnViewData(solutionsObj, isBulkUpdate) {
            var allSolutions = [];


            if (isBulkUpdate) {
                console.log($scope.autoUpdate)
                var indoorSrNo = [1, 2, 3]

                for (var tempIndex = 0; tempIndex < $scope.autoUpdate.length; tempIndex++) {
                    var tmpFinal = {
                        "Retrofit": solutionsObj.retrofit,
                        "Replace": solutionsObj.replace,
                        "DoNothing": solutionsObj.donothing,
                        "Install": solutionsObj.install,
                        "Remove": solutionsObj.remove

                    }
                    console.log("i ", tempIndex, " $scope.autoUpdate[index].Row ", $scope.autoUpdate[tempIndex].Row)
                    var index = $scope.autoUpdate[tempIndex].Row
                    tmpFinal['surveyserialnum'] = index + "";
                    solForSave[tempIndex] = tmpFinal;
                    console.log('solForSave-->', solForSave)
                    allSolutions[index] = tmpFinal;
                    var newSol = ""
                    console.log('allSolutions--------', allSolutions)
                    $scope.solnForService = solForSave;
                    var tempForTable = [];
                    angular.forEach(allSolutions[index], function(value, key) {
                        if (key != "surveyserialnum") {
                            for (var i = 0; i < allSolutions[index][key].length; i++) {
                                var tableArr = { "sol": key, "sku": allSolutions[index][key][i].sku, "qty": allSolutions[index][key][i].qty, "indexCount": index }
                                tempForTable.push(tableArr);
                                tableArr = {};
                                console.log(tempForTable)
                                if (newSol == "") {
                                    newSol = newSol + "<table style='border-collapse:collapse'>" + "<tr><td>" + key + "</td>" +
                                        "<td>" + allSolutions[index][key][i].sku + "</td>" +
                                        "<td>" + allSolutions[index][key][i].qty + "</td></tr>"
                                } else {
                                    newSol = newSol + "<tr><td>" + key + "</td>" +
                                        "<td>" + allSolutions[index][key][i].sku + "</td>" +
                                        "<td>" + allSolutions[index][key][i].qty + "</td></tr>"
                                }
                            }
                        }

                    });
                    $scope.tempForTable[index] = tempForTable;
                    tempForTable = [];
                    console.log('newSol', newSol)
                    if (newSol != "") {
                        var tempSolArr = {
                            "soln": newSol,
                            "indexCount": index
                        }

                        $scope.finalSolution.push(tempSolArr);
                        tempSolArr = {};
                    }
                }
            } else {
                var tmpFinal = {
                    "Retrofit": solutionsObj.retrofit,
                    "Replace": solutionsObj.replace,
                    "DoNothing": solutionsObj.donothing,
                    "Install": solutionsObj.install,
                    "Remove": solutionsObj.remove
                }
                for (var tempIndex = 0; tempIndex < $scope.autoUpdate.length; tempIndex++) {
                    var index = $scope.autoUpdate[tempIndex].Row
                    if (index == $scope.btnIndex) {
                        tmpFinal['surveyserialnum'] = $scope.btnIndex + "";
                        solForSave[tempIndex] = tmpFinal;
                    }

                }
                allSolutions[$scope.btnIndex] = tmpFinal;
                var newSol = ""
                console.log('allSolutions--------', allSolutions)
                $scope.solnForService = solForSave;
                var tempForTable = [];
                angular.forEach(allSolutions[$scope.btnIndex], function(value, key) {
                    if (key != "surveyserialnum") {
                        if (allSolutions[$scope.btnIndex][key] != undefined) {
                            for (var i = 0; i < allSolutions[$scope.btnIndex][key].length; i++) {

                                var tableArr = { "sol": key, "sku": allSolutions[$scope.btnIndex][key][i].sku, "qty": allSolutions[$scope.btnIndex][key][i].qty, "indexCount": $scope.btnIndex }
                                tempForTable.push(tableArr);
                                tableArr = {};
                                if (newSol == "") {
                                    newSol = newSol + "<table style='border-collapse:collapse'>" + "<tr><td>" + key + "</td>" +
                                        "<td>" + allSolutions[$scope.btnIndex][key][i].sku + "</td>" +
                                        "<td>" + allSolutions[$scope.btnIndex][key][i].qty + "</td></tr>"
                                } else {
                                    newSol = newSol + "<tr><td>" + key + "</td>" +
                                        "<td>" + allSolutions[$scope.btnIndex][key][i].sku + "</td>" +
                                        "<td>" + allSolutions[$scope.btnIndex][key][i].qty + "</td></tr>"
                                }
                            }
                        }
                    }
                });
                $scope.tempForTable[$scope.btnIndex] = tempForTable;
                tempForTable = [];
                allSolutions = [];

                var tempSolArr = {
                    "soln": newSol,
                    "indexCount": $scope.btnIndex
                }

                $scope.finalSolution.push(tempSolArr);
                tempSolArr = {};

            }
            return newSol;

        }

        var addCounter = 3; //[TODO] for donothing
        $scope.addSolFields = function(evnt) {
            var currId = $scope.selectedSoln.solutionId;
            var currName = $scope.selectedSoln.solutionName
            console.log('evnt', currId);
            addCounter++; // Increment counter on every add
            var section = document.getElementById(currId + '-section');
            if (section == null) {
                createSection(currId, currName)
            } else {
                createElements(currId);
            }

        }


        $scope.deleteDiv = function(event) {
            var lastDiv = true;
            var deleteButtonId = event.target.id;
            console.log("#deleteDiv-" + deleteButtonId.split('-')[1] + "-" + deleteButtonId.split('-')[2])
            var deleteDivId = "#deleteDiv-" + deleteButtonId.split('-')[1] + "-" + deleteButtonId.split('-')[2]
            $(deleteDivId).remove()
            for (var i = 0; i < $scope.idArray.length; i++) {

                if ("#" + $scope.idArray[i].div == deleteDivId) {
                    $scope.idArray.splice(i, 1)
                }
            }
            for (var i = 0; i < $scope.idArray.length; i++) {
                if ($scope.idArray[i].div.split('-')[1] == deleteButtonId.split('-')[1]) {
                    lastDiv = false
                }
            }
            if (lastDiv) {
                $("#" + deleteButtonId.split('-')[1] + "-section").remove()
            }
            console.log("$scope.idArray After delete", $scope.idArray)
        };

        function createElements1(data) {
            var tempIdArr = [];
            for (var i = 0; i < data.length; i++) {
                var addCounter1 = i;
                var currIdtemp = data[i].solution;
                var currId = currIdtemp.toLowerCase();
                var container = document.getElementById(currId + '-container');
                container.innerHTML = "";
            }
            for (var i = 0; i < data.length; i++) {
                var addCounter1 = i;
                var currIdtemp = data[i].solution;
                var currId = currIdtemp.toLowerCase();
                //alert(currId+'-section')            
                var container = document.getElementById(currId + '-container');
                if (container.innerHTML == "") {
                    var section = document.createElement('div')
                    section.setAttribute('id', currId + '-section');
                    var spanHeader = document.createElement('span');
                    for (var tempIndex = 0; tempIndex < $scope.solutionList.length; tempIndex++) {
                        if (currId == $scope.solutionList[tempIndex].solutionId) {
                            spanHeader.innerHTML = "<br><h1>" + $scope.solutionList[tempIndex].solutionName + "</h1><hr>";
                        }
                    }

                    section.appendChild(spanHeader);
                } else {
                    var section = document.getElementById(currId + '-section');
                }
                var deleteDiv = document.createElement('div')
                deleteDiv.setAttribute("id", "deleteDiv-" + currId + "-" + addCounter1)
                var deleteButton = document.createElement("button");
                deleteButton.setAttribute("id", "deleteButton-" + currId + "-" + addCounter1);
                deleteButton.setAttribute("ng-click", "deleteDiv($event)");
                deleteButton.setAttribute("class", "deleteDiv")
                deleteButton.innerHTML = "X";
                var tempButton = $compile(deleteButton)($scope);
                var paperMaterial = document.createElement('paper-material');
                paperMaterial.setAttribute('elevation', '1');
                paperMaterial.setAttribute('style', "display:inline-block;");
                var typeAhead = document.createElement('paper-typeahead-input-sku');
                typeAhead.setAttribute('max-suggestions', '5');
                typeAhead.setAttribute('placeholder', 'Search by SKU Description');
                typeAhead.setAttribute('remote-url', 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=skuDescription=/.*%QUERY.*/&fields=skuDescription,skuId');
                typeAhead.setAttribute('style', "font-size:10px;");
                typeAhead.setAttribute('class', 'popupSKU');
                typeAhead.setAttribute('id', 'sku' + currId + '-' + addCounter1);
                typeAhead.setAttribute('input-value', data[i].sku);
                //                typeAhead.setAttribute('placeholder', data[i].sku);
                var input = document.createElement('input');
                input.setAttribute('type', 'number');
                input.setAttribute('id', 'txt' + currId + '-' + addCounter1);
                input.setAttribute('value', data[i].qty);
                if (currId == "donothing" || currId == "remove") {
                    typeAhead.setAttribute('disabled', '');
                    input.setAttribute('disabled', '');
                }

                tempIdArr = {
                    "skuId": 'sku' + currId + '-' + addCounter1,
                    "qtyId": 'txt' + currId + '-' + addCounter1,
                    "div": 'deleteDiv-' + currId + '-' + addCounter1
                }
                $scope.idArray.push(tempIdArr)
                tempIdArr = {};
                paperMaterial.appendChild(typeAhead);
                deleteDiv.appendChild(paperMaterial);
                deleteDiv.appendChild(input)
                angular.element(deleteDiv).append(tempButton);
                var br = document.createElement("br");
                deleteDiv.appendChild(br);
                section.appendChild(deleteDiv)
                container.appendChild(section)
                addTypeaheadAuth(currId, addCounter1);
            }
        }

        function createSection(currId, currName) {
            var container = document.getElementById(currId + '-container');
            container.innerHTML = "";
            var tempIdArr = [];
            if (currId == "retrofit") {
                var addCounterNew = 0;
            }
            if (currId == "replace") {
                var addCounterNew = 1;
            }
            if (currId == "install") {
                var addCounterNew = 2;
            }
            if (currId == "donothing") {
                var addCounterNew = 3;
            }
            console.log("Current id", currId);
            var container = document.getElementById(currId + '-container');
            var section = document.createElement('div')
            section.setAttribute('id', currId + '-section');
            var deleteDiv = document.createElement('div')
            deleteDiv.setAttribute("id", "deleteDiv-" + currId + "-" + addCounterNew)
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("id", "deleteButton-" + currId + "-" + addCounterNew);
            deleteButton.setAttribute("ng-click", "deleteDiv($event)");
            deleteButton.setAttribute("class", "deleteDiv")
            deleteButton.innerHTML = "X"
            var tempButton = $compile(deleteButton)($scope);
            var paperMaterial = document.createElement('paper-material');
            paperMaterial.setAttribute('elevation', '1');
            paperMaterial.setAttribute('style', "display:inline-block;");
            var typeAhead = document.createElement('paper-typeahead-input-sku');
            typeAhead.setAttribute('max-suggestions', '5');
            typeAhead.setAttribute('placeholder', 'Search by SKU Description');
            typeAhead.setAttribute('remote-url', 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=skuDescription=/.*%QUERY.*/&fields=skuDescription,skuId');
            typeAhead.setAttribute('style', "font-size:10px;");
            typeAhead.setAttribute('class', 'popupSKU');
            typeAhead.setAttribute('required', 'true');
            typeAhead.setAttribute('id', 'sku' + currId + '-' + addCounterNew);
            var input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('id', 'txt' + currId + '-' + addCounterNew);
            if (currId == "donothing" || currId == "remove") {
                typeAhead.setAttribute('disabled', '');
                if (currId == "donothing") {
                    typeAhead.setAttribute('input-value', 'DONOTHING');
                }
                if (currId == "remove") {
                    typeAhead.setAttribute('input-value', 'REMOVE');
                }
                input.setAttribute('disabled', '');
                input.setAttribute('value', '0');
            }
            paperMaterial.appendChild(typeAhead);

            tempIdArr = {
                "skuId": 'sku' + currId + '-' + addCounterNew,
                "qtyId": 'txt' + currId + '-' + addCounterNew,
                "div": 'deleteDiv-' + currId + '-' + addCounterNew
            }
            $scope.idArray.push(tempIdArr)
            tempIdArr = {};
            input.setAttribute('required', 'true');
            var spanHeader = document.createElement('span');
            spanHeader.innerHTML = "<br><h1>" + currName + "</h1><hr>";
            deleteDiv.appendChild(paperMaterial);
            deleteDiv.appendChild(input)
            angular.element(deleteDiv).append(tempButton);
            var br = document.createElement("br");
            deleteDiv.appendChild(br);
            section.appendChild(spanHeader)
            section.appendChild(deleteDiv)
            container.appendChild(section)

            addTypeaheadAuth(currId, addCounterNew);
        }

        function createElements(currId) {
            var tempIdArr = {};
            console.log("Current id", currId);
            var section = document.getElementById(currId + '-section');
            if (section == null) {
                section = document.createElement(currId + '-section')
            }
            var deleteDiv = document.createElement('div')
            deleteDiv.setAttribute("id", "deleteDiv-" + currId + "-" + addCounter)
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("id", "deleteButton-" + currId + "-" + addCounter);
            deleteButton.setAttribute("ng-click", "deleteDiv($event)");
            deleteButton.setAttribute("class", "deleteDiv")
            deleteButton.innerHTML = "X"
            var tempButton = $compile(deleteButton)($scope);
            var paperMaterial = document.createElement('paper-material');
            paperMaterial.setAttribute('elevation', '1');
            paperMaterial.setAttribute('style', "display:inline-block;");
            var typeAhead = document.createElement('paper-typeahead-input-sku');
            typeAhead.setAttribute('max-suggestions', '5');
            typeAhead.setAttribute('placeholder', 'Search by SKU Description');
            typeAhead.setAttribute('remote-url', 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=skuDescription=/.*%QUERY.*/&fields=skuDescription,skuId');
            typeAhead.setAttribute('style', "font-size:10px;");
            typeAhead.setAttribute('class', 'popupSKU');
            typeAhead.setAttribute('id', 'sku' + currId + '-' + addCounter);
            var input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('id', 'txt' + currId + '-' + addCounter);
            if (currId == "donothing" || currId == "remove") {
                typeAhead.setAttribute('disabled', '');
                if (currId == "donothing") {
                    typeAhead.setAttribute('input-value', 'DONOTHING');
                }
                if (currId == "remove") {
                    typeAhead.setAttribute('input-value', 'REMOVE');
                }
                input.setAttribute('disabled', '');
                input.setAttribute('value', '0');
            }
            paperMaterial.appendChild(typeAhead);
            tempIdArr = {
                "skuId": 'sku' + currId + '-' + addCounter,
                "qtyId": 'txt' + currId + '-' + addCounter,
                "div": 'deleteDiv-' + currId + '-' + addCounter
            }
            $scope.idArray.push(tempIdArr)
            tempIdArr = {};

            deleteDiv.appendChild(paperMaterial);
            deleteDiv.appendChild(input)
            angular.element(deleteDiv).append(tempButton);
            var br = document.createElement("br");
            deleteDiv.appendChild(br);
            section.appendChild(deleteDiv)
            addTypeaheadAuth(currId, addCounter);
        }

        function addTypeaheadAuth(a_currId, a_counter) {
            var inputSkuElement = document.getElementById('sku' + a_currId + '-' + a_counter);
            inputSkuElement.setAttribute('cnf', $scope.auth);
            inputSkuElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
        }
        //[TODO] code for version creation.. END





        $scope.saveData = function() {
            var status = false;
            console.log('line 157', $scope.multiProposal)
            if ($scope.multiProposal.length > 0) {
                //alert('inside if');
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
                console.log(status);
                if (status == false) {
                    //alert('inside true');
                    proposalServices.saveProposalData(data).then(function(response) {
                        console.log(response)
                    });
                } else {}
            }
        }

        $scope.propDataDisplayed = []; // holds data currently displayed on prop version table...
        function changeListener() {
            if ($('#surveDesignExisting').length > 0) {
                document.getElementById("surveDesignExisting").addEventListener("after-save", function(e) {
                    var clickedRow = e.detail.row;
                    console.log(clickedRow.row);
                    if (clickedRow.row != undefined) {
                        $scope.propDataDisplayed[clickedRow.row.dataIndex].solution = clickedRow.row.solution.value;
                    }
                });
            }
        }


        commonServices.getAuthToken().then(function(data) {
            $scope.auth = data.headers.Authorization;

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
                                    "wattage": $scope.wattage
                                };
                                angular.forEach($scope.rateJson, function(value, key) {

                                    if (value.skuId == skuId) {
                                        oldJsonData.sap_article_no = value.sapArticleNo;
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
        });




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
            map.notifyResize();
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
                console.log(data)
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
                    $(".buttonPosition").prop("disabled", true);
                    $scope.isFinalDesign = true;
                    $scope.saveDisabled = true;
                    $scope.disableSendBack = true; // To disable enable send back button..
                    $scope.disableReject = true;
                    $scope.showDelButton = "hidden"; // To show hide the delete button on files uploaded..
                    $scope.attchDisabled = true;
                    var btnSubmit = document.getElementById('btnSubmit');
                    console.log(btnSubmit)
                    btnSubmit.setAttribute('disabled', '');
                    var btnSB = document.getElementById('btnSB');
                    console.log(btnSB)
                    btnSB.setAttribute('disabled', '');
                    var btnMaintenance = document.getElementById('maintenance');
                    btnMaintenance.style.backgroundColor = "#efeff4";
                    btnMaintenance.setAttribute('readonly', '');
                    btnMaintenance.setAttribute('value', maintenance);
                    var btnRebate = document.getElementById('rebate');
                    btnRebate.style.backgroundColor = "#efeff4";
                    btnRebate.setAttribute('readonly', '');
                    btnRebate.setAttribute('value', rebate);
                    btnRebate.setAttribute("backgroundColor", "color: red;");
                }
                var d = new Date(abc);
                surveyTicketSiteDetailsId = data.surveyorTicketSiteDetailsId
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

                // Only Indoor***********************************************************************
                if (jQuery.inArray("3", $scope.surveyTypeId) != -1 || jQuery.inArray("1", $scope.surveyTypeId) != -1) {
                    $scope.onIndoorTab = true;
                    $scope.surveyTypeOnAdd = 'Indoor';
                    var surveyTypeId;
                    if (jQuery.inArray("1", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 1;
                        $scope.surveyTypeIdForFloor = surveyTypeId;
                    }
                    if (jQuery.inArray("3", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 3;
                        $scope.surveyTypeIdForFloor = surveyTypeId;
                        //// alert(surveyTypeId +' :three')
                    }
                    if (jQuery.inArray("7", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 7;
                        $scope.surveyTypeIdForFloor = surveyTypeId;
                    }
                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        $scope.Indoorsequence = data;
                        var IndoorSeqArr = {}
                        for (var i = 0; i < $scope.Indoorsequence.length; i++) {
                            $scope.headers[$scope.Indoorsequence[i].surveyTemplateFieldId] = $scope.Indoorsequence[i].fieldName
                        }
                        if (jQuery.inArray("4", $scope.surveyTypeId) == -1 && jQuery.inArray("2", $scope.surveyTypeId) == -1) {
                            document.getElementById('tab2').style.display = 'none';
                        }
                    });
                }


                //                Outdoor only******************************************
                if (jQuery.inArray("4", $scope.surveyTypeId) != -1 || jQuery.inArray("2", $scope.surveyTypeId) != -1) {


                    var surveyTypeId;
                    if (jQuery.inArray("2", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 2;
                    }
                    if (jQuery.inArray("4", $scope.surveyTypeId) != -1) {
                        surveyTypeId = 4;
                    }

                    commonServices.getFieldsForSurvey(surveyTypeId).then(function(data) {
                        $scope.Outdoorsequence = data;
                        //                    Check whether its only outdoor or both indoor/outdoor******************************

                        if (jQuery.inArray("3", $scope.surveyTypeId) == -1 && jQuery.inArray("1", $scope.surveyTypeId) == -1) {
                            $scope.onOutdoorTab = true;
                            $scope.surveyTypeOnAdd = '';
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
                console.log(x);
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


        $scope.submit = function() { // Submit Function
            $scope.disableSubmit = true;
            checkPreferred();
            //            $scope.Approve();
            //            submitFinalVer(); // Submit final design version..
        }

        function checkPreferred() {
            designService.retriveVersions(ticketSiteDetailsId).then(function(responseList) {
                console.log(responseList)
                var responsedata = responseList.data
                if (responseList.data.length > 0) {
                    for (var obj of responsedata) {
                        //                    responseList.data.forEach(function(obj) {
                        if (obj.finalFlag == "P") {
                            $scope.submitCheck = true;
                            break;
                        } else {
                            $scope.submitCheck = false;
                        }
                    }
                } else {
                    $scope.submitCheck = false;
                }
                $scope.Approve();
            });
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





            if ($scope.isFinalDesign == false) {
                $scope.checkboxError = "Please make a version preferred"
                $timeout(function() {
                    $scope.checkboxError = '';
                }, 5000);
            }

            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteDetailsComment": $scope.cmts,
                "action": "sendbackStage",
                "sendBackFlag": "Y",
                "sendBackComments": " "
            }
            console.log(data)



            commonServices.senbackRejectApprove(data).then(function(respData) {

                var status = respData.status;

                if (!(status == 200 || status == 201)) {
                    $scope.msgSendBack = "Survey could not be sent back!";
                    $scope.isSent = false;
                } else {
                    $scope.disableSendBack = true; // To disable enable send back button..
                    $scope.disableApprove = true; // To disable enable send back button..
                    $scope.attchDisabled = true;
                    $scope.msgSendBack = 'Survey sent back successfully!';
                    $scope.isSent = true;
                }
                $timeout(function() {
                    $scope.msgSendBack = '';
                }, 5000);
            }).catch(function(error) {
                $scope.msgSendBack = "Survey could not be sent back!";
                $scope.isSent = false;
                console.error("Error in sending back the survey--", error);
            });


        }


        $scope.rejectSurvey = function() {

            $scope.disableReject = true;
            $scope.ticketSiteComments = document.getElementById('myTextarea').value;

            var data = {
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "ticketSiteComments": $scope.ticketSiteComments,
                "action": "rejectedStage",
            }
            $scope.comments = document.getElementById('myTextarea1').value;
            var data1 = {
                "comments": $scope.comments,
                "createdBy": window.localStorage.getItem("SSO_ID"),
                "ticketId": ticketId,
            }


            if ($scope.comments != "") {

                commonServices.rejectedComments(data1).then(function(respData1, status1) {
                    if (respData1.data.status == 'SUCCESS') {

                        console.log("Data to reject back", data);

                        commonServices.senbackRejectApprove(data).then(function(respData, status) {
                            console.log(respData);

                            if (!(respData.data.status == 'SUCCESS')) {
                                $scope.msgReject = "Survey could not be rejected!";
                                $scope.isReject = false;
                                $scope.disableReject = false;

                            } else {
                                $scope.msgReject = 'Survey rejected successfully!';
                                $scope.isReject = true;
                                $scope.disableApprove = true;
                                $scope.disableSendBack = true;
                                $scope.disableReject = true;
                                $scope.attchDisabled = true;

                            }
                            $timeout(function() {
                                $scope.msgReject = '';
                            }, 5000);
                        }).catch(function(error) {
                            console.error("Error in rejecting--", error);
                            $scope.disableReject = false;
                        });
                    } else {
                        $scope.msgReject = 'Survey could not be rejected!';
                        $scope.disableReject = false;
                    }
                    $timeout(function() {
                        $scope.msgReject = '';
                    }, 5000);

                });
            } else {
                $scope.msgReject = 'Please enter rejection comments';
                $scope.disableReject = false;
            }
            $timeout(function() {
                $scope.msgReject = '';
            }, 5000);



        }

        $scope.Approve = function() {

            $scope.disableApprove = true;
            $scope.ticketSiteComments = document.getElementById('myTextarea').value;
            //-- alert('----');
            $scope.ticketSiteComments = document.getElementById('myTextarea').value;
            $scope.maintenance = document.getElementById('maintenance').value;
            $scope.rebate = document.getElementById('rebate').value;
            // ----------------------OLD Approve SYNTAX-------------------------------------

            /*var data = {
                "ticketId": ticketId,
                "ticketSiteDetailsId": ticketSiteDetailsId,
                "sendBackFlag": "N",
                "ticketSiteDetailsComment": $scope.ticketSiteComments,
				  "maintenance":$scope.maintenance,
				"rebate":$scope.rebate 
            }*/

            // --------------------NEW Approve SYNTAX----------------------------


            console.log($scope.submitCheck)
                //            $scope.submitCheck=false
            if ($scope.submitCheck == false) {
                $scope.checkboxError = "Please make a version preferred"
                $timeout(function() {
                    $scope.checkboxError = '';
                }, 5000);
                $scope.disableApprove = false;
            } else {
                var data = {
                    "ticketSiteDetailsId": ticketSiteDetailsId,
                    "ticketSiteDetailsComment": $scope.ticketSiteComments,
                    "action": "approvedStage",
                    "maintenance": $scope.maintenance,
                    "rebate": $scope.rebate
                }
                commonServices.senbackRejectApprove(data).then(function(respData, status) {
                    console.log(respData)
                    if ((respData.data.status == 'SUCCESS')) {
                        var alert1 = document.querySelector('#submitAlert');
                        alert1.toggle();
                        disableControls();
                        // $scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
                        // var okRedirect = document.getElementById('okRedirect');
                        // okRedirect.setAttribute('onclick', "window.location = '/designSiteDetails/" + $scope.redirectPage + "'");
                    } else {
                        var alert1 = document.querySelector('#submitAlertForFail');
                        alert1.toggle();
                    }
                    $timeout(function() {
                        $scope.msgSendBack = '';
                    }, 5000);
                }).catch(function(error) {
                    console.error("Error in approving the survey--", error);
                });
            }

        }

        function disableControls() {
            $scope.attchDisabled = true;
            $scope.onAddDisable = true;
            $scope.hideFinalCheckBox = true;
            $scope.updateVerNameDisable = true;
            $scope.isFinalDesign = true;
            $scope.disableApprove = true;
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
                        console.log(response);

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
            console.log('$scope.finalData', $scope.finalData);
            tempArr = [];
        }


        ////////////////Survey Code 

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

                            //var contentType=media[i].contentType;
                            directory.push(media[i].directory);
                            fileName.push(media[i].fileName);
                        }
                        if (fileName.length == 1) {
                            var id = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=image/png';
                            console.log("<a href='#' id='" + id + "' onclick ='gotoLink(this,event)'><paper-button data-dialog='dialog'><img id='imgdyna' src=" + commonServices.getBlobStoreURL() + "/getBlob?directory=" + directory + "&fileName=" + fileName + "&contentType=image/png  /></paper-button></a>")
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
                    prepareVersionData($scope.outdoorData); // [TODO] version data..
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
                    prepareVersionData($scope.indoorData);
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

            angular.forEach(outdoorsurveyData, function(value, key) {
                if (value.outDoorSurveyTypeId == 'GAS CANOPY') {
                    if (outdoorsurveyDataGas.length != 0) {
                        if (outdoorsurveyDataGas[0].outDoorSurveyTypeId == 'GAS CANOPY') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }
                    outdoorsurveyDataGas.push(value);
                    outdoorsurveyData[key].image = "<a href='#' id='' ><paper-button data-dialog='dialog'></paper-button></a>";
                }
                if (value.outDoorSurveyTypeId == 'WALLPACKS') {
                    if (outdoorsurveyDataWall.length != 0) {
                        if (outdoorsurveyDataWall[0].outDoorSurveyTypeId == 'WALLPACKS') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }
                    outdoorsurveyDataWall.push(value);
                }
                if (value.outDoorSurveyTypeId == 'PARKING') {
                    if (outdoorsurveyDataParking.length != 0) {
                        if (outdoorsurveyDataParking[0].outDoorSurveyTypeId == 'PARKING') {
                            outdoorsurveyData[key].outDoorSurveyTypeId = '';
                        }
                    }

                    outdoorsurveyDataParking.push(value);
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
            var gmap = document.querySelector('google-map');
            var poly = document.createElement('google-map-poly');
            poly.setAttribute('closed', '');
            poly.setAttribute('fill-color', '')
            poly.setAttribute('stroke-weight', '4')
            poly.setAttribute('fill-opacity', '.25')
            Polymer.dom(gmap).appendChild(poly);
            commonServices.getAuthToken().then(function(config) {
                $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=' + siteId + '&fields=siteName,siteId,siteLocation,propertyLineCordinate', config).success(function(data) {
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

            angular.forEach(outdoorsurveyDataMap, function(item) {
                var marker = document.createElement('google-map-marker');
                marker.setAttribute('latitude', item.latitude);
                marker.setAttribute('longitude', item.longitude);
                marker.setAttribute('click-events', 'true');
                marker.setAttribute('icon', 'images/pin.png');
                marker.setAttribute('background-color', 'black');
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
                    //console.log('key : '+key1)
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
                if ($scope.outdoorExcelData == '')
                    return;

                JSONToCSVConvertor($scope.excelData1, "Survey", true);
            });
            var outdoorTable = document.getElementById("outdoorTable");
            outdoorTable.setAttribute("table-data", JSON.stringify($scope.outdoorData));
            angular.forEach($scope.Outdoorsequence, function(value, key) {
                var colOut = document.createElement('px-data-table-column');
                colOut.setAttribute('name', value.surveyTemplateFieldId);
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

        $scope.$on("ReturnIndoorCompleted1", function() {
            var indoorTable = document.getElementById("indoorTable");
            indoorTable.setAttribute("table-data", JSON.stringify($scope.indoorData));
            $scope.indoorTblCreated = true;
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
            mainTable.setAttribute("table-data", JSON.stringify($scope.mainData));

            angular.forEach($scope.Mainsequence, function(value, key) {
                var colIn = document.createElement('px-data-table-column');
                colIn.setAttribute('name', value.surveyTemplateFieldId);
                colIn.setAttribute('label', value.fieldName);
                colIn.setAttribute('sortable', true);
                Polymer.dom(mainTable).appendChild(colIn);
            });
        });

    }]);

});