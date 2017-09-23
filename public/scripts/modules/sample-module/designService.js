define(['angular', './sample-module'], function(angular, sampleModule) {
    'use strict';
//Local
//var approve ="http://localhost:8080/moveToNextStage";
//Dev
var approve ="https://dt-admin-microservice-dev.run.aws-usw02-pr.ice.predix.io/moveToNextStage";
    sampleModule.service('designServices', ['$q', '$http', function($q, $http) {
	
	this.Approve = function(data){
		 console.log(data)
              $http.post(approve,data).success(function(data){
					 console.log(data);
		  });
 }
	
	
    }])
    return sampleModule;
});