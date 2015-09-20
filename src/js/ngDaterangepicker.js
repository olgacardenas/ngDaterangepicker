angular.module('jkuri.daterangepicker', [])

.directive('ngDaterangepicker', ['$document', function($document) {
	'use strict';

	return {
		restrict: 'EA',
		require: '?ngModel',
		scope: true,
		link: function (scope, element, attrs, ngModel) {
			
			scope.format = attrs.format || 'YYYY-MM-DD';
			scope.locale = attrs.locale || 'en';

			scope.opened = false;
			scope.dayNames = [];
			scope.viewValue = null;
			scope.dateFromValue = null;
			scope.dateToValue = null;

			scope.daterange = '';

			scope.selectedDateFrom = null;
			scope.selectedDateTo = null;

			moment.locale(scope.locale);

			var dateFrom = moment();
			var dateTo = moment();

			var generateCalendar = function (date, to) {
				var lastDayOfMonthFrom = dateFrom.endOf('month').date(),
					monthFrom = dateFrom.month(),
					yearFrom = dateFrom.year(),
					nFrom = 1,
					i;

				var lastDayOfMonthTo = dateTo.endOf('month').date(),
					monthTo = dateTo.month(),
					yearTo = dateTo.year(),
					nTo = 1;
			
				var firstWeekDayFrom = scope.firstWeekDaySunday === true ? dateFrom.set('date', 2).day() : dateFrom.set('date', 1).day();
				if (firstWeekDayFrom !== 1) {
					nFrom -= firstWeekDayFrom - 1;
				}

				var firstWeekDayTo = scope.firstWeekDaySunday === true ? dateTo.set('date', 2).day() : dateTo.set('date', 1).day();
				if (firstWeekDayTo !== 1) {
					nTo -= firstWeekDayTo - 1;
				}

				if (to !== undefined) {
					scope.daysTo = [];
					scope.dateToValue = dateTo.format('MMMM YYYY');
					for (i = nTo; i <= lastDayOfMonthTo; i += 1) {
						if (i > 0) {
							scope.daysTo.push({day: i, month: monthTo + 1, year: yearTo, enabled: true});
						} else {
							scope.daysTo.push({day: null, month: null, year: null, enabled: false});
						}
					}
				} else {
					scope.daysFrom = [];
					scope.dateFromValue = dateFrom.format('MMMM YYYY');
					for (i = nFrom; i <= lastDayOfMonthFrom; i += 1) {
						if (i > 0) {
							scope.daysFrom.push({day: i, month: monthFrom + 1, year: yearFrom, enabled: true});
						} else {
							scope.daysFrom.push({day: null, month: null, year: null, enabled: false});
						}
					}
				}
			};

			var generateDayNames = function () {
				var date = scope.firstWeekDaySunday === true ?  moment('2015-06-07') : moment('2015-06-01');
				for (var i = 0; i < 7; i += 1) {
					scope.dayNames.push(date.format('ddd'));
					date.add('1', 'd');
				}
			};

			generateDayNames();
			generateCalendar(dateFrom);
			generateCalendar(dateTo, true);

			scope.open = function () {
				scope.opened = true;
			};

			scope.close = function () {
				scope.opened = false;
			};

			scope.prevYear = function (to) {
				if (to !== undefined) {
					dateTo.subtract(1, 'Y');
					generateCalendar(dateTo, true);
				} else {
					dateFrom.subtract(1, 'Y');
					generateCalendar(dateFrom);
				}
			};

			scope.prevMonth = function (to) {
				if (to !== undefined) {
					dateTo.subtract(1, 'M');
					generateCalendar(dateTo, true);
				} else {
					dateFrom.subtract(1, 'M');
					generateCalendar(dateFrom);
				}
			};

			scope.nextMonth = function (to) {
				if (to !== undefined) {
					dateTo.add(1, 'M');
					generateCalendar(dateTo, true);
				} else {
					dateFrom.add(1, 'M');
					generateCalendar(dateFrom);
				}
			};

			scope.nextYear = function (to) {
				if (to !== undefined) {
					dateTo.add(1, 'Y');
					generateCalendar(dateTo, true);
				} else {
					dateFrom.add(1, 'Y');
					generateCalendar(dateFrom);
				}
			};

			scope.selectDate = function (e, d, to) {
				e.preventDefault();

				if (to) {
					scope.selectedDateTo = moment(d.year + ' ' + d.month + ' ' + d.day, scope.format);
				} else {
					scope.selectedDateFrom = moment(d.year + ' ' + d.month + ' ' + d.day, scope.format);
				}

				scope.daterange = '';

				if (scope.selectedDateFrom !== null && scope.selectedDateTo !== null)  {
					scope.daterange = scope.selectedDateFrom.format(scope.format) + ' - ' + scope.selectedDateTo.format(scope.format);
					ngModel.$setViewValue(scope.daterange);
				}

				if (scope.selectedDateFrom !== null && scope.selectedDateTo !== null) {
					scope.close();
				}
				
			};

			scope.markDate = function (d, to) {
				var currentHoverDate,
					currentNDate;

				if (to) {
					if (scope.selectedDateFrom === null) {
						return;
					}

					scope.daysTo.forEach(function(i, k) {
						i.active = false;
					});

					currentHoverDate = moment(d.year + ' ' + d.month + ' ' + d.day, scope.format);
					currentNDate = null;

					scope.daysTo.forEach(function(i, k) {
						currentNDate = moment(i.year + ' ' + i.month + ' ' + i.day, scope.format);
						if (currentNDate <= currentHoverDate && currentNDate >= scope.selectedDateFrom) {
							i.active = true;
						}
					});

					// mark from dates
					scope.daysFrom.forEach(function(i, k) {
						currentNDate = moment(i.year + ' ' + i.month + ' ' + i.day, scope.format);
						i.active = false;

						if (currentNDate <= currentHoverDate && currentNDate >= scope.selectedDateFrom) {
							i.active = true;
						}
					});
					

				} else {
					if (scope.selectedDateTo === null) {
						return;
					}

					scope.daysFrom.forEach(function(i, k) {
						i.active = false;
					});

					currentHoverDate = moment(d.year + ' ' + d.month + ' ' + d.day, scope.format);
					currentNDate = null;

					scope.daysFrom.forEach(function(i, k) {
						currentNDate = moment(i.year + ' ' + i.month + ' ' + i.day, scope.format);
						if (currentNDate >= currentHoverDate && currentNDate <= scope.selectedDateTo) {
							i.active = true;
						}
					});

					// mark to dates
					scope.daysTo.forEach(function(i, k) {
						currentNDate = moment(i.year + ' ' + i.month + ' ' + i.day, scope.format);
						i.active = false;

						if (currentNDate >= currentHoverDate && currentNDate <= scope.selectedDateTo) {
							i.active = true;
						}
					});

				}
			};

			// if clicked outside of calendar
			var classList = ['ng-daterangepicker', 'ng-daterangepicker-container'];
            if (attrs.id !== undefined) classList.push(attrs.id);
			$document.on('click', function (e) {
				if (!scope.opened) return;

				var i = 0,
					element;

				if (!e.target) return;

				for (element = e.target; element; element = element.parentNode) {
					var id = element.id;
					var classNames = element.className;

					if (id !== undefined) {
						for (i = 0; i < classList.length; i += 1) {
							if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
								return;
							}
						}
					}
				}

				scope.close();
				scope.$apply();
			});

			ngModel.$render = function () {
				var newValue = ngModel.$viewValue;
				if (newValue !== undefined) {
					scope.daterange = newValue;
				}
			};

		},
		template:
		'<div class="ng-daterangepicker-container">' +
		'  <input class="date" type="text" ng-model="daterange" ng-focus="open()">' +
		'  <div class="ng-daterangepicker" ng-show="opened">' +
		'    <div class="ng-calendar-container">' +
		'      <div class="controls">' +
		'        <div class="left">' +
		'          <i class="fa fa-backward prev-year-btn" ng-click="prevYear()"></i>' +
		'          <i class="fa fa-angle-left prev-month-btn" ng-click="prevMonth()"></i>' +
		'        </div>' +
		'        <span class="date">{{ dateFromValue }}</span>' +
		'        <div class="right">' + 
		'          <i class="fa fa-angle-right next-month-btn" ng-click="nextMonth()"></i>' +
		'          <i class="fa fa-forward next-year-btn" ng-click="nextYear()"></i>' +
		'        </div>' +
		'      </div>' +
		'      <div class="day-names">' +
		'        <span ng-repeat="dn in dayNames track by $index">' +
		'          <span>{{ dn }}</span>' +
		'        </span>' +
		'      </div>' +
		'      <div class="cal">' +
		'        <span ng-repeat="d in daysFrom track by $index">' +
		'          <span class="day" ng-click="selectDate($event, d, false)" ng-class="{disabled: !d.enabled, active: d.active && d.enabled}" ng-mouseover="markDate(d, false)">{{ d.day }}</span>' +
		'        </span>' +
		'      </div>' +
		'    </div>' +
		'    <div class="ng-calendar-container">' +
		'      <div class="controls">' +
		'        <div class="left">' +
		'          <i class="fa fa-backward prev-year-btn" ng-click="prevYear(true)"></i>' +
		'          <i class="fa fa-angle-left prev-month-btn" ng-click="prevMonth(true)"></i>' +
		'        </div>' +
		'        <span class="date">{{ dateToValue }}</span>' +
		'        <div class="right">' + 
		'          <i class="fa fa-angle-right next-month-btn" ng-click="nextMonth(true)"></i>' +
		'          <i class="fa fa-forward next-year-btn" ng-click="nextYear(true)"></i>' +
		'        </div>' +
		'      </div>' +
		'      <div class="day-names">' +
		'        <span ng-repeat="dn in dayNames track by $index">' +
		'          <span>{{ dn }}</span>' +
		'        </span>' +
		'      </div>' +
		'      <div class="cal">' +
		'        <span ng-repeat="d in daysTo track by $index">' +
		'          <span class="day" ng-click="selectDate($event, d, true)" ng-class="{disabled: !d.enabled, active: d.active && d.enabled}" ng-mouseover="markDate(d, true)">{{ d.day }}</span>' +
		'        </span>' +
		'      </div>' +
		'    </div>' +
		'  </div>' +
		'</div>'
	};

}]);