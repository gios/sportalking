import { combineReducers } from 'redux'
import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
  REQUEST_GET_DISCUSSION,
  SUCCESS_GET_DISCUSSION,
  FAILURE_GET_DISCUSSION,
  REQUEST_GET_DISCUSSION_MESSAGES,
  SUCCESS_GET_DISCUSSION_MESSAGES,
  FAILURE_GET_DISCUSSION_MESSAGES,
  REQUEST_DELETE_DISCUSSION,
  SUCCESS_DELETE_DISCUSSION,
  FAILURE_DELETE_DISCUSSION,
  REQUEST_SEARCH_USERS_INVITE,
  SUCCESS_SEARCH_USERS_INVITE,
  FAILURE_SEARCH_USERS_INVITE,
  GET_CONNECTED_USERS,
  SET_CHAT_MESSAGE,
  SET_SENT_MESSAGE_ARCHIVE,
  SET_MESSAGE_ARCHIVE,
  CLEAR_MESSAGE_ARCHIVE,
  SCROLL_TO_BOTTOM,
  START_LOAD_MESSAGES,
  END_LOAD_MESSAGES,
  LOAD_DISABLE_MESSAGES,
  DISCUSSION_USERS_INVITE,
  TOGGLE_EMOJI_POPUP,
  USER_TYPING_MESSAGE,
  REMOVE_USER_TYPING_MESSAGE } from '../actions/discussionAction'

const discussionDeleteState = Immutable.Map({
  isFetching: false,
  payload: null,
  error: false
})

function discussionDelete(state = discussionDeleteState, action) {
  switch (action.type) {
    case REQUEST_DELETE_DISCUSSION:
      return state.merge({
        isFetching: true,
        payload: null,
        error: false
      })
    case SUCCESS_DELETE_DISCUSSION:
      return state.merge({
        isFetching: false,
        payload: action.payload,
        error: false
      })
    case FAILURE_DELETE_DISCUSSION:
      return state.merge({
        isFetching: false,
        payload: action.payload.response,
        error: true
      })
    default:
      return state
  }
}

const discussionInfoState = Immutable.Map({
  isFetching: false,
  payload: null,
  error: false,
  connectedUsers: null,
  usersInvite: []
})

function discussionInfo(state = discussionInfoState, action) {
  switch (action.type) {
    case REQUEST_GET_DISCUSSION:
      return state.merge({
        isFetching: true,
        payload: null,
        error: false
      })
    case SUCCESS_GET_DISCUSSION:
      return state.merge({
        isFetching: false,
        payload: action.payload,
        error: false
      })
    case FAILURE_GET_DISCUSSION:
      return state.merge({
        isFetching: false,
        payload: action.payload.response,
        error: true
      })
    case GET_CONNECTED_USERS:
      return state.merge({
        connectedUsers: action.connectedUsers
      })
    case DISCUSSION_USERS_INVITE:
      return state.merge({
        usersInvite: action.usersInvite
      })
    case LOCATION_CHANGE:
      return state.merge({
        payload: null
      })
    default:
      return state
  }
}

const searchUsersState = Immutable.Map({
  isFetching: false,
  payload: null,
  error: false
})

function searchUsers(state = searchUsersState, action) {
  switch (action.type) {
    case REQUEST_SEARCH_USERS_INVITE:
      return state.merge({
        isFetching: true,
        payload: null,
        error: false
      })
    case SUCCESS_SEARCH_USERS_INVITE:
      return state.merge({
        isFetching: false,
        payload: action.payload,
        error: false
      })
    case FAILURE_SEARCH_USERS_INVITE:
      return state.merge({
        isFetching: false,
        payload: action.payload.response,
        error: true
      })
    default:
      return state
  }
}

const discussionMessagesState = Immutable.Map({
  isFetching: false,
  payload: null,
  error: false,
  chatMessage: '',
  messageArchive: Immutable.List.of(),
  scrollToBottom: false,
  startLoad: 0,
  endLoad: 100,
  loadDisable: false,
  emojiPopup: false,
  userTyping: Immutable.List.of()
})

function discussionMessages(state = discussionMessagesState, action) {
  switch (action.type) {
    case REQUEST_GET_DISCUSSION_MESSAGES:
      return state.merge({
        isFetching: true,
        payload: null,
        error: false
      })
    case SUCCESS_GET_DISCUSSION_MESSAGES:
      return state.merge({
        isFetching: false,
        payload: action.payload,
        error: false
      })
    case FAILURE_GET_DISCUSSION_MESSAGES:
      return state.merge({
        isFetching: false,
        payload: action.payload.response,
        error: true
      })
    case SET_CHAT_MESSAGE:
      return state.merge({
        chatMessage: action.chatMessage
      })
    case SET_SENT_MESSAGE_ARCHIVE:
      return state.merge({
        messageArchive: state.get('messageArchive').push(action.sentMessage)
      })
    case SET_MESSAGE_ARCHIVE:
      return state.merge({
        messageArchive: state.get('messageArchive').unshift(...action.messageArchive)
      })
    case CLEAR_MESSAGE_ARCHIVE:
      return state.merge({
        messageArchive: state.get('messageArchive').clear()
      })
    case SCROLL_TO_BOTTOM:
      return state.merge({
        scrollToBottom: action.scrollToBottom
      })
    case START_LOAD_MESSAGES:
      return state.merge({
        startLoad: action.startLoad
      })
    case END_LOAD_MESSAGES:
      return state.merge({
        endLoad: action.endLoad
      })
    case LOAD_DISABLE_MESSAGES:
      return state.merge({
        loadDisable: action.loadDisable
      })
    case LOCATION_CHANGE:
      return state.merge({
        messageArchive: state.get('messageArchive').clear()
      })
    case TOGGLE_EMOJI_POPUP:
      return state.merge({
        emojiPopup: !state.get('emojiPopup')
      })
    case USER_TYPING_MESSAGE:
      if(state.get('userTyping').includes(action.userTyping)) {
        return state
      }
      return state.merge({
        userTyping: state.get('userTyping').push(action.userTyping)
      })
    case REMOVE_USER_TYPING_MESSAGE:
      return state.merge({
        userTyping: state.get('userTyping').delete(state.get('userTyping').findIndex(username => {
          return username === action.username
        }))
      })
    default:
      return state
  }
}

export let discussion = combineReducers({
  discussionInfo,
  discussionDelete,
  discussionMessages,
  searchUsers
})