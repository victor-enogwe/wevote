import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import compose from 'recompose/compose'
// import Hidden from 'material-ui/Hidden'
import Button from 'material-ui/Button'
import withWidth from 'material-ui/utils/withWidth'
import { heroStyles } from '../data/styles'

function Hero (props) {
  return <div className={props.classes.hero}>
    <div className={props.classes.heroText}>
      <h2 className={props.classes.title}>
        Great societies don't just happen.
        Good leaders make it happen.
      </h2>
      <p className={props.classes.subHeading}>
        Let's vote them.
      </p>
      <Button
        variant='raised'
        color='secondary'
        className={props.classes.cta}
        onClick={() => props.history.push('/vri')}
      >
          GET VOTER READY
      </Button>
    </div>
    {/* <Hidden only={['xs', 'sm']} /> */}
  </div>
}

Hero.propTypes = {
  history: PropTypes.shape().isRequired
}

export default compose(withStyles(heroStyles), withWidth(), withRouter)(Hero)
