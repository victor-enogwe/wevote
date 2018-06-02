import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Hero from '../Hero'

const HomePage = props => (<div>
  <Hero user={props.user} history={props.history} />
</div>)

HomePage.propTypes = {
  user: PropTypes.shape(),
  history: PropTypes.shape().isRequired
}

export default withRouter(HomePage)
