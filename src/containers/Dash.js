import React, { Component } from 'react'
import { connect } from 'react-redux'
import DashBlock from '../components/dash/DashBlock'
import { getMyTrendingDiscussions, getDashUserInfo, getDashUsersRank } from '../actions/dashAction'
import { push } from 'react-router-redux'

class Dash extends Component {

  onJoinDiscussion({ id }) {
    let { dispatch } = this.props
    dispatch(push(`/discussion/${id}`))
  }

  render() {
    let { dispatch, myTrendingDiscussions, dashUserInfo, isAuthenticated, dashUsersRank } = this.props

    return (
      <div>
        {isAuthenticated && <DashBlock myTrendingDiscussions={myTrendingDiscussions}
                                       dashUserInfo={dashUserInfo}
                                       dashUsersRank={dashUsersRank}
                                       getDashUsersRank={() => dispatch(getDashUsersRank())}
                                       onJoinDiscussion={this.onJoinDiscussion.bind(this)}
                                       getDashUserInfo={() => dispatch(getDashUserInfo())}
                                       getMyTrendingDiscussions={() => dispatch(getMyTrendingDiscussions())}/>}
      </div>
    )
  }
}

function inject(state) {
  return {
    isAuthenticated: state.login.auth.get('isAuthenticated'),
    myTrendingDiscussions: state.dash.myTrendingDiscussions.toJS(),
    dashUserInfo: state.dash.dashUserInfo.toJS(),
    dashUsersRank: state.dash.dashUsersRank.toJS(),
    userInfo: state.sidebar.userInfo.toJS()
  }
}

export default connect(inject)(Dash)
