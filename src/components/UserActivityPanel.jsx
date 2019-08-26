import React, { Component } from 'react'


class UserActivityPanel extends Component {

    render() {

        const { width, activeUsers, activeBasinUsers, userBasin } = this.props;
        
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
                {(userBasin !== "") && <div className="active-users" style={{height: ((width / 2.15) * .4) + 55}}>
                    <div style={{padding: '0px 6px'}}>
                        <h1 className='text-primary switch-custom-label'>Active Users on this Basin</h1>
                    </div>    
                    <div className="user-list-container" style={{height: ((width / 2.15) * .4) - 26}}>
                        {
                            activeBasinUsers[userBasin].users.map((user, idx) => {
                                return(<div className="active-user" key={idx}>{user.email}</div>)
                            })
                        }
                    </div>
                </div>}
            </div>
        )
    }
}

export default UserActivityPanel;
