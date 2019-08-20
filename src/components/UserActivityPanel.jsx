import React, { Component } from 'react'
import { compose, bindActionCreators } from 'redux';
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'


class UserActivityPanel extends Component {



    render() {

        const { width, datastore, username, userBasin } = this.props;


        let activeUsers = datastore.ordered.users? datastore.ordered.users.filter((user) => (user.id !== username) && (user.state === 'online')) : [];
        let activeBasinUsers = activeUsers.filter((user) => (user.basin === userBasin));
        return (
            <div className= "user-activity-panel-root">
                <div className="active-users" style={{height: ((width / 2.15) * .4) + 55}}>
                    <h1 className='text-primary switch-custom-label'>Active Users</h1>
                    <div className="user-list-container" style={{height: ((width / 2.15) * .4) - 26}}>
                        {
                            activeUsers.map((user, idx) => {
                                return(<div className="active-user" key={idx}>{user.email}</div>)
                            })
                        }
                    </div>
                </div>
                {(userBasin !== '') && <div className="active-users" style={{height: ((width / 2.15) * .4) + 55}}>
                    <div style={{padding: '0px 6px'}}>
                        <h1 className='text-primary switch-custom-label'>Active Users on this Basin</h1>
                    </div>    
                    <div className="user-list-container" style={{height: ((width / 2.15) * .4) - 26}}>
                        {
                            activeBasinUsers.map((user, idx) => {
                                return(<div className="active-user" key={idx}>{user.email}</div>)
                            })
                        }
                    </div>
                </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.delta.username,
        datastore: state.firestore,
        userBasin: state.delta.userBasin
    };
};

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect([
        { collection: 'users' }
    ])
)(UserActivityPanel);
