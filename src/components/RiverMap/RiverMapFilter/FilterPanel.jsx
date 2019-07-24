/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LabelFilter from './FilterPanelComponents/LabelFilter.jsx'
import InflowFilter from './FilterPanelComponents/InflowFilter.jsx';
import AmenitiesFilter from './FilterPanelComponents/AmenitiesFilter.jsx';
import IrrigationFilter from './FilterPanelComponents/IrrigationFilter.jsx';
import NonIrrigationFilter from './FilterPanelComponents/NonIrrigationFilter.jsx';
import YearRangeSlider from '../../SingleFilterComponents/YearRangeSlider';


class FilterPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props;

        return (
            <div className='filter-root-container '>
                <div>
                    <div className='filter-div'>
                        <IrrigationFilter schematicData={schematicData} />
                    </div>
                    <div className='filter-div'>
                        <NonIrrigationFilter schematicData={schematicData} />
                    </div>
                    <div className='filter-div'>
                        <InflowFilter schematicData={schematicData} />
                    </div>
                    <div className='filter-div'>
                        <AmenitiesFilter schematicData={schematicData} />
                    </div>
                    <div className='filter-div filter-general'>
                        <LabelFilter />
                    </div>
                </div>
                <div>
                    <YearRangeSlider width={this.props.width} height={this.props.height} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
