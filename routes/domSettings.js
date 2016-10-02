var MobileDetect = require('mobile-detect')
_DOM = {};
exports.floodAtlasData = function(req) {
    var x = {}
    var md = new MobileDetect(req.headers['user-agent']);
    var isMobile = (md.mobile() == null) ? false : true;
    x['mobileDevice'] = isMobile
    x['theLoc'] = (req.hostname == 'localhost') ? "/" : "/asfpm/duluth_node/public/"
    x['params'] = req
    return x
}
exports.getData = function(req, queryString) {
    var md = new MobileDetect(req.headers['user-agent']);
    var isMobile = (md.mobile() == null) ? false : true;
    var p = (req.hostname == 'localhost') ? "/" : "/asfpm/duluth_node/public/" //Setting File Locations
        // Rerouting
    d = (req.hostname == 'localhost') ? "/dataPortal" : "/duluthfloodhazards/dataPortal"
    a = (req.hostname == 'localhost') ? "/about" : "/duluthfloodhazards/about"
    w = {
        dirCurrent: p,
        dataPath: d,
        aboutPath: a
    }
    x = (typeof queryString == "undefined") ? {} : JSON.parse(decodeURIComponent(queryString))
    z = {}
    z['_DOM'] = x
    z['_DOM'].mobileDevice = isMobile
    z['location'] = w
    z.variables = {};
    z.variables['publicPath'] = p
    z.variables['dataPath'] = d
    z.variables['aboutPath'] = a
    return z
}
