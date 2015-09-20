# ngDaterangepicker
AngularJS Date Range Picker directive

#### Dependencies
    - AngularJS
    - moment.js
    - fontawesome

#### Example 

Check out [the live demo](http://demo.jankuri.com/ngDaterangepicker/)

Install
-------

#### With bower:

    $ bower install ngDaterangepicker
    
#### With npm:

    $ npm install ng-daterangepicker
    
#### Example Configuration (bower)
```html
<!DOCTYPE html>
<html ng-app="app">
<head>
	<title>AngularJS DatePicker</title>
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="src/css/ngDaterangepicker.css">
</head>
<body ng-controller="Ctrl as ctrl">

<ng-daterangepicker ng-model="ctrl.daterange" locale="en"></ng-daterangepicker>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment-with-locales.min.js"></script>
<script src="src/js/ngDaterangepicker.min.js"></script>
<script>
var app = angular.module('app', ['jkuri.daterangepicker']);
app.controller('Ctrl', [function() {
	var self = this;
	
	self.daterange;
}]);
</script>
</body>
</html>
``` 
