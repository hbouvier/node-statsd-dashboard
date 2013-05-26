module.exports = function () {
    var io      = require('socket.io'),
        events  = require('events'),
        statsdEvents = new events.EventEmitter(),

        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "api",
            "pid"    : process.pid
        };
        
    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);

    function emit(stats) {
        logger.log('verbose', '%s|emit|stats=%j', meta.module, stats, meta);
        statsdEvents.emit('stats', stats);
    }
    
    function setIO(io) {
        io.set('log level', 1);
        
        io.sockets.on('connection', function (socket) {
            
            var emitter = function (stats) {
                socket.emit('stats', stats);
            };
            statsdEvents.on('stats', emitter);
            
            socket.on('disconnect', function () {
                statsdEvents.removeListener('stats', emitter);
            });
        });
        
    }
    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "emit"  : emit,
        "setIO" : setIO
    };
}();
