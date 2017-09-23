  //--------------------------------------------------------------------------------------------------------------
  // Description : 
  //  The directive is used for displaying attachment files uploaded.
  //---------------------------------------------------------------------------------------------------------------
  define(['angular', './sample-module'], function(angular, sampleModule) {
      'use strict';

// TO show images
      sampleModule.directive("modalPopup", function($compile) {
    return {
      strict : 'EA',
      //replace : true,
        scope : {
            imagefiles : '='
        },
      templateUrl : 'views/ModalPopup.html',
        link : function(scope, elem, attr) {
            scope.$watchCollection('imagefiles', function(newList, oldList) {
                scope.imagePopup1 = true;
                 var imageGallary = document.getElementById('popup1');
                imageGallary.innerHTML = '';
                if(newList.length > 0) {
                    var gal = document.createElement("simple-gallery");
                    var container = ''
                    container = gal.$.links;
                for(var indx=0; indx < newList.length; indx++) {
                    var url = newList[indx],
                        counter = indx;
                    var imgCreate = document.createElement("img");
                    imgCreate.setAttribute('data-original', url);
                    imgCreate.setAttribute('data-index', 's'+(counter+1));
                    imgCreate.setAttribute('on-click', 'load_popup');
                    imgCreate.setAttribute("src", 'images/camerahi.png');                    
                    imgCreate.addEventListener('click', gal.load_popup);
                    container.appendChild(imgCreate);
                    Polymer.dom(imageGallary).appendChild(gal);
                } 
                }
            }, true);
            scope.closePopup = function() {
                $('#popup-container').css({'display':'none'});
            }
        }
    }
  });
  });