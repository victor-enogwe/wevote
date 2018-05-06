import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Query, Mutation } from 'react-apollo'
import Loader from 'react-loader-advanced'
import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import FirstPageIcon from 'material-ui-icons/FirstPage'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import CheckIcon from 'material-ui-icons/Check'
import ClearIcon from 'material-ui-icons/Clear'
import LastPageIcon from 'material-ui-icons/LastPage'
import { GET_REQUESTS, EDIT_BOOK } from '../store/queries'
import { omitTypeName } from '../store/resolvers'

class TablePaginationActions extends React.Component {
  static actionsStyles = theme => ({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing.unit * 2.5
    }
  })

  handleFirstPageButtonClick = event => this.props.onChangePage(event, 0)
  handleBackButtonClick = event => this.props.onChangePage(event, this.props.page - 1)
  handleNextButtonClick = event => this.props.onChangePage(event, this.props.page + 1)
  handleLastPageButtonClick = event => this.props.onChangePage(
    event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
  )

  render () {
    const { classes, count, page, rowsPerPage, theme } = this.props

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='First Page'
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label='Previous Page'
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Next Page'
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Last Page'
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    )
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const TablePaginationActionsWrapped = withStyles(
  TablePaginationActions.actionsStyles,
  { withTheme: true }
)(TablePaginationActions)

class RequestsTable extends React.Component {
  state = {
    filter: this.props.filter,
    page: this.props.page - 1,
    rowsPerPage: this.props.limit,
    sort: this.props.sort
  }
  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    book: PropTypes.object.isRequired,
    limit: PropTypes.number.isRequired,
    filter: PropTypes.object.isRequired,
    sort: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    refetchBook: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  static styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3
    },
    table: {
      minWidth: 500
    },
    tableWrapper: {
      overflowX: 'auto'
    },
    tableTitle: {
      fontWeight: 900,
      fontSize: 18
    }
  })

  handleChangePage = (event, page) => {
    this.setState(prevState => ({ ...prevState, page }))
  };

  handleChangeRowsPerPage = event => {
    this.setState(prevState => ({ ...prevState, rowsPerPage: event.target.value }))
  };

  updateLoanedTo = async (id, updateLend, refetch, refetchBook) => {
    const { book } = this.props
    const { creator, ...update } = book
    await updateLend({ variables: { book: omitTypeName({
      ...update,
      lendingDetails: {
        ...update.lendingDetails,
        status: id ? 'LENT' : 'AVAILABLE',
        loanedTo: id
      } }) } })
    await refetch()
    await refetchBook()
  }

  render () {
    const { classes, user, refetchBook, book } = this.props
    const { rowsPerPage, page, filter, sort } = this.state
    const { creator, ...update } = book

    return (
      <Query
        query={GET_REQUESTS}
        variables={{ filter, page: page + 1, limit: rowsPerPage, sort }}
        pollInterval={user ? 1000 : 0}
        className={classes.root}
        children={({ data = {}, loading, refetch }) => {
          const requests = Object.keys(data).length > 0 ? data.RequestPagination.items : []
          const count = Object.keys(data).length > 0 ? data.RequestPagination.count : 0
          const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage)
          const RequestComponents = requests.map(request => {
            return (
              <TableRow key={request._id}>
                <TableCell>{request.creatorDetails.displayName.split(' ')[0]}</TableCell>
                <TableCell>{request.creatorDetails.phone}</TableCell>
                <TableCell>{request.creatorDetails.emails[0].value}</TableCell>
                <TableCell>
                  {!book.lendingDetails.loanedTo
                    ? <Mutation
                      mutation={EDIT_BOOK}
                      variables={{ book: omitTypeName(update) }}
                      children={(updateLend, { data = {}, error, variables, loading }) => {
                        return <IconButton
                          color='secondary'
                          className={classes.button}
                          aria-label='approve request'
                          onClick={this.updateLoanedTo
                            .bind(null, request.creatorDetails._id, updateLend, refetch, refetchBook)}
                          disabled={loading || book.lendingDetails.status === 'UNAVAILABLE' ||
                          (book.lendingDetails.loanedTo &&
                           book.lendingDetails.loanedTo !== request.creatorDetails._id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      }}
                    /> : <Mutation
                      mutation={EDIT_BOOK}
                      variables={{ book: omitTypeName(book) }}
                      children={(updateLend, { data = {}, error, variables, loading }) => {
                        return <IconButton
                          color='secondary'
                          className={classes.button}
                          aria-label='disapprove request'
                          onClick={this.updateLoanedTo
                            .bind(null, null, updateLend, refetch, refetchBook)}
                          disabled={loading || book.lendingDetails.status === 'UNAVAILABLE' ||
                          (book.lendingDetails.loanedTo &&
                        book.lendingDetails.loanedTo !== request.creatorDetails._id)}
                        >
                          <ClearIcon />
                        </IconButton>
                      }} />}
                </TableCell>
              </TableRow>
            )
          })

          return <Loader
            show={loading}
            message={'please wait.'}
          >
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableTitle}>Requests</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>{!book.lendingDetails.loanedTo ? 'Approve' : 'Revoke'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RequestComponents}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={3}
                      count={count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      Actions={TablePaginationActionsWrapped}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Loader>
        }}
      />
    )
  }
}

export default withStyles(RequestsTable.styles)(RequestsTable)
