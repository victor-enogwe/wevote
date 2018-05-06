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
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import FirstPageIcon from 'material-ui-icons/FirstPage'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import Card, { CardContent } from 'material-ui/Card'
import ClearIcon from 'material-ui-icons/Clear'
import LastPageIcon from 'material-ui-icons/LastPage'
import BottomNav from '../BottomNav'
import { GET_REQUESTS, DELETE_REQUEST_BY_ID } from '../../store/queries'

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

class RequestsPage extends React.Component {
  state = {
    filter: { creatorId: this.props.user._id },
    page: 0,
    rowsPerPage: 13,
    sort: 'DATE_DESC'
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

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

  formatDate (timestamp) {
    const date = new Date(timestamp)

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
  }

  handleChangePage = (event, page) => {
    this.setState(prevState => ({ ...prevState, page }))
  };

  handleChangeRowsPerPage = event => {
    this.setState(prevState => ({ ...prevState, rowsPerPage: event.target.value }))
  };

  removeRequest = async (_id, removeRequest, refetch) => {
    await removeRequest({ variables: { _id } })
    await refetch()
  }

  render () {
    const { classes, user } = this.props
    const { rowsPerPage, page, filter, sort } = this.state

    return (
      <Query
        query={GET_REQUESTS}
        variables={{ filter, page: page + 1, limit: rowsPerPage, sort }}
        pollInterval={user ? 1000 : 0}
        children={({ data = {}, loading, refetch }) => {
          const requests = Object.keys(data).length > 0 ? data.RequestPagination.items : []
          const count = Object.keys(data).length > 0 ? data.RequestPagination.count : 0
          const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage)
          const RequestComponents = requests.map(request => {
            const loanedToMe = request.bookDetails.lendingDetails.loanedTo === user._id
              ? 'LOANED TO ME' : 'PENDING APPROVAL'

            return (
              <TableRow key={request._id}>
                <TableCell>{request.bookDetails.title}</TableCell>
                <TableCell>{this.formatDate(request.createdAt)}</TableCell>
                <TableCell>{request.bookDetails.lendingDetails.status}</TableCell>
                <TableCell>{loanedToMe}</TableCell>
                <TableCell>
                  <Mutation
                    mutation={DELETE_REQUEST_BY_ID}
                    variables={{ _id: request._id }}
                    children={(removeRequest, { data = {}, loading }) => {
                      return <Button
                        color='secondary'
                        className={classes.button}
                        aria-label='disapprove request'
                        onClick={this.removeRequest
                          .bind(null, request._id, removeRequest, refetch)}
                        disabled={loading}
                      >
                        {loanedToMe === 'LOANED TO ME' ? 'MARK BOOK AS RETURNED' : 'DELETE REQUEST'}
                      </Button>
                    }} />
                </TableCell>
              </TableRow>
            )
          })

          return <div>
            <div className={classes.root}>
              <Grid
                container
                spacing={8}
                className={classes.grid}
                style={{ height: user ? 'calc(78.8vh)' : 'calc(92vh - 12px)' }}
              >
                <Grid item xs={12}>
                  <Loader
                    show={loading}
                    message={'please wait.'}
                  >
                    <Card>
                      <CardContent>
                        <div className={classes.tableWrapper}>
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableTitle}>Requested Book</TableCell>
                                <TableCell>Date(year-month-day)</TableCell>
                                <TableCell>Book Status</TableCell>
                                <TableCell>Request Status</TableCell>
                                <TableCell>Action</TableCell>
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
                      </CardContent>
                    </Card>
                  </Loader>
                </Grid>
              </Grid>
            </div>
            <BottomNav history={this.props.history} user={user} />
          </div>
        }}
      />
    )
  }
}

export default withStyles(RequestsPage.styles)(RequestsPage)
