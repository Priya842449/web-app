/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    controllers.controller('indoorFixtureBuilderCntrl', ['$state', '$timeout', '$scope', 'commonServices', function($state, $timeout, $scope, commonServices) {
        $scope.catalogAdmin = "Catalog Admin";
        $scope.fileArray = [];
        $scope.disable = true;
        var uploadUrl = commonServices.getBlobStoreURL();

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

        //$('input[type="file"]').unbind('change');
        $scope.excelData = {};
        $scope.saveFixtureData = function() {
            var tempMetaData = {},
                valueEnteredCnt = 0;


            var enteredData = $('#parentContainer input, #fileUpload');
            var collectEnteredData = $('#parentContainer paper-input');
            var count = enteredData.length;

            for (var index = 0; index < (collectEnteredData.length) - 1; index++) {
                tempMetaData[collectEnteredData[index].id] = (collectEnteredData[index].__data__.value);
                if ((collectEnteredData[index].__data__.value) === '') {
                    valueEnteredCnt++;
                }

            }
            console.log(' $scope.excelData--', $scope.excelData);
            console.log(' enteredData --', tempMetaData);

            if (valueEnteredCnt === 6 && enteredData[count - 1].files.length < 1) {
                $scope.noDataFilled = true;
                return;
            } else {
                $scope.noDataFilled = false;
            }
            $('#parentContainer div paper-input').each(function() {
                var temp = $(this).val('');
                temp = null;
            });
            $('#fileUpload').val('');
            $scope.frmAdminCatalog.$setPristine();
            $scope.frmAdminCatalog.$rollbackViewValue();
            $scope.frmAdminCatalog.$setSubmitted();

        }

        // Excel to JSON
        $('#fileUpload').on('change', function(changeEvent) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                var data = evt.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                $scope.excelData = data;
            };
            reader.readAsBinaryString(changeEvent.target.files[0]);
        });

    }]);

});