import React from 'react';
import { line } from 'd3';

export default (props) => {

    const { lines, xScale, yScale, lineWidth } = props;

    _.map(lines, (line) => {
        const { shiftCoords = [0, 0] } = line;
        line.newNodes = _.map(line.nodes, (innerD) => {
            return { x: xScale(innerD.coords[0] + shiftCoords[0]), y: yScale(innerD.coords[1] + shiftCoords[1]) };
        })
    });
    const d3Line = line().x((d) => d.x).y((d) => d.y);

    return (
        <g className='lines-container'>
            {_.map(lines, (d, index) => {
                return <path
                    key={'river-line-' + index}
                    id={d.name}
                    d={d3Line(d.newNodes)}
                    strokeWidth={lineWidth}
                    className={'flowLine type-' + (d.type) + " " + (d.reverse ? 'reverse-flow' : 'forward-flow')}>
                </path>
            })}
        </g>)
}
