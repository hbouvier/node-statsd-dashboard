module.exports = function () {
    var api    = require('./api'),
        elapse = require('./elapse'),
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "rest",
            "pid"    : process.pid,
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);
        
    /**
     * HTTP Request to lex a phrase
     * 
     * @param req: an HTTP request
     * @param res: an HTTP response
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://localhost/ws/stats
     */
    function stats(req, res) {
        var now    = elapse.start();
        var body   = req ? req.body : null;
        var statsObject  = typeof(body) === 'object' ? body : null;
        if (!statsObject) {
            return res.jsonp(412, {"code":412, "message": meta.module + '|stats|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : body)});
        }
        api.emit(statsObject);
        res.jsonp({"status":"OK"});
    }

    
    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "stats" : stats
    };
}();
