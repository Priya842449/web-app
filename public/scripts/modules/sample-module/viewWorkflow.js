define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('viewWorkflowCtrl', ['$state', '$scope', '$timeout', '$http', '$compile', '$log', 'PredixAssetService',
        'PredixViewService', 'commonServices',
        'reportServices', 'dashboardService', '$filter',
        function ($state, $scope, $timeout, $http, $compile, $log, PredixAssetService, PredixViewService, commonServices, reportServices, dashboardService, $filter) {

       $http.get('http://localhost:8080/workflow/getAllWorkFLowNames').success(function(response) {	
			$scope.workFlowNames = response;
	   });	
	   
   $scope.submitForm = function(){			
			var item1 = $( "span.paper-typeahead" )[ 0 ];
			 $scope.item2 = $(item1).text();
			
			
			$http.get('http://localhost:8080/workflow/customizeWorkFlow?workFlowName='+$scope.item2).success(function(response) {	
			alert($scope.item2);
						$scope.responseData = response;
						console.log($scope.responseData);
						console.log("In success");
						console.log(response);
				 	var responseDataStages = response.workflowStages;
				var projectData = [];
					
				for (var i = 0; i < responseDataStages.length; i++){
					
					if(responseDataStages[i].stages!== undefined){
					var	stages= responseDataStages[i].stages;
					}
					else var stages='';
					
					if(responseDataStages[i].seq!== undefined){
						var sequence=responseDataStages[i].seq;
						}
					else var sequence='';
					
					if(responseDataStages[i].rejectButtonApplicable!== undefined){
					var	rejectButtonApplicable= responseDataStages[i].rejectButtonApplicable;
					}
					else var rejectButtonApplicable='';
					
					if(responseDataStages[i].nextStageOnReject!== undefined){
					//var	Quantity= responseData[i].Quantity;
					
								var nextStageOnReject=responseDataStages[i].nextStageOnReject;
							
					}
					else var nextStageOnReject='';
					
					if(responseDataStages[i].sendBackButtonApplicable!== undefined){
					var	sendBackButtonApplicable= responseDataStages[i].sendBackButtonApplicable;
					}
					else var sendBackButtonApplicable='';					
					var nodeObj111 = {
						stages:stages,
						sequence: sequence,
						rejectButtonApplicable:rejectButtonApplicable,
						nextStageOnReject: nextStageOnReject,
						sendBackButtonApplicable: sendBackButtonApplicable,
					}

					projectData.push(nodeObj111);
				}
			
			$scope.workFlowDetails = projectData; 
	})
	.error(function(response){
		console.log("error");
	});
		}
		
        }]);
});