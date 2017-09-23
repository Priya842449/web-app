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
        controllers.controller('DashboardCtrl', ['$timeout', '$http', '$log', 'PredixAssetService', '$rootScope', '$scope', function($timeout, $http, $log, PredixAssetService, $rootScope, $scope) {

            alert('hi');
            window.addEventListener('iron-select', function(e) {
                alert('in select')
                console.log(e);
                alert(e.srcElement.selected)
            })
        }]);
    });