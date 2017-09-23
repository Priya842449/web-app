  //--------------------------------------------------------------------------------------------------------------
  // Description : 
  //  The directive is used for displaying attachment files uploaded.
  //---------------------------------------------------------------------------------------------------------------
  define(['angular', './sample-module'], function(angular, sampleModule) {
      'use strict';

    sampleModule.directive("cardDirective", function($interpolate) {
    return {
        strict : 'EA',
        link : function(scope, elem, attr) {
            scope.getFileName = function() {
                return 'views/'+attr.filename+'.html';
            }

              },
              template: '<div ng-include="getFileName()"></div>'
          }
      });



      sampleModule.directive("pdfDirective", function($interpolate) {
          return {
              strict: 'EA',
              replace: true,
              templateUrl: function(element, attribute) {
                  return attribute.filename;
              }
          }
      });
  });