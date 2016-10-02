function DepthGrids() {
    var _layer;
    var $toggle = $("<div class='checkbox'><label><input name='layerCheckboxes' type='checkbox' data-name='depthGrid' value='1' checked=''>Depth Grids</label></div>");
    var _visible = false;
    var _currentIndex;

    function _toggle(setVisible) {
        if (_visible) {
            _layer.setOpacity(0);
        } else {
            _layer.setOpacity(1);
        }
    };

    function _getDGIndex() {
        return (parseInt($('[name="scenarioRadios"]:checked')
            .attr("data-dg")) + parseInt($('input[name="floodEventRadios"]:checked')
            .attr('value')));
    };

    function _scenarioChange() {
        _currentIndex = _getDGIndex();
        _layer.setLayers([_currentIndex])
    };

    function init(map) {
        _currentIndex = _getDGIndex();
        _layer = new L.esri.dynamicMapLayer({
            url: config.serviceURL,
            className: '2',
            layers: [_currentIndex],
            opacity: 1,
            attribution: "Depth Grid &mdash; ASFPM Flood Science Center",
            layerName: "depth",
            displayName: "Depth Grids",
            layerType: "layer",
            default: true
        });
        // when our depth grids load, we want to add a class to the DOM element containing the image
        // this will allow us to style it so that it always sits underneath the hazard points, but above all other layers
        _layer.on("load", function() {
            if (_layer._currentImage && _layer._currentImage._image) {
                $(_layer._currentImage._image)
                    .addClass("depth-image");
            }
        });
        _layer.addTo(map);
        $toggle.find("input")
            .on("change", _toggle);
        $(document)
            .on("scenario-change", _scenarioChange);
        return $toggle;
    }
    return {
        init: init
    }
};
