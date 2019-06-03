/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DemandFilter from './FilterComponents/DemandFilter.jsx'
import LabelFilter from './FilterComponents/LabelFilter.jsx'

class FilterPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props;

        return (
            <div className='filter-root-container text-center'>
                <DemandFilter schematicData={schematicData} />
                <br></br>
                <LabelFilter />
            </div>);
    }
}

function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
