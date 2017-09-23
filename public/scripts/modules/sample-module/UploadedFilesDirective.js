  //--------------------------------------------------------------------------------------------------------------
  // Description : 
  //  The directive is used for displaying attachment files uploaded.
  //---------------------------------------------------------------------------------------------------------------
  define(['angular', './sample-module'], function(angular, sampleModule) {
      'use strict';

    sampleModule.directive("uploadedFiles", function() {
    return {
      strict : 'EA',
      //replace : true,
      scope : {
        finalData : '=',
          visible : '='
      },
      templateUrl : 'views/UploadedFiles.html',
        link : function(scope, elem, attr) {
            scope.$watch(attr.visible, function(value) {
                console.log("value in directive watch", value);
                scope.showDelButton = value; // To show hide the delete button
            });
            scope.deleteThisFile = function(fileName, a_position) {
                
                var deleteAlert=document.getElementById('deleteAlert');
                deleteAlert.toggle();
                scope.fileName=fileName;
                scope.a_position=a_position;
            }
            
            scope.deleteConfirm = function() {
                scope.$parent.deleteThisFile(scope.fileName, scope.a_position);
            }
        }
    }
  });
  });