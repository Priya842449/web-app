/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    var uploadUrl = "https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io/uploadMultiBlob"
    var directory = "installdrawing";



    // Controller definition
    controllers.controller('multipleDesignFileUploadCtrl', ['$state', '$timeout', '$http', '$log', '$rootScope', '$scope', '$stateParams', 'commonServices', function($state, $timeout, $http, $log, $rootScope, $scope, $stateParams, commonServices) {
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


        //var ticketId = $stateParams.ticketId;
        //var ticketSiteDetailsId= $stateParams.ticketSiteDetailsId;
        var ticketSiteDetailsId = 1;
        var siteId = 24;

        init();

        function init() {
            $scope.fileArray = [];
        }

        //File upload event
        $('input[type="file"]').unbind('change');
        $('input[type="file"]').change(function() {
            var file = this.files[0];
            $("#test").append('Filename : ' + file.name + '  Type:' + file.type + '<br />');
            $scope.fileArray.push(file);
            //fileArray[0]=file;
            console.log('fileArray' + $scope.fileArray);
        });

        $scope.removeFile = function(val) {
            //var parent = $element.parentNode;
            //console.log(parent.id);
            console.log($scope.fileArray);
            console.log(val);
            $scope.fileArray.splice(val, 1);
            console.log('in remove');
            console.log($scope.fileArray);

        }

        $scope.submit = function() {
            uploadFile();
        }

        function uploadFile() {

            var fileArray = $scope.fileArray;
            var response = '';

            var xhttp = new XMLHttpRequest();
            console.log(fileArray.length);

            if (fileArray.length > 0) {
                var fd = new FormData();
                fd.append('SiteId', siteId);
                fd.append('directory', directory);
                //fd.append('directory',directory);
                fd.append('directory', +ticketSiteDetailsId + '/' + directory);
                angular.forEach(fileArray, function(file) {
                    fd.append('file', file);
                    console.log('--file--' + file)
                })
                console.log('--fd--' + fd);
                xhttp = commonServices.uploadFileToUrl(fd, uploadUrl);
                console.log(xhttp);
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        console.log(xhttp.responseText);
                        response = 'Success';
                    }
                    console.log(response);
                }
            }

        };

    }]);
});