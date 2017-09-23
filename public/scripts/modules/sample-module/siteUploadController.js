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
    //var authURL = commonServices.getauthTokenURL();
    var mapGEOLocation = "https://maps.googleapis.com/maps/api/geocode/json?address=";

    // Controller definition
    controllers.controller('dataRequestCtrl', ['$state', '$timeout', '$scope', '$rootScope', '$log', 'PredixAssetService', '$http', 'commonServices', function($state, $timeout, $scope, $rootScope,
        $log,
        PredixAssetService, $http, commonServices) {

        $("#uploadBar").hide();
        $("#uploadInpro").hide();
        $("#uploadSucc").hide();
        $("#uploadFail").hide();
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

        $(document).ready(function() {
            if (loaded === false) {


                /*  var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';

                    var headersConfig = {
                        					headers:  {
                                                        'content-Type': 'application/x-www-form-urlencoded',
                                                        'authorization' : 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
                                                       }
                                        };

				    $http.post(authURL, data, headersConfig)
            .success(function (data) {
                                                                var accessToken = data.access_token;

                                                                //console.log('Token: '+accessToken);
                                                                var auth = 'bearer '+ accessToken;

                                                                config = {
                                                                headers:  {
                                                                                'Authorization': auth,
                                                                                'Content-Type': 'application/json',
                                                                                'Predix-Zone-Id': '0da112ff-f441-4362-ac52-c5bc1752e404'
                                                                }
                                                };

                                                });		 */
                loaded = true;

                commonServices.getAuthToken().then(
                    function(data) {
                        config = data;
                        $scope.config = config;
                    })


            }
        })

        var divCtrl = this;
        divCtrl.gridOptions = {};
        divCtrl.reset = reset;
        divCtrl.gridOptions = {
            enableFiltering: true
                //enablePaging: true
        };

        /*  $scope.getTableHeight = function() {
              var rowHeight = 30; // your row height
              var headerHeight = 30; // your header height
              return {
                 height: ($scope.divCtrl.gridOptions.data.length * rowHeight + headerHeight) + "px"
              };
           }; */


        var excelJSON = [];
        var excelSiteList = [];

        function reset() {
            divCtrl.gridOptions.data = [];
            divCtrl.gridOptions.columnDefs = [];
        }

        $scope.submit = function() {

            $("#uploadBar").show();
            $("#uploadInpro").show();
            excelJSON = $scope.divCtrl.gridOptions.data;
            console.log(excelJSON)
            var arr = [];
            var assetSiteIdList = [];
            var assetSites = [];
            var postSites = [];
            var patchSites = [];
            var postSitesIdList = [];
            var patchSitesIdList = [];
            var totalList = [];
            var totalIdList = [];
            console.log(arr)
            commonServices.getAssetRecords(config, arr,"").then(
                function(data) {

                    assetSites = data;
                    console.log('Total Sites in Asset>' + data.length);
                    angular.forEach(assetSites, function(assetSite) {
                        assetSiteIdList.push(assetSite.siteId);
                        /* if(assetSite.siteId ==10000){
								console.log(JSON.stringify(assetSite));
								} */

                    });

                    if (assetSites.length > 0) {
                        console.log('in if block');
                        angular.forEach(assetSites, function(assetSite) {
                            angular.forEach(excelJSON, function(item) {

                                var StoreName = '';
                                var Country = '';
                                var City = '';
                                var PostalCode = ''
                                var State = '';
                                var Address = '';
                                var SquareFootage = '';
                                var StoreType = '';
                                var SiteDescription = '';
                                var CustomerId = '';
                                if (item.StoreName !== undefined) {
                                    StoreName = item.StoreName.trim();
                                }
                                if (item.Country !== undefined) {
                                    Country = item.Country.trim();
                                }
                                if (item.City !== undefined) {
                                    City = item.City.trim();
                                }
                                if (item.PostalCode !== undefined) {
                                    PostalCode = item.PostalCode.trim();
                                }
                                if (item.State !== undefined) {
                                    State = item.State.trim();
                                }
                                if (item.Address !== undefined) {
                                    Address = item.Address.trim();
                                }
                                if (item.SquareFootage !== undefined) {
                                    SquareFootage = item.SquareFootage.trim();
                                }
                                if (item.StoreType !== undefined) {
                                    StoreType = item.StoreType.trim();
                                }
                                if (item.SiteDescription !== undefined) {
                                    SiteDescription = item.SiteDescription.trim();
                                }
                                if (item.CustomerId !== undefined) {
                                    CustomerId = item.CustomerId.trim();
                                }

                                if (item.CustomerId !== undefined && assetSite.siteId == item.StoreNumber && patchSitesIdList.indexOf(item.StoreNumber) === -1) {
                                    //console.log('inside if'+item.StoreNumber);
                                    patchSitesIdList.push(item.StoreNumber);
                                    /* patchSites.push({
                                        "uri": "/site/" + item.StoreNumber,
                                        "siteId": item.StoreNumber,
                                        "siteName": StoreName,
                                        "siteAddress": {
                                            "country": Country,
                                            "city": City,
                                            "postalCode": PostalCode,
                                            "region": State,
                                            "street": Address,
                                            "trainStation": assetSite.siteAddress.trainStation,
                                            "district": assetSite.siteAddress.district,
                                            "poBox": assetSite.siteAddress.poBox
                                        },
                                        "squareFootage": SquareFootage,
                                        "storeType": StoreType,
                                        "siteDescription": SiteDescription,
                                        "siteLocation": {
                                            "lat": assetSite.siteLocation.lat,
                                            "lng": assetSite.siteLocation.lng
                                        },
                                        "parent": "/customer/" + CustomerId,
										"propertyLineCordinate": assetSite.propertyLineCordinate
                                    }); */
                                    assetSite.uri = "/site/" + item.StoreNumber;
                                    assetSite.siteId = item.StoreNumber;
                                    assetSite.siteName = item.StoreName;
                                    assetSite.siteAddress.country = Country;
                                    assetSite.siteAddress.city = City;
                                    assetSite.siteAddress.postalCode = PostalCode;
                                    assetSite.siteAddress.region = State;
                                    assetSite.siteAddress.street = Address;
                                    assetSite.siteAddress.trainStation = assetSite.siteAddress.trainStation;
                                    assetSite.siteAddress.district = assetSite.siteAddress.district;
                                    assetSite.siteAddress.poBox = assetSite.siteAddress.poBox;
                                    assetSite.squareFootage = SquareFootage;
                                    assetSite.storeType = StoreType;
                                    assetSite.siteDescription = SiteDescription;
                                    assetSite.parent = "/customer/" + CustomerId;
                                    patchSites.push(assetSite);

                                } else {

                                    if (item.CustomerId !== undefined && item.StoreNumber !== undefined && assetSiteIdList.indexOf(item.StoreNumber) === -1 && postSitesIdList.indexOf(item.StoreNumber) === -1) {
                                        // console.log('in else 1');
                                        postSitesIdList.push(item.StoreNumber);
                                        postSites.push({
                                            "uri": "/site/" + item.StoreNumber,
                                            "siteId": item.StoreNumber,
                                            "siteName": StoreName,
                                            "siteAddress": {
                                                "country": Country,
                                                "city": City,
                                                "postalCode": PostalCode,
                                                "region": State,
                                                "street": Address,
                                                "trainStation": null,
                                                "district": null,
                                                "poBox": null
                                            },
                                            "squareFootage": SquareFootage,
                                            "storeType": StoreType,
                                            "siteDescription": SiteDescription,
                                            "siteLocation": {
                                                "lat": null,
                                                "lng": null
                                            },
                                            "parent": "/customer/" + CustomerId
                                        });
                                    }
                                }
                            });
                        });
                    } else {
                        //If No sites are there in Asset Model
                        console.log('in else block');
                        angular.forEach(excelJSON, function(item) {

                            var StoreName = '';
                            var Country = '';
                            var City = '';
                            var PostalCode = ''
                            var State = '';
                            var Address = '';
                            var SquareFootage = '';
                            var StoreType = '';
                            var SiteDescription = '';
                            var CustomerId = '';
                            if (item.StoreName !== undefined) {
                                StoreName = item.StoreName.trim();
                            }
                            if (item.Country !== undefined) {
                                Country = item.Country.trim();
                            }
                            if (item.City !== undefined) {
                                City = item.City.trim();
                            }
                            if (item.PostalCode !== undefined) {
                                PostalCode = item.PostalCode.trim();
                            }
                            if (item.State !== undefined) {
                                State = item.State.trim();
                            }
                            if (item.Address !== undefined) {
                                Address = item.Address.trim();
                            }
                            if (item.SquareFootage !== undefined) {
                                SquareFootage = item.SquareFootage.trim();
                            }
                            if (item.StoreType !== undefined) {
                                StoreType = item.StoreType.trim();
                            }
                            if (item.SiteDescription !== undefined) {
                                SiteDescription = item.SiteDescription.trim();
                            }
                            if (item.CustomerId !== undefined) {
                                CustomerId = item.CustomerId.trim();
                            }

                            if (item.CustomerId !== undefined && item.StoreNumber !== undefined && postSitesIdList.indexOf(item.StoreNumber) === -1) {
                                console.log('in second if' + item.StoreNumber);
                                //console.log('inside else if'+item.StoreNumber);
                                postSitesIdList.push(item.StoreNumber);
                                postSites.push({
                                    "uri": "/site/" + item.StoreNumber,
                                    "siteId": item.StoreNumber,
                                    "siteName": StoreName,
                                    "siteAddress": {
                                        "country": Country,
                                        "city": City,
                                        "postalCode": PostalCode,
                                        "region": State,
                                        "street": Address,
                                        "trainStation": null,
                                        "district": null,
                                        "poBox": null
                                    },
                                    "squareFootage": SquareFootage,
                                    "storeType": StoreType,
                                    "siteDescription": SiteDescription,
                                    "siteLocation": {
                                        "lat": null,
                                        "lng": null
                                    },
                                    "parent": "/customer/" + CustomerId
                                });
                            }
                        })
                    }
                    //console.log('assetSiteIdList' + assetSiteIdList);
                    //console.log('patchSitesIdList' + patchSitesIdList);
                    //console.log('postSitesIdList' + postSitesIdList);
                    //console.log('patchSitesIdList' + JSON.stringify(patchSites));
                    //console.log('postSitesIdList' + JSON.stringify(postSites));
                    totalList = patchSites.concat(postSites);
                    //$scope.totalList = totalList;
                    $scope.postSites = postSites;
                    $scope.patchSites = patchSites;
                    $scope.totalIdList = postSitesIdList.concat(patchSitesIdList);
                    // console.log('Total' + JSON.stringify(totalList));
                    // console.log("postSites.length" + postSites.length);
                    // console.log("$scope.postSitesIdList.length" + postSitesIdList);
                    // console.log("$scope.postSites.length" + $scope.postSites.length);
                    $scope.siteCounter = 0;
                    $scope.$broadcast("siteLocation");

                    //console.log('totalList' + JSON.stringify(totalList));
                    //console.log('patchSitesIdList' + JSON.stringify(patchSites));
                    //$scope.totalIdList = postSitesIdList.concat(patchSitesIdList);


                    /* commonServices.postOrPatchAssetSite(totalList, config).then(
                        function(data) {
                            //validateAndSaveRef(totalIdList);
                        }) */


                });
        }


        $scope.siteCounter = 0;
        //  console.log("$scope.siteCounter" + $scope.siteCounter);
        $scope.$on("siteLocation", function(sites) {
            if ($scope.siteCounter < $scope.postSites.length) {
                console.log('counter' + $scope.siteCounter);
                console.log(JSON.stringify('>>' + $scope.postSites.length));
                var site = $scope.postSites[$scope.siteCounter];
                var address = site.siteAddress.street + '+' + site.siteAddress.city + '+' + site.siteAddress.region + '+' + site.siteAddress.country + '&sensor=false';
                console.log(mapGEOLocation + address);
                $http.get(mapGEOLocation + address).success(function(response) {
                    //console.log('response' + JSON.stringify(response.results[0].geometry.location));
                    //var location = response.results[0].geometry.location;
                    if (response.results[0] != undefined && response.results[0].geometry.location != undefined) {
                        var location = response.results[0].geometry.location;
                        site.siteLocation.lat = location.lat;
                        site.siteLocation.lng = location.lng;
                        $scope.postSites[$scope.siteCounter] = site;
                        //$scope.totalList.push(site);
                        //console.log(JSON.stringify('>> After' + $scope.postSites.length));
                    }
                    $scope.siteCounter = $scope.siteCounter + 1;
                    $scope.$broadcast("siteLocation");
                });
            } else {
                console.log('In save');
                $scope.totalList = $scope.patchSites.concat($scope.postSites)
                    //console.log('else part1234' + JSON.stringify($scope.totalList));

                commonServices.postOrPatchAssetSite($scope.totalList, config).then(
                    function(data) {
                        validateAndSaveRef($scope.totalIdList);
                    });

            }
        });

        function validateAndSaveRef(siteIdList) {

            var siteList = [];
            var siteIdList = siteIdList;
            // console.log('PostgresqlList' + JSON.stringify(siteList));

            angular.forEach(excelJSON, function(item) {
                angular.forEach(siteIdList, function(validId) {

                    if (validId == item.StoreNumber) {
                        var SurveyType = '';
                        var ContractorName = '';
                        var ReferenceKey = '';
                        var CustomerId = '';
                        console.log('validId' + validId);
                        console.log('validId' + item.ReferenceKey);
                        if (item.SurveyType !== undefined) {
                            SurveyType = item.SurveyType.trim();
                        }
                        if (item.ContractorName !== undefined) {
                            ContractorName = item.ContractorName.trim();
                        }
                        if (item.ReferenceKey !== undefined) {
                            ReferenceKey = item.ReferenceKey.trim();
                        }
                        if (item.CustomerId !== undefined) {
                            CustomerId = item.CustomerId.trim();
                        }

                        excelSiteList.push(item.StoreNumber);
                        siteList.push({
                            'siteId': item.StoreNumber,
                            'surveyType': SurveyType,
                            'contractorName': ContractorName,
                            'refKey': ReferenceKey,
                            'customerId': CustomerId
                        });
                    }
                });
            });

            var request = {
                'source': 'Web',
                'sites': siteList
            };
            //window.location = "/siteUpload";
            //  console.log(JSON.stringify(request));
            // Create New Sites Request in Data Model

            commonServices.saveExcelDataNnPostgresql(request).then(
                function(response) {
                    //alert(JSON.stringify(response));
                    reset();
                    if (response.data.status == 'SUCCESS') {
                        $("#uploadInpro").hide();
                        $("#uploadSucc").show();
                    } else {
                        $("#uploadFail").show();
                        $("#uploadSucc").hide();
                        $("#uploadInpro").hide();
                    }
                });
        }


    }]);



});