/**
 * Renders all the widgets on the tab and triggers the datasources that are used by the widgets.
 * Customize your widgets by:
 *  - Overriding or extending widget API methods
 *  - Changing widget settings or options
 */
/* jshint unused: false */
define(['angular', './sample-module'], function(angular, controllers) {

    controllers.controller('IndoorSurveyCntrlFabric', function($state, $timeout, $scope, commonServices, $http) {



        var urlPathArr = [];
        urlPathArr.push($state.current.name);
      var ssoObj = window.localStorage.getItem("SSO_ID");
        const ssoPrivilegeData = {
            contractorId: ssoObj
        };
        function privilegeAccess() {
            commonServices.getPrivilegeData(ssoPrivilegeData).then(function(privilege_Data) {
                console.log(ssoPrivilegeData, privilege_Data);
                let privilegeData = privilege_Data.data;
                console.log(privilegeData);
                angular.forEach(privilegeData, function(objTmp) {
                    if (urlPathArr.indexOf(objTmp.state) >= 0) {
                        $scope.isReadonly = (objTmp.access_id == 2) ? true : false;
                    }
                });
                console.log("privilegeAccess----", privilegeData);
                console.log($scope.isReadonly);
            });
        }
        privilegeAccess();

        $scope.name = 'Indoor survey begins fabric';

        $scope.showTable = false;
        $scope.isAllSelected = false; // To hide the apply filter button.
        function getAuthToken() {
            var inputSiteElement = null; // Holds input value in the filter filel.
            commonServices.getAuthToken().then(function(auth_data) {
                console.log('auth_data.headers.Authorization', auth_data);
                $scope.config = $scope.config = {
                    headers: {
                        'Authorization': auth_data.headers.Authorization,
                        'Content-Type': 'application/json',
                        'Predix-Zone-Id': '0da112ff-f441-4362-ac52-c5bc1752e404'
                    }
                };
                inputSiteElement = document.querySelector('paper-typeahead-input-site');
                inputSiteElement.setAttribute('cnf', auth_data.headers.Authorization);
                inputSiteElement.setAttribute('znId', '0da112ff-f441-4362-ac52-c5bc1752e404');
            });
        }
        getAuthToken(); // Call the function to execute on load of the page.

        window.addEventListener('pt-item-confirmed', function(e) {
            var siteID = e.srcElement.__data__.keyid;
            $("paper-typeahead-input-site").attr("disabled", true);
            $('#changeSite').css('display', 'block');
            getStation(siteID);
        });

        function getStation(a_siteid) {
            $scope.showSubDetails = false;
            $scope.siteId = a_siteid; // Set the site id on scope for further excess.
            $scope.stationData = [{ stationName: "Select Station" }];

            var URL = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/station?filter=siteId=11150219<parent[t3]';

            $http.get(URL, $scope.config).success(function(data) {
                console.log('Data---', data);
                $scope.stationData = data;
                $scope.stationData.unshift({ stationName: "Select Station" });
                $scope.station = $scope.stationData[0];
                $scope.showStations = true;
            }).error(function(error) {
                console.error('station data not fetched..');
            });
        }

        $scope.getFloors = function(a_stationID) {
            var floors = a_stationID['floor'];
            $scope.floors = [];
            console.log("floors0", floors);
            $scope.floors = floors;
            /* for(var index=0; index < floors.length; index++) {
              $scope.floors.push(floors[index]);
            } */
            $scope.floors.unshift({ floorNo: 'Select Floor No' });
            $scope.floorsModel = $scope.floors[0];
            $scope.showFloors = true;
            console.log('a_stationID---', a_stationID);
            console.log('$scope.floors----', $scope.floors);
        }

        $scope.getSection = function(a_floorData) {
            var sections = a_floorData['section'];
            $scope.sections = sections;
            $scope.sections.unshift({ sectionId: 'Select Section' });
            $scope.sectionsModel = $scope.sections[0];
            $scope.showSections = true;
            console.log('a_floorData---', a_floorData);
        }

        $scope.showApplyButton = function() {
            $scope.isAllSelected = true;
        }

        $scope.showFloorPlan = function() {
            var URL = commonServices.getsurveyServiceURL() + "/GetSurveyResponse?ticketSiteDetailId=767&surveyTypeId=3";
            var selectedFilters = {
                siteID: $scope.siteId,
                station: $scope.station,
                floor: $scope.floorsModel,
                section: $scope.sectionsModel
            }
            $http.get(URL).success(function(imgCoord) {
                var tempMarkerData = {};

                $scope.markers = [];
                $scope.markers.push({
                    image: 'images/Marker_1.PNG',
                    left: (0.05 * 1000),
                    top: (0.05 * 1000)
                });
                $scope.imageDetails = { imageUrl: 'images/image001.PNG' };
                /* for(var index=0; index < 1; index++) {
                  if(imgCoord[index].hasOwnProperty('positionX') && imgCoord[index].hasOwnProperty('positionY')) {
                     tempData = {
                      x : imgCoord[index].positionX,
                      y : imgCoord[index].positionY
                    } 
                    tempMarkerData = {
                      image : 'images/Marker_1.PNG',
                      left: (0.05*1000),
                      top: (0.05*1000)
                    }
                    $scope.markers.push({
                      image : 'images/Marker_1.PNG',
                      left: (0.05*1000),
                      top: (0.05*1000)
                    });
                    tempMarkerData = {};
                  } 
                } */
                $('.containerAll').css({ 'display': "block" });
                loadFloorImage($scope.markers);
            });

        }

        $scope.closePopupImage = function() {
            console.log("Close pop up");
            $('.containerAll').css({ display: "none" });
        }

        $scope.flushAllData = function() {
            $scope.showStations = false;
            $scope.siteId = ''; // Set the site id on scope for further excess.
            $scope.stationData = null;
            $scope.station = '';
            $scope.floors = [];
            $scope.floorsModel = '';
            $scope.showFloors = false;
            $scope.sections = [];
            $scope.sectionsModel = '';
            $scope.showSections = false;
            $scope.isAllSelected = false;
            $("paper-typeahead-input-site").removeAttr("disabled");
        }


        /* var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");

    // Map sprite
    var mapSprite = new Image();
    mapSprite.src = "http://www.retrogameguide.com/images/screenshots/snes-legend-of-zelda-link-to-the-past-8.jpg";

    var Marker = function () {
        this.Sprite = new Image();
        this.Sprite.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
        this.Width = 12;
        this.Height = 20;
        this.XPos = 321;
        this.YPos = 274;
    }

    var Markers = new Array(); */
        // var mouseClicked = function (mouse) {
        // // Get corrent mouse coords
        // var rect = canvas.getBoundingClientRect();
        // var mouseXPos = (mouse.x - rect.left);
        // var mouseYPos = (mouse.y - rect.top);

        // console.log("Marker added");

        // // Move the marker when placed to a better location
        // var marker = new Marker();
        // marker.XPos = mouseXPos - (marker.Width / 2);
        // marker.YPos = mouseYPos - marker.Height;

        // Markers.push(marker);
        // }

        // // Add mouse click event listener to canvas
        // canvas.addEventListener("mousedown", mouseClicked, false);

        /* var firstLoad = function () {
      context.font = "15px Georgia";
      context.textAlign = "center";
  }

  firstLoad();

  var main = function () {
      draw();
  };

  var draw = function () {
    // Clear Canvas
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw map
    // Sprite, X location, Y location, Image width, Image height
    // You can leave the image height and width off, if you do it will draw the image at default size
    context.drawImage(mapSprite, 0, 0, 700, 700);
    var marker = new Marker();
   
    Markers.push(marker);
    // Draw markers
    for (var i = 0; i < Markers.length; i++) {
        var tempMarker = Markers[i];
        // Draw marker
        context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

        // Calculate postion text
        var markerText = "Postion (X:" + tempMarker.XPos + ", Y:" + tempMarker.YPos;

        // Draw a simple box so you can see the position
        var textMeasurements = context.measureText(markerText);
        context.fillStyle = "#666";
        context.globalAlpha = 0.7;
        context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
        context.globalAlpha = 1;

        // Draw position above
        context.fillStyle = "#000";
        context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
    }
};
//main();
setInterval(main, (1000 / 60)); // Refresh 60 times a second */

        // Working code below, before imageMap
        function loadFloorImage(a_finalData) {
            console.log('a_finalData[0]--', $scope.imageDetails);
            fabric.Image.fromURL($scope.imageDetails.imageUrl, function(img) {
                canvas.setHeight(img._element.height);
                canvas.setWidth(img._element.width);
                img.set({ width: canvas.width, height: canvas.height });
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                // Cal the load marker function.
                window.setTimeout(function() {
                    $scope.markers.forEach(function(marker, index) {
                        loadMarker(marker, index); // Load the marker.
                    });
                }, 200);

            });

        }
        //var floorMapData = [{imageUrl : 'images/image001.PNG'},{x:0.053, y:0.050}, {x:0.080, y:0.080}];
        var canvas = new fabric.Canvas('canvas');
        //canvas.setHeight(floorMapData[0].height);
        //canvas.setWidth(floorMapData[0].width);


        /* canvas.setBackgroundImage('images/test_image.jpg', canvas.renderAll.bind(canvas), {
           width: canvas.width,
        height: canvas.height,
          originX: '100',
        originY: '100'
        }); */
        //canvas.backgroundImage.width = canvas.getWidth()-100;
        //canvas.backgroundImage.height = canvas.getHeight() - 100;

        function loadMarker(a_marker, a_index) {
            console.log('a_marker', a_marker);
            fabric.Image.fromURL(a_marker.image, function(img) {
                img.hoverCursor = 'pointer';
                img.set({
                    left: a_marker.left,
                    top: a_marker.top,
                    selectable: false
                });
                img._element.accessKey = 'access-key-' + a_index;
                img.id = 'access-key-' + a_index;
                img.index = a_index;
                img.isMarker = true;
                canvas.add(img);
            });
        }



        // Unused code below.

        /* fabric.Image.fromURL('images/img_wireimage.PNG', function(oImg) {
        //canvas.add(oImg);
        console.log('oImg---', oImg);
        var i=0;
        function loadMarker () {
          fabric.Image.fromURL('images/Marker_1.PNG', function(img) {
            //canvas.add(img);
             var l = (70*i)+20;
             var t = (80*i)+30;
             img.set({'left':l});
             img.set({'top':t});
             img.set('selectable', false); // make object unselectable
             canvas.add(img);
             img._element.accessKey = "AccessKey"+i;
             img.id = "AccessKey"+i;
            console.log('oImg---22', img);
            if(i<3) {
              loadMarker();
              i++;
            }
            
          });
        }
          
        loadMarker();
         
          
        });
  
        canvas.renderAll.bind((canvas), {
          backgroundImageStretch: false
        }); */




        // Used code below.
        var tableData = [{ 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 },
            { 'key': 'Satyendra', 'value': 2 }
        ];
        var tr = '';
        tableData.forEach(function(data, index) {
            tr = tr + '<tr><td>' + '<b>' + data.key + '</b>' + '</td><td>' + data.value + '</td></tr>';
        });
        console.log('tr---', tr);

        function showMarkerPopup(a_marker, tr) {
            console.log('clicked marker is', a_marker);
            //$scope.tableData = [{'key' : a_marker.top, 'value' : a_marker.left}];
            var table = '<button id="closeTable" class="closeButton">&times;</button><div class="tableDiv"><table class="dataTable" style="width:250px;font-family: sans-serif;margin:10px;margin-right:20px;height:100px;overflow-y:scroll;">' + tr + '</table></div>';
            $('#showData').css({
                position: 'absolute',
                top: (a_marker.top - 30),
                left: a_marker.left + 100,
                display: 'block',
                visibility: 'visible',
                transition: (a_marker.top - 30)
            }).html(table).show();

            var dom = document.getElementById('closeTable');
            dom.addEventListener('click', function() {
                $('#showData').css({ display: 'none' });
            });
            dom = '';
        }

        canvas.on('mouse:down', function(options) {
            $('#showData').css({ display: 'none' });
            options.e.target.onclick = function() {
                if (options.target && options.target.isMarker) {
                    showMarkerPopup($scope.markers[options.target.index], tr);
                }

            }
        });


        // Jquery image map start



    });

});