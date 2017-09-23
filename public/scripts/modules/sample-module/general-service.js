define(['angular', './sample-module'], function(angular, sampleModule) {
    'use strict';

    //Dev URLs

    var blobStoreURL = "https://dt-blobstore-microservice-dev.run.aws-usw02-pr.ice.predix.io";
    var adminServiceURL = "https://dt-admin-microservice-dev.run.aws-usw02-pr.ice.predix.io";
    var surveyServiceURL = 'https://dt-survey-microservice-dev.run.aws-usw02-pr.ice.predix.io';
    var refTablePoolURL = "https://dt-ref-pool-microservice-dev.run.aws-usw02-pr.ice.predix.io";
    var authTokenURL = "https://3239cd0c-9cfd-4cae-b9dd-6d357421a6a2.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token";
    var assetURL = "https://predix-asset.run.aws-usw02-pr.ice.predix.io";
    var mapLocation = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var reportserviceURL = "https://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io";
    var designUrl = 'https://dt-design-microservice-dev.run.aws-usw02-pr.ice.predix.io';
    var menuUrl = 'https://dt-menucontrol-microservice-dev.run.aws-usw02-pr.ice.predix.io';
    var progressreportURL = "http://dt-report-microservice-dev.run.aws-usw02-pr.ice.predix.io/siteDetailslist?siteid=";
    var analyticsUrl = "https://dt-programoverview-analytics-microservice-dev.run.aws-usw02-pr.ice.predix.io";
    var contractorMaster = "https://dt-contractor-master-microservice-dev.run.aws-usw02-pr.ice.predix.io";

    var ssoObj = window.localStorage.getItem("SSO_ID");
   // //console.log('general', ssoObj);
    //testing
    //	var adminServiceURL =" http://3.209.34.62:8080/";
    //var surveyServiceURL = " http://3.209.34.62:8081";

    // var stageIdONE = 1;  //Survey
    // var stageIdTWO = 2;  //PM Survey Approval
    // var stageIdTHREE = 3; //Design
    // var stageIdFOUR = 4;  //PM Design Approval
    // var stageIdFIVE = 5;  //Proposal
    // var stageIdSIX = 6;  //Purchase Order
    // var stageIdSEVEN = 7;  //Install Drawing
    // var stageIdEIGHT = 8;  //PM Install Drawing Approval
    // var stageIdNINE = 9;  //Installation


    // var statusIdONE = 1;  //InProgress
    // var statusIdTWO = 2;  //Completed

    //Dont enable These are PROD urls

    /*
		var blobStoreURL="https://dt-blobstore-microservice-prod.run.aws-usw02-pr.ice.predix.io";
        var authTokenURL = "https://1871e445-6cba-482c-9a3f-04971d3aee7c.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token";
		var adminServiceURL = "https://dt-admin-microservice-dev.run.aws-usw02-pr.ice.predix.io";
        var assetURL = "https://predix-asset.run.aws-usw02-pr.ice.predix.io";
        var surveyServiceURL = "https://dt-survey-microservice.run.aws-usw02-pr.ice.predix.io";
		var refTablePoolURL = "https://dt-ref-pool-microservice.run.aws-usw02-pr.ice.predix.io";
		var mapLocation = "https://maps.googleapis.com/maps/api/geocode/json?address=";
		var reportserviceURL = "https://dt-report-microservice.run.aws-usw02-pr.ice.predix.io";
		*/

    sampleModule.service('dashboardService', ['$http', '$q', function($http, $q) {
        this.getJobList = function(a_selectedSiteId) {
            var urlJobList = adminServiceURL + '/joblist?stageName=SurveyReport&status=InProgress&siteid=' + a_selectedSiteId + '';

            return $http.get(urlJobList);
        }

        this.getSitedetilsData = function(selectedCustomerId) {
            var getLatestJob = reportserviceURL + '/getLatestJob?customerId=' + selectedCustomerId + '',
                /*installationCountforCustomer = reportserviceURL+'/getInstallationCountForCustomer?customerId='+selectedCustomerId+'',
                postAuditCountForCustomer = reportserviceURL+'/getPostAuditCountForCustomer?customerId='+selectedCustomerId+'',*/
                countForCustomer = reportserviceURL + '/getCountForCustomer?customerId=' + selectedCustomerId + '',
                allUrls = [getLatestJob, countForCustomer];

            var promises = allUrls.map(function(url) {
                return $http({ url: url, method: 'GET' });
            });
            return $q.all(promises);
        }




        this.getEstimatedInstallDate = function(customerId) {
            var estimatedInstallDate = reportserviceURL + '/getEstimatedInstallDate?customerId=' + customerId;

            var deferred = $q.defer();

            $http.get(estimatedInstallDate).success(function(data) {
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }




        this.getJobDetails = function(a_selectedSiteId) {
           // //console.log('Ins ervice a_selectedSiteId ', a_selectedSiteId);
            var urlFixturesCnt = reportserviceURL + '/getFixtureCount?siteId=' + a_selectedSiteId + '',
                urlJobList = adminServiceURL + '/joblist?stageName=SurveyReport&status=InProgress&siteid=' + a_selectedSiteId + '',
                urlAssetsInstCnt = reportserviceURL + '/getInstallationCount?siteId=' + a_selectedSiteId + '',
                urlPostAudCnt = reportserviceURL + '/getPostAuditCount?siteId=' + a_selectedSiteId + '',
                urljobDetailslist = reportserviceURL + '/jobDetailslist?siteid=' + a_selectedSiteId + '',
                allUrls = [urlJobList, urlFixturesCnt, urlAssetsInstCnt, urlPostAudCnt, urljobDetailslist];

            var promises = allUrls.map(function(url) {
                return $http({ url: url, method: 'GET' });
            });
            return $q.all(promises);

        }

        //Ruby - Survey Dashboard Progress Report start
        this.getProgressReport = function(a_selectedSiteId) {

                var urlProgressReport = reportserviceURL + '/siteDetailslist?siteid=' + a_selectedSiteId;
                //console.log($http.get(urlProgressReport));
                //console.log('Ins ervice a_selectedSiteId ', a_selectedSiteId);
                var allProgressUrls = [urlProgressReport];


                var promises = allProgressUrls.map(function(purl) {
                    return $http({ url: purl, method: 'GET' });
                });
                return $q.all(promises);
                //console.log($q);

            }
            //Ruby - Survey Dashboard Progress Report end



    }]);

    //Service or design module..
    sampleModule.service('designService', ['$http', '$q', function($http, $q) {
        this.getSolutions = function(a_data) {
            //console.log("Data to get solution in service", a_data);
            var URL = refTablePoolURL + '/data/reftablepool?screenId=' + a_data.screenId;
            return $http.get(URL);
        }

        this.saveDesignVersion = function(a_data) {
            var URL = designUrl + '/saveMultipleDesign';
            return $http.post(URL, a_data);
        }
        this.designSummary = function(a_data) {
            var URL = designUrl + '/getDesignSummary';
            return $http.post(URL, a_data);
        }
        this.getVersionViewData = function(a_ticketSiteDetailsId, a_versionId) {
            var URL = designUrl + '/getDesigndata?ticketsitedetailId=' + a_ticketSiteDetailsId + '&versionId=' + a_versionId;
            return $http.get(URL);
        }
        this.retriveVersions = function(a_ticketSiteDetailsid) {
            var URl = designUrl + '/getListdata?ticketsitedetailId=' + a_ticketSiteDetailsid;
            return $http.get(URl);
        }

        this.submitFinalVer = function(a_data) {
            var URL = designUrl + '/saveFinalDesign';
            return $http.post(URL, a_data);
        }
    }]);

    sampleModule.service('flowServices', ['$q', '$http', function($q, $http) {
        this.getStatusId = function(stageId) {
            // var mystring = 'myVar';
            // window[mystring] = 1;
            // alert(myVar);
            stage = stageIdONE;
            var deferred = $q.defer();
            //alert(blobStor);
            deferred.resolve(stage);
            return stage;
        }

    }])
    sampleModule.service('commonServices', ['$q', '$http', function($q, $http) {
        var assetData = [];
        var savedata = {};
        var self = this;
        self.privilegeAccess = '';

this.getLoadFloor = function(url,config){
    //    var deferred = $q.defer();
          return $http.get(url,config)
        //    .success(function(data) {
        //         deferred.resolve(data);
        //     }).error(function(msg, code) {
        //         deferred.reject(msg);
        //     });
        //     return deferred.promise;
}

        this.setPrivilegeAccess = function(a_data) {
            //console.log(a_data);
            var url = menuUrl + '/getPrivileges';
            $http.post(url, a_data).then(function(privData) {
                //console.log(a_data, privData);
                self.privilegeAccess = privData.data;
                //console.log('----data----self.privilegeAccess', self.privilegeAccess);
            }).catch(function(err) {
                console.error("error fetching privilege access:" + err);
            });

        }
        this.getPrivilegeData = function(data) {
            var url = menuUrl + '/getPrivileges';
            return $http.post(url, data);
        }
        this.getPrivilegeAccess = function() {
                //var url = '../scripts/modules/sample-module/PrivilegeAccess.JSON';
                return self.privilegeAccess;
            }
            // TO sendback ,reject or approve

        this.senbackRejectApprove = function(a_data) {
            //console.log("General service00000000000000000000000000",adminServiceURL + '/admin/approvalActionHandler');
            var url = adminServiceURL + '/admin/approvalActionHandler';
            return $http.post(url, a_data);
        }
        
         this.updateInstallationRejectStatus = function(a_data) {
            console.log("General service00000000000000000000000000ddddd",adminServiceURL + '/admin/Installation/updateInstallationRejectStatus');
            var url = adminServiceURL + '/admin/Installation/updateInstallationRejectStatus';
            return $http.post(url, a_data);
        }
         
        this.rejectedComments = function(a_data) {
            //console.log("General service");
            var url = adminServiceURL + '/SaveRejectedComments';
            return $http.post(url, a_data);
        }
        this.saveEnergyCodes = function(a_data) {
            //console.log("General service");
            var url = surveyServiceURL + '/SaveEnergyCodes';
            return $http.post(url, a_data);
        }

		//For solar survey data
    this.solarSurveyData = function(surveyTicketSite, surveyType) {
      var url = surveyServiceURL+'/GetSurveyResponse?ticketSiteDetailId='+surveyTicketSite+'&surveyTypeId='+surveyType;
      return $http.get(url);
    }

		// To send back survey in create design page..
        this.sendBackSurvey = function(a_data) {
            var sendbackbtn = document.querySelector('#btnSB')
            sendbackbtn.setAttribute('disabled', '');
            var url = adminServiceURL + '/sendbackMultiple';
            return $http.post(url, a_data);

        }

        this.deleteThisFileBlob = function(a_details) {
                var URL = blobStoreURL + '/deleteMultiBlob';
                var data = [{
                    "directory": a_details.directory,
                    "fileName": a_details.fileName
                }];
                return $http.post(URL, data);
            }
            //To delete uploaded files..
        this.deleteThisFile = function(a_details) {
            var URL = adminServiceURL + "/admin/deleteMedia";
            var data = {
                "ticketSiteDetailsId": a_details.ticketSiteDetailsId,
                "mediaList": [{
                    "directory": a_details.directory,
                    "fileName": a_details.fileName
                }]
            };
            //console.log('in delete genersal service', data);
            return $http.post(URL, data);
        }

        // Classes to be applied on designers uploaded files.
        this.uploadedFileCls = {
            'pdf': 'fa fa-file-pdf-o fa-3x',
            'excel': 'fa fa-file-excel-o fa-3x',
            'image': 'fa fa-camera-retro fa-3x',
            'txt': 'fa fa-file-text-o fa-3x',
            'defaultClass': 'fa fa-file-o fa-3x'
        };
        // List of valid file extensions that a designer or manager uploads.
        this.validFileExtensions = { // List of valid file extension
                'image': [".jpg", ".jpeg", ".bmp", ".gif", ".png"],
                'excel': [".xlsx", ".xls", ".cvs"],
                'pdf': [".pdf"],
                'txt': [".txt"]
            },
            this.STAGE_ID = {
                'survey': 1,
                'pmSurveyApproval': 2,
                'design': 3,
                'pmDesignApproval': 4,
                'proposal': 5,
                'purchaseOrder': 6,
                'installDraw': 7,
                'installDrawPM': 8,
                'installation': 9,
                'readyForPostAudit': 10,
                'postAudit': 11
            }
        this.SURVEY_TYPE_ID = {
            "1": "tataIndoor",
            "2": 'tataOutdoor',
            "3": 'wallmartIndoor',
            "4": 'wallmartOutdoor',
            "6": 'wallmartIndoorOutdoor',
            "5": 'wallmartMain',
            "7": 'rdlIndoor',
            "8": 'jpmcIndoor',
            "9": 'solarOutdoor'
        }


        //--------------------------------------------------------------------------------------------------------------
        // Function: getFileName
        //   Used to prepare data to display the uploaded files.
        //
        // Parameters:
        //   a_fileExt - Extension of the file uploaded.
        //   a_validFileExt - Valid file extension.
        // Returns:
        //   fileName - File type like pdf, excel etc.
        // Exception:
        //   catch and display the exceptions if any occurs.
        //---------------------------------------------------------------------------------------------------------------
        this.getFileName = function(a_fileExt, a_validFileExt) {
            var tempExtData = null; // Temp file extension data.
            var fileName = a_fileExt; // File name.

            if (a_fileExt != null || a_fileExt != "" || a_fileExt != 'undefined') {
                for (var key in a_validFileExt) {
                    tempExtData = a_validFileExt[key];
                    for (var i = 0; i < tempExtData.length; i++) {
                        if (tempExtData[i] === a_fileExt) {
                            fileName = key;
                        }
                        //break;
                    }
                }
            }
            return fileName;
        }

        this.uploadFileToUrl = function(formData, uploadUrl) {
                ////console.log(formData);
                var form = formData;
                var response = '';
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    /* if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(xhttp.responseText);
			response = 'Success';
        } */
                };
                xhttp.open("POST", uploadUrl);
                xhttp.send(form);
                return xhttp;
            },
            this.getAuthToken = function() {

                var deferred = $q.defer();

                //Below is for Prod
                /*  var data = 'client_id=geCurrentEnterprise&grant_type=client_credentials';
                var headersConfig = {
                    headers: {
                        'content-Type': 'application/x-www-form-urlencoded',
                        'authorization': 'Basic Z2VDdXJyZW50RW50ZXJwcmlzZTpjbGllbnRwQHNzd0Bk'
                    }
                }; */

                //Below is for Dev

                var data = 'client_id=devgeDTEnterpriseEE&grant_type=client_credentials';
                var headersConfig = {
                    headers: {
                        'content-Type': 'application/x-www-form-urlencoded',
                        'authorization': 'Basic ZGV2Z2VEVEVudGVycHJpc2VFRTpjbGllbnRwQHNzd0Bk'
                    }
                };


                $http.post(authTokenURL, data, headersConfig)
                    .success(function(data) {
                        var accessToken = data.access_token;
                        var auth = 'bearer ' + accessToken;

                        //Below is for Prod
                        /*   var config = {
                            headers: {
                                'Authorization': auth,
                                'Content-Type': 'application/json',
                                'Predix-Zone-Id': '7ebd7c37-f071-4a9e-bea0-c1aafbd833c9'
                            }
                        }; */
                        //Below is for Dev
                        var config = {
                            headers: {
                                'Authorization': auth,
                                'Content-Type': 'application/json',
                                'Predix-Zone-Id': '0da112ff-f441-4362-ac52-c5bc1752e404'
                            }
                        };
                        deferred.resolve(config);
                        //console.log('Token Obtained');
                        //console.log('Token Obtained', config);
                    }).error(function(msg, code) {
                        deferred.reject(msg);

                    });
                return deferred.promise;
            },

            this.getAssetdata = function(config) {

                var deferred = $q.defer();

                $http.get(assetURL + "/site", config).success(function(data, status, headers, XMLHTTPResponse) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            //212601178
            //asset service call to get transportation data
            this.getDevicedata = function(config) {

                var deferred = $q.defer();

                $http.get(assetURL + "/device?filter=site=/site/Transportation1", config).success(function(data, status, headers, XMLHTTPResponse) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            this.getWattage = function(config, skuid) {
                var deferred = $q.defer();
                $http.get(assetURL + "/classinfo?filter=skuId=" + skuid + "<specification[t3]", config).success(function(data, status, headers, XMLHTTPResponse) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },


            this.getEnergyCodeAttributes = function(request) {
                //console.log(JSON.stringify(request))
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/GetMultipleEnergyCodeAttributes", request)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },

            this.updateEnergyCodeAttributes = function(request) {
                //console.log(JSON.stringify(request))
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/UpdateEnergyCodes", request)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },

            this.getPostgresdata = function() {

                var deferred = $q.defer();

                $http.get(adminServiceURL + "/admin/getActiveSites").success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getInstallRejectStatus = function(ticketId) {
                var deferred = $q.defer();
                $http.get(adminServiceURL + "/admin/Installation/getInstallationRejectStatus?ticketId="+ticketId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

             this.getStageIdName = function(ticketId) {
                var deferred = $q.defer();
                $http.get(adminServiceURL + "/admin/AdminRequest/getAllStagesNames").success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getRefkeyDashboard = function() {
                var url = adminServiceURL + "/admin/getActiveSites";
                //console.log("URL to fetch ref key", url);
                return $http.get(url);
            },

            this.getGEOLocation = function(address) {

                var deferred = $q.defer();

                $http.get(mapLocation + address).success(function(data) {
                    ////console.log('in print>>'+JSON.stringify(data.results[0].geometry.location));
                    deferred.resolve(data.results[0].geometry.location);
                    return data.results[0].geometry.location;
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

		this.getAssetRecords = function(config, arr, filterParamValue) {
			var link1 = "";
			var link2 = "";
			var config = config;
			var deferred = $q.defer();
			//console.log('getAssetRecords');
			//console.log('In side getAssetRecords function, filterParamValue ' + filterParamValue);
			if(filterParamValue.length == 0)
				loopAllAssetRecords(assetURL + "/site?pageSize=1000", deferred, arr);
			else
				loopAllAssetRecords(assetURL + "/site?pageSize=1000&filter="+filterParamValue, deferred, arr);

			function loopAllAssetRecords(url, deferred, arr) {
				$http.get(url, config)
				.success(function(data, headers, status, XMLHTTPResponse) {
					arr.push.apply(arr, data);
					link1 = status().link;
					if (link1 !== undefined) {
						link2 = link1.substr(1, link1.lastIndexOf(">") - 1);
						//console.log('loopAllAssetRecords');
						loopAllAssetRecords(link2, deferred, arr);
					} else {
						deferred.resolve(arr);
					}
				}).error(function(data) {
					deferred.reject(data);
				});
			}
			return deferred.promise;
		},

		this.getSitesFilterValue = function() {
			var deferred = $q.defer();
			var filterParamValue = "";
			//console.log("Inside getSitesFilterValue() ssoObj :"+ ssoObj);
			$http.get(menuUrl+ "/getCustomerListByUser?sso=" + ssoObj)
			.success(function(data) {
				//console.log("Before forEach loop, response : "+ data);
				angular.forEach(data, function(value, key) {
					filterParamValue = filterParamValue + "parent=/customer/" + value + "|";
					})
					if(filterParamValue.length > 0)
					filterParamValue = filterParamValue.substring(0, filterParamValue.length - 1);
				deferred.resolve(filterParamValue);
				//console.log("getSitesFilterValue function response :"+filterParamValue);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		},

		this.getCustomerFilterValue = function() {
			var deferred = $q.defer();
			var custParamValue = "";
			//console.log("Inside getCustomerFilterValue ssoObj :"+ ssoObj);
			$http.get(menuUrl+ "/getCustomerListByUser?sso=" + ssoObj)
			.success(function(data) {
				//console.log("Before forEach loop, response : "+ data);
				angular.forEach(data, function(value, key) {
					custParamValue = custParamValue + "customerId=" + value + "|";
					})
					if(custParamValue.length > 0)
					custParamValue = custParamValue.substring(0, custParamValue.length - 1);
				deferred.resolve(custParamValue);
				//console.log("getCustomerFilterValue function response :"+custParamValue);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			////console.log("deferred.promise :"+deferred.promise);
			return deferred.promise;
		},

		 this.getCustomerIdsAsStringBySSO = function() {
                var deferred = $q.defer();
                var custIds = "";
                console.log("Inside getCustomerIdsAsStringBySSO ssoObj :"+ ssoObj);
                $http.get(menuUrl+ "/getCustomerListByUser?sso=" + ssoObj)
                .success(function(data) {
                    console.log("Before forEach loop, response : "+ data);
                    angular.forEach(data, function(value, key) {
                        custIds = custIds + value + ",";
                        })
                        if(custIds.length > 0)
                        custIds = custIds.substring(0, custIds.length - 1);
                    deferred.resolve(custIds);
                    console.log("getCustomerIdsAsStringBySSO function response :"+custIds);
                }).error(function(msg, code) {
                                deferred.reject(msg);
                });
                return deferred.promise;
             },


            this.postOrPatchAssetSite = function(totalList, config) {

                var deferred = $q.defer();
                $http.post(assetURL + "/site", totalList, config)
                    .success(function(data) {
                        //console.log('Asset Data Updated');
                        deferred.resolve(data);
                    }).error(function(data) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            },

            this.saveExcelDataNnPostgresql = function(request) {

                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: adminServiceURL + "/admin/siteUpload",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: request
                }).then(function onSuccess(response) {
                    deferred.resolve(response);
                }, function onError(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },

            this.setData = function(data) {
                //var savedata = {};
                savedata = data;
                ////console.log(savedata);
            },

            this.getData = function() {
                return savedata;
            },

            this.getSiteData = function(siteId, config) {
                var deferred = $q.defer();
                var dynamicURL = assetURL + "/site?filter=siteId=" + siteId + '&fields=siteName,siteId,siteLocation';
                $http.get(dynamicURL, config).success(function(data, status, headers, XMLHTTPResponse) {
                    deferred.resolve(data);
                    //alert('asa'+JSON.stringify(XMLHTTPResponse));
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            this.getSiteDataForPM = function(url, config) {
                var deferred = $q.defer();
                $http.get(url, config).success(function(data, status, headers, XMLHTTPResponse) {
                    deferred.resolve(data);
                    //alert('asa'+JSON.stringify(XMLHTTPResponse));
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getSiteSummary = function(ticketSiteDetailsId) {
                //console.log("ticketSiteDetailsId",ticketSiteDetailsId)
                // if(ticketSiteDetailsId == 6){
                //     alert("ticketSiteDetailsId")
                // }
                var deferred = $q.defer();
                //console.log("getsite sumary URL",surveyServiceURL + "/siteData?ticketSiteDetailsId=" + ticketSiteDetailsId);
                $http.get(surveyServiceURL + "/siteData?ticketSiteDetailsId=" + ticketSiteDetailsId).success(function(data) {
                    deferred.resolve(data);
                    //alert('asa'+JSON.stringify(XMLHTTPResponse));
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            this.getSurveyData = function(ticketSiteDetailsId) {
                var deferred = $q.defer();

                $http.get(surveyServiceURL + "/GetSurveyResponse?ticketSiteDetailId=" + ticketSiteDetailsId)
                    .success(function(data) {
                        deferred.resolve(data);

                    }).error(function(msg, code) {
                        deferred.reject(msg);

                    });
                return deferred.promise;
            },
            this.saveNewRequest = function(request) {
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: adminServiceURL + "/SaveSite",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: request
                }).then(function onSuccess(response) {
                    deferred.resolve(response);
                }, function onError(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            this.getRefPoolData = function(screenId) {

                var deferred = $q.defer();
                $http.get(refTablePoolURL + "/data/reftablepool?screenId=" + screenId)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },
            this.getFieldsForSurvey = function(surveyTypeId) {

                var deferred = $q.defer();
                ////console.log("surveyServiceURL",surveyServiceURL + "/GetResponse?surveyTypeId=" + surveyTypeId)
                $http.get(surveyServiceURL + "/GetResponse?surveyTypeId=" + surveyTypeId)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            }

        this.getMainData = function(ticketSiteDetailsId) {

            var deferred = $q.defer();
            $http.get(surveyServiceURL + "/GetSurveyResponse?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId=5")
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }

        this.getOutdoorData = function(ticketSiteDetailsId, surveyIdOut) {

            var deferred = $q.defer();
            //console.log("getOutdoorData surveyServiceURL",surveyServiceURL + "/GetSurveyResponse?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId=" + surveyIdOut)
            $http.get(surveyServiceURL + "/GetSurveyResponse?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId=" + surveyIdOut)
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }

        //SOlAR PDF trail............ 11-07-2017

        this.getFieldNameForSolarPDF = function(ticketSiteDetailsId,surveyIdOut){
          //  https://dt-survey-microservice-dev.run.aws-usw02-pr.ice.predix.io/GetResponseFieldByParent?surveyTypeId=9
			var deferred = $q.defer();
			$http.get(surveyServiceURL+"/GetResponseFieldByParent?surveyTypeId="+ surveyIdOut)
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		}

        this.getDataForSolarPDF = function(ticketSiteDetailsId,surveyIdOut){
           // https://dt-survey-microservice-dev.run.aws-usw02-pr.ice.predix.io/GetSurveyResponseByParent?ticketSiteDetailId=1975&surveyTypeId=9
			var deferred = $q.defer();
			$http.get(surveyServiceURL+"/GetSurveyResponseByParent?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId="+ surveyIdOut)
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		}






       // PDF Generate

        this.getPdfData = function(ticketSiteDetailsId, surveyIdOut) {
            ////console.log("Inside PDF")
            var deferred = $q.defer();
            ////console.log("PDF URL",surveyServiceURL + "/GetSurveyResponseByParent?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId=" + surveyIdOut)
            $http.get(surveyServiceURL + "/GetSurveyResponseByParent?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId=" + surveyIdOut)
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }



		this.getAggregatedSurveyData = function(ticketSiteDetailsId,surveyIdOut){

			var deferred = $q.defer();
			$http.get(surveyServiceURL+"/AggregateSurveyDetails?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId="+ surveyIdOut)
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		}

		this.getImageTagData = function(ticketSiteDetailsId){
            ////console.log("getImageTagData");
			var deferred = $q.defer();
			$http.get(surveyServiceURL+"/GetFileTagsBySiteId?ticketSiteDetailId=" + ticketSiteDetailsId)
			.success(function(data) {
                ////console.log("GetFileTagsBySiteId")
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		}

        this.getMediaData = function(ticketSiteDetailsId,fileTag){
			var deferred = $q.defer();
			$http.get(surveyServiceURL+"/GetMediaDetailsBySiteIdTagName?ticketSiteDetailId=" + ticketSiteDetailsId + "&fileTag=" + fileTag)
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		}

		this.getauthTokenURL = function() {
			var authToken = authTokenURL;
			var deferred = $q.defer();
			//alert(blobStor);
			deferred.resolve(authToken);
			return authToken;
		},
		this.getsurveyServiceURL = function() {
			var surveyService = surveyServiceURL;
			var deferred = $q.defer();
			//alert(blobStor);
			deferred.resolve(surveyService);
			return surveyService;
		},
		this.getadminServiceURL = function() {
			var adminService = adminServiceURL;
			var deferred = $q.defer();
			//alert(blobStor);
			deferred.resolve(adminService);
			return adminService;
		},
		this.getBlobStoreURL = function() {
			var blobStor = blobStoreURL;
			var deferred = $q.defer();
			//alert(blobStor);
			deferred.resolve(blobStor);
			return blobStor;
		},


            this.getBlobStoreURL = function() {
                var blobStor = blobStoreURL;
                var deferred = $q.defer();
                //alert(blobStor);
                deferred.resolve(blobStor);
                return blobStor;
            },

            this.getIndoorData = function(ticketSiteDetailsId, surveyIdIn) {

                var deferred = $q.defer();
                $http.get(surveyServiceURL + "/GetSurveyResponse?ticketSiteDetailId=" + ticketSiteDetailsId + "&surveyTypeId=" + surveyIdIn)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },

            this.GetAllSKU = function(config, arr) {

                var link1 = "";
                var link2 = "";
                var config = config;
                var deferred = $q.defer();
                loopAllAssetRecords(assetURL + "/sku?pageSize=1000", deferred, arr);

                function loopAllAssetRecords(url, deferred, arr) {
                    $http.get(url, config)
                        .success(function(data, headers, status, XMLHTTPResponse) {
                            arr.push.apply(arr, data);
                            link1 = status().link;
                            if (link1 !== undefined) {
                                link2 = link1.substr(1, link1.lastIndexOf(">") - 1);
                               // //console.log('loopAllAssetSKU');
                                loopAllAssetRecords(link2, deferred, arr);
                            } else {
                                deferred.resolve(arr);
                            }
                        }).error(function(data) {
                            deferred.reject(data);
                        });
                }
                return deferred.promise;
            },
            this.saveProposalData = function(request) {
               // //console.log(JSON.stringify(request))
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/saveProposalData", request)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            }

			this.saveExportReportData = function(request) {
				////console.log((request))
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/RdlExcelGenerator", request)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
			}

			this.getUrlForRDLPost = function() {
				return surveyServiceURL + "/RdlExcelGenerator";
			}

            this.getSiteListForRDL = function(assignedTo,stage,status) {

                var deferred = $q.defer();
                $http.get(adminServiceURL + "/sitelistbysurveytype?assignedTo="+assignedTo+"&stageName="+stage+"&status="+status+"&surveyTypeId="+7)
                 .success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
             }


        this.approve = function(requestData) {
               // //console.log(requestData)
                return $http.post(adminServiceURL + "/admin/approvalActionHandler", requestData);
            },
            this.sendback = function(requestDataForSendBack) {
                //  // alert($scope.cmts);
                ////console.log(sendback+ticketSiteDetailsId+"&sendBackComments="+cmts)
                //if($scope.cmts!=undefined){
                $http.post(adminServiceURL + "/sendback", requestDataForSendBack).success(function(data) {
                    var sendbackbtn = document.querySelector('#btnSB')
                    sendbackbtn.setAttribute('disabled', '');
                   // //console.log(data);
                });
                /* }else{
                	alert("Please Enter Send Back Comments");
                } */
            }

        this.getAllMedia = function(ticketId) {

                var deferred = $q.defer();
                $http.get(adminServiceURL + "/admin/getAllMedia?ticketId=" + ticketId)
                    .success(function(data) {
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },

            this.getJobStatus = function(ticketId) {

			var deferred = $q.defer();
			$http.get(adminServiceURL + "/getStatusByJobIdAndStageId?ticketId="+ticketId)
			.success(function(data) {
				deferred.resolve(data);
			}).error(function(msg, code) {
				deferred.reject(msg);
			});
			return deferred.promise;
		},

            this.getRejectedComments = function(ticket_id) {
                var deferred = $q.defer();
                // var urlJobList = adminServiceURL+'/GetRejectedComments?ticketId='+ticket_id+'';
                $http.get(adminServiceURL + "/GetRejectedComments?ticketId=" + ticket_id).success(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        this.getSiteListForPM = function(assignedTo, stage, status) {

                var deferred = $q.defer();
                console.log("getSiteListForPM adminServiceURL",adminServiceURL + "/sitelist?assignedTo=" + assignedTo + "&stageName=" + stage + "&status=" + status)
                $http.get(adminServiceURL + "/sitelist?assignedTo=" + assignedTo + "&stageName=" + stage + "&status=" + status).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            }, this.getAllAssetCustomer = function(config, arr) {

                var link1 = "";
                var link2 = "";
                var config = config;
                var deferred = $q.defer();
               // //console.log('getAllAssetCustomer');
                ////console.log('config' + config);
                loopAllAssetRecords(assetURL + "/customer?pageSize=1000", deferred, arr);

                function loopAllAssetRecords(url, deferred, arr) {
                    $http.get(url, config)
                        .success(function(data, headers, status, XMLHTTPResponse) {
                            arr.push.apply(arr, data);
                            link1 = status().link;
                            if (link1 !== undefined) {
                                link2 = link1.substr(1, link1.lastIndexOf(">") - 1);
                               // //console.log('loopAllCustomers');
                                loopAllAssetRecords(link2, deferred, arr);
                            } else {
                                deferred.resolve(arr);
                            }
                        }).error(function(data) {
                            deferred.reject(data);
                        });
                }
                return deferred.promise;
            },
            this.getAssetURL = function() {
                var urlResponse = assetURL;
                var deferred = $q.defer();
                deferred.resolve(urlResponse);
                return urlResponse;
            }
        this.updateMedia = function(request) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: adminServiceURL + "/admin/UpdateMedia",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: request
            }).then(function onSuccess(response) {
               // //console.log(response)
                deferred.resolve(response);
            }, function onError(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }


    }])

    sampleModule.service('adminServices', ['$q', '$http', function($q, $http) {

        this.getAssetURL = function() {
                var AssetURL = assetURL;
                var deferred = $q.defer();
                //alert(blobStor);
                deferred.resolve(AssetURL);
                return AssetURL;
            },


            this.addStation = function(stationList, config) {
              //  //console.log(stationList)
                var deferred = $q.defer();
                $http.post(assetURL + "/station", stationList, config)
                    .success(function(data) {
                      //  //console.log('Asset Data Updated');
                        deferred.resolve(data);
                    }).error(function(data) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            this.filterStationViaSite = function(siteid, config) {
                ////console.log(stationList)
                var deferred = $q.defer();
                $http.get(assetURL + '/station?filter=parent=/site/' + siteid, config)
                    .success(function(data) {
                        ////console.log('Asset Data Updated');
                        deferred.resolve(data);
                    }).error(function(data) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }



    }])

    sampleModule.service('proposalServices', ['$q', '$http', function($q, $http) {

        this.getSkuDataBySkuId = function(a_skuId) {
                var deferred = $q.defer();
                $http.get(surveyServiceURL +
                    "/getRateData?skuId=" + a_skuId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            this.getSkusByIds = function(config, str) {
                var URL = assetURL + '/sku?filter=' + str;
                return $http.get(URL, config);

            },

            this.getSkuDescById = function(config, skuId) {
                var URL = assetURL + '/sku?filter=skuId=' + skuId;
                return $http.get(URL, config);

            },

            this.getProposalData = function(ticketSiteDetailsId, versionId) {
                var deferred = $q.defer();
                $http.get(surveyServiceURL +
                    "/getProposalData?ticketSiteDetailId=" + ticketSiteDetailsId + "&versionId=" + versionId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getSurveyData = function(a_ticketSiteDetailId, a_surveyTypeId) {

              //  //console.log('ticketSiteDetailsId, surveyTypeId===========', a_ticketSiteDetailId, a_surveyTypeId);
                var deferred = $q.defer();
                $http.get(surveyServiceURL +
                    "/GetSurveyResponse?ticketSiteDetailId=" + a_ticketSiteDetailId + "&surveyTypeId=" + a_surveyTypeId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getColumnHeaders = function(a_surveyTypeId) {
                var deferred = $q.defer();
                $http.get(surveyServiceURL +
                    "/GetProposalResponse?surveyTypeId=" + a_surveyTypeId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.saveProposalData = function(request) {
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/saveProposalData", request)
                    .success(function(data) {

                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },
            this.saveCustomField = function(request) {
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/saveCustomField", request)
                    .success(function(data) {

                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },

            this.deleteProposalData = function(request) {
             //   //console.log("Deltete proposal data in service", request);
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/deleteProposalData", request)
                    .success(function(data) {
                     //   //console.log("Delte  proposal data in service", data);
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },

            this.getRateData = function() {
                var deferred = $q.defer();
                $http.get(surveyServiceURL + "/getRate").success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            }
            //[Todo]
        this.getIndoorOutdoorSurvey = function(a_ticketSiteDetailId, a_arraSurveyTypes) {
            var URLs = []; // first url for
            for (var i = 0; i < a_arraSurveyTypes.length; i++) {
                var url = surveyServiceURL +
                    "/GetSurveyResponse?ticketSiteDetailId=" +
                    a_ticketSiteDetailId + "&surveyTypeId=" + a_arraSurveyTypes[i];
                URLs.push(url);
            }
            var promises = URLs.map(function(url) {
                return $http({
                    url: url,
                    method: 'GET'
                });
            });
            return $q.all(promises);
        }
        this.getPropVersionList = function(ticketsitedetailsId) {

            return $http.get(surveyServiceURL + "/getProposalVersionList?ticketsitedetailsId=" + ticketsitedetailsId);
        }


        this.submitFinalProposal = function(request) {
                var deferred = $q.defer();
                $http.post(surveyServiceURL + "/submitFinalPropsal", request)
                    .success(function(data) {
                      //  //console.log("final  proposal data ", data);
                        deferred.resolve(data);
                    }).error(function(msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            }
            // For Indoor Outdoor latest changes
        this.getAllDataProp = function(a_reqData) {
            //var UrlTemp = '../scripts/modules/sample-module/indoorSample.json',
            var UrlTemp = surveyServiceURL + '/getSectionData',
                URl = surveyServiceURL + '/GetMultipleEnergyCodeAttributes',
                //URl = '../scripts/modules/sample-module/energyCodeData.json',

                Urls = [URl, UrlTemp],
                UrlWithData = [],
                obj = {};
            for (var i = 0; i < Urls.length; i++) {
                if (Urls[i].endsWith('getSectionData')) {
                    obj = {
                        'url': Urls[i],
                        'data': a_reqData.sectionData
                    }
                    UrlWithData.push(obj);
                    obj = {};
                } else if (Urls[i].endsWith('GetMultipleEnergyCodeAttributes')) {
                    obj = {
                        'url': Urls[i],
                        'data': a_reqData.energyCodeData
                    }
                    UrlWithData.push(obj);
                    obj = {};
                }
            }

            var promises = UrlWithData.map(function(obj) {
                //return $http({url:url, 'method' : 'GET'});
                return $http({
                    method: 'POST',
                    url: obj.url,
                    data: obj.data
                });
            });

            return $q.all(promises);
        }

        this.getPropData = function(a_surveyTypeList) {
            var UrlTemp = '../scripts/modules/sample-module/indoorSample.json';
            var URl = '../scripts/modules/sample-module/energyCodeData.json';
            var Urls = [URl];

            a_surveyTypeList.forEach(function(obj) {
                // Construct the URLs here for all the surveytype id

                Urls.push(UrlTemp);
            });



            var promises = Urls.map(function(url) {
                return $http({ url: url, 'method': 'GET' });
            });

            return $q.all(promises);
        }

        this.getEnergyCodeResponse = function() {
            var URl = '../scripts/modules/sample-module/energyCodeData.json';
            return $http.get(URl);
        }

        this.getEnergyCodeData = function() {
            var URl = '../scripts/modules/sample-module/energyCodeData.json';

            return $http.get(URl);
        }

    }])

    sampleModule.service('reportServices', ['$q', '$http', function($q, $http) {

        this.getCountForAll = function() {
                var deferred = $q.defer();
                $http.get(reportserviceURL + "/getCountForAll?sso=" + ssoObj).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });


                //  $http.get("https://dt-programoverview-analytics-microservice-dev.run.aws-usw02-pr.ice.predix.io/getCustomerMatricsData").success(function(data) {
                //    deferred.resolve(data);
                // }).error(function(msg, code) {
                //     deferred.reject(msg);
                // });

                // $http.get("https://dt-programoverview-analytics-microservice-dev.run.aws-usw02-pr.ice.predix.io/getCustomerTotalSurveyData").success(function(data) {
                //    deferred.resolve(data);
                // }).error(function(msg, code) {
                //     deferred.reject(msg);
                // });
                return deferred.promise;
            },
            /*this.getPostAuditCountForAll = function() {
            		var deferred = $q.defer();
            		$http.get(reportserviceURL + "/getPostAuditCountForAll").success(function(data) {
            			deferred.resolve(data);
            		}).error(function(msg, code) {
            			deferred.reject(msg);
            		});
            		return deferred.promise;
            	},*/

            this.getIndoorOutdoorMetrics = function(siteId) {
                var deferred = $q.defer();
                $http.get(reportserviceURL + "/GetIndoorOutdoorCountForSite?siteId=" + siteId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            this.getJobCountperStage = function(custId) {
                var deferred = $q.defer();
                $http.get(reportserviceURL + "/metrics/customer/sitecount?customerId=" + custId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            this.getJobCntRefKey = function(refKey, custId) {
                var url = reportserviceURL + '/metrics/customer/siteCountByRefKey?customerId=' + custId + '&refKey=' + refKey;
                return $http.get(url);
            },

            this.getCustomerMetrics = function() {
                var deferred = $q.defer();
                // $http.get(reportserviceURL + "/metrics/customer?sso=" + ssoObj).success(function(data) {
                //     deferred.resolve(data);
                // }).error(function(msg, code) {
                //     deferred.reject(msg);
                // });

                //**********************Old********************
                // $http.get("https://dt-programoverview-analytics-microservice-dev.run.aws-usw02-pr.ice.predix.io/getCustomerTotalSurveyData").success(function(data) {
                //    deferred.resolve(data);
                // }).error(function(msg, code) {
                //     deferred.reject(msg);
                // });

                //*************NEW 20-06-2017********************
                 $http.get(analyticsUrl + '/getCustomerMatricsData').success(function(data) {
                   deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getCustomerNameFromPostgres = function(customerIds) {
                var deferred = $q.defer();
                  $http.get(contractorMaster + '/getCustomerNameByCustomerId?customerId=' + customerIds).success(function(data) {
                   deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },


            this.getAvgSurveyTimePerSiteAcrossCustomer = function() {
                var deferred = $q.defer();
                // $http.get(reportserviceURL + "/getChartdata?sso=" + ssoObj).success(function(data) {
                //     deferred.resolve(data);
                // }).error(function(msg, code) {
                //     deferred.reject(msg);
                // });

                $http.get(analyticsUrl + '/getChartData').success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getAvgSurveyTimePerCustomer = function() { //    Comment added      /metrics/customer
                var deferred = $q.defer();
                $http.get(reportserviceURL + "/metrics/customer").success(function(data) {
                  //  //console.log("--data with --GetSurveyTimeReportsForCustomer--", data);
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },


            /* this.getAvgSurveyTimePerCustomer = function() {
            	var deferred = $q.defer();
            	$http.get(reportserviceURL + "/GetSurveyTimeReportsForCustomer").success(function(data) {
            		deferred.resolve(data);
            	}).error(function(msg, code) {
            		deferred.reject(msg);
            	});
            	return deferred.promise;
            }, */

            this.getAvgSurveyTimeForSite = function(siteId) {
                var deferred = $q.defer();
                $http.get(reportserviceURL + "/GetNetSurveyResponse?siteId=" + siteId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getNoOfSurveyByUserForSite = function(siteId) {
                var deferred = $q.defer();
                $http.get(reportserviceURL + "/getUserdata?siteId=" + siteId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getDataFromPostgres = function(customerId) {
                var deferred = $q.defer();
                // $http.get(reportserviceURL + "/getDataByCustomerId?customerId=" + customerId).success(function(data) {
                //     deferred.resolve(data);
                // }).error(function(msg, code) {
                //     deferred.reject(msg);
                // });

                 $http.get(analyticsUrl + '/getSiteDataByCustomerData?customerId=' + customerId).success(function(data) {
                    deferred.resolve(data);
                }).error(function(msg, code) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },

            this.getNoOfDays = function(customerId, stageId) {
                return $http.get(reportserviceURL + '/noOfDaysBySiteAndStage?customerId=' + customerId + '&stageId=' + stageId);
            },
            this.getNoOfSitesForAllCustomer = function(stageId) {
                return $http.get(reportserviceURL + '/noOfSitesForAllCustomer?stageId=' + stageId);
            }

    }])

    return sampleModule;
});