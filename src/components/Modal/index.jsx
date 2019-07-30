import React, { Component } from 'react';
import { UserSelection } from './ModalComponents'

class Modal extends Component {
    
    constructor(props) {
        super(props);

        this.componentID = undefined;
        this.show = false;
        this.state = {
            modalComponents: {
                "userSelection" : <UserSelection/>
            }
        }
        
    }

    
    render() {
        
        const { componentID, show } = this.props;

        const { modalComponents } = this.state;

        return (
            <div className={"modal-root" + (show? " visible" : "")}>
                {modalComponents[componentID] && modalComponents[componentID]}    
            </div>
        );
    }
}

export default Modal;