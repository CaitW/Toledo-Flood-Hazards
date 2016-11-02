var appData = require('../data/appdata.json')
var MobileDetect = require('mobile-detect')
_DOM = {
    scenarioSelector: 0,
    scaleSelector: 'jenks',
    layerCheckboxes: [0, 1],
    sublayers: ["CLU", "mains", "ditches", 28, 27, 12, 20],
    basemapRadios: 1,
    fieldSelector: "BldgDmgPct",
    floodEventRadios: 6,
    showCompareFeatures: false,
    sW: [46.78912989119917, -92.1701431274414],
    nE: [46.86265591336103, -92.05856323242188],
    mode: 'advanced',
    compareType: 'landuse'
}

function retrieveGlobals(x) {
    var _globals = {}
    _globals['damagesCurrent'] = String(appData.scenarios[x.scenarioSelector].udf + x.floodEventRadios)
    _globals['damagesCompare'] = String(appData.scenarios[x.scenarioSelector]["compare-" + x.compareType] + x.floodEventRadios)
    _globals['depthGridCurrent'] = appData.scenarios[x.scenarioSelector].dg + x.floodEventRadios
    _globals['damageIndexWidth'] = appData.scenarios[x.scenarioSelector].width
    _globals['minimumDamageIndex'] = appData.scenarios[x.scenarioSelector].udf + appData.floods[0].value
    _globals['maximumDamageIndex'] = appData.scenarios[x.scenarioSelector].udf + appData.floods[5].value
    _globals['sW'] = [46.78912989119917, -92.1701431274414]
    _globals['nE'] = [46.86265591336103, -92.05856323242188]
    _globals['mode'] = 'advanced'
    return _globals
}
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
    x = (queryString == undefined) ? _DOM : JSON.parse(decodeURIComponent(queryString))
    y = retrieveGlobals(x)
    z = {}
    z['_DOM'] = x
    z['_DOM'].mobileDevice = isMobile
    z['variables'] = y
    z['location'] = w
    z.variables['publicPath'] = p
    z.variables['dataPath'] = d
    z.variables['aboutPath'] = a
    return z
}
