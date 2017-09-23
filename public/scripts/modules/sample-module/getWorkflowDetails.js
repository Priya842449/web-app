define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('getWorkFlowCtrl', ['$state', '$scope', '$timeout', '$http', '$compile', '$log', 'PredixAssetService',
        'PredixViewService', 'commonServices',
        'reportServices', 'dashboardService', '$filter',
        function ($state, $scope, $timeout, $http, $compile, $log, PredixAssetService, PredixViewService, commonServices, reportServices, dashboardService, $filter) {

		$scope.submitForm = function(itemVal){			
			var item1 = $( "span.paper-typeahead" )[ 0 ];
			 $scope.item2 = itemVal.text();
			alert($scope.item2);
		}
$http.get('http://localhost:8080/workflow/customizeWorkFlow?workFlowName'+$scope.item2).success(function(response) {	
alert($scope.item2);
						$scope.responseData = response;
						console.log("In success");
						console.log(response);
				 	var responseData = response;
				var projectData = [];
					
				for (var i = 0; i < responseData.length; i++){
					
					if(responseData[i].customerName!== undefined){
					var	customerName=responseData[i].customerName;
					}
					else var customerName='';
					
					if(responseData[i].businessName!== undefined){
						var businessName=responseData[i].businessName;
						}
					else var businessName='';
					
					if(responseData[i].requestName!== undefined){
					var	requestName= responseData[i].requestName;
					}
					else var requestName='';
					
					if(responseData[i].stages!== undefined){
					var	stages= responseData[i].stages;
					}
					else var stages='';
					
					if(responseData[i].sequence!== undefined){
						var sequence=responseData[i].sequence;
						}
					else var sequence='';
					
					if(responseData[i].rejectButtonApplicable!== undefined){
					var	rejectButtonApplicable= responseData[i].rejectButtonApplicable;
					}
					else var rejectButtonApplicable='';
					
					if(responseData[i].nextStageOnReject!== undefined){
					//var	Quantity= responseData[i].Quantity;
					
								var nextStageOnReject=responseData[i].nextStageOnReject;
							
					}
					else var nextStageOnReject='';
					
					if(responseData[i].sendBackButtonApplicable!== undefined){
					var	sendBackButtonApplicable= responseData[i].sendBackButtonApplicable;
					}
					else var sendBackButtonApplicable='';
					
					if(responseData[i].allStages!== undefined){
						var allStages=responseData[i].allStages;
						}
					else var allStages='';
					
					var nodeObj111 = {
						customerName: customerName,
						businessName:businessName,
						requestName:requestName,
						stages:stages,
						sequence: sequence,
						rejectButtonApplicable:rejectButtonApplicable,
						nextStageOnReject: nextStageOnReject,
						sendBackButtonApplicable: sendBackButtonApplicable,
						allStages:allStages
					}

					projectData.push(nodeObj111);
				}
			
			$scope.workFlowDetails = projectData; 
	})
	.error(function(response){
		console.log("error");
	});
	
	        
        }]);
});