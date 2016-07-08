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
      <DropModal ref='privateDiscussionModal' className='text-xs-center'>
        <div className='modal-header'>
          <h4 className='modal-title'>This discussion is protected </h4>
        </div>
        <form onSubmit={this.discussionPasswordSubmit.bind(this)}>
          <div className='modal-body'>
            <small className='text-muted'>This discussion is protected, please enter appropriate password.</small>
            <input type='password' className='form-control' placeholder='Password' ref='passwordRef'></input>
          </div>
          <div className='modal-footer'>
            <button type='submit' className='btn btn-success'>Apply</button>
            <button onClick={() => this.props.redirectToBase()} type='button' className='btn btn-primary'>To Dash</button>
          </div>
        </form>
      </DropModal>
    )
  }
}

export default DiscussionPasswordModal
