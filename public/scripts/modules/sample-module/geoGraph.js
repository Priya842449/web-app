/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular',
        './sample-module'
        ], function (angular, controllers) {
	'use strict';

	// Controller definition
	controllers.controller('geoGraphCtrl', ['$http', '$log', 'PredixAssetService','$scope', function ($http, $log, PredixAssetService, $scope) {
		alert('hi');
// var data='[["Country", "Popularity"],["Germany", 200],["United States", 300],["Brazil", 400],["Canada", 500],["France", 600],["RU", 700]]'

      // var options = {};
      // options['region'] = 'US';
      // options['colors'] = [0xFF8747, 0xFFB581, 0xc06000]; //orange colors
      // options['dataMode'] = 'markers';

      // var container = document.getElementById('map_canvas');
      // //var geomap = new google.visualization.GeoMap(container);
	  // console.log(options)
	  // container.setAttribute('data', data);
	  // container.setAttribute('options', options);
      // //drawChart(data, options);
  
		
	}]);
});
