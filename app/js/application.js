angular.module('Application', ['Services']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/dashboard', {controller:GraphsCtrl, templateUrl:'partials/graphs.html'}).
            otherwise({redirectTo:'/dashboard'});
    }])
    .
    directive('ngIf', function() {
        return {
            link: function(scope, element, attrs) {
                if(scope.$eval(attrs.ngIf)) {
                    // remove '<div ng-if...></div>'
                    element.replaceWith(element.children())
                } else {
                    element.replaceWith(' ')
                }
            }
        }
    })

    .directive("nggridster", function() {
        return function(scope, element, attrs) {
            console.log('watch|graphs');
            scope.$watch("graphs", function() {
                if (watchGuard) return;
                watchGuard = true;
                setTimeout(function () {
                
                console.log('watch|graphs|executing');
                $(".gridster > ul").gridster({
                    widget_margins: [10, 75],
                    widget_base_dimensions: [400, 200],
                    min_cols: 1
                }).data('gridster');                
                
                }, 500);
            });
        };
    })

;

var watchGuard = false;