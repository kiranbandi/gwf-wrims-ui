import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleNonIrrigationVisibility, setFilterNonIrrigation } from '../../redux/actions/actions';
import Select from 'react-select';
import sortAlphaNum from '../../utils/sortAlphaNum';

class NonIrrigationFilter extends Component {
    constructor(props) {
        super(props);
        this.onNonIrrigationClick = this.onNonIrrigationClick.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onNonIrrigationClick() {
        this.props.actions.toggleNonIrrigationVisibility();
    }

    onSelectChange(selectedValueList) {
        this.props.actions.setFilterNonIrrigation(_.map(selectedValueList, (d) => d.label));
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areNonIrrigationsVisible = false, visibleNonIrrigations = [] } = filterMesh;

        // filter out all demands , then get the name of the demand and finally sort 
        const nonIrrigationsList = _.map(_.filter(schematicData.lines,
            (d) => { return (d.type == 'regular-demand') }),
            (d) => d.name)
            .sort(sortAlphaNum);

        // Merge the option Array text with the count of records present in each type
        const modifiedOptionArray = _.map(nonIrrigationsList, (option) => ({ label: option, value: option }));


        return (
            <div className='filter-container'>

                <div className='inner-filter-box'>
                    {/* Allowing the user to select specific irrigations */}
                    <div className='select-container-filter'>
                        <Select
                            isClearable={true}
                            placeholder='Select Non-Irrigation Demands...'
                            name={'non-irrigation-select'}
                            isMulti
                            isDisabled={!areNonIrrigationsVisible}
                            // react select needs a value and so we need to set it in a complicated way with a function
                            //  need to find a more elegant solution in future
                            value={_.map(visibleNonIrrigations, (name) => ({ label: name, value: name }))}
                            options={modifiedOptionArray}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={this.onSelectChange} />
                    </div>
                </div>
                {/* Adding a button to toggle all demands */}
                <button
                    className={"custom-icon-button demand " + ('icon') +
                        (areNonIrrigationsVisible ? ' icon-eye' : ' icon-eye-with-line')}
                    onClick={this.onNonIrrigationClick}>
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
        actions: bindActionCreators({ toggleNonIrrigationVisibility, setFilterNonIrrigation }, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NonIrrigationFilter);