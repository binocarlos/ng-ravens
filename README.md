ng-ravens
=========

Angular directive that renders a contact form with a ReCaptcha element.

## installation

```
$ component install binocarlos/ng-ravens
```

## usage

```js
angular.module('myApp', [
	require('ng-ravens')
])

.controller('MyAppCtrl', function($scope){

	$scope.ravens ={
		url:'/contactsubmit',
		key:'dfdsfsdfsdfsdfsdf'
	}

	$scope.$on('ravens:submit', function(ev, data){
		data.extrafield = 'hello';
	})

	$scope.$on('ravens:error', function(ev, error){

	})
	
})
```

```html

<ravens url="ravens.url" key="ravens.key" />

```

## license

MIT