import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { UPDATE_AUTH_STATUS } from '../../store/queries'

export default class Login extends Component {
  componentDidMount () {
    this.storeUser()
  }

  storeUser (authStatus) {
    return authStatus()
    // .then(() => this.props.history.push('/'))
    // .catch(() => this.props.history.push('/'))
  }

  render () {
    const { history } = this.props
    const token = new window.URLSearchParams(history.location.search).get('token')
    const _id = new window.URLSearchParams(history.location.search).get('id')

    return <Mutation
      mutation={UPDATE_AUTH_STATUS}
      children={authStatus => <div
        onLoadStart={(this.storeUser = this.storeUser.bind(this, authStatus))}
      />}
      variables={{ token, _id }}
    />
  }
}
