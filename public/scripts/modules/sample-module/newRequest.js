/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular',
    './sample-module'
], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('NewrequestCtrl', ['$state', '$http', '$log', 'commonServices', '$rootScope', '$scope', '$timeout', function($state, $http, $log, commonServices, $rootScope, $scope, $timeout) {
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


        var count = 0;
        var countloop = 0;
        var screenId = "100";
        $scope.ContractorFlag = false;
        $scope.selectedRows1 = [];
        $scope.countSelectedRows = 0;
        $scope.dropdown = [];
        $scope.siterequestIdList = [];

        $scope.compareAssetSite = function(postgresdata) {

            if (postgresdata.length > 0) {
                angular.forEach(postgresdata, function(value, key) {

                    var siteid = value.siteId;
                    var siterequestid = value.siteRequestId;
                    var refkey = value.refKey;
                    var surveyType = value.surveyType;
                    var ContractorId = value.contractorName;
					var ContractorGroup = value.contractorGroup;
                    //var CustomerId = value.CustomerId;

                    //   console.log(JSON.stringify(postgresdata));

                    if (ContractorId == '' || ContractorId == undefined) {
                        ContractorId = 'No Contractor';
                    }
					
					if (ContractorGroup == '' || ContractorGroup == undefined) {
                        ContractorGroup = 'No ContractorGroup';
                    }
						
                    angular.forEach($scope.assetServiceData, function(value, key) {

                        if (value.parent) {
                            if (value.parent.split('/')[2] !== 'undefined') {
								//console.log('----value.parent.split----------',value.parent.split('/')[2]);
                                $scope.assetServiceData[key].customerId = value.parent.split('/')[2];
                            } else {
                                $scope.assetServiceData[key].customerId = '';
                            }
                        }

                        if (value.siteId == undefined) {
                            $scope.assetServiceData[key].siteId = "-";
                        }

                        if (siteid == value.siteId) {
                            if ($scope.assetServiceData[key].surveyType != surveyType && $scope.assetServiceData[key].surveyType != undefined) {
                                if ($scope.assetServiceData[key].surveyType == '-') {
                                    $scope.assetServiceData[key].surveyType = surveyType;
                                    
									$scope.assetServiceData[key].contractorId = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>" + ContractorId + "</a>";
									
									//new code for contractorGroup start
										$scope.assetServiceData[key].contractorGroup = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink1(this)' style='text-decoration: none'>" + ContractorGroup + "</a>";
									//new code contractorGroup end
									
                                    $scope.assetServiceData[key].refKey = refkey;
                                    $scope.assetServiceData[key].siterequestid = siterequestid;
                                    $scope.siterequestIdList.push(siterequestid);
                                } else {
                                    if ($scope.siterequestIdList.indexOf(siterequestid) === -1) {
                                        var newrecord = angular.copy($scope.assetServiceData[key]);
                                        newrecord.surveyType = surveyType;
                                        newrecord.refKey = refkey;
                                        newrecord.contractorId = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>" + ContractorId + "</a>";
										
										//new code for contractorGroup start
											newrecord.contractorGroup = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink1(this)' style='text-decoration: none'>" + ContractorGroup + "</a>";
										//new code contractorGroup end
										
                                        newrecord.siterequestid = siterequestid;
                                        newrecord.customerId = $scope.assetServiceData[key].customerId;
                                        newrecord.siterequestid = siterequestid;
                                        var test = $scope.assetServiceData;
                                        test.push(newrecord);
                                        $scope.assetServiceData = test;
                                        $scope.siterequestIdList.push(siterequestid);
                                    }
                                }

                            } else {

                                if ($scope.assetServiceData[key].surveyType == undefined) {
                                    $scope.assetServiceData[key].surveyType = surveyType;
                                    $scope.assetServiceData[key].contractorId = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>" + ContractorId + "</a>";
									
									//new code for contractorGroup start
										$scope.assetServiceData[key].contractorGroup = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink1(this)' style='text-decoration: none'>" + ContractorGroup + "</a>";
									//new code contractorGroup end
									
                                    $scope.assetServiceData[key].refKey = refkey;
                                    $scope.assetServiceData[key].siterequestid = siterequestid;
                                    console.log('in else');
                                    $scope.siterequestIdList.push(siterequestid);
                                } else {
                                    if ($scope.siterequestIdList.indexOf($scope.assetServiceData[key].siterequestid) === -1) {
                                        var newrecord = angular.copy($scope.assetServiceData[key]);
                                        newrecord.surveyType = surveyType;
                                        newrecord.refKey = refkey;
                                        //        key = key +1;  // 
                                        newrecord.contractorId = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>" + ContractorId + "</a>";
										
										//new code for contractorGroup start
											newrecord.contractorGroup = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink1(this)' style='text-decoration: none'>" + ContractorGroup + "</a>";
										//new code contractorGroup end
										
                                        newrecord.siterequestid = siterequestid;
                                        newrecord.customerId = $scope.assetServiceData[key].customerId;
                                        newrecord.siterequestid = siterequestid;
                                        var test = $scope.assetServiceData;
                                        test.push(newrecord);
                                        $scope.assetServiceData = test;
                                        console.log('in inner if else2' + $scope.assetServiceData[key]);
                                    }
                                }
                            }
                        } else {
                            if (value.refKey == undefined) {
                                $scope.assetServiceData[key].refKey = "-";
                                $scope.assetServiceData[key].surveyType = "-";
                                $scope.assetServiceData[key].contractorId = " <a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>No Contractor</a>";
								
								//new code for contractorGroup start
									$scope.assetServiceData[key].contractorGroup = " <a href='javascript:void(0)' id='" + key + "'onclick='gotoLink1(this)' style='text-decoration: none'>No Contractor Group</a>";
								//new code contractorGroup end
                            }
                        }
                    });
                });
                //$scope.data = $scope.assetServiceData;
            } else {
                angular.forEach($scope.assetServiceData, function(value, key) {
                    if (value.refKey == undefined) {
                        $scope.assetServiceData[key].refKey = "-";
                        $scope.assetServiceData[key].surveyType = "-";
                        $scope.assetServiceData[key].contractorId = " <a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>No Contractor</a>";
                        if ($scope.assetServiceData[key].parent) {
                            if ($scope.assetServiceData[key].parent.split('/')[2] !== 'undefined') {
                                $scope.assetServiceData[key].customerId = value.parent.split('/')[2];
                            } else {
                                $scope.assetServiceData[key].customerId = '';
                            }
                        }
                    }

                });
            }
            $scope.data = $scope.assetServiceData;
            //console.log(JSON.stringify($scope.data));

            console.log('count>' + $scope.assetServiceData.length);
            var ps = document.querySelector('paper-spinner'); //paper spinner
            //ps.setAttribute('active','');
            ps.removeAttribute('active');

        };

        commonServices.getAuthToken().then(
            function(data) {
                $scope.res = data;
                var arr = [];
				commonServices.getSitesFilterValue().then(function(data){
					var filterParamValue = '';					
					$scope.filterParamValue = data;
					console.log("In side getAuthToken function, $scope.filterParamValue :"+$scope.filterParamValue);
                commonServices.getAssetRecords($scope.res, arr, $scope.filterParamValue).then(function(data) {
				    $scope.assetServiceData = data;
                    //console.log($scope.assetServiceData);

                    angular.forEach($scope.assetServiceData, function(value, key) {
                        var city = '';
                        var country = '';
                        var district = '';
                        var poBox = '';
                        var postalCode = '';
                        var region = '';
                        var street = '';
                        var trainStation = '';
                        var lat = '';
                        var lng = '';

                        if (value.siteAddress.city != null) {
                            city = JSON.stringify(value.siteAddress.city) + ",";
                        }
                        if (value.siteAddress.country != null) {
                            country = JSON.stringify(value.siteAddress.country) + ",";
                        }
                        if (value.siteAddress.district != null) {
                            district = JSON.stringify(value.siteAddress.district) + ",";
                        }
                        if (value.siteAddress.poBox != null) {
                            poBox = JSON.stringify(value.siteAddress.poBox) + ",";
                        }
                        if (value.siteAddress.postalCode != null) {
                            postalCode = JSON.stringify(value.siteAddress.postalCode) + ",";
                        }
                        if (value.siteAddress.region != null) {
                            region = JSON.stringify(value.siteAddress.region) + ",";
                        }
                        if (value.siteAddress.street != null) {
                            street = JSON.stringify(value.siteAddress.street) + ",";
                        }
                        if (value.siteAddress.trainStation != null) {
                            trainStation = JSON.stringify(value.siteAddress.trainStation);
                        }
                        if (value.siteLocation.lat != null) {
                            lat = JSON.stringify(value.siteLocation.lat) + ",";
                        }
                        if (value.siteLocation.lng != null) {
                            lng = JSON.stringify(value.siteLocation.lng);
                        }

                        var address = (city + country + district + poBox + postalCode + region + street + trainStation).replace(/\"/g, "");
                        address = address.substring(0, address.length - 1);
                        $scope.assetServiceData[key].siteAddress = (address);
                        $scope.assetServiceData[key].siteLocation = (lat + lng).replace(/\"/g, "");

                    });
                    //console.log($scope.assetServiceData);

                    commonServices.getPostgresdata().then(function(data) {
                        //console.log("after");
                        $scope.postgresdata = data;
                        $scope.compareAssetSite($scope.postgresdata);
                    });
                });
				
				});
            });

        // $scope.dropdown = ["TATA STEEL - Indoor Survey","TATA STEEL - Outdoor Survey"];

        commonServices.getRefPoolData(screenId).then(function(data) {
            $scope.dropdown = JSON.stringify(data.valueList.survey_type);
            //console.log(JSON.stringify(data.valueList.survey_type));
        });


        // function combineSite() {
        // var combine = {};
        // //console.log($scope.postgresdata);
        // //   $.extend(combine, $scope.postgresdata, $scope.assetServiceData);
        // for (var key in $scope.postgresdata) combine[key] = $scope.postgresdata[key];
        // for (var key in $scope.assetServiceData) combine[key] = $scope.assetServiceData[key];
        // //console.log(combine);
        // }

        //PX-model   

        $scope.editcancelForm = function() {
            $("#myModal1").css("visibility", "hidden");
        };

        window.addEventListener('pt-item-confirmed', function(e) {
            $scope.ContractorFlag = true;
            var srcElement2 = e.srcElement;
            var dta = srcElement2.__data__;
            //console.log(dta);
            $scope.prjctIdNeeded = dta.inputValue;

        });

        $scope.editsubmitForm = function() {
            var idFormatted;
            var cvalue = $scope.prjctIdNeeded;

            //alert(cvalue);
            var refid = ($('#refID').val());
            if (cvalue === undefined || refid === '') {
                $("#myModal1").css("visibility", "visible");
            } else {
                // alert('in else');
                $("#myModal1").css("visibility", "hidden");
                angular.forEach($scope.data, function(value, key) {
                    var id = value.contractorId;
                    //alert('sathish'+id);
                    //alert('refid'+refid);
                    var stratIndex = id.indexOf("id=") + 3;
                    var endIndex = id.indexOf("onclick");
                    idFormatted = id.substring(stratIndex, endIndex).replace(/\'/g, "");
                    if (idFormatted == refid) {
                        $scope.data[key].contractorId = "<a href='javascript:void(0)' id='" + key + "'onclick='gotoLink(this)' style='text-decoration: none'>" + cvalue + "</a>";
                        //console.log(JSON.stringify($scope.data[key]));
                        if ($scope.multiTicket.length != 0) {
                            angular.forEach($scope.multiTicket, function(value1, key1) {
                                if (refid == value1.dataIndex) {
                                    $scope.multiTicket[key1].ticketSiteDetailsDto[0].assignedTo = cvalue;
                                }
                            });
                        }
                    }
                });

            }
        };

        //---------------------- For Single  file upload
        function isContractorSurveAssign(a_surveyTypeId, a_contractor, a_row) {

            if ($scope.surveyTypeSelected === '-' || $scope.contractorid === 'No Contractor') {

                var alert1 = document.querySelector('#checkboxMessage');
                alert1.toggle();
                return false;
                //   a_row._selected = true;
                //  document.getElementById("mytable")
            }
            return true;
        }

        $scope.restCheckBox = function() {
            var temp = $scope.data;
            $scope.data = [];
            $timeout(function() {

                $scope.data = temp;

            }, 200);
        }






        $scope.multiTicket = [];
        document.getElementById("mytable").addEventListener("px-row-click", function(e) {


            $scope.returndata = [];
            var clickedRow = e.detail.row;

            //myObj.hasOwnProperty('myKey');
            //                console.log(clickedRow.row.hasOwnProperty('siterequestid'));
            //alert(JSON.stringify(clickedRow._selected));

            if (clickedRow._selected === false) {
                var contractorId;
                //alert(JSON.stringify(e.detail.row.row.contractorId.value));
                var siteId = ''; // Keep this in mind
                var siteRequestId = '';
                var customerId = '';
                if (e.detail.row.row.contractorId.value == 'No Contractor') {
                    contractorId = '';
                } else {
                    var id = e.detail.row.row.contractorId.value;
                    var stratIndex = id.indexOf("'>") + 2;

                    contractorId = id.substring(stratIndex, id.length - 4)
                        //console.log(contractorId);
                }

                /* if ((isNaN(e.detail.row.row.siteId.value))) {
                    siteId = e.detail.row.row.siteId.value;
                } */
                if (clickedRow.row.hasOwnProperty('siteId')) {
                    siteId = e.detail.row.row.siteId.value;
                }
                if (clickedRow.row.hasOwnProperty('customerId')) {
                    customerId = e.detail.row.row.customerId.value;
                }
                if (clickedRow.row.hasOwnProperty('siterequestid')) {
                    siteRequestId = clickedRow.row.siterequestid.value;
                }

                $scope.surveyTypeSelected = e.detail.row.row.surveyType.value;
                $scope.contractorid = contractorId;
                var isContinue = isContractorSurveAssign($scope.surveyTypeSelected, $scope.contractorid, clickedRow); //Function Call
                if (isContinue) {
                    //alert("iNSIDE cont");
                    $scope.ticketData = {
                        'dataIndex': e.detail.row.row.dataIndex,
                        'ticketDescription': 'ABC',
                        'siteId': siteId,
                        'siteRequestId': siteRequestId,
                        'customerId': customerId,
                        'ticketSiteDetailsDto': [{
                            'assignedTo': contractorId,
                            'surveyType': e.detail.row.row.surveyType.value,
                            'sendBackFlag': 'N'
                        }]
                    };

                    $scope.multiTicket.push($scope.ticketData);
                    //console.log(JSON.stringify($scope.ticketData));

                }
                console.log(JSON.stringify($scope.multiTicket));
            }
            if (clickedRow._selected == true) {
                //alert('in true');
                var siteid = e.detail.row.row.siteId.value

                for (var i = 0; i < $scope.multiTicket.length; i++) {
                    var data = $scope.multiTicket[i];
                    if (data.siteId == siteid) {
                        $scope.multiTicket.splice(i, 1);
                    }
                }
            }

        });
        //---------------------- For Multiple  file upload
        document.getElementById("mytable").addEventListener("px-select-all-click", function(e) {
            var allSelectedRows = e.detail;
            //console.log("Select/unselect all", allSelectedRows);
            $scope.multiTicket = [];

            angular.forEach(allSelectedRows, function(value, key) {
                var contractorId;
                var siteId = '';
                var siteRequestId = '';
                var customerId = '';
                if (value.row.contractorId.value == 'No Contractor') {

                    contractorId = '';
                } else {
                    var id = value.row.contractorId.value;
                    var stratIndex = id.indexOf("'>") + 2;

                    contractorId = id.substring(stratIndex, id.length - 4)
                }
                /* if ((isNaN(e.detail.row.row.siteId.value))) {
                    siteId = e.detail.row.row.siteId.value;
                } */
                if (value.row.hasOwnProperty('siterequestid')) {
                    siteRequestId = value.row.siterequestid.value;
                }
                /*  if ((isNaN(e.detail.row.row.siteId.value))) {
                     siteId = e.detail.row.row.siteId.value;
                 } */

                if (value.row.hasOwnProperty('siteId')) {
                    siteId = value.row.siteId.value;
                }

                if (value.row.hasOwnProperty('customerId')) {
                    customerId = value.row.customerId.value;
                }
                $scope.surveyTypeSelected = value.row.surveyType.value;
                $scope.contractorid = contractorId;
                $scope.ticketData = {
                    'dataIndex': e.detail.row.row.dataIndex,
                    'ticketDescription': 'ABC',
                    'siteId': siteId,
                    'siteRequestId': siteRequestId,
                    'customerId': customerId,
                    'ticketSiteDetailsDto': [{
                        'assignedTo': contractorId,
                        'surveyType': value.row.surveyType.value,
                    }]
                };
                $scope.multiTicket.push($scope.ticketData);
                console.log(JSON.stringify($scope.ticketData));

            });
        });



        $scope.saveRequestData = function() {

            console.log($scope.surveyTypeSelected + " - " + $scope.contractorid);
            if (($scope.surveyTypeSelected == '-' || $scope.surveyTypeSelected != '-') && $scope.contractorid == 'No Contractor') {

                var alert1 = document.querySelector('#invalidAlertforBoth');
                alert1.toggle();
            } else {


                $scope.countSelectedRows = 0;
                //alert('Hello');
                for (var i = 0; i < $scope.selectedRows1.length; i++) {
                    if ($scope.selectedRows1[i].row._selected == true) {
                        $scope.countSelectedRows++;
                    }

                }
                if ($scope.countSelectedRows == 0) {
                    var chekboxalert = document.getElementById('ChekBoxalert');
                    chekboxalert.toggle();
                } else {
                    var sbRedirect = document.getElementById('submitAlert');
                    sbRedirect.toggle();
                }
                $scope.selectedRows1 = [];
                console.log('--count--', $scope.countSelectedRows);
            }
        }

        document.getElementById("mytable").addEventListener("px-row-click", function(e) {
            //var allSelectedRows = e.detail;
            //console.log("Select/unselect all", allSelectedRows);
            console.log("----", e.detail)
            var flag = true;
            var tempLength = $scope.selectedRows1.length;
            window.setTimeout(function() {
                if ((e.detail).row._selected == true) { // since the selection is not processed we are checking it with false
                    if (tempLength == 0) {
                        $scope.selectedRows1.push(e.detail);
                        flag = false;
                    } else {
                        for (var j = 0; j < tempLength; j++) {
                            if ((e.detail).row.row.dataIndex == $scope.selectedRows1[j].row.row.dataIndex) {
                                $scope.selectedRows1[j].row._selected = true;
                                flag = false;
                            }
                        }
                    }
                    if (flag == true) {
                        $scope.selectedRows1.push(e.detail);
                    }
                }
            }, 500);


        });



        var myButton = document.getElementById('okRedirect');

        myButton.addEventListener('tap', function(e) {
            // alert("hello----");

            $scope.hidecard = true;
            if ($scope.ContractorFlag) {
                if ($scope.multiTicket.length != 0) {
                    var refid = ($('#refID').val());
                    angular.forEach($scope.multiTicket, function(value, key) {
                        if (value.dataIndex == refid) {

                            $scope.multiTicket[key].ticketSiteDetailsDto.assignedTo = $scope.prjctIdNeeded;
                        }
                    });
                }


            }

            if ($scope.multiTicket.length != 0) {
                var data = $scope.multiTicket;
                //console.log(data);
                console.log(JSON.stringify(data));
                // For Current Testing
                commonServices.saveNewRequest(data).then(
                    function(response) {
                        //alert(JSON.stringify(response.data));                                                                                         
                        $scope.returndata = response.data;
                        $scope.restCheckBox();
                        $scope.$broadcast("ReturnDataCompleted");

                    });
            }

        });




        /* $scope.saveRequestData = function() {
            $scope.hidecard = true;
            if ($scope.ContractorFlag) {
                if ($scope.multiTicket.length != 0) {
                    var refid = ($('#refID').val());
                    angular.forEach($scope.multiTicket, function(value, key) {
                        if (value.dataIndex == refid) {

                            $scope.multiTicket[key].ticketSiteDetailsDto.assignedTo = $scope.prjctIdNeeded;
                        }
                    });
                }


            }

            if ($scope.multiTicket.length != 0) {
                var data = $scope.multiTicket;
                //console.log(data);
                console.log(JSON.stringify(data));
                                                                
                commonServices.saveNewRequest(data).then(
                    function(response) {
                        //alert(JSON.stringify(response.data));                                                                                         
                        $scope.returndata = response.data;
                        $scope.$broadcast("ReturnDataCompleted");

                    });
            }
        } */

        $scope.$on("ReturnDataCompleted", function() {
            $scope.returndata = $scope.returndata;
            $scope.multiTicket = [];
        });

        document.getElementById("mytable").addEventListener("after-save", function(e) {
            var surveyTypenew = e.detail.row.row.surveyType.value;
            var siteid = e.detail.row.row.siteId.value;
            angular.forEach($scope.data, function(value, key) {
                if (value.siteId === siteid) {
                    $scope.data[key].surveyType = surveyTypenew;
                }

            });
            if ($scope.multiTicket.length != 0) {
                angular.forEach($scope.multiTicket, function(value, key) {
                    if (value.siteId === siteid) {
                        $scope.multiTicket[key].ticketSiteDetailsDto[0].surveyType = surveyTypenew;
                    }
                });
            }
		});
		
		document.getElementById("myradio1").addEventListener("change", function(e) {
			if(document.getElementById("myradio1").checked=true){
				document.getElementById("myradio2").checked=false;
			}
			$("#contractorGroupDiv").hide();
			$("#contractorIdDiv").show();
		});
		document.getElementById("myradio2").addEventListener("change", function(e) {
			if(document.getElementById("myradio2").checked=true){
				document.getElementById("myradio1").checked=false;
			}
			$("#contractorIdDiv").hide();
			$("#contractorGroupDiv").show();
		});
		
		// document.querySelector('myradio1').addEventListener("change", function(e) {
			// $("#contractorGroupDiv").hide();
			// $("#contractorIdDiv").show();
		// });
		// document.querySelector('myradio2').addEventListener("change", function(e) {
			// $("#contractorIdDiv").hide();
			// $("#contractorGroupDiv").show();
		// });
		
    }]);
});