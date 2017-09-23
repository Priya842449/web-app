define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('createNewWorkflowCntrl', ['$state', '$scope', '$timeout', '$http', '$compile', '$log', 'PredixAssetService',
        'PredixViewService', 'commonServices',
        'reportServices', 'dashboardService', '$filter',
        function ($state, $scope, $timeout, $http, $compile, $log, PredixAssetService, PredixViewService, commonServices, reportServices, dashboardService, $filter) {
            
            
             var count = 0;
        var countloop = 0;
        var screenId = "100";
        $scope.ContractorFlag = false;
        $scope.selectedRows1 = [];
        $scope.countSelectedRows = 0;
        $scope.dropdown = [];
        $scope.siterequestIdList = [];

           $scope.selectedRows1 = [];
            $scope.save = [];
            
           
            
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
            
  
            
            
         
           $scope.selectedRows1 = [];
             $scope.saveRequestData = function() {
                  console.log("test",JSON.stringify($scope.selectedRows1));
                    var workFlowStageObject=[];
                 angular.forEach($scope.selectedRows1,function(value,key){
                      var temp = {};
                     temp.Stage  = value.row.row.Stage.value;
                     temp.Seq  = value.row.row.Seq.value;
                     temp.RejectButtonApplicable  = value.row.row.RejectButtonApplicable.value;
                    temp.NextStageOnReject  = value.row.row.NextStageOnReject.value;
                     temp.SendBackButtonApplicable  = value.row.row.SendBackButtonApplicable.value;
                     workFlowStageObject.push(temp);
                     
                 })
                 
                 console.log("work flow stage data-------------------------",workFlowStageObject);
        
        };
             
               
           
          
            
            
        }]);
});