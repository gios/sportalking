import React, { Component } from 'react'
import { DropModal } from 'boron'

class DiscussionPasswordModal extends Component {

  discussionPasswordSubmit(e) {
    e.preventDefault()
    let { discussionId } = this.props
    this.props.onJoinDiscussion({ id: discussionId, password: this.refs.passwordRef.value })
    this.refs.privateDiscussionModal.hide()
  }

  render() {
    return (
      <DropModal ref='privateDiscussionModal'>
        <div className='modal-header'>
          <h4 className='modal-title text-xs-center'>This discussion is protected </h4>
        </div>
        <form onSubmit={this.discussionPasswordSubmit.bind(this)}>
          <div className='modal-body'>
            <small className='text-muted'>This discussion is protected, please enter appropriate password.</small>
            <input type='password' className='form-control' placeholder='Password' ref='passwordRef'></input>
          </div>
          <div className='modal-footer'>
            <button type='submit' className='btn btn-primary'>Apply</button>
          </div>
        </form>
      </DropModal>
    )
  }
}

export default DiscussionPasswordModal
