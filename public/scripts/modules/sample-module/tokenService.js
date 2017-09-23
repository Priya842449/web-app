define(['angular', './sample-module'], function(angular, module) {
    'use strict';

    module.factory('tokenService', ['$q', '$http', function($q, $http) {
               //var config='';'
			
			 
			var getAuthToken = function(){  
			                   
			    var deferred = $q.defer();
			   var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';
                                    var headersConfig = {
									headers : {
										'content-Type' : 'application/x-www-form-urlencoded',
										'authorization' : 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
									}
							};

			$http.post(commonServices.getauthTokenURL(),data,headersConfig)
									.success(function(data){ 
									 var accessToken = data.access_token;
									  var auth = 'bearer '+ accessToken;

												var config = {
														headers : {
															'Authorization' : auth,
															'Content-Type' : 'application/json',
															'Predix-Zone-Id' : '0da112ff-f441-4362-ac52-c5bc1752e404'
														}
												};
									          deferred.resolve(config);
											                     
													// var auth = 'bearer '+ accessToken;

												// config = {
														// headers : {
															// 'Authorization' : auth,
															// 'Content-Type' : 'application/json',
															// 'Predix-Zone-Id' : '0da112ff-f441-4362-ac52-c5bc1752e404'
														// }
												// };
												
											}).error(function(msg, code) {
                                                 deferred.reject(msg);
                                                 //$log.error(msg, code);
                                                   });
								 		//  alert(deferred.promise);
									return deferred.promise;

												//console.log('Token:'+accessToken);
											
                  }
	  return {        
	           getToken:getAuthToken
	  }
	
	}]);
});
