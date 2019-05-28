import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TubeMap } from '../components';
import axios from 'axios';
import toastr from '../utils/toastr';
import Loading from 'react-loading';


class DashboardRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSchematicLoading: false,
            SchematicData: { lines: [] }
        };
    }

    componentDidMount() {

        this.setState({ 'isSchematicLoading': true });
        axios.get("/assets/files/rivers-corrected.json")
            .then((response) => {
                this.setState({ 'SchematicData': response.data })
            })
            .catch(() => {
                toastr["error"]("Failed to load schematic", "ERROR");
            })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });
    }


    render() {
        const { isSchematicLoading, SchematicData } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            tubeWidth = widthOfDashboard / 2;


        return (
            <div className='dashboard-page-root' >
                {isSchematicLoading ?
                    <Loading className='loader' type='spin' height='100px' width='100px' color='#d6e5ff' delay={-1} /> :
                    <div className='dashboard-inner-root'>
                        <TubeMap tubeData={SchematicData} width={tubeWidth} height={tubeWidth / 1.75} />
                    </div>

                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(DashboardRoot);

