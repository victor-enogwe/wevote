import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { UPDATE_AUTH_STATUS } from '../../store/mutations'

export default class Login extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    setAuthState: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.storeUser()
  }

  storeUser (updateAuth, _id) {
    return updateAuth()
      .then(() => this.props.setAuthState({ _id, skipUserQuery: false }))
      .then(() => this.props.setAuthState({ skipUserQuery: true }))
      .then(() => this.props.history.push('/'))
      .catch(() => this.props.history.push('/'))
  }

  render () {
    const { history } = this.props
    const token = new window.URLSearchParams(history.location.search)
      .get('token')
    const _id = token ? JSON.parse(window.atob(token.split('.')[1]))._id : null

    return <Mutation
      mutation={UPDATE_AUTH_STATUS}
      children={updateAuth => <div
        onLoadStart={
          (this.storeUser = this.storeUser.bind(this, updateAuth, _id))
        }
      />}
      variables={{ token, _id }}
    />
  }
}
