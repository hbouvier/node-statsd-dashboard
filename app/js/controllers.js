var guard = false;
var GraphsCtrl = [ '$scope', 'Socket', function ($scope, Socket) {
    if (guard) return;
    guard = true;
    $scope.graphName = {};
    $scope.graphs = [];
    $scope.col = 1;
    $scope.row = 1;
    $scope.count = 0;
    console.log('GraphsCtlr|ENTER');
    Socket.on('stats', function (data) {
        console.log('GraphsCtrl|socket.io|stats=', data);
        reset();
        if (false) {
        parse(data.gauges, data.timestamp);
        } else {
        ['gauges','timers','counters'].forEach(function (key) {
            parse(data[key], data.timestamp);
        });
        }
    });
    
    
    var reset = function() {
        console.log('GraphsCtrl|reset');
        for (var property in $scope.graphName) {
            if ($scope.graphName.hasOwnProperty(property)) {
                $scope.graphName[property].data.push({});
                if ($scope.graphName[property].data.length > 10)
                    $scope.graphName[property].data.shift();
                $scope.graphName[property].labels = [];
                $scope.count += 1;
            }
        }
        
    };
    
    var parse = function(stats, timestamp) {
        console.log('GraphsCtrl|parse|timestamp='+timestamp);
        for (var keyPath in stats) {             // keyPath = DrOctopus.cpu.used
            if (false && keyPath.substring(0, "DrOctopus.cpu.".length) !== "DrOctopus.cpu.")
                continue;
            if (stats.hasOwnProperty(keyPath)) {  
                var parts = keyPath.split('.');
                if (parts.length > 1) {
                    var domain   = parts.splice(0, parts.length -1).join('.'); // DrOctopus.cpu
                    var key      = domain.replace(/\./g, '_');                 // DrOctopus_cpu
                    var selector = parts;                                      // used
                    
                    if (!$scope.graphName[key]) {
                        console.log('GraphsCtrl|parse|timestamp='+timestamp+'|NEW|'+key);
                        $scope.graphName[key] = {
                            isNew  : true,
                            name   : domain,
                            key    : key,
                            labels : [],
                            data   : [{}],
                            col    : $scope.col,
                            row    : $scope.row
                        };
                        if ($scope.col === 3) {
                            $scope.col = 1;
                            ++$scope.row;
                        } else {
                            ++$scope.col;
                        }
                        $scope.graphs.push($scope.graphName[key]);
                    }
                    var found = false;
                    for (var i = 0 ; i < $scope.graphName[key].labels.length ; ++i) {
                        if ($scope.graphName[key].labels[i] == selector) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        $scope.graphName[key].labels.push(selector);
                        console.log('GraphsCtrl|parse|timestamp='+timestamp+'|'+key+'|label='+selector);
                    }
                    $scope.graphName[key].data[$scope.graphName[key].data.length -1].timestamp  = timestamp;
                    $scope.graphName[key].data[$scope.graphName[key].data.length -1][selector] = stats[keyPath];
                    console.log('GraphsCtrl|parse|timestamp='+timestamp+'|'+key+'|value='+stats[keyPath]);
                }
            }
        }
        
        setTimeout(function () {
        for (var property in $scope.graphName) {
            if ($scope.graphName.hasOwnProperty(property)) {
                if ($scope.graphName[property].isNew) {
                    console.log('GraphsCtrl|parse|timestamp='+timestamp+'|NEW Morris|'+property);
                    
                    $scope.graphName[property].isNew = false;
                    $scope.graphName[property].area = new Morris.Line({
                      element: property,
                      data: $scope.graphName[property].data,
                      ymin: 0.0,
                      //ymax: 100.0,
                      pointSize:0,
                      xkey: 'timestamp',
                      ykeys: $scope.graphName[property].labels,
                      labels: $scope.graphName[property].labels,
                      parseTime: false,
                      hideHover: true
                  });
                } else {
                    $scope.graphName[property].area.setData($scope.graphName[property].data);
                    console.log('GraphsCtrl|parse|timestamp='+timestamp+'|add|'+property);
                }
            }
        }
        }, 1000);
        
    };

    console.log('GraphsCtlr|EXIT');
}];
