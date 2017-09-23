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
	controllers.controller('VivGraphCtrl', ['$http', '$log', 'PredixAssetService','$scope', function ($http, $log, PredixAssetService, $scope) {
		var config = '';
		var fetchAllDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?fields=serialNo,specification';
		var fetchSkuByDeviceUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=';
		var fetchDevicesByCustomerIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=customerId=';
		var fetchCustomerByIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=customerId=';
		var fetchDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=siteId=';
		var fetchSiteById = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=';
		var filterSiteCust='https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=parent=/customer/'
		$scope.chartType = 'column';
		$scope.xAxisTitle = '';
		$scope.xAxisTitle2 = '';
		$scope.xAxisTitle4 = '';
		$scope.chartTitle = '';
		$scope.chartTitle2 = '';
		$scope.flag=false;
		$scope.chartTitle4 = '';
		$scope.jsonArr = [];
		$scope.jsonArr1 = [];
$scope.jsonArr3= [];
$scope.jsonArr4=[];




	$(document).ready(function(){
			// Do stuff
			var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';
			var headersConfig = {
					headers:  {
						'content-Type': 'application/x-www-form-urlencoded',
						'authorization' : 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
					}
			};

			$http.post(commonServices.getauthTokenURL(), data, headersConfig).success(function (data) {
			var accessToken = data.access_token;

			var auth = 'bearer '+ accessToken;

			config = {
					headers:  {
						'Authorization': auth,
						'Content-Type': 'application/json',
						'Predix-Zone-Id': '0da112ff-f441-4362-ac52-c5bc1752e404'
					}
			};
			var inputCustElement = document.querySelector('paper-typeahead-input-customer');
			inputCustElement.setAttribute('cnf',auth);
			inputCustElement.setAttribute('znId','0da112ff-f441-4362-ac52-c5bc1752e404');
			var inputSiteElement = document.querySelector('paper-typeahead-input-site');
			inputSiteElement.setAttribute('cnf',auth);
			inputSiteElement.setAttribute('znId','0da112ff-f441-4362-ac52-c5bc1752e404');

			var inputSkuElement = document.querySelector('paper-typeahead-input-sku');
			inputSkuElement.setAttribute('cnf',auth);
			inputSkuElement.setAttribute('znId','0da112ff-f441-4362-ac52-c5bc1752e404');

		
			
			
			$http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorDefects').success(function (response) {
				console.log(response);
				var xAxisArray = new Array();
				var yAxisArray = new Array();
				for(var i=0;i<response.length;i++)
				{
					
					xAxisArray.push(response[i].contractorId);
					yAxisArray.push(response[i].fixtureQty);
					
				}
				$scope.chartTitle1='Total Number of Fixtures'
				$scope.xAxisTitle1='Contractor Name'
				//$scope.xAxisTitle='Contractor Name'
					setTimeout(function(){
					// $scope.jsonArr = [];
					for(var i=0;i<yAxisArray.length;i++){
						$scope.jsonArr1.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
					}		
					console.log($scope.jsonArr1+'array')
					$scope.createGraph('',$scope.jsonArr1);
				}, 3000);
			});	
		$http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorStatistics').success(function (response) {
				console.log(response);
				var xAxisArray = new Array();
				var yAxisArray = new Array();
				$scope.jsonArr3=[];
				for(var i=0;i<response.length;i++)
				{
					
					xAxisArray.push(response[i].contractorId);
					yAxisArray.push(response[i].avgDaysSpendingPreStore);
					
				}
				$scope.chartTitle2='Average Day spending per Store'
				$scope.xAxisTitle2='Contractor Name'
				//$scope.xAxisTitle='Contractor Name'
					setTimeout(function(){
					// $scope.jsonArr = [];
					for(var i=0;i<yAxisArray.length;i++){
						$scope.jsonArr3.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
					}		
					console.log($scope.jsonArr3+'array')
					$scope.createGraph('','',$scope.jsonArr3);
				}, 3000);
			});			
		});
	});
			

				
				


			
		window.addEventListener( 'google-chart-select', function(e) {
			console.log(e);
			var srcElem = e.srcElement;	
			//alert((srcElem.id)
			if(srcElem.id=='googleChart1')
			{
					//alert(srcElem.__data__.selection[0].row);
					console.log(srcElem.__data__.rows)
					var dataTable=srcElem._dataTable;
					console.log(dataTable.Nf[srcElem.__data__.selection[0].row]);
					var c =dataTable.Nf[srcElem.__data__.selection[0].row];
					var ca=c.c;
						console.log(ca[0].v);
						var finalName=ca[0].v
						
					
					
			
					$http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorDefects').success(function (response) {
					paperSpinner.setAttribute('active','');
						//console.log(response);
						var xAxisArray = new Array();
						var yAxisArray = new Array();
						$scope.jsonArr=[];
						for(var i=0;i<response.length;i++)
						{
						if(response[i].contractorId== finalName)
							{
							xAxisArray.push(response[i].contractorId);
							yAxisArray.push(response[i].defects);
							}
						}
						$scope.chartTitle3='Average Days Spending Per Store'
						$scope.xAxisTitle3='Contractor Name'
						//$scope.xAxisTitle='Contractor Name'
							setTimeout(function(){
							// $scope.jsonArr = [];
							for(var i=0;i<yAxisArray.length;i++){
								$scope.jsonArr.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
							}		
							console.log($scope.jsonArr+'array')
							$scope.createGraph($scope.jsonArr,'');
						}, 3000);
						paperSpinner.removeAttribute('active');
					});	
			}	
			else if(srcElem.id=='googleChart3')
			{
			$scope.flag=false;
			//alert(('googleChart3');
			console.log(srcElem.__data__.rows)
					var dataTable=srcElem._dataTable;
					console.log(dataTable.Nf[srcElem.__data__.selection[0].row]);
			var c =dataTable.Nf[srcElem.__data__.selection[0].row];
					var ca=c.c;
						console.log(ca[0].v);
						var finalName=ca[0].v
			$http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorDuration').success(function (response) {
			paperSpinner.setAttribute('active','');
				console.log(response);
				var xAxisArray = new Array();
				var yAxisArray = new Array();
				$scope.jsonArr4=[];
				for(var i=0;i<response.length;i++)
				{
					if(response[i].contractorId==finalName)
					{
						xAxisArray.push('Lighting Design Survey');
						yAxisArray.push(response[i].lightingDesignSurvey);
						xAxisArray.push('Install Drawing Lighting Design');
						yAxisArray.push(response[i].installDrawingLightingDesign);
						xAxisArray.push('Shipment Install Drawing');
						yAxisArray.push(response[i].shipmentInstallDrawing);
						xAxisArray.push('Shipment Delivery');
						yAxisArray.push(response[i].shipmentDelivery);
						xAxisArray.push('Delivery Installation');
						yAxisArray.push(response[i].deliveryInstallation);
						
					}
				}
				$scope.chartTitle4=finalName
				$scope.xAxisTitle4='Contractor Name'
				//$scope.xAxisTitle='Contractor Name'
					setTimeout(function(){
					// $scope.jsonArr = [];
					for(var i=0;i<yAxisArray.length;i++){
						$scope.jsonArr4.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
					}		
					console.log($scope.jsonArr4+'array')
					$scope.createGraph('','','',$scope.jsonArr4);
					paperSpinner.removeAttribute('active');
				}, 3000);
			});	
			}
		});
		
		$scope.consolidate = function (){
			$http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorDefects').success(function (response) {
			paperSpinner.setAttribute('active','');
				console.log(response);
				var xAxisArray = new Array();
				var yAxisArray = new Array();
				$scope.jsonArr=[];
				for(var i=0;i<response.length;i++)
				{
			
					xAxisArray.push(response[i].contractorId);
					yAxisArray.push(response[i].defects);
				
				}
				$scope.chartTitle='Fixtures Returned Due to Defect'
				$scope.xAxisTitle='Contractor Name'
				//$scope.xAxisTitle='Contractor Name'
					setTimeout(function(){
					// $scope.jsonArr = [];
					for(var i=0;i<yAxisArray.length;i++){
						$scope.jsonArr.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
					}		
					console.log($scope.jsonArr+'array')
					$scope.createGraph($scope.jsonArr,'');
					paperSpinner.removeAttribute('active');
				}, 3000);
			});	
		
		}
		 $scope.consolidate1 = function (){
		 paperSpinner.setAttribute('active','');
			 $http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorDuration').success(function (response) {
				 console.log(response);
				 var xAxisArray = new Array();
				 var AxisArray1 = new Array();
				 var AxisArray2 = new Array();
				 var AxisArray3 = new Array();
				 var AxisArray4 = new Array();
				 var AxisArray5 = new Array();
				 var AxisArray = new Array();
				 $scope.jsonArr4=[];
				 for(var i=0;i<response.length;i++)
				 {
						 xAxisArray.push(response[i].contractorId);
						 AxisArray1.push(response[i].lightingDesignSurvey);
						  AxisArray2.push(response[i].installDrawingLightingDesign);
						   AxisArray3.push(response[i].shipmentInstallDrawing);
						    AxisArray4.push(response[i].shipmentDelivery);
							 AxisArray5.push(response[i].deliveryInstallation);
						
						 /* xAxisArray.push('Lighting Design Survey');
						 yAxisArray.push(response[i].lightingDesignSurvey);
						 xAxisArray.push('Install Drawing Lighting Design');
						 yAxisArray.push(response[i].installDrawingLightingDesign);
						 xAxisArray.push('Shipment Install Drawing');
						 yAxisArray.push(response[i].shipmentInstallDrawing);
						 xAxisArray.push('Shipment Delivery');
						 yAxisArray.push(response[i].shipmentDelivery);
						 xAxisArray.push('Delivery Installation');
						 yAxisArray.push(response[i].deliveryInstallation); */
						
				
				 }
				 $scope.chartTitle4=""
				 $scope.xAxisTitle4='Contractor Name'
				 $scope.flag=true
				
				 $scope.jsonArr4.push('["contractorId", "Lighting Design Survey", "Install Drawing Lighting Design","Shipment Install Drawing","Shipment Delivery","Delivery Installation"]');
				 //$scope.xAxisTitle='Contractor Name'
					 setTimeout(function(){
					 // $scope.jsonArr = [];
					 //$scope.jsonArr4.push(AxisArray);
					 for(var i=0;i<xAxisArray.length;i++){
					 
						 $scope.jsonArr4.push('["'+xAxisArray[i]+'",'+AxisArray1[i]+','+AxisArray2[i]+','+AxisArray3[i]+','+AxisArray4[i]+','+AxisArray5[i]+']'); 
																				// $scope.jsonArr4.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 							 
						//alert(($scope.jsonArr4)
					 }	
					
					 console.log($scope.jsonArr4+'array')
					 $scope.createGraph('','','',$scope.jsonArr4);
					 paperSpinner.removeAttribute('active');
				 }, 3000);
			 });
		
		 }
		
				var googleChart = document.querySelector('#googleChart');
				var googleChart1 = document.querySelector('#googleChart1');
				var googleChart3 = document.querySelector('#googleChart3');
				var googleChart4 = document.querySelector('#googleChart4');
		var paperSpinner = document.querySelector('#paperSpinner');
				
		$scope.swapChartType = function () {			
			if ($scope.chartType === 'column') {                       
				$scope.chartType = 'line';

				$scope.createGraph($scope.jsonArr,$scope.jsonArr1,$scope.jsonArr3,$scope.jsonArr4);        

			} else if ($scope.chartType === 'line') {
				$scope.chartType = 'area';
				$scope.createGraph($scope.jsonArr,$scope.jsonArr1,$scope.jsonArr3,$scope.jsonArr4);
			
			} else if ($scope.chartType === 'area') {
				$scope.chartType = 'pie';
				$scope.createGraph($scope.jsonArr,$scope.jsonArr1,$scope.jsonArr3,$scope.jsonArr4);
				
			} else if ($scope.chartType === 'pie') {
				$scope.chartType = 'stepped-area';
				$scope.createGraph($scope.jsonArr,$scope.jsonArr1,$scope.jsonArr3,$scope.jsonArr4);
;
			} else {
				$scope.chartType = 'column';
				$scope.createGraph($scope.jsonArr,$scope.jsonArr1,$scope.jsonArr3,$scope.jsonArr4);
				
			}
		}
			
		$scope.createGraph = function(jsonArr,jsonArr1,jsonArr3,jsonArr4){
		//alert(jsonArr1);
		//alert($scope.chartType+' $scope.chartType1')
			googleChart.setAttribute('type', $scope.chartType);
			//googleChart.setAttribute('options','{"title": "'+$scope.chartTitle+'","hAxis": {"title": "'+$scope.xAxisTitle+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Defect", "minValue": 0, "maxValue": 100}}, "animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart.setAttribute('options','{"title": "'+$scope.chartTitle+'","hAxis": {"title": "'+$scope.xAxisTitle+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Defect", "minValue": 0, "maxValue": 100},"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Defect", "type": "number"}]');
			//alert(jsonArr);
			googleChart.setAttribute('rows', '['+jsonArr+']');
				//alert($scope.chartType+' $scope.chartType2')
		googleChart1.setAttribute('type', $scope.chartType);
			//googleChart1.setAttribute('options','{"title": "'+$scope.chartTitle1+'","hAxis": {"title": "'+$scope.xAxisTitle1+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Fixtures", "minValue": 0, "maxValue": 100}} ,"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart1.setAttribute('options','{"title": "'+$scope.chartTitle1+'","hAxis": {"title": "'+$scope.xAxisTitle1+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Fixtures", "minValue": 0, "maxValue": 100},"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart1.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Fixtures", "type": "number"}]');
			googleChart1.setAttribute('rows', '['+jsonArr1+']');
			
				googleChart3.setAttribute('type', $scope.chartType);
			//googleChart1.setAttribute('options','{"title": "'+$scope.chartTitle1+'","hAxis": {"title": "'+$scope.xAxisTitle1+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Fixtures", "minValue": 0, "maxValue": 100}} ,"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart3.setAttribute('options','{"title": "'+$scope.chartTitle2+'","hAxis": {"title": "'+$scope.xAxisTitle2+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Days", "minValue": 0, "maxValue": 100},"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart3.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Days", "type": "number"}]');
			googleChart3.setAttribute('rows', '['+jsonArr3+']');
			
				googleChart4.setAttribute('type', $scope.chartType);
			//googleChart1.setAttribute('options','{"title": "'+$scope.chartTitle1+'","hAxis": {"title": "'+$scope.xAxisTitle1+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Fixtures", "minValue": 0, "maxValue": 100}} ,"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			googleChart4.setAttribute('options','{"title": "'+$scope.chartTitle4+'","hAxis": {"title": "'+$scope.xAxisTitle4+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Days", "minValue": 0, "maxValue": 100},"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			if($scope.flag)
			{
				//alert((jsonArr4 +'aseem')
				//alert(('flag');
				googleChart4.removeAttribute('cols')
				googleChart4.removeAttribute('rows')
				googleChart4.setAttribute('data', '['+jsonArr4+']');
				//googleChart4.drawChart();
			}
			else
			{
			//alert(('hi');
				googleChart4.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Days", "type": "number"}]');
				googleChart4.setAttribute('rows', '['+jsonArr4+']');
			}
		};
	
		
		// window.addEventListener('WebComponentsReady', function(e) {

		// });

		// window.addEventListener('pt-item-confirmed', function(e) {
			// console.log(e);
			// var srcElement2=e.srcElement;                                                                                                                                                                                                                                                                                                                                
			// var data=srcElement2.__data__;
			// var keyCust;			
			// if (srcElement2.localName=="paper-typeahead-input-customer") {
				// keyCust=data.keyid;				
				// paperSpinner.setAttribute('active','');
				// $scope.selectedCustomer(data.keyid);
				// var paperSite = document.querySelector('paper-typeahead-input-site');
				// var remoteUrl=filterSiteCust+keyCust+':siteName=%QUERY*&fields=siteId,siteName';
				// paperSite.setAttribute('remote-url', remoteUrl);
			// } else if (srcElement2.localName=="paper-typeahead-input-site") {
				// paperSpinner.setAttribute('active','');
				// $scope.selectedSite(data.keyid);
			// }
		// });
		
		 window.addEventListener( 'google-chart-render', function(e) {
			 paperSpinner.removeAttribute('active');
		 });

		// $scope.selectedCustomer = function(value) {	
			// var xAxisArray = new Array();
			// var yAxisArray = new Array();				
			// $http.get('https://analysis.run.asv-pr.ice.predix.io/getContractorDefects',config).success(function (data) {
				// var xAxisArray = new Array();
				// var yAxisArray = new Array();
				// var groups = {};
				// console.log(data);
				// // $.each(customerResponse, function(i, item) {
					// // var level = item.specification;
					// // delete item.specification;
					// // if(groups[level]) {
						// // groups[level].push(item);
					// // } else {
						// // groups[level] = [item];
					// // }
				// // });

				// // var result = $.map(groups, function(group, key) {
					// // var obj = {};
					// // obj[key] = group;
					// // return obj;
				// // });	

				// // angular.forEach(result, function(value, key) {
					// // angular.forEach(value, function(value1, key1) {
						// // console.log(key1);
						// // yAxisArray.push(value1.length);
						// // $http.get(fetchSkuByDeviceUrl+key1,config).success(function (deviceResponse) {
							// // for(var i=0;i<deviceResponse.length;i++){
								// // xAxisArray.push(deviceResponse[i].skuDescription);							
							// // }
						// // });
					// // });				
				// // });
				
				// $http.get(fetchCustomerByIdUrl+value ,config).success(function (customerResponse) {
					// $scope.customerResponseData = customerResponse;
				// });				
				
				// $('#tblCustomer').show();
				
				// setTimeout(function(){
					// $scope.jsonArr = [];
					// for(var i=0;i<yAxisArray.length;i++){
						// $scope.jsonArr.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
					// }				
					// $scope.createGraph($scope.jsonArr);
				// }, 3000);
			// });				
		// };
		


		


		$scope.flag=false;
		
	}]);
});
