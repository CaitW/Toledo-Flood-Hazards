var helpTour = (function() {
    var _spotlight;
    var currentTour = null

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

    function highlighthide() {
        drawBox('body')
        delay(function() {
            $('.helpHolder')
                .hide()
        }, 800)
    }

    function start(tour) {
        $('.helpHolder')
            .show();
        //tour = ((tour==null)||(tour==undefined)) ? mode : tour
        currentTour = 'advanced';
        drawBox('body');
        setTimeout(function() {
            helpStep(0)
        }, 600);
    }

    function end() {
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

    function skipTo(stepNum) {
        $('.popover.tourPop')
            .popover('destroy')
        helpStep(stepNum)
    }

    function next(stepNum) {
        $('.popover.tourPop')
            .popover('destroy')
        helpStep(stepNum + 1)
    }

    function last(stepNum) {
        $('.popover.tourPop')
            .popover('destroy')
        helpStep(stepNum - 1)
    }

    function _beforeStep() {
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
                _showStep(delayShown)
            } else {
                _showStep(delayShown)
            }
        }
        defaultOpeners();
    }

    function _afterStep(element) {
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

    function _showStep(delayShown) {
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

    function step(stepNum, tour) {
        showg = ($('.helpHolder')
                .is(':visible') != true) ? ($('.helpHolder')
                .show()) : null
            // Close Previous Step
        _afterStep(stepNum)
        var currentTour = ((tour == null) || (tour == undefined)) ? 'advanced' : tour;
        var focusEl = (config.helpTour.data[config.helpTour.tours[currentTour][stepNum]].focusEl != undefined) ? config.helpTour.data[config.helpTour.tours[currentTour][stepNum]].focusEl : config.helpTour.data[config.helpTour.tours[currentTour][stepNum]].selector;
        // Define TourPop HTML
        var buttonRight = (stepNum < (config.helpTour.tours[currentTour].length - 1)) ? "<a href='#' class='btn btn-link pull-right' onclick='helpTour.next(" + stepNum + ")' style='font-size:medium'><i class='fa fa-arrow-right'></i></a>" : "",
            buttonLeft = (stepNum > 0) ? "<a href='#' class='btn btn-link pull-left' onclick='last(" + stepNum + ")' style='font-size:medium'><i class='fa fa-arrow-left'></i></a>" : "",
            buttonRow = "<div class='row'>" + buttonRight + "" + buttonLeft + "</div>",
            dismissBtn = "<button type='button' onclick='helpTour.end()' class='close btn-endTour'><span aria-hidden='true'>&times;</span></button><br>";
        // TourPop Index Circles
        var circles = "<div class='row-fluid text-center' id='circle-row'>"
        $(config.helpTour.tours[currentTour])
            .each(function(i) {
                var icon = (i != stepNum) ? 'fa-circle-o' : 'fa-circle';
                circles += "<button onclick='helpTour.skipTo(" + i + ")'class='btn btn-link' style='padding:0px; font-size:xx-small'><i class='fa " + icon + "'></i></button>"
            })
        circles += "</div>";
        //circles+='<div><a href="#circle-row" data-toggle="collapse" class="btn btn-link pull-left" style="padding:0px;"><i class="fa fa-bars"></i></a><br>Step'+(stepNum+1)+'</div>';
        // Set Options for popup
        var x = config.helpTour.data[config.helpTour.tours[currentTour][stepNum]],
            popOptions = {
                html: true,
                container: 'body',
                trigger: 'manual',
                template: '<div class="popover tourPop " role="tooltip"><div class="arrow"></div><div><button type="button" style="padding-right:10px; float:right" onclick="helpTour.end()" class="btn-link btn-endTour"><span aria-hidden="true">&times;</span></button></div><h3 class="popover-title"></h3><div class="popover-content" style="width:280px"></div></div>',
                placement: (x.popOptions.placement != undefined) ? x.popOptions.placement : 'right',
                delay: (x.popOptions.delay != undefined) ? x.popOptions.delay : {
                    "show": 500,
                    "hide": 0
                },
                content: (x.popOptions.content != undefined) ? ("" + circles + "" + x.popOptions.content + " <br>" + buttonRow + "") : ("" + circles + "Error; <br>" + buttonRow + "")
            }
        var delayShown = 500;
        _beforeStep();
    }

    function init() {
        $("[data-toggle='help']")
            .on('click', function() {
                skipTo((config.helpTour.tours['advanced'])
                    .indexOf($(this)
                        .attr('data-help')))
            });
        _spotlight = d3.select('.helpHolder')
            .append('svg')
            .attr('width', $(document)
                .width())
            .attr('height', $(document)
                .height());
        _spotlight.selectAll('highlighters')
            .data(['above', 'below', 'left', 'right'])
            .enter()
            .append('rect')
            .attr('class', function(d) {
                return '' + d + '-highlighter highlighter'
            })
            .on('click', end);
        $(window)
            .on('resize', function() {
                delay(function() {
                    _spotlight.attr('width', function() {
                            return $(document)
                                .width();
                        })
                        .attr('height', function() {
                            return $(document)
                                .height();
                        });
                }, 800)
            });
    };
    return {
        init: init,
        start: start,
        end: end,
        step: step,
        skipTo: skipTo,
        next: next,
        last: last
    }
})();
