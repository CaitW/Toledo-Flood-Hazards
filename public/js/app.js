// Returns a copy of a javascript object
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
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
    // Creates Summary Stats for the population
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
var app = (function(content, defaults, settings) {
    // information passed to app via node backend
    var _content = content;
    var _defaults = defaults;
    var _settings = settings;
    // values to be populated upon init
    var damageIndex = {
        width: null,
        baseline: null,
        minimum: null,
        maximum: null
    };
    var currentUnit;
    var currentScenario = {
        udf: null,
        value: null,
        text: null
    };
    var currentFloodYear = {
        year: null,
        value: null
    };
    var leftMenu = (function() {
        // DOM
        var $leftMenu;
        var $panels;
        var $panelBodies;
        var $optionLabels;
        var $options;
        var $unitOptions;
        var $scenarioOptions;
        var $floodEventOptions;
        var currentUnit;
        // Private Functions
        function _showPanel() {
            $(this)
                .parents('.panel')
                .find('.panel-subtitle')
                .slideUp()
            $(this)
                .parents('.panel')
                .find('.panel-title>i')
                .toggleClass('fa-chevron-right fa-chevron-down')
        };

        function _hidePanel() {
            $(this)
                .parents('.panel')
                .find('.panel-subtitle')
                .slideDown();
            $(this)
                .parents('.panel')
                .find('.panel-title>i')
                .toggleClass('fa-chevron-right fa-chevron-down');
        };

        function _selectItem() {
            $(this)
                .parents('.panel')
                .find('.panel-subtitle')
                .html("" + $(this)
                    .parents('label')
                    .text() + "");
        };

        function _updateLabel() {
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
        };

        function _updateUnit() {
            app.unitChange($(this)
                .val());
        };

        function _renderDefaults () {
            var climateScenarios
            var floodScenarios

            var climateLandUse = config.defaults.climateLandUse;
            var floodEvent = config.defaults.floodEvent;

        };

        // Public Functions
        function init() {
            // define DOM selections
            $leftMenu = $("#accordion_Data");
            $panels = $leftMenu.find(".panel");
            $panelBodies = $panels.find(".collapse");
            $optionLabels = $leftMenu.find(".radio.list-group-item label");
            $options = $leftMenu.find('input[type="radio"]');
            $scenarioOptions = $leftMenu.find("[name='scenarioRadios']");
            $floodEventOptions = $leftMenu.find("input[name='floodEventRadios']");
            // event listeners
            $unitOptions = $leftMenu.find('input[name="fieldRadios"]');
            $panelBodies.on('show.bs.collapse', _showPanel);
            $panelBodies.on('hide.bs.collapse', _hidePanel);
            $options.on("change", _selectItem);
            $optionLabels.on("click", _updateLabel);
            $unitOptions.on("change", _updateUnit);
            $scenarioOptions.on("change", scenarioChange);
            $floodEventOptions.on("change", scenarioChange);
            $(document)
                .on("change", '#fieldSelector', function() {
                    currentAttribute = getCurrentAttribute()
                    handleStyle();
                });
        };
        return {
            init: init
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

    function getCurrentScenarioData() {};

    function scenarioChange() {
        currentScenario.udf = parseInt($('[name="scenarioRadios"]:checked')
            .attr("data-udf"));
        currentScenario.value = $('[name="scenarioRadios"]:checked')
            .val();
        currentScenario.text = String($('[name="scenarioRadios"]:checked')
                .parent()
                .text())
            .toLowerCase();
        currentFloodYear.value = parseInt($('input[name="floodEventRadios"]:checked')
            .val());
        currentFloodYear.year = parseInt($('input[name="floodEventRadios"]:checked')
            .attr('year'));
        damageIndex.baseline = parseInt($("[name='scenarioRadios']:" + x + "")
            .attr("data-udf"));
        damageIndex.width = parseInt($("[name='scenarioRadios']:" + x + "")
            .attr("data-width"));
        damageIndex.minimum = parseInt($('input[name="floodEventRadios"]:eq(0)')
            .attr('value')) + damageIndex.baseline;
        damageIndex.maximum = (parseInt($('input[name="floodEventRadios"]:eq(' + (damageIndexWidth - 1) + ')')
            .attr('value'))) + damageIndex.baseline;
        $(document)
            .trigger("scenario-change");
    };

    function unitChange(unit) {
        currentUnit = unit;
        $(document)
            .trigger("unit-change", [currentUnit]);
    };

    function getCurrentUnit() {
        return currentUnit;
    }

    function getCurrentIndex() {
        return currentDamageIndex;
    }

    function getFloodYear() {
        return currentFloodYear;
    }

    function getScenario() {
        return currentScenario;
    }

    function init() {
        sidebar.init();
        leftMenu.init();
        map.init();
        helpTour.init();
        print.init();
        // Initialize selectpicker
        $('.selectpicker')
            .selectpicker('render');
        // Detect what device the site is being viewed in
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker')
                .selectpicker('mobile');
            // If mobile--hide print options
            $('.hide-mobile')
                .hide();
        } else {
            $('.toolTip')
                .tooltip({
                    container: '#wrapper'
                });
        }
        delay(function() {
            $('[data-target="#aboutModal"]')
                .trigger('click');
        }, 1500);
    }
    return {
        init: init,
        scenarioChange: scenarioChange,
        unitChange: unitChange,
        getCurrentUnit: getCurrentUnit,
        getFloodYear: getFloodYear,
        getScenario: getScenario,
        getCurrentUnit: getCurrentUnit
    }
})(appData.content, appData.defaults, appData.settings);
$(document)
    .ready(function() {
        app.init();
    });
