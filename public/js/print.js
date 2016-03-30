var print = (function() {
    var _map;
    var _attribution;
    // d3 functions and variables
    var _d3SVG;
    var _hazardGroup;
    var _circles;
    var _scales = {
        color: ScaleEm('color'),
        radius: ScaleEm('radius')
    };
    var _transform = d3.geo.transform({
        point: _projectPoint
    });
    var _path = d3.geo.path().projection(_transform);
    // legend containers
    var $footer;

    function _projectPoint(x, y) {
        var point = _map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    };

    function _createHazardLayer() {
        // add the hazard layer (d3 layer)
        _d3SVG = d3.select(_map.getPanes().overlayPane).append("svg").style("z-index", "250");
        // add the g element that will hold the hazard symbols
        _hazardGroup = _d3SVG.append("g").attr("class", "leaflet-zoom-hide hazardSymbols");
        // Define scales and data picking function
        var pickData = getCurrent();
        _circles = _hazardGroup.selectAll('circle').data(allYearData.features).enter().append('circle');
        _circles.filter(function(d, i) {
            return pickData(d) != 0
        }).sort().sort(function(a, b) {
            return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))
        }).attr('fill', function(d) {
            return _scales.color(pickData(d))
        }).attr('stroke', function(d) {
            return _scales.color(pickData(d))
        }).attr('class', 'colorful printSymbols').attr('r', function(d) {
            return ($('input[name="layerCheckboxes"]:eq(0)').is(':checked') == true) ? (_scales.radius(pickData(d)) * 0.7) : 0
        }).attr("cx", function(d) {
            return _map.latLngToLayerPoint(d.LatLng).x
        }).attr("cy", function(d) {
            return _map.latLngToLayerPoint(d.LatLng).y
        }).call(test);
    };

    function _createMap() {
        // initialize the print map Leaflet DOM
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

    function _createFooter () {
        $footer = $("<div><h2>Flood Hazards</h2></div>");
        var $attrText = $("<small style='font-size: xx-small'></small>")
            .append($('#fullAttribution').html().replace(/<br>/g, "; "));
        var $hazardLegend = $("<span class='pull-left'></span>")
            .append("<h4>Flood Hazards</h4>")
            .append($('#baseText').html())
            .append($('#hazardLegendSVG').parent().html());
        var $landUseLegend = $("<span class="pull-right"></span>");
            .append("<div class='printLegend'>" + $('#landUsePanel svg').parent().html() + "</div>");
        // append everything to the footer container
        $footer.append($attrText)
            .append($hazardLegend);
        if(map.hasLayer(layers.landUse)) {
            $footer.append($landUseLegend);
        }
    };

    function destroy () {
        // destroy map, clear container
        // destroy footer, clear container
        // destroy symbols
    };  

    function create() {
        _createMap();
        _createHazardLayer();
        _createFooter();
        $('#printHolder').print({
            stylesheet: '' + serverVariables.publicPath + 'css/printing.css',
            append: [$footer]
        });
    };

    return {
        create: create,
        destroy: destroy
    }
})();
