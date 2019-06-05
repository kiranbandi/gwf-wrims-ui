import React from 'react';

export default (props) => {

    const { artifacts = [], xScale, yScale } = props,
        // scale relative to the size of the screen
        reservoirIconScale = (xScale(1) - xScale(0)) / 55;

    const reservoirList = _.map(_.filter(artifacts, (d) => d.type = 'reservoir'),
        (reservoir, index) => {

            const { coords, size = 1 } = reservoir;
            return <g key={'reservoir-' + index} className='reservoir'
                transform={"translate(" + xScale(coords[0]) + "," + yScale(coords[1]) + ") scale(" + (size * reservoirIconScale) + ")"}>
                <circle cx='150' cy='150' r='200'></circle>
                <g> <path d="M174.432,32.465c-6.8-10-12.8-19.2-18.4-27.6c-0.8-1.2-2-2.4-3.2-3.2c-4.8-3.2-11.2-1.6-14.4,3.2 c-5.2,8.4-11.2,17.2-18.4,27.6c-31.6,46.4-78.8,116.4-78.8,156.4c0,29.2,12,55.6,31.2,74.8c19.2,18.8,45.6,30.8,74.8,30.8 s55.6-12,74.8-31.2c19.2-19.2,31.2-45.6,31.2-74.8C253.232,148.465,206.032,78.865,174.432,32.465z M207.632,248.865 c-15.6,15.6-36.8,24.8-60.4,24.8c-23.6,0-44.8-9.6-60.4-24.8c-15.6-15.6-24.8-36.8-24.8-60.4c0-33.6,45.2-100.4,75.2-144.8 c3.6-5.2,6.8-10.4,10-14.8c3.2,4.4,6.4,9.6,10,14.8c30,44.8,75.2,111.2,75.2,144.8 C232.432,212.065,222.832,233.265,207.632,248.865z" /></g>
                <g><path d="M209.232,181.265c-5.6-0.4-10.4,4-10.8,9.6c-0.4,8.8-3.2,17.2-7.6,24.4c-4.4,7.2-10.8,13.6-18.4,17.6 c-4.8,2.8-6.8,9.2-4,14c3.2,5.6,9.6,7.2,14.4,4.4c10.8-6,19.6-14.8,25.6-24.8c6.4-10,10-22,10.4-34.4 C219.232,186.465,214.832,181.665,209.232,181.265z" /></g>
            </g>
        })

    return (<g className='artifacts-container'>{reservoirList}</g>)
}