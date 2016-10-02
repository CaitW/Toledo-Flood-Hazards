// symbols, legend, data distribution 
function Hazards() {
    // DOM
    var $toggle = $('<div class="checkbox"><label><input name="layerCheckboxes" type="checkbox" data-name="floodLosses" value="0" checked="">Flood Losses</label></div>');
    // Hazards
    var $SVG; // SVG
    var $symbolGroup; // hazard symbols (g)
    var $symbols; // symbols collection
    // Legend
    var $legendSVG; // legend svg
    // Data Distribution
    var $dataDistribution; // chart svg
    // variables
    var _transform;
    var _path;
    var _drag;
    var _legendDragging = false;
    var _indexValues = {};
    // data 
    var floods = ['2yr', '5yr', '10yr', '25yr', '50yr', '100yr', '500yr'];
    var chartColors = ['#fcc200', '#000080', '#14cad3', '#d1e231'];
    var scenarios = ['1. Current Precip & Land Use', '2. Future Precip & Land Use', '3. Current Precip with Green Infrastructure', '4. Future Precip with Green Infrastructure'];
    // histogram
    var yearDataLists = null;
    var yearValues = null;
    var yearKeys = null;
    var _chartWidth;
    var _chartHeight;
    var _chartMargin = {
        top: 20,
        right: 20,
        bottom: 25,
        left: 45
    };

    function ScaleEm(x, y, z) {
        var customExists = {},
            device = null;
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
                .range(config.colors.jenks[attribute]);
            return scale
        }
        var equalInterval = function() {
            var serie = new geostats(population)
            var classes = serie.getClassEqInterval(4)
            var scale = d3.scale.threshold()
                .domain(classes)
                .range(config.colors.jenks[attribute]);
            return scale
        }
        var jenks = function() {
            dom = ss.jenks(population.map(function(d) {
                return +d;
            }), 4)
            var scale = d3.scale.threshold()
                .domain(dom)
                .range(config.colors.jenks[attribute]);
            return scale;
        }
        var custom = function() {
            var serie = new geostats(population)
            equalClasses = serie.getClassEqInterval(4)
            scaleDomain = (customExists[attribute] == undefined) ? equalClasses : customExists[attribute]
            var scale = d3.scale.threshold()
                .domain(scaleDomain)
                .range(config.colors.jenks[attribute])
            return scale;
        }
        var linearHeight = function() {
            var scale = d3.scale.linear()
                .domain([Max, 0])
                .range([1, _chartHeight]);
            return scale;
        }
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
        var outScale = ((x == 'color') && (scaleName == 'jenks')) ? jenks() : ((x == 'color') && (scaleName == 'equalInterval')) ? equalInterval() : ((x == 'color') && (scaleName == 'stdDev')) ? standardDeviation() : ((x == 'color') && (scaleName == 'custom')) ? custom() : (scaleType == 'height') ? linearHeight() : (scaleType == 'radius') ? linearRadius() : (scaleType == 'heightChange') ? changeLinearHeight() : (scaleType == 'radiusChange') ? changeRadius() : null;
        return outScale
    }

    function scenarioChange() {
        _updateStyle();
    }

    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    };

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

    function getPopupContent(data) {
        // chart that appears when you click on a hazard point
        function create(allPointData, popAttr) {
            var scenarioData = [];
            var popAttr = ((popAttr == undefined) || (popAttr == null)) ? currentAttribute : popAttr
            var aaallPointData = allPointData
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
            var scenarioLength = $('[name="scenarioRadios"]')
                .length
            var chartData = []
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
                a = _indexValues.minimumDamageIndex
                b = _indexValues.maximumDamageIndex
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
                        return config.aliases[pATTR]
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
        var htmlContent = '<button type="button" class="close closePopup">x</button>';
        dataToExamine = (data[damagesCurrent] != 0) ? (data[damagesCurrent].attributes) : (data[damagesCompare].attributes);
        $(dataToExamine)
            .each(function() {
                entries = this
                for (x in entries) {
                    if (x != 'OBJECTID') {
                        pickData = getCurrent(x);
                        formattedData = formatAttr(x, pickData(data));
                        htmlContent += "<a href='#' class='fieldToggle' id='" + x + "_link' data='" + x + "'>" + formattedData.attrText + "</a> : <span class='" + x + "_value'>" + formattedData.formattedVal + "</span><br>";
                    }
                }
                htmlContent += "<span class='pull-right small-link invisible'><a href='#'><i class='fa fa-refresh'></i>&nbsp;&nbsp; Show Current</a></span>";
            })
        htmlContent += '<div id="popupLinks"></div><div style="height:250px; width:250px;"><div class="popupChart"></div></div><div class="arrow">';
        setTimeout(function() {
            create(data);
        }, 100)
        return htmlContent;
    }

    function destroyPop() {
        $('.symbolPop')
            .popover('destroy')
        d3.select(".popOpen.symbols")
            .attr('class', function() {
                return 'colorful symbols'
            });
        d3.select(".popOpen.bars")
            .attr('class', function() {
                return 'colorful bars'
            });
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
        _map.panBy(change)
    }

    function openPop(id) {
        destroyPop()
        delay(function() {
            var popHTML = getPopupContent(databyID[id])
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

    function style() {
        // Defines function to expose the current data (ie. the dataset according the current scenario, flood event, and attribute selected)
        var pickData = getCurrent();
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
            });
        maxWidth = _chartWidth / (selectedData.length);
        // Retrieve scales from dispatcher function
        var colorScale = ScaleEm('color'),
            linearHeight = ScaleEm('height'),
            radiScale = ScaleEm('radius');
        var breaks = colorScale.domain();
        // Update y axis
        function updateLabels() {
            // Update main chart labels
            d3.selectAll('.mainChartY')
                .transition()
                .duration(500)
                .attr('opacity', 0)
                .text(function() {
                    return (showCompareFeatures == false) ? "Flood Damages" : "Change in Flood Damages"
                })
                .attr("transform", function() {
                    return "translate(-30," + (_chartHeight / 2) + ") rotate(270)"
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
                    return "translate(" + (_chartWidth / 2) + "," + (_chartHeight + _chartMargin.top) + ")"
                })
                .transition()
                .delay(2000)
                .duration(1000)
                .attr('opacity', 1);
            d3.selectAll('.bars')
                .sort(function(a, b) {
                    return (showCompareFeatures == false) ? d3.descending(pickData(a), pickData(b)) : d3.ascending(pickData(a), pickData(b))
                });
        }

        function updateDataDistribution() {
            var chartYaxis = d3.svg.axis()
                .scale(linearHeight)
                .orient("left")
                .tickValues(breaks);
            d3.select("#chartsvg .y.axis")
                .remove();
            $dataDistribution.append("g")
                .attr("class", "y axis")
                .call(chartYaxis);
            // Update main chart bar symbology
            d3.selectAll('.bars')
                .filter(function(d, i) {
                    return pickData(d) != 0
                })
                .attr('height', function(d) {
                    return (showCompareFeatures != true) ? (_chartHeight - linearHeight(pickData(d))) : (Math.abs(linearHeight(pickData(d)) - linearHeight(0)))
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
        }

        function updateSymbols() {
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
        }
        updateLabels();
        updateDataDistribution();
        updateSymbols();
        makeTicks();
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
            .attr('width', _chartWidth);
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
    // Sets Explanatory Legend Text
    function setBaseText() {
        setTimeout(function() {
            var floodYear = app.getFloodYear();
            var scenario = app.getScenario();
            attribute = (app.getCurrentUnit() == "BldgLossUS") ? "thousands of dollars" : "percent damage";
            var scenarioText = getScenarios();
            var outputText = "<p class='legendDescText'>{&nbsp;displayed ";
            outputText = (showCompareFeatures == true) ? outputText.concat("as the net difference ") : outputText;
            outputText = outputText.concat("in <strong>" + attribute + "</strong> resulting from a <strong>" + floodYear + " year flood</strong>");
            outputText = (showCompareFeatures == true) ? outputText.concat(" between scenario " + ($('.list-group-item.active')
                .index() + 1) + " and scenario " + ($('.list-group-item.compare')
                .index() + 1) + " }") : outputText.concat(", given <strong>" + scenario + "</strong>&nbsp;}</p>");
            $('#baseText')
                .html(outputText);
        }, 500);
    }

    function _updateStyle() {
        style();
        setBaseText();
        destroyPop()
    };
    // Reposition the symbols when mapview changes
    function _updateHazardSymbols() {
        $symbols.attr("cx", function(d) {
                return _map.latLngToLayerPoint(d.LatLng)
                    .x
            })
            .attr("cy", function(d) {
                return _map.latLngToLayerPoint(d.LatLng)
                    .y
            });
    }
    // Creates bar chart, legend, and proportional symbol elements when the map is first initialized
    function _makeHazardSymbols(data) {
        // Proportional symbols on map
        $symbols = $symbolGroup.selectAll('circle')
            .data(data.features)
            .enter()
            .append('circle')
            .attr('fill', config.colors.base[currentAttribute][0])
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
        _map.on("moveend", _updateHazardSymbols);
        _updateHazardSymbols();
        // flood hazards legend elements explaining color symbology
        _updateStyle()
    };

    function _makeDataDistribution(data) {
        _chartWidth = ($('#page-content-wrapper')
            .width()) - (_chartMargin.left + _chartMargin.right);
        _chartHeight = $("#chart")
            .height() - _chartMargin.top - _chartMargin.bottom;
        $dataDistribution = d3.select("#chart")
            .append("svg")
            .attr("id", "chartsvg")
            .attr('width', _chartWidth + _chartMargin.left + _chartMargin.right)
            .attr('height', _chartHeight + _chartMargin.top + _chartMargin.bottom)
            .append("g")
            .attr("class", "mainChart")
            .attr("transform", "translate(" + _chartMargin.left + "," + _chartMargin.top + ")");
        var barGroup = $dataDistribution.append("g")
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
                return _chartHeight - $(this)
                    .attr('height')
            })
            .on('click', function(d) {
                return _map.setView(d.LatLng, 16)
            });
        // BreakLines
        var breakLineGroup = $dataDistribution.append("g")
            .attr('class', 'breakLineGroup');
        var breakLines = breakLineGroup.selectAll(".breakLines")
            .data(d3.range(5))
            .enter()
            .append("rect")
            .attr("class", "draggable")
            .call(_drag);
        // Main Chart Axis Labels
        $dataDistribution.append("text")
            .attr('class', 'mainChartY')
            .attr("text-anchor", "middle")
            .attr('opacity', 0)
        $dataDistribution.append("text")
            .attr('class', 'mainChartX')
            .attr("text-anchor", "middle")
            .attr('opacity', 0);
        $dataDistribution.append("text")
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
                return (_legendDragging == false) ? d3.selectAll('#' + target + '.bars')
                    .moveToFront() : null
            })
            .on("mouseout", function(event) {
                var target = $(this)
                    .attr('id');
                d3.selectAll('#' + target + '')
                    .classed({
                        'hover': false
                    })
            });
    };

    function _makeLegend(data) {
        var haz_m = {
                top: 20,
                bottom: 10,
                left: 10,
                right: 10
            },
            haz_w = (270 - haz_m.left - haz_m.right),
            haz_h = (200 - haz_m.top - haz_m.bottom);
        $legendSVG = d3.select('#floodHazardsLegend')
            .append('svg')
            .attr('width', haz_w + haz_m.left + haz_m.right)
            .attr('height', haz_h + haz_m.top + haz_m.bottom)
            .attr('id', 'hazardLegendSVG')
            .append('g')
            .attr('transform', function() {
                return 'translate(' + haz_m.left + ',' + haz_m.top + ')'
            });
        var colorLegend = $legendSVG.append('g')
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
        var sizeLegend = $legendSVG.append('g')
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
        var headings = $legendSVG.append('g')
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
        _updateStyle();
    };
    this.init = function(map) {
        _map = map;
        _setIndexValues();
        $SVG = d3.select(_map.getPanes()
                .overlayPane)
            .append("svg")
            .style("z-index", "250");
        $symbolGroup = $SVG.append("g")
            .attr("class", "leaflet-zoom-hide hazardSymbols");
        _transform = d3.geo.transform({
            point: projectPoint
        });
        _path = d3.geo.path()
            .projection(_transform);
        _drag = d3.behavior.drag()
            .origin(Object)
            .on("dragstart", function(d) {
                _legendDragging = true;
            })
            .on("drag", function(d) {
                d3.select(this)
                    .attr("y", function() {
                        return parseInt(d3.select(this)
                            .attr('y')) + parseInt(d3.select(d3.event)[0][0].dy)
                    })
            })
            .on("dragend", function() {
                _legendDragging = false;
                chooseCustom();
            });
        $(document)
            .on("scenario-change", scenarioChange);
        $(document)
            .on("unit-change", scenarioChange);
        $(document)
            .on("click", ".closePopup", destroyPop);
        // Toggling Data Distribution Chart Visibility
        $('#dataDistributionHeading a')
            .on('click', function() {
                $(this)
                    .find('i')
                    .toggleClass('fa-eye fa-eye-slash')
                $('.down-low')
                    .toggleClass('down-low-basic down-low-advanced')
            });
        $(".resetBreaks")
            .click(function() {
                $('#scaleSelector')
                    .selectpicker('val', 'jenks');
                _updateStyle();
                $(this)
                    .hide()
            });
        _map.on("moveend, dragstart", destroyPop);
        _makeDataDistribution(allYearData);
        _makeLegend();
        _makeHazardSymbols(allYearData);
        return $toggle;
    };
};
