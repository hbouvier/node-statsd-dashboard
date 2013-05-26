module.exports = function () {
    var router    = require('./util/router'),
        dashboard = require('./dashboard'),
        winston   = require('winston'),
        logger    = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "debug",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta      = { 
            "module" : "reoutes",
            "pid"    : process.pid,
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);

    /**
     * initialize the routes that the Express Application will serve
     * 
     * @param app: an Express Application object
     * @param context: All the URL will start with that context prefix (e.g.
     *                 "/api/..." or "/webservice/...")
     */
    function init(app, context) {
        logger.log('debug', '%s|adding|routes|context=%s', meta.module, context, meta);
        dashboard.api.setIO(app.get('socket.io'));
        router.add(app, context + '/stats', 'POST', dashboard.rest.stats);
    }

    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "init"     : init,
    };
}();




