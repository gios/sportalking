import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../actions/loginAction'
import { signUpUser } from '../actions/signUpAction'
import LoginMenu from '../components/login/LoginMenu'
import LoginForm from '../components/login/LoginForm'
import SignUpForm from '../components/login/SignUpForm'
import ErrorMessage from '../components/helpers/ErrorMessage'
import IntroLogo from '../components/parts/IntroLogo'
import Footer from '../components/parts/Footer'
import Navbar from '../components/parts/Navbar'

class Login extends Component {

  render() {
    let { dispatch, pathname, errorMessage, incorrectUsername, incorrectEmail, incorrectPassword } = this.props
    let inputErrors = { incorrectUsername, incorrectEmail, incorrectPassword }
    let errorComponent

    let loginFromSelector = () => {
      if (pathname === '/login') {
        return <LoginForm dispatch={dispatch}
                          inputErrors={inputErrors}
                          onClickLogin={creds => dispatch(loginUser(creds))}/>
      } else {
        return <SignUpForm dispatch={dispatch}
                           inputErrors={inputErrors}
                           onClickSignUp={creds => dispatch(signUpUser(creds))}/>
      }
    }

    if (errorMessage) {
      errorComponent = <ErrorMessage message={errorMessage}/>
    }

    return (
      <div>
        <div className='background-wrapper img-responsive'></div>
        <Navbar/>
        <IntroLogo/>
        <div className='login-block card card-block col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-xl-4 col-xl-offset-4'>
          <LoginMenu active={pathname}/>
          <hr className='col-xs-11 col-md-11'/>
          {errorComponent}
          <div className='col-sm-12 col-md-12 col-xl-12'>
            {loginFromSelector()}
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}

function inject(state, ownProps) {
  return {
    pathname: ownProps.location.pathname,
    errorMessage: state.login.auth.get('errorMessage'),
    incorrectUsername: state.login.authErrors.get('usernameError').toJS(),
    incorrectEmail: state.login.authErrors.get('emailError').toJS(),
    incorrectPassword: state.login.authErrors.get('passwordError').toJS()
  }
}

export default connect(inject)(Login)
