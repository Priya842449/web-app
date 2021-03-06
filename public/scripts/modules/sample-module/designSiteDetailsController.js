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
    controllers.controller('designSiteDetailsCtrlMain', ['$state', '$timeout', '$scope', '$stateParams', 'commonServices', 'designServices',
        function($state, $timeout, $scope, $stateParams, commonServices, designServices) {


            $scope.disableApprove = true;

            $scope.disableReject = true;

            //var ticketId = $stateParams.ticketId;
            var ticketSiteDetailsId = $stateParams.ticketSiteDetailsId;

            //commonServices.getJobStatus(ticketId).then(function(data) {
                commonServices.getSiteSummary(ticketSiteDetailsId).then(function(data) {
                    console.log("getJobStatus==========",data)
                    if (data.stageId == commonServices.STAGE_ID.design && data.statusId == 1){

                    //alert('completed');
                    var btnSubmit = document.getElementById('btnSubmit');
                    //console.log(btnAttch)
                    //btnSubmit.setAttribute('disabled', '');
                   // var btnReject = document.getElementById('btnSB');
                    //console.log(btnSubmit)
                   // btnReject.setAttribute('disabled', '');
                    $scope.disableApprove = false;
                    $scope.disableReject = false;
                    }
                });


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


            var customerFileMap = {
                    'walmart': 'DesignWalmartCard',
                    'designWithVersion': 'DesignWithVersion'
                }
                // Get the client refrence here and based on that enable the card to display relevant dat
            $scope.filename = customerFileMap['walmart'];
        }
    ]);
});