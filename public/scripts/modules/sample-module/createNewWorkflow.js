define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('createNewWorkflowCntrl', ['$state', '$scope', '$timeout', '$http', '$compile', '$log', 'PredixAssetService',
        'PredixViewService', 'commonServices',
        'reportServices', 'dashboardService', '$filter',
        function ($state, $scope, $timeout, $http, $compile, $log, PredixAssetService, PredixViewService, commonServices, reportServices, dashboardService, $filter) {

           $scope.selectedRows1 = [];
            $scope.save = [];
            
			
			 $http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllCustomers').success(function(response) {	
			$scope.customers = response;		
	});
			
			
		$http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllTemplate').success(function(response) {	
			$scope.template = response;		
	});
			
			$http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllWorkFLowNames').success(function(response) {	
			$scope.workflowTemplate = response;		
	});
			
			$http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllBusiness').success(function(response) {	
			$scope.business = response;		
	});
	
	$http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllRefBusinessProcess').success(function(response) {	
			$scope.requestId = response;		
	});
	
	$http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllStageNames').success(function(response) {	
			$scope.stageNames = response[0].allStages;	
			console.log('All Stgaes'+JSON.stringify($scope.stageNames));
	});
			
	
		$http.get('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/getAllStageNames').success(function(response) {	
		console.log('Data in stages..'+JSON.stringify($scope.workFlowData));			
			
			//$scope.dropStages=['Survey','PM Survey Approval','Design','Proposal','Purchase Order','Install Draw','Install Draw PM','Installation','Ready For Post Audit','Post Audit'];
			$scope.dropdown2=["N","Y"];
			$scope.dropdown3=["N","Y"];
			$scope.dropdown1 =response[0].allStages;
			var rejectApplicable = "";
			var nextStageReject ="";
			var sendBackApplicable ="";
			
			console.log('Data in stages..'+JSON.stringify($scope.dropdown1));
			var responseData = response;
			var projectData = [];
					
				for (var i = 0; i < responseData.length; i++){
					
					if(responseData[i].stages!== undefined){
					var	stages=responseData[i].stages;
					}
					else var stages='';
					
					if(responseData[i].seq!== undefined){
						var seq=responseData[i].seq;
						}
					else var seq='';
					
					var nodeObj111 = {
						stages: stages,
						seq:seq,
						rejectApplicable:rejectApplicable,
						nextStageReject:nextStageReject,
						sendBackApplicable:sendBackApplicable
						
					}

					projectData.push(nodeObj111);
				}
			
			$scope.workFlowManipulatedData = projectData;			
	});
	
	
	       
        /*     $scope.workFlowData = [
        {

            'stages':'Survey',
           
            'seq':'10',
             'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
            'sendBackButtonApplicable':'-'
        },{

            'stages':'PM Survey Approval',
            
            'seq':'20',
             'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
            'sendBackButtonApplicable':'-'
        },{

           'stages':'Design',
           
            'seq':'30',
             'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
          'sendBackButtonApplicable':'-'
        },{

            'stages':'Design Approval',
           
            'seq':'40',
             'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
            'sendBackButtonApplicable':'-'
        },{

           'stages':'Proposal',
            
            'seq':'50',
            'rejectButtonApplicable':'-',
            'nextstageOnReject':'-',
            'sendBackButtonApplicable':'-'
        },{

            'stages':'PO',
           
            'seq':'60',
           'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
            'sendBackButtonApplicable':'-'
        },{

            'stages':'Installation Drawing',
            
            'seq':'70',
            'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
            'sendBackButtonApplicable':'-'
        },{

            'stages':'Installation Drawing Approval',
            
            'seq':'80',
            'rejectButtonApplicable':'-',
           'nextStageOnReject':'-',
           'sendBackButtonApplicable':'-'
        },{

            'stages':'Installation',
           
            'seq':'90',
            'rejectButtonApplicable':'-',
            'nextStageOnReject':'-',
           'sendBackButtonApplicable':'-'
        },{
            
            'stages':'Post Audit',
            'seq':'100',
             'rejectButtonApplicable':'Y',
            'nextStageOnReject':'-',
            'sendBackButtonApplicable':'Y'
        }];
            
       $scope.dropdown1 = [
                "Survey",
                "PM Survey Approval",
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

            */

            
            
            
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
					var isNotExist = true;
                 angular.forEach($scope.selectedRows1,function(value,key){
                      var temp = {};
					 // console.log('Data on submit',$scope.selectedRows1);
                     temp.stages  = value.row.row.stages.value;
                     temp.seq  = value.row.row.seq.value;
                     temp.rejectButtonApplicable  = value.row.row.rejectApplicable.value;
                     temp.nextStageOnReject  = value.row.row.nextStageReject.value;
                    temp.sendBackApplicable  = value.row.row.sendBackApplicable.value;
                     
                     workFlowStagesObj.push(temp);
                     
                 })
                 
				var object = {};
				
				 object.workFlowName=$('input#workFlowName').val();
				 var workflowNameFilled = object.workFlowName;
				 console.log('Name',object.workFlowName);
			object.customer = document.getElementById("customer").value;;
			object.business = document.getElementById("business").value;;
			object.requestId = document.getElementById("requestId").value;
			object.workStages = workFlowStagesObj;
				 workFlowSubmitObject=object;
				 
				 
                 console.log("work flow stage data"+JSON.stringify(workFlowSubmitObject));
				 
				var workflowNames =$scope.workflowTemplate;
				console.log('WorkFlowNames',workflowNames);
				for (var i = 0; i < workflowNames.length; i++){
					if(workflowNames[i]==workflowNameFilled)
						
						isNotExist = false;
				}
				//$http.post('http://localhost:8080/workflow/SubmitWorkflowTemplate',workFlowSubmitObject);
				if(isNotExist){
				$http.post('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/SubmitWorkflowTemplate',workFlowSubmitObject)
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
				else{
					
					document.getElementById("message").innerHTML = 'Name already Exist';
					document.getElementById("newWorkflow").reset();
				}
				
        
				//setTimeout(function () { window.location.reload(); }, 10);
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
				 
				
				//$http.post('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/SubmitWorkflowTemplate',workFlowSubmitObject);
				
				$http.post('https://dt-admin-microservice-dev-wf.run.aws-usw02-pr.ice.predix.io/workflow/saveMappingWithStages',stageTemplateMappingObject)
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