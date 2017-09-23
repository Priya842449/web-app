
/**
 * Load controllers, directives, filters, services before bootstrapping the application.
 * NOTE: These are named references that are defined inside of the config.js RequireJS configuration file.
 */
define([
    'jquery',
    'angular',
    'main',
    'routes',
    'interceptors',
    'px-datasource',
    'ng-bind-polymer',
    'highcharts-ng',
    'xlsx.full.min',
    'ods',
    'ui-grid.min',
    'jquery-ui',
    'jquery-ui.min',
    'ngMap',
    'datePicker',
    'angularUtils.directives.dirPagination',
    'jquery.scrollTo',
    'jquery.scrollTo.min'
    //'map'
], function($, angular) {
    'use strict';

    /**
     * Application definition
     * This is where the AngularJS application is defined and all application dependencies declared.
     * @type {module}
     */
    var predixApp = angular.module('predixApp', [
        'app.routes',
        'app.interceptors',
        'sample.module',
        'predix.datasource',
        'px.ngBindPolymer',
        'highcharts-ng',
        'ui.grid',
        'ngMap',
        'datePicker',
        'angularUtils.directives.dirPagination'
        //'map'
    ]);

    /* predixApp.config(function() {
    	window.localStorage.setItem("SSO_ID", '502627312');
    }); */

    predixApp.constant('flowConstant', {
        stageIdONE: 1, //Survey
        stageIdTWO: 2, //PM Survey Approval
        stageIdTHREE: 3, //Design
        stageIdFOUR: 4, //PM Design Approval
        stageIdFIVE: 5, //Proposal
        stageIdSIX: 6, //Purchase Order
        stageIdSEVEN: 7, //Install Drawing
        stageIdEIGHT: 8, //PM Install Drawing Approval
        stageIdNINE: 9 //Installation
    });




    /**
     * Main Controller
     * This controller is the top most level controller that allows for all
     * child controllers to access properties defined on the $rootScope.
     */
    predixApp.controller('MainCtrl', ['$state','$scope', '$rootScope', 'PredixUserService', '$http', '$injector', 'commonServices', function($state,$scope, $rootScope, predixUserService, $http, $injector, commonServices) {
        // alert('hi')
        // alert($scope.user_name)
        var $state = $injector.get('$state');

    //window.localStorage.setItem("SSO_ID",'502616892');
     window.localStorage.setItem("SSO_ID",'502627312');
      //window.localStorage.setItem("SSO_ID", '212598079');
      //window.localStorage.setItem("SSO_ID", '212470795');
        //window.localStorage.setItem("SSO_ID", '502676122');
        var ssoObj = window.localStorage.getItem("SSO_ID");
        //console.log("SSSO :", ssoObj);
        // //console.log(ssoObj.user_name)
        var tabsArray = [], // Temporary tabs array.
            tempTabObj = {}, // Temporary tab object.
            subitemsArray = [],
            tempSubObj = {};
        const ssoPrivilegeData = {
            contractorId: ssoObj
        };

        commonServices.setPrivilegeAccess(ssoPrivilegeData);
        $http.get('https://dt-menucontrol-microservice-dev.run.aws-usw02-pr.ice.predix.io/MenuItem?contractorId=' + ssoObj).success(function(data) {
            //console.log("data.menus", data);
            if (data.menus.length > 0) {
                $rootScope.landingPage = data.menus[0].state; // State for landing page.
                for (var i = 0; i < data.menus.length; i++) {
                    tempTabObj = {};
                    subitemsArray = [];
                    if (data.menus[i].state == "") {

                        for (var j = 0; j < data.menus[i].subitems.length; j++) {

                            tempSubObj = {
                                state: data.menus[i].subitems[j].state,
                                label: data.menus[i].subitems[j].label
								
								
                            }
							
                            subitemsArray.push(tempSubObj);
								
								
                        };

                        tempTabObj = {
                            icon: data.menus[i].icon,
                            state: data.menus[i].state,
                            label: data.menus[i].label,
                            subitems: subitemsArray
                        };
                    } else {
                        tempTabObj = {
                            icon: data.menus[i].icon,
                            state: data.menus[i].state,
                            label: data.menus[i].label,

                        };
                    }
					

                    tabsArray.push(tempTabObj);
                }

                // var reportTabRdl = {

                //         state: 'rdl',
                //         label: 'RDL',
            	// }
            	// tabsArray[6].subitems.push(reportTabRdl);
		        // var mySurvey = {

                //          state: 'mySurvey',
                //          label: 'My Survey',
            	//  }
            	//  tabsArray[1].subitems.push(mySurvey);

                //  var myInstall = {

                //          state: 'myInstall',
                //          label: 'My Install',
            	//  }
            	//  tabsArray[4].subitems.push(myInstall);
				tabsArray.push({icon: 'fa fa-pencil-square-o', state: 'createNewWorkFlow', label: 'Create Workflow'})
				tabsArray.push({icon: 'fa fa-pencil-square-o',state: 'newRequestWorkflow', label: 'Schedule Job Workflow'});
				$rootScope.App.tabs = tabsArray;
                //console.log('$state.current', $state.current);
                if($state.current.name == '') {
                    window.sessionStorage.removeItem('isloggedin');

                }
                redirectLandingPage(tabsArray);
            } else {
                $rootScope.isAuthorized = 'UNAUTHORIZED';
                //console.error("Unauthorized access in else");
                document.querySelector('px-app-nav').markSelected('/unauthorized');
                $state.go('unauthorized');
            }

        }).error(function() {
            $rootScope.isAuthorized = 'UNAUTHORIZED';
            //console.error("Unauthorized access");
            document.querySelector('px-app-nav').markSelected('/unauthorized');
            $state.go('unauthorized');
        });

        function redirectLandingPage(a_manu) {
            //console.log("Islogged in");
            var isLogged = window.sessionStorage.getItem('isloggedin');
                if (!isLogged == true) {
                sessionStorage.setItem('isloggedin', true);
                var isContarctor = true;
                $rootScope.isLoggedIn = true;
                for (var indx = 0; indx < a_manu.length; indx++) {
                    var a_data = a_manu[indx];
                    if (a_data.subitems != null && a_data.subitems.length > 0) {
                        var tmpArr = a_data.subitems;
                        for (var i = 0; i < tmpArr.length; i++) {
                            var state = tmpArr[i];
                            if (state.state == 'surveydashboard') {
                                isContarctor = false;
                            }
                        }
                    }
                }
                if (isContarctor) {
                    document.querySelector('px-app-nav').markSelected('/designSites');
                    $state.go('designSites');

                } else {
                    document.querySelector('px-app-nav').markSelected('/surveydashboard');
                    $state.go('surveydashboard');
                }
            }
        }

        //Global application object
        window.App = $rootScope.App = {
            version: '1.0',
            name: 'Predix Seed',
            session: {},
            // tabs: [
            // /* 				{icon: 'fa-bar-chart', state: 'dashboard', label: 'Dashboard', subitems: [
            // {state: 'assetreports', label: 'Survey'},
            // {state: 'LP', label: 'Installation'}
            // ]}, */
            // {icon: 'fa-bar-chart', state: 'LP', label: 'Dashboard'},
            // //{icon: 'fa-bar-chart', state: 'stageReport', label: 'Stage Dashboard'},
            // {icon: 'fa fa-user', state: '', label: 'PM Job Schedule',
            // subitems: [
            // {state: 'siteUpload',label: "Create Site"},
            // {state: 'newRequest',label: "New Job"}
            // ]
            // },
            // // {icon: 'fa fa-user', state: 'siteUpload', label: 'Admin'},
            // // {icon: 'fa-spinner fa-spin', state: 'newRequest', label: 'New Request'},
            // {icon: 'fa-bar-chart', state: 'pmviewsurvey', label: 'Survey Report'},
            // {icon: 'fa fa-pencil-square-o', state: '', label: 'Design',
            // subitems: [
            // {state: 'designSites',label: "Create Design"},
            // {state: 'pendingDesignApproval',label: "Design Approval"}
            // ]
            // },
            // {icon: 'fa fa-pencil-square-o', state: '', label: 'Proposal' ,
            // subitems:[
            // {state:'pendingProposalCreation', label:'Create Proposal'},
            // {state:'poViewProposal', label:'View Proposal'},
            // {state: 'podesign', label: 'Receive PO'}
            // ]},
            // // {icon: 'fa-bar-chart', state: 'podesign', label: 'PO'},

            // // {icon: 'fa fa-pencil-square-o', state: 'ListOfCrateInstallDrawing', label: 'Create Install Drawing' , subitems: [

            // // {state: 'listOfcrateInstallDrawing', label: 'Create Install Drawing'},

            // // ] },

            // {icon: 'fa fa-pencil-square-o', state: '', label: 'Installation' ,
            // subitems: [

            // {state: 'listOfcrateInstallDrawing', label: 'Create Install Drawing'},
            // {state: 'approveInstalldrawing',label: "Approve Install drawing"}
            // ] },




            // /* 					    {icon: 'fa-pie-chart', state: 'survey', label: 'Survey',
            // subitems: [
            // {state: 'pmviewsurvey',label: "PM View Survey"},
            // //{state: 'surveydetail',label: "Survey Detail"}
            // ]
            // },	 */
            // //{icon: 'fa-sitemap', state: 'about', label: 'About'},
            // //{icon: 'fa-tachometer', state: 'dashboard', label: 'TWIN DASHBOARD'},
            // {icon: 'fa-rep', state: '', label: 'Report',
            // subitems: [
            // {state: 'report', label: 'Asset Report'}]
            // },
            // {icon: 'fa-globe', state: 'installation', label: 'Asset Geoview'},
            // //  {icon: 'fa-rep', state: 'twinImage', label: 'Twin Image'},
            // //{icon: 'fa-tachometer', state: 'service', label: 'Service'},

            // // {icon: 'fa-pie-chart', state: 'geoGraph', label: 'geoGraph'},
            // // // {icon: 'fa-th', state: 'admin', label: 'Admin'},
            // // //{icon: 'fa-users', state: 'login', label: 'Login'},
            // // // {icon: 'fa-sitemap', state: 'map', label: 'Map'},
            // {icon: 'fa-monitor-asset', state: 'graph', label: 'Monitor Asset'},
            // {icon: 'fa-analytics', state: 'analytics', label: 'Analytics'}
            // ]
        };

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'UNAUTHORIZED':
                        //redirect
                        predixUserService.login(toState);
                        break;
                    default:
                        //go to other error state
                }
            } else {
                // unexpected error
            }
        });
    }]);


    //Set on window for debugging
    window.predixApp = predixApp;

    //Return the application  object
    return predixApp;
});