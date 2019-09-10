import React, { Component } from 'react';
import processSchematic from '../../utils/processors/processSchematic';
import CustomRiverMap from './CustomRiverMap';
import axios from 'axios';
import toastr from '../../utils/toastr';
import Loading from 'react-loading';

class RiverMapModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            schematicData: false,
            isLoaderVisible: false
        };
        this._isMounted = false;

        this.onItemClick = this.onItemClick.bind(this);
    }


    onItemClick(itemType, params) {
        const { currentModel, setMarkerLink } = this.props;

        let number, type;

        // ignore clicks on junctions for now
        if (itemType == 'marker' && params.type == 'junction') {
            return;
        }
        else if (itemType == 'marker' && (params.type == 'agri' || params.type == 'demand')) {
            number = params.nodeNum;
            type = 'demand';
        }
        else if (itemType == 'marker' && params.type == 'inflow') {
            number = params.nodeNum;
            type = 'inflow';
        }
        else if (itemType == 'artifact' && params.type == 'reservoir') {
            number = params.nodeNum;
            type = 'reservoir';
        }
        else if (itemType == 'link') {
            number = params.linkNum;
            type = 'link';
        }

        let link = [currentModel, type, params.name, number].join('#');
        setMarkerLink(link);
    }


    componentDidMount() {

        this._isMounted = true;

        const { currentModel = 'highwood' } = this.props;

        this.setState({ 'isLoaderVisible': true });
        axios.get("/assets/files/schematics/" + currentModel + ".json")
            .then((response) => {
                let processedData = processSchematic(response.data);
                this._isMounted && this.setState({ 'schematicData': { ...processedData } });
            })
            .catch(() => { toastr["error"]("Failed to load schematic", "ERROR") })
            // turn off file processing loader
            .finally(() => { this._isMounted && this.setState({ 'isLoaderVisible': false }) });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { toggleModal, width, currentModel, markerLink } = this.props, { schematicData } = this.state;

        return (
            <div className={"modal-root visible"}>
                <div className='modal-main'>
                    <button type="button" className="close" onClick={toggleModal}><span>×</span></button>
                    <h3 className='text-center'>Double Click on one of the available nodes below to <b>link</b> it to the <b>Current Marker</b></h3>


                    <div className='river-map-modal-container'>
                        {!!schematicData ? <CustomRiverMap
                            markerLink={markerLink}
                            currentModel={currentModel}
                            onItemClick={this.onItemClick}
                            schematicData={this.state.schematicData}
                            width={width}
                            height={width / 2}
                            fromDashboard={false} /> :
                            <Loading className='filter-loader' type='spin' height='100px' width='100px' color='white' delay={-1} />
                        }
                    </div>


                </div>
            </div>
        );
    }
}

export default RiverMapModal;