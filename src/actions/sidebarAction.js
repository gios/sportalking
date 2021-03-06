import { CALL_API } from 'redux-api-middleware'
import { idToken } from '../utils/helpers'

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const MOBILE_SIDEBAR = 'MOBILE_SIDEBAR'
export const CLIENT_HEIGHT = 'CLIENT_HEIGHT'
export const CLIENT_WIDTH = 'CLIENT_WIDTH'

export const REQUEST_USER_INFO = 'REQUEST_USER_INFO'
export const SUCCESS_USER_INFO = 'SUCCESS_USER_INFO'
export const FAILURE_USER_INFO = 'FAILURE_USER_INFO'

export const REQUEST_SIDEBAR_TYPES = 'REQUEST_SIDEBAR_TYPES'
export const SUCCESS_SIDEBAR_TYPES = 'SUCCESS_SIDEBAR_TYPES'
export const FAILURE_SIDEBAR_TYPES = 'FAILURE_SIDEBAR_TYPES'

export function setClientHeight(clientHeight) {
  return {
    type: CLIENT_HEIGHT,
    clientHeight
  }
}

export function setClientWidth(clientWidth) {
  return {
    type: CLIENT_WIDTH,
    clientWidth
  }
}

export function toggleSidebar(toggle) {
  return {
    type: TOGGLE_SIDEBAR,
    toggle
  }
}

export function setMobileSidebar(mobile) {
  return {
    type: MOBILE_SIDEBAR,
    mobile
  }
}

export function getUserData() {
  return {
    [CALL_API]: {
      endpoint: '/api/user',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${idToken.getToken()}` },
      types: [REQUEST_USER_INFO, SUCCESS_USER_INFO, FAILURE_USER_INFO]
    }
  }
}

export function getSidebarTypes() {
  return {
    [CALL_API]: {
      endpoint: '/api/discussions/get_types',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${idToken.getToken()}` },
      types: [REQUEST_SIDEBAR_TYPES, SUCCESS_SIDEBAR_TYPES, FAILURE_SIDEBAR_TYPES]
    }
  }
}