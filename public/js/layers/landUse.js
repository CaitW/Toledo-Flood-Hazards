function LandUse() {
    var self = this;
    var $button = $('[name="layerCheckboxes"][data-name="landUse"]');
    var _layer = new L.geoJson(futureLandUse, {
        layerType: "layer",
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
        className: "landUse",
        displayName: "Land Use",
        default: false
    });

    function _createLegend() {
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
                return ((config.colors.landUse.domain())
                    .length * (H + m.top));
            })
            .attr('width', 300)
            .attr('id', 'landUseLegendSVG')
            .append('g')
            .attr("transform", "translate(" + m.left + "," + m.top + ")");
        var legendGroup = landUseLegendSVG.selectAll('.legendGroup')
            .data(config.colors.landUse.domain())
            .enter()
            .append('g')
            .attr("transform", function(d, i) {
                return "translate(0," + i * (H + m.top) + ")";
            });
        legendGroup.append('rect')
            .attr("width", W)
            .attr("height", H)
            .attr("fill", function(d) {
                return config.colors.landUse(d)
            });
        legendGroup.append("text")
            .attr("x", W + m.right)
            .attr("y", H / 2)
            .attr("dy", ".35em")
            .text(function(d) {
                return d;
            });
    };
    this.toggle = function() {
        if (setVisible && !map.hasLayer(layer)) {
            map.addLayer(layer);
            $('#landUsePanel')
                .parents('.panel:first')
                .slideDown();
        } else if (!setVisible && map.hasLayer(layer)) {
            map.removeLayer(layer);
            $('#landUsePanel')
                .parents('.panel:first')
                .slideUp();
        }
    };
    this.init = function () {
        _createLegend();
        _layer.on("add", function() {
            _layer.bringToBack();
        });
        $button.wrap("<div class='checkbox'><label></label></div>");
        $button.on("change", self.toggle);
    };
};