import React, { Component } from 'react'
import moment from 'moment'

class DiscussionCard extends Component {

  joinToDiscussion() {
    this.props.onJoinDiscussion(1)
  }

  render() {
    let { name, description, isLimited, isPrivate, limitedTime, tags, type_name } = this.props.discussion

    return (
        <div className='card card-block col-xs-12 col-sm-12 col-md-12 col-lg-6 my-discussion-card'>
          <button onClick={this.joinToDiscussion.bind(this)}  type='button' className='btn btn-success discussion-join-btn m-x-1'>Join</button>
          <h4 className='card-title'>{name}</h4>
          <div className='my-discussion-labels'>
            {(isPrivate) ? <span className='label label-warning'>Private</span> : <span className='label label-primary'>Public</span>}
            {(isLimited) ? <span className='label label-info'>Limited</span> : null}
          </div>
          <p className='card-text'><small className='text-muted'>Description: </small>{description}</p>
          <p className='card-text'><small className='text-muted'>Time to expiry: </small>{moment.duration(moment.unix(limitedTime).diff(moment())).humanize()}</p>
          <p className='card-text'><small className='text-muted'>Type: </small>{type_name}</p>
          <p className='card-text tag-labels'><small className='text-muted'>Tags: </small>{tags.map((tag, index) => {
            return <span key={index} className='label label-default'>{tag}</span>
          })}</p>
        </div>
    )
  }
}

export default DiscussionCard
