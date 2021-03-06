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
 * <div tpl-select tpl-options="myOptions" tpl-label="myLabelKey" ng-model="myModel"></div>
 *
 * @example creating dynamic filled select field by using String-array for parameter(tpl-select):
 * <div tpl-select tpl-options="myOptions" ng-model="myModel"></div>
 *
 * @example creating static filled select field (tpl-select-static):
 * <div tpl-select-static ng-model="myModel">
 *   <option value="key1">label1</option>
 *   <option value="key2">label2</option>
 * </div>
 *
 *  Note:
 *  There is no real styling! You have to style the dropdown by your own!
 */
 'use strict';

//login directive
angular.module('tpl.select', [])

/**
 * tplSelectService
 */
.factory('tplSelectService', function(){

  var getList = function getList(element){
    var selectRoot = findSelectRoot(element);
    return selectRoot.querySelectorAll('.tpl-select__list');
  }

  var findSelectRoot = function findSelectRoot(element){
    if(angular.element(element).hasClass('tpl-select')){
      return element;
    }
    return findSelectRoot(element.parentElement);
  }

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
        var selectList = getList(element);
        if(selectList[0].className.indexOf(invisibleFlag) > -1){
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
      var list = getList(element);
      list.bind('click', function(e){
        getList(element).addClass('tpl-select__list--invisible');

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
      var list = getList(element);
      list.bind('mouseleave', function(e){
        getList(element).addClass('tpl-select__list--invisible');
        e.preventDefault();
      });
    }
  }

})

/**
 * tplSelectCacheService
 */
.factory('tplSelectCacheService', function(){
  var cachedValue = {};
  var PUBLIC = {};
  var validateKey = function validateKey(key){
    return key.replace('\.', '_').replace('\[', '_').replace('\]', '_');
  }
  PUBLIC.setValue = function(key, value){
    key = validateKey(key);
    cachedValue[key] = value;
  }
  PUBLIC.getValue = function(key){
    key = validateKey(key);
    return cachedValue[key];
  }

  return PUBLIC;
})


/**
 * tplSelect - controller
 */
.controller('tplSelectController', [
  '$scope',
  'tplSelectCacheService',
  function ($scope, tplSelectCacheService) {

  $scope.modelHolder = null;
  $scope.key = null;
  $scope.select = function(option){
   $scope.modelHolder.$setViewValue(option);
    tplSelectCacheService.setValue($scope.key, option);
  };

}])

/**
 * tplSelect - directive
 */
.directive('tplSelect', [
  'tplSelectService',
  'tplSelectCacheService',
  function(tplSelectService, tplSelectCacheService) {
  return {
    restrict: 'A',
    controller: 'tplSelectController',
    template :  '<div class="tpl-select">' +
                  '<div class="tpl-select__trigger">' +
                    '<div ng-if="tplLabel">{{ngModel[tplLabel] | translate}}</div>' +
                    '<div ng-if="!tplLabel">{{ngModel | translate}}</div>' +
                  '</div>' +
                  '<ul class="tpl-select__list tpl-select__list--invisible">' +
                    '<li class="tpl-select__list-item" ng-repeat="option in tplOptions" ng-Click="select(option)">' +
                      '<div ng-if="tplLabel">{{option[tplLabel] | translate}}</div>' +
                      '<div ng-if="!tplLabel">{{option | translate}}</div>' +
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

        //set identifier
        scope.key = attrs.ngModel;

      //check if options available
      if(scope.tplOptions){

        //set init value with first option
        if(scope.tplOptions.length > 0){
          var value = tplSelectCacheService.getValue(scope.key) || scope.tplOptions[0];
          ngModel.$setViewValue(value);
        }

        //bind trigger events
        tplSelectService.bindTriggerClick(element);

        //bind list events
        tplSelectService.bindListClick(element);
        tplSelectService.bindListMouseleave(element);
      }
    }
  };
}

])

/**
 * tplSelectStatic - controller
 */
.controller('tplSelectStaticController', [
  '$scope',
  'tplSelectCacheService',
  function ($scope, tplSelectCacheService) {

  $scope.modelHolder = null;
  $scope.key = null;
  $scope.tplOptions = [];
  $scope.select = function(option){
    $scope.modelHolder.$setViewValue(option);
    tplSelectCacheService.setValue($scope.key, option);
  };

}])

/**
 * tplselectStatic - directive
 */
.directive('tplSelectStatic', [
  'tplSelectService',
  'tplSelectCacheService',
  function(tplSelectService, tplSelectCacheService) {
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

        //set identifier
        scope.key = attrs.ngModel;

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
          var value = tplSelectCacheService.getValue(scope.key) || scope.tplOptions[0];
          ngModel.$setViewValue(value);
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
