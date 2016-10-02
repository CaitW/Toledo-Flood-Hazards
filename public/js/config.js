var config = {
    colors: {
        base: {
            BldgLossUS: ['#edf8b1', '#7fcdbb', '#1d91c0', '#225ea8', '#081c55'],
            BldgDmgPct: ['#ffeda0', '#feb24c', '#fc4e2a', '#e31a1c', '#b10026'],
            BldgLossUS_change: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
            BldgDmgPct_change: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"]
        },
        quantile: {
            BldgLossUS: ['#7fcdbb', '#1d91c0', '#225ea8', '#081c55'],
            BldgDmgPct: ['#feb24c', '#fc4e2a', '#e31a1c', '#b10026'],
            BldgLossUS_change: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
            BldgDmgPct_change: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"]
        },
        jenks: {
            BldgLossUS: ['#ffffd1', '#edf8b1', '#7fcdbb', '#1d91c0', '#225ea8', '#081c55'],
            BldgDmgPct: ['#ffffd1', '#ffeda0', '#feb24c', '#fc4e2a', '#e31a1c', '#b10026'],
            BldgLossUS_change: ["#2166ac", "#67a9cf", "#d1e5f0", "#fddbc7", "#ef8a62", "#b2182b"],
            BldgDmgPct_change: ["#2166ac", "#67a9cf", "#d1e5f0", "#fddbc7", "#ef8a62", "#b2182b"],
        },
        landUse: d3.scale.ordinal()
            .domain(["Commercial", "Green Space", "Industrial", "Institutional Campus", "Other", "Residential"])
            .range(["#838faa", "#00aa00", "#4d4d4d", "#ffaa7f", "#ff8e90", "#fff47b"])
    },
    aliases: {
        BldgLossUS: "Damages (Thousands of $) ",
        BldgDmgPct: "Percent Damage",
        OBJECTID: "Property ID"
    },
    helpTour: {
        data: {
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
            }
        },
        interfaceElements: ["navbar", "toggle"],
        mapElements: ["map", "zoom", "circle", "pop", "legend"],
        dataPanel: ["scenario", "floodevent", "attribute"],
        sideBar: ["toggle", "layer", "basemap", "stat", "chart", "bar", "scaleselector", "classbreak", "share"],
        tours: {
            advanced: ["navbar", "map", "zoom", "circle", "pop", "legend", "scenario", "floodevent", "attribute", "toggle", "displayPanel", "layer", "basemap", "analyzePanel", "stat", "charts", "dataDistBtn", "chart", "bar", "classbreak", "share"]
        }
    },
    attribution: {
        fontAwesome: "Icons <a href='http://fontawesome.io'>Font Awesome</a> by Dave Gandy",
        icons8: "Icons made by Icons8 from <a href='http://www.flaticon.com'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/'>CC BY 3.0</a>",
    }
};
