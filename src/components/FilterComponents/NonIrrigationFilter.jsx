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
                            placeholder='Select Non-Irrigations...'
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
                    {/* Adding a button to toggle all demands */}
                    <button
                        className={"custom-icon-button demand " + ('icon')}
                        onClick={this.onNonIrrigationClick}>
                        <svg transform="translate(-3,3)" width="25" height="25"  >
                            <g>
                                <path id="marker-image"
                                    transform={"translate(0, 0) " + (areNonIrrigationsVisible ? "scale(0.060)" : "scale(0.050)")}
                                    fill="white"
                                    d={
                                        areNonIrrigationsVisible ? "M300,240.715V155l-120,85.715V155h-30V85h-30v70H90V35H30v120H0v230h420V155L300,240.715z M160,335h-40 v-40h40V335z M230,335h-40v-40h40V335z M300,335h-40v-40h40V335z"
                                            : "M365.714,249.905v-60.952l-146.286,60.952v-60.952h-54.857v-85.333H128v85.333H91.429V42.667H54.857v146.286H0v280.381 h512V188.952L365.714,249.905z M201.143,432.762h-36.571V396.19h36.571V432.762z M274.286,432.762h-36.571V396.19h36.571V432.762z"
                                            + " M347.429,432.762h-36.571V396.19h36.571V432.762z M475.429,432.762H384v-73.143H128v73.143H36.571V225.524h146.286v24.381v54.857"
                                            + " l50.638-21.099l95.648-39.853v6.095v54.857l50.638-21.099l95.648-39.853V432.762z"
                                    }
                                />
                            </g>
                        </svg>
                    </button>
                </div>
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