/**
 * @ngdoc directive
 * @name tpl-select
 * @description
 * 
 * Creates a customizable select dropdown
 *
 * Attributes:
 * tpl-options: array of options shown on select
 * tpl-label: the object key that represents the label that data
 * ng-model: the model where the data should be saved
 *
 * @example
 *
 *  <select tpl-select tpl-options="myOptions" tpl-label="myLabelKey" ng-model="myModel"></select>
 *
 *  Note:
 *  There is no real styling! You have to style the dropdown by your own!
 */
'use strict';

//login directive
angular.module('tpl.select', [])

.controller('tplSelectController', ['$scope', function ($scope) {

  $scope.modelHolder = null;
  $scope.select = function(option){
    $scope.modelHolder.$setViewValue(option);
  };

}])

.directive('tplSelect', function() {
  return {
    restrict: 'A',
    controller: 'tplSelectController',
    //templateUrl : 'components/directives/tpl-select/tpl-select.html',
    template : '<div class="tpl-select">' +
                  '<div class="tpl-select__trigger">{{ngModel[tplLabel] | translate}}</div>' +
                  '<ul class="tpl-select__list">' +
                    '<li  class="tpl-select__list-item" ng-repeat="option in tplOptions" ng-Click="select(option)">' +
                    '{{option[tplLabel] | translate}}' +
                    '</li>' +
                  '</ul>' +
                '</div>',
    replace: true,
    scope : {
      ngModel: '=',
      tplOptions: '=',
      tplLabel: '@'
    },
    require : 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      //check if options available
      if(scope.tplOptions){
        //set modelHolder
        scope.modelHolder = ngModel;

        //set init value with first option
        ngModel.$setViewValue(scope.tplOptions[0]);

        //bind click on trigger
        var trigger = angular.element(element.querySelectorAll('.tpl-select__trigger'));
        trigger.bind('click', function(e){
          var currentStyle = e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display;
          if(currentStyle === 'block'){
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'none';
          }else {
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'block';
          }
        });

        //bind click on item
        var listItem = angular.element(element.querySelectorAll('.tpl-select__list'));
        listItem.bind('click', function(e){
          var currentStyle = e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display;
          if(currentStyle === 'block'){
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'none';
          }else {
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'block';
          }
        });
      }
    }
  };

});
