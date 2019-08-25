import React, { Component } from 'react';
import { UserSelection, InformationContainer } from './ModalComponents'

class Modal extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modalComponents: {
                "userSelection" : function(args) { return ( <UserSelection args={args}/> ); },
                "infoContainer" : function(args) { return ( <InformationContainer args={args}/> ); } 
            }
        }
    }
    
    render() {
        
        const { componentID = "", 
                show = false, 
                onClick = () => { return; },
                args = [], 
                closeButton = false,
                onClose = () => { return; } } = this.props;
        
        let crossIconStyle = { background: 'url(assets/img/cross.png)', backgroundSize: '100%' };

        const { modalComponents } = this.state;

        return (
            <div className={"modal-root" + (show? " visible" : "")} onClick={onClick}>
                {closeButton && 
                    <div 
                     className="modal-cross-icon-container" 
                     style={crossIconStyle}
                     onClick={onClose}>
                     </div>}
                {modalComponents[componentID] && modalComponents[componentID](args)}    
            </div>
        );
    }
}

export default Modal;