import * as d3 from 'd3';

export default function(containerID) {

    var svg = d3.select('#' + containerID).select('svg');

    var zoom = d3
        .zoom()
        .scaleExtent([0.5, 6])
        .on('zoom', zoomed);

    var zoomContainer = svg.call(zoom);
    var initialScale = 1.10;
    var initialTranslate = [50, 50];

    zoom.scaleTo(zoomContainer, initialScale);
    zoom.translateTo(zoomContainer, initialTranslate[0], initialTranslate[1]);

    function zoomed() {
        svg.select('g').attr('transform', d3.event.transform.toString());
    }

}