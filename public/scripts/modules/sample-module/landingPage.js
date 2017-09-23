/**
 * Renders all the widgets on the tab and triggers the datasources that are used
 * by the widgets. Customize your widgets by: - Overriding or extending widget
 * API methods - Changing widget settings or options
 */
//-----------------
// Author : Vijay
// Description : Loads the blob store images and respective device, customer and site information.
//-------------------


/* jshint unused: false */
define(
    ['angular', './sample-module'],
    function(angular, controllers) {
        'use strict';
        var key1 = "";
        var config = '';
        // Controller definition
        controllers.controller('lpctrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', 'commonServices', '$scope', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, commonServices, $scope) {
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

            var config = ''; // Consits token, header info for asset services.
            // $scope.specification = '';
            // $scope.productionOrderNumber = '';
            // $scope.skuId = '';
            // $scope.skuDescription = '';
            // var twinURL = 'https://dt-blobstore-microservice-prod.run.aws-usw02-pr.ice.predix.io/getBlob?directory=10/Survey&fileName=img_201853800.jpeg&contentType=image/png';
            // var twimImage = document.querySelector('#twimImage');

            // To fetch device by serial number, all device info and to get parentSite field.
            var fetchDeviceBySerialNumber = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=serialNo=';

            var fetchSkuByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=';
            var fetchBomByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/bom?filter=uri=/bom/';
            //  var markerUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=serialNo=';
            //to get customer information based on URI
            var customerURL = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=uri=";
            var fetchSiteByName = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteName=";
            //to get all device
            var fetchDevice = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device';
            //url to get parent customer
            var fetchSiteByUri = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=uri=";
            //
            var fetchDeviceBySiteId = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=site=';
            var fetchDeviceByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=uri=';


            //variables used for html alignment
            var sideShift = 0;
            var downShiftcounter = 0;
            var downShift = 0;

            $(document).ready(function() {


                var BlobstoreUrl = []; //Blobstore URL array to capture dynamically generated blobstore url on page load
                var BlobstoreUrl1 = []; //Blobstore URL array to capture dynamically generated blobstore url after filter search

                $scope.finalData = [];
                $scope.finalData1 = [];
                var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';
                var headersConfig = {
                    headers: {
                        'content-Type': 'application/x-www-form-urlencoded',
                        'authorization': 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
                    }
                };
                $http.post(commonServices.getauthTokenURL(), data, headersConfig).success(
                    function(data) {
                        console.log(headersConfig);
                        console.log(data)
                        var accessToken = data.access_token;
                        //// console.log('Token:'+accessToken);
                        var auth = 'bearer ' + accessToken;
                        config = {
                            headers: {
                                'Authorization': auth,
                                'Content-Type': 'application/json',
                                'Predix-Zone-Id': '0da112ff-f441-4362-ac52-c5bc1752e404'
                            }
                        };

                        fetchSerialNumber();
                        var inputCustElement = document.querySelector('paper-typeahead-input-customer');
                        inputCustElement.setAttribute('cnf', auth);
                        inputCustElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                        var inputSiteElement = document.querySelector('paper-typeahead-input-site');
                        inputSiteElement.setAttribute('cnf', auth);
                        inputSiteElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                        var inputSkuElement = document.querySelector('paper-typeahead-input-sku');
                        inputSkuElement.setAttribute('cnf', auth);
                        inputSkuElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');


                        // This call returns entire device asset info, we get serial number here 
                        // which is passed to media micro service to retrieve media Object
                        // This media object is used to form blob store URL and is saved in an array
                        $http.get(fetchDevice, config).success(function(deviceFixtureInfo) {
                            console.log(deviceFixtureInfo);
                            $scope.deviceFixtureInfo = deviceFixtureInfo;
                            formImageUrl();

                            console.log("Should be called after all image url ready", BlobstoreUrl);
                            console.log($scope.serialArr1)
                            $scope.incrementor = 0;

                            //$scope.fetchAllData($scope.incrementor); //function to retrieve all the data and load page based on data
                        });


                    });

                //$scope.jIncreementor = 0;
                var blobImageInc = 0;
                $scope.serialArr1 = [];

                function formImageUrl() {
                    //Dynamic Blobstore Url Formation
                    // This URl calls media micro service.
                    //to get media object by passing serial number retrieved above 
                    if ($scope.deviceFixtureInfo[blobImageInc]) {
                        $scope.serialArr1.push($scope.deviceFixtureInfo[blobImageInc].serialNo);
                        $http.get("https://dt-admin-microservice-stage.run.aws-usw02-pr.ice.predix.io/admin/getMedia?directory=digitaltwinimage/" + $scope.deviceFixtureInfo[blobImageInc].serialNo).success(function(blobMediaInfo) {
                            console.log('blobMediaInfo', blobMediaInfo);
                            if (blobMediaInfo.length > 0) {
                                console.log(blobMediaInfo)
                                for (var j = 0; j < blobMediaInfo.length; j++) {
                                    $scope.contentType = blobMediaInfo[j].contentType;
                                    $scope.directory = blobMediaInfo[j].directory;
                                    $scope.fileName = blobMediaInfo[j].fileName;
                                    BlobstoreUrl[j] = "https://dt-blobstore-microservice-stage.run.aws-usw02-pr.ice.predix.io/getBlob?directory=" + $scope.directory + "&fileName=" + $scope.fileName + "&contentType=" + $scope.contentType + "";
                                    console.log('BlobstoreUrl', BlobstoreUrl)
                                    if (blobImageInc < $scope.deviceFixtureInfo.length) {
                                        blobImageInc++;
                                        formImageUrl();
                                    }
                                    //$scope.counter++; // Commented as no where used.
                                }
                            } else if (blobMediaInfo) {
                                BlobstoreUrl[j] = "";
                                console.log("j=", j);
                                if (blobImageInc < $scope.deviceFixtureInfo.length) {
                                    blobImageInc++;
                                    if (blobImageInc < 8) {
                                        formImageUrl();
                                    }
                                }
                            }
                        });
                    }

                }

                //function to load the filtered page with asset information.
                // Invoked on click of search button.
                $scope.jIncreementor = 0;
                $scope.getSiteId = function() {
                    var ps = document.querySelector('paper-spinner');
                    ps.setAttribute('active', '');
                    if ($scope.jIncreementor == 0) {
                        $scope.serialArr2 = [];
                        $scope.finalData1 = [];
                        $("#first").empty();
                        $("#second").empty();
                        $("#third").empty();

                    }




                    var tempAllData = {};
                    var tempAllData1 = {};
                    //   var siteName = "WAL-MART STORE 111111-11";

                    // Get entered data in the site name field.
                    $scope.siteInput = document.querySelector('paper-typeahead-input-site').inputValue;
                    //to fetch the unique site id record based on site name
                    $http.get(fetchSiteByName + $scope.siteInput, config).success(function(siteResponseByName) {
                        if (siteResponseByName[0] != undefined) {
                            var siteId = siteResponseByName[0].uri; // saving the URI of site which is unique
                            console.log(siteId)
                                //to fetch all the device that has this site id and to get serial No from device response
                            $http.get(fetchDeviceBySiteId + siteResponseByName[0].uri, config).success(function(deviceBySiteId) {



                                if (deviceBySiteId[$scope.jIncreementor] != undefined) {


                                    // for (var i = 0; i < deviceBySiteId.length; i++) {

                                    var x = deviceBySiteId[$scope.jIncreementor].uri.substring(8); //to retrieve the actual Id from URI eg(URI=/device/1150219, after transformation x=1150219)
                                    $scope.serialArr2.push(x); // saving the serial numbers in array
                                    console.log($scope.serialArr2[$scope.jIncreementor])
                                        //call to get media object by passing serial number
                                    $http.get("https://dt-admin-microservice.run.aws-usw02-pr.ice.predix.io/admin/getMedia?directory=digitaltwinimage/" + x).success(function(blobMediaInfo) {

                                        if (blobMediaInfo[$scope.jIncreementor] != undefined) {

                                            console.log(blobMediaInfo)

                                            $scope.contentType = blobMediaInfo[$scope.jIncreementor].contentType;
                                            $scope.directory = blobMediaInfo[$scope.jIncreementor].directory;
                                            $scope.fileName = blobMediaInfo[$scope.jIncreementor].fileName;
                                            //passing necessary fields retrieved from above call and forming a blobstore url and saved in array 
                                            BlobstoreUrl1[$scope.jIncreementor] = "https://dt-blobstore-microservice-prod.run.aws-usw02-pr.ice.predix.io/getBlob?directory=" + $scope.directory + "&fileName=" + $scope.fileName + "&contentType=" + $scope.contentType + "";
                                            console.log(BlobstoreUrl1[$scope.jIncreementor])


                                        } else if (blobMediaInfo[$scope.jIncreementor] == undefined) {
                                            BlobstoreUrl1[$scope.jIncreementor] = "ssss";

                                        }

                                        //call to get a single unique record from asset device endpoint by passing the serial numbers[Important field to pick up-- site]
                                        $http.get(fetchDeviceByUri + deviceBySiteId[$scope.jIncreementor].uri, config).success(function(deviceBySerialNo) {


                                            //call to get single unique record from asset site endpoint by passing site retrieved from device data[Important field to pick up-- parent]    
                                            $http.get(fetchSiteByUri + deviceBySerialNo[0].site, config).success(function(siteResponse) {

                                                //call to get single unique record from asset customer endpoint by passing parent retrieved from site data        
                                                $http.get(customerURL + siteResponse[0].parent, config).success(function(customerResponse) {
                                                    if (customerResponse.length > 0) {
                                                        $scope.jIncreementor++;
                                                        console.log("customerResponse---", customerResponse);
                                                        tempAllData = {};
                                                        //merging all the data retrieved from various endpoints in an array
                                                        tempAllData = {
                                                            serialNo: x,
                                                            customerName: customerResponse[0].customerName1,
                                                            siteID: siteResponse[0].siteId,
                                                            siteName: siteResponse[0].siteName

                                                        };
                                                        if ($scope.jIncreementor <= 8) {
                                                            $scope.finalData1.push(tempAllData);
                                                        }
                                                        tempAllData = {};
                                                        console.log("filtered final data", $scope.finalData1)
                                                            //call for recursive function until total no device condition is not satisfied
                                                        if ($scope.jIncreementor < deviceBySiteId.length) {
                                                            $scope.getSiteId();
                                                        }
                                                        //to load page only after merged data in an array is formed
                                                        if ($scope.jIncreementor == deviceBySiteId.length) {
                                                            var ps = document.querySelector('paper-spinner');
                                                            ps.removeAttribute('active');
                                                            $scope.jIncreementor = 0;
                                                            $scope.loadFilterPage();

                                                        }

                                                    }

                                                });
                                            });
                                        });
                                    });

                                    // }
                                }

                                //to show a error message if device  not present
                                else if (deviceBySiteId[$scope.jIncreementor] == undefined) {

                                    var removeSite = document.querySelector('#error');
                                    removeSite.toggle();
                                    var ps = document.querySelector('paper-spinner');
                                    ps.removeAttribute('active');
                                }


                            });
                        } else if (siteResponseByName[0] == undefined) {

                            var removeSite = document.querySelector('#error');
                            removeSite.toggle();
                            var ps = document.querySelector('paper-spinner');
                            ps.removeAttribute('active');
                        }
                    });
                }


                //function to load page with asset data on pageload
                //$scope.jInc = 0;
                // Not used anymore
                $scope.fetchAllData12 = function(i) {
                    console.log('callinng fetch all data');
                    var tempAllData = {};
                    var tempAllData1 = {};
                    // To get unique device data from asset device on basis of serial number.
                    // Used field is site, this site is passed to site URl(Site end point).
                    $http.get(fetchDeviceBySerialNumber + $scope.serialArr1[i], config).success(function(deviceBySerialNo) {
                        $scope.jInc++;
                        // To get site info by passing site
                        // Useful field here is parent.
                        if (deviceBySerialNo.length > 0) {
                            $http.get(fetchSiteByUri + deviceBySerialNo[0].site, config).success(function(siteResponse) {
                                if (siteResponse[0].parent) {
                                    var parentCheck = false;
                                }
                                if (siteResponse[0].parent) {
                                    // Get customer info passing parent(customer id which is unique)
                                    $http.get(customerURL + siteResponse[0].parent, config).success(function(customerResponse) {
                                        if (customerResponse.length > 0) {
                                            console.log("customerResponse---", customerResponse);
                                            tempAllData = {};
                                            $scope.incrementor++;
                                            //merging all the data retrieved from various endpoints in an array
                                            tempAllData = {
                                                serialNo: $scope.serialArr1[i],
                                                customerName: customerResponse[0].customerName1,
                                                siteID: siteResponse[0].siteId,
                                                siteName: siteResponse[0].siteName

                                            };
                                            $scope.finalData.push(tempAllData)
                                                //call for recursive function until total no device condition is not satisfied
                                            if (i < 7) {
                                                console.log("i--", i);
                                                //$scope.fetchAllData($scope.incrementor);
                                            }
                                            console.log("Final Data", $scope.finalData);
                                            //to load page only after merged data in an array is formed
                                            /* if (i == 7) {
                                              var ps = document.querySelector('paper-spinner');
                                              ps.removeAttribute('active');
                                              $scope.loadPage();
                                            } */
                                        } else {
                                            if ($scope.incrementor == 8) {
                                                var ps = document.querySelector('paper-spinner');
                                                ps.removeAttribute('active');
                                                // var removeSite = document.querySelector('#pageLoadError');
                                                // removeSite.toggle();
                                                var par4 = document.createElement("p");
                                                var node4 = document.createTextNode("No device for this site");


                                                par4.appendChild(node4);
                                                document.getElementById("content").appendChild(par4);

                                            } else {
                                                $scope.incrementor++;
                                                //$scope.fetchAllData($scope.incrementor)
                                            }
                                        }

                                    }).error(function(error) {
                                        console.error('Error fetching customerResponse data', error);
                                    });
                                } else {
                                    $scope.incrementor++;
                                    //$scope.fetchAllData($scope.incrementor);
                                }
                            });
                        } else {
                            console.log('$scope.incrementor', $scope.incrementor);
                            $scope.incrementor++;
                            if ($scope.incrementor < 8) {
                                //$scope.fetchAllData($scope.incrementor);
                                return;
                            }
                            if ($scope.incrementor > 7) {
                                var ps = document.querySelector('paper-spinner');
                                ps.removeAttribute('active');
                                $scope.loadPage();
                            }

                        }
                    });

                }

                var counterData = 0;
                $scope.finalData3 = [];

                function fetchSerialNumber() {
                    // First call would be to get all serial number
                    $http.get(fetchDevice, config).success(function(deviceFixtureInfo) {
                        $scope.fixtureInfo = deviceFixtureInfo;
                        fetchDevicesBySerialNumber(deviceFixtureInfo[counterData].serialNo);
                    });
                }

                function fetchDevicesBySerialNumber(a_serialNumber) {
                    if (counterData < 8) { //should be $scope.fixtureInfo.length in real scenario
                        if (a_serialNumber) {
                            $http.get(fetchDeviceBySerialNumber + a_serialNumber, config).success(function(deviceBySerialNo) {
                                // check if site existes.
                                if (deviceBySerialNo[0].hasOwnProperty('site')) {
                                    getSites(deviceBySerialNo[0].site, a_serialNumber);
                                } else {
                                    counterData++;
                                    fetchDevicesBySerialNumber($scope.fixtureInfo[counterData].serialNo);
                                }
                            });
                        } else {
                            // call the fetchDeviceBySerialNumber
                            counterData++;
                            fetchDevicesBySerialNumber($scope.fixtureInfo[counterData].serialNo);
                        }
                    } else {}
                }

                function getSites(a_site, a_serialNumber) {
                    $http.get(fetchSiteByUri + a_site, config).success(function(siteResponse) {
                        console.log(siteResponse);
                        if (siteResponse[0].parent == undefined) {
                            siteResponse[0].parent = siteResponse[0].customer;
                            console.log("siteResponse", siteResponse[0].parent)
                        }

                        if (siteResponse.length > 0 && siteResponse[0].hasOwnProperty('parent')) {
                            getCustomerResponse(siteResponse[0].parent, a_serialNumber, siteResponse[0].siteId, siteResponse[0].siteName);
                            counterData++;
                        } else {
                            // call the fetchDeviceBySerialNumber
                            counterData++;
                            fetchDevicesBySerialNumber($scope.fixtureInfo[counterData].serialNo);
                        }
                    });

                }

                function getCustomerResponse(a_parent, a_serialNumber, a_siteId, a_siteName) {
                    $http.get(customerURL + a_parent, config).success(function(customerResponse) {
                        console.log(customerResponse)
                        if (customerResponse.length > 0) {
                            var tempAllData = {
                                serialNo: a_serialNumber,
                                customerName: customerResponse[0].customerName1,
                                siteID: a_siteId,
                                siteName: a_siteName
                            };
                            $scope.finalData3.push(tempAllData);
                            tempAllData = {};
                            counterData++;
                            if (counterData < 8) {
                                fetchDevicesBySerialNumber($scope.fixtureInfo[counterData].serialNo);
                                console.log(counterData)
                            } else {
                                //break;
                                loadPage();
                            }

                        } else {
                            counterData++;
                            fetchDevicesBySerialNumber($scope.fixtureInfo[counterData].serialNo);
                        }
                        console.log('$scope.finalData3', $scope.finalData3);
                    });

                }

                function loadPage() {
                    if ($scope.finalData3.length == 0) {
                        var ps = document.querySelector('paper-spinner');
                        ps.removeAttribute('active');
                        // var removeSite = document.querySelector('#pageLoadError');
                        // removeSite.toggle();
                        var par4 = document.createElement("p");
                        var node4 = document.createTextNode("No device for this site");


                        par4.appendChild(node4);
                        document.getElementById("content").appendChild(par4);

                    }
                    if ($scope.finalData3.length > 0) {
                        var ps = document.querySelector('paper-spinner');
                        ps.removeAttribute('active');
                        $scope.loadPage($scope.finalData3);
                    }
                }


                //defines dynamic creation of html elements and positioning based no. of devices on page Load
                $scope.loadPage = function(a_finalData) {
                    $scope.finalData = a_finalData;
                    console.log('$scope.finalData', $scope.finalData);
                    var serialNumber;
                    for (var i = 0; i < $scope.finalData.length; i++) {
                        var par4 = document.createElement("p");
                        par4.setAttribute("id", "par4" + i);
                        var node4 = document.createTextNode("Site ID" + ":" + $scope.finalData[i].siteID);
                        par4.appendChild(node4);
                        var par5 = document.createElement("p");
                        par5.setAttribute("id", "par5" + i);
                        var node5 = document.createTextNode("Site Name" + ":" + $scope.finalData[i].siteName);
                        par5.appendChild(node5);
                        var par2 = document.createElement("p");
                        par2.setAttribute("id", "par2" + i);
                        var node2 = document.createTextNode("Customer Name" + ":" + $scope.finalData[i].customerName);
                        //$scope.finalData // Why this is here
                        par2.appendChild(node2);
                        var par1 = document.createElement("p");
                        par1.setAttribute("id", "par1" + i);
                        var node1 = document.createTextNode("Fixture Serial No.");
                        var nodePar1 = document.createTextNode($scope.finalData[i].serialNo);
                        par1.appendChild(node1);
                        par1.appendChild(nodePar1);
                        var tab = document.createElement('px-card');
                        tab.setAttribute("id", "tabHolder" + i);
                        var px = document.createElement('px-card');
                        px.setAttribute("id", "imageholder" + i)
                        document.getElementById("first").appendChild(px);
                        document.getElementById("imageholder" + i).style.borderStyle = "solid";
                        document.getElementById("imageholder" + i).style.borderColor = "#d6d6d6";
                        document.getElementById("imageholder" + i).style.borderWidths = "1px;"
                        document.getElementById("imageholder" + i).style.position = "absolute";
                        document.getElementById("imageholder" + i).style.marginLeft = sideShift + 'px';

                        //for table
                        document.getElementById("first").appendChild(tab);
                        document.getElementById("tabHolder" + i).appendChild(par1);
                        document.getElementById("tabHolder" + i).appendChild(par2);

                        document.getElementById("tabHolder" + i).appendChild(par4);
                        document.getElementById("tabHolder" + i).appendChild(par5);
                        document.getElementById("par1" + i).style.position = "absolute";
                        document.getElementById("par2" + i).style.position = "absolute";

                        document.getElementById("par4" + i).style.position = "absolute";
                        document.getElementById("par5" + i).style.position = "absolute";
                        document.getElementById("par1" + i).style.marginTop = "9px";
                        document.getElementById("par2" + i).style.marginTop = "40px";;
                        document.getElementById("par4" + i).style.marginTop = "70px";
                        document.getElementById("par5" + i).style.marginTop = "90px";




                        document.getElementById("par1" + i).style.fontSize = "13px";

                        document.getElementById("par2" + i).style.fontSize = "13px";

                        document.getElementById("par4" + i).style.fontSize = "13px";

                        document.getElementById("par5" + i).style.fontSize = "13px";

                        document.getElementById("tabHolder" + i).style.borderStyle = "solid";
                        document.getElementById("tabHolder" + i).style.borderColor = "#d6d6d6";
                        document.getElementById("tabHolder" + i).style.borderLeftColor = "#30c8e9";
                        document.getElementById("tabHolder" + i).style.borderLeftWidth = "9px";
                        document.getElementById("tabHolder" + i).style.borderWidths = "1px;"
                        document.getElementById("tabHolder" + i).style.position = "absolute";
                        document.getElementById("tabHolder" + i).style.marginTop = "163px";
                        document.getElementById("tabHolder" + i).style.width = "238px";
                        document.getElementById("tabHolder" + i).style.height = "144px";
                        document.getElementById("tabHolder" + i).style.marginLeft = sideShift + 'px';
                        sideShift = sideShift + 320;
                        var sideShift2 = 0;
                        if (downShiftcounter >= 3) {
                            if (i == 4) {
                                sideShift2 = sideShift2 + 320;
                            }
                            if (i == 5) {
                                sideShift2 = sideShift2 + 640;
                            }
                            if (i == 6) {
                                sideShift2 = sideShift2 + 960;

                            }

                            document.getElementById("imageholder" + i).style.position = "absolute";
                            document.getElementById("imageholder" + i).style.marginLeft = sideShift2 + 'px';
                            document.getElementById("imageholder" + i).style.marginTop = "360px";
                            document.getElementById("second").appendChild(px);
                            document.getElementById("tabHolder" + i).style.borderStyle = "solid";
                            document.getElementById("tabHolder" + i).style.borderColor = "#d6d6d6";

                            document.getElementById("tabHolder" + i).style.borderLeftColor = "#30c8e9";
                            document.getElementById("tabHolder" + i).style.borderLeftWidth = "9px";

                            document.getElementById("tabHolder" + i).style.borderWidths = "1px;"
                            document.getElementById("tabHolder" + i).style.position = "absolute";
                            document.getElementById("tabHolder" + i).style.marginTop = "523px";
                            document.getElementById("tabHolder" + i).style.width = "238px";
                            document.getElementById("tabHolder" + i).style.height = "144px";
                            document.getElementById("tabHolder" + i).style.marginLeft = sideShift2 + 'px';
                            document.getElementById("second").appendChild(tab);
                        }
                        sideShift2 = 0;
                        if (downShiftcounter >= 6) {
                            if (i == 7) {
                                sideShift2 = sideShift2 + 320;
                            }
                            if (i == 8) {
                                sideShift2 = sideShift2 + 640;
                            }
                            if (i == 9) {
                                sideShift2 = sideShift2 + 960;
                            }
                            document.getElementById("imageholder" + i).style.position = "absolute";
                            document.getElementById("imageholder" + i).style.marginLeft = sideShift2 + 'px';
                            document.getElementById("imageholder" + i).style.marginTop = "720px";
                            document.getElementById("third").appendChild(px);
                            document.getElementById("tabHolder" + i).style.borderStyle = "solid";
                            document.getElementById("tabHolder" + i).style.borderColor = "#d6d6d6";
                            document.getElementById("tabHolder" + i).style.borderLeftColor = "#30c8e9";
                            document.getElementById("tabHolder" + i).style.borderLeftWidth = "9px";
                            document.getElementById("tabHolder" + i).style.borderWidths = "1px;"
                            document.getElementById("tabHolder" + i).style.position = "absolute";
                            document.getElementById("tabHolder" + i).style.marginTop = "917px";
                            document.getElementById("tabHolder" + i).style.width = "238px";
                            document.getElementById("tabHolder" + i).style.height = "144px";
                            document.getElementById("tabHolder" + i).style.marginLeft = sideShift2 + 'px';
                            document.getElementById("second").appendChild(tab);

                        }
                        var altSrc = "../../../images/bt_close.png";
                        var y = document.createElement("IMG");
                        var BlobstoreUrl_1 = 'BlobstoreUrl' + i;
                        console.log(BlobstoreUrl_1)
                        y.setAttribute("src", BlobstoreUrl[i]);
                        y.setAttribute("id", "img" + i);
                        y.setAttribute("width", "304");
                        y.setAttribute("height", "215");
                        y.setAttribute("serialNumber", $scope.finalData[i].serialNo);
                        y.setAttribute("alt", "Image Not Available");
                        y.style.height = "215px";
                        y.style.width = "304px";

                        document.getElementById("imageholder" + i).appendChild(y);
                        document.getElementById("img" + i).style.width = "188px";
                        document.getElementById("img" + i).style.height = "120px";
                        downShiftcounter++;
                    }
                }
                $scope.clear = function() {

                    document.querySelector('paper-typeahead-input-site').inputValue = "";

                }





                //defines dynamic creation of html elements and positioning based no. of devices after filter
                $scope.loadFilterPage = function() {
                    var sideShift1 = 0;
                    var downShiftcounter1 = 0;
                    var downShift1 = 0;



                    for (var i = 0; i < $scope.finalData1.length; i++) {
                        var par4 = document.createElement("p");

                        par4.setAttribute("id", "par4" + i);

                        var node4 = document.createTextNode("Site ID" + ":" + $scope.finalData1[i].siteID);


                        par4.appendChild(node4);


                        var par5 = document.createElement("p");

                        par5.setAttribute("id", "par5" + i);
                        var node5 = document.createTextNode("Site Name" + ":" + $scope.finalData1[i].siteName);

                        par5.appendChild(node5);




                        var par2 = document.createElement("p");

                        par2.setAttribute("id", "par2" + i);

                        var node2 = document.createTextNode("Customer Name" + ":" + $scope.finalData1[i].customerName);

                        $scope.finalData1
                        par2.appendChild(node2);


                        var par1 = document.createElement("p");

                        par1.setAttribute("id", "par1" + i);
                        var node1 = document.createTextNode("Fixture Serial No.");
                        var nodePar1 = document.createTextNode($scope.finalData1[i].serialNo);
                        par1.appendChild(node1);
                        par1.appendChild(nodePar1);




                        var tab = document.createElement('px-card');

                        tab.setAttribute("id", "tabHolder" + i);




                        var px = document.createElement('px-card');

                        px.setAttribute("id", "imageholder" + i)


                        document.getElementById("first").appendChild(px);



                        document.getElementById("imageholder" + i).style.borderStyle = "solid";
                        document.getElementById("imageholder" + i).style.borderColor = "#d6d6d6";
                        document.getElementById("imageholder" + i).style.borderWidths = "1px;"
                        document.getElementById("imageholder" + i).style.position = "absolute";
                        document.getElementById("imageholder" + i).style.marginLeft = sideShift1 + 'px';

                        //for table



                        document.getElementById("first").appendChild(tab);
                        document.getElementById("tabHolder" + i).appendChild(par1);
                        document.getElementById("tabHolder" + i).appendChild(par2);

                        document.getElementById("tabHolder" + i).appendChild(par4);
                        document.getElementById("tabHolder" + i).appendChild(par5);
                        document.getElementById("par1" + i).style.position = "absolute";
                        document.getElementById("par2" + i).style.position = "absolute";

                        document.getElementById("par4" + i).style.position = "absolute";
                        document.getElementById("par5" + i).style.position = "absolute";
                        document.getElementById("par1" + i).style.marginTop = "9px";
                        document.getElementById("par2" + i).style.marginTop = "40px";;
                        document.getElementById("par4" + i).style.marginTop = "70px";
                        document.getElementById("par5" + i).style.marginTop = "90px";




                        document.getElementById("par1" + i).style.fontSize = "13px";

                        document.getElementById("par2" + i).style.fontSize = "13px";

                        document.getElementById("par4" + i).style.fontSize = "13px";

                        document.getElementById("par5" + i).style.fontSize = "13px";

                        document.getElementById("tabHolder" + i).style.borderStyle = "solid";
                        document.getElementById("tabHolder" + i).style.borderColor = "#d6d6d6";
                        document.getElementById("tabHolder" + i).style.borderLeftColor = "#30c8e9";
                        document.getElementById("tabHolder" + i).style.borderLeftWidth = "9px";
                        document.getElementById("tabHolder" + i).style.borderWidths = "1px;"
                        document.getElementById("tabHolder" + i).style.position = "absolute";
                        document.getElementById("tabHolder" + i).style.marginTop = "163px";
                        document.getElementById("tabHolder" + i).style.width = "238px";
                        document.getElementById("tabHolder" + i).style.height = "144px";
                        document.getElementById("tabHolder" + i).style.marginLeft = sideShift1 + 'px';




                        sideShift1 = sideShift1 + 320;
                        var sideShift21 = 0;
                        if (downShiftcounter1 >= 3) {
                            if (i == 4) {
                                sideShift21 = sideShift21 + 320;
                            }
                            if (i == 5) {
                                sideShift21 = sideShift21 + 640;
                            }
                            if (i == 6) {
                                sideShift21 = sideShift21 + 960;

                            }


                            document.getElementById("imageholder" + i).style.position = "absolute";
                            document.getElementById("imageholder" + i).style.marginLeft = sideShift21 + 'px';
                            document.getElementById("imageholder" + i).style.marginTop = "360px";
                            document.getElementById("second").appendChild(px);



                            document.getElementById("tabHolder" + i).style.borderStyle = "solid";
                            document.getElementById("tabHolder" + i).style.borderColor = "#d6d6d6";

                            document.getElementById("tabHolder" + i).style.borderLeftColor = "#30c8e9";
                            document.getElementById("tabHolder" + i).style.borderLeftWidth = "9px";

                            document.getElementById("tabHolder" + i).style.borderWidths = "1px;"
                            document.getElementById("tabHolder" + i).style.position = "absolute";
                            document.getElementById("tabHolder" + i).style.marginTop = "523px";
                            document.getElementById("tabHolder" + i).style.width = "238px";
                            document.getElementById("tabHolder" + i).style.height = "144px";
                            document.getElementById("tabHolder" + i).style.marginLeft = sideShift21 + 'px';

                            document.getElementById("second").appendChild(tab);


                        }



                        sideShift21 = 0;
                        if (downShiftcounter1 >= 6) {
                            if (i == 7) {
                                sideShift21 = sideShift21 + 320;
                            }
                            if (i == 8) {
                                sideShift21 = sideShift21 + 640;
                            }
                            if (i == 9) {
                                sideShift21 = sideShift21 + 960;


                            }


                            document.getElementById("imageholder" + i).style.position = "absolute";
                            document.getElementById("imageholder" + i).style.marginLeft = sideShift21 + 'px';
                            document.getElementById("imageholder" + i).style.marginTop = "720px";
                            document.getElementById("third").appendChild(px);




                            document.getElementById("tabHolder" + i).style.borderStyle = "solid";
                            document.getElementById("tabHolder" + i).style.borderColor = "#d6d6d6";
                            document.getElementById("tabHolder" + i).style.borderLeftColor = "#30c8e9";
                            document.getElementById("tabHolder" + i).style.borderLeftWidth = "9px";
                            document.getElementById("tabHolder" + i).style.borderWidths = "1px;"
                            document.getElementById("tabHolder" + i).style.position = "absolute";
                            document.getElementById("tabHolder" + i).style.marginTop = "917px";
                            document.getElementById("tabHolder" + i).style.width = "238px";
                            document.getElementById("tabHolder" + i).style.height = "144px";
                            document.getElementById("tabHolder" + i).style.marginLeft = sideShift21 + 'px';

                            document.getElementById("second").appendChild(tab);



                        }



                        var altSrc = "../../../images/bt_close.png";
                        var y = document.createElement("IMG");


                        y.setAttribute("src", BlobstoreUrl1[i]);
                        y.setAttribute("id", "img" + i);
                        y.setAttribute("width", "304");
                        y.setAttribute("height", "215");
                        y.setAttribute("serialNumber", $scope.serialArr2[i]);
                        y.setAttribute("alt", "No Image Available");
                        y.style.height = "215px";
                        y.style.width = "304px";




                        document.getElementById("imageholder" + i).appendChild(y);
                        document.getElementById("img" + i).style.width = "188px";
                        document.getElementById("img" + i).style.height = "120px";
                        downShiftcounter1++;




                    }




                }


                //Code for checking what input is selected by user on paper type ahead and validate accordingly
                window.addEventListener('pt-item-confirmed', function(e) {
                    var ps = document.querySelector('paper-spinner'); //paper spinner                                                                                                      //to show the paper spinner
                    var srcElement2 = e.srcElement;
                    var dta = srcElement2.__data__;
                    console.log(e);
                    var keyCust; //to get custid or site id
                    $scope.typeaheadType = srcElement2.localName;
                    if (srcElement2.localName == "paper-typeahead-input-customer") {

                        var removeSite = document.querySelector('#customerError');
                        removeSite.toggle();
                        document.querySelector('paper-typeahead-input-customer').inputValue = "";
                        var ps = document.querySelector('paper-spinner');
                        ps.removeAttribute('active');

                    }
                });


                var i = 0;
                console.log(document.getElementsByTagName("img")[1]);
                //to get the source of the image on click and pass it to next page with serial number
                document.getElementsByTagName("px-card")[1].addEventListener('click', function(e) {


                    for (var i = 0; i < 8; i++) {
                        if (e.target.id == "img" + i || e.target.id == "imageholder" + i || e.target.id == "tabHolder" + i) {

                            e.target.src = document.getElementById("img" + i).src;
                            $rootScope.serialNumber = e.srcElement.getAttribute('serialNumber');


                            $rootScope.devImage = e.target.src;

                        }
                    }
                }, false);

            });



        }]);
    });