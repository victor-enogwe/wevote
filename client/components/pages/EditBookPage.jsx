import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import Grid from 'material-ui/Grid'
import { Query } from 'react-apollo'
import Loader from 'react-loader-advanced'
import { GET_BOOK_BY_ID } from '../../store/queries'
import { omitTypeName } from '../../store/resolvers'
import BottomNav from '../BottomNav'
import EditBook from '../EditBook'
import EditLend from '../EditLend'
import BookRequests from '../BookRequests'

class EditBookPage extends Component {
  static styles = theme => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      height: 'calc(80vh)',
      flexGrow: 1,
      flexFlow: 'row wrap',
      overflowY: 'scroll',
      padding: theme.spacing.unit
    },
    grid: {
      height: 'calc(80vh)',
      overflowY: 'scroll'
    }
  })

  static propTypes = {
    user: PropTypes.shape().isRequired
  }

  render () {
    const {
      classes, user, history, history: { location: { pathname } }, client
    } = this.props

    return <div>
      <Query
        query={GET_BOOK_BY_ID}
        variables={{ _id: pathname.match(/\w+$/g)[0] }}
        pollInterval={user ? 1000 : 0}
        children={({ data: { BookFindById: book } = {}, error, refetch, variables, loading, load }) => {
          return <Loader
            show={loading}
            message={'please wait'}
          >
            <div className={classes.root}>
              <Grid container spacing={8} className={classes.grid}>
                {book ? <EditBook
                  client={client}
                  book={omitTypeName(book)}
                  history={history}
                  refetchBooks={refetch}
                /> : null}
                {book && book.lendingDetails ? <EditLend
                  book={book}
                  history={history}
                  refetchBooks={refetch}
                /> : null}
                {book && book.lendingDetails ? <BookRequests
                  user={user}
                  history={history}
                  refetchBook={refetch}
                  book={book}
                /> : null}
              </Grid>
            </div>
          </Loader>
        }}
      />
      <BottomNav history={history} user={user} />
    </div>
  }
}

export default withStyles(EditBookPage.styles)(EditBookPage)
