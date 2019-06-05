import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleAmenityVisibility, setFilterAmenity } from '../../redux/actions/actions';
import Select from 'react-select';
import sortAlphaNum from '../../utils/sortAlphaNum';

class AmenitiesFilter extends Component {
    constructor(props) {
        super(props);
        this.onAmenityClick = this.onAmenityClick.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onAmenityClick() {
        this.props.actions.toggleAmenityVisibility();
    }

    onSelectChange(selectedValueList) {
        this.props.actions.setFilterAmenity(_.map(selectedValueList, (d) => d.label));
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props,
            { areAmenitiesVisible = false, visibleAmenities = [] } = filterMesh;

        // filter out all demands , then get the name of the demand and finally sort 
        const amenitiesList = _.map(_.filter(schematicData.lines,
            (d) => { return (d.type == 'diversion' || d.type == 'diversion') }),
            (d) => d.name)
            .sort(sortAlphaNum);

        // Merge the option Array text with the count of records present in each type
        const modifiedOptionArray = _.map(amenitiesList, (option) => ({ label: option, value: option }));


        return (
            <div>
                <label className='filter-label filter-title'>Amenities</label>
                <div className='inner-filter-box'>
                    <label className='filter-label'>Selection: </label>
                    {/* Allowing the user to select specific inflows */}
                    <div className='select-container-filter'>
                        <Select
                            isClearable={true}
                            name={'amenity-select'}
                            // defaultValue={'asdf'}
                            isMulti
                            isDisabled={!areAmenitiesVisible}
                            // react select needs a value and so we need to set it in a complicated way with a function
                            //  need to find a more elegant solution in future
                            value={_.map(visibleAmenities, (name) => ({ label: name, value: name }))}
                            options={modifiedOptionArray}
                            styles={{ option: (styles) => ({ ...styles, color: 'black', textAlign: 'left' }) }}
                            onChange={this.onSelectChange} />
                    </div>
                </div>
                {/* Adding a button to toggle all demands */}
                <button
                    className={('btn btn-primary hide-btn ') +
                        (areAmenitiesVisible ? ' ' : 'active-button')}
                    onClick={this.onAmenityClick}> HIDE SELECTED AMENITIES
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
        actions: bindActionCreators({ toggleAmenityVisibility, setFilterAmenity }, dispatch) // *ADDED
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AmenitiesFilter);