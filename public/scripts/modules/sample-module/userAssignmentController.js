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
    controllers.controller('userAssignmentController', ['$state', '$timeout', '$scope', '$rootScope', '$log', 'PredixAssetService', '$http', 'commonServices', function($state, $timeout, $scope, $rootScope,
        $log,
        PredixAssetService, $http, commonServices) {
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

        $("#uploadBar").hide();
        $("#uploadInpro").hide();
        $("#uploadSucc").hide();
        $("#uploadFail").hide();
        //alert($scope.divCtrl.gridOptions.data.length);

        //var stageOrder=['Survey','PM Survey Approval','Design','PM Design Approval','Proposal','Purchase Order','Install Drawing','PM Install Drawing Approval','Installation']
        // $scope.test=[{
        // 'jobId':'89',
        // 'siteName':'walmart',
        // 'siteId':'12',
        // 'survey':'Vaibhav-502627312',
        // 'pmSurveyApproval':'Tejali-502627312',
        // 'design':'pranita-502627312',
        // 'pmDesignApproval':'kiran-502627312',
        // 'proposal':'ankita-502627312',
        // 'purchaseOrder':'rishika-502627312',
        // 'installDrawing':'saheel-502627312',
        // 'pmInstallDrawingApproval':'anjali-502627312',
        // 'installation':'ankita-502627312',
        // 'postAudit':'ram-502627312',
        // 'currentStageName':'pmSurveyAssigned'
        // },
        // {
        // 'jobId':'138',
        // 'siteName':'tata',
        // 'siteId':'13',
        // 'survey':'Aseem-502627312',
        // 'pmSurveyApproval':'Komal-502627312',
        // 'design':'pranita-502627312',
        // 'pmDesignApproval':'kiran-502627312',
        // 'proposal':'komal-502627312',
        // 'purchaseOrder':'rishika-502627312',
        // 'installDraw':'saheel-502627312',
        // 'installDrawPM':'anjali-502627312',
        // 'installation':'ankita-502627312',
        // 'readyForPostAudit':'satyendra-502627312',
        // 'postAudit':'satyendra-502627312',
        // 'currentStageName':'pmSurveyAssigned'
        // }]

        // $scope.test=[
        // {
        // "jobId": "89",
        // "siteName": "walmart",
        // "siteId": "12",
        // "surveyAssigned": "Vaibhav-212470795",
        // "pmSurveyApprovalAssigned": "Tejali-212470795",
        // "design": "pranita-502627312",
        // "pmDesignApproval": "kiran-502627312",
        // "currentStageName": "pmSurveyAssigned"
        // },
        // {
        // "jobId": "138",
        // "siteName": "walmart",
        // "siteId": "12",
        // "installDrawPM": "Tejali-212470795",
        // "pmSurveyApprovalAssigned": "Tejali-212470795",
        // "design": "pranita-502627312",
        // "pmDesignApproval": "kiran-502627312",
        // "currentStageName": "pmSurveyAssigned"
        // }
        // ]

        // $scope.test=[
        // {"currentStageName":"survey",
        // "design":"-",
        // "installDraw":"-",
        // "installDrawPM":"-",
        // "installation":"-",
        // "jobId":"144",
        // "pmDesignApproval":"-",
        // "pmSurveyApproval":"-",
        // "postAudit":"-",
        // "proposal":" Ratul Bhattacharjee-212470795",
        // "purchaseOrder":"-",
        // "readyForPostAudit":"-",
        // "siteId":"TataTester1",
        // "siteName":"-",
        // "survey":"-"}]


        console.log($scope.test)
            // $http.post(adminServiceURL + "/moveToNextStage",requestData).success(function(data,status){  

        // $http.post(commonServices.getadminServiceURL()+"/SubmitAssignmentGrid",$scope.test).success(function(data){

        // })
        // var testObj={'survey':'a','pmSurveyApproval':'a'}
        // for(var i=0;i<$scope.test.length;i++){
        // for(var testKey in $scope.test[i]){
        // if(testKey in testObj)
        // {
        // $scope.test[i][testKey]=$scope.test[i][testKey].split("-")[1];
        // }
        // }
        // }
        console.log($scope.test)
        var keyValue = {
            "Job Id": "jobId",
            "Site Id": "siteId",
            "Surveyor": "survey",
            "Survey Approver": "pmSurveyApproval",
            "Designer": "design",
            "Design Approver": "pmDesignApproval",
            "Proposal": "proposal",
            "Purchase Order": "purchaseOrder",
            "Installer": "installDraw",
            "Install Approver": "installDrawPM",
            "Installation": "installation",
            "Ready for Post Audit": "readyForPostAudit",
            "Post Audit": "postAudit",
            "Current Stage Name": "currentStageName"
        }

        var arrayOrder = {
            "jobId": "Job Id",
            "siteId": "Site Id",
            "survey": "Surveyor",
            "pmSurveyApproval": "Survey Approver",
            "design": "Designer",
            "pmDesignApproval": "Design Approver",
            "proposal": "Proposal",
            "purchaseOrder": "Purchase Order",
            "installDraw": "Installer",
            "installDrawPM": "Install Approver",
            "installation": "Installation",
            "readyForPostAudit": "Ready for Post Audit",
            "postAudit": "Post Audit",
            "currentStageName": "Current Stage Name"
        }

        $http.get(commonServices.getadminServiceURL() + '/admin/contractorassignment/data').success(function(data) {
            for (var i = 0; i < data.length; i++) {
                for (var key in arrayOrder) {
                    if (data[i][key] == "") {
                        data[i][key] = "-";
                    }
                    if (!(data[i].hasOwnProperty(key))) {
                        //console.log(key);
                        data[i][key] = '-';
                    }
                }
            }
            console.log()
            $scope.userAssignmentTable = data;
            //console.log($scope.userAssignmentTable)
        });


        var arr = [];
        console.log(arr)
        var inputFile = document.querySelector('#fileinput')
        inputFile.onclick = function() {
            this.value = null;
        };
        inputFile.onchange = function() {
            //alert(this.value);

            setTimeout(function() {

                //console.log("............",window.localStorage.getItem("returnedArray"))
                var returnedArray = window.localStorage.getItem("returnedArray")
                var jsonarray = CSV2JSON(returnedArray)
                console.log(jsonarray);
                var parsedJson = JSON.parse(jsonarray);


                //console.log('parsedJson----->',parsedJson);
                parsedJson.splice(parsedJson.length - 1, 1);

                var tempArray = [],
                    tempObject = {};

                for (var i = 0; i < parsedJson.length; i++) {
                    var tempObj = parsedJson[i];
                    for (var key in tempObj) {
                        var origKey = keyValue[key];
                        console.log('origKey----', origKey);
                        tempObject[origKey] = tempObj[key];

                        //parsedJson[i][origKey] = parsedJson[i][key];
                    }
                    tempArray.push(tempObject);
                    tempObject = {};
                }
                parsedJson = tempArray;
                tempArray = [];
                console.log('latest parsedJson---', parsedJson, tempArray);

                //console.log('parsedJson----->',parsedJson);
                var errorMsg = "";
                for (var i = 0; i < $scope.userAssignmentTable.length; i++) {
                    for (var j = 0; j < parsedJson.length; j++) {
                        if ($scope.userAssignmentTable[i].jobId == parsedJson[j].jobId) {
                            var stageName = parsedJson[j].currentStageName;
                            //console.log(stageName)
                            var breakForEach = false
                            for (var key in arrayOrder) {

                                if (key != stageName && !breakForEach) {
                                    {
                                        //	console.log(key)
                                        if ($scope.userAssignmentTable[i][key] != parsedJson[j][key]) {
                                            errorFlag = true
                                                //alert(key+ ' '+parsedJson[j]['jobId'])
                                            errorMsg = errorMsg + "Job Id = <b>" + parsedJson[j]['jobId'] + " </b>Field = <b>" + key + "</b><br>"
                                        }
                                    }
                                } else {
                                    breakForEach = true;
                                }
                            }
                        }
                    }
                }

                //console.log($scope.divCtrl.gridOptions.data)


                // var uploadedExcel=$scope.divCtrl.gridOptions.data;
                // for(var i=0;i<$scope.userAssignmentTable.length;i++){
                // for(var j=0;j<uploadedExcel.length;j++){
                // if($scope.userAssignmentTable[i].jobId==uploadedExcel[j].jobId){

                // var stageName=$scope.userAssignmentTable[i].currentStageName
                // var breakForEach=false;
                // angular.forEach(uploadedExcel[j], function(value, key) {
                // //console.log(key)
                // if(key!=stageName && !breakForEach){
                // console.log($scope.userAssignmentTable[i][key]+' : '+value)
                // if($scope.userAssignmentTable[i][key]!=value)
                // {
                // errorFlag=true
                // //alert(key+ ' '+uploadedExcel[j].jobId)
                // errorMsg=errorMsg+"Job Id = "+uploadedExcel[j].jobId+" Field = "+key +"<br>"
                // }
                // }
                // else{
                // breakForEach=true;
                // }
                // });
                // }
                // }

                // }
                // angular.forEach($scope.userAssignmentTable, function(value, key) {
                // console.log(value)
                // angular.forEach(value, function(value1, key1) {
                // console.log(key1)
                // });
                // });

                if (errorFlag) {
                    //alert($scope.divCtrl.gridOptions.data.length);
                    //$scope.divCtrl.gridOptions.data.length="";
                    //alert($scope.divCtrl.gridOptions.data.length);
                    str = "You have updated the 'Name' for the following completed job <br>" + errorMsg;
                    //	alert('in')
                    $(".resetUpload").hide();
                } else {
                    $scope.jsonToUpload = parsedJson
                        //console.log(JSON.stringify(parsedJson))
                    var pxtable2 = document.querySelector("#viewUploadedStages");
                    pxtable2.setAttribute('table-data', JSON.stringify(parsedJson))
                    $("#viewAssignedStages").hide();
                    $("#viewUploadedStages").show().fadeIn('fast')
                    var errorFlag = false;
                    var errorMsg = "";
                    var str = "";
                    str = "";
                    $(".chooseFileBtn").hide();
                    $(".resetUpload").show();
                }
                $('#err').css({}).html(str)
                    //console.log($scope.errorMsg)

            }, 1000);
        };



        //Number of rows selected------------------------------
        $scope.selectedRows1 = [];
        document.getElementById("viewAssignedStages").addEventListener("px-row-click", function(e) {
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
                console.log($scope.selectedRows1)
            }, 500);

        });




        // $scope.upload= function(){
        // alert('in')

        // setTimeout(function()
        // {
        // var errorFlag=false;
        // var errorMsg="";
        // var str="";
        // console.log($scope.divCtrl.gridOptions.data)
        // var uploadedExcel=$scope.divCtrl.gridOptions.data;
        // for(var i=0;i<$scope.userAssignmentTable.length;i++){
        // for(var j=0;j<uploadedExcel.length;j++){
        // if($scope.userAssignmentTable[i].jobId==uploadedExcel[j].jobId){

        // var stageName=$scope.userAssignmentTable[i].currentStageName
        // var breakForEach=false;
        // angular.forEach(uploadedExcel[j], function(value, key) {
        // console.log(key)
        // if(key!=stageName && !breakForEach){
        // console.log($scope.userAssignmentTable[i][key]+' : '+value)
        // if($scope.userAssignmentTable[i][key]!=value)
        // {
        // errorFlag=true
        // alert(key+ ' '+uploadedExcel[j].jobId)
        // errorMsg=errorMsg+"Job Id = "+uploadedExcel[j].jobId+" Field = "+key +"<br>"
        // }
        // }
        // else{
        // breakForEach=true;
        // }
        // });
        // }
        // }

        // }
        // angular.forEach($scope.userAssignmentTable, function(value, key) {
        // console.log(value)
        // angular.forEach(value, function(value1, key1) {
        // console.log(key1)
        // });
        // });

        // if(errorFlag)
        // {
        // str="U have updated the 'assigned to' for the following completed job "+errorMsg;
        // alert('in')
        // }
        // else{
        // alert('else')
        // str="";
        // var pxtable2=document.querySelector("#viewUploadedStages");
        // pxtable2.setAttribute('table-data',JSON.stringify(uploadedExcel))
        // $("#viewAssignedStages").hide();
        // $("#viewUploadedStages").show().fadeIn('fast')
        // $(".chooseFileBtn").hide();

        // }
        // $('#err').css({}).html(str)
        // console.log($scope.errorMsg)

        // }, 8000); 
        // }	
        $scope.selectedRows1 = []
        $scope.exportExcel = function() {
            $scope.selectedRows = [];

            console.log($scope.selectedRows1)
            if ($scope.selectedRows1.length > 0) {
                for (var i = 0; i < $scope.selectedRows1.length; i++) {
                    if ($scope.selectedRows1[i].row._selected == true) {
                        console.log($scope.selectedRows1[i])
                        var ary = {};
                        angular.forEach($scope.selectedRows1[i].row.row, function(key, value) {

                            if (key.value != undefined) {
                                ary[value] = key.value;
                            }
                        });
                        $scope.selectedRows.push(ary);
                    }

                }

                JSONToCSVConvertor($scope.selectedRows, 'AssignmentExport', true);
            } else {
                JSONToCSVConvertor($scope.userAssignmentTable, 'AssignmentExport', true);
            }
        }

        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            console.log('in export function', JSONData)
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            //CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrayOrder) {
                    //Now convert each value to string and comma-seprated
                    row += arrayOrder[index] + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrayOrder) {
                    //console.log(JSON.stringify(arrData[i]));
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);
                //// alert(row);
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
        //divCtrl.reset = reset;
        divCtrl.gridOptions = {
            enableFiltering: true
                //enablePaging: true
        };

        $(".reset").click(function() {
            reset();
            $(".resetUpload").hide();
            $("#viewUploadedStages").hide()
            $(".msg").show();
            $(".chooseFileBtn").show();
            $("#excelExport").show();
            $(".afterUpload").hide()
            $("#viewAssignedStages").show();
        })

        /*  $scope.getTableHeight = function() {
              var rowHeight = 30; // your row height
              var headerHeight = 30; // your header height
              return {
                 height: ($scope.divCtrl.gridOptions.data.length * rowHeight + headerHeight) + "px"
              };
           }; */

        var excelJSON = [];
        var excelSiteList = [];
        // $scope.resetClick=function(){
        // $("#excelExport").show();
        // $(".afterUpload").hide()
        // $("#viewAssignedStages").show();

        // }
        function reset() {
            divCtrl.gridOptions.data = [];
            divCtrl.gridOptions.columnDefs = [];

        }

        $scope.submitNew = function() {
            console.log($scope.jsonToUpload);
            $http.post(commonServices.getadminServiceURL() + "/SubmitAssignmentGrid", $scope.jsonToUpload).success(function(data) {
                console.log(data)
                var uploadAlert = document.querySelector('#uploadAlert')

                uploadAlert.toggle();
                //alert('Success +',data)
            })
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

        // function validateAndSaveRef(siteIdList) {

        // var siteList = [];
        // var siteIdList = siteIdList;
        // // console.log('PostgresqlList' + JSON.stringify(siteList));

        // angular.forEach(excelJSON, function(item) {
        // angular.forEach(siteIdList, function(validId) {

        // if (validId == item.StoreNumber) {
        // var SurveyType = '';
        // var ContractorName = '';
        // var ReferenceKey = '';
        // var CustomerId = '';
        // console.log('validId' + validId);
        // console.log('validId' + item.ReferenceKey);
        // if (item.SurveyType !== undefined) {
        // SurveyType = item.SurveyType.trim();
        // }
        // if (item.ContractorName !== undefined) {
        // ContractorName = item.ContractorName.trim();
        // }
        // if (item.ReferenceKey !== undefined) {
        // ReferenceKey = item.ReferenceKey.trim();
        // }
        // if (item.CustomerId !== undefined) {
        // CustomerId = item.CustomerId.trim();
        // }

        // excelSiteList.push(item.StoreNumber);
        // siteList.push({
        // 'siteId': item.StoreNumber,
        // 'surveyType': SurveyType,
        // 'contractorName': ContractorName,
        // 'refKey': ReferenceKey,
        // 'customerId': CustomerId
        // });
        // }
        // });
        // });

        // var request = {
        // 'source': 'Web',
        // 'sites': siteList
        // };
        // //window.location = "/siteUpload";
        // //  console.log(JSON.stringify(request));
        // // Create New Sites Request in Data Model

        // commonServices.saveExcelDataNnPostgresql(request).then(
        // function(response) {
        // //alert(JSON.stringify(response));
        // reset();
        // if (response.data.status == 'SUCCESS') {
        // $("#uploadInpro").hide();
        // $("#uploadSucc").show();
        // } else {
        // $("#uploadFail").show();
        // $("#uploadSucc").hide();
        // $("#uploadInpro").hide();
        // }
        // });
        // }







        // function to convert uploaded data to json----------------------------

        function CSV2JSON(csv) {
            //alert('in')
            var array = CSVToArray(csv);
            var objArray = [];
            for (var i = 1; i < array.length; i++) {
                objArray[i - 1] = {};
                for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                    var key = array[0][k];
                    objArray[i - 1][key] = array[i][k]
                }
            }

            var json = JSON.stringify(objArray);
            var str = json.replace(/},/g, "},\r\n");
            console.log(str)
            return str;
        }

        function CSVToArray(strData, strDelimiter) {
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");
            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp((
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [
                []
            ];
            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;
            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {
                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[1];
                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);
                }
                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[2]) {
                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    var strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"), "\"");
                } else {
                    // We found a non-quoted value.
                    var strMatchedValue = arrMatches[3];
                }
                // Now that we have our value string, let's add
                // it to the data array.
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            // Return the parsed data.
            return (arrData);
        }

    }]);



});