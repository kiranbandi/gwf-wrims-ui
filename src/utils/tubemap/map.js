import * as d3 from 'd3';
import river from './curve';

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


    function map(selection) {

        selection.each(function(data) {

            _data = data;

            var minX = d3.min(_data.lines, function(line) {
                return d3.min(line.nodes, function(node) {
                    return node.coords[0];
                });
            });

            var maxX = d3.max(_data.lines, function(line) {
                return d3.max(line.nodes, function(node) {
                    return node.coords[0];
                });
            });

            var minY = d3.min(_data.lines, function(line) {
                return d3.min(line.nodes, function(node) {
                    return node.coords[1];
                });
            });

            var maxY = d3.max(_data.lines, function(line) {
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

    function drawLines() {
        gMap
            .append('g')
            .attr('class', 'lines')
            .selectAll('path')
            .data(_data.lines)
            .enter()
            .append('path')
            .attr('d', function(d) {
                return river(d, xScale, yScale, lineWidth, lineWidthTickRatio);
            })
            .attr('id', function(d) {
                return d.name;
            })
            .attr('stroke', function(d) {
                return d.color || '#92cce3';
            })
            .attr('fill', 'none')
            .attr('stroke-width', lineWidth)
            .attr('class', 'river forward-flow')
    }

    return map;

}