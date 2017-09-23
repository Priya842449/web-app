define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('createNewWorkflowCntrl', ['$state', '$scope', '$timeout', '$http', '$compile', '$log', 'PredixAssetService',
        'PredixViewService', 'commonServices',
        'reportServices', 'dashboardService', '$filter',
        function ($state, $scope, $timeout, $http, $compile, $log, PredixAssetService, PredixViewService, commonServices, reportServices, dashboardService, $filter) {

           $scope.selectedRows1 = [];
            $scope.save = [];
            
			
			 $http.get('http://localhost:8080/workflow/getAllCustomers').success(function(response) {	
			$scope.customers = response;		
	});
			
			
		$http.get('http://localhost:8080/workflow/getAllTemplate').success(function(response) {	
			$scope.template = response;		
	});
			
			$http.get('http://localhost:8080/workflow/getAllWorkFLowNames').success(function(response) {	
			$scope.workflowTemplate = response;		
	});
			
			$http.get('http://localhost:8080/workflow/getAllBusiness').success(function(response) {	
			$scope.business = response;		
	});
	
	$http.get('http://localhost:8080/workflow/getAllRefBusinessProcess').success(function(response) {	
			$scope.requestId = response;		
	});
	
	$http.get('http://localhost:8080/workflow/getAllStageNames').success(function(response) {	
			$scope.stageNames = response[0].allStages;	
			console.log('All Stgaes'+JSON.stringify($scope.stageNames));
	});
			
	
		/* $http.get('http://localhost:8080/workflow/getAllStageNames').success(function(response) {	
			$scope.workFlowData = response;		
			$scope.dropdown =[];
			$scope.dropStages=['Survey','PM Survey Approval','Design','Proposal','Purchase Order','Install Draw','Install Draw PM','Installation','Ready For Post Audit','Post Audit'];
			//$scope.dropSendBackYN=['N','Y'];
			//$scope.dropRejYN=['N','Y'];
			//$scope.dropdown = ['Survey','Survey Approval'];
	});
	*/
	
	       
             $scope.workFlowData = [
        {

            'Stage':'Survey',
           
            'Seq':'10',
             'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'-'
        },{

            'Stage':'Survey Approval',
            
            'Seq':'20',
             'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'-'
        },{

           'Stage':'Design',
           
            'Seq':'30',
             'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
          'SendBackButtonApplicable':'-'
        },{

            'Stage':'Design Approval',
           
            'Seq':'40',
             'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'-'
        },{

           'Stage':'Proposal',
            
            'Seq':'50',
            'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'-'
        },{

            'Stage':'PO',
           
            'Seq':'60',
           'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'-'
        },{

            'Stage':'Installation Drawing',
            
            'Seq':'70',
            'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'-'
        },{

            'Stage':'Installation Drawing Approval',
            
            'Seq':'80',
            'RejectButtonApplicable':'-',
           'NextStageOnReject':'-',
           'SendBackButtonApplicable':'-'
        },{

            'Stage':'Installation',
           
            'Seq':'90',
            'RejectButtonApplicable':'-',
            'NextStageOnReject':'-',
           'SendBackButtonApplicable':'-'
        },{
            
            'Stage':'Post Audit',
            'Seq':'100',
             'RejectButtonApplicable':'Y',
            'NextStageOnReject':'-',
            'SendBackButtonApplicable':'Y'
        }];
            
       $scope.dropdown1 = [
                "survey",
                "pmSurveyApproval",
                "design",
                "proposal",
                "purchaseOrder",
                "installDraw",
                "installDrawPM",
                "installation",
                "readyForPostAudit",
                "postAudit"
            ];
            
         $scope.dropdown2 = [
                "Y",
                "N"
            ];
        
        $scope.dropdown3 = [
               "Y",
                "N"
            ];

            

            
            
            
            document.getElementById("workFlowStage").addEventListener("px-row-click", function(e) {
            console.log("----", e.detail)
            var flag = true;
            var tempLength = $scope.selectedRows1.length;
            window.setTimeout(function() {
                if ((e.detail).row._selected == true) { 
                    if (tempLength == 0) {
                        $scope.selectedRows1.push(e.detail);
                        flag = false;
                    } else {
                        for (var j = 0; j < tempLength; j++) {
                            if ((e.detail).row.row.dataIndex == $scope.selectedRows1[j].row.row.dataIndex) {
                                $scope.selectedRows1[j].row._selected = true;
                                flag = false;
                            }
                        }
                    }
                    if (flag == true) {
                        $scope.selectedRows1.push(e.detail);
                    }
                }
            }, 500);


        });
            
            
           
            $scope.multiTicket = [];
            $scope.selectedRows1 = [];
             $scope.saveRequestData = function() {
				 
                 // console.log("test",JSON.stringify($scope.selectedRows1));
                    var workFlowStageObject={};
					var workFlowSubmitObject;
					var workFlowStagesObj=[];
                 angular.forEach($scope.selectedRows1,function(value,key){
                      var temp = {};
					 // console.log('Data on submit',$scope.selectedRows1);
                     temp.stages  = value.row.row.stages.value;
                     temp.seq  = value.row.row.seq.value;
                     temp.rejectButtonApplicable  = value.row.row.rejectButtonApplicable.value;
                     temp.nextStageOnReject  = value.row.row.allStages.value;
                    temp.sendBackApplicable  = value.row.row.sendBackButtonApplicable.value;
                     
                     workFlowStagesObj.push(temp);
                     
                 })
                 
				var object = {};
				
				 object.workFlowName=$('input#workFlowName').val();
				 console.log('Name',object.workFlowName);
			object.customer = document.getElementById("customer").value;;
			object.business = document.getElementById("business").value;;
			object.requestId = document.getElementById("requestId").value;
			object.workStages = workFlowStagesObj;
				 workFlowSubmitObject=object;
				 
				 
                 console.log("work flow stage data"+JSON.stringify(workFlowSubmitObject));
				 
				
				//$http.post('http://localhost:8080/workflow/SubmitWorkflowTemplate',workFlowSubmitObject);
				
				$http.post('http://localhost:8080/workflow/SubmitWorkflowTemplate',workFlowSubmitObject)
			.success(function(data) {
				console.log('Inserted Successfully');
				
				 document.getElementById("message").innerHTML = 'Data Inserted Successfully';

				document.getElementById("newWorkflow").reset();
				
			}).error(function(data) {
				console.log('Not Inserted Successfully');
				 document.getElementById("message").innerHTML = 'Not Inserted Successfully';

				document.getElementById("newWorkflow").reset();
			});
        
        }
             
               $scope.saveTemplateMapping = function() {
				   
				  
                var object = {};
				var stageTemplateMappingObject;
				var item1 =document.getElementById("template").value;
				var item2 =document.getElementById("stageNames").value;
				var item3 =document.getElementById("workflowTemplate").value;
				
				
				 object.template=item1;
				 object.stage=item2;
				 object.workflowTemplate=item3;
				 object.cardId=$('input#cardId').val();
				 stageTemplateMappingObject=object;
				 
				 
                 console.log("stage template mapping data"+JSON.stringify(stageTemplateMappingObject));
				 
				
				//$http.post('http://localhost:8080/workflow/SubmitWorkflowTemplate',workFlowSubmitObject);
				
				$http.post('http://localhost:8080/workflow/saveMappingWithStages',stageTemplateMappingObject)
			.success(function(data) {
				console.log('Stage Template Mapping Data Inserted Successfully');
				
				 document.getElementById("messageTemplate").innerHTML = 'Data Inserted Successfully..';

				document.getElementById("newWorkflows").reset();
				
			}).error(function(data) {
				console.log('Stage Template Mapping Data Failed .!');
				 document.getElementById("messageTemplate").innerHTML = 'Not Inserted Successfully';

				document.getElementById("newWorkflows").reset();
			});
        
        }  
     
                   
          
            
            
        }]);
});