import React, { Component } from 'react'
import moment from 'moment'
import { DOMtoArray } from '../../utils/helpers'

class LoginForm extends Component {

  componentWillMount() {
    let tooltips = document.querySelectorAll('.tooltip')
    DOMtoArray(tooltips).map(elem => elem.remove())
  }

  loginEvent(e) {
    e.preventDefault()
    let emailInput = this.refs.loginEmail
    let passwordInput = this.refs.loginPassword

    if (this.validateFields(emailInput, passwordInput)) {
      this.props.onClickLogin({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        gmt: moment().utcOffset()
      })
    }
  }

  validateFields(emailInput, passwordInput) {
    let isValidEmail = this.validateEmail(emailInput.value)
    let isValidPassword = this.validatePassword(passwordInput.value)
    let loginInputs = document.querySelectorAll('.form-control')
    let { emitEmailError, emitPasswordError } = this.props

    if(!isValidEmail) {
      emitEmailError(true)
      setTimeout(() => $(emailInput).tooltip('show'))
      emailInput.classList.add('input-incorrect')
    } else {
      emitEmailError(false)
      setTimeout(() => $(emailInput).tooltip('hide'))
      emailInput.classList.remove('input-incorrect')
    }

    if(!isValidPassword) {
      emitPasswordError(true)
      setTimeout(() => $(passwordInput).tooltip('show'))
      passwordInput.classList.add('input-incorrect')
    } else {
      emitPasswordError(false)
      setTimeout(() => $(passwordInput).tooltip('hide'))
      passwordInput.classList.remove('input-incorrect')
    }

    return DOMtoArray(loginInputs).every(elem => !elem.classList.contains('input-incorrect'))
  }

  validateEmail(email) {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email)
  }

  validatePassword(password) {
    return (password.length >= 6) ? true : false
  }

  render() {
    let { incorrectEmailObj, incorrectPasswordObj } = this.props.inputErrors
    let { auth } = this.props
    return (
      <form onSubmit={this.loginEvent.bind(this)} noValidate>
        <div className='form-group row'>
          <div className='col-xs-12 col-md-8 col-md-offset-2'>
            <input type='email' className='form-control' placeholder='Email' ref='loginEmail'
            data-toggle='tooltip' data-html='true' data-trigger='manual' data-placement='right'
            data-original-title={incorrectEmailObj.message}/>
          </div>
        </div>
        <div className='form-group row'>
          <div className='col-xs-12 col-md-8 col-md-offset-2'>
            <input type='password' className='form-control' placeholder='Password' ref='loginPassword'
            data-toggle='tooltip' data-html='true' data-trigger='manual' data-placement='right'
            data-original-title={incorrectPasswordObj.message}/>
          </div>
        </div>
        <div className='form-group row'>
          <div className='col-xs-12 col-md-8 col-md-offset-2'>
            <button type='submit' className='btn btn-success col-xs-12 col-md-12' disabled={auth.isFetching ? true : false}>Login</button>
          </div>
        </div>
        <div className='form-group row'>
          <div className='text-xs-center col-xs-8 col-xs-offset-2 col-md-8 col-md-offset-2'>
            <a href='javascript:void(0)' className='forgot-password'><abbr title='What happend, you forgot your password?'>Frogot password?</abbr></a>
          </div>
        </div>
      </form>
    )
  }
}

export default LoginForm
