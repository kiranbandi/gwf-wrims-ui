import React, { Component } from 'react';


class UserActivityPanel extends Component {

    render() {

        const { width, activeUsers, activeBasinUsers, userData, onTrackedUserSelect, trackedUser } = this.props;

        const userBasin = userData.split("#")[0];
        
        return (
            <div className= "user-activity-panel-root">
                <div className="active-users-container" style={{height: ((width / 2.15) * .4) + 30}}>
                    <div className='auc-title'>Active Users</div>
                    <div className="user-list-container" style={{height: ((width / 2.15) * .4) - 26}}>
                        {
                            activeUsers.map((user, idx) => {
                                return(<div className={"active-user" + ((user.id === trackedUser)? " tracked" : "")} key={idx} onClick={() => { onTrackedUserSelect(user.id); }}>{user.email}</div>)
                            })
                        }
                    </div>
                </div>
                {(userBasin !== "") && 
                    <div className="active-users-container" style={{height: ((width / 2.15) * .4) + 30}}>
                        <div className='auc-title'>Active Users on this Basin</div>
                        <div className="user-list-container" style={{height: ((width / 2.15) * .4) - 26}}>
                            {
                                activeBasinUsers[userBasin].users.map((user, idx) => {
                                    return(<div className={"active-user" + ((user.id === trackedUser)? " tracked" : "")} key={idx} onClick={() => { onTrackedUserSelect(user.id); }}>{user.email}</div>)
                                })
                            }
                        </div>
                    </div>}
                <div className="ua-reset" onClick={() => { onTrackedUserSelect(""); }} title={"Clear all tracking data"}><span className="icon icon-cw"></span>RESET</div>    
            </div>
        )
    }
}

export default UserActivityPanel;
