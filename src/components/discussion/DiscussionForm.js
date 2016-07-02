import React, { Component } from 'react'
import { NotificationManager } from 'react-notifications'
import moment from 'moment'
import DiscussionExpiredTimer from './DiscussionExpiredTimer'
import DiscussionChatMessages from './DiscussionChatMessages'
import Select from 'react-select'
import { ENTER_KEYCODE, MESSAGE_INTERVAL } from '../../constants'
import { trimField } from '../../utils/helpers'
import Loader from '../parts/Loader'
import ReactEmoji from 'react-emoji'
import EmojiPicker from 'react-emoji-picker'
import ContentEditable from 'react-contenteditable'

class DiscussionForm extends Component {

  constructor(props) {
    super(props)
    this.emojify = ReactEmoji.emojify.bind(this)
    this.state = {
      show: false
    }
  }

  componentWillMount() {
    let { discussionId, discussionInfo } = this.props

    if(!discussionInfo.payload || discussionInfo.payload.id !== discussionId) {
      this.props.onJoinDiscussion({ id: discussionId })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.discussionId !== nextProps.discussionId) {
      setTimeout(() => {
        this.props.onJoinDiscussion({ id: nextProps.discussionId })
      })
    }
  }

  componentDidMount() {
    this.refs.addMessage.htmlEl.focus()
  }

  loadDiscussionMessages() {
    let { discussionId, discussionMessages, setLoadDisableMessages } = this.props

    return this.props.getDiscussionMessages(discussionId, discussionMessages.startLoad, discussionMessages.endLoad).then(status => {
      if(status.error) {
        NotificationManager.error(status.payload.response.message)
        return
      }

      if(status.payload.length < MESSAGE_INTERVAL) {
        setLoadDisableMessages(true)
      } else {
        setLoadDisableMessages(false)
      }
      this.props.setMessageArchive(status.payload)
    }).catch(err => {
      NotificationManager.error(err.message)
      setLoadDisableMessages(true)
    })
  }

  componentWillUnmount() {
    let { socket, discussionId, user, clearMessageArchive, setStartLoadMessages, setEndLoadMessages } = this.props
    setStartLoadMessages(0)
    setEndLoadMessages(MESSAGE_INTERVAL)
    clearMessageArchive()
    socket.emit('leave discussion', { discussionId, username: user.payload.username })
    socket.removeListener('leave discussion')
    socket.removeListener('join discussion')
    socket.removeListener('connected users')
    socket.removeListener('invite users')
  }

  changeChatMessage(e) {
    let { discussionMessages } = this.props
    let message = e.currentTarget.textContent

    if(this.validateMessage(message) || discussionMessages.chatMessage.length) {
      this.props.setChatMessage(message)
      this.props.setScrollToBottom(false)
    }
  }

  sendMessage(e) {
    let message = this.refs.addMessage.htmlEl.textContent
    let { socket, discussionId, user, setChatMessage } = this.props

    if((!e.which || e.ctrlKey && e.which === ENTER_KEYCODE) && this.validateMessage(message)) {
      e.preventDefault()
      socket.emit('chat message', message, discussionId, user.payload)
      setChatMessage('')
      this.refs.addMessage.htmlEl.focus()
    }
  }

  validateMessage(message) {
    return !(trimField(message) === '')
  }

  loadingSelect(type) {
    if(type.isFetching) {
       return true
    } else if(type.payload) {
       return false
    }
  }

  selectUsers(usersInvite) {
    let { discussionInfo, discussionUsersInvite, setScrollToBottom } = this.props

    if(discussionInfo.usersInvite.length <= 4) {
      discussionUsersInvite(usersInvite)
      setScrollToBottom(false)
    }
  }

  inputUsersInvite(query) {
    this.props.getSearchUsers(query.trim())
    this.props.setScrollToBottom(false)
  }

  inviteUsers() {
    let usersForInviteString = ''
    let { user, discussionId, discussionInfo, socket, discussionUsersInvite } = this.props
    socket.emit('invite users', discussionInfo.usersInvite, parseInt(discussionId), user.payload.id)
    let usersForInvite = discussionInfo.usersInvite.map(item => item.value)
    usersForInvite.forEach((item, index) => {
      let value = ''
      value += item

      if(index !== usersForInvite.length - 1) {
        value += ', '
      }
      usersForInviteString += value
    })

    NotificationManager.success(`To: ${usersForInviteString}`, 'Your invitations have successfully sent')
    discussionUsersInvite([])
  }

  renderUsersSelect() {
    let { discussionInfo, searchUsers } = this.props
    let isLoading = this.loadingSelect(searchUsers)

    return (
      <Select isLoading={isLoading}
              noResultsText={'User not found'}
              onChange={this.selectUsers.bind(this)}
              onInputChange={this.inputUsersInvite.bind(this)}
              value={discussionInfo.usersInvite}
              multi={true}
              options={searchUsers.payload}/>
    )
  }

  emojiSelectOpen() {
    this.setState({show: true})
  }

  setEmoji(emoji) {
    let { discussionMessages, setChatMessage } = this.props
    setChatMessage(discussionMessages.chatMessage + emoji)
    this.refs.addMessage.htmlEl.focus()
  }

  render() {
    let { discussionInfo, clientHeight, discussionMessages, user } = this.props
    let emojiOptions = {
      attributes: {
        width: '25px',
        height: '25px',
        onMouseOver: this.emojiSelectOpen.bind(this)
      }
    }
    let discussionInfoRender

    if(discussionInfo.isFetching) {
      discussionInfoRender = <Loader size={2}/>
    } else if(discussionInfo.payload) {
      discussionInfoRender = (
        <ul className='list-group'>
          <a className='online-users-chat' data-toggle='collapse' href='#online-users' aria-expanded='false' aria-controls='online-users'>
            <li className='list-group-item m-b-1'>
              <strong>Connected Users:</strong>
              <span className='label label-default label-pill pull-xs-right'>{discussionInfo.connectedUsers && discussionInfo.connectedUsers.length}</span>
            </li>
          </a>
          <div className='collapse' id='online-users'>
            <div className='card card-block'>
              <ul className='list-group'>
                  {discussionInfo.connectedUsers && discussionInfo.connectedUsers.users.map(user => {
                    return (
                      <li key={user.index} className='list-group-item'>
                        <span className='label label-default pull-xs-right chat-user-label'>{user.email}</span>
                        {user.username}
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
          { (discussionInfo.payload && discussionInfo.payload.username) === (user.payload && user.payload.username) &&
            <div>
              <a className='online-users-chat' data-toggle='collapse' href='#invite-users' aria-expanded='false' aria-controls='invite-users'>
                <li className='list-group-item m-b-1'>
                  <strong>Invite Users:</strong>
                  <i className='fa fa-arrow-down pull-xs-right' aria-hidden='true'></i>
                </li>
              </a>
              <div className='collapse' id='invite-users'>
                <div className='card card-block'>
                  {this.renderUsersSelect()}
                  <button type='button'
                          className='btn btn-primary btn-sm m-t-1'
                          onClick={this.inviteUsers.bind(this)}>Invite</button>
                  {discussionInfo.errorUsersInvite &&
                    <div className='pull-xs-right m-t-1 error-users-invite'>
                      <span>{discussionInfo.errorUsersInvite.message}:</span><br/>
                      <span>{discussionInfo.errorUsersInvite.users.map(user => `${user} `)}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
          <li className='list-group-item'>
            <strong>Name:</strong>
            <div className='chat-info-description'>{discussionInfo.payload.name}</div>
          </li>
          <li className='list-group-item'>
            <strong>Description:</strong>
            <div className='chat-info-description'>{discussionInfo.payload.description}</div>
          </li>
          <li className='list-group-item'>
            <strong>Created At:</strong>
            <div className='pull-xs-right'>{moment(discussionInfo.payload.created_at).format('DD MMM YYYY H:mm:ss')}</div>
          </li>
          <li className='list-group-item'>
            <strong>Creator:</strong>
            <div className='pull-xs-right'>{discussionInfo.payload.username}</div>
          </li>
          <li className='list-group-item'>
            <strong>Type:</strong>
            <div className='pull-xs-right'>{discussionInfo.payload.type_name}</div>
          </li>
          <li className='list-group-item'>
            <strong>Attributes:</strong>
            <div className='my-discussion-labels pull-xs-right'>
              {(discussionInfo.payload.is_private)
                ? <span className='label label-warning'>Private</span>
                : <span className='label label-primary'>Public</span>}
              {(discussionInfo.payload.is_limited)
                ? <span className='label label-info'>Limited</span>
                : null}
            </div>
          </li>
          <li className='list-group-item'>
            <strong>Tags:</strong>
            <div className='tag-labels pull-xs-right'>
              {discussionInfo.payload.tags && discussionInfo.payload.tags.map((tag, index) => {
                return <span key={index} className='label label-default'>{tag}</span>
              })}
            </div>
          </li>
          <DiscussionExpiredTimer discussionInfo={discussionInfo}/>
        </ul>
      )
    }

    return (
      <div>
        <div className='col-sm-8'>
          <form>
            <fieldset className='form-group chat-area'>
              <DiscussionChatMessages clientHeight={clientHeight}
                                      setStartLoadMessages={this.props.setStartLoadMessages}
                                      setEndLoadMessages={this.props.setEndLoadMessages}
                                      loadDiscussionMessages={this.loadDiscussionMessages.bind(this)}
                                      discussionMessages={discussionMessages}
                                      setScrollToBottom={this.props.setScrollToBottom}/>
              {this.state.show && <EmojiPicker onSelect={this.setEmoji.bind(this)}/>}
              <div className='chat-emoji-icon'>
                <small className='text-muted'>Emoji Selector </small>
                {this.emojify(':)', emojiOptions)}
              </div>
              <ContentEditable className='form-control chat-message'
                               ref='addMessage'
                               placeholder='Write something'
                               onKeyDown={this.sendMessage.bind(this)}
                               onChange={this.changeChatMessage.bind(this)}
                               html={discussionMessages.chatMessage}/>
              <span className='pull-xs-right m-t-1'>Press <kbd>Ctrl + Enter</kbd> for send message.</span>
              <button type='button'
                      className='btn btn-primary pull-xs-left m-t-1'
                      onClick={this.sendMessage.bind(this)}>Send</button>
            </fieldset>
          </form>
        </div>
        <div className='col-sm-4'>
          {discussionInfoRender}
        </div>
      </div>
    )
  }
}

export default DiscussionForm
