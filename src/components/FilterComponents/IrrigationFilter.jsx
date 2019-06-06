import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleIrrigationVisibility, setFilterIrrigation } from '../../redux/actions/actions';
import Select from 'react-select';
import sortAlphaNum from '../../utils/sortAlphaNum';

class IrrigationFilter extends Component {
    constructor(props) {
        super(props);
        this.onIrrigationClick = this.onIrrigationClick.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onIrrigationClick() {
        this.props.actions.toggleIrrigationVisibility();
    }

    onSelectChange(selectedValueList) {
        this.props.actions.setFilterIrrigation(_.map(selectedValueList, (d) => d.label));
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areIrrigationsVisible = false, visibleIrrigations = [] } = filterMesh;

        // filter out all demands , then get the name of the demand and finally sort 
        const irrigationsList = _.map(_.filter(schematicData.lines,
            (d) => { return (d.type == 'irrigation-demand') }),//d.type == 'regular-demand' || 
            (d) => d.name)
            .sort(sortAlphaNum);

        // Merge the option Array text with the count of records present in each type
        const modifiedOptionArray = _.map(irrigationsList, (option) => ({ label: option, value: option }));


        return (
            <div className='filter-container'>

                <div className='inner-filter-box'>
                    {/* Allowing the user to select specific irrigations */}
                    <div className='select-container-filter'>
                        <Select
                            isClearable={true}
                            placeholder='Select Irrigation Demands...'
                            name={'irrigation-select'}
                            isMulti
                            isDisabled={!areIrrigationsVisible}
                            // react select needs a value and so we need to set it in a complicated way with a function
                            //  need to find a more elegant solution in future
                            value={_.map(visibleIrrigations, (name) => ({ label: name, value: name }))}
                            options={modifiedOptionArray}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={this.onSelectChange} />
                    </div>
                </div>
                {/* Adding a button to toggle all demands */}
                <button
                    className={"custom-icon-button agri " + ('icon') +
                        (areIrrigationsVisible ? ' icon-eye' : ' icon-eye-with-line')}
                    onClick={this.onIrrigationClick}>
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ toggleIrrigationVisibility, setFilterIrrigation }, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(IrrigationFilter);