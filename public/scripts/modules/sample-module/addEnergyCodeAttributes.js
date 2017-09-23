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
	controllers.controller('AddEnergyCodeAttributesCtrl', ['$http', '$log', 'PredixAssetService','$scope', 'commonServices',function ($http, $log, PredixAssetService, $scope,commonServices) {
		
		$scope.selectedEnergyCode = '';
		var ssoObj = window.localStorage.getItem("SSO_ID");
		
		window.addEventListener('pt-item-confirmed', function(e) {
			var searchCriteria = {};
			$scope.selectedEnergyCode = '';
			var srcElement2=e.srcElement;
			var data=srcElement2.__data__;
			$scope.selectedEnergyCode = data.inputValue;
			searchCriteria = {
				"searchCriteria": [
					$scope.selectedEnergyCode
				]
			};			
            //console.log(srcElement2)	;	  
			//console.log(data.inputValue);
			//console.log(searchCriteria);
			commonServices.getEnergyCodeAttributes(searchCriteria).then(function(energyCodeData) {
				console.log(energyCodeData);
				for(var i=0;i<energyCodeData[0].fields.length;i++)
				{
					//console.log(data[0].fields[i].proposalFieldName)
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="kitWatts")
					{
						document.getElementById("txtKitWatt").value=energyCodeData[0].fields[i].fieldValue;
					}
/* 					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="warrantyYears")
					{
						document.getElementById("txtWarrantyYears").value=energyCodeData[0].fields[i].fieldValue;
					} */
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="materialCostPerSku")
					{
						document.getElementById("txtMaterialCostPerSku").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="laborCostPerHour")
					{
						document.getElementById("txtLaborCostPerHour").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="ratedLife")
					{
						document.getElementById("txtRatedLife").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="ballastQntyPerSku")
					{
						document.getElementById("txtBallastQntyPerSku").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="ballastCost")
					{
						document.getElementById("txtBallastCost").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="installationRatePerHour")
					{
						document.getElementById("txtInstallationRatePerHour").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="lampRecyclingCostPerSku")
					{
						document.getElementById("txtLampRecyclingCostPerSku").value=energyCodeData[0].fields[i].fieldValue;
					}
					if(energyCodeData[0].fields[i].proposalTemplateFieldId=="ballastRecyclingCostPerSku")
					{
						document.getElementById("txtBallastRecyclingCostPerSku").value=energyCodeData[0].fields[i].fieldValue;
					}					
				}					
			});	
		});

		$scope.update = function() {
			var energyCodeAttributes = {};
            energyCodeAttributes = {
			  "kitWatts": document.getElementById("txtKitWatt").value,
			  //"warrantyYears": document.getElementById("txtWarrantyYears").value,
			  "materialCostPerSku": document.getElementById("txtMaterialCostPerSku").value,
			  "laborCostPerHour": document.getElementById("txtLaborCostPerHour").value,
			  "ratedLife": document.getElementById("txtRatedLife").value,
			  "ballastQntyPerSku": document.getElementById("txtBallastQntyPerSku").value,
			  "ballastCost": document.getElementById("txtBallastCost").value,
			  "installationRatePerHour": document.getElementById("txtInstallationRatePerHour").value,
			  "lampRecyclingCostPerSku": document.getElementById("txtLampRecyclingCostPerSku").value,
			  "ballastRecyclingCostPerSku": document.getElementById("txtBallastRecyclingCostPerSku").value,
			  "energyCode": $scope.selectedEnergyCode,
			  "createdBy": ssoObj
			}
			
			commonServices.updateEnergyCodeAttributes(energyCodeAttributes).then(function(response) {
				if((response.status == 'SUCCESS')) {
					$scope.selectedEnergyCode = '';
					var alert1 = document.querySelector('#submitAlert');
					alert1.toggle();
					//$scope.redirectPage = ticketId + "/" + siteId + "/" + ticketSiteDetailsId;
					var okRedirect = document.getElementById('okRedirect');
					okRedirect.setAttribute('onclick', "window.location = '/addEnergyCodeAttributes'");
					//okRedirect.setAttribute('onclick', "window.location = '/createdrawingdetails/" + $scope.redirectPage + "'");
				} else {
					$scope.selectedEnergyCode = '';
					var alert1 = document.querySelector('#submitAlertForFail');
					alert1.toggle();
					var notOkRedirect = document.getElementById('notOkRedirect');
					notOkRedirect.setAttribute('onclick', "window.location = '/addEnergyCodeAttributes'");
				}
			}).catch(function(error) {
				console.error("Error in updating attributes--", error);
			});
		};
	}]);
});