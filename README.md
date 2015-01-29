# angular-customizable-select

Thie is just another kind of customizable select directive but unlike other there's no need to create a predefined template.

Just add some attributes to your select-field and it's done.

#### Attributes
 * tpl-options: array of options shown on select
 * tpl-label: the object key that represents the label that data
 * ng-model: the model where the data should be saved
 
#### You write... 
```
<select tpl-select tpl-options="myOptions" tpl-label="myLabelKey" ng-model="myModel"></select>
```

#### ...and this will appear
 ```
<div class="tpl-select">
  <div class="tpl-select__trigger">{{ngModel[tplLabel] | translate}}</div>
  <ul class="tpl-select__list">
    <li  class="tpl-select__list-item" ng-repeat="option in tplOptions" ng-Click="select(option)">
    {{option[tplLabel] | translate}}
    </li>
  </ul>
</div>
```

#NOTE:#
Till now, the only way to input options is by usign a parameter from $scope!