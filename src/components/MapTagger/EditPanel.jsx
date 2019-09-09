import React, { Component } from 'react';

const markerTypes = ['Inflow', 'Irrigation Demand', 'Industrial/Public Consumption', 'Reservoir', 'Power generating Reservoir'];

export default class CustomBasinMap extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        let { width, model, onChange, markerType = '', selectedNode = -1, markerNote = '', innerLoaderState, deleteLoaderState, editModeON } = this.props;

        return (
            <div className="edit-panel-root" style={{ width }}>
                {selectedNode == -1 ?
                    <div><h3>Click anywhere on the map to place a marker / Click an existing marker to edit it</h3></div> :
                    <form>
                        <div className="input-group">
                            <span className='inner-span'>Model Name</span>
                            <span className='model-name'>{model.label}</span>
                        </div>
                        <div className="input-group">
                            <span className='inner-span'>Marker Type</span>
                            <select id='markerType' name="markerType" className='custom-select' value={markerType} onChange={onChange}>
                                <option key={'placeholder-marker'} value={''}>Select Type</option>
                                {_.map(markerTypes, (marker => { return <option key={marker} value={marker}>{marker}</option> }))}
                            </select>
                        </div>

                        <div className="input-group">
                            <span className='inner-span' style={{ verticalAlign: 'top' }}>Note</span>
                            <textarea style={{ color: 'black' }} onChange={onChange}
                                id="markerNote" rows="5" cols="25" value={markerNote} />
                        </div>

                        <div className="input-group m-b">
                            <span className='inner-span' style={{ verticalAlign: 'top' }}>Link</span>
                            <span className='link-select'>Select on River Map</span>
                        </div>

                        <button className={"btn btn-success-outline create-btn"} type="submit" onClick={this.onEditSubmit}>
                            <span className='create-span'>{editModeON ? "SAVE" : "UPDATE"} </span>
                            {innerLoaderState && <Loading type='spin' height='25px' width='25px' color='#d6e5ff' delay={-1} />}
                        </button>
                        {!editModeON &&
                            <button className={"btn btn-danger-outline  create-btn m-l"} type="submit" onClick={this.onDelete}>
                                <span className='create-span'>DELETE </span>
                                {deleteLoaderState && <Loading type='spin' height='25px' width='25px' color='#d6e5ff' delay={-1} />}
                            </button>}


                    </form>}
            </div>
        );
    }
}
