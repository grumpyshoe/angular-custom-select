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
    template : '<div class="tpl-select">' +
                  '<div class="tpl-select__trigger">{{ngModel[tplLabel] | translate}}</div>' +
                  '<ul class="tpl-select__list tpl-select__list--invisible">' +
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
          var invisibleFlag = 'tpl-select__list--invisible';
          var selectList = e.target.parentElement.getElementsByClassName('tpl-select__list')[0];
          if(selectList.className.indexOf(invisibleFlag) > -1){
            //hide all open select fields
            angular.element(document.getElementsByClassName('tpl-select__list')).addClass(invisibleFlag);

            //show list
            angular.element(selectList).removeClass(invisibleFlag);

          }else {
            //hide list
            angular.element(selectList).addClass(invisibleFlag);
          }
        });

        //bind click on list
        var list = angular.element(element.querySelectorAll('.tpl-select__list'));
        list.bind('click', function(e){
          angular.element(e.target.parentElement).addClass('tpl-select__list--invisible');
        });

        //bind mouseleave on list
        list.bind('mouseleave', function(e){
          angular.element(e.target.parentElement).addClass('tpl-select__list--invisible');
        });
      }
    }
  };

});
