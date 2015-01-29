/**
 * @ngdoc directive
 * @name popupmenu
 * @description
 * Creates a popup menu.
 *
 * Attributes:
 * offsetHorizontal: int (px)
 * width: int (px)
 * placement: 'none' | 'sw' | 'nw' | 'n' | 's'
 * toggle: 'hover' | 'click' | 'both'
 * closeTimeout: int (milliseconds)
 * offsetVertical: int (px)
 * triangle: true | false
 *
 * @example
 *
 *  <popupmenu attributes...>
 *    <... class="popupmenu__trigger foobar">Some Stuff which will act as a trigger</...>
 *    <div class="popupmenu__content foobarbaz">
 *      the actual popupmenu content
 *    </div>
 *  </popupmenu>
 *
 *  Note that foobar and foobarbaz are not required but show you the possibility to style your popup and its trigger.
 */
// angular.module('tpl.popupmenu', []).directive('popupmenu', [
//   '$timeout', '$window',
//   function popupmenu($timeout, $window) {
//     'use strict';
//     var $triangle = angular.element($window.document.createElement('div'));
//     $triangle.addClass('popupmenu__triangle');
//     var DEFAULT_OPTIONS = {
//         offsetHorizontal: 30,
//         width: 200,
//         placement: 'none',
//         toggle: 'hover',
//         closeTimeout: 300
//       },
//       POPUPMENU_TIMEOUT = 'popupMenuTimeout';
//     var generateCss = function(attrs) {
//       attrs.offsetHorizontal = attrs.offsetHorizontal || 0;
//       attrs.offsetVertical = attrs.offsetVertical || 0;
//       var offsetHorizontal = parseInt(attrs.offsetHorizontal, 10),
//         offsetVertical = parseInt(attrs.offsetVertical, 10),
//         width = parseInt(attrs.width, 10);
//       var basePositioning = {
//         left: -width / 2 + 'px',
//         'margin-left': offsetHorizontal + 'px'
//       };
//       var configSouth = {
//         'bottom': offsetVertical + 'px'
//       };
//       var configNorth = {
//         'top': offsetVertical + 'px'
//       };
//       if (width) {
//         basePositioning.width = width + 'px';
//       }
//       switch (attrs.placement) {
//         case 'none':
//           return {};
//         case 's':
//           // TODO: calculate correct s position
//         case 'sw':
//           // TODO: calculate correct sw position
//         case 'se':
//           return angular.extend({}, configSouth, basePositioning);
//         case 'n':
//           // TODO: calculate correct n position
//         case 'nw':
//           // TODO: calculate correct nw position
//         case 'ne':
//           return angular.extend({}, configNorth, basePositioning);
//       }
//       return basePositioning;
//     };
//     var togglePopupmenu = function($content, css, options) {
//       if ($window.getComputedStyle($content[0], null).getPropertyValue('display') !== 'block') {
//         showPopupmenu($content, css);
//       } else {
//         hidePopupmenu($content, options.closeTimeout);
//       }
//     };
//     var showPopupmenu = function($content, css) {
//       if ($content.data(POPUPMENU_TIMEOUT)) {
//         $timeout.cancel($content.data(POPUPMENU_TIMEOUT));
//       }
//       for (var cssKey in css) {
//         $content.css(cssKey, css[cssKey]);
//       }
//       $content.css('display', 'block');
//     };
//     var hidePopupmenu = function($content, closeTimeout) {
//       $content.data(POPUPMENU_TIMEOUT, $timeout(function() {
//         $content.css('display', 'none');
//       }, closeTimeout));
//     };
//     return {
//       restrict: 'E',
//       transclude: true,
//       template: '<div class="popupmenu" ng-transclude></div>',
//       link: function(scope, element, attrs) {
//         var $content = angular.element(element[0].getElementsByClassName('popupmenu__content'));
//         // create options
//         attrs = angular.extend({}, DEFAULT_OPTIONS, attrs);
//         // add triangle and add the given placement string as element-modifier
//         if (attrs.triangle && (!!attrs.placement && attrs.placement !== 'none')) {
//           var triangleClone = $triangle.clone();
//           triangleClone.addClass('popupmenu__triangle--' + attrs.placement);
//           $content.append(triangleClone);
//         }
//         // generate css for this directive and hold in scope
//         var contentCss = generateCss(attrs, angular.element(element[0].getElementsByClassName('popupmenu__trigger')[
//           0]));
//         // bind toggle events
//         if (attrs.toggle === 'hover' || attrs.toggle === 'both') {
//           element.on('mouseover', function() {
//             showPopupmenu($content, contentCss);
//           });
//           $content.on('mouseover', function() {
//             showPopupmenu($content, contentCss);
//           });
//         }
//         if (attrs.toggle === 'click' || attrs.toggle === 'both') {
//           element.on('click', function() {
//             togglePopupmenu($content, contentCss, attrs);
//           });
//         }
//         $content.on('mouseleave', function() {
//           hidePopupmenu($content, attrs.closeTimeout);
//         });
//         element.on('mouseleave', function() {
//           hidePopupmenu($content, attrs.closeTimeout);
//         });
//       }
//     };
//   }
// ]);
'use strict';
//login directive
angular.module('maklerportalApp', []).controller('tplSelectController', [
  '$scope',
  function ($scope) {
    $scope.modelHolder = null;
    $scope.select = function (option) {
      $scope.modelHolder.$setViewValue(option);
    };
  }
]).directive('tplSelect', function () {
  return {
    restrict: 'A',
    controller: 'tplSelectController',
    template: '<div class="tpl-select">' + '<div class="tpl-select__trigger">{{ngModel[tplLabel] | translate}}</div>' + '<ul class="tpl-select__list">' + '<li  class="tpl-select__list-item" ng-repeat="option in tplOptions" ng-Click="select(option)">' + '{{option[tplLabel] | translate}}' + '</li>' + '</ul>' + '</div>',
    replace: true,
    scope: {
      ngModel: '=',
      tplOptions: '=',
      tplLabel: '@'
    },
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      //check if options available
      if (scope.tplOptions) {
        //set modelHolder
        scope.modelHolder = ngModel;
        //set init value with first option
        ngModel.$setViewValue(scope.tplOptions[0]);
        //bind click on trigger
        var trigger = angular.element(element.querySelectorAll('.tpl-select__trigger'));
        trigger.bind('click', function (e) {
          var currentStyle = e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display;
          if (currentStyle === 'block') {
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'none';
          } else {
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'block';
          }
        });
        //bind click on item
        var listItem = angular.element(element.querySelectorAll('.tpl-select__list'));
        listItem.bind('click', function (e) {
          var currentStyle = e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display;
          if (currentStyle === 'block') {
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'none';
          } else {
            e.target.parentElement.getElementsByClassName('tpl-select__list')[0].style.display = 'block';
          }
        });
      }
    }
  };
});