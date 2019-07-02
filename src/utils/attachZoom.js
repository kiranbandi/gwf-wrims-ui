import * as d3 from 'd3';

export default function(containerID, initialZoomScale = { x: 0, y: 0, scale: 1 }) {

    var svg = d3.select('#' + containerID).select('svg');

    var zoom = d3
        .zoom()
        .scaleExtent([1, 4])
        // we will use the double clicks for marker selections
        //  this way there is no ambiguity with click events on the same dom node
        .filter(() => !(d3.event.type == 'dblclick'))
        .on('zoom', zoomed);

    var zoomContainer = svg.call(zoom);
    zoom.scaleTo(zoomContainer, initialZoomScale.scale);
    zoom.translateTo(zoomContainer, initialZoomScale.x, initialZoomScale.y);

    function zoomed() {
        svg.select('g.zoomable').attr('transform', d3.event.transform.toString());
    }

}