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
	controllers.controller('GraphCtrl', ['$http', '$log', 'PredixAssetService','$scope','commonServices', function ($http, $log, PredixAssetService, $scope,commonServices) {
		var config = '';
		var fetchAllDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?fields=serialNo,specification';
		//var fetchAllDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=10&fields=serialNo,specification';
		//var fetchSkuByDeviceUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?filter=uri=';
		var fetchSkuByDeviceUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?pageSize=10&filter=uri=';
		//var fetchDevicesByCustomerIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=customerId=';
		var fetchDevicesByCustomerIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?pageSize=10&filter=customerId=';
		var fetchCustomerByIdUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/customer?filter=customerId=';
		var fetchDevicesBySkuUrl = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/device?filter=siteId=';
		var fetchSiteById = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteId=';
		var filterSiteCust='https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=parent=/customer/'
		var chartType = 'line';
		$scope.xAxisTitle = 'SKU';
		$scope.chartTitle = 'Distribution of Devices by SKU';
		$scope.jsonArr = [];
		$scope.customerId;
		$scope.siteId;
		$scope.skuId;
		$scope.skuIdByCustomer;
		$scope.skuIdBySite;
		$scope.skuLinkArr = [];
		$scope.skuByCustomerLinkArr = [];
		$scope.skuBySiteLinkArr = [];
		$scope.skuResult = "";
		$scope.skuByCustomerResult = "";
		$scope.skuBySiteResult = "";
		var googleChartDivId = document.querySelector('#googleChart');
		var paperSpinner = document.querySelector('#paperSpinner');
		
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
			
			$scope.skuNext = function (){				
				var chartIndex = 0;
				$('#skuPrevious').prop('disabled', false);
				$("#skuPrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
					$scope.createSkuChartNext();
				}
			};
			
			$scope.skuPrevious = function (){				
				var chartIndex = 0;
				$('#skuNext').prop('disabled', false);
				$("#skuPrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
				$scope.createSkuChartPrev();
				}
			};

			$scope.skuByCustomerNext = function (){				
				var chartIndex = 0;
				$('#skuByCustomerPrevious').prop('disabled', false);
				$("#skuByCustomerPrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
					$scope.createSkuByCustomerChartNext();
				}
			};
			
			$scope.skuByCustomerPrevious = function (){				
				var chartIndex = 0;
				$('#skuByCustomerNext').prop('disabled', false);
				$("#skuByCustomerPrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
				$scope.createSkuByCustomerChartPrev();
				}
			};
			
			$scope.skuBySiteNext = function (){				
				var chartIndex = 0;
				$('#skuBySitePrevious').prop('disabled', false);
				$("#skuBySitePrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
					$scope.createSkuBySiteChartNext();
				}
			};
			
			$scope.skuBySitePrevious = function (){				
				var chartIndex = 0;
				$('#skuBySiteNext').prop('disabled', false);
				$("#skuBySitePrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
				$scope.createSkuBySiteChartPrev();
				}
			};			
			
			$scope.createSkuChart = function() {
				if($scope.skuLinkArr.length == 0) {
					$scope.skuLinkArr.push(fetchSkuByDeviceUrl);
					$('#skuPrevious').prop('disabled', true);
				}				
				$http.get(fetchAllDevicesBySkuUrl,config).success(function (response) {
					paperSpinner.setAttribute('active','');
					var xAxisArray = new Array();
					var yAxisArray = new Array();
					var groups = {};
					$.each(response, function(i, item) {
						var level = item.specification;
						delete item.specification;
						if(groups[level]) {
							groups[level].push(item);
						} else {
							groups[level] = [item];
						}
					});

					var result = $.map(groups, function(group, key) {
						var obj = {};
						obj[key] = group;
						return obj;
					});	

					angular.forEach(result, function(value, key) {
						angular.forEach(value, function(value1, key1) {
							console.log(key1);
							console.log(value1.length);
							yAxisArray.push(value1.length);
							$scope.skuId = key1;
							$http.get(fetchSkuByDeviceUrl+$scope.skuId,config).success(function (deviceResponse,headers,status,XMLHTTPResponse,Link) {
								if(!(status().link==undefined)) {
									console.log(status().link);
									var str=status().link;
									$scope.skuResult = str.substr(1,str.lastIndexOf(">")-1);
									console.log('Next Link : ' +$scope.skuResult);
								}								
								for(var i=0;i<deviceResponse.length;i++){
									xAxisArray.push(deviceResponse[i].skuDescription);							
								}
							});
						});				
					});
					
					setTimeout(function(){
						$scope.jsonArr = [];
						for(var i=0;i<xAxisArray.length;i++){
							$scope.jsonArr.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
						}
						var googleChartList = document.querySelectorAll('google-chart');
						//alert("List:"+googleChartList);
						if(!(googleChartList.length==0)) {
							for (var i=0;i<googleChartList.length;i++){
								googleChartDivId.removeChild(googleChartList[i]);								
							}													
						}					
						var chart = document.createElement('google-chart');
						chart.setAttribute('index', 0);
						var skuPrevNextDiv = document.querySelector('#skuPrevNext');
						$scope.createGraph(chart, $scope.jsonArr);
						googleChartDivId.appendChild(skuPrevNextDiv);
						$("#skuPrevNext").show();
					}, 3000);				
				});				
			};

			$scope.createSkuChart();
			
			$scope.createSkuChartNext = function(value){
				if($scope.skuResult!="") {
					$scope.skuLinkArr.push(fetchSkuByDeviceUrl);
					fetchSkuByDeviceUrl=$scope.skuResult;
				}
				$scope.createSkuChart();
			};

			$scope.createSkuChartPrev = function() {
				paperSpinner.setAttribute('active','');
				$scope.idList = [];
				console.log('$scope.linkArr : '+$scope.skuLinkArr);
				if($scope.skuLinkArr.length == 0) {
					fetchSkuByDeviceUrl='https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?pageSize=10&filter=uri='+$scope.skuId;
					$('#skuPrevious').prop('disabled', true);
					$scope.skuResult = "";
				} else {
					fetchSkuByDeviceUrl=$scope.skuLinkArr.pop();
					console.log('previous link '+fetchSkuByDeviceUrl);
					console.log('in else : ' +fetchSkuByDeviceUrl);
				}
				console.log('urlPrevCust : '+fetchSkuByDeviceUrl);
				$scope.createSkuChart();
			};

			$scope.createSkuByCustomerChartNext = function(value){
				if($scope.skuByCustomerResult!="") {
					$scope.skuByCustomerLinkArr.push(fetchSkuByDeviceUrl);
					fetchSkuByDeviceUrl=$scope.skuByCustomerResult;
				}
				$scope.selectedCustomer($scope.customerId);
			};

			$scope.createSkuByCustomerChartPrev = function() {
				paperSpinner.setAttribute('active','');
				$scope.idList = [];
				console.log('$scope.linkArr : '+$scope.skuByCustomerLinkArr);
				if($scope.skuByCustomerLinkArr.length == 0) {
					fetchSkuByDeviceUrl='https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?pageSize=10&filter=uri='+$scope.skuIdByCustomer;
					$('#skuByCustomerPrevious').prop('disabled', true);
					$scope.skuByCustomerResult = "";
				} else {
					fetchSkuByDeviceUrl=$scope.skuByCustomerLinkArr.pop();
					console.log('previous link '+fetchSkuByDeviceUrl);
					console.log('in else : ' +fetchSkuByDeviceUrl);
				}
				console.log('urlPrevCust : '+fetchSkuByDeviceUrl);
				$scope.selectedCustomer($scope.customerId);
			};
			
			$scope.createSkuBySiteChartNext = function(value){
				if($scope.skuBySiteResult!="") {
					$scope.skuBySiteLinkArr.push(fetchSkuByDeviceUrl);
					fetchSkuByDeviceUrl=$scope.skuBySiteResult;
				}
				$scope.selectedSite($scope.siteId);
			};

			$scope.createSkuBySiteChartPrev = function() {
				paperSpinner.setAttribute('active','');
				$scope.idList = [];
				console.log('$scope.linkArr : '+$scope.skuBySiteLinkArr);
				if($scope.skuBySiteLinkArr.length == 0) {
					fetchSkuByDeviceUrl='https://predix-asset.run.aws-usw02-pr.ice.predix.io/sku?pageSize=10&filter=uri='+$scope.skuIdBySite;
					$('#skuByCustomerPrevious').prop('disabled', true);
					$scope.skuBySiteResult = "";
				} else {
					fetchSkuByDeviceUrl=$scope.skuBySiteLinkArr.pop();
					console.log('previous link '+fetchSkuByDeviceUrl);
					console.log('in else : ' +fetchSkuByDeviceUrl);
				}
				console.log('urlPrevCust : '+fetchSkuByDeviceUrl);
				$scope.selectedSite($scope.siteId);
			};			
		});
	});
					
		$scope.swapChartType = function () {			
			var googleChartList = document.querySelectorAll('google-chart');			
			if(!(googleChartList.length==0)) {
				for (var i=0;i<googleChartList.length;i++){
					googleChartDivId.removeChild(googleChartList[i]);								
				}
 			$("#skuPrevNext").hide();
			$("#skuByCustomerPrevNext").hide();
			$("#skuBySitePrevNext").hide();			
			}			
			if(!(googleChartList.length==0)) {
				for (var i=0;i<googleChartList.length;i++){					
					if (googleChartList[i].getAttribute('type') == 'line') {
						var chart = document.createElement('google-chart');
						$scope.createAreaChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows')); 
					} else if (googleChartList[i].getAttribute('type') == 'area') {
						var chart = document.createElement('google-chart');
						$scope.createPieChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'));						
					} else if (googleChartList[i].getAttribute('type') == 'pie') {
						var chart = document.createElement('google-chart');
						$scope.createSteppedAreaChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'));
					} else if (googleChartList[i].getAttribute('type') == 'stepped-area') {
						var chart = document.createElement('google-chart');
						$scope.createColumnChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'));
					} else {
						var chart = document.createElement('google-chart');
						$scope.createLineChart(chart, googleChartList[i].getAttribute('index'), googleChartList[i].getAttribute('options'), googleChartList[i].getAttribute('cols'), googleChartList[i].getAttribute('rows'));
					}
 					if (googleChartList[i].getAttribute('index') == 0) {
						var skuPrevNextDiv = document.querySelector('#skuPrevNext');
						googleChartDivId.appendChild(skuPrevNextDiv);
						$("#skuPrevNext").show();
					} else if (googleChartList[i].getAttribute('index') == 1) {
						var skuByCustomerPrevNextDiv = document.querySelector('#skuByCustomerPrevNext');
						googleChartDivId.appendChild(skuByCustomerPrevNextDiv);
						$("#skuByCustomerPrevNext").show();
					} else if (googleChartList[i].getAttribute('index') == 2) {
						var skuBySitePrevNextDiv = document.querySelector('#skuBySitePrevNext');
						googleChartDivId.appendChild(skuBySitePrevNextDiv);
						$("#skuBySitePrevNext").show();
					}					
				}
			}		
		}
		
		$scope.reset = function () {
			var googleChartList = document.querySelectorAll('google-chart');
			if(!(googleChartList.length==0)) {
				for (var i=1;i<googleChartList.length;i++){
					googleChartDivId.removeChild(googleChartList[i]);								
				}													
			}
			$("#skuPrevNext").hide();
			$("#skuByCustomerPrevNext").hide();
			$("#skuBySitePrevNext").hide();			
			$scope.createSkuChart();
		};		

 		$scope.createLineChart = function(chart, index, options, cols, rows){
			chart.setAttribute('index', index);
			chart.setAttribute('type', 'line');
			chart.setAttribute('options', options);
			chart.setAttribute('cols', cols);
			chart.setAttribute('rows', rows);
			googleChartDivId.appendChild(chart);
		}; 
		
		$scope.createAreaChart = function(chart, index, options, cols, rows){
			chart.setAttribute('index', index);
			chart.setAttribute('type', 'area');
			chart.setAttribute('options', options);
			chart.setAttribute('cols', cols);
			chart.setAttribute('rows', rows);
			googleChartDivId.appendChild(chart);
		};
		
		$scope.createPieChart = function(chart, index, options, cols, rows){
			chart.setAttribute('index', index);
			chart.setAttribute('type', 'pie');
			chart.setAttribute('options', options);
			chart.setAttribute('cols', cols);
			chart.setAttribute('rows', rows);
			googleChartDivId.appendChild(chart);
		};
		
		$scope.createSteppedAreaChart = function(chart, index, options, cols, rows){
			chart.setAttribute('index', index);
			chart.setAttribute('type', 'stepped-area');
			chart.setAttribute('options', options);
			chart.setAttribute('cols', cols);
			chart.setAttribute('rows', rows);
			googleChartDivId.appendChild(chart);
		};
		
		$scope.createColumnChart = function(chart, index, options, cols, rows){
			chart.setAttribute('index', index);
			chart.setAttribute('type', 'column');
			chart.setAttribute('options', options);
			chart.setAttribute('cols', cols);
			chart.setAttribute('rows', rows);
			googleChartDivId.appendChild(chart);
		};		
		
		$scope.createGraph = function(chart, jsonArr){
			chart.setAttribute('type', chartType);
			chart.setAttribute('options','{"title": "'+$scope.chartTitle+'","hAxis": {"title": "'+$scope.xAxisTitle+'", "minValue": 0, "maxValue": 100},"vAxis": {"title": "No. of Devices", "minValue": 0, "maxValue": 100},"animation": {"startup": true, "duration": 1000, "easing": "in"}}');
			chart.setAttribute('cols','[{"label": "Type of Devices", "type": "string"},{"label": "No. of Devices", "type": "number"}]');
			chart.setAttribute('rows', '['+jsonArr+']');
			googleChartDivId.appendChild(chart);
		};	

		$scope.clear = function (){
			document.getElementById('serchselection').innerHTML = '';
			document.getElementById('serchselection').innerHTML = '';
			var inputCust = document.querySelector('paper-typeahead-input-customer');
			console.log(inputCust);
			inputCust.inputValue = '';
			inputCust.keyid = '';
			var inputSite = document.querySelector('paper-typeahead-input-site');
			inputSite.inputValue = '';
			inputSite.keyid = '';
			var inputSku = document.querySelector('paper-typeahead-input-sku');
			inputSku.inputValue = '';
			var paperSite = document.querySelector('paper-typeahead-input-site');
			var remoteUrl='https://predix-asset.run.aws-usw02-pr.ice.predix.io/site?filter=siteName=%QUERY*&fields=siteId,siteName';
			paperSite.setAttribute('remote-url', remoteUrl);	
		};		

		window.addEventListener('WebComponentsReady', function(e) {

		});

		window.addEventListener('pt-item-confirmed', function(e) {
			console.log(e);
			var srcElement2=e.srcElement;                                                                                                                                                                                                                                                                                                                                
			var data=srcElement2.__data__;
			var keyCust;			
			if (srcElement2.localName=="paper-typeahead-input-customer") {
				keyCust=data.keyid;	
				$scope.customerId=data.keyid;
				$scope.isCustomerSelected = true;
				var paperSite = document.querySelector('paper-typeahead-input-site');
				var remoteUrl=filterSiteCust+keyCust+':siteName=%QUERY*&fields=siteId,siteName';
				paperSite.setAttribute('remote-url', remoteUrl);
			} else if (srcElement2.localName=="paper-typeahead-input-site") {
				$scope.siteId = data.keyid;
				$scope.isSiteSelected = true;				
			}
		});
		
		window.addEventListener( 'google-chart-render', function(e) {
			paperSpinner.removeAttribute('active');
		});
		
 		$scope.searchCriteria = function (){
		
		
		
		
		
			var i=0;
			if ($scope.isCustomerSelected) 
               {
					
					if(document.getElementById('serchselection').hasChildNodes()){
								if(document.getElementById("cust") != null){
									document.getElementById("cust").parentNode.removeChild(document.getElementById("cust"));
								} 
							
					}
					
					
					var inputCust = document.querySelector('paper-typeahead-input-customer');
				     
                    i++;  
                    //var title = document.getElementById('test').value;
                    var node = document.createElement('label');        
                    node.innerHTML = '<label  style=" margin-right: 4px;color: Black; font-size: initial;" id="cust" for="check  ' + i + '"> Customer:'+inputCust.inputValue+'</label>';       
                    document.getElementById('serchselection').appendChild(node);   
					
                }
				 if ($scope.isSiteSelected) 
               {   
			        console.log("in selection");
					
					if(document.getElementById('serchselection').hasChildNodes()){
							if(document.getElementById("site") != null){
									document.getElementById("site").parentNode.removeChild(document.getElementById("site"));
								} 
					}
					
					var inputSite = document.querySelector('paper-typeahead-input-site');
                    i++;  
                    //var title = document.getElementById('test').value;
                    var node = document.createElement('label');        
                    node.innerHTML = '<label   style=" margin-right: 4px;color: Black; font-size: initial;" id="site" for="check ' + i + '">Site:'+inputSite.inputValue+'</label>';       
                    document.getElementById('serchselection').appendChild(node);    
                }
				
				if(document.querySelector('paper-typeahead-input-site').inputValue==""){
						if(document.getElementById("site") != null){
									document.getElementById("site").parentNode.removeChild(document.getElementById("site"));
								} 
				
				}
				
				
		
		
			if (!($scope.customerResponseData == null)){
				$scope.customerResponseData = "";				
			} 
			if (!($scope.siteResponseData == null)) {
				$scope.siteResponseData = "";
			}			
			if( $scope.isCustomerSelected ) {
				$("#skuPrevNext").hide();
				$("#skuBySitePrevNext").hide();	
				var googleChartList = document.querySelectorAll('google-chart');
				var chartIndex = 0;									
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){						
						googleChartDivId.removeChild(googleChartList[i]);
					}
					$scope.selectedCustomer($scope.customerId);
				} else {				
					$scope.selectedCustomer($scope.customerId);
				}
			} else if ( $scope.isSiteSelected ) {
			    $("#skuPrevNext").hide();
				$("#skuByCustomerPrevNext").hide();
				var googleChartList = document.querySelectorAll('google-chart');
				var chartIndex = 0;				
				if(!(googleChartList.length==0)) {
					for (var i=chartIndex;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);
					}
					$scope.selectedSite($scope.siteId);
				}else {				
					$scope.selectedSite($scope.siteId);
				} 
			}
			$scope.isCustomerSelected = false;
			$scope.isSiteSelected = false;		
		};		

		$scope.selectedCustomer = function(value) {
			if($scope.skuByCustomerLinkArr.length == 0) {
				$scope.skuByCustomerLinkArr.push(fetchSkuByDeviceUrl);
				$('#skuByCustomerPrevious').prop('disabled', true);
			}
			paperSpinner.setAttribute('active','');
			var xAxisArray = new Array();
			var yAxisArray = new Array();				
			$http.get(fetchDevicesByCustomerIdUrl+value+'<parent[t3]&fields=serialNo,specification',config).success(function (customerResponse) {				
				var groups = {};
				$.each(customerResponse, function(i, item) {
					var level = item.specification;
					delete item.specification;
					if(groups[level]) {
						groups[level].push(item);
					} else {
						groups[level] = [item];
					}
				});

				var result = $.map(groups, function(group, key) {
					var obj = {};
					obj[key] = group;
					return obj;
				});	

				angular.forEach(result, function(value, key) {
					angular.forEach(value, function(value1, key1) {
						console.log(key1);
						yAxisArray.push(value1.length);
						$scope.skuIdByCustomer=key1; 
						$http.get(fetchSkuByDeviceUrl+$scope.skuIdByCustomer,config).success(function (deviceResponse,headers,status,XMLHTTPResponse,Link) {
							if(!(status().link==undefined)) {
								console.log(status().link);
								var str=status().link;
								$scope.skuByCustomerResult = str.substr(1,str.lastIndexOf(">")-1);
								console.log('Next Link : ' +$scope.skuByCustomerResult);
							}							
							for(var i=0;i<deviceResponse.length;i++){
								xAxisArray.push(deviceResponse[i].skuDescription);							
							}
						});
					});				
				});
				
				$http.get(fetchCustomerByIdUrl+value ,config).success(function (customerResponse) {
					$scope.customerResponseData = customerResponse;
				});				
								
				setTimeout(function(){
					$scope.jsonArr = [];
					for(var i=0;i<xAxisArray.length;i++){
						$scope.jsonArr.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
					}
					var googleChartList = document.querySelectorAll('google-chart');
					//alert("List:"+googleChartList);
					if(!(googleChartList.length==0)) {
						for (var i=0;i<googleChartList.length;i++){
							googleChartDivId.removeChild(googleChartList[i]);								
						}													
					}					
					var chart = document.createElement('google-chart');
					chart.setAttribute('index', 1);
					var skuByCustomerPrevNextDiv = document.querySelector('#skuByCustomerPrevNext');
					$scope.createGraph(chart, $scope.jsonArr);
					googleChartDivId.appendChild(skuByCustomerPrevNextDiv);
					$("#skuByCustomerPrevNext").show();					
				}, 3000);				
			});				
		};
		
		$scope.selectedSite = function(value){
			if($scope.skuBySiteLinkArr.length == 0) {
				$scope.skuBySiteLinkArr.push(fetchSkuByDeviceUrl);
				$('#skuBySitePrevious').prop('disabled', true);
			}			
			var xAxisArray = new Array();
			var yAxisArray = new Array();
			paperSpinner.setAttribute('active','');
			$http.get(fetchDevicesBySkuUrl+value+'<site&fields=serialNo,specification',config).success(function (siteResponse) {				
				var groups = {};
				$.each(siteResponse, function(i, item) {
					var level = item.specification;
					delete item.specification;
					if(groups[level]) {
						groups[level].push(item);
					} else {
						groups[level] = [item];
					}
				});

				var result = $.map(groups, function(group, key) {
					var obj = {};
					obj[key] = group;
					return obj;
				});	

				angular.forEach(result, function(value, key) {
					angular.forEach(value, function(value1, key1) {
						console.log(key1);
						yAxisArray.push(value1.length);
						$scope.skuIdBySite=key1;
						$http.get(fetchSkuByDeviceUrl+$scope.skuIdBySite,config).success(function (deviceResponse,headers,status,XMLHTTPResponse,Link) {
							if(!(status().link==undefined)) {
								console.log(status().link);
								var str=status().link;
								$scope.skuBySiteResult = str.substr(1,str.lastIndexOf(">")-1);
								console.log('Next Link : ' +$scope.skuBySiteResult);
							}							
							for(var i=0;i<deviceResponse.length;i++){
								xAxisArray.push(deviceResponse[i].skuDescription);							
							}
						});
					});				
				});				
			});
			
			$http.get(fetchSiteById+value ,config).success(function (siteResponse) {
				$scope.siteResponseData = siteResponse;
			});			
			
			$scope.xAxisTitle = 'SKU';
			$scope.chartTitle = 'Distribution of Devices by SKU';
			setTimeout(function(){
				$scope.jsonArr = [];
				for(var i=0;i<xAxisArray.length;i++){
					$scope.jsonArr.push('["'+xAxisArray[i]+'",'+yAxisArray[i]+']'); 				
				}
				var googleChartList = document.querySelectorAll('google-chart');
				//alert("List:"+googleChartList);
				if(!(googleChartList.length==0)) {
					for (var i=0;i<googleChartList.length;i++){
						googleChartDivId.removeChild(googleChartList[i]);								
					}													
				}					
				var chart = document.createElement('google-chart');
				chart.setAttribute('index', 2);
				var skuBySitePrevNextDiv = document.querySelector('#skuBySitePrevNext');
				$scope.createGraph(chart, $scope.jsonArr);
				googleChartDivId.appendChild(skuBySitePrevNextDiv);
				$("#skuBySitePrevNext").show();
			}, 3000);
		};					
	}]);
});
