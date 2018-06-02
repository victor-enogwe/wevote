import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { UPDATE_AUTH_STATUS } from '../../store/mutations'

class LoginPage extends Component {
  componentDidMount () {
    const { history, mutate } = this.props
    const token = new window.URLSearchParams(history.location.search)
      .get('token')
    const _id = token
      ? JSON.parse(window.atob(token.split('.')[1]))._id : 'guest'

    return mutate({ variables: { token, _id } })
      .then(() => history.push('/'))
  }

  render = () => null
}

export default graphql(UPDATE_AUTH_STATUS)(withRouter(LoginPage))
