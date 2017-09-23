define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('solardashboardCntrl', ['$state', '$scope', '$timeout', '$http', '$compile', '$log', 'PredixAssetService',
        'PredixViewService', 'commonServices',
        'reportServices', 'dashboardService', '$filter',
        function ($state, $scope, $timeout, $http, $compile, $log, PredixAssetService, PredixViewService, commonServices, reportServices, dashboardService, $filter) {

            $scope.table = true;
            $scope.lightingsDashBoard = false;
            // $scope.solarDashBoard = false;

            $scope.SolarShow = function () {
                // $scope.table = true;
                //If DIV is visible it will be hidden and vice versa.
                // $scope.lightingsDashBoard = $scope.lightingsDashBoard ? false : true;
                // $scope.solarDashBoard = $scope.lightingsDashBoard ? false : true;
                $scope.lightingsDashBoard = true;
                $scope.solarDashBoard = false;
                //   $scope.table = $scope.lightingsDashBoard ? true: false;
                $scope.table = false;
                $scope.transportDashBoard = false;
            }

            $scope.table = true;
            //$scope.lightingsDashBoard = false;
            $scope.solarDashBoard = false;

            $scope.SolarShowData = function () {
                //$scope.table = true;
                //If DIV is visible it will be hidden and vice versa.
                // $scope.lightingsDashBoard = $scope.lightingsDashBoard ? false : true;
                // $scope.solarDashBoard = $scope.lightingsDashBoard ? false : true;
                $scope.lightingsDashBoard = false;
                $scope.solarDashBoard = true;
                // $scope.table = $scope.solarDashBoard ? true : false;
                $scope.transportDashBoard = false;
                $scope.table = false;
            }

            //212601178
            //Adding functionality for Transportation Button 
            $scope.TransportShow = function () {
                //hiding other BU dashbaords
                $scope.lightingsDashBoard = false;
                $scope.solarDashBoard = false;
                $scope.table = false;
                $scope.transportDashBoard = true;
                //authorization call
                commonServices.getAuthToken().then(function (token) {
                    $scope.res = token;
                    //asset service call
                    commonServices.getDevicedata($scope.res).then(function (data) {
                        $scope.assetDeviceData = data;
                        var data = $scope.assetDeviceData;
                        var c = 0;
                        $scope.trays = [];
                        $scope.modules = [];
                        $scope.bricks = [];
                        $scope.cells = [];
                        //function to parse all the data and create hierarchy
                        for (var i = 0; i < data.length; i++) {
                            if (data[i]['component_type'] == 'tray') {
                                $scope.trays.push(data[i]);
                            }
                            if (data[i]['component_type'] == 'module') {
                                $scope.modules.push(data[i]);
                            }
                            if (data[i]['component_type'] == 'brick') {
                                // console.log($scope.bricks);
                                $scope.bricks.push(data[i]);
                            }
                            if (data[i]['component_type'] == 'cell') {
                                $scope.cells.push(data[i]);
                            }
                        }
                        //assigning parents to cells
                        for (var i = 0; i < $scope.bricks.length; i++) {
                            var x = [];
                            for (var j = 0; j < $scope.cells.length; j++) {
                                if ($scope.cells[j] == null) {
                                    continue;
                                }
                                if ($scope.cells[j]['parent'] == $scope.bricks[i]['barcode']) {
                                    x.push($scope.cells[j]);
                                }
                            }
                            $scope.bricks[i].cells = x;
                        }
                        //assigning parents to bricks
                        for (var i = 0; i < $scope.modules.length; i++) {
                            var x = [];
                            for (var j = 0; j < $scope.bricks.length; j++) {
                                if ($scope.bricks[j] == null) {
                                    continue;
                                }
                                if ($scope.bricks[j]['parent'] == $scope.modules[i]['barcode']) {
                                    x.push($scope.bricks[j]);
                                }
                            }
                            $scope.modules[i].bricks = x;
                        }
                        //assigning parents to modules
                        for (var i = 0; i < $scope.trays.length; i++) {
                            var x = [];
                            for (var j = 0; j < $scope.modules.length; j++) {
                                if ($scope.modules[j] == null) {
                                    continue;
                                }
                                if ($scope.modules[j]['parent'] == $scope.trays[i]['barcode']) {
                                    x.push($scope.modules[j]);
                                }
                            }
                            $scope.trays[i].modules = x;
                        }
                        var no_of_trays = $scope.trays.length;
                        var no_of_modules = $scope.modules.length;
                        var no_of_bricks = $scope.bricks.length;
                        var no_of_cells = $scope.cells.length;
                        $scope.no_of_trays = no_of_trays;
                        $scope.no_of_modules = no_of_modules;
                        $scope.no_of_bricks = no_of_bricks;
                        $scope.no_of_cells = no_of_cells;
                        $scope.title = "Trays";
                        // this.setView();
                        // console.log(this.trays)
                    });
                });

            }

            //212601178
            //function to implement click of header
            $scope.buttonClick = function (buttonId) {
                var property = ''
                var element = document.getElementById("table")
                //changing colour based on selection
                var buttons = ["tray_button", "module_button", "brick_button", "cell_button"]
                for (i = 0; i < 4; i++) {
                    if (buttonId == buttons[i]) {
                        property = document.getElementById(buttons[i])
                        property.style.color = "orange"
                    } else {
                        property = document.getElementById(buttons[i])
                        property.style.color = "white"
                    }
                }
                //changing table details based on button clicked
                if (buttonId == 'tray_button') {
                    element.items = $scope.trays
                    $scope.title = "Trays"
                }
                if (buttonId == 'module_button') {
                    element.items = $scope.modules
                    $scope.title = "Modules"
                }
                if (buttonId == 'brick_button') {
                    element.items = $scope.bricks
                    $scope.title = "Bricks"
                }
                if (buttonId == 'cell_button') {
                    element.items = $scope.cells
                    $scope.title = "Cells"
                }
                var elm
                elm = document.getElementsByClassName("tray-collapse")
                // console.log(elm[0])
                for (var i = 0; i < elm.length; i++) {
                    if (elm[i] != null) {
                        // console.log("HI")
                        elm[i].hide()
                    }
                }
                elm = document.getElementsByClassName("module-collapse")
                // console.log(elm[0])
                for (var i = 0; i < elm.length; i++) {
                    if (elm[i] != null) {
                        // console.log("HI")
                        elm[i].hide()
                    }
                }
                elm = document.getElementsByClassName("brick-collapse")
                // console.log(elm[0])
                for (var i = 0; i < elm.length; i++) {
                    if (elm[i] != null) {
                        // console.log("HI")
                        elm[i].hide()
                    }
                }
                elm = document.getElementsByClassName("cell-collapse")
                // console.log(elm[0])
                for (var i = 0; i < elm.length; i++) {
                    if (elm[i] != null) {
                        // console.log("HI")
                        elm[i].hide()
                    }
                }
                var classlist = ["asset-visualization-cell-image", "asset-visualization-brick-image", "asset-visualization-module-image"]
                for (var i = 0; i < 3; i++) {
                    var children = document.getElementsByClassName(classlist[i]);
                    for (var j = 0; j < children.length; j++) {
                        console.log(children[j])
                        children[j].style.filter = "opacity(40%)"
                    }
                }
            }

            //212601178
            //function for downloading data into csv
            $scope.downloadCSV = function () {
                if ($scope.title == "Trays") {
                    var json = $scope.trays;
                    var csvname = "Trays.csv";
                }
                if ($scope.title == "Modules") {
                    var json = $scope.modules;
                    var csvname = "Modules.csv";
                }
                if ($scope.title == "Bricks") {
                    var json = $scope.bricks;
                    var csvname = "Bricks.csv";
                }
                if ($scope.title == "Cells") {
                    var json = $scope.cells;
                    var csvname = "Cells.csv";
                }
                var csv = "data:text/csv;charset=utf-8,URI,Status,Site,Parent URI,Created By,Created At,Last Modified By,Last Modified At\n";
                for (var index in json) {
                    var row = json[index]
                    var rowCSV = ''
                    rowCSV += row["uri"] + ',' + row["status"] + ',' + row["station_id"] + ',' + row["parent"] + ',' + row["created_by"] + ',' + row["created_date_time"] + ',' + row["modified_by"] + ',' + row["modified_date_time"]
                    csv += rowCSV + "\n"
                }
                var encodedUri = encodeURI(csv)
                var link = document.createElement("a")
                link.setAttribute('href', encodedUri)
                link.setAttribute("download", csvname)
                link.click()
            }

            //212601278
            //double-clicking of table does nothing
            $scope._deselecting = function (e) {
                e.preventDefault();
            }

            function customerOverview() {
                commonServices.getCustomerIdsAsStringBySSO().then(function(data) {
                    console.log("data", data);
                    $scope.custIds = data;
                    $scope.custOverviewData = "";
                    console.log("$scope.custIds : "+$scope.custIds);
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/solardashboard/getCustomerOverview?customerIds='+$scope.custIds).success(function(response){
                 console.log(response);
                    $scope.custOverviewData = response;
                   console.log("$scope.custOverviewData : "+$scope.custOverviewData);
                    });

                });
            }
            customerOverview();


            function getTopFiveCustomers() {
                $scope.topFiveCustomers = "";
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/dashboard/getTopFiveCustomers').success(function(response){
                 console.log("topFiveCustomers",response);
                    $scope.topFiveCustomers = response;
                   console.log("topFiveCustomersData:" + $scope.topFiveCustomers);
                    });
            }
            getTopFiveCustomers();

             function getBusinesstable() {
                $scope.businesstable = "";
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/dashboard/getBusinesstable').success(function(response){
                 console.log("businesstable",response);
                    $scope.businesstable = response;
                   console.log("businesstableData:" + $scope.businesstable);
                    });
            }
            getBusinesstable();

       $scope.siteListData1 = [
        {

            'CusterName':'Customer 1',
            'Business':'Solar',
            'CompltedSites':'19',
            'SitesInProgress':'29',
            'TotalSites':'48'
        },{

            'CusterName':'Customer 2',
            'Business':'Solar',
            'CompltedSites':'12',
            'SitesInProgress':'22',
            'TotalSites':'34'
        },{

            'CusterName':'Customer 3',
            'Business':'Solar',
            'CompltedSites':'11',
            'SitesInProgress':'16',
            'TotalSites':'27'
        },{

            'CusterName':'Customer 4',
            'Business':'Solar',
            'CompltedSites':'8',
            'SitesInProgress':'15',
            'TotalSites':'23'
        },{

            'CusterName':'Customer 5',
            'Business':'Solar',
            'CompltedSites':'4',
            'SitesInProgress':'10',
            'TotalSites':'14'
        }];

            $scope.siteListData = [
        {
            'Business':'Solar',
            'CompletedSites': '23',
            'Sitesinprogress':'18',
            'TotalSites':'41'
        }];

        $scope.addNew = function(personalDetail){
            $scope.personalDetails.push({
                'fname': "",
                'lname': "",
                'email': "",
            });
        };

          /*   $scope.chartConfig1 = {
                options:{
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'SURVEY DATA FILL RATE'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true,
                                crop: false,
                                overflow: 'none'
                            }
                        },
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        $('#cat').val(this.category);
                                        $("#cat").change();
                                        $("#siteTable").css("display","inline-block");
                                        $scope.catext = this.category;
                                    }
                                }
                            }
                        }
                    },
                },


            series: [{
                colorByPoint: true,
                data: [{
                    name: 'Complete',
                    y: 12,
                   // drilldown: 'Microsoft Internet Explorer'
                }, {
                    name: 'Partial',
                    y: 12,
                   // drilldown: 'Chrome'
                }, {
                    name: 'Yet to be filled',
                    y: 32,
                   // drilldown: 'Safari'
                }]
            }],


             }

             var SiteData = [
{"Category" : "Complete",
"SiteID" : 0,
"SiteName": "SiteName1",
"JobID" : 0,
"Status" : "Status1"},
{"Category" : "Complete",
"SiteID" : 1,
"SiteName": "SiteName2",
"JobID" : 1,
"Status" : "Status2"},
{"Category" : "Complete",
"SiteID" : 2,
"SiteName": "SiteName3",
"JobID" : 2,
"Status" : "Status3"},
{"Category" : "Partial",
"SiteID" : 3,
"SiteName": "SiteName1",
"JobID" : 3,
"Status" : "Status4"},
{"Category" : "Partial",
"SiteID" : 4,
"SiteName": "SiteName5",
"JobID" : 4,
"Status" : "Status5"},
{"Category" : "Partial",
"SiteID" : 5,
"SiteName": "SiteName6",
"JobID" : 5,
"Status" : "Status6"}
];
$scope.SiteData = SiteData;*/

            var surveyfillData = {};
            var surveyFillCountArr = [];

            function getDataForSurveyfill() {
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/solardashboard/getSurvayDataFillRate?customerId=""').success(function(response){
                 console.log(response);


                 for (var key in response) {


                             surveyfillData = {
                                 'name': key,
                                  'y': response[key]

                             }

                         surveyFillCountArr.push(surveyfillData);
                       }
                console.log("in func",surveyFillCountArr);
                   }).error(function(err) {
                    console.log(err);
                });
            }

            getDataForSurveyfill();
            console.log("above",surveyFillCountArr)
            $scope.chartSeriesForSurveyFill = [{
                name: 'Site',
                colorByPoint: true,
                data: surveyFillCountArr
            }];
            $scope.chartConfigForForSurveyfill = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            pointWidth:30,
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            },
                            point: {
                                events: {
                                    click: function() {
                                        $('#cat').val(this.category);
                                        $("#cat").change();
                                        $("#siteTable").css("display","inline-block");
                                        $scope.catext = this.category;
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return this.key + ':' + this.y;
                        }

                    },
                },
                series: $scope.chartSeriesForSurveyFill,
                title: {
                    text: 'Survey Data Fill Rate',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: ''
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }

            var surveydataFill = {};
            var surveyDataCountArr = [];

            function getDataForFillsurvey() {
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/solardashboard/getSolarTemplatesCount').success(function(response){
                 console.log(response);


                 for (var key in response) {
                     surveydataFill = {
                         'name': key,
                          'y': response[key]

                     }

                 surveyDataCountArr.push(surveydataFill);
                 }
                console.log("in func",surveyDataCountArr);
                 }).error(function(err) {
                    console.log(err);
                });
            }

            getDataForFillsurvey();
            console.log("above",surveyDataCountArr)
            $scope.chartSeriesForDataSurveyFill = [{
                name: 'Site',
                colorByPoint: true,
                data: surveyDataCountArr
            }];

            $scope.chartConfigForDataSurveyfill = {
                options: {
                    chart: {
                        type: 'bar'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            pointWidth:30,
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            },
                            point: {
                                events: {
                                    click: function() {
                                        $('#cat').val(this.category);
                                        $("#cat").change();
                                        $("#siteTable").css("display","inline-block");
                                        $scope.fillSurvey = this.category;
                                    }
                                }
                            }
                        }
                    },


                    tooltip: {
                        formatter: function() {
                            return this.key + ':' + this.y;
                        }

                    },
                },
                series: $scope.chartSeriesForDataSurveyFill,


                title: {
                    text: '',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: ''
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }

        /*
            $scope.chartConfig2 = {
                options:{
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'SURVEY DATA FILL RATE'
                    },
                    xAxis: {
                        categories: ['Rooftop', 'Garage Top', 'Carport-Ground', 'Landfil/Brownfield', 'Groundmount']
                    },
                    yAxis: {

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true,
                                crop: false,
                                overflow: 'none'
                            }
                        },
                        series: {
                            cursor: 'bar',
                            point: {
                                events: {
                                    click: function () {
                                        $('#cat').val(this.category);
                                        $("#cat").change();
                                        $("#siteTable").css("display","inline-block");
                                        $scope.catexts = this.category;
                                    }
                                }
                            }
                        }
                    },
                },


            series: [{
                colorByPoint: true,
                data: [{
                    name: 'Complete',
                    y: 12,
                   // drilldown: 'Microsoft Internet Explorer'
                }, {
                    name: 'Partial',
                    y: 12,
                   // drilldown: 'Chrome'
                }, {
                    name: 'Yet to be filled',
                    y: 32,
                   // drilldown: 'Safari'
                },, {
                    name: 'Yet to be filled',
                    y: 32,
                   // drilldown: 'Safari'
                },, {
                    name: 'Yet to be filled',
                    y: 32,
                   // drilldown: 'Safari'
                },]
            }],

             }

            var SiteDatas = [
{"Category" : "Rooftop",
"SiteID" : 0,
"SiteName": "SiteName1",
"JobID" : 0,
"Status" : "Status1"},
{"Category" : "Garage Top",
"SiteID" : 1,
"SiteName": "SiteName2",
"JobID" : 1,
"Status" : "Status2"},
{"Category" : "Carport-Ground",
"SiteID" : 2,
"SiteName": "SiteName3",
"JobID" : 2,
"Status" : "Status3"},
{"Category" : "Landfil/Brownfield",
"SiteID" : 3,
"SiteName": "SiteName1",
"JobID" : 3,
"Status" : "Status4"},
{"Category" : "Groundmount",
"SiteID" : 4,
"SiteName": "SiteName5",
"JobID" : 4,
"Status" : "Status5"},
{"Category" : "Groundmount",
"SiteID" : 5,
"SiteName": "SiteName6",
"JobID" : 5,
"Status" : "Status6"}
];
$scope.SiteDatas = SiteDatas;

            */

            $scope.getAvgSurveyTimePerSiteAcrossCustomer = [];
            $scope.customerData = [];
            var chart1DataArr = [];
            var chart2DataArr = [];
            var chart2DataArrTemp = [];
            var chart3DataArr = [];
            var userSSOArr = [];
            var userSurveyCount = [];
            $scope.config = [];
            $scope.indoorCount = 0;
            $scope.outdoorCount = 0;
            //$scope.completedsurvey =[];
            //$scope.siteListData = [];
            /*Intializing the hide/show for each div container*/
            $scope.overview = true;
            $scope.siteoverview = true;
            $scope.summary = false;
            var stageSeq = {};
            //$scope.stagesChart;
            //console.log($('.focusChange'))
            // const ssoPrivilegeData = {
            //     contractorId: ssoObj
            // };

            // Custmer Overiew Table


            function customerOverviewLighting() {
                $scope.custOverviewDataLighting = "";
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/lightingdashboard/getCustomerOverview').success(function(response){
                 console.log("vvvvvv",response);
                    $scope.custOverviewDataLighting = response;
                   console.log("custOverviewDataLighting:" + $scope.custOverviewDataLighting);

                    var projectData11 = {
                                            "details11": []
                                        }
                        var i =0;
                        for (i = 0; i < $scope.custOverviewDataLighting.length; i++){
                            if($scope.custOverviewDataLighting[i].customerId!== undefined)
                            {
                                var customerId= $scope.custOverviewDataLighting[i].customerId;
                            }
                            else var customerId='';

                            if($scope.custOverviewDataLighting[i].customerName!== undefined)
                            {
                                var customerName= $scope.custOverviewDataLighting[i].customerName;
                            }
                            else var customerName='';

                            if($scope.custOverviewDataLighting[i].completedSites!== undefined)
                            {
                                var completedSites= $scope.custOverviewDataLighting[i].completedSites;
                            }
                            else var completedSites='';

                            if($scope.custOverviewDataLighting[i].inProgressSites!== undefined)
                            {
                                var inProgressSites= $scope.custOverviewDataLighting[i].inProgressSites;
                            }
                            else var inProgressSites='';

                            if($scope.custOverviewDataLighting[i].totalSites!== undefined)
                            {
                                var totalSites= $scope.custOverviewDataLighting[i].totalSites;
                            }
                            else var totalSites='';

                            if($scope.custOverviewDataLighting[i].surveyedSites!== undefined)
                            {
                                var surveyedSites= $scope.custOverviewDataLighting[i].surveyedSites;
                            }
                            else var surveyedSites='';

                            if($scope.custOverviewDataLighting[i].installedSites!== undefined)
                            {
                                var installedSites= $scope.custOverviewDataLighting[i].installedSites;
                            }
                            else var installedSites='';

                            if($scope.custOverviewDataLighting[i].postAuditedSites!== undefined)
                            {
                                var postAuditedSites= $scope.custOverviewDataLighting[i].postAuditedSites;
                            }
                            else var postAuditedSites='';

                            var nodeObj11 =
                            {
                                customerId: "<a href='javascript:void(0)' onclick='drilldown(this)' style='text-decoration: none'>"+customerId+"</a>",
                                customerName: customerName,
                                completedSites: completedSites,
                                inProgressSites: inProgressSites,
                                totalSites: totalSites,
                                surveyedSites: surveyedSites,                                                                                     installedSites: installedSites,
                                postAuditedSites: postAuditedSites
                            }
                             projectData11.details11.push(nodeObj11);
                        }
                    $scope.projectDetails11 = projectData11.details11;
                    });

            }
            customerOverviewLighting();

            //commonServices.setPrivilegeAccess(ssoPrivilegeData);
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

            /*Function call for first level drilldown*/
            $scope.hideShowFun = function() {
                var selectedCustomerId = $('#selectedCustomerId').val();
                $scope.selectedCustomerId = selectedCustomerId || '';
                console.log("checkkk" + $('#selectedCustomerId').val());
                $scope.dataperStage = [];

                stageSeq = {
                    "survey": "Survey",
                    "pm_Survey_Approval": "Survey Approval",
                    "design": "Design",
                    "pm_Design_Approval": "Design Approval",
                    "proposal": "Proposal",
                    "purchase_Order": "Purchase Order",
                    "install_Drawing": "Install Drawing",
                    "pm_Install_Drawing": "Install Drawing Approval",
                    "installation": "Install",
                    "ready_For_PostAudit": "Post Audit",
                    "post_Audit": "Completed"
                }
                reportServices.getJobCountperStage(selectedCustomerId).then(function(data) {

                    angular.forEach(stageSeq, function(value1, key1) {
                        // console.log(key1," - ",value1)
                        angular.forEach(data, function(value, key) {
                            if (key1 == key) {
                                $scope.dataperStage.push({
                                    "name": value1,
                                    "y": value
                                });
                                $scope.$broadcast('charts')
                            }
                        });
                    });
                });
                $scope.selectedCustomerId = selectedCustomerId;
                $scope.siteListData = [];
                if ($scope.selectedCustomerId != null && $scope.selectedCustomerId != undefined && $scope.selectedCustomerId != "") {
                    angular.forEach($scope.customerData, function(value2, key2) {
                        if (selectedCustomerId == value2.id) {
                            //alert(selectedCustomerId);
                            $scope.selectedCustomerId = selectedCustomerId;
                            $scope.selectedCustomerName = value2.customerName;
                            $scope.selectedCusNoOfsurvey = value2.noOfSurveys;
                            $scope.selectedCusNoOfFixtures = value2.noOfFixtures;
                            //console.log($scope.selectedCusNoOfsurvey);
                            $scope.selectedCusActualStartDate = value2.actualStartDate.substring(0, 10);
                            $scope.selectedCusActualEndDate = value2.actualEndDate.substring(0, 10);
                            // $scope.selectedCusAvgTime = value2.avgTime;

                            $scope.overview = false;
                            $scope.summary = true;
                            //console.log('before call');
                            loadSiteDataList();

                        }
                    });
                }

            };
            /*Function call for second level drilldown*/
            $scope.hideShowFun1 = function() {

                console.log($('#selectedSiteId').val());
                var selectedSiteId = $('#selectedSiteId').val();
                getJobsPerSite(selectedSiteId); // get the jobs for the selected site.
                $scope.selectedSiteId = selectedSiteId;
                //netSurveyData(selectedSiteId);
                surveyByUserData(selectedSiteId);
                indoorOutdoorData(selectedSiteId); //IndoorOutdoor
                $scope.overview = false;
                $scope.siteoverview = false;

                // To display the default section of the tab..
                $scope.showTabs = true; // To display the tabs..
                $scope.showSiteOverview = true; // This is the default section.
                $scope.showAssetDetails = false; // Remaining tabs content should be invisible
                $scope.showJobDetails = false;
                $scope.progressReport = false;
                // To set the Tab selected by default..
                $('#siteOverview1').addClass('activeTab').siblings().removeClass('activeTab');
                $scope.summary = true;
                commonServices.getAuthToken().then(function(config) {
                    $scope.config = config;
                });
                $scope.$broadcast('loadDataforInstallGraph')
                $scope.$broadcast('loadDataforPAGraph')
            };

            $scope.$on('loadDataforPAGraph', function() {
                $scope.chartDataPA = [];
                commonServices.getRefPoolData('110').then(function(config) {
                    console.log(config)
                    var updateStatus = []
                    var updateStatus = config.valueList.status;
                    console.log(updateStatus)
                    $scope.updateStatus = updateStatus;
                    getPAGraph();
                    $scope.$broadcast('postAuditedAsset')
                });
            });


            $scope.$on('loadDataforInstallGraph', function() {
                $scope.chartData = []
                commonServices.getAuthToken().then(function(config) {
                    $scope.config = config;
                    var skuSpec = []
                    $scope.chartData = [];

                    $http.get(commonServices.getAssetURL() + '/device?filter=site=/site/' + $scope.selectedSiteId + ':status=Install', $scope.config).success(function(data) {
                        var len = 0;
                        if (data.length != 0) {
                            skuSpec.push(data[0].specification)
                        }
                        for (var i = 0; i < data.length; i++) {
                            if ((jQuery.inArray(data[i].specification, skuSpec)) == -1) {
                                skuSpec.push(data[i].specification)
                            }
                        }
                        $scope.skuSpec = skuSpec;
                        $scope.skuSpecLength = skuSpec.length;
                        getInstalledGraph();
                        console.log($scope.chartData)


                    });
                });
            });



            var counter = 0;

            function getInstalledGraph() {
                $http.get(commonServices.getAssetURL() + '/device?filter=site=/site/' + $scope.selectedSiteId + ':status=Install:specification=' + $scope.skuSpec[counter], $scope.config).success(function(skuData) {
                    if (skuData.length != 0) {
                        //var j=0;
                        //								console.log(skuData)
                        var tempName = skuData[0].specification
                        var name = tempName.substring(5, tempName.length)
                        $scope.chartData.push({
                            "name": name,
                            "y": skuData.length
                        })
                    }
                    if (counter < $scope.skuSpecLength) {
                        counter++;
                        getInstalledGraph();

                    } else {
                        counter = 0;
                    }

                    $scope.$broadcast('installedAsset')


                    if (skuData.length == 0) {
                        $scope.$broadcast('installedAsset')
                    }
                });
            }


            var counterPA = 0;

            function getPAGraph() {
                console.log($scope.updateStatus[counterPA])
                $http.get(commonServices.getAssetURL() + '/device?filter=site=/site/' + $scope.selectedSiteId + ':updateStatus=' + $scope.updateStatus[counterPA], $scope.config).success(function(data) {
                    //var j=0;
                    //								console.log(skuData)
                    console.log(data);
                    if (data.length != 0) {
                        $scope.chartDataPA.push({
                            "name": data[0].updateStatus,
                            "y": data.length
                        })
                    }
                    if (counterPA < $scope.updateStatus.length) {
                        counterPA++;
                        getPAGraph();

                    } else {
                        counterPA = 0;
                    }

                });
            }
            /*Function call to close and back to summary*/
            $scope.summaryCall = function() {
                $scope.showDataCountTable = false;
                $scope.overview = true;
                $scope.siteoverview = true;
                $scope.summary = false;
                //$scope.siteListData = [];

            };
            $scope.getcustomerData = loadcustomerInfo();
            $scope.getAvgSurveyTimePerSiteAcrossCustomer = getAvgSurveyTimePerSiteAcrossCustomer();
            //$scope.getAvgSurveyTimePerCustomer = getAvgSurveyTimePerCustomer();

            /* Sathish - customer data table load */

            //$scope.customerData = $scope.getcustomerData();
            var customerArr = [];
            $scope.customerData = [];

             //******************OLD customer name from asset************
            // function loadcustomerInfo() {
            //     var customerInfoURL = commonServices.getAssetURL() + "/customer?filter=";
            //     reportServices.getCustomerMetrics().then(function(data) {
            //         $scope.postData = data;
            //         var length = $scope.postData.length;
            //         angular.forEach($scope.postData, function(value, key) {
            //             customerInfoURL += 'customerId=' + value.customerid + '|';
            //             if (length == 1) {
            //                 customerInfoURL += 'customerId=' + value.customerid;
            //             }
            //             length--;
            //         });
            //         customerInfoURL += '&fields=customerId,customerName1';

            //         getcustomerData(customerInfoURL);
            //     });
            // }

            //*******************New customer name from
             function loadcustomerInfo() {
                var customerInfoURL=""; //= commonServices.getAssetURL() + "/customer?filter=";
                reportServices.getCustomerMetrics().then(function(data) {
                    $scope.postData = data;
                    var length = $scope.postData.length;
                    angular.forEach($scope.postData, function(value, key) {
                      customerInfoURL += value.customerid + ',';
                        if (length == 1) {
                            customerInfoURL += value.customerid;
                        }
                        length--;
                    });
                    getCountForAll(customerInfoURL);
                    //getcustomerData(customerInfoURL);
                });
            }

            function getCountForAll(customerInfoURL){
                reportServices.getCountForAll().then(function(data) {
                    console.log("getCount for all",data);
                    $scope.installationCount = data;
                    console.log("installtion",$scope.installationCount);
                     getcustomerData(customerInfoURL);
                })
            }

            function getcustomerData(customerInfoURL) {
                var tempcust = []
                $scope.customerData = [];
                var custTempData = [];
                //  commented 29-06 whle checking calling it outside******************************
                // reportServices.getCountForAll().then(function(data) {
                //         console.log(data)
                //         $scope.installationCount = data;
                //     })
                    /*reportServices.getPostAuditCountForAll().then(function(data) {
                    	console.log(data)
                    	$scope.postAuditCount=data;
                    })*/
                // commonServices.getAuthToken().then(function(data) {
                //     $scope.config = data;
                     console.log('selectedCustomerId', $scope.selectedCustomerId);

                    reportServices.getCustomerNameFromPostgres(customerInfoURL).then(function(data) {
                        customerArr = data;
                        //console.log(JSON.stringify(customerArr));
                        //console.log(JSON.stringify($scope.postData));
                        console.log($scope.postData)
                        angular.forEach(customerArr, function(value1, key1) {

                            angular.forEach($scope.postData, function(value2, key2) {

                                if (value2.customerid == value1.customerId) {

                                    var installationCount = "";
                                    var customerId = "";
                                    var customerName = "";
                                    var noOfSurveys = "";
                                    var actualStartDate = "";
                                    var actualEndDate = "";
                                    var avgTime = "";
                                    var postauditCount = "";

                                    if (value1.customerName != null && value1.customerName != undefined) {
                                        customerName = value1.customerName;
                                    }
                                    if (value2.noofsurveys != null && value2.noofsurveys != undefined) {
                                        noOfSurveys = value2.noofsurveys;
                                    }
                                    if (value2.actualstartdate != null && value2.actualstartdate != undefined) {
                                        actualStartDate = value2.actualstartdate;
                                    }
                                    if (value2.actualenddate != null && value2.actualenddate != undefined) {
                                        actualEndDate = value2.actualenddate;
                                    }
                                    if (value2.customeravgtime != null && value2.customeravgtime != undefined) {
                                        avgTime = value2.customeravgtime.toFixed(2);
                                    }
                                    angular.forEach($scope.installationCount, function(value3, key3) {
                                        if (value2.customerid == value3.customerid && value3.customerid != null) {
                                            installationCount = value3.installationcount;
                                            postauditCount = value3.postauditcount;
                                            // alert(installationCount);
                                        } else {
                                            // alert("2---"+installationCount);
                                            installationCount = 0;
                                            postauditCount = 0
                                        }
                                        if (value3.customerid != null) {
                                            var data = {
                                                    "id": value1.customerId,
                                                    "customerId": "<a href='javascript:void(0)' id='" + key2 + "'onclick='drilldown(this)' style='text-decoration: none'>" + value1.customerId + "</a>",
                                                    "customerName": customerName,
                                                    "noOfSurveys": noOfSurveys,
                                                    "actualStartDate": actualStartDate,
                                                    "actualEndDate": actualEndDate,
                                                    "avgTime": avgTime,
                                                    "noOfFixtures": value2.noOfFixtures,
                                                    "installationCount": installationCount,
                                                    "postauditCount": postauditCount
                                                        //
                                                }
                                                //Pushing data for 1st Page Graph 1
                                            chart1DataArr.push({
                                                "name": data.customerName,
                                                "y": data.noOfFixtures
                                            });

                                            //$scope.customerData.push(data);
                                            //custTempData.push(data);
                                            let pushFlag = true;
                                            if (custTempData.length > 0) {
                                                for (var cnt = 0; cnt < custTempData.length; cnt++) {
                                                    if (custTempData[cnt].id == value1.customerId) {
                                                        pushFlag = false;
                                                    }
                                                }
                                            } else {
                                                pushFlag = false;
                                                custTempData.push(data);
                                            }
                                            if (pushFlag) {

                                                custTempData.push(data);
                                            }
                                        }
                                    });
                                }

                            });
                        });

                        // attach to scope
                        $scope.customerData = custTempData;
                        custTempData = [];
                    });
                //});
            };




            function getAvgSurveyTimePerSiteAcrossCustomer() {
                reportServices.getAvgSurveyTimePerSiteAcrossCustomer().then(function(data) {
                    $scope.getAvgSurveyTimePerSiteAcrossCustomer = data;
                    //console.log(JSON.stringify(data));
                    angular.forEach($scope.getAvgSurveyTimePerSiteAcrossCustomer, function(value, key) {
                        /* chart2DataArr.push({
                            "siteId": value.siteid,
                            "y": value.timetaken,
                            "count": value.noofsurveys
                        }); */
                        chart2DataArr.push({
                            "siteId": value.siteid,
                            "y": value.noOfFixtures,
                            "count": value.noofsurveys,
                            "fixtures": value.noOfFixtures
                        });
                        // console.log(JSON.stringify(chart2DataArr));
                    });
                    loadSiteInfoFromAsset();
                });
            }

            function loadSiteInfoFromAsset() {
                var siteInfoURL = commonServices.getAssetURL() + "/site?filter=";
                var length = chart2DataArr.length;
                angular.forEach(chart2DataArr, function(value, key) {
                    //console.log(value);
                    siteInfoURL += 'siteId=' + value.siteId + '|';
                    if (length == 1) {
                        siteInfoURL += 'siteId=' + value.siteId;
                    }
                    length--;
                });
                siteInfoURL += '&fields=siteId,siteName';
                mergeSiteData(siteInfoURL);
            }

            function mergeSiteData(siteInfoURL) {
                //console.log(siteInfoURL);
                var siteDateRes = [];
                commonServices.getAuthToken().then(function(data) {
                    $scope.config = data;
                    commonServices.getSiteDataForPM(siteInfoURL, $scope.config).then(function(data) {
                        siteDateRes = data;
                        angular.forEach(chart2DataArr, function(value2, key2) {
                            angular.forEach(siteDateRes, function(value1, key1) {
                                if (value2.siteId == value1.siteId) {
                                    value2.name = value1.siteName;
                                    //                                    console.log((value2));
                                    chart2DataArrTemp.push(value2);
                                }
                            });
                        });
                    });
                });
            }

            function getAvgSurveyTimePerCustomer() {
                // reportServices.getAvgSurveyTimePerCustomer().then(function(data) {
                // $scope.getAvgSurveyTimePerCustomer = data;
                //console.log(JSON.stringify(data));
                angular.forEach($scope.customerData, function(value, key) {
                    chart1DataArr.push({
                        "name": value.customerName,
                        "y": value.noOfFixtures
                    });
                });
            }

            function netSurveyData(siteId) {
                $scope.avgSurveyTimeForSite = "";
                $scope.idealTimeForSite = "";
                reportServices.getAvgSurveyTimeForSite(siteId).then(function(data) {
                    //console.log('>>>>>'+JSON.stringify(data));
                    if (data != null && data != undefined && data.length > 0) {
                        var time = (data[0].averageSurveyTime) / (1000 * 60);
                        $scope.avgSurveyTimeForSite = time.toFixed(2);
                    }
                    /*  reportServices.getIdealTimeForSite(siteId).then(function(data) {
                if(data !=null && data !=undefined){
				$scope.idealTimeForSite = data;
				}
      		});	 */
                });
            }


            function surveyByUserData(siteId) {
                $scope.noOfSurveyByUser = "";

                reportServices.getNoOfSurveyByUserForSite(siteId).then(function(data) {
                    userSurveyCount = [];
                    $scope.noOfSurveyByUserForSite = data;
                    angular.forEach($scope.noOfSurveyByUserForSite, function(value, key) {

                        if (value.user != null && value.user != "" && value.user != undefined) {
                            //console.log(JSON.stringify($scope.noOfSurveyByUserForSite));
                            userSSOArr.push(value.user);
                            if (value.surveyCount != null && value.surveyCount != "" && value.surveyCount != undefined) {
                                userSurveyCount.push(value.surveyCount);
                            }
                        }
                        //console.log(userSSOArr);
                        //console.log(userSurveyCount);
                        $scope.chartSeries1[0].data = userSurveyCount;
                        console.log('$scope.chartSeries1--', $scope.chartSeries1);
                        $scope.chartConfig5.series = $scope.chartSeries1;

                    });
                });
            }

            function indoorOutdoorData(siteId) { //IndoorOutdoor
                $scope.indoorOutdoorArr = [];
                reportServices.getIndoorOutdoorMetrics(siteId).then(function(data) {
                    var key0 = Object.keys(data)[0];
                    var key1 = Object.keys(data)[1];
                    var value0 = data[key0];
                    var value1 = data[key1];
                    $scope.indoorCount = value0;
                    $scope.outdoorCount = value1;
                    $scope.$broadcast("indoorOutdoorChart");
                });
            }

            $scope.showThisSection = function(a_event) {
                var currentId = a_event.target.id;
                $scope.showSiteOverview = false;
                $scope.showAssetDetails = false;
                $scope.showJobDetails = false;
                $scope.progressReport = false;
                //$('#'+currentId).addClass('activeTab');
                $('#' + a_event.target.parentElement.id).addClass('activeTab').siblings().removeClass('activeTab');
                switch (currentId) {
                    case 'siteOverview':
                        $scope.showSiteOverview = true;
                        break;
                    case 'assetDetails':
                        $scope.showAssetDetails = true;
                        break;
                    case 'jobDetails':
                        $scope.showJobDetails = true;
                        break;
                    case 'progressReport':
                        $scope.progressReport = true;
                        break;
                }
            }


            // function loadSiteDataList() {

            //     var dynamicURL = commonServices.getAssetURL() + "/site?filter=";

            //     reportServices.getDataFromPostgres("'" + $scope.selectedCustomerId + "'").then(function(data) {
            //         //console.log('>>>Postgres' + $scope.selectedCustomerId + JSON.stringify(data));
            //         var postgresData = data;
            //         var length = postgresData.length;
            //         angular.forEach(postgresData, function(value, key) {
            //             var siteId = value.siteid;
            //             dynamicURL += 'siteId=' + siteId + '|';
            //             if (length == 1) {
            //                 dynamicURL += 'siteId=' + siteId;
            //                 dynamicURL += '&fields=siteName,siteId';
            //                 //console.log(dynamicURL);
            //                 loadSiteName(dynamicURL, data);
            //             }
            //             length--;
            //         });

            //     });

            // }

             function loadSiteDataList() {

                var dynamicURL = commonServices.getAssetURL() + "/site?filter=";

                reportServices.getDataFromPostgres($scope.selectedCustomerId).then(function(data) {
                    //console.log('>>>Postgres' + $scope.selectedCustomerId + JSON.stringify(data));
                    var postgresData = data;
                    var length = postgresData.length;
                    angular.forEach(postgresData, function(value, key) {
                        var siteId = value.siteid;
                        dynamicURL += 'siteId=' + siteId + '|';
                        if (length == 1) {
                            dynamicURL += 'siteId=' + siteId;
                            dynamicURL += '&fields=siteName,siteId';
                            //console.log(dynamicURL);
                            loadSiteName(dynamicURL, data);
                        }
                        length--;
                    });

                });

            }

            function loadSiteName(dynamicURL, arr) {
                // $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/getLatestJob',{
                // params:{customerId: $scope.selectedCustomerId}
                // }) .success(function(response) {
                // $scope.stage_obj=response;
                // });

                dashboardService.getSitedetilsData($scope.selectedCustomerId).then(function(data) {
                    $scope.stage_obj = data[0].data;
                    $scope.installcountforcustomer = data[1].data;
                    //$scope.postauditcountofcustomer = data[2].data;
                });
                commonServices.getAuthToken().then(function(data) {
                    dashboardService.getEstimatedInstallDate($scope.selectedCustomerId).then(function(estDateRes) {
                        commonServices.getSiteDataForPM(dynamicURL, data).then(function(dataNew) {
                            commonServices.getRefkeyDashboard().then(function(refKeyData) {
                                $scope.dataForRefKey = refKeyData.data;
                                angular.forEach(dataNew, function(value2, key2) {
                                    var dataNew = {};
                                    angular.forEach(arr, function(value1, key) {
                                        //console.log('$scope.stage_obj--------',$scope.stage_obj)

                                        angular.forEach($scope.stage_obj, function(value5, key5) {
                                            // console.log($scope.stage_obj[key5].stage_name +' - '+ $scope.stage_obj[key5])
                                            if ($scope.stage_obj[key5].stage_name == 'Post Audit') {
                                                $scope.stage_obj[key5].stage_name = 'Completed';
                                            }
                                        })
                                        angular.forEach($scope.stage_obj, function(value4, key4) {

                                            if (value1.siteid == value2.siteId) {

                                                if (value4.site_id == value2.siteId)

                                                {
                                                    //console.log('satzx' + value1.siteid);
                                                    var siteId = value2.siteId;
                                                    var siteName = "";
                                                    var noOfSurveys = "";
                                                    var actualStartDate = "";
                                                    var actualEndDate = "";
                                                    var avgTime = "";
                                                    var stageName = "";
                                                    var currentJob = "";
                                                    var postauditcountcustomer = getpostauditcountcust(value1.siteid);
                                                    var installcountcustomer = getinstallcountcust(value1.siteid);
                                                    if (value2.siteName != null && value2.siteName != undefined) {
                                                        siteName = value2.siteName;
                                                    }
                                                    if (value1.noofsurveys != null && value1.noofsurveys != undefined) {
                                                        noOfSurveys = value1.noofsurveys;
                                                    }
                                                    if (value1.actualstartdate != null && value1.actualstartdate != undefined) {
                                                        actualStartDate = value1.actualstartdate;
                                                    }
                                                    if (value1.actualenddate != null && value1.actualenddate != undefined) {
                                                        actualEndDate = value1.actualenddate;
                                                    }
                                                    if (value1.customeravgtime != null && value1.customeravgtime != undefined) {
                                                        avgTime = value1.customeravgtime.toFixed(2);
                                                    }
                                                    if (value4.stage_name != null && value4.stage_name != undefined) {
                                                        stageName = value4.stage_name;
                                                    }
                                                    if (value4.ticket_id != null && value4.ticket_id != undefined) {
                                                        currentJob = value4.ticket_id;
                                                    }
                                                    dataNew = {
                                                        "id": siteId,
                                                        "siteId": "<a href='javascript:void(0)' id='" + key + "'onclick='drilldownSite(this)' style='text-decoration: none'>" + siteId + "</a>",
                                                        "siteName": siteName,
                                                        "noOfSurveys": noOfSurveys,
                                                        "actualStartDate": actualStartDate,
                                                        "actualEndDate": actualEndDate,
                                                        "avgTime": avgTime,
                                                        "noOfFixtures": value1.nooffixtures,
                                                        "stageName": stageName,
                                                        "currentJob": currentJob,
                                                        "postauditcount": postauditcountcustomer,
                                                        "installcount": installcountcustomer,
                                                        "refKey": (value4.ref_key || ''),//getRefKey(siteId),
                                                        "progress": "<div style='margin-left: 19px;height: 30px;width: 45%; border-radius: 108%;background:" + value4.colorcode + "'> &nbsp;</div>"
                                                    }

                                                    var isJobPresent = false;
                                                    for (var i = 0; i < estDateRes.length; i++) {
                                                        if (estDateRes[i].ticketid == currentJob) {
                                                            dataNew['estimatedInsDate'] = estDateRes[i].estimatedinstalldate;
                                                            isJobPresent = true;
                                                        }
                                                    }
                                                    if (!isJobPresent) {
                                                        dataNew['estimatedInsDate'] = '-';
                                                    }

                                                    //$scope.siteListData.push(dataNew);
                                                    // $scope.totalnoofsites = $scope.siteListData.length;
                                                    // console.log("---Sitelist for the customer---" + /* JSON.stringify($scope.siteListData) */ $scope.siteListData.length);
                                                }
                                            }

                                        });
                                    });
                                    $scope.siteListData.push(dataNew);
                                    $scope.totalnoofsites = $scope.siteListData.length;
                                });

                            }).catch(function(errRefKey) {
                                console.error("errRefKey", errRefKey);
                            });
                        });

                    });
                });
            }

            function getRefKey(siteId) {
                var returnValue = '-';
                for (var indx = 0; indx < $scope.dataForRefKey.length; indx++) {
                    let eachItemRef = $scope.dataForRefKey[indx];
                    if (eachItemRef.siteId == siteId) {
                        returnValue = eachItemRef.refKey;
                    }
                };

                return returnValue;
            }
            function getinstallcountcust(siteId) {

                var returnValue = 0;
                var totalinstallationcount = 0;
                for (var index = 0; index < $scope.installcountforcustomer.length; index++) {
                    totalinstallationcount = totalinstallationcount + $scope.installcountforcustomer[index].installationcount;
                    if (siteId == $scope.installcountforcustomer[index].siteid) {
                        returnValue = $scope.installcountforcustomer[index].installationcount;
                        return returnValue;
                    }
                }
                $scope.totalinstallationcountofcust = totalinstallationcount;
                return returnValue;
            }
            function getpostauditcountcust(siteId) {
                var returnValue = 0;
                var totalpostaudit = 0;
                for (var index = 0; index < $scope.installcountforcustomer.length; index++) {
                    totalpostaudit = totalpostaudit + $scope.installcountforcustomer[index].postauditcount;
                    if (siteId == $scope.installcountforcustomer[index].siteid) {
                        returnValue = $scope.installcountforcustomer[index].postauditcount;
                        return returnValue;
                    }
                }
                $scope.totalpostauditcountofcust = totalpostaudit;
                return returnValue;
            }

            /*chartconfig 11 - Avg Installation time per customer starts*/

            $scope.chartSeries = [{

                colorByPoint: true,
                data: chart1DataArr
                    /* [{
                                    name: 'Tata Steel',
                                    y: 553200
                                }, {
                                    name: 'Walmart',
                                    y: 653200
                                }, {
                                    name: 'Paypal',
                                    y: 753200
                                }, {
                                    name: 'ebay',
                                    y: 853200
                                }, {
                                    name: 'Yahoo',
                                    y: 953200
                                }] */
            }];

            console.log($scope.chartSeries);
            // var chartSeries = [];
            // chartSeries = $scope.chartSeries[0].data;
            // var a = [];
            // console.log(chartSeries.length);
            // for (var i = 0; i < $scope.chartSeries[0].data.length; i++) {
            //     for (var j = 0; j < a.length; j++) {
            //         if (chartSeries[i].name == a[j].name) {
            //             console.log('k');
            //         }
            //     }
            // }
            // console.log(chartSeries);
            $scope.chartConfig11 = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    /* var time = this.y;
                                                           console.log("--------this.y----",time);
                                    var hours1 = parseInt(time / 3600000);
                                                           console.log("--------this.hour1----",hours1);
                                    var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                                                           console.log("--------this.y----",mins1);
                                    return hours1 + 'h :' + mins1 + 'm'; */

                                    var time = this.y;
                                    //console.log("--------this.y----",time);
                                    //var hours1 = parseInt(time / 60);
                                    //console.log("--------this.hour1----",hours1);
                                    //var mins1 = parseInt(parseInt(time % 60));
                                    //console.log("--------this.y----",mins1);
                                    return time;

                                }
                            }
                        }
                    },

                    tooltip: {
                        formatter: function() {
                            var time = this.y;
                            /*  console.log("--------this.y----", time);
                             var hours1 = parseInt(time / 60);
                             console.log("--------this.hour1----", hours1);
                             var mins1 = parseInt((parseInt(time % 60)));
                             console.log("--------this.y----", mins1); */
                            return this.key + '<br>Fixture Count - <b>' + time + '</b>';

                        }

                    },
                },
                series: $scope.chartSeries,

                title: {
                    text: 'Fixtures Count Per Customer',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: 'Customers'
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'No of Fixtures'
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            //var hours1 = parseInt(time / 60);
                            //var mins1 = parseInt((parseInt(time % 60)));
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }
            $scope.reflow = function() {
                $scope.$broadcast('highchartsng.reflow');
            };
            /*chartconfig 11 - Avg Installation time per customer ends*/


            /*chartconfig 9 - Avg Installation time per site across customer starts*/
            //console.log(JSON.stringify(dataArr));
            $scope.chartSeries = [{
                name: 'Site',
                colorByPoint: true,
                data: chart2DataArrTemp

                // dataLabels: {
                // enabled: true,
                // rotation: -90,
                // color: '#FFFFFF',
                // align: 'right',
                // formatter: function() {
                // var time = this.y;
                // var hours1 = parseInt(time / 3600000);
                // var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                // return hours1 + 'h :' + mins1 + 'm';

                // },
                // y: 10, // 10 pixels down from the top
                // style: {
                // fontSize: '10px',
                // fontFamily: 'Verdana, sans-serif'
                // }
                // }
            }];

           $scope.chartConfig9 = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            }
                        }
                    },

                    tooltip: {
                        formatter: function() {
                            return this.key + '<br>Survey Count - <b>' + this.point.count + '<br>No. of fixtures - <b>' + this.point.fixtures;
                        }
                    },
                },
                series: $scope.chartSeries,

                title: {
                    text: 'No of Fixture For Top 3 Sites across Customer',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: 'Sites'
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'No of Fixtures'
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }
            console.log($scope.chartSeries);
            var completedSites = {};
            var completedSitesCountArr = [];
            function getDataForcompletedSites() {
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/lightingdashboard/getCompletedSitesAvgDays').success(function(response){
                 console.log("xxxxxxxxxx", response);
                 for (var key in response) {
                             completedSites = {
                                 'name': key,
                                  'y': response[key]
                             }
                         completedSitesCountArr.push(completedSites);
                 }
                console.log("in func",completedSitesCountArr);
                 }).error(function(err) {
                    console.log(err);
                });
            }

            getDataForcompletedSites();
            console.log("abovePC",completedSitesCountArr)
            $scope.chartSeriesForcompletedSites = [{
                name: 'Site',
                colorByPoint: true,
                data: completedSitesCountArr
            }];

            $scope.chartConfigForCompletedSites = {
                options: {
                    chart: {
                        type: 'bar'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            pointWidth:30,
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            },
                            point: {
//                                events: {
//                                    click: function() {
//                                        $('#cat').val(this.category);
//                                        $("#cat").change();
//                                        $("#siteTable").css("display","inline-block");
//                                        $scope.fillSurvey = this.category;
//                                    }
//                                }
                            }
                        }
                    },


                    tooltip: {
                        formatter: function() {
                            return this.key + ':' + this.y;
                        }
                    },
                },
                series: $scope.chartSeriesForcompletedSites,

                title: {
                    text: 'Completed sites',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                subtitle: {
                    text: 'Avg no of days taken in each stage',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: ''
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }


            // Completed Sites

//             $scope.chartConfigForCompletedSites = {
//                options:{
//                    chart: {
//                        type: 'bar'
//                    },
//                    title: {
//                        text: 'Completed Sites'
//                    },
//                    subtitle: {
//                        text: 'Avg no of days taken in each stage'
//                    },
//                    xAxis: {
//                        categories: ['Survey', 'Design', 'Proposal', 'Install', 'Post Audit']
//                    },
//                    yAxis: {
//
//                    },
//                    legend: {
//                        enabled: false
//                    },
//                    plotOptions: {
//                        column: {
//                            dataLabels: {
//                                enabled: true,
//                                crop: false,
//                                overflow: 'none'
//                            }
//                        },
//                        series: {
//                            cursor: 'bar',
//                            point: {
//                                events: {
//                                    click: function () {
//                                        $('#cat').val(this.category);
//                                        $("#cat").change();
//                                        $("#siteTable").css("display","inline-block");
//                                        $scope.catexts = this.category;
//                                    }
//                                }
//                            }
//                        }
//                    },
//                },
//
//
//
//            series: [{
//                colorByPoint: true,
//                data: [{
//                    name: 'Survey',
//                    y: 30,
//                   // drilldown: 'Microsoft Internet Explorer'
//                }, {
//                    name: 'Design',
//                    y: 5,
//                   // drilldown: 'Chrome'
//                }, {
//                    name: 'Proposal',
//                    y: 5,
//                   // drilldown: 'Safari'
//                },, {
//                    name: 'Install',
//                    y: 20,
//                   // drilldown: 'Safari'
//                },, {
//                    name: 'Post Audit',
//                    y: 15,
//                   // drilldown: 'Safari'
//                },]
//            }],
//
//             }
//
//            var SiteDatas = [
//{"Category" : "Rooftop",
//"SiteID" : 0,
//"SiteName": "SiteName1",
//"JobID" : 0,
//"Status" : "Status1"},
//{"Category" : "Garage Top",
//"SiteID" : 1,
//"SiteName": "SiteName2",
//"JobID" : 1,
//"Status" : "Status2"},
//{"Category" : "Carport-Ground",
//"SiteID" : 2,
//"SiteName": "SiteName3",
//"JobID" : 2,
//"Status" : "Status3"},
//{"Category" : "Landfil/Brownfield",
//"SiteID" : 3,
//"SiteName": "SiteName1",
//"JobID" : 3,
//"Status" : "Status4"},
//{"Category" : "Groundmount",
//"SiteID" : 4,
//"SiteName": "SiteName5",
//"JobID" : 4,
//"Status" : "Status5"},
//{"Category" : "Groundmount",
//"SiteID" : 5,
//"SiteName": "SiteName6",
//"JobID" : 5,
//"Status" : "Status6"}
//];
//$scope.SiteDatas = SiteDatas;


               var inProgressSites = {};
            var inProgressSitesCountArr = [];
            function getDataForInProgressSites() {
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/report/lightingdashboard/getInProgressSitesInEachStage').success(function(response){
                 console.log(response);
                 for (var key in response) {
                             inProgressSites = {
                                 'name': key,
                                  'y': response[key]
                             }
                         inProgressSitesCountArr.push(inProgressSites);
                 }
                console.log("in func",inProgressSitesCountArr);
                 }).error(function(err) {
                    console.log(err);
                });
            }

            getDataForInProgressSites();
            console.log("above",inProgressSitesCountArr)
            $scope.chartSeriesForInProgressSites = [{
                name: 'Site',
                colorByPoint: true,
                data: inProgressSitesCountArr
            }];


            $scope.chartConfigForInProgressSites = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            pointWidth:30,
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            },
                            point: {
                                events: {
                                    click: function() {
                                        $('#cat').val(this.category);
                                        $("#cat").change();
                                        $("#siteTable").css("display","inline-block");
                                        $scope.catext = this.category;
                                    }
                                }
                            }
                        }
                    },

                    tooltip: {
                        formatter: function() {
                            return this.key + ':' + this.y;
                        }

                    },
                },
                series: $scope.chartSeriesForInProgressSites,

                title: {
                    text: 'In Progress sites',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                subtitle: {
                    text: 'No of sites in each stage',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: ''
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }

            var deadlineData = {};
            var deadLineCountArr = [];


            function getDataForDeadline() {
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/deadlineForSites').success(function(response) {
                    console.log(response);
                    var deadline = {
                        metDeadlineCount: 'Met deadline Count',
                        missedDeadlineCount: 'Missed deadline Count'
                    }

                    for (var key in response) {
                        for (var key1 in deadline) {
                            console.log(key, key1, response[key], deadline[key1]);
                            if (key == key1) {
                                deadlineData = {
                                    'name': deadline[key1],
                                    'y': response[key]
                                }
                                deadLineCountArr.push(deadlineData);
                            }
                        }
                    }

                    console.log(deadLineCountArr);
                }).error(function(err) {
                    console.log(err);
                });
            }


            getDataForDeadline();

            $scope.chartSeriesForDeadLine = [{
                name: 'Site',
                colorByPoint: true,
                data: deadLineCountArr
            }];


            $scope.chartConfigForDeadline = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            pointWidth:30,
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            },
                            point: {
                                events: {
                                    click: function() {

                                    }
                                }
                            }
                        }
                    },


                    tooltip: {
                        formatter: function() {
                            return this.key + ':' + this.y;
                        }

                    },
                },
                series: $scope.chartSeriesForDeadLine,


                title: {
                    text: 'Sites by Deadline',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: ''
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }

/*
            var siteCount = {};
            var siteCountArr = [];

            function getDataForDiffPhases() {
                $http.get('https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/siteCountForAllStage').success(function(response) {

                    console.log(response);
                    for (var i = 0; i < response.length; i++) {
                        siteCount = {
                            'name': response[i].stage,
                            'y': response[i].siteCount
                        }

                        siteCountArr.push(siteCount);
                    }

                    console.log(siteCountArr);

                }).error(function(error) {
                    console.log(error);
                });
            }

            getDataForDiffPhases();

            $scope.chartSeriesForDifferentPhases = [{
                name: 'Site',
                colorByPoint: true,
                data: siteCountArr
            }];


            $scope.chartConfigForDifferentPhases = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                formatter: function() {
                                    return this.y;

                                }
                            },
                            point: {
                                events: {
                                    click: function() {
                                        var stageId1 = stages1[this.name];
                                        console.log(stageId1);
                                        reportServices.getNoOfSitesForAllCustomer(stageId1).success(function(response) {
                                            console.log(response);
                                            var table = document.getElementsByTagName('table');
                                            console.log(table.length);
                                            $scope.createTable(table.length, stageId1, response);
                                        }).error(function(err) {
                                            console.log(err);
                                        });
                                    }
                                }
                            }
                        }
                    },


                    tooltip: {
                        formatter: function() {

                            return this.key + '<br>No of Sites - <b>' + this.y;

                        }

                    },
                },
                series: $scope.chartSeriesForDifferentPhases,


                title: {
                    text: 'No of Sites in each Stage',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                xAxis: {
                    title: {
                        text: 'Stages'
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'No of Sites'
                    },
                    labels: {
                        formatter: function() {
                            var time = this.value;
                            return time;
                        }
                    }
                },

                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }*/

            $scope.reflow = function() {
                $scope.$broadcast('highchartsng.reflow');
            };
            /*chartconfig 9 - Avg Installation time per site across customer ends*/

            /*chartconfig 7 - number of survey per device type*/
            //$scope.data1 = [['Indoor', 18]];
            $scope.$on("indoorOutdoorChart", function() {
                $scope.chartSeries = [{
                    name: 'Device Count',
                    data: [
                        ['Indoor', $scope.indoorCount],
                        ['Outdoor', $scope.outdoorCount]
                    ]
                }];
                $scope.$broadcast("drawchart7");
            });
            $scope.$on('postAuditedAsset', function() {
                var finalChart = [{
                    colorByPoint: true,
                    data: $scope.chartDataPA
                }]
                $scope.postAuditConfig = {
                    options: {
                        chart: {
                            type: 'column'
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    formatter: function() {
                                        return this.y;

                                    }
                                }
                            }
                        },

                        tooltip: {
                            formatter: function() {
                                //console.log(this);
                                return 'Status :<b>' + this.key + '</b>-No of Asset :<b>' + this.y + '</b>';

                            }

                        },
                    },
                    series: finalChart,

                    title: {
                        text: 'Post Audited Asset by Category',
                        style: {
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            fontFamily: 'GE Inspira Sans, sans-serif'
                        }
                    },
                    xAxis: {
                        title: {
                            text: 'Post audited Status'
                        },
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Number Of Asset'
                        },
                        labels: {
                            formatter: function() {
                                var time = this.value;
                                return time;
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },
                    loading: false,
                    size: {}
                }
            });

            // To disable tranche filter
            $scope.disableTrancheOk = false;
        $scope.updateCountByRefKey = function(refKey) {
            $scope.disableTrancheOk = true;
            console.log("refKey", refKey);
            if (refKey || refKey != '') {
                $scope.dataperStage = [];
                reportServices.getJobCntRefKey(refKey, $scope.selectedCustomerId).then(function(refKeyRes) {
                    $scope.disableTrancheOk = false;
                    console.log("refKeyRes------", refKeyRes);
                    let tmpData = refKeyRes.data;
                    for (var key1 in stageSeq) {
                        for (var key in tmpData) {
                            if (key1 == key) {
                                $scope.dataperStage.push({
                                    "name": stageSeq[key1],
                                    "y": tmpData[key]
                                });
                            }
                        }
                    }

                    let finalChart = [{
                        colorByPoint: true,
                        data: $scope.dataperStage
                    }];
                    $scope.stagesChart.series = finalChart;
                }).catch(function(errRefKey) {
                    $scope.disableTrancheOk = false;
                    console.error('errRefKey', errRefKey);
                });
            } else {
                // Show error message to user if required..
                defaultJobCount();
            }
        }

            // To load the default count..

        function defaultJobCount() {
            $scope.dataperStage = [];
            reportServices.getJobCountperStage($scope.selectedCustomerId).then(function(dataRes) {
                $scope.disableTrancheOk = false;
                console.log("refKeyRes------", dataRes);
                let tmpData = dataRes;
                for (var key1 in stageSeq) {
                    for (var key in tmpData) {
                        if (key1 == key) {
                            $scope.dataperStage.push({
                                "name": stageSeq[key1],
                                "y": tmpData[key]
                            });
                        }
                    }
                }
                let finalChart = [{
                        colorByPoint: true,
                        data: $scope.dataperStage
                    }];
                    $scope.stagesChart.series = finalChart;
                }).catch(function (err) {
                    $scope.disableTrancheOk = false;
                    console.error("error fetching getJobCountperStage", err);
                });
            }
            //  $scope.showTable = false;
            var stageId;
            var stages = {
                'Survey': 1,
                'Survey Approval': 2,
                'Design': 3,
                'Design Approval': 4,
                'Proposal': 5,
                'Purchase Order': 6,
                'Install Drawing': 7,
                'Install Drawing Approval': 8,
                'Install': 9,
                'Post Audit': 10,
                'Completed': 11
            }
            var stages1 = {
                'Survey': 1,
                'PM Survey Approval': 2,
                'Design': 3,
                'PM Design Approval': 4,
                'Proposal': 5,
                'Purchase Order': 6,
                'Install Drawing': 7,
                'PM Install Drawing Approval': 8,
                'Installation': 9,
                'Post Audit': 10,
                'Ready For Post Audit': 11
            }
            $scope.showDataCountTable = false;

            $scope.$on('charts', function() {
                var finalChart = [{
                    colorByPoint: true,
                    data: $scope.dataperStage
                }]
                $scope.stagesChart = {
                    options: {
                        chart: {
                            type: 'column'
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    formatter: function() {
                                        return this.y;

                                    }
                                },
                                point: {
                                    events: {
                                        click: function() {
                                            $scope.showDataCountTable = false;
                                            $scope.dataCount = [];
                                            var customerId = $scope.selectedCustomerId;
                                            // $scope.stagesChart.options.chart['width'] = 700;
                                            console.log(this.name);
                                            stageId = stages[this.name];
                                            $scope.showTable = true;
                                            console.log($scope.selectedCustomerId, stageId);
                                            reportServices.getNoOfDays(customerId, stageId).success(function(response) {
                                                console.log(response);
                                                var dataCount = response;
                                                $scope.dataCount = dataCount;
                                                $scope.showDataCountTable = true;
                                            }).error(function(error) {
                                                console.log(error);
                                            });
                                        }
                                    }
                                }
                            }
                        },

                        tooltip: {
                            formatter: function() {
                                //console.log(this);
                                return 'Status :<b>' + this.key + '</b>-Site Count:<b>' + this.y + '</b>';

                            }

                        },
                    },
                    series: finalChart,

                    title: {
                        text: 'Site count by status',
                        style: {
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            fontFamily: 'GE Inspira Sans, sans-serif'
                        }
                    },
                    xAxis: {
                        title: {
                            text: 'Site Status'
                        },

                        labels: { y: 15, rotation: -45, align: 'right' },
                        type: 'category'

                    },
                    yAxis: {
                        title: {
                            text: 'Site Count'
                        },
                        labels: {
                            formatter: function() {
                                var time = this.value;
                                return time;
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },
                    loading: false,
                    size: {}
                }
            });

            $scope.createTable = function(tableLength, stageId1, response) {
                console.log(tableLength);
                if (tableLength != 0) {
                    var element = document.getElementsByTagName("table"),
                        index;
                    for (index = element.length - 1; index >= 0; index--) {
                        element[index].parentNode.removeChild(element[index]);
                    }
                }
                var tableContainer = document.getElementById('chartDiv1');
                var table = document.createElement('table');
                table.setAttribute('border', '2');
                table.setAttribute('cellpadding', '10');
                table.setAttribute('id', 'tableChart');
                var tr = table.insertRow(-1);
                var th1 = document.createElement("th");
                th1.innerHTML = 'Customer Name'
                tr.appendChild(th1);
                var th2 = document.createElement("th");
                th2.innerHTML = 'No of Sites'
                tr.appendChild(th2);
                for (var i = 0; i < response.length; i++) {
                    tr = table.insertRow(-1);
                    for (var key in response[i]) {
                        console.log(key, response[i][key]);
                        var tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = response[i][key];
                    }
                }
                tableContainer.appendChild(table);
            }

            $scope.$on('installedAsset', function() {
                console.log($scope.chartData);
                var finalChart = [{
                    colorByPoint: true,
                    data: $scope.chartData
                }]
                $scope.assetChartConfig = {
                    options: {
                        chart: {
                            type: 'column'
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    formatter: function() {
                                        return this.y;

                                    }
                                }
                            }
                        },

                        tooltip: {
                            formatter: function() {
                                //console.log(this);
                                return 'Sku :<b>' + this.key + '</b>-No of Asset :<b>' + this.y + '</b>';

                            }

                        },
                    },
                    series: finalChart,

                    title: {
                        text: 'Installed Asset by SKU',
                        style: {
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            fontFamily: 'GE Inspira Sans, sans-serif'
                        }
                    },
                    xAxis: {
                        title: {
                            text: 'SKU'
                        },

                    },
                    yAxis: {
                        title: {
                            text: 'Number Of Asset'
                        },
                        labels: {
                            formatter: function() {
                                var time = this.value;
                                return time;
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },
                    loading: false,
                    size: {}
                }
            });

            $scope.$on("drawchart7", function() {
                $scope.chartConfig7 = {
                    options: {
                        chart: {
                            type: 'pie',
                            options3d: {
                                enabled: true,
                                alpha: 5
                            }
                        },

                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.percentage:.1f} %'
                                },
                                innerSize: 65,
                                depth: 15,
                                showInLegend: true,
                            }
                        },
                    },
                    series: $scope.chartSeries,
                    title: {
                        text: 'Number of Survey per Survey Type',
                        style: {
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            fontFamily: 'GE Inspira Sans, sans-serif'
                        }
                    },
                    /*  subtitle: {
                         text: 'Total Survey over year-to-date'
                     }, */
                    credits: {
                        enabled: false
                    },
                    loading: false,
                    size: {}
                }
            });
            $scope.reflow = function() {
                $scope.$broadcast('highchartsng.reflow');
            };
            /*chartconfig 7 - number of survey per device type*/

            /*chartconfig 5 - Number Of Survey By User */

            $scope.chartSeries1 = [{

                    name: 'Survey Count',
                    color: '#46ad00',
                    data: userSurveyCount /* [225, 403, 635, 831, 1007] */
                }
                /* , {

                                name: 'Survey Time',
                                color: '#f7a35c',
                                yAxis: 1,
                                data: [153200, 353200, 553200, 753200, 953200],
                                dataLabels: {
                                    enabled: true,
                                    formatter: function() {
                                        var time = this.y;
                                        var hours1 = parseInt(time / 3600000);
                                        var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                                        return hours1 + 'h :' + mins1 + 'm';

                                    }
                                }
                            } */

            ];

            $scope.chartConfig5 = {
                options: {
                    chart: {
                        type: 'column'
                    },

                    plotOptions: {
                        column: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    tooltip: {
                        formatter: function() {
                            if (this.series.name == "Survey Count") {
                                return "<b>" + this.series.name + "</b><br>" + this.x + " - " + this.y;
                            } else {
                                var time = this.y;
                                var hours1 = parseInt(time / 3600000);
                                var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                                return "<b>" + this.series.name + "</b><br>" + this.x + " - " + hours1 + " h: " + mins1 + " m";
                                //return this.key + '<br>Installation Time - <b>' + hours1 + 'h :' + mins1 + 'm</b>';
                            }
                        }

                    },
                },
                series: $scope.chartSeries1,
                title: {
                    text: 'Number of Survey by User',
                    style: {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontFamily: 'GE Inspira Sans, sans-serif'
                    }
                },
                /* subtitle: {
                    text: 'Total Assets - 5700'
                }, */
                xAxis: {
                    title: {
                        text: 'User SSO'
                    },
                    categories: userSSOArr /* ['502342435', '320003386', '212328493', '502627292', '501234578'] */
                },
                yAxis: [{ // Primary yAxis
                    /* labels: {
                         format: '{value}',
                         style: {
                             color: Highcharts.getOptions().colors[2]
                         }
                     }, */
                    title: {
                        text: 'Survey Count'
                    }
                    //opposite: true

                }, { // Secondary yAxis
                    gridLineWidth: 0,
                    /*                 title: {
                                        text: 'Avg Survey Time',
                                        style: {
                                            color: Highcharts.getOptions().colors[3]
                                        }
                                    }, */
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[3]
                        },
                        formatter: function() {
                            var time = this.value;
                            var hours1 = parseInt(time / 3600000);
                            var mins1 = parseInt((parseInt(time % 3600000)) / 60000);
                            return hours1 + ':' + mins1;
                        }
                    }

                }],


                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }

            $scope.reflow = function() {
                $scope.$broadcast('highchartsng.reflow');
            };

            /*chartconfig 5 - Number Of Survey By User*/

            /*chartconfig 3 - Monthly Survey/Service Report*/
            var d = new Date();
            var n = d.getFullYear();
            $scope.chartSeries = [{
                name: 'Survey',
                color: '#f15c80',
                data: [177, 169, 195, 145, 182, 215, 252, 233, 183, 139, 96, 125]
            }, {
                name: 'Service',
                color: '#e4d354',
                data: [170, 169, 295, 245, 382, 715, 552, 933, 283, 539, 296, 525]
            }];
            $scope.chartConfig3 = {
                options: {
                    chart: {
                        type: 'spline'
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    tooltip: {
                        dateTimeLabelFormats: {
                            millisecond: "%A, %b %e, %H:%M:%S.%L",
                            second: "%A, %b %e, %H:%M:%S",
                            minute: "%A, %b %e, %H:%M",
                            hour: "%A, %b %e, %H:%M",
                            day: "%A, %b %e, %Y",
                            week: "%m-%d-%Y",
                            month: "%B %Y",
                            year: "%Y"
                        }
                    }
                },
                series: $scope.chartSeries,
                title: {
                    text: 'Survey per Month Over the Year'
                },
                //new Date().getFullYear()
                // returns the current year
                xAxis: {
                    title: {
                        text: n
                    },
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

                },
                yAxis: {
                    title: {
                        text: 'Asset Count'
                    }
                },


                credits: {
                    enabled: false
                },
                loading: false,
                size: {}
            }

            $scope.reflow = function() {
                $scope.$broadcast('highchartsng.reflow');
            };
            /*chartconfig 3 - Monthly Survey/Service Report*/

            // Code for displaing jobs for a particular site (Start)
            function getJobsPerSite(a_selectedSiteId) {
                var tmpJobList = [],
                    ticketid = 0,
                    tempObj = {},
                    finalData = [],

                    tmpReportList = [], //Ruby - Survey Dashboard Progress Report start
                    tempReportObj = {},
                    finalReportData = [];

                $scope.finalProgressReport = []; //Ruby - Survey Dashboard Progress Report end
                $scope.finalJobsDetail = [];

                var jobList = dashboardService.getJobDetails(a_selectedSiteId).then(function(data) {
                    if (data.length > 0) {
                        //data.data;
                        tmpJobList = data[0].data;
                        $scope.fixCountData = data[1].data;
                        $scope.assetsInsData = data[2].data;
                        $scope.assetsPostAudData = data[3].data;
                        $scope.jobListDetails = data[4].data;
                        //getOthersJobDetails(); // Get assets installed and assets post audited.
                        for (var index = 0; index < tmpJobList.length; index++) {
                            ticketid = tmpJobList[index].ticketId;
                            var tempdetailsobj = getjobDetailList(ticketid);
                            console.log(tempdetailsobj);
                            tempObj = {
                                ticketId: tmpJobList[index].ticketId,
                                assetInstalled: getAssetsInsCnt(ticketid),
                                postAudited: getPostAudCnt(ticketid),
                                pm: (tmpJobList[index].surveyor === null) ? '-' : tmpJobList[index].surveyor,
                                currentStage: tmpJobList[index].currentStage,
                                fixtureCount: getFixtureCnt(ticketid),
                                surveyor: tempdetailsobj.surveyor,
                                installer: tempdetailsobj.installer,
                                designer: tempdetailsobj.designer,
                                surveyCompletedDate: tempdetailsobj.surveyCompletedDate,
                                designSubmittedDate: tempdetailsobj.designSubmittedDate,
                                installCompletedDate: tempdetailsobj.installCompletedDate,
                                dateOfApproval: tempdetailsobj.dateOfApproval
                            }

                            //var finaltemp = jsonConcat(tempObj,tempdetailsobj);
                            finalData.push(tempObj);
                        }
                        $scope.finalJobsDetail = finalData;
                        console.log('$scope.finalJobsDetail', $scope.finalJobsDetail);
                        //$("#mytable").attr("selected-rows", $scope.finalJobsDetail);
                    } else {
                        console.error('Error in response fetching job list per site');
                    }
                }).catch(function(error) {
                    console.error('Error ocuured in fetching job list per site', error);
                });

                // Ruby - Survey Dashboard Progress Report start
                var reportList = dashboardService.getProgressReport(a_selectedSiteId).then(function(data) { //Progress Report Code (Microservice)  this.getJobDetails in generalservices

                    if (data.length > 0) {

                        tmpReportList = data[0].data;

                        console.log(tmpReportList);

                        for (var count = 0; count < tmpReportList.length; count++) {

                            //console.log('after audit='+tmpReportList[i].addedAfteraudit);

                            console.log(tmpReportList[count].location);

                            tempReportObj = {
                                location: tmpReportList[count].location,
                                area: tmpReportList[count].area,
                                room: tmpReportList[count].room,
                                elementNo: tmpReportList[count].elementNo,
                                existingFixture: tmpReportList[count].existingFixture,
                                Action: tmpReportList[count].action,
                                solution: tmpReportList[count].solution,
                                description: tmpReportList[count].description,
                                addedAfteraudit: tmpReportList[count].addedAfteraudit,
                                plannedQty: tmpReportList[count].plannedQty,
                                installedQty: tmpReportList[count].installedQty,
                                remainingQty: tmpReportList[count].remainingQty,
                                complete: tmpReportList[count].complete
                            }

                            finalReportData.push(tempReportObj);
                        }
                        $scope.finalProgressReport = finalReportData;
                        console.log('$scope.finalReportDetail', $scope.finalProgressReport);
                    } else {
                        console.error('Error in response fetching report list per site');
                    }
                }).catch(function(error) {
                    console.error('Error ocuured in fetching report list per site', error);
                });
                // Ruby - Survey Dashboard Progress Report end

            }

            function getAssetsInsCnt(a_ticketId) {
                var returnValue = 0;
                for (var index = 0; index < $scope.assetsInsData.length; index++) {
                    if (a_ticketId == $scope.assetsInsData[index].ticketid) {
                        returnValue = $scope.assetsInsData[index].installationcount;
                        return returnValue;
                    }
                }
                return returnValue;
            }

            function getFixtureCnt(a_ticketId) {
                var returnValue = 0;
                for (var index = 0; index < $scope.fixCountData.length; index++) {
                    if (a_ticketId == $scope.fixCountData[index].ticketid) {
                        returnValue = $scope.fixCountData[index].nooffixtures;
                        return returnValue;
                    }
                }
                return returnValue;
            }

            function getPostAudCnt(a_ticketId) {
                var returnValue = 0;
                for (var index = 0; index < $scope.assetsPostAudData.length; index++) {
                    if (a_ticketId == $scope.assetsPostAudData[index].ticketid) {
                        returnValue = $scope.assetsPostAudData[index].postauditcount;
                        return returnValue;
                    }
                }
                return returnValue;
            }

            function getjobDetailList(a_ticketId) {
                var returnValue = {};
                for (var index = 0; index < $scope.jobListDetails.length; index++) {

                    if (a_ticketId == $scope.jobListDetails[index].ticketId) {
                        returnValue.surveyor = ($scope.jobListDetails[index].surveyor === null) ? '-' : $scope.jobListDetails[index].surveyor;
                        returnValue.installer = ($scope.jobListDetails[index].installer === null) ? '-' : $scope.jobListDetails[index].installer;
                        returnValue.designer = ($scope.jobListDetails[index].designer === null) ? '-' : $scope.jobListDetails[index].designer;
                        returnValue.surveyCompletedDate = ($scope.jobListDetails[index].surveyCompletedDate === null) ? '-' : $filter('date')(new Date($scope.jobListDetails[index].surveyCompletedDate), "dd/MM/yyyy");
                        returnValue.designSubmittedDate = ($scope.jobListDetails[index].designSubmittedDate === null) ? '-' : $filter('date')(new Date($scope.jobListDetails[index].designSubmittedDate), "dd/MM/yyyy");
                        returnValue.installCompletedDate = ($scope.jobListDetails[index].installCompletedDate === null) ? '-' : $filter('date')(new Date($scope.jobListDetails[index].installCompletedDate), "dd/MM/yyyy");
                        returnValue.dateOfApproval = ($scope.jobListDetails[index].dateOfApproval === null) ? '-' : $filter('date')(new Date($scope.jobListDetails[index].dateOfApproval), "dd/MM/yyyy");

                        return returnValue;
                    }
                }
                return returnValue;
            }

        }]);
});