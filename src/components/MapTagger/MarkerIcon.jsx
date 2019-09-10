import React, { PureComponent } from 'react';
import LegendIcon from '../MapLegend/LegendIcon';


export default class MarkerIcon extends PureComponent {
    render() {

        const { size = 30, onClick, type = 'agri', id = '' } = this.props;

        return (
            <svg className='river-marker'
                height={size}
                id={'custom-' + id}
                viewBox="0 0 30 30"
                onClick={onClick}>
                {getIcon(type)}
            </svg>
        );
    }
}


function getIcon(type) {
    switch (type) {
        case 'Irrigation Demand': return <LegendIcon circleTransform={"translate(5, 5) scale(0.07)"} imageTransform={"translate(5, 5) scale(0.042)"} type={"agri"} hasText={false} />;
        case 'Inflow': return <LegendIcon circleTransform={"translate(5, 5) scale(0.07)"} imageTransform={"translate(5, 5) scale(0.07)"} type={"inflow"} hasText={false} />
        case 'Industrial/Public Consumption': return <LegendIcon circleTransform={"translate(5, 5) scale(0.07)"} imageTransform={"translate(5, 5) scale(0.046)"} type={"demand"} hasText={false} />
        case 'Reservoir': return <LegendIcon circleTransform={"translate(5, 5) scale(0.07)"} imageTransform={"translate(7.5, 5) scale(0.045)"} type={"reservoir"} hasText={false} title="RESERVOIR" />
        case 'Power generating Reservoir': return <LegendIcon circleTransform={"translate(5, 5) scale(0.07)"} imageTransform={"translate(6.5, 5) scale(0.044)"} type={"reservoir"} hasText={false} hasText={false} title={''} />
        case 'new': return <circle cx='15' cy='15' r='15' className={'custom-marker'}> </circle>
    }
}
