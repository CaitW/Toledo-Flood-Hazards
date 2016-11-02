////////////////////////
// globalVariables.js //
////////////////////////
var colors = {
    BldgLossUS: ['#edf8b1', '#7fcdbb', '#1d91c0', '#225ea8', '#081c55'],
    BldgDmgPct: ['#ffeda0', '#feb24c', '#fc4e2a', '#e31a1c', '#b10026'],
    BldgLossUS_change: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
    BldgDmgPct_change: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"]
};
var quantilecolors = {
    BldgLossUS: ['#7fcdbb', '#1d91c0', '#225ea8', '#081c55'],
    BldgDmgPct: ['#feb24c', '#fc4e2a', '#e31a1c', '#b10026'],
    BldgLossUS_change: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
    BldgDmgPct_change: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"]
};
var jenksColors = {
    BldgLossUS: ['#ffffd1', '#edf8b1', '#7fcdbb', '#1d91c0', '#225ea8', '#081c55'],
    BldgDmgPct: ['#ffffd1', '#ffeda0', '#feb24c', '#fc4e2a', '#e31a1c', '#b10026'],
    BldgLossUS_change: ["#2166ac", "#67a9cf", "#d1e5f0", "#fddbc7", "#ef8a62", "#b2182b"],
    BldgDmgPct_change: ["#2166ac", "#67a9cf", "#d1e5f0", "#fddbc7", "#ef8a62", "#b2182b"],
};
var aliases = {
    BldgLossUS: "Damages (Thousands of $) ",
    BldgDmgPct: "Percent Damage",
    OBJECTID: "Property ID"
};
var customExists = {},
    device = null;
/////////////////
// helpTour.js //
/////////////////
var helpData = {
    "navbar": {
        selector: ".navbar-brand",
        popOptions: {
            content: "<strong>click</strong> the map title to access help at anytime",
            placement: "bottom",
            title: "Getting Help",
            delay: {
                "show": 1000,
                "hide": 0
            }
        }
    },
    "toggle": {
        selector: "#menu-toggle",
        popOptions: {
            content: "<i class='fa fa-navicon'></i>&nbsp;&nbsp; the navigation button opens/closes the menu",
            placement: "bottom",
            title: "Opening the Menu",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            openUp = ($('#sidebar-wrapper')
                    .width() == 0) ? $('#menu-toggle')
                .trigger('click') : null
        }
    },
    "scenario": {
        selector: "#scenario-list",
        popOptions: {
            content: "The report analyzed the affect of different climate / landuse scenarios on flood events in Duluth. Choose any of the scenarios listed in this menu to view that dataset on the map.",
            placement: "bottom",
            title: "Changing the Scenario",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#scenario-list .list-group-item",
        before: function() {
            return ($("#dataBody")
                    .is(":visible") != true) ? $("a[href='#dataBody']")
                .trigger('click') : null
        }
    },
    "attribute": {
        selector: "#attributeBody .list-group",
        popOptions: {
            content: "The flood damages predicted by the report can be measured in either <em>Monetary Losses</em> or <em>Percent Damage</em>, select either from the attribute menu to change the way the map quantifies flood hazards.",
            placement: "bottom",
            title: "Changing the Attribute",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#attributeBody .list-group-item",
        before: function() {
            return ($("#attributeBody")
                    .is(":visible") != true) ? $("a[href='#attributeBody']")
                .trigger('click') : null
        }
    },
    "floodevent": {
        selector: "#floodEventBody .list-group",
        popOptions: {
            content: "The study also assesed multiple flood events. By selecting any of the events listed in this menu you can change the severity of the flood shown on the map.",
            placement: "bottom",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#floodEventBody .list-group-item",
        before: function() {
            return ($("#floodEventBody")
                    .is(":visible") != true) ? $("a[href='#floodEventBody']")
                .trigger('click') : null
        }
    },
    "basemap": {
        selector: "#basemapBody .panel-body",
        popOptions: {
            content: "You can also change the underlying basemap shown on the map by selecting any of the options shown on the basemap menu.",
            placement: (startingValues.mobileDevice == true) ? "bottom" : "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            isVisible = ($("#basemapBody")
                    .is(":visible") != true) ? $('a[href="#basemapBody"]')
                .trigger('click') : null
            return $('#sidebar-wrapper')
                .scrollTo("#basemapBody")
        }
    },
    "layer": {
        selector: "#layerBody",
        popOptions: {
            content: "In addition to flood hazards, you can also overlay many other layers on the map by clicking the checkboxes in the layers menu.",
            placement: (startingValues.mobileDevice == true) ? "bottom" : "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            isVisible = ($("#layerBody")
                    .is(":visible") != true) ? $('a[href="#layerBody"]')
                .trigger('click') : null
            $('#sidebar-wrapper')
                .scrollTo("#layerBody")
        }
    },
    "share": {
        selector: "#shareBody",
        popOptions: {
            content: "Share the findings displayed on the Duluth Flood Hazard Visualizer with the world!<br>Print or Export your custom map view",
            placement: (startingValues.mobileDevice == true) ? "top" : "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            $('#sidebar-wrapper')
                .scrollTo("#shareBody")
        }
    },
    "map": {
        selector: "#map",
        popOptions: {
            content: "The map displays <strong>Flood Hazard Data</strong> reported by <em>Economic Assessment of Green Infrastructure Strategies for Climate Change Adaptation: Pilot Studies in The Great Lakes Region </em> ",
            placement: "bottom",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {},
        after: function() {
            var y = $('.tourPop')
                .attr('id')
            $('#' + y + '')
                .css('top', '30%')
            $('#' + y + ' .arrow')
                .addClass('invisible')
        }
    },
    "legend": {
        selector: "#hazardLegendSVG",
        popOptions: {
            content: "The legend panel explains what the different colors and sizes of the circles mean",
            placement: (startingValues.mobileDevice == true) ? "bottom" : "right",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#hazardLegendSVG",
        before: function() {
            return ($("#floodHazardsPanel")
                    .is(":visible") != true) ? $('a[href="#floodHazardsPanel"]')
                .trigger('click') : null
        }
    },
    "zoom": {
        selector: ".zoomHolder",
        popOptions: {
            content: "The zoom controls allow you to adjust the map scale<ul class='fa-ul'><li><i class='fa fa-plus'></i>&nbsp;&nbsp;Increases the zoom level</li><li><i class='fa fa-minus'></i>&nbsp;&nbsp;Decreases the zoom level</li><li><i class='fa fa-globe'></i>&nbsp;&nbsp;Resets the zoom level</li></ul><small>You can also zoom using your scroll wheel (desktop) or a two-finger pinch (mobile)</small>",
            placement: "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            if ($('#wrapper')
                .hasClass('toggled') && (startingValues.mobileDevice == true)) {
                $('#menu-toggle')
                    .trigger('click')
            }
        },
        after: function() {
            var y = $('.popover.tourPop')
                .attr('id');
            $('.popover.tourPop #' + y + '')
                .css('top', '30%')
            $('#' + y + ' .arrow')
                .addClass('invisible')
        }
    },
    "stat": {
        selector: "#statsBody",
        popOptions: {
            content: "The statistics menu displays various measures of the dataset currently shown on the map.",
            placement: (startingValues.mobileDevice == true) ? "top" : "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#statsBody",
        before: function() {
            isVisible = ($("#statsBody")
                    .is(":visible") != true) ? $('a[href="#statsBody"]')
                .trigger('click') : null
            return $('#sidebar-wrapper')
                .scrollTo("#statsBody")
        }
    },
    "charts": {
        selector: "#chartsBody",
        popOptions: {
            content: "By selecting any of the options listed in the charts menu you can view and print graphs and diagrams of the data.",
            placement: (startingValues.mobileDevice == true) ? "top" : "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#statsBody",
        before: function() {
            isVisible = ($("#chartsBody")
                    .is(":visible") != true) ? $('a[href="#chartsBody"]')
                .trigger('click') : null
            return $('#sidebar-wrapper')
                .scrollTo("#chartsBody")
        }
    },
    "mode": {
        selector: "#modeBody .list-group",
        popOptions: {
            content: "The Duluth Flood Hazard Visualizer allows you to interact with the data in two different ways: <ul><li><strong>Discover</strong>&mdash; allows new users to learn more about the dataset</li><li><strong>Analyze</strong>&mdash; allows experienced users draw conclusions based on the data</li></ul> Select either option from the mode menu to change the Visualizer's settings.",
            placement: "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        focusEl: "#modeBody .list-group",
        before: function() {
            $('#sidebar-wrapper')
                .scrollTo("#modeBody .list-group")
        }
    },
    "chart": {
        selector: "#chartsvg",
        popOptions: {
            content: "This chart redisplays the data on the map...",
            placement: "top",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        selector_standin: "#chart",
        before: function() {
            return ($("#chart")
                    .is(":visible") != true) ? $('#dataDistributionHeading a')
                .trigger('click') : null
        }
    },
    "classbreak": {
        selector: ".draggable:last",
        popOptions: {
            content: "The classbreaks, &mdash;<small>the points separating the various color categories</small>&mdash; are represented on the chart by the horizontal lines.<br>By dragging them up or down you can define a custom color scale.",
            placement: "top",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            return ($("#chart")
                    .is(":visible") != true) ? $('#dataDistributionHeading a')
                .trigger('click') : null
        },
        after: function() {
            (startingValues.mobileDevice == false) ? $('.tourPop')
                .css("left", ($("#chartsvg")
                    .width() / 2)): null
        }
    },
    "bar": {
        selector: '.colorful.bars[height!=0]:first',
        popOptions: {
            content: "...each bar corresponds with a circle on the map.<br>By clicking on a bar you can zoom to the corresponding circle",
            placement: "top",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            return ($("#chart")
                    .is(":visible") != true) ? $('#dataDistributionHeading a')
                .trigger('click') : null
        }
    },
    "circle": {
        selector: '.colorful.symbols[r!=0]:first',
        popOptions: {
            content: "Each of the circles on the map represents a land parcel where in which the study predicted that the given flood event would cause damage",
            placement: "top",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            t = parseInt($('.colorful.symbols[r!=0]:first')
                .attr('id')
                .split('ID_')[1])
            map.setView(databyID[t].LatLng, 14)
        },
        after: function() {
            $('.tourPop')
                .css("left", "" + (parseFloat($('.tourPop')
                    .position()
                    .left) + parseFloat($('.colorful.symbols[r!=0]:first')
                    .attr("r"))) + "px")
        }
    },
    "pop": {
        selector: '.symbolPop>.arrow',
        popOptions: {
            content: "Click on any circle to view specific information on that parcel.",
            placement: "bottom",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            openPop(parseInt($('.colorful.symbols[r!=0]:eq(0)')
                .attr('id')
                .split('ID_')[1]))
        },
        after: function() {
            drawBox('.symbolPop')
        }
    },
    "scaleselector": {
        selector: "#scale-selector-dropdown",
        popOptions: {
            content: "The color scale selector allows you to change the map's classification system &mdash;<small>the categorization method used to determine which data values correspond with which color</small>",
            placement: (startingValues.mobileDevice == true) ? "left" : "right",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            isVisible = ($("#floodHazardsPanel")
                    .is(":visible") != true) ? $('a[href="#floodHazardsPanel"]')
                .trigger('click') : null
        }
    },
    "displayPanel": {
        selector: "#displayPanel .panel-heading-blue",
        popOptions: {
            content: "The display panel houses controls for modifying the map state",
            placement: "left",
            delay: {
                "show": 1000,
                "hide": 0
            },
            placement: (startingValues.mobileDevice == true) ? "bottom" : "left",
        },
        before: function() {
            $('#sidebar-wrapper')
                .scrollTo("#displayPanel ")
        }
    },
    "analyzePanel": {
        selector: "#analyzePanel .panel-heading-blue",
        popOptions: {
            content: "The analyze panel houses tools for investigating the data on the map ",
            delay: {
                "show": 1000,
                "hide": 0
            },
            placement: (startingValues.mobileDevice == true) ? "top" : "left"
        },
        before: function() {
            $('#sidebar-wrapper')
                .scrollTo("#analyzePanel")
        }
    },
    "dataDistBtn": {
        selector: "#dataDistributionHeading",
        popOptions: {
            content: "By clicking the data distribution button you can show/hide the data distribution chart.",
            placement: (startingValues.mobileDevice == true) ? "top" : "left",
            delay: {
                "show": 1000,
                "hide": 0
            }
        },
        before: function() {
            $('#sidebar-wrapper')
                .scrollTo("#dataDistributionHeading")
        }
    },
};
var currentTour = null
interfaceElements = ["navbar", "toggle"];
mapElements = ["map", "zoom", "circle", "pop", "legend"];
dataPanel = ["scenario", "floodevent", "attribute"];
sideBar = ["toggle", "layer", "basemap", "stat", "chart", "bar", "scaleselector", "classbreak", "share"];
var tours = {
    advanced: ["navbar", "map", "zoom", "circle", "pop", "legend", "scenario", "floodevent", "attribute", "toggle", "displayPanel", "layer", "basemap", "analyzePanel", "stat", "charts", "dataDistBtn", "chart", "bar", "classbreak", "share"]
};
////////////////////
// Make Histogram //
////////////////////
var yearDataLists = null;
var yearValues = null;
var yearKeys = null;
var scenarioData = null;
//////////////////
// MakePopup.js //
//////////////////
aaallPointData = null;
//////////////////
/// DrawData.js //
////////////////// 
var mapsvg, transform, mapSymbolGroup, chartMargin, chartWidth, chartHeight, chartsvg, dragging, drag, haz_m, haz_w, haz_h, hazSVG;
// createSymbols
var hazardSymbols, hazardData;
///////////////////
// Prototypes.js //
///////////////////
var pop = null;
////////////
// Map.js //
////////////
var serviceURL = "http://69.11.243.109:6080/arcgis/rest/services/NOAA_ECON/Duluth_MapService_Final/MapServer";
var siteBounds, map, path, satellite, toner, terrain, basemap, basemapList, currentBasemap, depth, stormWater, allLayersList;
/////////////
// Init.js //
/////////////
var landUseCheck, watershedCheck, stormWaterCheck;
////////////
// Custom // 
////////////
var layers;
var landUseColors = d3.scale.ordinal()
    .domain(["Commercial", "Green Space", "Industrial", "Institutional Campus", "Other", "Residential"])
    .range(["#838faa", "#00aa00", "#4d4d4d", "#ffaa7f", "#ff8e90", "#fff47b"]);
// non-layer attributions
var attributionData = {
    fontAwesome: "Icons <a href='http://fontawesome.io'>Font Awesome</a> by Dave Gandy",
    icons8: "Icons made by Icons8 from <a href='http://www.flaticon.com'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/'>CC BY 3.0</a>",
};

function typeofLayer(layer) {
    if (layer instanceof L.TileLayer) {
        return {
            type: "raster",
            name: "Tile Layer"
        }
    }
    if (layer instanceof L.ImageOverlay) {
        return {
            type: "raster",
            name: "Image Overlay"
        };
    }
    // Marker layers
    if (layer instanceof L.Marker) {
        return {
            type: "marker",
            name: "Marker"
        };
    }
    if (layer instanceof L.circleMarker) {
        return {
            type: "marker",
            name: "Circle Marker"
        };
    }
    // Vector layers
    if (layer instanceof L.Rectangle) {
        return {
            type: "vector",
            name: "Rectangle"
        };
    }
    if (layer instanceof L.Polygon) {
        return {
            type: "vector",
            name: "Polygon"
        };
    }
    if (layer instanceof L.Polyline) {
        return {
            type: "vector",
            name: "Polyline"
        };
    }
    // MultiPolyline is removed in leaflet 0.8-dev
    if (L.MultiPolyline && layer instanceof L.MultiPolyline) {
        return {
            type: "vector",
            name: "MultiPolyline"
        };
    }
    // MultiPolygon is removed in leaflet 0.8-dev
    if (L.MultiPolygon && layer instanceof L.MultiPolygon) {
        return {
            type: "vector",
            name: "MultiPolygon"
        };
    }
    if (layer instanceof L.Circle) {
        return {
            type: "vector",
            name: "Circle"
        };
    }
    if (layer instanceof L.GeoJSON) {
        return {
            type: "vector",
            name: "GeoJson"
        };
    }
    // ESRI-Leaflet
    if (layer instanceof L.esri.DynamicMapLayer) {
        return {
            type: "raster",
            name: "ESRI DynamicMapLayer"
        };
    }
    // layer/feature groups
    if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
        return {
            type: "layer group",
            name: "Layer Group"
        };
    }
};

function resize() {
    $("#map")
        .css("height", function() {
            return ($(window)
                .height() - $('#navHeader')
                .height())
        })
    map.invalidateSize()
    spotlight.attr('width', function() {
            return $(document)
                .width();
        })
        .attr('height', function() {
            return $(document)
                .height();
        })
    chartResize();
}
// Toggles Current Basemap
function changeBasemap() {
    basemap.clearLayers();
    currentBasemap = basemapList[$('[name="basemapRadios"]:checked')
        .val()];
    basemap['currentBaseMap'] = $('[name="basemapRadios"]:checked')
        .val();
    currentBasemap.addTo(basemap);
}
// Dispatch Layer Display Changes on checkbox toggle
function toggleLayers(checkbox) {
    var layerIndex = parseInt($(checkbox)
        .val());
    var layer = allLayersList[layerIndex];
    var setVisible = ($(checkbox)
        .is(':checked')) ? true : false;

    function changeOpacity() {
        var opacityValue = (setVisible) ? 1 : 0;
        return layer.setOpacity(opacityValue)
    }
    // vector layers don't have a setOpacity method, so they must be added/removed from the map
    function toggleInMap() {
        if (setVisible && !map.hasLayer(layer)) {
            map.addLayer(layer);
        }
        else if (!setVisible && map.hasLayer(layer)) {
            map.removeLayer(layer);
        }
    };
    switch (layerIndex) {
        case 0:
            handleStyle();
            break;
        case 1:
            changeOpacity();
            break;
        case 2:
            toggleInMap();
            break;
        case 3:
            toggleInMap();
            if ($('#landUseLegendSVG')
                .length == 0) {
                makeLandUseLegend();
            }
            if (setVisible) {
                $('#landUsePanel')
                    .parents('.panel:first')
                    .slideDown();
            }
            else {
                $('#landUsePanel')
                    .parents('.panel:first')
                    .slideUp();
            }
            break;
        case 4:
            toggleInMap();
            break;
        case 5:
            toggleInMap();
            break;
    };
}
// Defines HTML for the custom attribution
function updateMapAttribution() {
    $("#fullAttribution")
        .empty();
    $.each(attributionData, function(key, attribution) {
        $("#fullAttribution")
            .append(attribution)
            .append("<br>");
    });
    map.eachLayer(function(layer) {
        if (typeof layer.options.attribution != "undefined" && layer.options.attribution) {
            if (typeof layer.options.opacity != "undefined" && layer.options.opacity > 0) {
                $("#fullAttribution")
                    .append(layer.options.attribution)
                    .append("<br>");
            }
            else if (typeof layer.options.opacity == "undefined") {
                $("#fullAttribution")
                    .append(layer.options.attribution)
                    .append("<br>");
            }
        }
    });
}
var print = (function() {
    var _state = "stopped";
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
            }
            else if (typeofLayer(layer)
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
            }
            else if (typeof layer.options.opacity == "undefined") {
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
                }
                else {
                    var clone = _cloneLayer(layer);
                    isLoaded.add(clone);
                    _map.addLayer(clone);
                }
            }
            catch (err) {
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

    function destroy() {
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

    function create() {
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
                destroy();
            });
        };
    };
    return {
        create: create,
        destroy: destroy
    }
})();

function getLink(obj) {
    // Define current map view extent
    var bounds = map.getBounds(),
        nElat = bounds._northEast.lat,
        nElng = bounds._northEast.lng,
        sWlat = bounds._southWest.lat,
        sWlng = bounds._southWest.lng;
    // Object storing all global variable values to encode in link
    var domExports = {}
    domExports['scenarioSelector'] = $('[name="scenarioRadios"]:checked')
        .parent()
        .parent()
        .index()
    domExports['scaleSelector'] = $('#scaleSelector option:selected')
        .val()
    domExports['layerCheckboxes'] = $('[name="layerCheckboxes"]:checked')
        .map(function() {
            return parseInt($(this)
                .val())
        })
        .get()
    domExports['sublayers'] = $('.subLayer input:checked')
        .map(function() {
            return (isNaN($(this)
                .val())) ? ($(this)
                .val()) : (parseInt($(this)
                .val()))
        })
        .get()
    domExports['basemapRadios'] = parseInt($('[name="basemapRadios"]:checked')
        .val())
    domExports['fieldSelector'] = $('[name="fieldRadios"]:checked')
        .val()
    domExports['floodEventRadios'] = parseInt($('[name="floodEventRadios"]:checked')
        .val())
    domExports['showCompareFeatures'] = showCompareFeatures
    domExports['sW'] = [sWlat, sWlng]
    domExports['nE'] = [nElat, nElng]
    domExports['mode'] = mode
    domExports['compareType'] = compareType
    var exportString = encodeURIComponent(JSON.stringify(domExports));
    // Place export string in input box
    $(obj)
        .attr('value', function() {
            linkPlace = (window.location.hostname === "localhost") ? "/" : "/duluthfloodhazards/"
            return '' + location.origin + '' + linkPlace + 'mapView/' + exportString + ''
        })
        // Show link input div
    $("#mapViewLink")
        .collapse('show')
    var text_val = eval(obj);
    text_val.focus();
    text_val.select();
    // Hide link input div after copied
    $("#mapViewLink input")
        .on('blur', function() {
            $("#mapViewLink")
                .collapse('hide')
        })
}

function ScaleEm(x, y, z) {
    scaleType = (showCompareFeatures == false) ? x : String(x) + 'Change'
    attribute = (((y == undefined) || (y == null)) && (showCompareFeatures == false)) ? currentAttribute : (((y == undefined) || (y == null)) && (showCompareFeatures == true)) ? String(currentAttribute) + '_change' : y
    scaleName = ((z == undefined) || (z == null)) ? $('#scaleSelector option:selected')
        .val() : z
    population = fullList.map(function(d) {
            return +d[attribute];
        }) //(showCompareFeatures==false)? fullList.map(function(d) { return + d[attribute] ; }) : changeList
    population.sort(d3.ascending)
    pop = population
    var Max = d3.max(fullList, function(d, i) {
        return fullList[i][attribute]
    })
    var standardDeviation = function() {
        var serie = new geostats(population)
        var classes = serie.getClassStdDeviation(4)
        var scale = d3.scale.threshold()
            .domain(classes)
            .range(jenksColors[attribute]);
        return scale
    }
    var equalInterval = function() {
        var serie = new geostats(population)
        var classes = serie.getClassEqInterval(4)
        var scale = d3.scale.threshold()
            .domain(classes)
            .range(jenksColors[attribute]);
        return scale
    }
    var jenks = function() {
        dom = ss.jenks(population.map(function(d) {
            return +d;
        }), 4)
        var scale = d3.scale.threshold()
            .domain(dom)
            .range(jenksColors[attribute]);
        return scale;
    }
    var custom = function() {
        var serie = new geostats(population)
        equalClasses = serie.getClassEqInterval(4)
        scaleDomain = (customExists[attribute] == undefined) ? equalClasses : customExists[attribute]
        var scale = d3.scale.threshold()
            .domain(scaleDomain)
            .range(jenksColors[attribute])
        return scale;
    }
    var linearHeight = function() {
            var scale = d3.scale.linear()
                .domain([Max, 0])
                .range([1, chartHeight]);
            return scale;
        }
        // var changeLinearHeight= function(){
        //  var scale = d3.scale.linear()
        //      .domain(d3.extent(changeList))
        //      .range([chartHeight, 0]);
        //      return scale;
        // }
    var thresholdRadius = function() {
        var scale = d3.scale.threshold()
            .domain(ss.jenks(population.map(function(d) {
                return +d;
            }), 4))
            .range([2, 5, 12, 18, 29, 40]);
        return scale
    }
    var linearRadius = function() {
            var scale = d3.scale.linear()
                .domain([0, Max])
                .range([0, 40]);
            return scale;
        }
        // var changeRadius = function(){
        //  maxneg = (d3.min(changeList)-1)
        //  maxpos = (d3.max(changeList)+1)
        //  biggest= Math.max(Math.abs(maxneg), maxpos)
        //  var scale = d3.scale.linear()
        //      .domain([biggest, 0, (biggest*-1)])
        //      .range([40, 0, 40]);
        //      return scale;
        // }
    var outScale = ((x == 'color') && (scaleName == 'jenks')) ? jenks() : ((x == 'color') && (scaleName == 'equalInterval')) ? equalInterval() : ((x == 'color') && (scaleName == 'stdDev')) ? standardDeviation() : ((x == 'color') && (scaleName == 'custom')) ? custom() : (scaleType == 'height') ? linearHeight() : (scaleType == 'radius') ? linearRadius() : (scaleType == 'heightChange') ? changeLinearHeight() : (scaleType == 'radiusChange') ? changeRadius() : null;
    return outScale
}
// Returns a copy of a javascript object
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
// Dispatches function for retrieving the current data (d) from allYearData
function getCurrent(x, y) {
    x = ((x == null) || (x == undefined)) ? currentAttribute : x
    comp = function(d) {
        current = (d[damagesCurrent] != 0) ? (d[damagesCurrent].attributes[x]) : 0
        compare = (d[damagesCompare] != 0) ? (d[damagesCompare].attributes[x]) : 0
        difference = ((current > 0) || (compare > 0)) ? (compare - current) : 0
        return difference
    }
    cur = function(d) {
        return (d[damagesCurrent] != 0) ? d[damagesCurrent].attributes[x] : 0
    }
    return (showCompareFeatures == true) ? comp : cur
}
// Move svg element in front of siblings
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};
// Move svg element behind sibblings
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};
// Scroll to a given DOM Element
$.fn.scrollTo = function(target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
        callback = options;
        options = target;
    }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 50,
        duration: 500,
        easing: 'swing'
    }, options);
    return this.each(function() {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset()
            .top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({
            scrollTop: scrollY
        }, parseInt(settings.duration), settings.easing, function() {
            if (typeof callback == 'function') {
                callback.call(this);
            }
        });
    });
}

function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
};
// Creates bar chart, legend, and proportional symbol elements when the map is first initialized
function createSymbols(data) {
    // Proportional symbols on map
    var symbols = mapSymbolGroup.selectAll('circle')
        .data(data.features)
        .enter()
        .append('circle')
        .attr('fill', colors[currentAttribute][0])
        .attr('stroke', function(d) {
            d["prev"] = 0;
            return 'white'
        })
        .attr('stroke-width', 0)
        .attr('width', 0)
        .attr('height', 0)
        .attr('class', 'colorful symbols')
        .attr('id', function(d) {
            return 'ID_' + d.id + ''
        })
        .attr('r', 0)
        .on('click', function(d) {
            openPop(d.id)
        });
    // Reposition the symbols when mapview changes
    function update() {
        symbols.attr("cx", function(d) {
                return map.latLngToLayerPoint(d.LatLng)
                    .x
            })
            .attr("cy", function(d) {
                return map.latLngToLayerPoint(d.LatLng)
                    .y
            });
    }
    map.on("moveend", update);
    update();
    // Main Chart
    var barGroup = chartsvg.append("g")
        .attr('class', 'barGroup');
    var bars = barGroup.selectAll("rect")
        .data(data.features)
        .enter()
        .append('rect')
        .attr('id', function(d) {
            return 'ID_' + d.id + ''
        })
        .attr('stroke-width', 0)
        .attr("stroke", "white")
        .attr('class', 'colorful bars')
        .attr('width', 0)
        .attr('height', 0)
        .attr('x', function(d, i) {
            return i * $(this)
                .attr('width')
        })
        .attr('y', function() {
            return chartHeight - $(this)
                .attr('height')
        })
        .on('click', function(d) {
            return map.setView(d.LatLng, 16)
        });
    // +/- Change Labels
    /*
    chartsvg.append("text")
        .attr('class', 'increasedDamages')
        .attr("text-anchor", "end")
        .attr('opacity', 0)
    chartsvg.append("text")
        .attr('class', 'decreasedDamages')
        .attr("text-anchor", "begining")
        .attr('opacity', 0)
    */
    // BreakLines
    var breakLineGroup = chartsvg.append("g")
        .attr('class', 'breakLineGroup');
    var breakLines = breakLineGroup.selectAll(".breakLines")
        .data(d3.range(5))
        .enter()
        .append("rect")
        .attr("class", "draggable")
        .call(drag);
    // Main Chart Axis Labels
    chartsvg.append("text")
        .attr('class', 'mainChartY')
        .attr("text-anchor", "middle")
        .attr('opacity', 0)
    chartsvg.append("text")
        .attr('class', 'mainChartX')
        .attr("text-anchor", "middle")
        .attr('opacity', 0);
    chartsvg.append("text")
        .attr('class', 'mainChartTitle')
        .attr("text-anchor", "middle")
        .attr('opacity', 0);
    // Attach coordinated highlighting between symbols and bars
    d3.selectAll('.colorful')
        .on("mouseover", function(event) {
            var target = $(this)
                .attr('id');
            d3.selectAll('#' + target + '')
                .classed({
                    'hover': true
                })
            return (dragging == false) ? d3.selectAll('#' + target + '.bars')
                .moveToFront() : null
        })
        .on("mouseout", function(event) {
            var target = $(this)
                .attr('id');
            d3.selectAll('#' + target + '')
                .classed({
                    'hover': false
                })
        })
        // flood hazards legend elements explaining color symbology
    var colorLegend = hazSVG.append('g')
        .attr('class', 'colorLegend')
        .selectAll('.colorGroup')
        .data(function() {
            return d3.range(5)
                .reverse()
        })
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
            return 'translate(' + ((haz_w / 5) * i) + ',0)'
        });
    colorLegend.append('rect')
        .attr('width', 0)
        .attr('height', 50)
        .attr('class', 'legendSymbols')
    colorLegend.append('text')
        .attr('class', 'halo')
    colorLegend.append('text')
        .attr('class', 'stroke')
        // flood hazards legend elements explaining size symbology
    var sizeLegend = hazSVG.append('g')
        .attr('class', 'sizeLegend')
        .selectAll('.sizeLegendGroup')
        .data(function() {
            return d3.range(5)
                .reverse()
        })
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
            return 'translate(' + ((haz_w / 6) * (i + 1)) + ',' + (haz_h * .75) + ')'
        });
    sizeLegend.append('circle')
        .attr('r', 0)
        .attr('class', 'legendSymbols')
    sizeLegend.append('text')
        .attr('y', (haz_h * .25))
        // legendHeadings
    var headings = hazSVG.append('g')
        .attr('class', 'headings')
        .selectAll('.heading')
        .data(function() {
            return d3.range(2)
                .reverse()
        })
        .enter()
        .append('text')
        .attr('class', 'legendHeading')
        .attr("transform", function(d, i) {
            return "translate(" + (haz_w / 2) + "," + (((haz_h / 2) * i) - haz_m.top) + ")"
        })
        .attr('dy', '1em');
    handleStyle()
}

function style() {
    // Defines function to expose the current data (ie. the dataset according the current scenario, flood event, and attribute selected)
    var pickData = getCurrent()
        // changeList=(showCompareFeatures==true) ? ($(allYearData.features).map(function(){return pickData(this)}).get()).sort(d3.descending) :[]
        // changeList.sort(d3.descending)
    var selectedData = d3.selectAll('.bars')
        .data()
        .map(function(d) {
            return pickData(d)
        })
        .filter(function(d) {
            return d != 0
        })
        .sort(function(a, b) {
            return d3.descending(Math.abs(a), Math.abs(b))
        })
    maxWidth = chartWidth / (selectedData.length)
        // Retrieve scales from dispatcher function
    var colorScale = ScaleEm('color'),
        linearHeight = ScaleEm('height'),
        radiScale = ScaleEm('radius');
    var breaks = colorScale.domain();
    // Update y axis
    var chartYaxis = d3.svg.axis()
        .scale(linearHeight)
        .orient("left")
        .tickValues(breaks);
    d3.select("#chartsvg .y.axis")
        .remove();
    chartsvg.append("g")
        .attr("class", "y axis")
        .call(chartYaxis);

    function updateLables() {
        // Update increase/decrease labels
        // d3.select(".increasedDamages")
        //  .transition().duration(500)
        //  .attr('opacity', 0)
        //  .text("Increased Flood Damages**")
        //  .attr("transform", function(){return "translate("+(chartWidth- (maxWidth*d3.selectAll('.bars').filter(function(d,i){return pickData(d)>4})[0].length))+","+(linearHeight(5))+")"})
        //  .transition().duration(1000)//.delay(2000)
        //  .attr('opacity', function(){return (showCompareFeatures==false)?0:1});
        // d3.select('.decreasedDamages')
        //  .transition().duration(500)
        //  .attr('opacity', 0)
        //  .text(function(){return(showCompareFeatures==false)?"Flood Damages": "Decreased Flood Damages"})
        //  .attr("transform", function(){return (showCompareFeatures==false)?"translate(-"+chartMargin.left+","+10+")": "translate("+((maxWidth*d3.selectAll('.bars').filter(function(d,i){return pickData(d)<-13})[0].length))+","+(linearHeight(-15))+")"})
        //  .transition().duration(1000)//.delay(2000)
        //  .attr('opacity', function(){return (showCompareFeatures==false)?0:1});
        // Update main chart labels
        d3.selectAll('.mainChartY')
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .text(function() {
                return (showCompareFeatures == false) ? "Flood Damages" : "Change in Flood Damages"
            })
            .attr("transform", function() {
                return "translate(-30," + (chartHeight / 2) + ") rotate(270)"
            })
            .transition()
            .delay(2000)
            .duration(1000)
            .attr('opacity', 1);
        d3.selectAll('.mainChartX')
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .text("Parcels in the Chester Creek watershed")
            .attr("transform", function() {
                return "translate(" + (chartWidth / 2) + "," + (chartHeight + chartMargin.top) + ")"
            })
            .transition()
            .delay(2000)
            .duration(1000)
            .attr('opacity', 1);
        d3.selectAll('.bars')
            .sort(function(a, b) {
                return (showCompareFeatures == false) ? d3.descending(pickData(a), pickData(b)) : d3.ascending(pickData(a), pickData(b))
            }); //.sort(function(a,b){return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))})[0]
        updateSymbology();
    }
    updateLables();

    function updateSymbology() {
        // Update main chart bar symbology
        d3.selectAll('.bars')
            .filter(function(d, i) {
                return pickData(d) != 0
            })
            .attr('height', function(d) {
                return (showCompareFeatures != true) ? (chartHeight - linearHeight(pickData(d))) : (Math.abs(linearHeight(pickData(d)) - linearHeight(0)))
            })
            .transition()
            .duration(2000)
            .attr("fill", function(d) {
                return colorScale(pickData(d))
            })
            .attr("opacity", 1) //function(d){return ((showCompareFeatures==true)&&(d[damagesCurrent]==0))? 0.7 : ((showCompareFeatures==true)&&(d[damagesCompare]==0)) ? 0.7 : 1})
            .attr('y', function(d) {
                return (showCompareFeatures != true) ? linearHeight(pickData(d)) : linearHeight(Math.max(0, pickData(d)))
            })
            .transition()
            .duration(1000) //.delay(1000)
            .attr('width', function() {
                return maxWidth
            })
            .attr('x', function(d, i) {
                return i * maxWidth
            });
        d3.selectAll('.bars')
            .filter(function(d, i) {
                return pickData(d) == 0
            })
            .transition()
            .duration(1000)
            .attr('width', 0)
            .attr('height', 0)
            .transition()
            .delay(1000)
            .duration(1000) //
            .attr('y', 0);
        // Update map symbol symbology
        d3.selectAll('.symbols')
            .classed("stroke-small-symbols", false)
            .filter(function(d, i) {
                return pickData(d) != 0
            })
            .sort()
            .sort(function(a, b) {
                return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))
            })
            .attr("stroke", function(d) {
                return (d.prev < radiScale(pickData(d))) ? "white" : d3.lab(d3.select(this)
                        .attr("fill"))
                    .darker()
            }) //<radiScale(pickData(d))) ? "white" : "black" })
            .attr("stroke-width", 2)
            .transition()
            .duration(2000)
            .attr("stroke", function(d) {
                return colorScale(pickData(d))
            })
            .attr("stroke-width", 0)
            .attr("r", function(d) {
                d["prev"] = radiScale(pickData(d));
                return ($('input[name="layerCheckboxes"]:eq(0)')
                    .is(':checked') == true) ? radiScale(pickData(d)) : 0
            })
            .attr("fill", function(d) {
                return colorScale(pickData(d))
            })
            .attr("fill-opacity", 0.8) //function(d){return ((showCompareFeatures==true)&&(d[damagesCurrent]==0))?0.4 : ((showCompareFeatures==true)&&(d[damagesCompare]==0)) ? 0.4 : 0.7});
            .attr("stroke-opacity", 1);
        d3.selectAll('.symbols')
            .filter(function(d, i) {
                return pickData(d) == 0
            })
            .attr("stroke-width", 2)
            .attr("stroke", function(d) {
                return d3.lab(d3.select(this)
                        .attr("fill"))
                    .darker()
            })
            .transition()
            .delay(1000)
            .duration(2000)
            .attr("r", function(d) {
                d["prev"] = 0;
                return 0
            })
            .attr("stroke-width", 0);
        // make sure that the smallest symbol has a stroke to make it visible on light backgrounds
        d3.selectAll('.symbols')
            .filter(function(d, i) {
                return (pickData(d) != 0 && pickData(d) < breaks[1]);
            })
            .classed("stroke-small-symbols", true)
        makeTicks();
    }
}

function makeTicks() {
    var colorScale = ScaleEm('color'),
        linearHeight = ScaleEm('height'),
        rScale = ScaleEm('radius');
    var evenBreaks = ScaleEm('color', null, "equalInterval")
        .domain()
    var breaks = ($('#scaleSelector option:selected')
        .val() == "quantile_Color") ? colorScale.quantiles() : colorScale.domain();
    textScale = d3.scale.ordinal()
        .domain([555, 333, 111, 4, 0])
        .range(['More Change', 'Less Change', 'More Change (-)', 'More Damages', 'Less Damages'])
    d3.selectAll('.draggable')
        .data(breaks)
        .attr('x', 0)
        .attr('height', 3)
        .attr('fill', function(d, i) {
            return colorScale(d)
        })
        .transition()
        .delay(500)
        .duration(1000)
        .attr('y', function(d) {
            return linearHeight(d)
        })
        .attr('width', chartWidth);
    d3.selectAll('.colorLegend rect')
        .transition()
        .duration(500)
        .attr('fill', function(d) {
            return colorScale(breaks[d])
        })
        .transition()
        .duration(1000)
        .attr('width', 50);
    d3.selectAll('.sizeLegend g')
        .sort(function(a, b) {
            return d3.descending(Math.abs(breaks[a]), Math.abs(breaks[b]))
        })
    d3.selectAll('.sizeLegend circle')
        .transition()
        .duration(600)
        .attr('r', function(d) {
            return (rScale(evenBreaks[d]) > 3) ? rScale(evenBreaks[d]) : 3
        })
        .attr('fill', function(d) {
            return colorScale(breaks[d])
        });
    d3.selectAll('.colorLegend text')
        .text('')
        .attr('x', 25)
        .attr('text-anchor', 'middle')
        .attr("dy", '1.3em')
        .transition()
        .duration(500)
        .text(function(d) {
            return (breaks[d + 1] != undefined) ? (d3.round(breaks[d]) + ' - ' + (d3.round(breaks[d + 1]) - 1) + '%') : (d3.round(breaks[d]) + "% +")
        });
    d3.selectAll('.legendHeading')
        .transition()
        .delay(500)
        .duration(1000)
        .text(function(d) {
            return (d == 0) ? 'Size' : 'Color'
        });
    d3.selectAll('.sizeLegend text')
        .text('')
        .attr('dy', '.5em')
        .filter(function(d, i) {
            return (showCompareFeatures == true) ? (d < 1 || d == 2 || d > 3) : (d < 1 || d > 3);
        })
        .transition()
        .delay(500)
        .duration(1000)
        .text(function(d, i) {
            return (showCompareFeatures == true) ? textScale((d + 1) * 111) : textScale(d)
        });
}

function chooseCustom() {
    var linearHeight = clone(ScaleEm('height'));
    var reverser = d3.scale.linear()
        .domain(linearHeight.range())
        .range(linearHeight.domain());
    var draggableValues = $('.draggable')
        .map(function() {
            return (reverser(parseInt($(this)
                .attr('y'))))
        })
        .get();
    var suffix = (showCompareFeatures == true) ? '_change' : ''
    customExists[String(currentAttribute) + suffix] = draggableValues
    $('#scaleSelector')
        .selectpicker('val', 'custom');
    $(".resetBreaks")
        .show()
    handleStyle();
}

function chartResize() {
    chartWidth = $('#page-content-wrapper')
        .width() - (chartMargin.left + chartMargin.right)
    chartHeight = $("#chart")
        .height() - chartMargin.top - chartMargin.bottom
    d3.select('#chartsvg')
        .attr('width', $('#page-content-wrapper')
            .width())
        .attr('height', chartHeight + chartMargin.top + chartMargin.bottom)
    chartsvg.transition()
        .duration(1000)
        .delay(200)
        .attr('width', chartWidth)
        .attr('height', chartHeight);
    handleStyle();
}

function handleStyle() {
    style();
    setTimeout(function() {
        $('#baseText')
            .html(function() {
                return getBaseText()
            });
    }, 500);
    updateStatistics();
    // updateHighlights();
    destroyPop()
}
// Creates Summary Stats for the population
function updateStatistics(x) {
    population = (x == undefined) ? d3.values(dataByYear[damagesCurrent])
        .map(function(d) {
            return d.attributes[currentAttribute]
        }) : x.map(function(d) {
            return d[damagesCurrent].attributes[currentAttribute]
        })
    form = (currentAttribute == "BldgDmgPct") ? d3.format('%') : d3.format('$,')
    math = (currentAttribute == "BldgDmgPct") ? function(x) {
        return x / 100
    } : function(x) {
        return x * 1000
    }
    stats = {
        mean: form(math(d3.round(d3.mean(population)))),
        median: form(math(d3.round(d3.median(population)))),
        sum: form(math(d3.round(d3.sum(population)))),
        n: String(population.length)
    }
    $('.stats-target')
        .each(function() {
            $(this)
                .html(stats[$(this)
                    .attr('data')])
        })
    return (currentAttribute == "BldgDmgPct") ? $('.stats-target[data="sum"]')
        .parent()
        .slideUp() : $('.stats-target[data="sum"]')
        .parent()
        .slideDown()
}
// Returns the Explanatory Legend Text
function getBaseText() {
    var floodYear = $('[name="floodEventRadios"]:checked')
        .attr("year")
    scenario = String($('[name="scenarioRadios"]:checked')
            .parent()
            .text())
        .toLowerCase()
    attribute = (currentAttribute == "BldgLossUS") ? "thousands of dollars" : "percent damage"
    var scenarioText = getScenarios()
    var outputText = "<p class='legendDescText'>{&nbsp;displayed "
    outputText = (showCompareFeatures == true) ? outputText.concat("as the net difference ") : outputText
    outputText = outputText.concat("in <strong>" + attribute + "</strong> resulting from a <strong>" + floodYear + " year flood</strong>")
    outputText = (showCompareFeatures == true) ? outputText.concat(" between scenario " + ($('.list-group-item.active')
        .index() + 1) + " and scenario " + ($('.list-group-item.compare')
        .index() + 1) + " }") : outputText.concat(", given <strong>" + scenario + "</strong>&nbsp;}</p>")
    return outputText
}
// Reposition the SVG to cover the features.
function resetTopoJson(t) {
    t.attr("d", path);
}

function getDamagesIndex() {
    return String(parseInt($('[name="scenarioRadios"]:checked')
        .attr("data-udf")) + parseInt($('input[name="floodEventRadios"]:checked')
        .attr('value')))
}

function getScenarios() {
    var primaryScenario = $('[name="scenarioRadios"]:checked')
        .val()
    comScenario = $('.list-group-item.compare [name="scenarioRadios"]')
        .val()
    return {
        primaryScenario: primaryScenario,
        compareScenario: comScenario
    }
}

function getCompareDamagesIndex() {
    DI = parseInt($('[name="scenarioRadios"]:checked')
        .attr('data-compare-' + $('[name="comparisonRadios"]:checked')
            .val() + ''))
    return String(parseInt($('input[name="floodEventRadios"]:checked')
        .attr('value')) + DI)
}

function getDGIndex() {
    return (parseInt($('[name="scenarioRadios"]:checked')
        .attr("data-dg")) + parseInt($('input[name="floodEventRadios"]:checked')
        .attr('value')));
}

function getCurrentAttribute() {
    return $('#fieldSelector option:selected')
        .val();
}

function setIndexValues(x) {
    x = (x == undefined) ? "checked" : "eq(" + x + ")"
    baseline = parseInt($("[name='scenarioRadios']:" + x + "")
        .attr("data-udf"))
    damageIndexWidth = parseInt($("[name='scenarioRadios']:" + x + "")
            .attr("data-width")),
        minimumDamageIndex = parseInt($('input[name="floodEventRadios"]:eq(0)')
            .attr('value')) + baseline,
        maximumDamageIndex = (parseInt($('input[name="floodEventRadios"]:eq(' + (damageIndexWidth - 1) + ')')
            .attr('value'))) + baseline;
    indexValues = {
        damageIndexWidth: damageIndexWidth,
        minimumDamageIndex: minimumDamageIndex,
        maximumDamageIndex: maximumDamageIndex
    }
    return indexValues
}

function makeHistogram() {
    var Max = null
    var stdPopulation = function() {
        Max = d3.max(fullList, function(d, i) {
            return fullList[i][currentAttribute]
        });
        return (allYearData.features)
            .filter(function(d, i) {
                return d[damagesCurrent] != 0
            })
            .filter(function(d, i) {
                return d[damagesCurrent].attributes[currentAttribute] > 0
            })
            .map(function(d) {
                return d[damagesCurrent].attributes[currentAttribute]
            })
            .sort(d3.ascending)
    }
    pickData = getCurrent()
    comparePopulation = function() {
        Max = d3.max(changeList, function(d, i) {
            return changeList[i]
        });
        return (allYearData.features)
            .filter(function(d, i) {
                return d[damagesCompare] != 0
            })
            .map(function(d) {
                return pickData(d)
            })
            .sort(d3.ascending)
    }
    population = (showCompareFeatures == true) ? comparePopulation() : stdPopulation()
    var values = population
    var formatCount = d3.format(",.00f");
    var margin = {
            top: 15,
            right: 30,
            bottom: 30,
            left: 40
        },
        width = $('#chartHolder')
        .parents('.modal-body')
        .width() - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var x0 = Math.max(-d3.min(values), d3.max(values))
    var x = d3.scale.linear()
        .domain([d3.min(population), Max])
        .nice()
        .range([0, width]);
    var data = d3.layout.histogram()
        .bins(x.ticks(Max))
        (values);
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
            return d.y;
        })])
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var colorScales = ScaleEm('color')
    var svg = d3.select("#chartHolder")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });
    histobars = bar.append("rect")
        .attr('class', 'histobars')
        .attr("x", 1)
        .attr("width", function() {
            return x(data[0].x + data[0].dx) - 1
        })
        .attr("height", 0)
        .attr("fill", function(d) {
            return colorScales(d[0]);
        })
        .attr("y", function(d) {
            return height - y(d.y);
        });
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -7)
        .attr("x", x(data[0].x + data[0].dx) / 2)
        .attr("bin", function(d) {
            return ("" + d.x + "-" + (d.x + d.dx) + "");
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return formatCount(d.y);
        });
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    svg.append("text")
        .attr("transform", "translate(0," + (height + margin.bottom) + ") rotate(0)")
        .attr("x", (width / 2))
        .style("text-anchor", "center")
        .attr("class", "axisLabel")
        .text(function() {
            return (showCompareFeatures == false) ? aliases[currentAttribute] : "Net Difference in " + aliases[currentAttribute]
        });
    svg.append("text")
        .attr("transform", "translate(-" + (margin.left) + "," + margin.top + ") rotate(-90)")
        .attr("x", -1 * (height / 2))
        .attr("y", 12)
        .style("text-anchor", "center")
        .attr("class", "axisLabel")
        .text("Frequency")
    var chartContents = d3.selectAll('text,.axis')
        .attr('opacity', 0)
        // setTimeout(function(){
        // $('#chartHolder').slideDown()
    animateHisto()
        // }, 200)
    function animateHisto() {
        chartContents.transition()
            .delay(200)
            .duration(600)
            .attr('opacity', 1)
        histobars.transition()
            .delay(1000)
            .duration(1000)
            .attr('y', 0)
            .attr('height', function(d) {
                return height - y(d.y);
            })
    }
}

function makePie() {
    currentColors = $('.draggable')
        .map(function() {
            return $(this)
                .attr('fill')
        })
        .get()
    pieData = [],
        totalPie = 0;
    pieTextScale = d3.scale.ordinal()
        .range($('.colorLegend')
            .children()
            .map(function() {
                return $(this)
                    .children('.stroke')
                    .text()
            })
            .get())
        .domain($('.colorLegend')
            .children()
            .map(function() {
                return $(this)
                    .children('rect')
                    .attr('fill')
            })
            .get())
    $(currentColors)
        .each(function() {
            count = $('.colorful.symbols[fill="' + this + '"]')
                .length
            pieceOfPie = {
                flavor: this,
                count: count,
                string: String(this)
            }
            pieData.push(pieceOfPie)
            totalPie += count
        })
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = $('#chartHolder')
        .parents('.modal-body')
        .width() - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    radius = Math.min(width, height) / 2.5;
    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);
    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.count;
        });
    var svg = d3.select("#chartHolder")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var g = svg.selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");
    var key = function(d) {
        return d.data.flavor;
    };

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    var piedata = pie(pieData)
    var slice = g.append("path")
        .attr('class', 'pieSlice')
        .attr("stroke-width", '0px')
        .style("fill", function(d) {
            return d.data.flavor;
        })
        .transition()
        .delay(function(d, i) {
            return 500 + (i * 500);
        })
        .duration(500)
        .attrTween('d', function(d) {
            var I = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function(t) {
                d.endAngle = I(t);
                return arc(d);
            }
        })
    var text = svg.select(".labels")
        .selectAll("text")
        .data(pie(pieData), key);
    text.enter()
        .append("text")
        .attr("dy", function(d) {
            return (d.value < 3) ? "0" : ".35em"
        })
        .text(function(d) {
            return (d.data.count == 0) ? '' : pieTextScale(d.data.string);
        });
    text.transition()
        .duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        })
        .attr('opacity', 0)
        .transition()
        .delay(function(d, i) {
            return 500 + (i * 500);
        })
        .duration(500)
        .attr('opacity', function(d) {
            return (d.data.count == 0) ? 0 : 1
        });
    var centerText = svg.append("text")
        .text("" + totalPie + "")
        .style({
            'text-anchor': 'middle',
            'font-size': 'xx-large'
        })
        .attr('dy', '0.35em');
    svg.append("text")
        .text("parcels")
        .style({
            'text-anchor': 'middle',
            'font-size': 'small'
        })
        .attr('dy', '30px')
    var polyline = svg.select(".lines")
        .selectAll("polyline")
        .data(pie(pieData), key);
    console.log(pie(pieData), key)
    polyline.enter()
        .append("polyline");
    polyline.transition()
        .duration(1000)
        .attrTween("points", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        })
        .attr('opacity', 0)
        .transition()
        .delay(function(d, i) {
            return 500 + (i * 500);
        })
        .duration(500)
        .attr('opacity', function(d) {
            return (d.data.count == 0) ? 0 : 1
        });
    d3.selectAll('.pieSlice')
        .on('mouseover', function(d) {
            d3.select(this)
                .attr("stroke-width", '3px')
            centerText.text(function() {
                return d.data.count
            })
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .attr("stroke-width", '0px')
            centerText.text(function() {
                return totalPie
            })
        })
}

function makeLine() {
    floods = ['2yr', '5yr', '10yr', '25yr', '50yr', '100yr', '500yr', '2yr', '5yr', '10yr', '25yr', '50yr', '100yr', '500yr', '2yr', '5yr', '10yr', '25yr', '50yr', '100yr', '500yr', '2yr', '5yr', '10yr', '25yr', '50yr', '100yr', '500yr']
    chartColors = ['#fcc200', '#000080', '#14cad3', '#d1e231']
    scenarios = ['1. Current Precipitation & Land Use', '2. Future Precipitation & Land Use', '3. Current Precipitation with Green Infrastructure', '4. Future Precipitation with Green Infrastructure']
    var margin = {
            top: 80,
            right: 20,
            bottom: 40,
            left: 40
        },
        width = $('#chartHolder')
        .parents('.modal-body')
        .width() - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .domain(floods)
        .rangePoints([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var line = d3.svg.line()
        .x(function(d) {
            return x(d.floodType);
        })
        .y(function(d) {
            return y(d3.max(d[currentAttribute]));
        });
    var sumline = d3.svg.line()
        .x(function(d) {
            return x(d.floodType);
        })
        .y(function(d) {
            return y(d3.sum(d[currentAttribute]));
        });
    var meanline = d3.svg.line()
        .x(function(d) {
            return x(d.floodType);
        })
        .y(function(d) {
            return y(d3.mean(d[currentAttribute]));
        });
    var straightline = d3.svg.line()
        .x(function(d) {
            return x(d.floodType);
        })
        .y(function(d) {
            return y(0);
        });
    var SVG = d3.select("#chartHolder")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    var svg = SVG.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var xaxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(0," + margin.bottom + ") rotate(0)")
        .attr("x", width / 2)
        .style("text-anchor", "center")
        .attr("class", "axisLabel")
        .text("Flood Event");
    var scenarioLength = $('[name="scenarioRadios"]')
        .length,
        possibleAttributes = $('#fieldSelector option')
        .map(function() {
            return $(this)
                .attr('value')
        })
        .get()
    chartData = []
        //yearValues = d3.keys(dataByYear)
        //yearObjects = d3.map(dataByYear).entries()
        // d3.map(dataByYear[6]).entries().forEach(function(d){console.log(d['value'].attributes[currentAttribute])})
    scenarioData = $('[name="scenarioRadios"]')
        .map(function() {
            start = parseInt($(this)
                .attr('data-udf'))
            Width = parseInt($(this)
                .attr('data-width'))
            end = start + Width
            scenario = parseInt($(this)
                .attr('value'))
            scenarioI = scenario - 1
            return ({
                start: start,
                end: end,
                scenario: scenario,
                scenarioI: scenarioI,
                width: Width
            })
        })
        .get()
    max_BldgDmgPct = []
    max_BldgLossUS = []
    sum_BldgLossUS = []
    yearDataLists = []
    yearValues = d3.values(dataByYear)
    yearKeys = d3.keys(dataByYear)
    formLists = (yearValues)
        .forEach(function(d, i) {
            percent = $(d3.values(d))
                .map(function() {
                    return this.attributes.BldgDmgPct
                })
                .get()
            dollars = $(d3.values(d))
                .map(function() {
                    return this.attributes.BldgLossUS
                })
                .get()
            max_BldgDmgPct.push(d3.max(percent))
            max_BldgLossUS.push(d3.max(dollars))
            sum_BldgLossUS.push(d3.sum(dollars))
            yearIndex = yearKeys[i]
            floodType = floods[i]
            yearDataLists.push({
                BldgDmgPct: percent,
                BldgLossUS: dollars,
                yearIndex: yearIndex,
                floodType: floodType
            })
        })
    $(scenarioData)
        .each(function() {
            cutStart = (this.width * this.scenarioI)
            cutEnd = (this.width * this.scenarioI) + this.width
            s = (yearDataLists.slice(cutStart, cutEnd))
            this['floodEventData'] = s
            this['cutStart'] = cutStart
            this['cutEnd'] = cutEnd
        })

    function makeLegend() {
        var legends = SVG.append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", margin.top)
            .attr("transform", "translate(" + margin.left + ",10)")
            .attr("class", "lineChartLegend")
        var label = legends.selectAll("labelGroups")
            .data([0, 1, 2, 3])
            .enter()
            .append("g")
            .attr("transform", function(d) {
                return "translate(0," + (d * 15) + ")"
            });
        label.append('text')
            .attr('dy', '.7em')
            .attr("transform", function(d) {
                return "translate(25,0)"
            })
            .text(function(d) {
                return scenarios[d]
            });
        label.append('line')
            .attr('x1', 0)
            .attr('y1', 5)
            .attr('x2', 20)
            .attr('y2', 5)
            .attr('stroke', function(d) {
                return chartColors[d]
            })
            .attr('stroke-width', 3)
        makeLine()
    }
    if ($('.lineChartLegend')
        .length == 0) {
        makeLegend()
    }
    else {
        styleLines(d3.selectAll('.lines'))
    }

    function makeLine() {
        setDomain = (currentAttribute == 'BldgLossUS') ? y.domain([0, d3.max(max_BldgLossUS)]) : y.domain([0, d3.max(max_BldgDmgPct)])
        var yaxis = svg.append("g")
            .attr("class", "y axis line-yAxis")
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(-" + margin.left + "," + height / 2 + "), rotate(-90)")
            .attr('dy', '.7em')
            .attr('text-anchor', 'middle')
            .attr("class", "axisLabel")
            .text(function() {
                return (currentAttribute == 'BldgLossUS') ? "Flood Damages (thousands of $)" : "Flood Damages (%)"
            });
        var lineGroup = svg.selectAll(".lineGroup")
            .data(scenarioData)
            .enter()
            .append("g")
            .attr("class", "lineGroup")
        lines = lineGroup.append("path")
            .attr("class", "line")
            .attr('d', function(d) {
                return straightline(d.floodEventData)
            })
            .attr('stroke', function(d, i) {
                return chartColors[i]
            })
            .attr('stroke-opacity', .8)
            .call(styleLines)
    }

    function styleLines(lines) {
        function currentStat() {
            function getMean(x) {
                return d3.mean(x)
            }

            function getMax(x) {
                return d3.max(x)
            }

            function getSum(x) {
                return d3.sum(x)
            }

            function getN(x) {
                return x.length
            }

            function getMed(x) {
                return d3.median(x)
            }
            return ($("#select-stats option:selected")
                .val() == "mean") ? getMean : ($("#select-stats option:selected")
                .val() == "max") ? getMax : ($("#select-stats option:selected")
                .val() == "med") ? getMed : ($("#select-stats option:selected")
                .val() == "n") ? getN : getSum
        }
        doMath = currentStat()
        newDomain = d3.max(yearDataLists.map(function(d, i) {
            return doMath(d[currentAttribute]);
        }))
        y.domain([0, newDomain])
        d3.selectAll('.line-yAxis')
            .remove();
        var yaxis = svg.append("g")
            .attr("class", "y axis line-yAxis")
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(-" + margin.left + "," + height / 2 + "), rotate(-90)")
            .attr('dy', '.7em')
            .attr('text-anchor', 'middle')
            .attr("class", "axisLabel")
            .text(function() {
                return ($("#select-stats option:selected")
                        .val() == "n") ? "Total Number of Innundated Parcels" : (currentAttribute == 'BldgLossUS') ? "" + $('#select-stats option:selected')
                    .html() + " (thousands of $)" : "" + $('#select-stats option:selected')
                    .html() + " (% Damage)"
            });
        $('#helpText .statistic-help')
            .html(function() {
                return ($("#select-stats option:selected")
                        .val() == "n") ? "Total Number of Innundated Parcels" : (currentAttribute == 'BldgLossUS') ? "" + $('#select-stats option:selected')
                    .html() + " (measured in thousands of dollars)" : "" + $('#select-stats option:selected')
                    .html() + " (measured in percent damage)"
            })
        line.y(function(d) {
            return y(doMath(d[currentAttribute]));
        });
        lines.transition()
            .duration(1000)
            .delay(1000)
            .attr('d', function(d) {
                return line(d.floodEventData)
            })
    }
    $("#select-stats")
        .on("change", function() {
            console.log("change")
            styleLines(d3.selectAll('.line'))
        })
}

function keepInView() {
    var popPadding = 10,
        navHeaderHeight = 50,
        maxtop = (navHeaderHeight + popPadding);

    function moveDown() {
        return ($('.symbolPop')
                .position()
                .top < maxtop) ? $('.symbolPop')
            .position()
            .top - maxtop : 0;
    }

    function moveRight() {
        return ($('#page-content-wrapper')
            .position()
            .left - $('.symbolPop')
            .position()
            .left > 0) ? -1 * ($('#page-content-wrapper')
            .position()
            .left - $('.symbolPop')
            .position()
            .left) : 0
    }

    function moveLeft() {
        return (($('.symbolPop')
                .position()
                .left + $('.symbolPop')
                .outerWidth()) > $('#page-content-wrapper')
            .width()) ? (($('.symbolPop')
                .position()
                .left + $('.symbolPop')
                .outerWidth()) - $('#page-content-wrapper')
            .width()) : 0
    }
    moveDown = moveDown()
    moveRight = moveRight()
    moveLeft = moveLeft()
    if (moveDown != 0) {
        $('.symbolPop')
            .css('top', maxtop)
    }
    if (moveRight != 0) {
        $('.symbolPop')
            .css('left', $('#page-content-wrapper')
                .position()
                .left)
    }
    if (moveLeft != 0) {
        moveRight = moveLeft
        $('.symbolPop')
            .css('left', ($('.symbolPop')
                .position()
                .left - moveLeft))
    }
    change = [moveRight, moveDown]
    map.panBy(change)
}

function popupLineChart(allPointData, popAttr) {
    popAttr = ((popAttr == undefined) || (popAttr == null)) ? currentAttribute : popAttr
    aaallPointData = allPointData
    floods = ['2yr', '5yr', '10yr', '25yr', '50yr', '100yr', '500yr']
    chartColors = ['#fcc200', '#000080', '#14cad3', '#d1e231']
    scenarios = ['1. Current Precip & Land Use', '2. Future Precip & Land Use', '3. Current Precip with Green Infrastructure', '4. Future Precip with Green Infrastructure']
    var margin = {
            top: 50,
            right: 15,
            bottom: 35,
            left: 30
        },
        width = 250 - margin.left - margin.right,
        height = 235 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .domain(floods)
        .rangePoints([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var line = d3.svg.line()
        .x(function(d) {
            return x(d['index']);
        })
        .y(function(d) {
            return y(d[popAttr]);
        });
    var straightline = d3.svg.line()
        .x(function(d) {
            return x(d['index']);
        })
        .y(function(d) {
            return y(0);
        });
    var svg = d3.select(".popupChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('id', allPointData["id"])
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('class', 'lineChart');
    scenarioLength = $('[name="scenarioRadios"]')
        .length
    chartData = []
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(0," + margin.bottom + ") rotate(0)")
        .attr("x", width / 2)
        .style("text-anchor", "center")
        .attr("class", "axisLabel")
        .text("Flood Event");
    for (i = 0; i < scenarioLength; i++) {
        scenarioData = []
        scenarioIndexes = setIndexValues(i)
        a = scenarioIndexes.minimumDamageIndex
        b = scenarioIndexes.maximumDamageIndex
        c = 0
        while (a <= b) {
            t = (allPointData[a] == 0) ? ({
                BldgDmgPct: 0,
                BldgLossUS: 0
            }) : clone(allPointData[a].attributes)
            t["damageId"] = a
            t["groupId"] = i
            scenarioDater = t
            scenarioDater['index'] = floods[c]
            c++
            a++
            scenarioData.push(scenarioDater)
        }
        chartData.push(scenarioData)
    }
    var lineGroup = svg.selectAll(".lineGroup")
        .data(chartData)
        .enter()
        .append("g")
        .attr("class", "lineGroup")
    lineGroup.append("path")
        .attr("class", "line")
        .attr('d', function(d) {
            return straightline(d)
        })
        .attr('stroke', function(d, i) {
            return chartColors[i]
        })
        .attr("stroke-width", "2.5px")
        .attr('stroke-opacity', 1)
    var pointGuides = svg.append("g")
        .attr("class", "pointGuides");
    var circleMarkers = svg.append("g")
        .attr("class", "circleMarkers");
    chartData.forEach(function(group, groupIndex) {
        var scenarioGuideGroup = pointGuides.append("g")
            .attr("class", "scenario" + (groupIndex + 1) + "");
        var xGuides = scenarioGuideGroup.append("g")
            .attr("class", "xGuides");
        var yGuides = scenarioGuideGroup.append("g")
            .attr("class", "yGuides");
        // xGuides.selectAll("circleGuides_X")
        //  .data(group).enter()
        //  .append('line')
        //  .attr('x1', function(d){return x(d['index'])})
        //  .attr('y1', height)
        //  .attr('x2', function(d){return x(d['index'])})
        //  .attr('y2', height)
        //  .attr("stroke", "#ddd")
        //  .attr("stroke-width", ".01em")
        //  .attr("class", "circleGuides_X")
        // yGuides.selectAll("circleGuides_Y")
        //  .data(group).enter()
        //  .append('line')
        //  .attr('x1', 0)
        //  .attr('y1', height)
        //  .attr('x2', function(d){return x(d['index'])})
        //  .attr('y2', height)
        //  .attr("stroke", "black")
        //  .attr("stroke-width", "1px")
        //  .attr("class", "circleGuides_Y")
        circleMarkers.selectAll(".linecircle")
            .data(group)
            .enter()
            .append("circle")
            .attr("class", function(d) {
                return (d.damageId == damagesCurrent) ? "linecircles popCurrent" : "linecircles"
            })
            .attr("id", function(d) {
                return "circleMarker_" + d.damageId + ""
            })
            .attr("cx", function(d) {
                d[groupIndex] = groupIndex;
                return x(d['index'])
            })
            .attr("cy", function(d) {
                return height + 10
            })
            .attr("stroke", chartColors[groupIndex])
            .attr("stroke-width", 1)
            .attr("fill", function(d) {
                return (d.damageId == damagesCurrent) ? chartColors[groupIndex] : "white";
            })
            .attr("r", 0)
            .style("cursor", "pointer")
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill", function(d) {
                        return chartColors[d.groupId]
                    })
                    .attr("stroke-width", "4px")
            })
            .on("mouseout", function(d) {
                d3.selectAll('[class="linecircles"]')
                    .attr("fill", "white")
                    .attr("stroke-width", 1)
            })
            .on("mousedown", function(d) {
                $(".BldgDmgPct_value,.BldgLossUS_value")
                    .css("color", function() {
                        return chartColors[groupIndex]
                    })
            })
            .on("mouseup", function() {
                $(".BldgDmgPct_value,.BldgLossUS_value")
                    .css("color", "black")
            })
            .on("click", function(d) {
                d3.selectAll('.linecircles')
                    .classed("popCurrent", false)
                d3.select(this)
                    .classed("popCurrent", true)
                    .attr("fill", function(d) {
                        return chartColors[d.groupId]
                    })
                    .attr("stroke-width", 1)
                d3.selectAll('[class="linecircles"]')
                    .attr("fill", "white")
                $(".BldgDmgPct_value")
                    .html(formatAttr("BldgDmgPct", d.BldgDmgPct)
                        .formattedVal)
                $(".BldgLossUS_value")
                    .html(formatAttr("BldgLossUS", d.BldgLossUS)
                        .formattedVal)
                $(".popover-content .small-link")
                    .removeClass("invisible")
                $('.keyItem text, .tick text')
                    .css('font-weight', 'normal')
                $('.keyItem:eq(' + groupIndex + ') text')
                    .css('font-weight', 'bold')
                $('.tick text:contains("' + d.index + '")')
                    .css('font-weight', 'bold')
            })
    })
    $(".popover-content .small-link")
        .on("click", function() {
            d3.selectAll('.linecircles')
                .classed("popCurrent", false)
            d3.selectAll('.linecircles')
                .attr("fill", "white")
            d3.select("#circleMarker_" + damagesCurrent + "")
                .classed("popCurrent", true)
                .attr("fill", function(d) {
                    return chartColors[d.groupId]
                })
                .attr("stroke-width", 1)
            currentData = d3.select("#circleMarker_" + damagesCurrent + "")
                .data()[0]
            $(".BldgDmgPct_value")
                .html(formatAttr("BldgDmgPct", currentData.BldgDmgPct)
                    .formattedVal)
            $(".BldgLossUS_value")
                .html(formatAttr("BldgLossUS", currentData.BldgLossUS)
                    .formattedVal)
            $(".popover-content .small-link")
                .addClass("invisible")
            $('.keyItem text, .tick text')
                .css('font-weight', 'normal')
            $('.keyItem text')
                .filter(function(d, i) {
                    return (d == (parseFloat($('[name="scenarioRadios"]:checked')
                        .val()) - 1))
                })
                .css('font-weight', 'bold')
            $('.popupChart .x.axis .tick:eq(' + (parseFloat($('[name="floodEventRadios"]:checked')
                    .val()) - 1) + ') text')
                .css('font-weight', 'bold')
        })
    var keyMargin = {
        top: 0,
        right: 15,
        bottom: 10,
        left: 20
    }
    var key = d3.select(".popupChart svg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + keyMargin.top + ")")
        .attr('class', 'key');
    var keyItem = key.selectAll('.keyItem')
        .data(chartColors)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            return "translate(0," + (i * 11) + ")";
        })
        .attr('class', 'keyItem');
    keyItem.append('rect')
        .attr("x", -30)
        .attr("y", 2)
        .attr("width", 20)
        .attr("height", 2.5)
        .attr("fill", function(d) {
            return d
        });
    keyItem.append("text")
        .attr("x", 0)
        .attr("y", 3)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-weight", function(d, i) {
            return (i == (parseFloat($('[name="scenarioRadios"]:checked')
                .val()) - 1)) ? "bold" : "normal"
        })
        .html(function(d) {
            return "<i class='fa fa-home'></i>" + scenarios[chartColors.indexOf(d)];
        });
    stylePop(popAttr)

    function stylePop(pATTR) {
        y.domain([0, d3.max(fullList, function(d) {
            return +d[pATTR]
        })]);
        d3.selectAll('.popupChart .y.axis')
            .remove()
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(-" + margin.left + ",0) rotate(-90)")
            .attr("y", 8)
            .attr("class", "axisLabel")
            .style("text-anchor", "end")
            .text(function() {
                return aliases[pATTR]
            });
        line.y(function(d) {
            return y(d[pATTR]);
        });
        var graphline = d3.selectAll('.line')
            .transition()
            .delay(1000)
            .attr('d', function(d) {
                return line(d)
            })
        d3.selectAll(".linecircles")
            .transition()
            .delay(1000)
            .attr("cx", function(d) {
                return x(d['index'])
            })
            .attr("cy", function(d) {
                return y(d[pATTR])
            })
            //.transition().delay(1200)
            .attr("r", function(d) {
                return (d.damageId == damagesCurrent) ? 4 : 2.5;
            });
        // d3.selectAll(".circleGuides_X")
        //  .transition().delay(1000)
        //  .attr("y1",function(d){return y(d[pATTR])})
        // d3.selectAll(".circleGuides_Y")
        //  .transition().delay(1000)
        //  .attr("y1",function(d){return y(d[pATTR])})
        //  .attr("y2",function(d){return y(d[pATTR])})
        $('[name="floodEventRadios"]:checked')
            .val()
        $('.popupChart .x.axis .tick:eq(' + (parseFloat($('[name="floodEventRadios"]:checked')
                .val()) - 1) + ')')
            .attr('font-weight', 'bold')
    }
    $('.fieldToggle')
        .on('click', function() {
            $('.fieldToggle')
                .removeClass('nowShowing')
            $(this)
                .addClass('nowShowing')
            var field = $(this)
                .attr('data')
            stylePop(field)
        })
}

function formatAttr(attr, val) {
    function formattDollars(val) {
        addFormat = d3.format('$,')
        return addFormat(d3.round(val, 2) * 1000)
    }

    function formatPercent(val) {
        return "" + String(d3.round(val, 2)) + "%"
    }
    newAttr = ((attr == "BldgLossUS") && (attr == "BldgLossUS")) ? "Monetary Damages" : "Percent Damage"
    newVal = (attr == "BldgLossUS") ? formattDollars(val) : formatPercent(val)
    returnObj = {
        attrText: newAttr,
        formattedVal: newVal
    }
    return returnObj
}

function destroyPop() {
    $('.symbolPop')
        .popover('destroy')
    d3.select(".popOpen.symbols")
        .attr('class', function() {
            return 'colorful symbols'
        })
    d3.select(".popOpen.bars")
        .attr('class', function() {
            return 'colorful bars'
        })
}

function popupMaker(data) {
    var htmlContent = '<button type="button" class="close closePopup" onclick="destroyPop()">x</button>'
    var data = data;
    dataToExamine = (data[damagesCurrent] != 0) ? (data[damagesCurrent].attributes) : (data[damagesCompare].attributes)
    $(dataToExamine)
        .each(function() {
            entries = this
            for (x in entries) {
                if (x != 'OBJECTID') {
                    pickData = getCurrent(x);
                    formattedData = formatAttr(x, pickData(data))
                    htmlContent += "<a href='#' class='fieldToggle' id='" + x + "_link' data='" + x + "'>" + formattedData.attrText + "</a> : <span class='" + x + "_value'>" + formattedData.formattedVal + "</span><br>";
                }
            }
            htmlContent += "<span class='pull-right small-link invisible'><a href='#'><i class='fa fa-refresh'></i>&nbsp;&nbsp; Show Current</a></span>"
        })
    htmlContent += '<div id="popupLinks"></div><div style="height:250px; width:250px;"><div class="popupChart"></div></div><div class="arrow">';
    setTimeout(function() {
        try {
            popupLineChart(data)
        }
        catch (e) {
            console.log('lineChartFailed', e)
        }
    }, 100)
    return htmlContent;
}

function openPop(id) {
    destroyPop()
    delay(function() {
        var popHTML = popupMaker(databyID[id])
        d3.select("#ID_" + id + ".symbols")
            .attr('class', function() {
                return 'colorful symbols popOpen'
            })
        d3.select("#ID_" + id + ".bars")
            .attr('class', function() {
                return 'colorful bars popOpen'
            })
        pOptions = {
            container: 'body',
            content: popHTML,
            html: true,
            placement: 'top',
            title: '',
            template: '<div class="popover symbolPop" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            trigger: 'manual'
        }
        $('#ID_' + id + '')
            .popover(pOptions)
            .popover('show')
        $('.symbolPop')
            .css("left", "" + (parseFloat($('.symbolPop')
                .position()
                .left) + parseFloat($('#ID_' + id + '')
                .attr("r"))) + "px")
        $('#' + currentAttribute + '_link')
            .addClass('nowShowing')
        setTimeout(function() {
            keepInView()
        }, 500)
    }, 200)
}

function nextHelpStep(stepNum) {
    $('.popover.tourPop')
        .popover('destroy')
    helpStep(stepNum + 1)
}

function lastHelpStep(stepNum) {
    $('.popover.tourPop')
        .popover('destroy')
    helpStep(stepNum - 1)
}

function skipToStep(stepNum) {
    $('.popover.tourPop')
        .popover('destroy')
    helpStep(stepNum)
}

function highlighthide() {
    drawBox('body')
    delay(function() {
        $('.helpHolder')
            .hide()
    }, 800)
}

function endTour() {
    $('.focus')
        .removeClass('focus')
    $('.tourstep-active')
        .removeClass('tourstep-active')
    $('.popover.tourPop')
        .popover('destroy')
    $('.stepElement')
        .remove()
    highlighthide()
    currentTour = null
}

function afterStep(element) {
    $('.tourstep-active')
        .parents('.symbolPop')
        .find('.close')
        .trigger('click')
    $('.tourstep-active')
        .removeClass('tourstep-active')
    $('.focus')
        .removeClass('focus')
    $('.tourPop')
        .remove()
}

function drawBox(selector) {
    kk = $(selector)[0].getBoundingClientRect()
    d3.select('.above-highlighter')
        .attr('fill', 'black')
        .attr('fill-opacity', 0.7)
        .transition()
        .duration(1000)
        .attr('height', kk.top)
        .attr('width', $(document)
            .width())
        .attr('x', 0)
        .attr('y', 0)
    d3.select('.below-highlighter')
        .attr('fill', 'black')
        .attr('fill-opacity', 0.7)
        .transition()
        .duration(1000)
        .attr('width', $(document)
            .width())
        .attr('height', $(document)
            .height() - kk.bottom)
        .attr('x', 0)
        .attr('y', function() {
            return (kk.top + kk.height)
        })
    d3.select('.left-highlighter')
        .attr('fill', 'black')
        .attr('fill-opacity', 0.7)
        .transition()
        .duration(1000)
        .attr('width', kk.left)
        .attr('height', kk.height)
        .attr('x', 0)
        .attr('y', kk.top)
    d3.select('.right-highlighter')
        .attr('fill', 'black')
        .attr('fill-opacity', 0.7)
        .transition()
        .duration(1000)
        .attr('width', $(document)
            .width() - kk.right)
        .attr('height', kk.height)
        .attr('x', kk.width + kk.left)
        .attr('y', kk.top)
}

function helpStep(stepNum, tour) {
    showg = ($('.helpHolder')
            .is(':visible') != true) ? ($('.helpHolder')
            .show()) : null
        // Close Previous Step
    afterStep(stepNum)
    var currentTour = ((tour == null) || (tour == undefined)) ? 'advanced' : tour;
    var focusEl = (helpData[tours[currentTour][stepNum]].focusEl != undefined) ? helpData[tours[currentTour][stepNum]].focusEl : helpData[tours[currentTour][stepNum]].selector;
    // Define TourPop HTML
    var buttonRight = (stepNum < (tours[currentTour].length - 1)) ? "<a href='#' class='btn btn-link pull-right' onclick='nextHelpStep(" + stepNum + ")' style='font-size:medium'><i class='fa fa-arrow-right'></i></a>" : "",
        buttonLeft = (stepNum > 0) ? "<a href='#' class='btn btn-link pull-left' onclick='lastHelpStep(" + stepNum + ")' style='font-size:medium'><i class='fa fa-arrow-left'></i></a>" : "",
        buttonRow = "<div class='row'>" + buttonRight + "" + buttonLeft + "</div>",
        dismissBtn = "<button type='button' onclick='endTour()' class='close btn-endTour'><span aria-hidden='true'>&times;</span></button><br>";
    // TourPop Index Circles
    var circles = "<div class='row-fluid text-center' id='circle-row'>"
    $(tours[currentTour])
        .each(function(i) {
            var icon = (i != stepNum) ? 'fa-circle-o' : 'fa-circle';
            circles += "<button onclick='skipToStep(" + i + ")'class='btn btn-link' style='padding:0px; font-size:xx-small'><i class='fa " + icon + "'></i></button>"
        })
    circles += "</div>";
    //circles+='<div><a href="#circle-row" data-toggle="collapse" class="btn btn-link pull-left" style="padding:0px;"><i class="fa fa-bars"></i></a><br>Step'+(stepNum+1)+'</div>';
    // Set Options for popup
    var x = helpData[tours[currentTour][stepNum]],
        popOptions = {
            html: true,
            container: 'body',
            trigger: 'manual',
            template: '<div class="popover tourPop " role="tooltip"><div class="arrow"></div><div><button type="button" style="padding-right:10px; float:right" onclick="endTour()" class="btn-link btn-endTour"><span aria-hidden="true">&times;</span></button></div><h3 class="popover-title"></h3><div class="popover-content" style="width:280px"></div></div>',
            placement: (x.popOptions.placement != undefined) ? x.popOptions.placement : 'right',
            delay: (x.popOptions.delay != undefined) ? x.popOptions.delay : {
                "show": 500,
                "hide": 0
            },
            content: (x.popOptions.content != undefined) ? ("" + circles + "" + x.popOptions.content + " <br>" + buttonRow + "") : ("" + circles + "Error; <br>" + buttonRow + "")
        }
    var delayShown = 500;

    function beforeStep() {
        function defaultOpeners(delayShown) {
            if (($("#sidebar-wrapper")
                    .find("" + x.selector + "")
                    .length != 0) && ($("#sidebar-wrapper")
                    .width() == 0)) {
                $('#menu-toggle')
                    .trigger('click');
            }
            if (($("#accordion_Data")
                    .find("" + x.selector + "")
                    .length != 0) && ($('#floodHazardsPanel')
                    .height() != 0) && (startingValues.mobileDevice != true)) {
                $("a[href='#floodHazardsPanel']")
                    .trigger('click');
            }
            if (startingValues.mobileDevice == true) {
                if (($("#sidebar-wrapper")
                        .find("" + x.selector + "")
                        .length == 0) && ($("#sidebar-wrapper")
                        .width() != 0)) {
                    $('#menu-toggle')
                        .trigger('click');
                    popOptions["container"] = "body"
                    delayShown = (delayShown + 500)
                }
            }
            customOpeners(delayShown);
        }

        function customOpeners(delayShown) {
            if (x.before != undefined) {
                x.before.call()
                showStep(delayShown)
            }
            else {
                showStep(delayShown)
            }
        }
        defaultOpeners();
    }
    beforeStep();

    function showStep(delayShown) {
        delayShown = popOptions.delay.show
        setTimeout(function() {
            $(x.selector)
                .popover(popOptions)
            $(x.selector)
                .popover('show')
            drawBox(x.selector)
                //setTimeout(drawBox(x.selector),1000)
            var doAfter = (x.after != undefined) ? x.after.call() : null;
            $(x.selector)
                .addClass('tourstep-active')
            $(x.selector_standin)
                .addClass('tourstep-active')
            $(focusEl)
                .each(function(i, d) {
                    setTimeout(function() {
                        setTimeout(function() {
                            $(focusEl)
                                .eq(i)
                                .removeClass('focus')
                        }, 500);
                        $(focusEl)
                            .eq(i)
                            .addClass('focus')
                    }, ((i * 500) + 400));
                })
        }, delayShown)
    }
}

function helpTour(tour) {
    $('.helpHolder')
        .show();
    //tour = ((tour==null)||(tour==undefined)) ? mode : tour
    currentTour = 'advanced';
    drawBox('body');
    setTimeout(function() {
        helpStep(0)
    }, 600);
}

function makeLandUseLegend() {
    var m = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        },
        H = 15,
        W = 40;
    var landUseLegendSVG = d3.select("#landUseLegend")
        .append("svg")
        .attr('height', function() {
            return ((landUseColors.domain())
                .length * (H + m.top));
        })
        .attr('width', 300)
        .attr('id', 'landUseLegendSVG')
        .append('g')
        .attr("transform", "translate(" + m.left + "," + m.top + ")");
    var legendGroup = landUseLegendSVG.selectAll('.legendGroup')
        .data(landUseColors.domain())
        .enter()
        .append('g')
        .attr("transform", function(d, i) {
            return "translate(0," + i * (H + m.top) + ")";
        });
    legendGroup.append('rect')
        .attr("width", W)
        .attr("height", H)
        .attr("fill", function(d) {
            return landUseColors(d)
        });
    legendGroup.append("text")
        .attr("x", W + m.right)
        .attr("y", H / 2)
        .attr("dy", ".35em")
        .text(function(d) {
            return d;
        });
}

function init() {
    /////////////
    // Init.js //
    /////////////
    // Initialize selectpicker
    $('.selectpicker')
        .selectpicker('render')
        // Detect what device the site is being viewed in
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('.selectpicker')
            .selectpicker('mobile');
        // If mobile--hide print options
        $('.hide-mobile')
            .hide();
    }
    else {
        $('.toolTip')
            .tooltip({
                container: '#wrapper'
            })
    }
    // Adjust map height
    $("#map")
        .css("height", function() {
            return ($(window)
                .height() - $('#navHeader')
                .height())
        });
    // Call the resize function when the document is resized
    $(window)
        .on('resize', function() {
            delay(function() {
                resize();
            }, 800)
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
    // Data Panel Collapse
    $('#accordion_Data .collapse')
        .on('show.bs.collapse', function() {
            $(this)
                .parents('.panel')
                .find('.panel-subtitle')
                .slideUp()
            $(this)
                .parents('.panel')
                .find('.panel-title>i')
                .toggleClass('fa-chevron-right fa-chevron-down')
        })
    $('#accordion_Data .collapse')
        .on('hide.bs.collapse', function() {
            $(this)
                .parents('.panel')
                .find('.panel-subtitle')
                .slideDown()
            $(this)
                .parents('.panel')
                .find('.panel-title>i')
                .toggleClass('fa-chevron-right fa-chevron-down')
        })
    $('#accordion_Data input[type="radio"]')
        .on("change", function() {
            $(this)
                .parents('.panel')
                .find('.panel-subtitle')
                .html("" + $(this)
                    .parents('label')
                    .text() + "")
        });
    // Radio listGroups
    $('.radio.list-group-item label, .radio.list-group')
        .on('click', function() {
            if ($(this)
                .parent()
                .is('.active') != true) {
                $(this)
                    .parent()
                    .addClass('active');
                $(this)
                    .parent()
                    .siblings()
                    .removeClass('active');
            }
        });
    // Toggling Data Distribution Chart Visibility
    $('#dataDistributionHeading a')
        .on('click', function() {
            $(this)
                .find('i')
                .toggleClass('fa-eye fa-eye-slash')
            $('.down-low')
                .toggleClass('down-low-basic down-low-advanced')
        });
    /* DOM NAMES */
    landUseCheck = $('[name="layerCheckboxes"][data-name="landUse"]'),
        watershedCheck = $('[name="layerCheckboxes"][data-name="watershed"]'),
        stormWaterCheck = $('[name="layerCheckboxes"][data-name="stormDrains"]');
    ////////////
    // Map.js //
    ////////////
    // Site Specific Variables
    siteBounds = L.latLngBounds(sW, nE);
    // var maxBounds = L.latLngBounds(L.latLng(41.47668911274522, -84.12162780761719), L.latLng(41.96204305667252, -83.00926208496094)),
    //     fullExtent = L.latLngBounds([41.7055362786694, -83.63419532775879], [41.73378888605136, -83.49686622619629]);
    // Map Definition
    map = L.map('map', {
            zoomControl: false,
            maxZoom: 16,
            minZoom: 2,
            // maxBounds: maxBounds,
            attributionControl: false,
            trackResize: true
        })
        .fitBounds(siteBounds);
    // Basemaps
    satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            layerName: "basemap",
            name: 'ESRI.WorldImagery',
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
        toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
            layerName: "basemap",
            name: 'Stamen.Toner',
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        terrain = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
            layerName: "basemap",
            name: 'Stamen.Terrain',
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
    // Basemap Feature Group Definition
    basemap = L.featureGroup()
        .addTo(map);
    // All possible basemap options
    basemapList = [satellite, toner, terrain];
    // Add curent basemap to map at instantiation
    basemap['currentBaseMap'] = $('[name="basemapRadios"]:checked')
        .val()
    currentBasemap = basemapList[$('[name="basemapRadios"]:checked')
        .val()]
    currentBasemap.addTo(basemap);
    // Basemap radio event listener
    $('[name="basemapRadios"]')
        .on('change', changeBasemap);
    // Define layers
    layers = {
        watershed: new L.geoJson(chesterCreekWatershed, {
            style: {
                "color": "#673AB7",
                "weight": 5,
                "opacity": 1,
                "lineCap": "round",
                "fill": false
            },
            attribution: false,
            layerName: "watershed",
            className: "watershed"
        }),
        stormwater: new L.geoJson(stormwaterJSON, {
            style: {
                "color": "#3F51B5",
                "weight": 2,
                "opacity": 1,
                "lineCap": "round"
            },
            position: "back",
            attribution: false,
            layerName: "stormwater",
            className: "stormwater",
            smoothFactor: 3
        }),
        depth: new L.esri.dynamicMapLayer({
            url: serviceURL,
            className: '2',
            layers: [depthGridCurrent],
            opacity: ($('[name="layerCheckboxes"]:eq(1)')
                .is(':checked')) ? 1 : 0,
            attribution: "Depth Grid &mdash; ASFPM Flood Science Center",
            layerName: "depth"
        }),
        streams: new L.esri.dynamicMapLayer({
            url: serviceURL,
            className: '2',
            layers: [0],
            attribution: false,
            layerName: "streams"
        }),
        landUse: new L.geoJson(futureLandUse, {
            style: function(feature) {
                var fillColor = "";
                switch (feature.properties.reclassifi) {
                    case "commercial":
                        fillColor = "#838faa";
                        break;
                    case "green space":
                        fillColor = "#00aa00";
                        break;
                    case "industrial":
                        fillColor = "#4d4d4d";
                        break;
                    case "institutional campus":
                        fillColor = "#ffaa7f";
                        break;
                    case "other":
                        fillColor = "#ff8e90";
                        break;
                    case "residential":
                        fillColor = "#fff47b";
                        break;
                }
                return {
                    fillColor: fillColor,
                    fillOpacity: 0.4,
                    fill: true,
                    weight: 0
                };
            },
            attribution: false,
            layerName: "landUse",
            className: "landUse"
        })
    };
    // when our depth grids load, we want to add a class to the DOM element containing the image
    // this will allow us to style it so that it always sits underneath the hazard points, but above all other layers
    layers.depth.on("load", function() {
        if (layers.depth._currentImage && layers.depth._currentImage._image) {
            $(layers.depth._currentImage._image)
                .addClass("depth-image");
        }
    });
    layers.landUse.on("add", function() {
        layers.landUse.bringToBack();
    });
    // add raster layers
    layers.depth.addTo(map);
    layers.streams.addTo(map);
    // determine whether to add vector layers
    ($('[name="layerCheckboxes"]:eq(2)')
        .is(':checked')) ? layers.stormwater.addTo(map): null;
    ($('[name="layerCheckboxes"]:eq(3)')
        .is(':checked')) ? layers.landUse.addTo(map): null;
    ($('[name="layerCheckboxes"]:eq(4)')
        .is(':checked')) ? layers.watershed.addTo(map): null;
    //All possible Overlay Layers--XX=Stand-in to maintain layer indexes
    allLayersList = ['floods', layers.depth, layers.stormwater, layers.landUse, layers.watershed, layers.streams];
    // Change in Layer checkbox event listener
    $('input[name="layerCheckboxes"]')
        .on('change', function() {
            toggleLayers($(this))
        });
    // Define the Initial Attribution Text
    updateMapAttribution();
    $(document)
        .on("click", "#openFullAttribution", function() {
            $("#fullAttribution")
                .slideToggle();
        });
    // Update the attribution Text on layer change
    $('[name="basemapRadios"],[name="layerCheckboxes"]')
        .on('change', updateMapAttribution);
    /* Map Export Functions */
    // Print Map
    $('.map-printer')
        .on('click', print.create);
    ///////////////////
    // Prototypes.js //
    ///////////////////
    // GLOBALS
    pop = null;
    //////////////////
    /// DrawData.js //
    ////////////////// 
    // Map
    mapsvg = d3.select(map.getPanes()
            .overlayPane)
        .append("svg")
        .style("z-index", "250");
    mapSymbolGroup = mapsvg.append("g")
        .attr("class", "leaflet-zoom-hide hazardSymbols");
    transform = d3.geo.transform({
        point: projectPoint
    });
    path = d3.geo.path()
        .projection(transform);
    // Chart
    chartMargin = {
        top: 20,
        right: 20,
        bottom: 25,
        left: 45
    };
    chartWidth = ($('#page-content-wrapper')
        .width()) - (chartMargin.left + chartMargin.right);
    chartHeight = $("#chart")
        .height() - chartMargin.top - chartMargin.bottom;
    chartsvg = d3.select("#chart")
        .append("svg")
        .attr("id", "chartsvg")
        .attr('width', chartWidth + chartMargin.left + chartMargin.right)
        .attr('height', chartHeight + chartMargin.top + chartMargin.bottom)
        .append("g")
        .attr("class", "mainChart")
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");
    // Drag Behavior in Legend
    dragging = false;
    drag = d3.behavior.drag()
        .origin(Object)
        .on("dragstart", function(d) {
            dragging = true;
        })
        .on("drag", function(d) {
            d3.select(this)
                .attr("y", function() {
                    return parseInt(d3.select(this)
                        .attr('y')) + parseInt(d3.select(d3.event)[0][0].dy)
                })
        })
        .on("dragend", function() {
            dragging = false;
            chooseCustom();
        });
    // Legend
    haz_m = {
            top: 20,
            bottom: 10,
            left: 10,
            right: 10
        },
        haz_w = (270 - haz_m.left - haz_m.right),
        haz_h = (200 - haz_m.top - haz_m.bottom);
    hazSVG = d3.select('#floodHazardsLegend')
        .append('svg')
        .attr('width', haz_w + haz_m.left + haz_m.right)
        .attr('height', haz_h + haz_m.top + haz_m.bottom)
        .attr('id', 'hazardLegendSVG')
        .append('g')
        .attr('transform', function() {
            return 'translate(' + haz_m.left + ',' + haz_m.top + ')'
        });
    $(".resetBreaks")
        .click(function() {
            $('#scaleSelector')
                .selectpicker('val', 'jenks');
            handleStyle();
            $(this)
                .hide()
        });
    createSymbols(allYearData);
    //////////////////////
    // Global Variables //
    //////////////////////
    $('input[name="fieldRadios"]')
        .on('change', function() {
            currentAttribute = $(this)
                .val()
            handleStyle()
        })
    $('#fieldSelector')
        .on("change", function() {
            currentAttribute = getCurrentAttribute()
            handleStyle();
        })

    function handleScenarioChanges() {
        damagesCurrent = getDamagesIndex(),
            /*damagesCompare = getCompareDamagesIndex()*/
            depthGridCurrent = getDGIndex();
        var indexValues = setIndexValues();
        damageIndexWidth = indexValues.damageIndexWidth,
            minimumDamageIndex = indexValues.minimumDamageIndex,
            maximumDamageIndex = indexValues.maximumDamageIndex;
        handleStyle()
        layers.depth.setLayers([depthGridCurrent])
    }
    $("[name='scenarioRadios'], input[name='floodEventRadios']")
        .on("change", handleScenarioChanges);

    function handleCompareChanges() {
        compareType = getCompareType()
        damagesCompare = getCompareDamagesIndex()
        handleStyle()
    };
    $('input[name="comparisonRadios"]')
        .on('change', handleCompareChanges);
    ////////////////////
    // Make Histogram //
    ////////////////////
    $('.chartSelector')
        .on('click', function() {
            $('#chartHolder')
                .empty()
            $('#helpText')
                .children()
                .hide()
            chartType = $(this)
                .attr('data')
            $('#helpText>#' + chartType + '-help')
                .show()
            $('#helpText .floodevent-help')
                .html(function() {
                    return $('[name="floodEventRadios"]:checked')
                        .attr('year')
                })
            $('#helpText .scenario-help')
                .html(function() {
                    return $('#dataHeading .panel-subtitle')
                        .html()
                })
            $('#helpText .attribute-help')
                .html(function() {
                    return (currentAttribute == 'BldgLossUS') ? 'Thousands of Dollars' : 'Percent Damage'
                })
            $('#chartModal .modal-title')
                .html(function() {
                    return (chartType == 'histogram') ? "histogram" : (chartType == 'pie') ? 'Affected Parcels Breakdown' : 'Watershed-Level Trends'
                })
            hideDropDown = (chartType != 'line') ? $(".line-only")
                .hide() : $(".line-only")
                .show()
            if (currentAttribute != 'BldgLossUS') {
                $('#select-stats option[value="sum"]')
                    .attr("disabled", "disabled")
            }
            else {
                $('#select-stats option[value="sum"]')
                    .removeAttr("disabled")
            }
            $('#select-stats')
                .selectpicker('refresh')
            setTimeout(function() {
                makeChart = (chartType == 'histogram') ? makeHistogram() : (chartType == 'pie') ? makePie() : (chartType == 'line') ? makeLine() : null
            }, 250);
        });
    $('.printer')
        .on('click', function() {
            target = $(this)
                .attr('data')
            $(target)
                .print({
                    stylesheet: "../css/printing.css"
                })
        });
    //////////////////
    // MakePopup.js //
    //////////////////
    map.on("moveend, dragstart", destroyPop);
    /////////////////
    // helpTour.js //
    /////////////////
    // Inline HTML for  skiping to help tour step
    $("[data-toggle='help']")
        .on('click', function() {
            skipToStep((tours['advanced'])
                .indexOf($(this)
                    .attr('data-help')))
        })
    spotlight = d3.select('.helpHolder')
        .append('svg')
        .attr('width', $(document)
            .width())
        .attr('height', $(document)
            .height());
    spotlight.selectAll('highlighters')
        .data(['above', 'below', 'left', 'right'])
        .enter()
        .append('rect')
        .attr('class', function(d) {
            return '' + d + '-highlighter highlighter'
        })
        .on('click', endTour);
}
$(document)
    .ready(function() {
        init();
        delay(function() {
            $('[data-target="#aboutModal"]')
                .trigger('click');
        }, 1500);
    });
