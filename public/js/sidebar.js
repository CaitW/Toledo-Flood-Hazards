var sidebar = (function() {
    function updateStatistics() {
        // was passed x, what is x?
        var population = d3.values(dataByYear[damagesCurrent])
            .map(function(d) {
                return d.attributes[currentAttribute]
            });
        var form = (currentAttribute == "BldgDmgPct") ? d3.format('%') : d3.format('$,');
        var math = (currentAttribute == "BldgDmgPct") ? function(x) {
            return x / 100
        } : function(x) {
            return x * 1000
        }
        var stats = {
            mean: form(math(d3.round(d3.mean(population)))),
            median: form(math(d3.round(d3.median(population)))),
            sum: form(math(d3.round(d3.sum(population)))),
            n: String(population.length)
        };
        $('.stats-target')
            .each(function() {
                $(this)
                    .html(stats[$(this)
                        .attr('data')])
            });
        return (currentAttribute == "BldgDmgPct") ? $('.stats-target[data="sum"]')
            .parent()
            .slideUp() : $('.stats-target[data="sum"]')
            .parent()
            .slideDown();
    }

    function init() {
        $(document)
            .on("scenario-change", updateStatistics);
        $(document)
            .on("unit-change", updateStatistics);
    }
    return {
        init: init
    }
})();
