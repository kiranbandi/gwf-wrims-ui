import React from 'react';
import { line } from 'd3';
import riverCurve from '../../utils/riverCurve';

export default (props) => {

    const { lines, xScale, yScale, lineWidth, lineWidthTickRatio } = props;

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
                    d={riverCurve(d,xScale,yScale,lineWidth,lineWidthTickRatio)}
                    stroke={d.color || '#92cce3'}
                    strokeWidth={lineWidth}
                    className={'river ' + (d.reverse ? 'reverse-flow' : 'forward-flow')}>
                </path>
            })}
        </g>)
}
