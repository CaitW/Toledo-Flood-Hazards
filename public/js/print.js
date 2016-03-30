var print = (function() {
    var _map;

    function init() {
        _map = L.map('printMap', {
            zoomControl: false,
            center: map.getCenter(),
            zoom: map.getZoom(),
            attributionControl: false,
            layers: [BASE]
        });
        // get all the layers from the current map and add them to the print map
        map.eachLayer(function(layer) {
            _map.addLayer(layer);
        });
    };
})();
