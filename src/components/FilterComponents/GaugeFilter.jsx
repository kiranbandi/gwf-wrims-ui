import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleInflowVisibility, setFilterInflow } from '../../redux/actions/actions';
import Select from 'react-select';
import sortAlphaNum from '../../utils/sortAlphaNum';

class GaugeFilter extends Component {
    constructor(props) {
        super(props);
        this.onInflowClick = this.onInflowClick.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onInflowClick() {
        this.props.actions.toggleInflowVisibility();
    }

    onSelectChange(selectedValueList) {
        this.props.actions.setFilterInflow(_.map(selectedValueList, (d) => d.label));
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areInflowsVisible = false, visibleInflows = [] } = filterMesh;

        // filter out all demands , then get the name of the demand and finally sort 
        const inflowsList = _.map(_.filter(schematicData.markers,
            (d) => { return (d.type == 'inflow' || d.type == 'inflow') }),
            (d) => d.name)
            .sort(sortAlphaNum);

        // Merge the option Array text with the count of records present in each type
        const modifiedOptionArray = _.map(inflowsList, (option) => ({ label: option, value: option }));


        return (
            <div>
                <label className='filter-label filter-title'>Gauges</label>
                <div className='inner-filter-box'>
                    <label className='filter-label'>Selection: </label>
                    {/* Allowing the user to select specific inflows */}
                    <div className='select-container-filter'>
                        <Select
                            isClearable={true}
                            name={'inflow-select'}
                            // defaultValue={'asdf'}
                            isMulti
                            isDisabled={!areInflowsVisible}
                            // react select needs a value and so we need to set it in a complicated way with a function
                            //  need to find a more elegant solution in future
                            value={_.map(visibleInflows, (name) => ({ label: name, value: name }))}
                            options={modifiedOptionArray}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={this.onSelectChange} />
                    </div>
                </div>
                {/* Adding a button to toggle all demands */}
                <button
                    className={('btn btn-primary inflow-btn ') +
                        (areInflowsVisible ? ' ' : 'active-button')}
                    onClick={this.onInflowClick}> HIDE SELECTED GAUGES
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
        actions: bindActionCreators({ toggleInflowVisibility, setFilterInflow }, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GaugeFilter);