var print = (function() {
    var _state = "stopped";
    var _map;
    var _attribution;
    // d3 functions and variables
    var _d3SVG;
    var _hazardGroup;
    var _circles;
    var _scales = {
        color: false,
        radius: false
    };
    var _transform = d3.geo.transform({
        point: _projectPoint
    });
    var _path = d3.geo.path()
        .projection(_transform);
    // legend containers
    var $footer;

    function _cloneLayer(layer) {
        var options = layer.options;
        // Tile layers
        if (layer instanceof L.TileLayer) {
            return L.tileLayer(layer._url, options);
        }
        if (layer instanceof L.ImageOverlay) {
            return L.imageOverlay(layer._url, layer._bounds, options);
        }
        // Marker layers
        if (layer instanceof L.Marker) {
            return L.marker(layer.getLatLng(), options);
        }
        if (layer instanceof L.circleMarker) {
            return L.circleMarker(layer.getLatLng(), options);
        }
        // Vector layers
        if (layer instanceof L.Rectangle) {
            return L.rectangle(layer.getBounds(), options);
        }
        if (layer instanceof L.Polygon) {
            return L.polygon(layer.getLatLngs(), options);
        }
        if (layer instanceof L.Polyline) {
            return L.polyline(layer.getLatLngs(), options);
        }
        // MultiPolyline is removed in leaflet 0.8-dev
        if (L.MultiPolyline && layer instanceof L.MultiPolyline) {
            return L.polyline(layer.getLatLngs(), options);
        }
        // MultiPolygon is removed in leaflet 0.8-dev
        if (L.MultiPolygon && layer instanceof L.MultiPolygon) {
            return L.multiPolygon(layer.getLatLngs(), options);
        }
        if (layer instanceof L.Circle) {
            return L.circle(layer.getLatLng(), layer.getRadius(), options);
        }
        if (layer instanceof L.GeoJSON) {
            return L.geoJson(layer.toGeoJSON(), options);
        }
        // ESRI-Leaflet
        if (layer instanceof L.esri.DynamicMapLayer) {
            return L.esri.dynamicMapLayer(options);
        }
        // layer/feature groups
        if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
            var layergroup = L.layerGroup();
            layer.eachLayer(function(inner) {
                layergroup.addLayer(_cloneLayer(inner));
            });
            return layergroup;
        }
        throw 'Unknown layer, cannot clone this layer';
    }

    function _projectPoint(x, y) {
        var point = _map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    };

    function _createHazardLayer() {
        // add the hazard layer (d3 layer)
        _d3SVG = d3.select(_map.getPanes()
                .overlayPane)
            .append("svg")
            .style("z-index", "250");
        // add the g element that will hold the hazard symbols
        _hazardGroup = _d3SVG.append("g")
            .attr("class", "leaflet-zoom-hide hazardSymbols");
        // Define scales and data picking function
        var pickData = getCurrent();
        _circles = _hazardGroup.selectAll('circle')
            .data(allYearData.features)
            .enter()
            .append('circle');
        _circles.filter(function(d, i) {
                return pickData(d) != 0
            })
            .sort()
            .sort(function(a, b) {
                return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))
            })
            .attr('fill', function(d) {
                return _scales.color(pickData(d))
            })
            .attr('stroke', function(d) {
                return _scales.color(pickData(d))
            })
            .attr('class', 'colorful printSymbols')
            .attr('r', function(d) {
                return ($('input[name="layerCheckboxes"]:eq(0)')
                    .is(':checked') == true) ? (_scales.radius(pickData(d)) * 0.7) : 0
            })
            .attr("cx", function(d) {
                return _map.latLngToLayerPoint(d.LatLng)
                    .x
            })
            .attr("cy", function(d) {
                return _map.latLngToLayerPoint(d.LatLng)
                    .y
            });
    };

    function LoadCheck(callback) {
        var self = this;
        var _done = false;
        var _doneFn = callback;
        var _printLayers = [];
        var _printCompleted = [];

        function queue(layer) {
            var index = _printLayers.push(layer) - 1;
            if (typeofLayer(layer)
                .type == "vector") {
                layer.on('add', function() {
                    _printCompleted.push(layer);
                    checkIfDone();
                });
            } else if (typeofLayer(layer)
                .type == "raster") {
                layer.on('load', function() {
                    _printCompleted.push(layer);
                    checkIfDone();
                });
            }
        };

        function checkIfDone() {
            if (_printLayers.length == _printCompleted.length) {
                setTimeout(function() {
                    if (!_done) {
                        _doneFn();
                        _done = true;
                    }
                }, 1000);
            }
        };
        this.add = function(layer) {
            if (typeof layer.options.opacity != "undefined" && layer.options.opacity > 0) {
                queue(layer);
            } else if (typeof layer.options.opacity == "undefined") {
                queue(layer);
            }
        };
    };

    function _createMap(callback) {
        $('#printHolder')
            .append('<h2>Flood Hazards</h2><div id="printMap" style="width: 6.8in;height: 3.5in;"></div>');
        var mainMapBounds = map.getBounds();
        // initialize the print map Leaflet DOM
        _map = L.map('printMap', {
            zoomControl: false,
            attributionControl: false
        });
        _map.fitBounds(mainMapBounds);
        // get all the layers from the current map and add them to the print map
        var isLoaded = new LoadCheck(callback);
        map.eachLayer(function(layer) {
            try {
                if (typeofLayer(layer)
                    .type == "layer group") {
                    layer.eachLayer(function(inner) {
                        var clone = _cloneLayer(inner);
                        isLoaded.add(clone);
                        _map.addLayer(clone);
                    });
                } else {
                    var clone = _cloneLayer(layer);
                    isLoaded.add(clone);
                    _map.addLayer(clone);
                }
            } catch (err) {
                console.log(err);
            }
        });
    };

    function _createFooter() {
        $footer = $("<div class='footer'></div>");
        var $attrText = $("<small style='font-size: xx-small'></small>")
            .append($('#fullAttribution')
                .html()
                .replace(/<br>/g, "; "));
        var $hazardLegend = $("<div class='printLegend'></div>")
            .append("<h4>Flood Hazards</h4>")
            .append($('#baseText')
                .html())
            .append($('#hazardLegendSVG')
                .parent()
                .html())
        var $landUseLegend = $("<div class='printLegend'>")
            .append("<h4>Land Use</h4>")
            .append($('#landUsePanel svg')
                .parent()
                .html());
        // append everything to the footer container
        $footer.append($attrText)
            .append($hazardLegend);
        if (map.hasLayer(layers.landUse)) {
            $footer.append($landUseLegend);
        }
    };

    function _destroy() {
        // destroy map
        _map.remove();
        // destroy footer
        $footer.remove();
        // destroy symbols
        _d3SVG = null;
        _hazardGroup = null;
        _circles = null;
        $('#printHolder')
            .empty();
        $(".map-printer")
            .find(".fa-refresh")
            .removeClass("fa-refresh")
            .removeClass("fa-spin")
            .addClass("fa-print");
        _state = "stopped";
    };
    // manually sort the layers in the map so they appear correctly
    function _sortLayers() {
        var layersToSort = {
            depth: false,
            basemap: false,
            landUse: false,
            stormwater: false,
            streams: false
        };
        _map.eachLayer(function(l) {
            if (typeof l.options.layerName != "undefined") {
                switch (l.options.layerName) {
                    case "depth":
                        layersToSort.depth = l;
                        break;
                    case "landUse":
                        layersToSort.landUse = l;
                        break;
                    case "basemap":
                        layersToSort.basemap = l;
                        break;
                    case "stormwater":
                        layersToSort.stormwater = l;
                        break;
                    case "streams":
                        layersToSort.streams = l;
                        break;
                }
            }
        });
        // raster layers include: streams, basemap, depth grids
        if (layersToSort.basemap) {
            layersToSort.basemap.bringToBack();
        }
        if (layersToSort.streams) {
            layersToSort.streams.bringToFront();
        }
        if (layersToSort.depth) {
            if (layersToSort.depth._currentImage && layersToSort.depth._currentImage._image) {
                $(layersToSort.depth._currentImage._image)
                    .addClass("depth-image");
            }
        }
        // vector layers include: land use, stormwater
        if (layersToSort.landUse) {
            layersToSort.landUse.bringToBack();
        }
        if (layersToSort.stormwater) {
            layersToSort.stormwater.bringToFront();
        }
    };

    function _create() {
        if (_state == "stopped") {
            _state = "started";
            $(".map-printer")
                .find(".fa-print")
                .removeClass("fa-print")
                .addClass("fa-refresh")
                .addClass("fa-spin");
            _createMap(function() {
                _sortLayers();
                _createHazardLayer();
                _createFooter();
                $('#printHolder')
                    .print({
                        stylesheet: '' + serverVariables.publicPath + 'css/printing.css',
                        append: [$footer]
                    });
                _destroy();
            });
        };
    };

    function init() {
        _scales.color = ScaleEm('color');
        _scales.radius = ScaleEm('radius');
        $('.printer')
            .on('click', function() {
                target = $(this)
                    .attr('data')
                $(target)
                    .print({
                        stylesheet: "../css/printing.css"
                    })
            });
        // Print Map
        $('.map-printer')
            .on('click', _create);
    };
    return {
       init: init
    }
})();
