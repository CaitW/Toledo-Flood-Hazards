var map = (function() {
    // DOM
    // map values
    var _map;
    var _bounds = L.latLngBounds(config.bounds.sW, config.bounds.nE);
    // submodules
    var _layers = (function() {
        // DOM
        var $basemapsContainer;
        var $layersContainer;
        var _currentBasemap = L.featureGroup();
        // Layers
        var _basemaps = {
            satellite: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                layerName: "satellite",
                layerType: "basemap",
                name: 'ESRI.WorldImagery',
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                displayName: "Satellite",
                default: false
            }),
            toner: L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
                layerName: "toner",
                layerType: "basemap",
                name: 'Stamen.Toner',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                displayName: "Toner",
                default: true
            }),
            terrain: L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
                layerName: "terrain",
                layerType: "basemap",
                name: 'Stamen.Terrain',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                displayName: "Terrain",
                default: false
            })
        };
        var _basicLayers = {
            watershed: new L.geoJson(chesterCreekWatershed, {
                style: {
                    "color": "#673AB7",
                    "weight": 5,
                    "opacity": 1,
                    "lineCap": "round",
                    "fill": false
                },
                layerType: "layer",
                attribution: false,
                layerName: "watershed",
                displayName: "Watershed",
                className: "watershed",
                default: false
            }),
            stormwater: new L.geoJson(stormwaterJSON, {
                style: {
                    "color": "#3F51B5",
                    "weight": 2,
                    "opacity": 1,
                    "lineCap": "round"
                },
                layerType: "layer",
                position: "back",
                attribution: false,
                layerName: "stormwater",
                displayName: "Storm Water Network",
                className: "stormwater",
                smoothFactor: 3,
                default: false
            }),
            streams: new L.esri.dynamicMapLayer({
                url: config.serviceURL,
                className: '2',
                layers: [0],
                opacity: ($('[name="layerCheckboxes"]:eq(4)')
                    .is(':checked')) ? 1 : 0,
                attribution: false,
                layerName: "streams",
                displayName: "Streams",
                layerType: "layer",
                default: false
            })
        };
        var _advancedLayers = {
            landUse: new LandUse(),
            depthGrids: new DepthGrids(),
            hazards: new Hazards()
        };

        function _updateBasemap() {
            _currentBasemap.clearLayers();
            var current = $('[name="basemapRadios"]:checked')
                .val();
            _basemaps[current].addTo(_currentBasemap);
        };

        function _updateAttribution() {
            $("#fullAttribution")
                .empty();
            $.each(config.attribution, function(key, attribution) {
                $("#fullAttribution")
                    .append(attribution)
                    .append("<br>");
            });
            _map.eachLayer(function(layer) {
                if (typeof layer.options.attribution != "undefined" && layer.options.attribution) {
                    if (typeof layer.options.opacity != "undefined" && layer.options.opacity > 0) {
                        $("#fullAttribution")
                            .append(layer.options.attribution)
                            .append("<br>");
                    } else if (typeof layer.options.opacity == "undefined") {
                        $("#fullAttribution")
                            .append(layer.options.attribution)
                            .append("<br>");
                    }
                }
            });
        }

        function _toggleLayers($layer) {
            var layerName = $layer.attr("data-name");
            var setVisible = ($layer.is(':checked')) ? true : false;

            function changeOpacity() {
                var opacityValue = (setVisible) ? 1 : 0;
                return layer.setOpacity(opacityValue)
            }
            // vector layers don't have a setOpacity method, so they must be added/removed from the map
            function toggleInMap() {
                if (setVisible && !map.hasLayer(layer)) {
                    _map.addLayer(layer);
                } else if (!setVisible && map.hasLayer(layer)) {
                    _map.removeLayer(layer);
                }
            };
            switch (layerName) {
                case "hazus":
                    hazards.toggle(setVisible);
                    break;
                case "depth":
                    depthGrids.toggle(setVisible);
                    break;
                case "stormwater":
                    toggleInMap();
                    break;
                case "landUse":
                    landUse.toggle(setVisible);
                    break;
                case "watershed":
                    toggleInMap();
                    break;
                case "streams":
                    changeOpacity();
                    break;
            };
        }

        function init() {
            _map.addLayer(_currentBasemap);
            ////////////////////////////
            // populate DOM variables //
            ////////////////////////////
            $basemapsContainer = $("#basemapBody .panel-body");
            $layersContainer = $("#layerBody .panel-body");
            /////////////////////////////////////
            // populate basemaps and layer DOM //
            /////////////////////////////////////
            $.each(_basemaps, function(basemapName, basemap) {
                var $basemapRadio = $("<input type='radio' name='basemapRadios' value='" + basemapName + "'>" + basemap.options.displayName + "</input>");
                if (basemap.options.default === true) {
                    $basemapRadio.attr("checked", "checked");
                }
                var $basemapOption = $("<div class='radio'><label></label></div>");
                $basemapOption.find("label")
                    .append($basemapRadio);
                $basemapOption.appendTo($basemapsContainer);
            });
            $.each(_basicLayers, function(layerName, layer) {
                var layerCheckbox = $("<input name='layerCheckboxes' type='checkbox' data-name='" + layerName + "' value='" + layerName + "'>" + layer.options.displayName + "</input>");
                if (layer.options.default === true) {
                    $layerCheckbox.attr("checked", "checked");
                }
                var layerSelector = $("<div class='checkbox'><label></label></div>");
                layerSelector.find("label")
                    .append(layerCheckbox);
                layerSelector.appendTo($layersContainer);
            });
            $.each(_advancedLayers, function(layerName, layer) {
                $layersContainer.prepend(layer.init(_map));
            });
            // Update the attribution Text on layer change
            $('[name="basemapRadios"],[name="layerCheckboxes"]')
                .on('change', _updateAttribution);
            // Change in Layer checkbox event listener
            $('input[name="layerCheckboxes"]')
                .on('change', function() {
                    _toggleLayers($(this))
                });
            $(document)
                .on("click", "#openFullAttribution", function() {
                    $("#fullAttribution")
                        .slideToggle();
                });
            _updateBasemap();
        }
        return {
            init: init
        }
    })();
    // d3 layers
    function _resizeMap() {
        $("#map")
            .css("height", function() {
                return ($(window)
                    .height() - $('#navHeader')
                    .height())
            })
        _map.invalidateSize()
        $(document)
            .trigger("map-resize");
    };

    function zoomIn () {
        _map.zoomIn();
    };

    function zoomOut () {
        _map.zoomIn();
    };

    function zoomReset () {
        _map.fitBounds(_bounds);
    };

    function init() {
        _map = L.map('map', {
                zoomControl: false,
                maxZoom: 16,
                minZoom: 2,
                attributionControl: false,
                trackResize: true
            })
            .fitBounds(_bounds);
        // Adjust map height
        $("#map")
            .css("height", function() {
                return ($(window)
                    .height() - $('#navHeader')
                    .height())
            });
        // Add Chrevrons in Side Bar
        $('.expandPanel')
            .each(function() {
                iconClass = ($(this)
                    .parents('a')
                    .attr('aria-expanded') == 'true') ? 'fa-chevron-down' : 'fa-chevron-right'
                $(this)
                    .append('<i class="fa ' + iconClass + ' pull-left arrow">')
                $(this)
                    .parents('a')
                    .on('click', function() {
                        $(this)
                            .find('.arrow')
                            .toggleClass('fa-chevron-right fa-chevron-down')
                    })
            });
        $(document).on("click", "#zoomIn", zoomIn);
        $(document).on("click", "#zoomOut", zoomOut);
        $(document).on("click", "#zoomReset", zoomReset);
        _layers.init();
        /////////////////////
        // Event Listeners //
        /////////////////////
        $(window)
            .on('resize', function() {
                delay(function() {
                    _resizeMap();
                }, 800)
            });
        // resize map on load
        _resizeMap();
    };
    return {
        init: init
    }
})();
