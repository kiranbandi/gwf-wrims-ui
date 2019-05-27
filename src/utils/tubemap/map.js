import * as d3 from 'd3';
import { line } from './curve';

export default function() {
    var margin = { top: 80, right: 80, bottom: 20, left: 80 };
    var width = 760;
    var height = 640;
    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();
    var lineWidth;
    var lineWidthMultiplier = 0.8;
    var lineWidthTickRatio = 3 / 2;
    var svg;
    var _data;
    var gMap;

    var listeners = d3.dispatch('click');

    function map(selection) {

        selection.each(function(data) {
            _data = transformData(data);

            var minX = d3.min(_data.raw, function(line) {
                return d3.min(line.nodes, function(node) {
                    return node.coords[0];
                });
            });

            var maxX = d3.max(_data.raw, function(line) {
                return d3.max(line.nodes, function(node) {
                    return node.coords[0];
                });
            });

            var minY = d3.min(_data.raw, function(line) {
                return d3.min(line.nodes, function(node) {
                    return node.coords[1];
                });
            });

            var maxY = d3.max(_data.raw, function(line) {
                return d3.max(line.nodes, function(node) {
                    return node.coords[1];
                });
            });

            var desiredAspectRatio = (maxX - minX) / (maxY - minY);
            var actualAspectRatio =
                (width - margin.left - margin.right) /
                (height - margin.top - margin.bottom);

            var ratioRatio = actualAspectRatio / desiredAspectRatio;
            var maxXRange;
            var maxYRange;

            // Note that we flip the sense of the y-axis here
            if (desiredAspectRatio > actualAspectRatio) {
                maxXRange = width - margin.left - margin.right;
                maxYRange = (height - margin.top - margin.bottom) * ratioRatio;
            } else {
                maxXRange = (width - margin.left - margin.right) / ratioRatio;
                maxYRange = height - margin.top - margin.bottom;
            }

            xScale.domain([minX, maxX]).range([margin.left, margin.left + maxXRange]);
            yScale.domain([minY, maxY]).range([margin.top + maxYRange, margin.top]);
            lineWidth = lineWidthMultiplier * (xScale(1) - xScale(0));

            svg = selection
                .append('svg')
                .style('width', '100%')
                .style('height', '100%');

            gMap = svg.append('g');

            drawLines();
        });
    }

    map.width = function(w) {
        if (!arguments.length) return width;
        width = w;
        return map;
    };

    map.height = function(h) {
        if (!arguments.length) return height;
        height = h;
        return map;
    };

    map.margin = function(m) {
        if (!arguments.length) return margin;
        margin = m;
        return map;
    };

    map.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? map : value;
    };


    function drawLines() {
        gMap
            .append('g')
            .attr('class', 'lines')
            .selectAll('path')
            .data(_data.lines)
            .enter()
            .append('path')
            .attr('d', function(d) {
                return line(d, xScale, yScale, lineWidth, lineWidthTickRatio);
            })
            .attr('id', function(d) {
                return d.name;
            })
            .attr('stroke', function(d) {
                return d.color;
            })
            .attr('fill', 'none')
            .attr('stroke-width', function(d) {
                return d.highlighted ? lineWidth * 1.3 : lineWidth;
            })
            .classed('line', true);
    }


    function transformData(data) {
        return {
            raw: data.lines,
            river: data.river,
            lines: extractLines(data.lines)
        };
    }

    function extractLines(data) {
        var lines = [];

        data.forEach(function(line) {
            var lineObj = {
                name: line.name,
                title: line.label,
                stations: [],
                color: line.color,
                shiftCoords: line.shiftCoords,
                nodes: line.nodes,
                highlighted: false,
            };

            lines.push(lineObj);

            for (var node = 0; node < line.nodes.length; node++) {
                var data = line.nodes[node];

                if (!data.hasOwnProperty('name')) continue;

                lineObj.stations.push(data.name);
            }
        });

        return lines;
    }

    return map;
}