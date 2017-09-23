/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
            .state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService', function($q, predixUserService) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo) {
                            deferred.resolve(userInfo);
                        }, function() {
                            deferred.reject({ code: 'UNAUTHORIZED' });
                        });
                        return deferred.promise;
                    }]
                }
            })
            // .state('dashboards', {
            // ////parent: 'secure',
            // url: '/dashboards',
            // templateUrl: 'views/dashboards.html',
            // controller: 'DashboardsCtrl'
            // })
            // .state('blankpage', {
            // url: '/blankpage',
            // templateUrl: 'views/blank-page.html'
            // })
            // .state('blanksubpage', {
            // url: '/blanksubpage',
            // templateUrl: 'views/blank-sub-page.html'
            // });
            //$stateProvider
            .state('indoorFixtureBuilder', {
                url: '/indoorFixtureBuilder',
                //parent: 'secure',
                templateUrl: 'views/indoorFixtureBuilder.html',
                controller: 'indoorFixtureBuilderCntrl'
            })



        .state('surveydashboard', {
                url: '/surveydashboard',
                //parent: 'secure',
                templateUrl: 'views/surveydashboard.html',
                controller: 'surveydashboardCtrl'
                    // resolve: {
                    //     authenticated: ['$q', 'commonServices', function($q, commonServices) {
                    //         var url = commonServices.menuUrl;
                    //         $http.post(url, a_data).then(function(privData) {
                    //             console.log(a_data, privData);
                    //             self.privilegeAccess = privData.data;
                    //             console.log('----data----self.privilegeAccess', self.privilegeAccess);
                    //         }).catch(function(err) {
                    //             console.error("error fetching privilege access:" + err);
                    //         });
                    //         return deferred.promise;
                    //     }]
                    // }

            })
        .state('solardashboard', {
               // url: '/solardashboard',
                //parent: 'secure',
                templateUrl: 'views/solardashboard.html',
                controller: 'solardashboardCntrl'
            })
            .state('inventoryOverview', {
              //  url: '/inventoryOverview',
                //parent: 'secure',
                templateUrl: 'views/inventoryOverview.html',
                controller: 'inventoryOverviewCtrl'
            })

        .state('siteUpload', {

           // url: '/siteUpload',
            //parent: 'secure',
            templateUrl: 'views/siteUpload.html',
            controller: 'dataRequestCtrl'
        })

        .state('userAssignment', {
          //  url: '/userAssignment',
           //parent: 'secure',
            templateUrl: 'views/userAssignmentGrid.html',
            controller: 'userAssignmentController'
        })

        .state('twinVisual', {

                url: '/twinVisual',
                //parent: 'secure',
                templateUrl: 'views/dashboard.html',
                controller: 'RemovalCtrl'
            })
            // .state('admin', {

        // url: '/admin',
        // templateUrl: 'views/adminMain.html',
        // controller: 'adminMainCtrl'
        // })

        .state('admin', {               
            url: '/admin',
          //  //parent: 'secure',
                           templateUrl: 'views/adminMain.html',
                            controller: 'adminMainCtrl'           
        })

        .state('postAuditReport', {               
            url: '/postAuditReport',
            //parent: 'secure',
                           templateUrl: 'views/postAuditReport.html',
                            controller: 'postAuditReportCtrl'           
        })

        .state('LP', {
            url: '/LP',
            //parent: 'secure',
            templateUrl: 'views/landingPage.html',
            controller: 'lpctrl'
        })

        .state('assetreports', {
                url: '/assetreports',
                //parent: 'secure',
                templateUrl: 'views/surveyreports.html',
                controller: 'surveyreportsCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                //parent: 'secure',
                    //templateUrl: 'views/createproposal.html',
                    // controller: 'createProposalCtrl'
            })

        .state('newRequest', {
                url: '/newRequest',
                //parent: 'secure',
                templateUrl: 'views/newRequest.html',
                controller: 'NewrequestCtrl'
            })
			.state('newRequestWorkflow', {
                url: '/newRequestWorkflow',
                //parent: 'secure',
                templateUrl: 'views/newRequestWorkflow.html',
                controller: 'NewrequestWorkflowCtrl'
            })
            .state('pmviewsurvey', {
                //parent: 'secure',
                url: '/pmviewsurvey',
                templateUrl: 'views/pmviewsurvey.html',
                controller: 'PMsurveyviewCtrl'
            })

            .state('rdl', {
               //parent: 'secure',
                url: '/rdl',
                templateUrl: 'views/rdl.html',
                controller: 'RDLCtrl'
            })

        .state('surveydetails', {
                url: '/surveydetails/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/surveyDetails.html',
                controller: 'surveyDetailsCtrl'
            })

            .state('mySurvey', {
                url: '/mySurvey',
                //parent: 'secure',
                templateUrl: 'views/mySurvey.html',
                controller: 'mySurveyCtrl'
            })

            .state('myInstall', {
                url: '/myInstall',
                //parent: 'secure',
                templateUrl: 'views/myInstall.html',
                controller: 'myInstallCtrl'
            })
            /* .state('listOfcrateInstallDrawing', {
                url: '/listOfcrateInstallDrawing',
                templateUrl: 'views/listOfcrateInstallDrawing.html',
                                                                controller: 'listOfcrateInstallDrawingCtrl'
             })*/

        .state('design', {
                url: '/design',
                //parent: 'secure',
                    // templateUrl: 'views/designSites.html',
                    //            controller: 'designSitesCtrl'
            })
            .state('designSites', {
               url: '/designSites',
                //parent: 'secure',
                templateUrl: 'views/designSites.html',
                controller: 'designSitesCtrl'
            })

        .state('designSiteDetails', {
                url: '/designSiteDetails/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/designSiteDetails.html',
                controller: 'designSiteDetailsCtrlMain'
            })
            .state('pendingDesignApproval', {
                url: '/pendingDesignApproval',
                //parent: 'secure',
                templateUrl: 'views/pendingDesignApproval.html',
                controller: 'pendingDesignApprovalCtrl'
            })

        .state('pmviewDesign', {
            url: '/pmviewDesign/:ticketId/:siteId/:ticketSiteDetailsId',
            //parent: 'secure',
            templateUrl: 'views/pmviewDesign.html',
            controller: 'pmviewdesignCtrl'
        })

        .state('createproposalForPm', {
                url: '/createproposalForPm'
                ////parent: 'secure',
                    //templateUrl: 'views/createproposal.html',
                    // controller: 'createProposalCtrl'
            })
            .state('createproposal', {
                url: '/createproposal/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/createproposal.html',
                controller: 'createProposalCtrl'
            })
            .state('pendingProposalCreation', {
                url: '/pendingProposalCreation',
                //parent: 'secure',
                templateUrl: 'views/pendingProposalCreation.html',
                controller: 'pendingProposalCreationCtrl'
            })

        .state('podesign', {
                url: '/podesign',
                //parent: 'secure',
                templateUrl: 'views/podesign.html',
                controller: 'POdesignCtrl'
            })
            .state('indoorSurveyFabric', { // Indoor survey floor plan js
                url: '/indoorSurveyFabric',
                //parent: 'secure',
                templateUrl: 'views/indoorSurveyFabric.html',
                controller: 'IndoorSurveyCntrlFabric'
            })
            .state('stageReport', {
                url: '/stageReport',
                //parent: 'secure',
                templateUrl: 'views/stageReport.html',
                controller: 'StageReportCtrl'
            })
            .state('PODetails', {
                url: '/PODetails/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/PODetails.html',
                controller: 'PODetailsCtrl'
            })
            .state('ListOfCrateInstallDrawing', {
                url: '/ListOfCrateInstallDrawing'
                ////parent: 'secure',
                    // templateUrl: 'views/designSites.html',
                    //            controller: 'designSitesCtrl'
            })

        .state('listOfcreatePostAudits', {
                url: '/listOfcreatePostAudits',
                //parent: 'secure',
                templateUrl: 'views/listOfcreatePostAudits.html',
                controller: 'listOfcreatePostAuditsCtrl'
            })
            .state('createpostAuditsdetails', {
                url: '/createpostAuditsdetails/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/createpostAuditsdetails.html',
                controller: 'CreatePostAuditsDetailsCtrl'
            })

        .state('createdrawingdetails', {
                url: '/createdrawingdetails/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/createdrawingdetails.html',
                controller: 'CreateDrawingDetailsCtrl'
            })
            .state('approvedrawingdetails', {
                url: '/approvedrawingdetails/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/approveDrawingdetails.html',
                controller: 'ApprovedrawingdetailsCtrl'
            })
            .state('approveInstalldrawing', {
                url: '/approveInstalldrawing',
                //parent: 'secure',
                templateUrl: 'views/ApproveInstalldrawing.html',
                controller: 'ApproveInstalldrawingCtrl'
            })
            .state('listOfcrateInstallDrawing', {
                url: '/listOfcrateInstallDrawing',
                //parent: 'secure',
                templateUrl: 'views/listOfcrateInstallDrawing.html',
                controller: 'listOfcrateInstallDrawingCtrl'
            })
            .state('viewPostAudit', {
                url: '/viewPostAudit',
                //parent: 'secure',
                templateUrl: 'views/viewPostAudit.html',
                controller: 'viewPostAuditCtrl'
            })


        .state('pmViewProposal', {
                url: '/pmViewProposal/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/pmViewProposal.html',
                controller: 'pmViewProposalCtrl'
            })
            .state('poViewProposal', {
                url: '/poViewProposal',
                //parent: 'secure',
                templateUrl: 'views/poViewProposal.html',
                controller: 'poViewProposalCtrl'
            })
            //------------------------------------
            .state('installationSurvey', {
                url: '/installationSurvey',
                //parent: 'secure',
                templateUrl: 'views/installationSurvey.html',
                controller: 'installationSurveyCtrl'
            })
            .state('viewFileUploadedByDesigner', {
                url: '/viewFileUploadedByDesigner/:ticketId/:siteId/:ticketSiteDetailsId',
                //parent: 'secure',
                templateUrl: 'views/viewFileUploadedByDesigner.html',
                controller: 'viewFileUploadedByDesignerCtrl'
            })
            .state('multipleDesignFileUpload', {
                url: '/multipleDesignFileUpload',
                //parent: 'secure',
                templateUrl: 'views/multipleDesignFileUpload.html',
                controller: 'multipleDesignFileUploadCtrl'
            })
            //------------------------------------
            .state('about', {
                url: '/about',
                //parent: 'secure',
                templateUrl: 'views/about.html',
                controller: 'BatteryDataCtrl'
            })
            // .state('dashboard', {
            // //////parent: 'secure',
            // url: '/dashboard',
            // templateUrl: 'views/dashboard.html',
            // controller: 'DashboardCtrl'
            // })
            .state('twinImage', {
                url: '/twinImage',
                //parent: 'secure',
                templateUrl: 'views/twinImage.html',
                controller: 'TwinImageCtrl'
            })
            .state('installation', {
                url: '/installation',
                //parent: 'secure',
                templateUrl: 'views/installation.html',
                controller: 'InstallationCtrl'
            })
            /* 			.state('pmviewsurvey', {
                            url: '/pmviewsurvey',
                            templateUrl: 'views/pmviewsurvey.html',
            				controller: 'PMsurveyviewCtrl'
                        })
            			.state('surveydetails', {
                            url: '/surveydetails/:ticketId',
                            templateUrl: 'views/surveyDetails.html',
            				controller: 'surveyDetailsCtrl'
                        }) */
            .state('service', {
                url: '/service',
                //parent: 'secure',
                templateUrl: 'views/service.html',
                controller: 'ServiceCtrl'
            })
            .state('report', {
                url: '/report',
                //parent: 'secure',
                templateUrl: 'views/report.html',
                controller: 'ReportCtrl'
            })
            // .state('admin', {
            // url: '/admin',
            // templateUrl: 'views/admin.html'
            // })
            .state('login', {
                url: '/login',
                //parent: 'secure',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('scan', {
                url: '/scan',
                //parent: 'secure',
                templateUrl: 'views/scan.html',
                controller: 'ScanCtrl'
            })
            .state('map', {
                url: '/map',
                //parent: 'secure',
                templateUrl: 'views/map.html',
                controller: 'MapCtrl'
            })
            .state('graph', {
                url: '/graph',
                //parent: 'secure',
                templateUrl: 'views/graph.html',
                controller: 'GraphCtrl'
            })
            .state('geoGraph', {
                url: '/geoGraph',
                //parent: 'secure',
                templateUrl: 'views/geoGraph.html',
                controller: 'geoGraphCtrl'
            })
            .state('vivgraph', {
                url: '/vivgraph',
                //parent: 'secure',
                templateUrl: 'views/vivgraph.html',
                controller: 'VivGraphCtrl'
            })
			
		
			
            .state('unauthorized', {
                url: '/unauthorized',
                //parent: 'secure',
                templateUrl: 'views/Unauthorized.html'
            })
            .state('analytics', {
                url: '/analytics',
                //parent: 'secure',
                templateUrl: 'views/analytics.html',
                controller: 'analyticsCtrl'
            })

        .state('addEnergyCodeAttributes', {
                url: '/addEnergyCodeAttributes',
                //parent: 'secure',
                templateUrl: 'views/addEnergyCodeAttributes.html',
                controller: 'AddEnergyCodeAttributesCtrl'
            })
			
				.state('createNewWorkFlow', {
                url: '/createNewWorkFlow',
                //parent: 'secure',
                templateUrl: 'views/createNewWorkflow.html',
                controller: 'createNewWorkflowCntrl'
            })
            /*
            .state('about', {
                url: '/about',
                templateUrl: 'views/about.html'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('cards', {
                url: '/cards',
                templateUrl: 'views/cards.html'
            })
            .state('interactions', {
                url: '/interactions',
                templateUrl: 'views/interactions.html'
            })
            .state('dataControl', {
                url: '/dataControl',
                templateUrl: 'views/data-control.html',
                controller: 'DataControlCtrl'
            })
            .state('components', {
                url: '/components',
                templateUrl: 'views/components.html'
            });
			*/


        /*$urlRouterProvider.otherwise(function($injector) {

            var ssoObj = window.localStorage.getItem("SSO_ID");
            var $state = $injector.get('$state');
            if (ssoObj != null && ssoObj != undefined && ssoObj != "") {
                document.querySelector('px-app-nav').markSelected('/surveydashboard');
                $state.go('surveydashboard');
            } else {
                window.px.auth.login();
            }
        });*/

    }]);
});