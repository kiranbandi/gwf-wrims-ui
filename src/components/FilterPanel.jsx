/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleDemandVisibility, setFilterDemand } from '../redux/actions/actions';
import Select from 'react-select';

class FilterPanel extends Component {

    constructor(props) {
        super(props);
        this.onDemandClick = this.onDemandClick.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onDemandClick() {
        this.props.actions.toggleDemandVisibility();
    }

    onSelectChange(selectedValueList) {
        this.props.actions.setFilterDemand(_.map(selectedValueList, (d) => d.label));
    }

    render() {
        const { filterMesh, tubeData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areDemandsVisible = false, visibleDemands = [] } = filterMesh;


        const demandsList = _.map(_.filter(tubeData.lines,
            (d) => { return (d.type == 'regular-demand' || d.type == 'irrigation-demand') }),
            (d) => d.name);

        // Merge the option Array text with the count of records present in each type
        const modifiedOptionArray = _.map(demandsList, (option) => {
            return {
                label: option,
                value: option
            }
        });

        const selectedDemandList = _.map(visibleDemands, (name) => {
            return {
                label: name,
                value: name
            }
        });

        return (
            <div className='filter-root-container'>
                <button
                    className={('btn btn-info demand-btn ') +
                        (areDemandsVisible ? ' active-button' : '')}
                    onClick={this.onDemandClick}
                > TOGGLE ALL DEMANDS </button>

                <div className='inner-filter-box'>
                    <label className='filter-label'>Demand</label>
                    <div className='select-container-filter'>
                        <Select
                            isClearable={true}
                            name={'demand-select'}
                            isMulti
                            isDisabled={!areDemandsVisible}
                            // react select needs a value and so we need to set it in a complicated way with a function
                            //  need to find a more elegant solution in future
                            value={selectedDemandList}
                            options={modifiedOptionArray}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={this.onSelectChange} />
                    </div>
                </div>

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
        actions: bindActionCreators({ toggleDemandVisibility, setFilterDemand }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
