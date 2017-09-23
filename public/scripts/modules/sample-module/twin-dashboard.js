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



        var key1 = "";
        var config = '';
        // Controller definition
        controllers.controller('RemovalCtrl', ['$http', '$log', 'PredixAssetService', '$rootScope', '$scope', function($http, $log, PredixAssetService, $rootScope, $scope) {
            var imageCircle = document.querySelector('#selector');
            imageCircle.style.display = 'block';

            document.getElementById("fixture").style.display = 'block';
            document.getElementById("customer").style.display = 'none';
            document.getElementById("site").style.display = 'none';
            $scope.devimage = $rootScope.devImage;

            var x = document.getElementById("imgH");
            x.setAttribute("src", $scope.devimage);
            console.log($rootScope.devImage);
            x.style.marginTop = "-43px;"
            x.setAttribute("alt", "No Image Available");
            document.getElementById("imageholder").appendChild(x);



            var y = document.getElementById("imgCircle");
            y.setAttribute("src", $scope.devimage);
            console.log($rootScope.devImage);
            y.setAttribute("alt", "No Image Available");
            document.getElementById("circle").appendChild(y);


            // console.log($rootScope.directory);


            $scope.directory = $rootScope.directory;
            $scope.fileName = $rootScope.fileName;
            //console.log($scope.directory);
            //console.log($scope.fileName);



            $('#c1').click(function() {
                var removeSite = document.querySelector('#dialog1');

                // console.log(removeSite)
                removeSite.toggle();
                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'none';
            });



            $('#one').click(function() {

                document.getElementById("fixture").style.display = 'block';
                document.getElementById("customer").style.display = 'none';
                document.getElementById("site").style.display = 'none';
            });


            $('#two').click(function() {

                document.getElementById("fixture").style.display = 'none';
                document.getElementById("customer").style.display = 'block';
                document.getElementById("site").style.display = 'none';

            });
            $('#three').click(function() {

                document.getElementById("fixture").style.display = 'none';
                document.getElementById("customer").style.display = 'none';
                document.getElementById("site").style.display = 'block';

            });



            $('#c3').click(function() {
                var removeSite = document.querySelector('#dialog2');

                // console.log(removeSite)
                removeSite.toggle();
                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'none';
            });



            $('#c5').click(function() {
                var removeSite = document.querySelector('#dialog3');

                // console.log(removeSite)
                removeSite.toggle();
                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'none';
            });



            $('#c7').click(function() {
                var removeSite = document.querySelector('#dialog4');

                // console.log(removeSite)
                removeSite.toggle();
                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'none';
            });




            $('#cross').click(function() {

                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'block';
            });




            $('#cross1').click(function() {

                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'block';
            });


            $('#cross2').click(function() {

                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'block';
            });



            $('#cross3').click(function() {

                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'block';
            });



            $('#cross4').click(function() {

                var imageCircle = document.querySelector('#selector');
                imageCircle.style.display = 'block';
            });




            var config = '';
            $scope.productionOrderNumber = '';
            $scope.salesOrderNumber = '';
            $scope.specification = '';

            $scope.skuId = '';
            $scope.skuDescription = '';
            var twinURL = 'https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/getBlob?directory=10/Survey&fileName=img_201853800.jpeg&contentType=image/png';
            var twimImage = document.querySelector('#twimImage');
            var fetchDeviceBySerialNumber = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=serialNo=';
            var fetchSkuByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=';
            var fetchBomByUri = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/bom?filter=uri=/bom/';
            var markerUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=serialNo=';
            var customerURL = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=uri=";
            var fetchSiteByUri = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=uri=";
            var fetchDevice = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device';
            var fetchProductHierarchyBySku = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/producthierarchy?filter=skuId=';

            // ********************************************************End of functions***********************************************

            $(document).ready(function() {
                var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';
                var headersConfig = {
                    headers: {
                        'content-Type': 'application/x-www-form-urlencoded',
                        'authorization': 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
                    }
                };
                $http.post(commonServices.getauthTokenURL(), data, headersConfig).success(
                    function(data) {
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
                        var inputCustElement = document.querySelector('paper-typeahead-input-customer');
                        inputCustElement.setAttribute('cnf', auth);
                        inputCustElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                        var inputSiteElement = document.querySelector('paper-typeahead-input-site');
                        inputSiteElement.setAttribute('cnf', auth);
                        inputSiteElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                        var inputSkuElement = document.querySelector('paper-typeahead-input-sku');
                        inputSkuElement.setAttribute('cnf', auth);
                        inputSkuElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
                        var value = $rootScope.serialNumber;
                        //var value = '11150219'
                        $scope.fetchManufacturingInfo(value);
                        $scope.fetchMarker(value);

                        $scope.fetchDevice(value);
                        console.log($scope.customerName)
                        console.log($scope.customerId)
                        console.log($scope.customerCity)
                        console.log($scope.customerCountry)



                        $scope.$on("sku", function() {
                            $scope.skuId = '';
                            $scope.skuDescription = '';
                            //	console.log
                            $http.get(fetchSkuByUri + $scope.specification, config).success(function(skuResponse) {
                                for (var i = 0; i < skuResponse.length; i++) {
                                    $scope.skuId = skuResponse[i].skuId;
                                    $scope.skuDescription = skuResponse[i].skuDescription;
                                }

                                $scope.$broadcast("productHierarchy");
                            });
                        });

                        // $scope.$on("bom", function() {
                        // $http.get(fetchBomByUri + $scope.skuId + '-' + $scope.productionOrderNumber, config).success(function(bomResponse) {

                        // });
                        // });

                        $scope.$on("productHierarchy", function() {
                            $http.get(fetchProductHierarchyBySku + $scope.skuId + '>specification[t3]', config).success(function(productHierarchyResponse) {
                                if (productHierarchyResponse[0] != undefined) {
                                    $scope.description = productHierarchyResponse[0].description;
                                    $scope.productHierarchyId = productHierarchyResponse[0].productHierarchyId;
                                    //$scope.description=productHierarchyResponse[0].description;

                                    console.log(productHierarchyResponse);
                                }
                            });
                        });
                    });

            });

            $scope.fetchDevice = function(value) {



                $http.get(fetchDeviceBySerialNumber + value, config).success(function(skuResponse) {

                    $scope.serialNo = skuResponse[0].serialNo;
                    $scope.description = skuResponse[0].description;
                    $scope.deviceSiteId = skuResponse[0].site;
                    $scope.fetchSite($scope.deviceSiteId);
                    console.log(skuResponse)

                });


            }

            $scope.fetchCustomer = function(value) {



                $http.get(customerURL + value, config).success(function(customerResponse) {

                    $scope.customerName = customerResponse[0].customerName1;
                    $scope.customerId = customerResponse[0].customerId;
                    $scope.customerAddress = customerResponse[0].customerAddress;
                    $scope.customerCity = $scope.customerAddress[0].city;
                    $scope.customerCountry = $scope.customerAddress[0].country;
                    console.log(customerResponse)

                });


            }




            $scope.fetchSite = function(value) {



                $http.get(fetchSiteByUri + value, config).success(function(siteResponse) {

                    console.log(siteResponse);
                    $scope.siteId = siteResponse[0].siteId;
                    $scope.siteName = siteResponse[0].siteName;

                    $scope.siteAddress = siteResponse[0].siteAddress;
                    console.log("length of address", $scope.siteAddress.length)
                    if ($scope.siteAddress.length == undefined) {

                        $scope.siteCity = $scope.siteAddress.city;
                        $scope.siteCountry = $scope.siteAddress.country;
                        console.log($scope.siteCity);
                        console.log($scope.siteCountry)
                    } else if ($scope.siteAddress.length == 1) {

                        $scope.siteCity = $scope.siteAddress[0].city;
                        $scope.siteCountry = $scope.siteAddress[0].country;
                    }
                    $scope.siteParent = siteResponse[0].parent;
                    $scope.fetchCustomer($scope.siteParent);
                    console.log($scope.siteId);
                    console.log($scope.siteName);
                    console.log($scope.siteCity);
                    console.log($scope.siteCountry);
                    console.log(siteResponse);

                });


            }




            $scope.fetchImage = function() {
                twimImage.setAttribute('src', twinURL);
            }

            $scope.fetchManufacturingInfo = function(value) {
                $scope.specification = '';
                $scope.productionOrderNumber = '';
                $scope.salesOrderNumber = '';
                $scope.deviceLoc = '';
                $http.get(fetchDeviceBySerialNumber + value, config).success(function(deviceResponse) {
                    if (deviceResponse != undefined) {

                        //console.log(deviceResponse)


                        for (var i = 0; i < deviceResponse.length; i++) {
                            $scope.specification = deviceResponse[i].specification;
                            $scope.productionOrderNumber = deviceResponse[i].productionOrderNumber;
                            $scope.salesOrderNumber = deviceResponse[i].salesOrderNumber;
                        }
                        console.log($scope.productionOrderNumber);
                        $scope.$broadcast("sku");
                    }
                });
            }

            $scope.fetchMarker = function(value) {
                $scope.specification = '';
                $scope.lat = '';
                $scope.lng = '';
                $http.get(markerUrl + value + '&fields=deviceLocation', config).success(function(deviceResponse) {
                    for (var i = 0; i < deviceResponse.length; i++) {
                        $scope.lat = deviceResponse[i].deviceLocation.lat;
                        $scope.lng = deviceResponse[i].deviceLocation.lng;
                    }

                    var gmap = document.querySelector('google-map');
                    gmap.setAttribute('zoom', 18);
                    var marker = document.createElement('google-map-marker');
                    marker.setAttribute('latitude', $scope.lat);
                    marker.setAttribute('longitude', $scope.lng);


                    marker.innerHTML = '<style>b{color:#b36b00}</style>' +
                        '<table border="1" bgcolor="#D7D5D4" style="border-radius:2px;font-family:candara;border-collapse: collapse;">' +
                        '<th colspan="2">Device Location Info</th>' +
                        '<tr>' +
                        '<td> <h5>Longitude</h5>' +
                        '</td>' +
                        '<td> <h5>' + $scope.lat + '</h5>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td> <h5>Latitude</h5>' +
                        '</td>' +
                        '<td> <h5>' + $scope.lng + '</h5>' +
                        '</td>' +
                        '</tr>' +

                        '</table>' +
                        '';
                    Polymer.dom(gmap).appendChild(marker);
                    Polymer.dom(gmap).appendChild(marker);
                    //gmap.resize();
                });
            }




        }]);
    });