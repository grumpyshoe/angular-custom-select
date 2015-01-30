(function(){
/**
 * @ngdoc directive
 * @name tpl-select
 * @description
 * @author Thomas Cirksena grumpyshoe@gmail.com
 *
 * Creates a customizable select dropdown
 *
 * Attributes:
 * tpl-options: array of options shown on select
 * tpl-label: the object key that represents the label that data
 * ng-model: the model where the data should be saved
 *
 * @example creating dynamic filled select field (tpl-select):
 * <select tpl-select tpl-options="myOptions" tpl-label="myLabelKey" ng-model="myModel"></select>
 *
 * @example creating static filled select field (tpl-select-static):
 * <select tpl-select-static ng-model="myModel">
 *   <option value="key1">label1</option>
 *   <option value="key2">label2</option>
 * </select>
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

.factory('tplSelectService', function(){
  return {

    /**
     * bind event for click on trigger
     *
     * @param  {object} element
     */
    bindTriggerClick : function bindTrigger(element){
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
    },

    /**
     * bind event for click on list
     *
     * @param  {object} element
     */
    bindListClick : function bindListClick(element){
      //bind click on list
      var list = angular.element(element.querySelectorAll('.tpl-select__list'));
      list.bind('click', function(e){
        if(e.target.className.indexOf('tpl-select__list-item') > -1){
          angular.element(e.target.parentElement).addClass('tpl-select__list--invisible');
        }else {
          angular.element(e.target).addClass('tpl-select__list--invisible');
        }
        e.preventDefault();
      });
    },

    /**
     * bind event for leaving list
     *
     * @param  {object} element
     */
    bindListMouseleave : function bindListMouseleave(element){
      //bind mouseleave on list
      var list = angular.element(element.querySelectorAll('.tpl-select__list'));
      list.bind('mouseleave', function(e){
        if(e.target.className.indexOf('tpl-select__list-item') > -1){
          angular.element(e.target.parentElement).addClass('tpl-select__list--invisible');
        }else {
          angular.element(e.target).addClass('tpl-select__list--invisible');
        }
        e.preventDefault();
        //angular.element(e.target).addClass('tpl-select__list--invisible');
      });
    }
  }

})

.directive('tplSelect', [
  'tplSelectService',
  function(tplSelectService) {
  return {
    restrict: 'A',
    controller: 'tplSelectController',
    template :  '<div class="tpl-select">' +
                  '<div class="tpl-select__trigger">{{ngModel[tplLabel] | translate}}</div>' +
                  '<ul class="tpl-select__list tpl-select__list--invisible">' +
                    '<li class="tpl-select__list-item" ng-repeat="option in tplOptions" ng-Click="select(option)">' +
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

      //set modelHolder
      scope.modelHolder = ngModel;

      //check if options available
      if(scope.tplOptions){

        //set init value with first option
        ngModel.$setViewValue(scope.tplOptions[0]);

        // bind trigger events
        tplSelectService.bindTriggerClick(element);

        //bind list events
        tplSelectService.bindListClick(element);
        tplSelectService.bindListMouseleave(element);
      }
    }
  };
}

])

.controller('tplSelectStaticController', ['$scope', '$transclude', function ($scope) {

  $scope.modelHolder = null;
  $scope.tplOptions = [];
  $scope.select = function(option){
    $scope.modelHolder.$setViewValue(option);
  };

}])

.directive('tplSelectStatic', [
  'tplSelectService',
  function(tplSelectService) {
    return {
      restrict: 'A',
      controller: 'tplSelectStaticController',
      template :  '<div class="tpl-select">' +
                    '<div class="tpl-select__trigger">{{ngModel.label | translate}}</div>' +
                    '<ul class="tpl-select__list tpl-select__list--invisible">' +
                      '<li class="tpl-select__list-item" ng-repeat="option in tplOptions" ng-Click="select(option)">' +
                        '{{option.label | translate}}' +
                      '</li>' +
                    '</ul>' +
                  '</div>',
      transclude: true,
      replace: true,
      scope : {
        ngModel: '='
      },
      require : 'ngModel',
      link: function(scope, element, attrs, ngModel, transclude) {

        //set modelHolder
        scope.modelHolder = ngModel;

        transclude(function(clone, childScope){
          //iterate through clone-items and store all option items
          for(var i=0; i<clone.length; i++){
            if(clone[i].value){
              var data = {};
              data.key = clone[i].value;
              data.label = clone[i].innerHTML;
              scope.tplOptions.push(data);
            }
          }

          //delete clone content
          clone = '';

          //set init value with first option
          ngModel.$setViewValue(scope.tplOptions[0]);
        });

          // bind trigger events
          tplSelectService.bindTriggerClick(element);

          //bind list events
          tplSelectService.bindListClick(element);
          tplSelectService.bindListMouseleave(element);
      }

    }
  }
]);


}());
