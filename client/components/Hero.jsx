import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import compose from 'recompose/compose'
// import Hidden from 'material-ui/Hidden'
import Button from 'material-ui/Button'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
  hero: {
    backgroundColor: theme.palette.primary.main,
    height: 'calc(80vh - 15px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'row wrap'
  },
  heroText: {
    height: 'auto',
    padding: theme.spacing.unit * 2,
    maxWidth: '400px',
    flex: '1 16%'
  },
  heroBook: {
    height: '50vh',
    maxWidth: '400px',
    padding: theme.spacing.unit * 2,
    flex: '1 16%'
  },
  title: {
    ...theme.typography.headline,
    fontWeight: 900,
    color: '#FFFFFF'
  },
  subHeading: {
    ...theme.typography.subheading,
    color: '#FFFFFF'
  },
  cta: {

  }
})

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

export default compose(withStyles(styles), withWidth(), withRouter)(Hero)
