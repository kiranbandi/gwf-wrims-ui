import React, { Component } from 'react';
import { RiverMap, FilterPanel, FlowPanel, RootSchematic, VerticalSlider, Modal } from '../components';
import { setFlowData, setMode, setUser, setUserData, setTrackedUser } from '../redux/actions/actions';
import axios from 'axios';
import toastr from '../utils/toastr';
import Loading from 'react-loading';
import processSchematic from '../utils/processors/processSchematic';
import { getFlowData } from '../utils/requestServer';
import _ from 'lodash';
import LegendPanel from '../components/MapLegend/LegendPanel';
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'


class DashboardRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSchematicLoading: false,
            selectedPlace: '',
            SchematicData: { lines: [], artifacts: [], labels: [], markers: [], selectedRegion: null },
        };
        this.onTrackedUserSelect = this.onTrackedUserSelect.bind(this);
        this.onRegionSelect = this.onRegionSelect.bind(this);
        this.onPlaceSelect = this.onPlaceSelect.bind(this);
    }

    componentDidMount() {
        this.props.actions.setUser();
    }

    componentWillUnmount() {

        const { mode, actions } = this.props;

        if (mode !== 2) {
            actions.setMode(-1);
        }
    }

    onTrackedUserSelect(userID) {

        const { actions, datastore, trackedUser } = this.props;
        
        if (userID === "") { 
            if (userID !== trackedUser) { 
                actions.setTrackedUser(""); 
            } 
            return;
         }

        actions.setTrackedUser(userID);
        
        let trackedUserData = datastore.ordered.users? datastore.ordered.users.filter((user) => (user.id === userID) && (user.state === 'online')) : [];

        if (trackedUserData.length === 0) {
            actions.setTrackedUser('');
            return;
        }
        
        if ((trackedUserData[0].data === "") || trackedUserData[0].data === "###") { 
            this.setState({SchematicData: { lines: [], artifacts: [], labels: [], markers: [], selectedRegion: null }});
            this.props.actions.setUserData(`###`); 
            return; 
        }

        if ((trackedUserData[0].data).slice(-3) === "###") {
            this.onRegionSelect({target: { id: trackedUserData[0].data.split("#")[0]}}); 
            return; 
        }

        this.onPlaceSelect({target: { id: trackedUserData[0].data}});
        return;
    }

    onRegionSelect(event) {
        if (event.target.id === "" || event === "") { return; }

        const selectedRegion = event.target.id || 'highwood';
        this.props.actions.setUserData(`${selectedRegion}###`);

        this.setState({ 'isSchematicLoading': true });
        axios.get("/assets/files/schematics/" + selectedRegion + ".json")
            .then((response) => {
                let processedData = processSchematic(response.data);
                this.setState({ 'SchematicData': { ...processedData, selectedRegion, selectedPlace: '' } });
            })
            .catch(() => { toastr["error"]("Failed to load schematic", "ERROR") })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });
    }

    onPlaceSelect(event) {
        /* id is model#type#name#number */
        if (event.target.id === "" || event === "" || event.target.id === "###") { return; }
        this.props.actions.setUserData(event.target.id);
        const selectorList = event.target.id.split("#");

        let selectedRegion = selectorList[0],
            processedData, flowParams, name;

        this.setState({ 'isSchematicLoading': true });
        axios.get("/assets/files/schematics/" + selectorList[0] + ".json")
            .then((response) => {
                processedData = processSchematic(response.data);
                flowParams = {
                    modelID: selectorList[0],
                    threshold: 'base',
                    number: selectorList[3],
                    type: selectorList[1]
                };
                name = selectorList[2];
                return getFlowData(flowParams);
            })
            .then((records) => {
                let dataList = _.map(records, (d) => (
                    {
                        'flow': (Math.round(Number(d.flow) * 1000) / 1000),
                        'timestamp': d.timestamp
                    }));
                this.setState({ 'SchematicData': { ...processedData, selectedRegion }, selectedPlace: selectorList.join('#') }, () => {
                    this.props.actions.setFlowData({ dataList, name, flowParams, isLoading: false });
                });

            })
            .catch(() => {
                toastr["error"]("Failed to load schematic", "ERROR")
            })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });


    }


    render() {
        const { isSchematicLoading, selectedPlace,
            SchematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            mapWidth = widthOfDashboard * 0.65,
            widthOfSlider = 100;

        // reduce the width of the slider from the map
        mapWidth = mapWidth - widthOfSlider;

        const { mode, datastore, username, userData, trackedUser } = this.props;


        let activeUsers = datastore.ordered.users? datastore.ordered.users.filter((user) => (user.id !== username) && (user.state === 'online')) : [];

        let trackedUserData = datastore.ordered.users? datastore.ordered.users.filter((user) => (user.id === trackedUser) && (user.state === 'online')) : [];

        if (trackedUserData.length === 0 && trackedUser !== "") { this.onTrackedUserSelect(""); }

        let TUData = (trackedUserData.length === 0)? "###" : ((trackedUserData[0].data).slice(-3) === "###")? "###" : trackedUserData[0].data; 

        let trackedNode = TUData.split("#")[2];
        
        let activeBasinUsers = {
            alberta:{
                users: []
            },
            northSask:{
                users: []
            },
            northSaskSask:{
                users: []
            },
            southSask:{
                users: []
            },
            tau:{
                users: []
            },
            highwood:{
                users: []
            },
            stribs:{
                users: []
            }
        }

        activeUsers.forEach((user) => {
            let uData = user.data.split("#");

            if (activeBasinUsers[uData[0]]) {
                activeBasinUsers[uData[0]].users.push(user);
            };
        });
            
        // let activeBasinUsers = (userBasin === "")? undefined : activeUsers.filter((user) => (user.basin === userBasin));

        return (
            <div className='dashboard-page-root' >
                <Modal show={mode === -1 || mode === 2} componentID={"userSelection"} />

                <RootSchematic
                    width={widthOfDashboard}
                    selectedPlace={selectedPlace}
                    onPlaceSelect={this.onPlaceSelect}
                    onRegionSelect={this.onRegionSelect}
                    cwe={true} 
                    mode={mode}
                    activeUsers={activeUsers}
                    activeBasinUsers={activeBasinUsers}
                    userData={userData}
                    onTrackedUserSelect={this.onTrackedUserSelect}
                    trackedUser={trackedUser}
                />

                {isSchematicLoading ?
                    <Loading className='loader' type='spin' height='100px' width='100px' color='#d6e5ff' delay={-1} /> :
                    <div className='dashboard-inner-root'>
                        {SchematicData.lines.length > 0 &&
                            <div>
                                {(mode === 1) && < FilterPanel schematicData={SchematicData} />}
                                <RiverMap
                                    schematicData={SchematicData}
                                    width={mapWidth}
                                    height={mapWidth / 1.75}
                                    isMock={false}
                                    scaleFix={!(mode === 1)} 
                                    trackedNode={trackedNode}/>

                                {(mode === 1) && <VerticalSlider
                                    width={widthOfSlider}
                                    height={mapWidth / 1.75} />}

                                <FlowPanel
                                    width={widthOfDashboard * 0.35}
                                    height={mapWidth / 1.75} />
                                <LegendPanel width={widthOfDashboard} />
                            </div>}
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        flowData: state.delta.flowData,
        mode: state.delta.mode,
        username: state.delta.username,
        datastore: state.firestore,
        userData: state.delta.userData,
        trackedUser: state.delta.trackedUser
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData, setMode, setUser, setUserData, setTrackedUser }, dispatch)
    };
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' }
    ])
)(DashboardRoot);