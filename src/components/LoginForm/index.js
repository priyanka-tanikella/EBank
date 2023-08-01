import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {userId: '', pin: '', errorMsg: '', showLoginFailureError: false}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({errorMsg, showLoginFailureError: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state

    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    console.log(options)
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  renderUserIdInput = () => {
    const {userId} = this.state
    return (
      <>
        <label className="label" htmlFor="user-id">
          User ID
        </label>
        <br />
        <input
          id="user-id"
          type="text"
          className="input"
          placeholder="Enter User ID"
          onChange={this.onChangeUserId}
          value={userId}
        />
      </>
    )
  }

  renderPinInput = () => {
    const {pin} = this.state
    return (
      <>
        <label className="label" htmlFor="pin">
          PIN
        </label>
        <br />
        <input
          id="pin"
          type="password"
          className="input"
          placeholder="Enter PIN"
          onChange={this.onChangePin}
          value={pin}
        />
      </>
    )
  }

  render() {
    const {errorMsg, showLoginFailureError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <div className="login-image-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-img"
          />

          <form className="form-container" onSubmit={this.onSubmitForm}>
            <h1 className="heading">Welcome Back!</h1>
            {this.renderUserIdInput()}
            <br />
            {this.renderPinInput()}
            <button type="submit" className="login-btn">
              Login
            </button>
            {showLoginFailureError ? (
              <p className="error-msg">{errorMsg} </p>
            ) : (
              ''
            )}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginForm
