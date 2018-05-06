import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Loader from 'react-loader-advanced'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Dialog, { DialogActions, DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/DeleteForever'
import BookInputField from './BookInputField'
import Tooltip from 'material-ui/Tooltip'
import AddIcon from 'material-ui-icons/Add'
import { EDIT_BOOK, REMOVE_BOOK, GET_BOOK_BY_ID } from '../store/queries'
import { Snack } from '../index'
import LendBook from './LendBook'
import { omitTypeName } from '../store/resolvers'

class EditBook extends Component {
  state = {
    book: this.props.book,
    deleteDialogOpen: false,
    lendingDialogOpen: false,
    snackOpen: false
  }
  static styles = theme => ({
    button: {
      margin: theme.spacing.unit
    },
    inputContainer: {
      display: 'block'
    },
    input: {
      fontWeight: 600,
      fontSize: 20
    }
  })

  static propTypes = {
    book: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    refetchBooks: PropTypes.func.isRequired
  }

  openDeleteConfirmation = () => {
    this.setState(prevState => ({
      ...prevState, deleteDialogOpen: !prevState.deleteDialogOpen
    }))
  }

  lendingDialogToggle = () => {
    this.setState(prevState => ({
      ...prevState, lendingDialogOpen: !prevState.lendingDialogOpen
    }))
  }

  handleDelete = async () => {
    this.props.client.mutate({
      mutation: REMOVE_BOOK, variables: { _id: this.state.book._id }
    }).then(data => this
      .setState(prevState => ({
        ...prevState,
        snackOpen: true,
        deleteDialogOpen: false
      }))
    ).then(() => this.props.history.replace('/profile/books'))
  }

  refetchStateBooks = async (refetch) => {
    const { data: { BookFindById: book } } = await refetch()

    this.setState(prevState => ({ ...prevState, book: omitTypeName(book) }))
  }

  availabilityToggle = async (updateBook) => {
    const setStatus = async () => {
      const status = this.state.book.status === 'DRAFT' ? 'AVAILABLE' : 'DRAFT'
      await this.setState(prevState => ({
        ...prevState,
        book: {
          ...prevState.book,
          status
        }
      }))
    }

    try {
      await setStatus()
      return updateBook()
    } catch (error) {
      return setStatus()
    }
  }

  closeSnack = () => this.props.history.goBack()

  render () {
    const { classes, refetchBooks } = this.props
    const { book, lendingDialogOpen } = this.state
    const { lendingDetails, creator, ...update } = book

    return <Mutation
      mutation={EDIT_BOOK}
      variables={{ book: update }}
      refetchQueries={data => {
        const { data: {
          BookUpdateById: { record: book }, BookUpdateById: { recordId: _id }
        } } = data
        this.setState(prevState => ({ ...prevState, book: omitTypeName(book) }))

        return ([{ query: GET_BOOK_BY_ID, variables: { _id } }])
      }}
      children={(updateBook, { data = {}, error, variables, loading }) => {
        const fields = ['title', 'author', 'image', 'description']
        let lendingDetails = this.state.book.lendingDetails
        if (Object.keys(data).length > 0) {
          lendingDetails = data.BookUpdateById.record.lendingDetails
        }

        const { message } = error || { message: '' }

        return <Grid item xs>
          <Loader
            show={loading}
            message={'please wait'}
          >
            <Card>
              {book ? <CardHeader
                avatar={
                  <Avatar aria-label='Book-Image' src={book.image} alt={book.title} />
                }
                action={
                  <div>
                    {lendingDetails
                      ? <Button
                        disabled={loading}
                        onClick={this.availabilityToggle.bind(null, updateBook)}
                        color='secondary'
                        size='small'
                        className={classes.button}
                      >
                        <AddIcon />
                        {book.status === 'DRAFT' ? 'MAKE BOOK AVAILABLE' : 'MAKE BOOK UNAVAILABLE'}
                      </Button> : null}
                    {!lendingDetails
                      ? <Button
                        onClick={this.lendingDialogToggle}
                        color='secondary'
                        size='small'
                        className={classes.button}
                      >
                        <AddIcon /> CREATE LENDING PROFILE
                      </Button> : null}
                    <Tooltip id='tooltip-icon' title='Delete'>
                      <IconButton aria-label='Delete'>
                        <DeleteIcon onClick={this.openDeleteConfirmation} />
                      </IconButton>
                    </Tooltip>
                  </div>
                }
              /> : null}
              <CardContent>
                <Typography gutterBottom variant='headline' component='span'>
                  Edit Book
                </Typography>
                {fields.map((fieldName, index) => {
                  const props = {
                    classes,
                    message,
                    fieldName,
                    book,
                    updateBook,
                    refetchBooks,
                    onChange: (event) => {
                      event.persist()
                      this.setState((prevState) => ({
                        ...prevState,
                        book: {
                          ...prevState.book,
                          [fieldName]: event.target.value
                        } }))
                    }
                  }
                  return book ? <BookInputField {...props} key={index} /> : null
                })}
              </CardContent>
            </Card>
          </Loader>
          <Dialog
            open={this.state.deleteDialogOpen}
            onClose={this.handleClose}
            aria-labelledby='delete-dialog'
            aria-describedby='delete-dialog-confirmation'
          >
            <DialogTitle id='delete-dialog-title'>
              Are you sure you want to delete this item?
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.openDeleteConfirmation} color='primary'>
                Disagree
              </Button>
              <Button onClick={this.handleDelete} color='secondary' autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          <LendBook
            open={lendingDialogOpen}
            bookId={book._id}
            toggleDialog={this.lendingDialogToggle}
            refetchBooks={this.refetchStateBooks.bind(null, refetchBooks)}
          />
          <Snack
            open={this.state.snackOpen}
            onExit={this.closeSnack}
            message={`${this.state.book ? this.state.book.title : ''} deleted`}
          />
        </Grid>
      }}
    />
  }
}

export default withStyles(EditBook.styles)(EditBook)
