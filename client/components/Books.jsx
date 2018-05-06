import React, { Component } from 'react'
import withStyles from 'material-ui/styles/withStyles'
import { Query } from 'react-apollo'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import { Button } from 'material-ui'
import NextIcon from 'material-ui-icons/NavigateNext'
import PrevIcon from 'material-ui-icons/NavigateBefore'
import Book from './Book'
import { GET_MANY_BOOKS } from '../store/queries'
import BottomNav from './BottomNav'
import Filter from './Filter'

export class Books extends Component {
  state = {
    filter: this.props.filter,
    page: this.props.page,
    limit: this.props.limit,
    sort: this.props.sort
  }

  static styles = theme => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      height: 'calc(80vh)',
      flexGrow: 1,
      padding: theme.spacing.unit
    },
    grid: {
      height: 'calc(78.8vh)',
      overflowY: 'scroll'
    },
    bookGrid: {
      height: 'calc(78vh - 45px)',
      overflowY: 'scroll'
    },
    button: {
      margin: theme.spacing.unit,
      color: '#fff'
    },
    buttonGrid: {
      textAlign: 'center'
    },
    leftIcon: {
      marginRight: theme.spacing.unit
    },
    rightIcon: {
      marginLeft: theme.spacing.unit
    }
  })

  static propTypes = {
    user: PropTypes.object,
    limit: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    filter: PropTypes.shape().isRequired,
    sort: PropTypes.string.isRequired
  }

  loadMorePrevBooks = (value, count, refetch) => {
    const pages = count ? Math.round(count / this.state.limit) : 0
    const newPage = this.state.page + value

    if (newPage > 0 && pages >= newPage) {
      this.setState(prevState => ({ ...prevState, page: newPage }))

      return refetch()
    }
  }

  render () {
    const { classes, history, user } = this.props
    const { filter, page, limit, sort } = this.state
    const grid = { xs: 12, sm: 6, md: 4, lg: 3 }

    return <Query
      query={GET_MANY_BOOKS}
      variables={{ filter, page, limit, sort }}
      pollInterval={user ? 1000 : 0}
      children={({ data = {}, error, refetch, variables, loading }) => {
        const books = Object.keys(data).length > 0 ? data.BookPagination.items : []
        const count = Object.keys(data).length > 0 ? data.BookPagination.count : 0
        const pages = count ? Math.round(count / limit) : 0

        return <div>
          <div className={classes.root} style={{ height: user ? 'calc(80vh)' : 'calc(92vh - 4px)' }}>
            <Grid
              container
              spacing={8}
              className={classes.grid}
              style={{ height: user ? 'calc(78.8vh)' : 'calc(92vh - 12px)' }}
            >
              <Filter
                user={user}
                filter={refetch}
                filterArgs={{ filter, page, limit, sort }}
                history={history}
              />
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={8}
                  className={classes.bookGrid}
                  style={{ height: user ? 'calc(78vh - 45px)' : 'calc(92vh - 20px)' }}
                >
                  {books.map((book, index) => <Book
                    history={history}
                    key={index} book={book}
                    grid={grid}
                    user={user}
                  />)}
                </Grid>
              </Grid>
              {count ? <Grid item xs={12} className={classes.buttonGrid}>
                <Button
                  className={classes.button}
                  color='default'
                  disabled={page < 2 || loading}
                  onClick={() => this.loadMorePrevBooks(-1, count, refetch)}
                >
                  <PrevIcon className={classes.leftIcon} />
                LOAD PREVIOUS
                </Button>
                <Button
                  className={classes.button}
                  color='default'
                  disabled={page >= pages || loading}
                  onClick={() => this.loadMorePrevBooks(+1, count, refetch)}
                >
                LOAD MORE
                  <NextIcon className={classes.rightIcon} />
                </Button>
              </Grid> : null}
            </Grid>
          </div>
          {user ? <BottomNav history={history} user={user} /> : null}
        </div>
      }}
    />
  }
}

export default withStyles(Books.styles)(Books)
