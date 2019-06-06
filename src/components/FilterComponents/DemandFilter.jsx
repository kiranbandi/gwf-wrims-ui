import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleDemandVisibility, setFilterDemand } from '../../redux/actions/actions';
import Select from 'react-select';
import sortAlphaNum from '../../utils/sortAlphaNum';

class DemandFilter extends Component {
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
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areDemandsVisible = false, visibleDemands = [] } = filterMesh;

        // filter out all demands , then get the name of the demand and finally sort 
        const demandsList = _.map(_.filter(schematicData.lines,
            (d) => { return (d.type == 'regular-demand' || d.type == 'irrigation-demand') }),
            (d) => d.name)
            .sort(sortAlphaNum);

        // Merge the option Array text with the count of records present in each type
        const modifiedOptionArray = _.map(demandsList, (option) => ({ label: option, value: option }));


        return (
            <div className='filter-container'>

                <div className='inner-filter-box'>
                    {/* Allowing the user to select specific demands */}
                    <div className='select-container-filter'>
                        <Select
                            isClearable={true}
                            placeholder='Select Demands...'
                            name={'demand-select'}
                            // defaultValue={'asdf'}
                            isMulti
                            isDisabled={!areDemandsVisible}
                            // react select needs a value and so we need to set it in a complicated way with a function
                            //  need to find a more elegant solution in future
                            value={_.map(visibleDemands, (name) => ({ label: name, value: name }))}
                            options={modifiedOptionArray}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={this.onSelectChange} />
                    </div>
                </div>
                {/* Adding a button to toggle all demands */}
                <button
                    className={"custom-icon-button demand " + ('icon') +
                        (areDemandsVisible ? ' icon-eye' : ' icon-eye-with-line')}
                    onClick={this.onDemandClick}>
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
        actions: bindActionCreators({ toggleDemandVisibility, setFilterDemand }, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DemandFilter);
