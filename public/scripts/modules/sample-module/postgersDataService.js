define(['angular', './sample-module'], function(angular, module) {
    'use strict';

    module.factory('postgersDataService', ['$q', '$http', function($q, $http) {
               //var config='';'
		return{	
			 
		 getPostgresdata:function(){  
			   var postgresSiteRef="http://3.209.97.4:8080/admin/getActiveSites";        
			    var deferred = $q.defer();

			$http.get(postgresSiteRef).success(function(data){ 
						deferred.resolve(data);
											}).error(function(msg, code) {
                                                 deferred.reject(msg);
                                                 //$log.error(msg, code);
                                                   });
								 		// alert(deferred.promise);
									return deferred.promise;

												//console.log('Token:'+accessToken);
											
                  }
	 
	}
	}]);
});
