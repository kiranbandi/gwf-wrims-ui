import React, { Component } from 'react';
import { NavBar } from './';
import Loading from 'react-loading';
import { requestLogin } from '../utils/requestServer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLoginData } from '../redux/actions/actions';


class Container extends Component {

    constructor(props) {
        super(props);
        this.state = { showPawsLoginLoader: false };
    }

    componentDidMount() {
        const { pawsTicket } = this.props.route;
        // if the base route was launched with a ticket then validate the ticket
        if (pawsTicket) {
            this.setState({ showPawsLoginLoader: true });
            // isPAWS flag set to true to differentiate login from google login
            requestLogin(pawsTicket, true)
                .then((userData) => { this.props.actions.setLoginData(userData) })
                .catch((err) => { console.log(err) })
                .finally(() => {
                    this.setState({ showPawsLoginLoader: false });
                });
        }
    }


    render() {

        const { showPawsLoginLoader } = this.state;

        return (
            <div id='app-container'>
                {/* navbar content , common for entire application */}
                <NavBar />
                {showPawsLoginLoader ?
                    <Loading type='spin' className='paws-loader' height='100px' width='100px' color='#d6e5ff' delay={-1} />
                    : <div id='container-body'>{this.props.children} </div>
                }
                <footer className="footer w-full m-t hidden-xs">
                    <div className="container-fluid">
                        <div className='footer-inner bottom-left'>
                            <div className="left text-xs-left">
                                <a className="footer-link right" href="https://water.usask.ca/"> <img src="assets/img/usask_GIWS_Logo-Standard.png" height="50" width="80" style={{ 'margin': '5px 0px' }} /></a>
                                <a className="footer-link right" href="https://gwf.usask.ca/"> <img src="assets/img/IMPC_Horizontal_FC.png" height="40" width="135" style={{ 'margin': '5px 0px' }} /></a>
                                <a className="footer-link right" href="http://hci.usask.ca/" > <img src="assets/img/interaction_lab.gif" height="40" width="150" style={{ 'margin': '5px 0px' }} /></a>
                            </div>
                        </div>
                        <div className='footer-inner text-right bottom-right'>
                            <a className="footer-link"
                                href="mailto:venkat.bandi@usask.ca?subject=GWF HCI&amp;body=Please%20Fill%20">
                                Contact Us </a>
                            <span className='pole-holder'>|</span>
                            <a href="https://www.usask.ca/">University of Saskatchewan</a>
                            <span className='pole-holder'>|</span>
                            <a href="https://www.usask.ca/disclaimer.php">Disclaimer</a>
                            <span className='pole-holder'>|</span>
                            <a href="https://www.usask.ca/privacy.php">Privacy</a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setLoginData }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Container);