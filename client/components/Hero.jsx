import React from 'react'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import compose from 'recompose/compose'
import Hidden from 'material-ui/Hidden'
import Button from 'material-ui/Button'
import withWidth from 'material-ui/utils/withWidth'
import { GET_ONE_BOOK } from '../store/queries'
import Grid from 'material-ui/Grid'
import Book from './Book'

const styles = theme => ({
  hero: {
    backgroundColor: theme.palette.primary.main,
    height: 'calc(100vh - 80px)',
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
  const grid = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12
  }
  return <Query
    query={GET_ONE_BOOK}
    variables={{ filter: { status: 'AVAILABLE' } }}
    children={({
      data: { BookFindOne: book } = { BookFindOne: null }, loading
    }) => <div className={props.classes.hero}>
      <div className={props.classes.heroText}>
        <h2 className={props.classes.title}>
          Lend Or Borrow Books.
        </h2>
        <p className={props.classes.subHeading}>
          real-time book lending platform.
        </p>
        <Button
          variant='raised'
          color='secondary'
          className={props.classes.cta}
          onClick={() => props.history.push('/books')}
        >
          FIND A BOOK
        </Button>
      </div>
      <Hidden only={['xs', 'sm']}>
        <div className={props.classes.heroBook}>
          {!loading ? (book
            ? <Grid container spacing={8} className={props.classes.grid}>
              <Book book={book} grid={grid} history={props.history} />
            </Grid>
            : null) : null}
        </div>
      </Hidden>
    </div>}
  />
}

Hero.propTypes = {
  history: PropTypes.shape().isRequired
}

export default compose(withStyles(styles), withWidth(), withRouter)(Hero)
