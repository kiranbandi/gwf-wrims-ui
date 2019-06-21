/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LabelFilter from './FilterComponents/LabelFilter.jsx'
import InflowFilter from './FilterComponents/InflowFilter.jsx';
import AmenitiesFilter from './FilterComponents/AmenitiesFilter.jsx';
import IrrigationFilter from './FilterComponents/IrrigationFilter.jsx';
import NonIrrigationFilter from './FilterComponents/NonIrrigationFilter.jsx';
import YearRangeSlider from './YearRangeSlider';


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
                <YearRangeSlider width={this.props.width} height={this.props.height}/>
                    
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
