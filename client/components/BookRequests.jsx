import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import Card, { CardContent } from 'material-ui/Card'
import RequestsTable from './RequestsTable'

class BookRequests extends Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    refetchBook: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    book: PropTypes.object.isRequired
  }

  render () {
    const { refetchBook, user, book, history } = this.props

    return <Grid item xs={12} md={8}>
      <Card>
        <CardContent>
          <RequestsTable
            history={history}
            book={book}
            user={user}
            filter={{ bookId: book._id }}
            limit={5}
            page={1}
            sort='DATE_DESC'
            refetchBook={refetchBook}
          />
        </CardContent>
      </Card>
    </Grid>
  }
}

export default BookRequests
