/**
* Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
* Customize your widgets by:
*  - Overriding or extending widget API methods
*  - Changing widget settings or options
*/
/* jshint unused: false */
define(['angular',
        'sample-module'
], function (angular, controllers) {
	'use strict';
	
	// Controller definition
	controllers.controller('ReportsCtrl', ['$http', '$log', 'PredixAssetService','$scope', 'commonServices',function ($http, $log, PredixAssetService, $scope,commonServices) {
		
		var config = {headers: {
			'Content-Type':'application/json',
			'Authorization':'Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIwYzMwMGM1Zi02MzFiLTQyMDAtOGJmMC1hMWE1ODQ5ZTY5ZTUiLCJzdWIiOiJjdXJyZW50RGlnaXRhbFR3aW4iLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiLCJwcmVkaXgtYXNzZXQuem9uZXMuNzg2MGFmNDItOTIxMi00OTcxLTkwNDMtNDhlM2IzYTJiNGY1LnVzZXIiXSwiY2xpZW50X2lkIjoiY3VycmVudERpZ2l0YWxUd2luIiwiY2lkIjoiY3VycmVudERpZ2l0YWxUd2luIiwiYXpwIjoiY3VycmVudERpZ2l0YWxUd2luIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiJkYWExNWM5NSIsImlhdCI6MTQ2MzM2NzM5MiwiZXhwIjoxNDYzNDEwNTkyLCJpc3MiOiJodHRwczovLzhjOGRlYTRhLTdlZWItNDM4NC05ZTU4LWY0Y2I0NzNmNzRmZi5wcmVkaXgtdWFhLnJ1bi5hc3YtcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjhjOGRlYTRhLTdlZWItNDM4NC05ZTU4LWY0Y2I0NzNmNzRmZiIsImF1ZCI6WyJjdXJyZW50RGlnaXRhbFR3aW4iLCJ1YWEiLCJwcmVkaXgtYXNzZXQuem9uZXMuNzg2MGFmNDItOTIxMi00OTcxLTkwNDMtNDhlM2IzYTJiNGY1Il19.ey05N-JiZP8A9Cfni-Gk00XUY8WvAgO-r2CHOUMOx_EoS4nY1L9pCfg3hh8ciIAElQVMWqLvwwbjSd8EbTEuAaYXXaxPXYtFIZ-HZjMZhfBq3_rxCT3MPof_op4SZCk31nmrO4aLyXzT-5uYMUFR-_wMrzKC_dfqBIb8BsmWLZspNoPw9uFMlciKwkziVNiyRcXHRw_gByhcEGONnF5fJ4nXsXV_BYC8EP2d45mRvagOE70x0o80ODnLHxNTEibfdKHRinJX5yH7uzH74ggE4AsSLh9nbZmsNitHKQqhyv0BOo6JinJKEXjPierioWFlKkdJEdXSXkEmmEmedqUhQg',
			'Predix-Zone-Id':'0da112ff-f441-4362-ac52-c5bc1752e404'
			}
		};
				
		var barGraph = document.querySelector('#barGraph');
		var pieChart = document.querySelector('#pieChart');
		var paperSpinner = document.querySelector('#paperSpinner');
		
		$scope.createBarGraph = function(jsonArr){
			console.log(jsonArr)
			barGraph.setAttribute('id','barGraph');
			barGraph.setAttribute('type', 'column');
			barGraph.setAttribute('options','{"title": "View of Devices","vAxis": {"minValue" : 0, "maxValue": 100}}');
			barGraph.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Devices", "type": "number"}]');
			barGraph.setAttribute('rows', '['+jsonArr+']');
			//barGraph.setAttribute('idList', '['+idList+']');
		};
		
		$scope.createBarGraph1 = function(jsonArr, idList){
			barGraph.setAttribute('id','barGraph');
			barGraph.setAttribute('type', 'column');
			barGraph.setAttribute('options','{"title": "View of Devices","vAxis": {"minValue" : 0, "maxValue": 100}}');
			barGraph.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Devices", "type": "number"}]');
			barGraph.setAttribute('rows', '['+jsonArr+']');
			barGraph.setAttribute('idList', idList);
		};
		
		$scope.createPieChart = function(jsonArr){
			pieChart.setAttribute('id','pieChart');
			pieChart.setAttribute('type', 'pie');
			pieChart.setAttribute('options','{"title": "View of Devices","vAxis": {"minValue" : 0, "maxValue": 100}}');
			pieChart.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Devices", "type": "number"}]');
			pieChart.setAttribute('rows', '['+jsonArr+']');
		};
		
		$scope.createPieChart1 = function(jsonArr, idList){
			pieChart.setAttribute('id','pieChart');
			pieChart.setAttribute('type', 'pie');
			pieChart.setAttribute('options','{"title": "View of Devices","vAxis": {"minValue" : 0, "maxValue": 100}}');
			pieChart.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Devices", "type": "number"}]');
			pieChart.setAttribute('rows', '['+jsonArr+']');
			pieChart.setAttribute('idList', idList);
		};
		
		var unique = function(origArr) {
			var newArr = [],
				origLen = origArr.length,
				found, x, y;

			for (x = 0; x < origLen; x++) {
				found = undefined;
				for (y = 0; y < newArr.length; y++) {
					if (origArr[x] === newArr[y]) {
						found = true;
						break;
					}
				}
				if (!found) {
					newArr.push(origArr[x]);
				}
			}
			return newArr;
		}
		
		window.addEventListener('WebComponentsReady', function(e) {
			$('#pieChart').hide();			
		});

		window.addEventListener('pt-item-confirmed', function(e) {
			//alert("Hi");
			console.log(e);
			var srcElement2=e.srcElement;                                                                                                                                                                                                                                                                                                                                
			var data=srcElement2.__data__;
			var keyCust;			
			if (srcElement2.localName=="paper-typeahead-input-customer") {
				//alert(data.keyid);
				keyCust=data.keyid;				
				//alert('cust'+keyCust);
				$('#paperSpinner').show();
				$scope.selectedCustomer(data.keyid);
				var paperSite = document.querySelector('paper-typeahead-input-site');
				var remoteUrl='https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=customer=/customer/'+keyCust+':siteName=%QUERY*&fields=siteId,siteName';
				//alert(remoteUrl);
				paperSite.setAttribute('remote-url', remoteUrl);
			} else if (srcElement2.localName=="paper-typeahead-input-site") {
				//alert("Site Id"+data.keyid);
				$('#paperSpinner').show();
				$scope.selectedSite(data.keyid);
			}
		});
		
		window.addEventListener( 'google-chart-render', function(e) {
			$('#paperSpinner').hide();
		});
		
 		window.addEventListener( 'google-chart-select', function(e) {
			console.log(e);
			var srcElem = e.srcElement;
			var objArr = srcElem.getAttribute('idList');
			var objArray = new Array();
			objArray = objArr.split(','); 
			//alert(JSON.parse(objArr));
			//alert(objArray);
			console.log(objArr);
			var selectedSiteIndex = srcElem.__data__.selection[0].row;
			console.log('selected site row '+selectedSiteIndex);			
			//alert("ID"+objArray[selectedSiteIndex]);
			$('#paperSpinner').show();
			$scope.selectedSite(objArray[selectedSiteIndex]);		
		}); 		

		$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?fields=customerId,customerName1',config).success(function (response) {
			var xAxisArray = new Array();
			var yAxisArray = new Array();
			var uniqueXAxisArray = new Array();
			var uniqueYAxisArray = new Array();
			var iDlist = new Array();
			for(var i=0;i<response.length;i++){
				xAxisArray.push(response[i].customerName1);
				uniqueXAxisArray = unique(xAxisArray);				
				$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?fields=siteId,siteName&filter=(customerId='+response[i].customerId+')<customer',config).success(function (customerResponse) {
					for(var i=0;i<customerResponse.length;i++){
						//alert(customerResponse.length);
						//alert(customerResponse[i].siteId);
						$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=(siteId='+customerResponse[i].siteId+')<site',config).success(function (siteResponse) {
							var total = 0;
							for(var i=0;i<siteResponse.length;i++){
								var len = siteResponse.length;
								yAxisArray.push(len);
								uniqueYAxisArray = unique(yAxisArray);	
							}							
						});							
					}
				});	
			}
			setTimeout(function(){
				var jsonArr = [];	
				var total= 0;				
				for(var i=0;i<uniqueXAxisArray.length;i++){					
					jsonArr.push('["'+uniqueXAxisArray[i]+'",'+uniqueYAxisArray[i]+']'); 				
				}
				$scope.createBarGraph(jsonArr);
				$scope.createPieChart(jsonArr);
			}, 3000);
		});	
		
		$scope.selectedCustomer = function(value) {
			//alert("Hi inside selected customer");
			//alert(value);			
			$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?fields=siteId,siteName&filter=(customerId='+value+')<customer',config).success(function (response) {
				//alert(response);
				var xAxisArray = new Array();
				var yAxisArray = new Array();
				var uniqueXAxisArray = new Array();
				var uniqueYAxisArray = new Array();
				var iDlist = new Array();
				for(var i=0;i<response.length;i++){
					console.log(response[i].siteName);
					xAxisArray.push(response[i].siteName);
					uniqueXAxisArray = unique(xAxisArray);
					iDlist.push(response[i].siteId);
					//iDlist.push('{"siteId",'+response[i].siteId+'}');
					//alert("Unique Xaxis"+uniqueXAxisArray);
					//alert("SKU"+response[i].siteId);					
					$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=(siteId='+response[i].siteId+')<site',config).success(function (customerResponse) {
						for(var i=0;i<customerResponse.length;i++){
								var len = customerResponse.length;
								yAxisArray.push(customerResponse.length);
								uniqueYAxisArray = unique(yAxisArray);
						}
					});		
				}
				setTimeout(function(){
					var jsonArr = [];							
					for(var i=0;i<uniqueYAxisArray.length;i++){
						jsonArr.push('["'+uniqueXAxisArray[i]+'",'+uniqueYAxisArray[i]+']'); 				
					}					
					$scope.createBarGraph1(jsonArr, iDlist);
					$scope.createPieChart1(jsonArr, iDlist);
				}, 3000);				
			});
		};

		$scope.selectedSite = function(value){
			//alert("Hi inside selected site");
			$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=(siteId='+value+')<site',config).success(function (response) {
				var xAxisArray = new Array();
				var yAxisArray = new Array();
				var uniqueXAxisArray = new Array();
				var uniqueYAxisArray = new Array();
				for(var i=0;i<response.length;i++){
					console.log(response[i].sku);
					//alert("SKU"+response[i].sku);
					$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=' + response[i].sku,config).success(function (deviceResponse) {
						for(var i=0;i<deviceResponse.length;i++){
							//alert(deviceResponse[i].productHierarchy);
							$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/productHierarchy?filter=uri=' + deviceResponse[i].productHierarchy,config).success(function (skuResponse) {
								for(var i=0;i<skuResponse.length;i++){
									//alert(skuResponse[i].productHierarchyId);									
									xAxisArray.push(skuResponse[i].productHierarchyId);
									uniqueXAxisArray = unique(xAxisArray);
									//alert("Unique Xaxis"+uniqueXAxisArray);
									$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=productHierarchy=' + skuResponse[i].uri,config).success(function (productHierarchyResponse) {
										for(var i=0;i<productHierarchyResponse.length;i++){
											$http.get('https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=sku='+productHierarchyResponse[i].uri,config).success(function (responseType) {
												var len = responseType.length;
												yAxisArray.push(responseType.length);
												uniqueYAxisArray = unique(yAxisArray);
												//alert("Y axis"+uniqueYAxisArray);
											}); 
										}
									setTimeout(function(){
										var jsonArr = [];
										for(var i=0;i<uniqueYAxisArray.length;i++){
											jsonArr.push('["'+uniqueXAxisArray[i]+'",'+uniqueYAxisArray[i]+']'); 				
										}					
										$scope.createBarGraph(jsonArr);
										$scope.createPieChart(jsonArr);
									}, 3000);				
									});									
								}																	
							});	
						}	
					});	
				}

			});			
		}		
	}]);
});