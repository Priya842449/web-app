define(['angular', './sample-module'], function(angular, excelLoad) {
    'use strict';

    excelLoad.directive("fileread", [function ($rootScope) {
  return {
    scope: {
      opts: '=',
    },
	  link: function (scope, $elm, $attrs,$routeParams) {
      $elm.on('change', function (changeEvent) {
	     $("#uploadBar").hide();
		 $("#uploadInpro").hide();
		 $("#uploadSucc").hide();
		 $("#uploadFail").hide();
		  //$("#viewAssignedStages").hide();
			 //$("#excelExport").hide();
		  //$(".afterUpload").show()
        var reader = new FileReader();
        reader.onload = function (evt) {
          scope.$apply(function () {
            var data = evt.target.result;    
						console.log(data)	
			//var returnedArray=CSV2JSON(data)	
			window.localStorage.setItem("returnedArray", data);
			//console.log(returnedArray)
            var workbook = XLSX.read(data, {type: 'binary'});            
            var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];            
            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
		
            console.log(data);
            scope.opts.columnDefs = [];
            headerNames.forEach(function (h) {			
              scope.opts.columnDefs.push({ field: h,width:'200' });
            });
			
			 angular.forEach(data, function(item) {
				 if(item.StoreNumber!=undefined){
			 item.StoreNumber = item.StoreNumber.split(' ').join('');
				 }
			});
		
          scope.opts.data = data;
		  scope.opts.rowHeight = 70;
		  	 
            $elm.val(null);
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
		
      });
    }
  }
    
}]);

 excelLoad.directive("sitesummary", function(){
  return {   
    restrict : "A",  
    scope: {
	data: '=',
	},
    //templateUrl: "views/siteSummary.html",
    link: function(scope, element, attribute) {
     	  var fileField;
		  fileField = element.find('[type="file"]').on('change', function() {
          var file = this.files[0];
          /* $("#showFileList").append('<div id='+file.name+'>File name : ' + file.name */ /* +'<input type="button" value="Click me" onclick="angular.element(this).scope().removeFile(this)"/>' +'</div>'); +'  Type:'+ file.type +'<br /> '  ); */
		  scope.$parent.fileArray.push(file);			  
          console.log('asas'+scope.$parent.cmts);		  
		  console.log(scope.$parent.fileArray);	
          scope.$apply();		  
          })         		  
    }
  };
});

excelLoad.directive("designDirective", function(){
  return {   
    restrict : "A",  
    scope: {
	data: '=',
	},
    //templateUrl: "views/siteSummary.html",
    link: function(scope, element, attribute) {
     	  var fileField;
		  fileField = element.find('[type="file"]').on('change', function() {
          var file = this.files[0];
            
              
              var regEx = /^[a-zA-Z0-9\-\\_\(\)\s]+$/;
            var fileName = file.name.split('.')[0];
              
              if(file.name.split('.').length > 2) {
                scope.$parent.invalidFileName = true;
                scope.$parent.invalidMessage = "The file name should not contain special characters!";
                scope.$apply();
                return false;
              }
              
              
              
            if(!(regEx.test(fileName))) {
                scope.$parent.invalidFileName = true;
                scope.$parent.invalidMessage = "The file name should not contain special characters!";
                $('.uploadButton').removeAttr('dialog-dismiss','');
                scope.$apply();
                return false;
            } else {
                scope.$parent.invalidFileName = false;
                scope.$parent.invalidMessage = '';
                $('.uploadButton').attr('dialog-dismiss','');                
                  scope.$parent.fileArrayToUpload.push(file);
                scope.$parent.fileArray.push(file);
                  scope.$apply();	
                
            }
              
              
          /* $("#showFileList").append('<div id='+file.name+'>File name : ' + file.name */ /* +'<input type="button" value="Click me" onclick="angular.element(this).scope().removeFile(this)"/>' +'</div>'); +'  Type:'+ file.type +'<br /> '  ); */
              	  
          })         		  
    }
  };
})


    return excelLoad;
});