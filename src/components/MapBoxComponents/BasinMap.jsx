import React, { Component } from 'react';
import MapGL, { Popup, FlyToInterpolator } from 'react-map-gl';
import PLACES from '../../utils/static-reference/mapPlaces';
import MarkingMenu from './MarkingMenu'
import { fromJS } from 'immutable';
import defaultMapStyle from './MapStyle.jsx';

const TOKEN = 'pk.eyJ1IjoicmljYXJkb3JoZWVkZXIiLCJhIjoiY2p4MGl5bWIyMDE1bDN5b2NneHh5djJ2biJ9.3ALfBtMIORYFNtXU9RUUnA';

// An array used to contain the basin names from MapStyle.jsx that are to be interacted with
let basinArray = [
    'SK-South-Saskatchewan-River',
    'Highwood',
    // 'Reddeer-River',
    'SK-North-Saskatchewan-River',
    'AB-North-Saskatchewan-River',
    'Tau-Basin',
    // 'Oldman-River',
    'Stribs-Basin'

];

const selectColor = "hsla(0, 36%, 71%, 0)" // A translucent color for basin selection

let curHover = ''
let prevHover = ''

let basinSelectedLayerIndex = null
let basinPrevSelectedLayerIndex = ''
let basinBorderLayerIndex = ''

let editedMapStyle = null;
let currentSelectedName = ''

export default class BasinMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            componentMounted: false, // Used to stop errors for the onviewportChange() method
            mapStyle: defaultMapStyle,
            viewport: {
                width: 400,
                height: 400,
                latitude: 52.25,
                longitude: -110.75,
                zoom: 5.1
            },
            popupInfo: null,    // Used for the Marking Menu's variables 
            hoverInfo: null,    // Used for displaying the basin's names when hovering
            place: null,        // Used to store the current selected place/Basin
            markingMenu: {
                curClick: false,    // If clicked, curClick = true, else, curClick = false
                prevClick: false,   // What curClick previously was
                xPos: 0,
                yPos: 0,
                mouseOver: false    // If the cursor is hovering over the Marking Menu
            },
            displayImage: false,    // A toggled boolean on whether or not to display the Marking Menu's image
        };

        this.renderHoverPopup = this.renderHoverPopup.bind(this);
        this.addMarkingMenu = this.addMarkingMenu.bind(this);
    }

    componentDidMount(){
        this.setState({ componentMounted: true })

        curHover = ''
        prevHover = ''

        basinSelectedLayerIndex = null
        basinPrevSelectedLayerIndex = ''
        basinBorderLayerIndex = ''

        editedMapStyle = null;
        currentSelectedName = ''
    }

    componentWillUnmount(){
        this.setState({ componentMounted: false })
    }

    /**
     * The cursor's hovering events on the basin map such as:
     *  - Setting the basin's bordering
     *  - Setting the Hover information
     *  - Retrieving the name of the currently hovered basin
     * 
     * @event: The event object tracked by react-map-gl
     */
    _onHover = event => {
        let hoverInfo = null; // Resetting the hoverInfo allows the pop-up to re-render at the mouse's current position

        // True if event.features is available, and the name is within the basinArray object
        const basin = event.features && event.features.find(f => basinArray.indexOf(f.layer.id) > -1);

        if (this.state.markingMenu.mouseOver) { return }    // If the cursor is hovering over the marking menu, don't do anything

        // If hovering over a basin
        if (basin) {
            // console.log(event.lngLat)
            if (currentSelectedName != curHover) {
                // Resetting the hoverInfo allows the pop-up to re-render at the mouse's current position
                hoverInfo = {
                    lngLat: event.lngLat,
                    basinName: basin.layer.id.split("-").join(" ")
                };
                this.setState({ hoverInfo })
            } else {    // To prevent the pop-up when hovering over the currently selected Basin
                hoverInfo = null;
                this.setState({ hoverInfo })    
            }

            let basinNameId = basin.layer.id;   // Store basin name as ID

            curHover = basinNameId  // Store basin ID as current hover
            // Check that we are not still hovering over same basin
            if (prevHover != curHover) {
                // We are hovering over new basin - make changes
                // Get the border layer index, so that a border can be applied to the basin we are currently hovering over
                basinBorderLayerIndex = this.getBasinBorderLayerIndex() 
            }
        } else {
            curHover = ''   // If basin=false, currently hovering over none of the desired basins
        }

        // If the current hover has changed OR if we are hovering over no basins
        if ((curHover != prevHover) || (curHover == '' && basinArray.indexOf(prevHover) > -1)) {
            prevHover = curHover    // Set previous hover to what was previously hovered
            this.closeMarkingMenu() // Close the Marking Menu when hovering over new area
            
            // If we aren't hovering over any of the desired basins, reset the map
            if (curHover == '') {   
                hoverInfo = ''
                editedMapStyle = defaultMapStyle

                // Keeps the Selected Basin even when hovering outside of the basins
                if (basinSelectedLayerIndex != '') {
                    editedMapStyle = this.highlightBasin(editedMapStyle, basinSelectedLayerIndex, currentSelectedName, selectColor)
                }

            } else {
                // Reset the edited map
                editedMapStyle = defaultMapStyle   
                // Border the current basin(s)
                editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex)
                // If there is a basin selected, highlight the current basin
                if (basinSelectedLayerIndex != '') {
                    editedMapStyle = this.highlightBasin(editedMapStyle, basinSelectedLayerIndex, currentSelectedName, selectColor)
                }
            }
            this.setState({
                mapStyle: editedMapStyle,
                hoverInfo
            })
        }
    };

    /**
     * The cursor's onMouseUp events on the basin map
     * Deals with most of the onClick actions such as:
     *  - Setting the basin highlighting
     *  - Setting the Pop-up information
     *  - Opening/Closign the Marking Menu
     * 
     * @event: The event object tracked by react-map-gl
     */
    _onMouseUp = event => {
        let hoverInfo = null; // Resetting the hoverInfo allows the pop-up to re-render at the mouse's current position
        this.setState({ hoverInfo })

        // If not hovering over anything, or hovering over the Marking Menu, don't do anything 
        if (curHover == '' || this.state.markingMenu.mouseOver) { return }
        
        // Get the Basin Layer currently being hovered over
        basinSelectedLayerIndex = this.getBasinLayerIndex()

        // Unselect the previous basin by resetting the map
        if (basinPrevSelectedLayerIndex != '') {
            editedMapStyle = defaultMapStyle
            editedMapStyle = this.borderBasin(editedMapStyle, basinBorderLayerIndex) // Reapply border
        }
        basinPrevSelectedLayerIndex = basinSelectedLayerIndex   // Store the previous border's index

        // Store the name of the currently selected basin
        currentSelectedName = curHover

        // Repaint current basin
        editedMapStyle = this.highlightBasin(editedMapStyle, basinSelectedLayerIndex, currentSelectedName, selectColor)

        this.setState({
            mapStyle: editedMapStyle
        });

        // Set the current place selected to the basin selected
        this.setPlace(currentSelectedName); 

        // Update popupInfo state to the newly selected place 
        if (this.state.place != null) {
            // Set the popup info for the current place marker
            this.setState({ popupInfo: this.state.place }) // viewport
        }

        // If a basin is selected, open the Marking Menu at the current location, else, remove the marking menu
        if (curHover != '') {
            // If not already hovering over the Marking Menu, then open the Marking Menu at the current location
            if (!this.state.markingMenu.mouseOver) {
                this.setState({
                    markingMenu: { ...this.state.markingMenu, curClick: true, xPos: event.point[0] - 12.5, yPos: event.point[1] - 12.5 },
                });
            }
        } else {
            this.closeMarkingMenu();
        }
    }

    /**
     * The cursor's onMouseDown events on the basin map
     * 
     * @event: The event object tracked by react-map-gl
     */
    _onMouseDown = event => {
        // If not hovering over the Marking Menu button close the Marking Menu
        if (this.state.markingMenu.mouseOver == false) {
            this.setState({
                markingMenu: { ...this.state.markingMenu, curClick: false }
            });
        }
    };

    /**
     * Get the selected basin's layer index
     * Layer index is useful for editing layers within MapStyle.jsx
     */
    getBasinLayerIndex() {
        let layers = defaultMapStyle.get('layers')
        let basinHighlightLayerIndex = layers.findIndex((l) => {
            return l.toObject().id == (curHover)
        })
        return basinHighlightLayerIndex
    }

    /**
     * Get the currently hovered basin's layer index
     * Layer index is useful for editing layers within MapStyle.jsx
     */
    getBasinBorderLayerIndex() {
        // Get index of the current basin's border
        let layers = defaultMapStyle.get('layers')
        let layerIndex = layers.findIndex((l) => {
            return l.toObject().id == (curHover + '-Border')
        })
        return layerIndex
    }

    /**
     * Used to toggle the state on if the mouse if hovering OFF the Marking Menu
     */
    mouseOut() {
        this.setState({
            markingMenu: { ...this.state.markingMenu, mouseOver: false }
        });
    }

    /**
     * Used to toggle the state on if the mouse if hovering ON the Marking Menu
     */
    mouseOver() {
        this.setState({
            markingMenu: { ...this.state.markingMenu, mouseOver: true },
            hoverInfo: null
        });
    }

    /**
     * The logic to apply highlighting to desired basin(s)
     * 
     * @mapToEdit The mapstyle to edit
     * @basinHighlightIndex The layer index to use
     * @basinHighlightName The layer name to use for special cases
     * @color The color to highlight to
     */
    highlightBasin(mapToEdit, basinHighlightIndex, basinHighlightName, color) {
        if (basinHighlightName == 'Tau-Basin') {
            mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex + 1, 'paint', 'fill-color'], color)
        }
        else if (basinHighlightName == 'Highwood') {
            mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], color)
        }
        else if (basinHighlightName == 'Stribs-Basin') {
            mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex - 1, 'paint', 'fill-color'], color)
        }

        mapToEdit = mapToEdit.setIn(['layers', basinHighlightIndex, 'paint', 'fill-color'], color)

        return mapToEdit
    }

    /**
     * The logic to apply bordering to desired basin(s)
     * 
     * @mapToEdit The mapstyle to edit
     * @basinBorderIndex The layer index to use
     */
    borderBasin(mapToEdit, basinBorderIndex) {
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "visible")

        return mapToEdit
    }

    /**
     * The logic to unborder to desired basin(s)
     * 
     * @mapToEdit The mapstyle to edit
     * @basinBorderIndex The layer index to use
     */
    unborderBasin(mapToEdit, basinBorderIndex) {
        mapToEdit = mapToEdit.setIn(['layers', basinBorderIndex, 'layout', 'visibility'], "none")

        return mapToEdit
    }

    /**
     * Sets the state of place to once of the places within /utils/static-reference/mapPlaces
     * Get information for the Info-Card pop-up
     * 
     * @curHover The basin that is currently being hovered
     */
    setPlace(curHover) {
        if (curHover == 'SK-South-Saskatchewan-River') {
            this.setState({
                place: PLACES[0]
            });
        }
        else if (curHover == 'Highwood') {
            this.setState({
                place: PLACES[1]
            });
        }
        else if (curHover == 'SK-North-Saskatchewan-River') {
            this.setState({
                place: PLACES[2]
            });
        }
        else if (curHover == 'AB-North-Saskatchewan-River') {
            this.setState({
                place: PLACES[3]
            });
        }
        else if (curHover == 'Tau-Basin') {
            this.setState({
                place: PLACES[4]
            });
        }
        else if (curHover == 'Stribs-Basin') {
            this.setState({
                place: PLACES[5]
            });
        }
    }

    /**
     * The onClick method for the Marking menu's buttons
     */
    iconButtonClick = () => {
        this._goToViewport(this.state.place)    // Moves the viewport to the designated area
        this.props.onRegionSelect({ 'target': this.state.place })   // Selects the region
    }

    /**
     * Renders the basin's name while hovering over the basin
     */
    renderHoverPopup() {
        const { hoverInfo } = this.state;
        if (hoverInfo) {
            return (
                <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
                    <div className="basin-info">{hoverInfo.basinName}</div>
                </Popup>
            );
        }
        return null;
    }

    /**
     * Method for react-map-gl to render any changes onto the viewport
     * 
     * @viewport The current viewport used by react-map-gl
     */
    _onViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        });
    }

    /**
     * Method for react-map-gl to transition the viewport to the new latlng location with a zoom
     * 
     * @longitude The lng. to move to
     * @latitude The lat. to move to
     * @zoom The zoom level for the viewport
     */
    _goToViewport = ({ longitude, latitude, zoom }) => {
        this.state.componentMounted ? this._onViewportChange({
            longitude,
            latitude,
            zoom,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1500
        }) : null;
    };

    /**
     * An onClick event for the Marking Menu
     * Opens the schematic for viewing at the bottom of the schrren
     * Hides the Marking Menu
     */
    viewSchematic() {
        this.iconButtonClick()
        this.setState({
            markingMenu: { ...this.state.markingMenu, curClick: false, mouseOver: false }
        });
    }

    /**
     * Opens the Marking Menu onto the current position of the mouse
     * Will be rendered from within the React render method
     */
    addMarkingMenu() {
        const { popupInfo } = this.state;

        if (this.state.markingMenu.curClick) {
            // console.log("add marking menu")

            return (
            <div ref="markingmenu">
                <MarkingMenu
                    x={this.state.markingMenu.xPos}
                    y={this.state.markingMenu.yPos}
                    type="circle"
                    margin={35}
                >
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()} >
                        <button className="icon icon-controller-record" />
                    </div>
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <button className="icon icon-image" onClick={() => { event.preventDefault(); this.setState({ displayImage: !this.state.displayImage }) }} />
                        <div className="basin-image-div" >
                            {this.state.displayImage
                                ? <div className="polaroid">
                                    <img className="basin-image" width={240} src={popupInfo.image} />
                                    <div className="text-container">
                                        <p className="text-styling">{popupInfo.name}</p>
                                    </div>
                                </div>
                                : <img />
                            }
                        </div>
                    </div>
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <button className="icon icon-pie-chart" onClick={() => this.viewSchematic()} />
                    </div>
                    <div className="button marking-menu-button" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
                        <a className="icon icon-info-with-circle" target="_new" href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${`${popupInfo.name}`}`} />
                    </div>
                </MarkingMenu>
            </div>
                
            )
        }
        else {''}
        
    }
    
    /**
     * Closes the Marking Menu if it was open
     */
    closeMarkingMenu() {
        if (this.state.markingMenu.curClick == true) { 
            this.setState({
                markingMenu: { ...this.state.markingMenu, curClick: false, mouseOver: false }
            });
        }
    }

    render() {
        let { viewport, mapStyle } = this.state, { width } = this.props;
        const { componentMounted } = this.state

        // Set the viewports for the map
        viewport.width = width;
        viewport.height = width / 2.5;

        return (
            <div className="mapboxDiv">

                <MapGL
                    mapStyle={fromJS(mapStyle)}
                    mapboxApiAccessToken={TOKEN}
                    {...viewport}

                    onViewportChange={componentMounted ? this._onViewportChange : null }
                    doubleClickZoom={false}
                    dragRotate={false}
                    minZoom={2}

                    onHover={this._onHover}
                    onMouseDown={this._onMouseDown}
                    onMouseUp={this._onMouseUp}

                    // If transition, dragging, panning, potating, or zooming, then close the Marking Menu
                    onInteractionStateChange={() => this.closeMarkingMenu()}
                >
                    {this.renderHoverPopup()}

                    <div className="markingMenuDiv">
                        {this.addMarkingMenu()}
                    </div>
                </MapGL>
            </div>
        );
    }
}
