  //--------------------------------------------------------------------------------------------------------------
  // Description : 
  //  The directive is used for displaying attachment files uploaded.
  //---------------------------------------------------------------------------------------------------------------
  define(['angular', './sample-module'], function(angular, sampleModule) {
      'use strict';

      //   sampleModule.filter("cardDirective", function($interpolate) {
      //       return {
      //           strict: 'EA',
      //           link: function(scope, elem, attr) {
      //               scope.getFileName = function() {
      //                   return 'views/' + attr.filename + '.html';
      //               }

      //           },
      //           template: '<div ng-include="getFileName()"></div>'
      //       }
      //   });

      sampleModule.filter('myFilter', function() {
          return function(obj, key) {
              var returnThis = false;
              console.log(obj, key);
              console.log('is object', typeof obj[key]);
              if (typeof obj[key] == 'object') {
                  returnThis = true;
              }
              return returnThis;
          }
      });


  });