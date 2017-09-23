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
        controllers.controller('InstallationCtrl', ['$state', '$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', 'commonServices', function($state, $timeout, $http, $log, PredixAssetService, $rootScope, $scope, commonServices) {
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
			
			$scope.custInputFilter = "";
			$scope.siteInputFilter = "";
			function preparingFiltersForSearchCriteria() {
				commonServices.getCustomerFilterValue().then(function(filterValue) {
					$scope.custInputFilter = filterValue;
					console.log("custInputFilter----", $scope.custInputFilter);
				});
				commonServices.getSitesFilterValue().then(function(filterValue) {
					$scope.siteInputFilter = filterValue;
					console.log("siteInputFilter----", $scope.siteInputFilter);
				});
			}
            privilegeAccess();
			preparingFiltersForSearchCriteria();


            var legend = document.querySelector('#legend');
            var gmap = document.querySelector('google-map');
            $scope.custSelected = false;
            $scope.siteSelected = false;
            $scope.skuSelected = false;
            $scope.custInput = "";
            $scope.siteInput = "";
            $scope.skuInput = "";
            var switch1 = true;

            if (switch1) {
                var siteforSku;
                var filterStation = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/station?filter=parent=";
                var filterDevice = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=site=";
                var filterDeviceSku1 = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=siteId="
                var fetchDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=siteId=';
                var filterSku = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri="
                var filterDeviceSku = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=skuDescription=";
                var filterSiteCust = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=parent=/customer/'
                var filterSite = "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId="
                var filterSkuDesc = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=1000&filter=skuDescription='
                var initialMarkersUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?pageSize=10&filter=parent=/customer/441912'
            } else {
                var filterStation = "views/station.json?filter=site=";
                var filterDevice = "views/device.json?filter=site=";
                var filterSku = "views/sku.json?filter=uri="
                var filterDeviceSku = "views/device?filter=skuDescription="
                var filterSiteCust = 'views/site.json?filter=customer=/customer/'
                var filterSite = "views/site.json?filter=siteId="
            }


            // ********************************************************Start of functions***********************************************

            // commonServices.getAuthToken().then(function(config) {
            // $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=uri=/site/1319',config).success(function (data)
            // {
            // console.log(data)
            // });
            // });
            // var lat=['37.779','31.804','21.386']
            // var longi=['-122.3892','-111.2711','-101.0837']
            // var poly = document.createElement('google-map-poly');
            // poly.setAttribute('closed','');
            // poly.setAttribute('fill-color','blue')
            // poly.setAttribute('stroke-weight','1')
            // poly.setAttribute('fill-opacity','.25')
            // Polymer.dom(gmap).appendChild(poly);	
            // for(var i=0;i<lat.length;i++)
            // {					
            // var polyPoint = document.createElement('google-map-point');
            // polyPoint.setAttribute('latitude', lat[i]);  
            // polyPoint.setAttribute('longitude', longi[i]);
            // Polymer.dom(poly).appendChild(polyPoint);						
            // }
            function stationLoop(data) {
                for (var i = 0; i < data.length; i++) {
                    var siteid = data[i].stationLocation;
                    var marker = document.createElement('google-map-marker');
                    marker.setAttribute('latitude', siteid.lat);
                    marker.setAttribute('longitude', siteid.lng);
                    marker.setAttribute('title', "station");
                    marker.setAttribute('draggable', 'true');
                    marker.setAttribute('click-events', 'true');
                    marker.setAttribute('icon', 'images/blue-marker.png');
                    marker.animation = "DROP";
                    marker.setAttribute('key', data[i].skuIdstationName);
                    Polymer.dom(gmap).appendChild(marker);
                }

            }

            function deviceLoop(data) {
                // if(data.length!=0)
                // {
                // console.log(data[0].site)
                // var siteUri=data[0].site
                // var poly = document.createElement('google-map-poly');
                // poly.setAttribute('closed','');
                // poly.setAttribute('fill-color','red')
                // poly.setAttribute('stroke-weight','1')
                // poly.setAttribute('fill-opacity','.25')
                // Polymer.dom(gmap).appendChild(poly);
                // commonServices.getAuthToken().then(function(config) {
                // $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=uri='+siteUri+'&fields=siteName,siteId,siteLocation,propertyLineCordinate',config).success(function (data)
                // {
                // console.log(data)
                // for(var z=0;z<data[0].propertyLineCordinate.length;z++)
                // {
                // var polyPoint = document.createElement('google-map-point');
                // polyPoint.setAttribute('latitude', data[0].propertyLineCordinate[z].lat);  
                // polyPoint.setAttribute('longitude', data[0].propertyLineCordinate[z].lng);
                // Polymer.dom(poly).appendChild(polyPoint);
                // }
                // })
                // });

                // }
                var siteIdTemp = [];
                for (var i = 0; i < data.length; i++) {
                    var updateStatus = data[i].updateStatus;
                    var siteid = data[i].deviceLocation;
                    var stationid = data[i].station;
                    var marker = document.createElement('google-map-marker');
                    marker.setAttribute('latitude', siteid.lat);
                    marker.setAttribute('longitude', siteid.lng);
                    var markerClass = "marker" + i;
                    marker.setAttribute('id', markerClass);
                    marker.setAttribute('uri', data[i].uri);
                    marker.setAttribute('class', data.length);
                    marker.setAttribute('title', "device");
                    marker.setAttribute('draggable', 'true');
                    marker.setAttribute('drag-Events', 'true');
                    marker.setAttribute('click-events', 'true');
                    marker.setAttribute('siteId', data[i].site);
                    marker.setAttribute('stationid', stationid);
                    marker.setAttribute('description', data[i].description);
                    marker.setAttribute('serialNo', data[i].serialNo);

                    if (updateStatus == 'Fixture Installed Correctly and operating') {
                        marker.setAttribute('icon', 'images/check.png');
                    } else if (updateStatus == 'Fixture Missing') {
                        marker.setAttribute('icon', 'images/nothing.png');
                    } else if (updateStatus == 'Extra Fixture Installed') {
                        marker.setAttribute('icon', 'images/add.png');
                    } else if (updateStatus == 'Fixture Not Retrofit') {
                        marker.setAttribute('icon', 'images/nr.png');
                    } else if (updateStatus == 'Poles not Operational') {
                        marker.setAttribute('icon', 'images/delete.png');
                    } else if (updateStatus == 'Pole Missing from Site') {
                        marker.setAttribute('icon', 'images/wallpack.png');
                    } else if (updateStatus == 'Wall pack not on Survey') {
                        marker.setAttribute('icon', 'images/refresh.png');
                    } else if (updateStatus == 'Fixture Positioned Incorrectly') {
                        marker.setAttribute('icon', 'images/pole_missing.png');
                    } else if (updateStatus == 'Poles not On Map') {
                        marker.setAttribute('icon', 'images/poleNotOnMap.png');
                    } else if (updateStatus == 'Sides of Bldg with non working fixture' || updateStatus == 'Fixture not Operational') {
                        marker.setAttribute('icon', 'images/cancel.png');
                    } else {
                        var skuId = data[i].specification
                        var counter = 0;
                        var markerColor = skuId.substring(5, 11)
                            //var markerColor="204933"

                        //alert(parseInt(markerColor))
                        var hexString = parseInt(markerColor).toString(16);
                        //alert(hexString);


                        if (hexString.length == 5) {
                            hexString = hexString + 9
                        }

                        var markerCustom = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + hexString
                            //console.log(markerCustom);

                        marker.setAttribute('icon', markerCustom);
                    }
                    marker.setAttribute('click-events', 'true');
                    marker.animation = "DROP";
                    marker.setAttribute('on-google-map-marker-click', '{{google_map_marker_click}}');
                    marker.setAttribute('key', data[i].specification);
                    Polymer.dom(gmap).appendChild(marker);

                    //alert(siteIdTemp+" b4")
                    if (siteIdTemp.length == 0) {
                        var legend = document.querySelector('#legend');
                        legend.innerHTML = legend.innerHTML + "<tr><td><img src='images/map18.png' style='background:#" + hexString + "'><td>" + skuId + "</tr>";
                        $(".legendPA").show();
                        siteIdTemp.push(skuId);

                    }
                    counter = 0;
                    //alert(siteIdTemp);
                    for (var j = 0; j < siteIdTemp.length; j++) {
                        if ((jQuery.inArray(skuId, siteIdTemp)) == -1) {
                            counter++;
                            if (counter == 1) {
                                siteIdTemp.push(skuId);
                            }

                        } else {

                            break;

                        }

                        if (counter == 1) {
                            console.log(skuId)

                            legend.innerHTML = legend.innerHTML + "<tr><td><img src='images/map18.png' style='background:#" + hexString + "'><td>" + skuId + "</tr>";
                            $(".legendPA").show()
                        }
                    }


                    //console.log(markerCustom)


                }
            }

            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

            function getIstTime() {
                var sec_num = new Date();
                var h = addZero(sec_num.getHours());
                var m = addZero(sec_num.getMinutes());
                var s = addZero(sec_num.getSeconds());
                return sec_num;
            }

            function msToHMS(ms) {
                // 1- Convert to seconds:
                var seconds = ms / 1000;
                // 2- Extract hours:
                var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
                seconds = seconds % 3600; // seconds remaining after extracting hours
                // 3- Extract minutes:
                var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
                // 4- Keep only seconds not extracted to minutes:
                seconds = seconds % 60;
                return hours + ":" + minutes + ":" + seconds;
            }

            function removeAllMarkers() {
                var markerarr = new Array();
                markerarr = gmap.markers;
                if (!(markerarr == undefined)) {
                    for (var i = 0; i < markerarr.length; i++) {
                        Polymer.dom((Polymer.dom(markerarr[i]).parentNode)).removeChild(markerarr[i]);
                        Polymer.dom.flush();
                    }

                }
            }

            function siteforloop() {
                for (var i = 0; i < $scope.longi.length; i++) {
                    var marker = document.createElement('google-map-marker');
                    marker.setAttribute('latitude', $scope.lat[i]);
                    marker.setAttribute('longitude', $scope.longi[i]);
                    var site = $scope.sitename[i] + '-' + $scope.site[i];
                    marker.setAttribute('title', site);
                    marker.setAttribute('click-events', 'true');
                    marker.setAttribute('drag-events', 'true');
                    marker.setAttribute('icon', 'images/Marker_1.png');
                    marker.setAttribute('key', $scope.sitename[i]);
                    marker.animation = "DROP";
                    Polymer.dom(gmap).appendChild(marker);
                }
            }

            function getzoomLatLng() {
                $http.get(filterSite + $scope.KeySite, config).success(function(data) {
                    var loc;
                    var lat = 0;
                    var lng = 0;
                    for (var i = 0; i < data.length; i++) {
                        loc = data[i].siteLocation;
                        lat = loc.lat;
                        lng = loc.lng;
                    }
                    //*************to Display zoom-in on entering site in typeahead*************
                    gmap.setAttribute('latitude', lat);
                    gmap.setAttribute('longitude', lng);
                    gmap.setAttribute('additional-map-options', '{"mapTypeId":"satellite"}');
                    gmap.setAttribute('zoom', 18);
                });
            }

            function skuloop(siteResponse) {
                for (var i = 0; i < siteResponse.length; i++) {
                    var devLoc = siteResponse[i].deviceLocation;
                    if (!(devLoc == undefined)) {
                        if (!(devLoc.lat == null || devLoc.lng == null)) {
                            var marker = document.createElement('google-map-marker');
                            marker.setAttribute('latitude', devLoc.lat);
                            marker.setAttribute('longitude', devLoc.lng);
                            marker.setAttribute('icon', 'images/markers.png');
                            marker.animation = "DROP";
                            Polymer.dom(gmap).appendChild(marker);
                        }

                    }
                }
            }

            function siteCustforLoop(data) {
                for (var i = 0; i < data.length; i++) {
                    var skuid = data[i].siteLocation;
                    $scope.sitename[i] = data[i].uri;
                    $scope.site[i] = data[i].siteName;
                    if (!(skuid == undefined)) {
                        if (!(skuid.lat == null || skuid.lng == null)) {
                            $scope.lat[i] = skuid.lat;
                            $scope.longi[i] = skuid.lng;
                        }

                    }
                }
            }

            function latlngForSite(data) {
                for (var i = 0; i < data.length; i++) {
                    var skuid = data[i].siteLocation;
                    $scope.sitename[i] = data[i].uri;
                    $scope.site[i] = data[i].siteName
                    if (!(skuid == undefined)) {
                        if (!(skuid.lat == null || skuid.lng == null)) {
                            $scope.lat[i] = skuid.lat;
                            $scope.longi[i] = skuid.lng;
                        }
                    }
                }
            }

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
                        console.log(headersConfig);
                        console.log(data)
                        var accessToken = data.access_token;
                        console.log('Token:' + accessToken);
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

                        var ps = document.querySelector('paper-spinner');
                        ps.setAttribute('active', '');
                        var start = getIstTime();
                        console.log('Initial Map Markers before http.get :' + start);
                        // *********Site From typeahead(Intial Site markers on Map)*********
                        $http.get(initialMarkersUrl, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(pageload): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(pageload): ' + msToHMS(time));
                            latlngForSite(data);
                        });

                        // *************to display the site markers after loading them***********
                        setTimeout(function() {
                            ps.removeAttribute('active');
                            gmap.setAttribute('latitude', '37');
                            gmap.setAttribute('longitude', '-95');
                            gmap.setAttribute('zoom', '4');
                            siteforloop();
                            var finalEnd = getIstTime();
                            console.log('Render Markers(pageload): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            console.log('Time of markers Display(pageload): ' + msToHMS(time));
                            $scope.end = "";
                        }, 5000);
                    });
            });


            window.addEventListener('google-map-marker-dragend', function(e) {
                console.log(e);
                var srcElement1 = e.srcElement;
                var data = srcElement1.__data__;
                var lat = srcElement1.latitude;
                console.log(lat);
                var lng = srcElement1.longitude;

                var uri = srcElement1.getAttribute('uri');
                $http.get("https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=uri=" + uri, config).success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        // console.log(data);
                        // var devLoc=data[i].deviceLocation;
                        // alert('in: '+devLoc.lat);
                        // devLoc.lat=lat;
                        // devLoc.lng=lng;
                        //console.log(data);

                    }
                    angular.forEach(data, function(value, key) {
                        //console.log(value.deviceLocation.lat);
                        //console.log(lat);
                        data[key].deviceLocation.lat = lat;
                        data[key].deviceLocation.lng = lng;

                    })
                    console.log(data);
                    $http.post("https://predix-asset.run.aws-usw02-pr.ice.predix.io/device", data, config).success(function(data, status) {
                        //alert('data'+status);
                        console.log(data);
                    });
                });


            });
            $scope.clear = function() {
                removeAllMarkers();
                legend.innerHTML = "";
                $(".legendPA").hide()
                var start = getIstTime();

                console.log('Clear Map Markers, before http.get :' + start);
                $http.get(initialMarkersUrl, config).success(function(data) {
                    $scope.json1 = [{
                        'op': 'replace',
                        'path': '/siteLocation/lat',
                        'value': '99'
                    }];
                    /*  {
                         'op':'replace',
                         'path' : '/created_date',
                         'value' : createdDate
                     },
                                                                                                         {
                         'op':'replace',
                         'path' : '/isActive',
                         'value' : 'N'
                     } */


                    $http.patch("https://predix-asset.run.aws-usw02-pr.ice.predix.io/site/51957769221", $scope.json1, config)
                        .success(function(data) {
                            //alert('hi')

                        });

                    $scope.end = getIstTime();
                    console.log('End time(clear): ' + $scope.end);
                    var time = $scope.end - start;
                    console.log('Execution time(clear): ' + msToHMS(time));
                    $scope.longi = [];
                    latlngForSite(data);
                    gmap.setAttribute('latitude', '37');
                    gmap.setAttribute('longitude', '-95');
                    gmap.setAttribute('zoom', '4');

                    siteforloop();
                    var finalEnd = getIstTime();
                    console.log('Render Markers(clear): ' + finalEnd);
                    var time = finalEnd - $scope.end;
                    console.log('Time of markers Display(clear): ' + msToHMS(time));
                    $scope.end = "";

                });

                document.getElementById('serchselection').innerHTML = '';
                var inputCust = document.querySelector('paper-typeahead-input-customer');
                inputCust.inputValue = '';
                inputCust.keyid = '';
                var inputSite = document.querySelector('paper-typeahead-input-site');
                inputSite.inputValue = '';
                inputSite.keyid = '';
                var inputSku = document.querySelector('paper-typeahead-input-sku');
                inputSku.inputValue = '';
                var paperSite = document.querySelector('paper-typeahead-input-site');
                var remoteUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteName=/.*%QUERY.*/&fields=siteId,siteName';
                paperSite.setAttribute('remote-url', remoteUrl);

            }
            $scope.abc = function() {
                var ps = document.querySelector('paper-spinner'); //paper spinner
                ps.setAttribute('active', '');
                var i = 0;
                if ($scope.custSelected) {
                    if (document.getElementById('serchselection').hasChildNodes()) {
                        if (document.getElementById("cust") != null) {
                            document.getElementById("cust").parentNode.removeChild(document.getElementById("cust"));
                        }

                    }
                    var inputCust = document.querySelector('paper-typeahead-input-customer');
                    i++;
                    var node = document.createElement('label');
                    node.innerHTML = '<label  style=" margin-right: 4px;color: Black; font-size: initial;" id="cust" for="check  ' + i + '"> Customer:' + inputCust.inputValue + '</label>';
                    document.getElementById('serchselection').appendChild(node);
                }
                if ($scope.siteSelected) {
                    if (document.getElementById('serchselection').hasChildNodes()) {
                        if (document.getElementById("site") != null) {
                            document.getElementById("site").parentNode.removeChild(document.getElementById("site"));
                        }
                    }
                    var inputSite = document.querySelector('paper-typeahead-input-site');
                    i++;
                    var node = document.createElement('label');
                    node.innerHTML = '<label   style=" margin-right: 4px;color: Black; font-size: initial;" id="site" for="check ' + i + '">Site:' + inputSite.inputValue + '</label>';
                    document.getElementById('serchselection').appendChild(node);
                }
                if ($scope.skuSelected) {
                    if (document.getElementById('serchselection').hasChildNodes()) {
                        if (document.getElementById("sku") != null) {
                            document.getElementById("sku").parentNode.removeChild(document.getElementById("sku"));
                        }
                    }
                    var inputSku = document.querySelector('paper-typeahead-input-sku');
                    i++;
                    var node = document.createElement('label');
                    node.innerHTML = '<label style=" margin-right: 4px;color: Black; font-size: initial;" id="sku" for="check' + i + '">SKU:' + inputSku.inputValue + '</label>';
                    document.getElementById('serchselection').appendChild(node);
                }

                if (document.querySelector('paper-typeahead-input-site').inputValue == '') {
                    if (document.getElementById("site") != null) {
                        document.getElementById("site").parentNode.removeChild(document.getElementById("site"));
                    }

                }
                /* 	alert($scope.custInput+" :Customer: "+document.querySelector('paper-typeahead-input-customer').inputValue);
                	alert($scope.siteInput+" :Site: "+document.querySelector('paper-typeahead-input-site').inputValue);
                	alert($scope.skuInput+" :Sku: "+document.querySelector('paper-typeahead-input-sku').inputValue); */
                if ($scope.custSelected && $scope.siteSelected && $scope.skuSelected) //allselected
                {
                    if ($scope.custInput == document.querySelector('paper-typeahead-input-customer').inputValue && $scope.siteInput == document.querySelector('paper-typeahead-input-site').inputValue && $scope.skuInput == document.querySelector('paper-typeahead-input-sku').inputValue) {
                        removeAllMarkers();
                        var start = getIstTime();
                        console.log('Cust Map Markers before http.get(All selected) :' + start);
                        // *********Site From typeahead(After selecting 1st typeahead Site markers on Map)*********
                        $http.get(filterSiteCust + $scope.KeyCustomer, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(allcust): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(allcust): ' + msToHMS(time));
                            siteCustforLoop(data);
                        });


                        // *************to display the site markers after loading them***********
                        gmap.setAttribute('latitude', '37');
                        gmap.setAttribute('longitude', '-95');
                        gmap.setAttribute('zoom', '4');
                        siteforloop();
                        var finalEnd = getIstTime();
                        console.log('Render Markers(allcust): ' + finalEnd);
                        var time = finalEnd - $scope.end;
                        //console.log('Time of markers Display(allcust): ' +msToHMS(time));	
                        $scope.end = "";
                        var start = getIstTime();
                        console.log('Station Map Markers before http.get(All selected) :' + start);
                        // ********Get Station Markers on typeahead site selection*********
                        $http.get(filterStation + "/site/" + $scope.KeySite, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(allstat): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(allstat): ' + msToHMS(time));
                            ps.removeAttribute('active');
                            stationLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(allstat): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(allstat): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                        var start = getIstTime();
                        console.log('Device Map Markers before http.get(alldev) :' + start);
                        // ********Get Device Markers on typeahead site selection*********
                        $http.get(filterDevice + "/site/" + $scope.KeySite, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(alldev): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(alldev): ' + msToHMS(time));
                            ps.removeAttribute('active');

                            // ********Get Long and lat for zoom in on typeahead site selection*********
                            getzoomLatLng();
                            // *****Iterating thru all devices********
                            legend.innerHTML = "";
                            $(".legendPA").hide()
                            deviceLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(alldev): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(allsite): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                        var start = getIstTime();
                        console.log('Sku Map Markers before http.get(All selected) :' + start);
                        $http.get(filterDeviceSku + $scope.KeySku + '<specification[t3]', config).success(function(siteResponse) {
                            $scope.end = getIstTime();
                            console.log('End time(allsku): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(allsku): ' + msToHMS(time));
                            skuloop(siteResponse);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(allsku): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            console.log('Time of markers Display(allsku): ' + msToHMS(time));
                            $scope.end = "";
                            ps.removeAttribute('active');
                        });
                    } else {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                } else if ($scope.custSelected && !($scope.siteSelected) && $scope.skuSelected) //cust+sku
                {
                    var skuAlert = document.querySelector('#skuAlert');
                    skuAlert.toggle();
                    ps.removeAttribute('active');
                } else if (!($scope.custSelected) && ($scope.siteSelected) && !($scope.skuSelected)) //only site
                {
                    if ($scope.siteInput == document.querySelector('paper-typeahead-input-site').inputValue) {
                        removeAllMarkers();
                        var start = getIstTime();
                        console.log('Station Map Markers before http.get(onysitestat) :' + start);
                        // ********Get Station Markers on typeahead site selection*********
                        $http.get(filterStation + "/site/" + $scope.KeySite, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(onysitestat): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(onysitestat): ' + msToHMS(time));
                            ps.removeAttribute('active');
                            stationLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(onysitestat): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(onysitestat): ' +msToHMS(time));	
                            $scope.end = "";
                        });

                        var start = getIstTime();
                        console.log('Device Map Markers before http.get(onysitedev) :' + start);
                        // ********Get Device Markers on typeahead site selection*********
                        $http.get(filterDevice + "/site/" + $scope.KeySite, config).success(function(data) {
                            ps.removeAttribute('active');
                            getzoomLatLng();
                            // *****Iterating thru all devices********
                            legend.innerHTML = "";
                            $(".legendPA").hide()
                            console.log(data)
                            deviceLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(onysitedev): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(onysitedev): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                    } else {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                } else if (!($scope.custSelected) && !($scope.siteSelected) && ($scope.skuSelected)) //only sku
                {
                    if ($scope.skuInput == document.querySelector('paper-typeahead-input-sku').inputValue) {
                        var start = getIstTime();
                        console.log('Sku Map Markers before http.get(onysku) :' + start);
                        //alert(filterSkuDesc+$scope.KeySku+'<specification[t3]');
                        $http.get(filterSkuDesc + $scope.KeySku + '<specification[t3]', config).success(function(siteResponse) {
                            //alert(siteResponse.length);
                            if (siteResponse.length >= 1000) {
                                ps.removeAttribute('active');
                                overSizeAlert.toggle();
                            } else {
                                console.log(siteResponse);
                                $scope.end = getIstTime();
                                console.log('End time(onysku): ' + $scope.end);
                                var time = $scope.end - start;
                                console.log('Execution time(onysku): ' + msToHMS(time));
                                removeAllMarkers();

                                //skuloop(siteResponse);
                                for (var i = 0; i < siteResponse.length; i++) {
                                    var devLoc = siteResponse[i].deviceLocation;
                                    var siteId = siteResponse[i].site;

                                    if (siteIdTemp != siteId) {
                                        var siteIdTemp = siteId;
                                    } else {
                                        continue;
                                    }
                                    //alert(siteId);
                                    $http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=uri=' + siteId, config).success(function(data) {
                                        console.log(data);

                                        for (var i = 0; i < data.length; i++) {
                                            var siteLoc = data[i].siteLocation;
                                            if (!(siteLoc == undefined)) {
                                                if (!(siteLoc.lat == null || siteLoc.lng == null)) {
                                                    var marker = document.createElement('google-map-marker');
                                                    marker.setAttribute('latitude', siteLoc.lat);
                                                    marker.setAttribute('longitude', siteLoc.lng);
                                                    var site = data[i].siteId + '-' + data[i].siteName;
                                                    marker.setAttribute('title', site);
                                                    marker.setAttribute('key', data[i].siteId);
                                                    marker.setAttribute('id', 'SkuSite');
                                                    marker.setAttribute('click-events', 'true');
                                                    marker.setAttribute('icon', 'images/Marker_1.png');
                                                    marker.animation = "DROP";
                                                    Polymer.dom(gmap).appendChild(marker);
                                                }

                                            }
                                        }
                                    });
                                    /* if (!(devLoc ==undefined))
                                    {
                                    	if (!(devLoc.lat==null ||devLoc.lng==null))
                                    	{
                                    		var marker = document.createElement('google-map-marker');
                                    		marker.setAttribute('latitude',devLoc.lat);     
                                    		marker.setAttribute('longitude', devLoc.lng);
                                    		marker.setAttribute('icon','images/markers.png');
                                    		marker.animation="DROP";
                                    		Polymer.dom(gmap).appendChild(marker);
                                    	}

                                    } */
                                }

                                ps.removeAttribute('active');
                                gmap.setAttribute('latitude', '37');
                                gmap.setAttribute('longitude', '-95');
                                gmap.setAttribute('zoom', '4');
                                var finalEnd = getIstTime();
                                console.log('Render Markers(onysku): ' + finalEnd);
                                var time = finalEnd - $scope.end;
                                console.log('Time of markers Display(onysku): ' + msToHMS(time));
                                $scope.end = "";
                            }
                        });
                    } else {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                } else if (!($scope.custSelected) && !($scope.siteSelected) && !($scope.skuSelected)) //no1 selected
                {
                    if ($scope.custInput != document.querySelector('paper-typeahead-input-customer').inputValue || $scope.siteInput != document.querySelector('paper-typeahead-input-site').inputValue || $scope.skuInput != document.querySelector('paper-typeahead-input-sku').inputValue) {
                        searchAlert.toggle();
                        ps.removeAttribute('active');

                    }
                    if (document.querySelector('paper-typeahead-input-customer').inputValue == "" && document.querySelector('paper-typeahead-input-site').inputValue == "" && document.querySelector('paper-typeahead-input-sku').inputValue == "") {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                    ps.removeAttribute('active');
                } else if (!($scope.custSelected) && ($scope.siteSelected) && ($scope.skuSelected)) //site+sku
                {
                    if ($scope.siteInput == document.querySelector('paper-typeahead-input-site').inputValue && $scope.skuInput == document.querySelector('paper-typeahead-input-sku').inputValue) {
                        var start = getIstTime();
                        console.log('Station Map Markers before http.get(site+sku(stat)) :' + start);
                        // ********Get Station Markers on typeahead site selection*********
                        $http.get(filterStation + "/site/" + $scope.KeySite, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(site+sku(stat)): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(site+sku(stat)): ' + msToHMS(time));
                            ps.removeAttribute('active');
                            stationLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(site+sku(stat)): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(site+sku(stat)): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                        var start = getIstTime();
                        console.log('Device Map Markers before http.get(site+sku(dev)) :' + start);
                        // ********Get Device Markers on typeahead site selection*********
                        $http.get(filterDevice + "/site/" + $scope.KeySite, config).success(function(data) {
                            ps.removeAttribute('active');
                            $scope.end = getIstTime();
                            console.log('End time(site+sku(dev)): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(site+sku(dev)): ' + msToHMS(time));
                            // ********Get Long and lat for zoom in on typeahead site selection*********
                            getzoomLatLng();
                            // *****Iterating thru all devices********
                            legend.innerHTML = "";
                            $(".legendPA").hide()
                            deviceLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(site+sku(dev))): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(site+sku(dev)): ' +msToHMS(time));	
                            $scope.end = "";
                        });

                        var start = getIstTime();
                        console.log('Sku Map Markers before http.get(site+sku(sku)) :' + start);
                        // ********Get Sku Markers on typeahead sku selection*********
                        $http.get(filterSkuDesc + $scope.KeySku + '<specification[t3]', config).success(function(siteResponse) {
                            $scope.end = getIstTime();
                            console.log('End time(site+sku(sku)): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(site+sku(sku)): ' + msToHMS(time));
                            skuloop(siteResponse);
                            ps.removeAttribute('active');
                            var finalEnd = getIstTime();
                            console.log('Render Markers(site+sku(sku))): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            console.log('Time of markers Display(site+sku(sku)): ' + msToHMS(time));
                            $scope.end = "";
                        });
                    } else {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                } else if (($scope.custSelected) && !($scope.siteSelected) && !($scope.skuSelected)) //only cust
                {
                    if ($scope.custInput == document.querySelector('paper-typeahead-input-customer').inputValue) {
                        removeAllMarkers();
                        var start = getIstTime();
                        console.log('Site Map Markers before http.get(onlycust) :' + start);
                        // *********Site From typeahead(After selecting 1st typeahead Site markers on Map)*********
                        $http.get(filterSiteCust + $scope.KeyCustomer, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(onlycust): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(onlycust): ' + msToHMS(time));
                            $scope.longi = [];

                            siteCustforLoop(data);
                            ps.removeAttribute('active');
                            gmap.setAttribute('latitude', '37');
                            gmap.setAttribute('longitude', '-95');
                            gmap.setAttribute('zoom', '4');
                            siteforloop();
                            var finalEnd = getIstTime();
                            console.log('Render Markers(onlycust): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(onlycust): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                    } else {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                } else if (($scope.custSelected) && ($scope.siteSelected) && !($scope.skuSelected)) //cust+site
                {
                    if ($scope.custInput == document.querySelector('paper-typeahead-input-customer').inputValue && $scope.siteInput == document.querySelector('paper-typeahead-input-site').inputValue) {
                        removeAllMarkers();
                        var start = getIstTime();
                        console.log('Site Map Markers before http.get(cust+site(site)) :' + start);
                        // *********Site From typeahead(After selecting 1st typeahead Site markers on Map)*********
                        $http.get(filterSiteCust + $scope.KeyCustomer, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(cust+site(site)): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(cust+site(site)): ' + msToHMS(time));
                            siteCustforLoop(data);
                        });
                        // *************to display the site markers after loading them***********	
                        ps.removeAttribute('active');
                        gmap.setAttribute('latitude', '37');
                        gmap.setAttribute('longitude', '-95');
                        gmap.setAttribute('zoom', '4');
                        siteforloop();
                        var finalEnd = getIstTime();
                        console.log('Render Markers(cust+site(site)): ' + finalEnd);
                        var time = finalEnd - $scope.end;
                        //console.log('Time of markers Display(cust+site(site))): ' +msToHMS(time));	
                        $scope.end = "";
                        var start = getIstTime();
                        console.log('Station Map Markers before http.get(cust+site(stat)) :' + start);
                        // ********Get Station Markers on typeahead site selection*********
                        $http.get(filterStation + "/site/" + $scope.KeySite, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(cust+site(stat)): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(cust+site(stat)): ' + msToHMS(time));
                            ps.removeAttribute('active');
                            stationLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(cust+site(stat)): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(cust+site(stat)): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                        var start = getIstTime();
                        console.log('Device Map Markers before http.get(cust+site(dev)) :' + start);
                        // ********Get Device Markers on typeahead site selection*********
                        $http.get(filterDevice + "/site/" + $scope.KeySite, config).success(function(data) {
                            $scope.end = getIstTime();
                            console.log('End time(cust+site(dev)): ' + $scope.end);
                            var time = $scope.end - start;
                            console.log('Execution time(cust+site(dev)): ' + msToHMS(time));
                            ps.removeAttribute('active');


                            // ********Get Long and lat for zoom in on typeahead site selection*********
                            getzoomLatLng();
                            // *****Iterating thru all devices********
                            legend.innerHTML = "";
                            $(".legendPA").hide()
                            deviceLoop(data);
                            var finalEnd = getIstTime();
                            console.log('Render Markers(cust+site(dev)): ' + finalEnd);
                            var time = finalEnd - $scope.end;
                            //console.log('Time of markers Display(cust+site(dev)): ' +msToHMS(time));	
                            $scope.end = "";
                        });
                    } else {
                        ps.removeAttribute('active');
                        searchAlert.toggle();
                    }
                }
                $scope.custSelected = false;
                $scope.siteSelected = false;
                $scope.skuSelected = false;
            }


            // ******************************************************************ITEM CONFIRMED FUNCTION****************************************************************************		
            window.addEventListener('pt-item-confirmed', function(e) {
                var ps = document.querySelector('paper-spinner'); //paper spinner                                                                                                      //to show the paper spinner
                var srcElement2 = e.srcElement;
                var dta = srcElement2.__data__;
                console.log(e);
                var keyCust; //to get custid or site id
                $scope.typeaheadType = srcElement2.localName;
                if (srcElement2.localName == "paper-typeahead-input-customer") {
                    $scope.custInput = document.querySelector('paper-typeahead-input-customer').inputValue;
                    $scope.custSelected = true;
                    keyCust = dta.keyid; //custid
                    $scope.KeyCustomer = dta.keyid;
                    var paperSite = document.querySelector('paper-typeahead-input-site');
                    var remoteUrl = filterSiteCust + keyCust + ':siteName=%QUERY*&fields=siteId,siteName';
                    paperSite.setAttribute('remote-url', remoteUrl);
                    var paperCustInput = document.querySelector('#input');
                } else if (srcElement2.localName == "paper-typeahead-input-site") {
                    $scope.siteInput = document.querySelector('paper-typeahead-input-site').inputValue;
                    $scope.siteSelected = true;
                    siteforSku = dta.keyid;
                    $scope.KeySite = dta.keyid;
                } else if (srcElement2.localName == "paper-typeahead-input-sku") {
                    $scope.skuInput = document.querySelector('paper-typeahead-input-sku').inputValue;
                    $scope.skuSelected = true;
                    $scope.KeySku = dta.inputValue;
                    //alert(dta.keyid)
                }
            });
            // **********on marker single click (for infowindow)*********
            window.addEventListener('google-map-marker-click', function(e) {
                var temp = false;
                var srcElement1 = e.srcElement;
                //var skuid=srcElement1.innerHTML;
                var skuid = srcElement1.getAttribute('key');
                var title = srcElement1.title;
                if (title == "device") {
                    var subSku = skuid.substring(5, 11)
                    $http.get(filterSku + skuid, config).success(function(data) {
                        console.log(data);
                        if (data.length == 0) {
                            srcElement1.innerHTML =
                                '<style>b{color:}h3{color:#FF9821;font-weight:bold;font-size: 17px;}</style>' +
                                '<h1>Device Information</h1><br>' +
                                '<table border="0" style="border-radius:2px;font-family:candara;margin-top: -12%;">' +
                                '<tr>' +
                                '<td> <h3>Device</h3>' +
                                '<b>Serial number :</b>' + srcElement1.getAttribute('serialNo') +
                                '<br><b>Description </b>:' + srcElement1.getAttribute('description') +
                                // '<br><b>SiteId :</b>'+srcElement1.getAttribute('siteId')+
                                // '<br><b>Stationid :</b>'+srcElement1.getAttribute('stationid')+
                                '<br><b>Location<br>Latitude :</b>' + srcElement1.getAttribute('latitude') +
                                '<br><b>Longitude :</b>' + srcElement1.getAttribute('longitude') +
                                '<td><img src="images/img.jpg" width="200px">' +
                                '</tr>' +

                                '<tr>' +
                                '<td><h3>SKU</h3>' +
                                '<b>SKU ID :</b>' +
                                '<br><b>Product Hierarchy : </b>' +
                                '<br><b>Sku Description : </b>' +
                                '</td><td><h3>Operational Parameters</h3>' +
                                '<b>Voltage:<br><b>Power:<br><b>Current:<br></b>' +
                                '</tr>' +
                                '';
                        } else {
                            var prdher
                            if (data[0].specification != null) {
                                var ph = data[0].specification;
                                var phar = ph.split('/');
                                prdher = phar[2];
                            } else {
                                prdher = '';
                            }
                            srcElement1.innerHTML =
                                '<style>b{color:}h3{color:#FF9821;font-weight:bold;font-size: 17px;}</style>' +
                                '<h1>Device Information</h1><br>' +
                                '<table border="0" style="border-radius:2px;font-family:candara;margin-top: -12%;">' +
                                '<tr>' +
                                '<td> <h3>Device</h3>' +
                                '<b>Serial number :</b>' + srcElement1.getAttribute('serialNo') +
                                '<br><b>Description </b>:' + srcElement1.getAttribute('description') +
                                // '<br><b>SiteId :</b>'+srcElement1.getAttribute('siteId')+
                                // '<br><b>Stationid :</b>'+srcElement1.getAttribute('stationid')+
                                '<br><b>Location<br>Latitude :</b>' + srcElement1.getAttribute('latitude') +
                                '<br><b>Longitude :</b>' + srcElement1.getAttribute('longitude') +
                                '<td><img src="images/img.jpg" width="200px">' +
                                '</tr>' +

                                '<tr>' +
                                '<td><h3>SKU</h3>' +
                                '<b>SKU ID :</b>' + data[0].skuId +
                                '<br><b>Product Hierarchy : </b>' + prdher +
                                '<br><b>Sku Description : </b>' + data[0].skuDescription +
                                '</td><td><h3>Operational Parameters</h3>' +
                                '<b>Voltage:<br><b>Power:<br><b>Current:<br></b>' +
                                '</tr>' +
                                '';
                        }
                    });

                }
            });
            // *************On DblClick(for zooming in and showing devices)**************
            window.addEventListener('google-map-marker-dblclick', function(e) {

                var srcElement = e.srcElement;
                var data = srcElement.__data__;
                var siteid = srcElement.getAttribute('key');
                //alert(siteid);
                var id1 = srcElement.getAttribute('id');
                //alert('id'+id1);

                //*************to Display stations on dblclick*************
                $http.get(filterStation + siteid, config).success(function(data) {
                    stationLoop(data);
                });
                if (id1 == "SkuSite") {
                    //alert(filterDeviceSku1+$scope.KeySku+':site='+siteid);
                    console.log(filterDeviceSku1 + siteid + '<parent[t2]:skuDescription=' + $scope.KeySku + '<specification[t2]');
                    $http.get(filterDeviceSku1 + siteid + '<parent[t2]:skuDescription=' + $scope.KeySku + '<specification[t2]', config).success(function(data) {
                        //alert($scope.KeySku);
                        console.log(data);
                        legend.innerHTML = "";
                        $(".legendPA").hide()
                        deviceLoop(data);
                    });
                } else {

                    //*************to Display devices on dblclick*************
                    $http.get(filterDevice + siteid, config).success(function(data) {
                        legend.innerHTML = "";
                        $(".legendPA").hide();
                        deviceLoop(data);
                    });
                }
                //*************to Display zoom-in on dblclick*************
                gmap.setAttribute('latitude', data.latitude);
                gmap.setAttribute('longitude', data.longitude);
                var maptype = '{"mapTypeId":"satellite"}';
                gmap.setAttribute('additional-map-options', maptype);
                gmap.setAttribute('zoom', 18);
            });
            $scope.lat = [];
            $scope.longi = [];
            $scope.siteName = [];
            $scope.site = []
            $scope.marker = [];
            $scope.sitename = [];
            $scope.customer = [];
            $scope.site = [];
        }]);
    });