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
    controllers.controller('adminMainCtrl', ['$state', '$timeout', '$rootScope', '$scope', '$log', 'PredixAssetService', '$http', '$location', '$stateParams', 'commonServices', 'proposalServices', 'adminServices', function($state, $timeout, $rootScope, $scope, $log, PredixAssetService, $http, $location, $stateParams, commonServices, proposalServices, adminServices) {
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
            //alert();
            commonServices.getAuthToken().then(function(data) {
                // var inputCustElement = document.querySelector('paper-typeahead-input-customer');
                // inputCustElement.setAttribute('cnf',data.headers.Authorization);
                // inputCustElement.setAttribute('znId','0da112ff-f441-4362-ac52-c5bc1752e404');
                var inputSiteElement = document.querySelector('paper-typeahead-input-site');
                inputSiteElement.setAttribute('cnf', data.headers.Authorization);
                inputSiteElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                // var inputStationElement = document.querySelector('paper-typeahead-input-station');
                // inputStationElement.setAttribute('cnf', data.headers.Authorization);
                // inputStationElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
            });
        }

        $scope.fileArrayToUpload = [];
        $scope.fileArrayTemp = [];

        var ps = document.querySelector('paper-spinner');
        commonServices.getAuthToken().then(function(config) {
            $scope.config = config;
            console.log($scope.config)

            // $http.delete(adminServices.getAssetURL() + '/station/01WalmartFinalTest-3', $scope.config).success(function(data) {
            // console.log(data)
            // })
        });

        commonServices.getAuthToken().then(function(config) {
            $http.get(adminServices.getAssetURL() + '/station', config).success(function(data) {
                console.log('stat : ', data)
            })
        })

        function getAllStation() {
            return $http.get(adminServices.getAssetURL() + '/station/' + $scope.KeyStation, $scope.config);
        }

        function removeAllOptions() {
            $('#floorList')
                .find('option')
                .remove()
        }

        function removeAllSectionOptions() {
            $('#sectionList')
                .find('option')
                .remove()
        }

        // $scope.floor = [{
        // floorNo: 6
        // }];
        $scope.selectedFloor = null;

        function showFloors(data) {
            $scope.selectedFloor = null;
            $scope.floor = data.floor;
            console.log('floor data for repeat--', $scope.floor);
        }

        function showSection(data) {
            console.log(data)
            $scope.section = data.section;
        }

        $scope.closeStation = function() {
            $scope.errorMsg = "";
        }
        $scope.closeFloor = function() {

            var floorName = document.querySelector('#floorName');
            floorName.value = "";
            $scope.errorFloorMsg = "";
        }
        $scope.closeSection = function() {
            document.querySelector('#sectionName').value = "";
            $scope.errorSecMsg = "";
        }
        window.addEventListener('pt-item-confirmed', function(e) {
            var srcElement2 = e.srcElement;
            var dta = srcElement2.__data__;
            console.log(e);
            var keyCust; //to get custid or site id
            $scope.typeaheadType = srcElement2.localName;
            if (srcElement2.localName == "paper-typeahead-input-customer") {
                $scope.custInput = document.querySelector('paper-typeahead-input-customer').inputValue;
                $scope.custSelected = true;
                keyCust = dta.keyid; //custid
                console.log(keyCust);
                //alert(adminServices.getAssetURL());
                $scope.KeyCustomer = dta.keyid;
                var paperSite = document.querySelector('paper-typeahead-input-site');
                var remoteUrl = adminServices.getAssetURL() + '/site?filter=parent=/customer/' + keyCust + ':siteName=%QUERY*&fields=siteId,siteName';
                paperSite.setAttribute('remote-url', remoteUrl);

                commonServices.getAuthToken().then(function(config) {
                    $http.get(adminServices.getAssetURL() + '/station', config).success(function(data) {
                        console.log('stat : ', data)
                    })

                })

            } else if (srcElement2.localName == "paper-typeahead-input-site") {
                var stationList
                var siteforStation = dta.keyid;
                console.log('siteforStation : ', siteforStation);
                $scope.KeySite = dta.keyid;
                commonServices.getAuthToken().then(function(config) {
                    commonServices.getSiteData(dta.keyid, config).then(function(data) {
                        console.log(data);
                        $scope.latForStatn = data[0].siteLocation.lat;
                        $scope.lngForStatn = data[0].siteLocation.lng;
                        commonServices.getAuthToken().then(function(config) {
                            $(".stationTd").show();
                            $scope.addNewStation = function() {
                                    var stanName = document.querySelector('#statnName');
                                    $scope.stanName = stanName.value;
                                    var addButton = document.querySelector('.addStanButton');
                                    $scope.addButton = addButton
                                    if ($scope.stanName == "") {
                                        $scope.errorMsg = "Please Enter Station Name"

                                        addButton.removeAttribute('dialog-dismiss');
                                    } else {
                                        addButton.setAttribute('dialog-dismiss', '');
                                        $scope.errorMsg = ""
                                        $scope.$broadcast("addStationName");
                                    }
                                }
                                // $http.get(adminServices.getAssetURL()+'/station?filter=parent=/site/'+dta.keyid,config).success(function (data) 
                            $scope.$on("addStationName", function() {
                                adminServices.filterStationViaSite(dta.keyid, config).then(function(data) {
                                    console.log(data)
                                    var stanFlag = true;
                                    $scope.stanLength = data.length;
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].stationName.toUpperCase() == $scope.stanName.toUpperCase()) {
                                            $scope.addButton.removeAttribute('dialog-dismiss');
                                            stanFlag = false;
                                            $scope.errorMsg = "The Station Name exists.Please enter a new Station Name"
                                        }
                                    }
                                    if (stanFlag == true) {
                                        $scope.$broadcast("addStation");
                                    }

                                });
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
                            $scope.$on("addStation", function() {

                                var parent = '/site/' + dta.keyid;
                                $scope.stationUri = "/station/" + dta.keyid + "-" + $scope.stanLength
                                var stationId = dta.keyid + "-" + $scope.stanLength
                                var stationlist = [{
                                    "parent": parent,
                                    "stationName": $scope.stanName,
                                    "stationId": stationId,
                                    "stationType": "Building",
                                    "uri": $scope.stationUri,
                                    "stationLocation": {
                                        "lat": $scope.latForStatn,
                                        "lng": $scope.lngForStatn
                                    },
                                    "floor": []
                                }]
                                console.log('stationlist ', stationlist)
                                adminServices.addStation(stationlist, config).then(function(data) {
                                    console.log("Station Added");
                                    $http.get(adminServices.getAssetURL() + '/station?filter=parent=/site/' + $scope.KeySite, config).success(function(data) {

                                        $scope.stationForSelect = data;

                                    })
                                })
                            });
                        })
                        var paperStation = document.querySelector('paper-typeahead-input-station');
                        var remoteUrl = adminServices.getAssetURL() + '/station?filter=parent=/site/' + $scope.KeySite + ':stationName=%QUERY*&fields=stationId,stationName';
                        //paperStation.setAttribute('remote-url', remoteUrl);
                    })
                })
                commonServices.getAuthToken().then(function(config) {
                    $scope.stationForSelect = [];
                    $scope.stationForSelect[0] = { stationName: 'Select Station' };
                    $scope.selectedStation = $scope.stationForSelect[0];
                    console.log(adminServices.getAssetURL() + '/station?filter=parent=/site/' + dta.keyid)
                    $http.get(adminServices.getAssetURL() + '/station?filter=parent=/site/' + dta.keyid, config).success(function(data) {
                        console.log('statfiltered : ', data)
                        $scope.StatnData = data;

                        // $scope.StatnData.splice(3,1) ;
                        // adminServices.addStation($scope.StatnData, config).then(function(data) {
                        // console.log(data)
                        // })

                        data.forEach(function(obj, index) {
                            $scope.stationForSelect.push(obj);
                        });


                    })
                })
            }
            // else if (srcElement2.localName == "paper-typeahead-input-station") {
            // $scope.KeyStation = dta.keyid;
            // var allStatnPromise = getAllStation();
            // allStatnPromise.then(function(data) {
            // console.log('promise data ', data);
            // var selectedStationData = data.data
            // $scope.StatnData = selectedStationData;
            // console.log("floorNo : ", selectedStationData[0].floor)
            // var floorList = document.querySelector('#floorList');
            // removeAllOptions()
            // showFloors(selectedStationData)
            // })

            // }
        });

        $scope.getStation = function(a_stationObj) {
            $scope.KeyStation = a_stationObj.stationId
            console.log('a_stationObj------', a_stationObj);
            removeAllOptions()
            showFloors(a_stationObj)
            $scope.statnId = a_stationObj.stationId
            console.log($scope.statnId)
            $(".bldgfloorTd").show();
            $(".floorTd").show();
        }

        $scope.addNewFloor = function() {
            var addfloorButton = document.querySelector('.AddFlrBtn');

            var floorName = document.querySelector('#floorName');
            var floorNo = "";
            floorNo = floorName.value;
            var floorFlag = true;
            addfloorButton.setAttribute('dialog-dismiss', '');
            if (floorNo == "") {
                $scope.errorFloorMsg = "Please Enter Floor Name"
                addfloorButton.removeAttribute('dialog-dismiss');
            } else {
                $http.get(adminServices.getAssetURL() + '/station?filter=parent=/site/' + $scope.KeySite, $scope.config).success(function(data) {
                    $scope.StatnData = data;
                    addfloorButton.setAttribute('dialog-dismiss', '');
                    $scope.errorFloorMsg = ""
                    for (var i = 0; i < $scope.StatnData.length; i++) {
                        console.log
                        if ($scope.StatnData[i].stationId == $scope.statnId) {
                            console.log($scope.StatnData[i].stationId)
                            for (var j = 0; j < $scope.StatnData[i].floor.length; j++) {
                                //alert($scope.StatnData[i].floor[j].floorNo);
                                if ($scope.StatnData[i].floor[j].floorNo == floorNo) {
                                    $scope.errorFloorMsg = "Please enter a new floor number"
                                    floorFlag = false;
                                    addfloorButton.removeAttribute('dialog-dismiss');
                                    var floorPopUp = document.querySelector('#addFloorDialog')
                                    floorPopUp.toggle();

                                }
                            }
                            if (floorFlag == true) {

                                addfloorButton.setAttribute('dialog-dismiss', '');
                                var newFloor = [{
                                    floorNo: floorNo
                                }]
                                var floorObj = $scope.StatnData[i].floor.concat(newFloor);
                                console.log(floorObj);
                                $scope.StatnData[i].floor = floorObj;
                                console.log($scope.StatnData)
                            }
                        }
                    }

                    if (floorFlag == true) {

                        floorName.value = "";
                        commonServices.getAuthToken().then(function(config) {
                            adminServices.addStation($scope.StatnData, config).then(function(data) {
                                console.log("Floor Updated : ");
                                var allStatnPromise = getAllStation();
                                allStatnPromise.then(function(data) {
                                    console.log('promise data ', data);
                                    var selectedStationData = data.data[0]
                                    removeAllOptions();
                                    console.log(data)
                                    showFloors(selectedStationData);
                                })
                                getAllStation();
                            })
                        })
                    }
                });
            }


        }
        $scope.addNewSection = function() {
            var inputFile = document.querySelector('#file')
                //alert(inputFile)
            inputFile.onclick = function() {
                //alert("null")
                this.value = null;
            };
            var sectionValue = document.querySelector('#sectionName');
            var sectionName = sectionValue.value;
            var addsecButton = document.querySelector('.AddSecBtn');
            console.log($scope.fileArray)
            if (sectionName == "" || $scope.fileArray == "") {
                $scope.errorSecMsg = "Please Enter both File and the Section Name"
                addsecButton.removeAttribute('dialog-dismiss');
            } else if ($scope.fileArray.length > 1) {
                $scope.errorSecMsg = "Please Select only one File"
                addsecButton.removeAttribute('dialog-dismiss');
            } else {
                var sectionFlag = true;
                $scope.sectionId = sectionName;
                var ps = document.querySelector('paper-spinner');
                ps.setAttribute('active', '');
                $(".section").attr("disabled", "disabled");
                $("#btnEdit").attr("disabled", "disabled");
                $("#btnDelete").attr("disabled", "disabled");

                //updateMedia();
                var fileName = $scope.fileArray[0].name
                var contentType = $scope.fileArray[0].type
                var lastModifiedDate = $scope.fileArray[0].lastModifiedDate
                var directory = 'digitaltwinimage/' + $scope.KeySite + '_' + $scope.KeyStation + '_' + $scope.floorNumber + "_" + $scope.sectionId
                var newSection = [{
                    directory: directory,
                    fileName: fileName,
                    sectionId: sectionName,
                    contentType: contentType,
                    createdDate: lastModifiedDate
                }]
                console.log($scope.floorObjSelected)
                if ($scope.floorObjSelected.section != undefined) {
                    for (var i = 0; i < $scope.floorObjSelected.section.length; i++) {
                        if ($scope.floorObjSelected.section[i].sectionId.toUpperCase() == sectionName.toUpperCase()) {
                            $scope.errorSecMsg = "Section Name exists"
                            addsecButton.removeAttribute('dialog-dismiss');
                            sectionFlag = false;
                            ps.removeAttribute('active');
                        }
                    }
                    if (sectionFlag == true) {
                        var sectionObj = $scope.floorObjSelected.section.concat(newSection);
                        $scope.floorObjSelected.section = sectionObj;
                    }
                } else {
                    var sectionObj = newSection;
                    var key = "section";
                    var value = sectionObj;
                    $scope.floorObjSelected.section = sectionObj;
                }
                if (sectionFlag == true) {
                    uploadFile();
                    console.log($scope.floorObjSelected)
                    for (var j = 0; j < $scope.StatnData.length; j++) {
                        if ($scope.StatnData[j].floor != undefined) {
                            console.log($scope.StatnData[j])
                            var stanDataLength = $scope.StatnData[j].floor.length;
                            console.log($scope.StatnData.length)

                            for (var i = 0; i < stanDataLength; i++) {
                                if ($scope.StatnData[j].floor[i].floorNo == $scope.floorNumber) {
                                    console.log('b4 ', $scope.StatnData[j].floor[i])
                                    $scope.StatnData[j].floor[i] = $scope.floorObjSelected
                                    console.log('after ', $scope.StatnData[j].floor[i])
                                }
                            }
                        }
                    }
                    console.log($scope.floorObjSelected)
                    $scope.StatnData.concat($scope.floorObjSelected);
                    console.log($scope.StatnData)
                    adminServices.addStation($scope.StatnData, $scope.config).then(function(data) {
                        console.log("Section Updated : ");
                        var allStatnPromise = getAllStation();
                        allStatnPromise.then(function(data) {
                            console.log('promise data ', data);
                            var selectedStationData = data.data
                            removeAllSectionOptions();
                            showSection($scope.floorObjSelected);
                        })
                    })
                    $scope.fileArray = [];
                    $scope.errorSecMsg = ""
                    addsecButton.setAttribute('dialog-dismiss', '');
                    sectionValue.value = "";
                }
            }
        }

        $scope.editSection = function() {
            console.log($scope.section);
            var fileName = $scope.fileArray[0].name
            var stanDataLength = $scope.StatnData[0].floor.length;
            //alert($scope.floorNumber)
            for (var i = 0; i < stanDataLength; i++) {
                if ($scope.StatnData[0].floor[i].floorNo == $scope.floorNumber) {
                    var sectionLength = $scope.StatnData[0].floor[i].section.length;
                    //alert(sectionLength)
                    //console.log('$scope.section.sectionId-------->', $scope.section[0].sectionId)
                    for (var j = 0; j < sectionLength; j++) {
                        if ($scope.StatnData[0].floor[i].section[j].sectionId == $scope.sectionId) {
                            //alert('in')
                            $scope.StatnData[0].floor[i].section[j].fileName = fileName;
                            $scope.sectionObjSelected = $scope.StatnData[0].floor[i].section[j];
                        }
                    }
                }
            }

            adminServices.addStation($scope.StatnData, $scope.config).then(function(data) {
                console.log("Section Edited : ");
                var ps = document.querySelector('paper-spinner');
                ps.setAttribute('active', '');
                uploadFile();
                console.log($scope.sectionObjSelected)
            })
            $scope.$on("DiplayTheImage", function() {
                displayImage()
            });
            console.log($scope.StatnData)
        }

        $scope.deleteSection = function() {
            console.log($scope.sectionObjSelected)
            console.log($scope.sectionId)
                //var fileName = $scope.fileArray[0].name
            var stanDataLength = $scope.StatnData[0].floor.length;
            //alert($scope.floorNumber)
            console.log($scope.StatnData)
            for (var i = 0; i < stanDataLength; i++) {
                if ($scope.StatnData[0].floor[i].floorNo == $scope.floorNumber) {
                    var sectionLength = $scope.StatnData[0].floor[i].section.length;
                    //alert(sectionLength)
                    //console.log('$scope.section.sectionId-------->', $scope.section[0].sectionId)

                    for (var j = 0; j < sectionLength; j++) {
                        if ($scope.StatnData[0].floor[i].section[j].sectionId == $scope.sectionId) {
                            //alert('in')
                            $scope.sectionObjSelected = $scope.StatnData[0].floor[i].section[j];
                            $scope.StatnData[0].floor[i].section.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            console.log($scope.StatnData)
            adminServices.addStation($scope.StatnData, $scope.config).then(function(data) {
                console.log("Section Deleted : ");
                uploadFile();
                console.log($scope.sectionObjSelected)
            });
            for (var i = 0; i < stanDataLength; i++) {
                if ($scope.StatnData[0].floor[i].floorNo == $scope.floorNumber) {
                    $scope.floorObjSelected = $scope.StatnData[0].floor[i];
                }
            }
            showSection($scope.floorObjSelected);
            $scope.src = '';
            $('#showImage').css({}).html('<img src="' + $scope.src + '" style="height:500px">').show();
            console.log($scope.StatnData)
        }

        function displayImage() {
            var directory = $scope.sectionObjSelected.directory;
            var fileName = $scope.sectionObjSelected.fileName;
            $scope.src = commonServices.getBlobStoreURL() + '/getBlob?directory=' + directory + '&fileName=' + fileName + '&contentType=image/png'
            console.log('after res :', $scope.src)
            $(".FloorImgDiv").show();
            $('#showImage').css({}).html('<img src="' + $scope.src + '" style="height:500px">').show();
        }

        init();

        function init() {
            $scope.fileArray = [];
        }

        function uploadFile() {
            $scope.fileArrayTemp = $scope.fileArray;
            var response = '';
            var xhttp = new XMLHttpRequest();
            console.log($scope.fileArray.length);
            console.log($scope.fileArrayTemp.length);
            if ($scope.fileArrayTemp.length > 0) {
                var fd = new FormData();
                fd.append('directory', 'digitaltwinimage/' + $scope.KeySite + '_' + $scope.KeyStation + '_' + $scope.floorNumber + "_" + $scope.sectionId);
                angular.forEach($scope.fileArrayTemp, function(file) {
                    console.log(file);
                    $scope.floorPlanFileName = file.name;
                    fd.append('file', file);
                })
                console.log(fd);
                xhttp = commonServices.uploadFileToUrl(fd, commonServices.getBlobStoreURL() + "/uploadMultiBlob");
                console.log(xhttp);
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        console.log(xhttp.responseText);
                        response = 'Success';
                        var ps = document.querySelector('paper-spinner');
                        ps.removeAttribute('active');
                        $('.section').prop("disabled", false)
                        $('#btnEdit').prop("disabled", false)
                        $('#btnDelete').prop("disabled", false)
                        $scope.$broadcast("DiplayTheImage");
                        //$scope.src='https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=digitaltwinimage/'+$scope.KeySite+'_'+$scope.KeyStation+'_'+$scope.bldgNo+"_"+$scope.floorNo+'&fileName='+$scope.floorPlanFileName+'&contentType=image/png'		
                        //console.log('after res :' ,$scope.src)
                        // $('#showImage').css({
                        // }).html('<img src="'+$scope.src+'" style="height:500px">').show();
                    }
                    console.log(response);
                    //$scope.src='https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=digitaltwinimage/'+$scope.KeySite+'_'+$scope.KeyStation+'_'+$scope.bldgNo+"_"+$scope.floorNo+'&fileName='+$scope.floorPlanFileName+'&contentType=image/png'
                    //alert($scope.src);
                    //disableAll();
                }
            }
        };

        function disableAll() {
            $(".addfloorButton").attr("disabled", "disabled");
            $(".FloorImgDiv").show();
            //$("#floorNo").attr("disabled", "disabled"); 
            //$("#bldgNo").attr("disabled", "disabled");	
            $("#paperSite").attr("disabled", "disabled");
            $("#paperStation").attr("disabled", "disabled");
            $("#file").attr("disabled", "disabled");
        }

        $scope.upload = function() {
            uploadFile();
            //updateMedia();
            $scope.fileArray = [];
        }

        $scope.removeFile = function(val) {
            //var parent = $element.parentNode;
            //console.log(parent.id);
            console.log($scope.fileArray);
            console.log(val);
            $scope.fileArray.splice(val, 1);
            console.log('in remove');
            console.log($scope.fileArray);
        }

    }]);
});