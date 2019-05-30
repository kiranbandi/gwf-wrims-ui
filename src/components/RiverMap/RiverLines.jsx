import React from 'react';
import riverCurve from '../../utils/riverCurve';

export default (props) => {

    const { lines, xScale, yScale, lineWidth, lineWidthTickRatio } = props;
    return (
        <g className='lines-container'>
            {_.map(lines, (d, index) => {
                return <path
                    key={'river-line-' + index}
                    id={d.name}
                    d={riverCurve(d, xScale, yScale, lineWidth, lineWidthTickRatio)}
                    stroke={d.color || '#92cce3'}
                    strokeWidth={lineWidth}
                    className={'river ' + (d.reverse ? 'reverse-flow' : 'forward-flow')}>
                </path>
            })}
        </g>)
}
