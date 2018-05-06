import React from 'react'
import PropTypes from 'prop-types'
import Hero from '../Hero'

export default function Home (props) {
  return <div>
    <Hero user={props.user} history={props.history} />
  </div>
}

Home.propTypes = {
  user: PropTypes.shape(),
  history: PropTypes.shape().isRequired
}
