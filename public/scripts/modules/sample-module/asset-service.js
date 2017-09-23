define(['angular', './sample-module'], function(angular, module) {
    'use strict';

    module.factory('assetService', ['$q', '$http', function($q, $http) {
               //var config='';'
		return{	
			 
		 getAssetdata:function(config){  
			     var siteUrl= "https://predix-asset.run.aws-usw02-pr.ice.predix.io/site";        
			    var deferred = $q.defer();

			$http.get(siteUrl,config).success(function(data,status,headers,XMLHTTPResponse){ 
					      //console.log(XMLHTTPResponse.headers); 
						 deferred.resolve(data);
						
											}).error(function(msg, code) {
                                                 deferred.reject(msg);
                                                 //$log.error(msg, code);
                                                   });
								 		//  alert(deferred.promise);
									return deferred.promise;

												//console.log('Token:'+accessToken);
											
                  }
	 
	}
	}]);
});
