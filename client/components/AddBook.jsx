import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation } from 'react-apollo'
import Dialog, {
  DialogTitle,
  withMobileDialog,
  DialogActions,
  DialogContent
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Input, { InputLabel } from 'material-ui/Input'
import { CREATE_BOOK } from '../store/queries'
import { Snack } from '../index'

import { omitTypeName } from '../store/resolvers'

class AddBook extends Component {
  state = {
    form: {
      creatorId: this.props.user._id,
      title: '',
      image: '',
      description: '',
      author: ''
    },
    disabled: false,
    snackBarOpen: false,
    book: null
  }
  static styles = theme => ({

  })
  static propTypes = {
    user: PropTypes.shape({
      _id: PropTypes.string,
      token: PropTypes.string
    }).isRequired,
    open: PropTypes.bool.isRequired,
    toggleDialog: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired
  }

  onChange = (event) => {
    event.preventDefault()
    event.persist()
    const name = event.target.name
    this.setState(prevState => ({
      ...prevState,
      form: { ...prevState.form, [name]: event.target.value }
    }))
  }

  addBook = async (createBook) => {
    try {
      this.setState(prevState => ({ ...prevState, disabled: true }))
      const { data: { BookCreateOne: book } } = await createBook()
      this.setState(prevState => ({ ...prevState, book, snackBarOpen: true }))
    } catch (error) {
      this.setState(prevState => ({ ...prevState, snackBarOpen: true }))
    }
  }

  render () {
    const { open, toggleDialog, history } = this.props
    const { form, disabled, snackBarOpen, book } = this.state

    return <Mutation
      mutation={CREATE_BOOK}
      variables={{ record: omitTypeName(form) }}
    >
      {(createBook, { error }) => {
        const { message } = error || { message: '' }
        const fields = ['title', 'image', 'author', 'description']

        return <Dialog open={open} aria-labelledby='open-add-form' fullScreen>
          <DialogTitle id='open-add-form'>Add New Book</DialogTitle>
          <form onSubmit={(event) => {
            event.preventDefault()
            this.addBook(createBook)
          }}>

            <DialogContent>
              {fields.map((field, index) => {
                return <FormControl
                  error={message ? message.includes(field) : false}
                  fullWidth
                  aria-describedby={`${field}-error-text`}
                  key={index}
                >
                  <InputLabel htmlFor={field}>{field.toUpperCase()}</InputLabel>
                  <Input name={field} fullWidth placeholder={`ADD BOOK ${field.toUpperCase()}`} inputProps={{
                    'aria-label': `Book ${field}`
                  }} onChange={this.onChange} />
                  {
                    message.includes(field)
                      ? <FormHelperText id={`${field}-error-text`}>
                            please add a valid {field} format
                      </FormHelperText>
                      : null
                  }
                </FormControl>
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleDialog} color='primary'>Cancel</Button>
              <Button type='submit' color='secondary' disabled={disabled} autoFocus>Add Book</Button>
            </DialogActions>
          </form>
          <Snack open={snackBarOpen} message={
            message ? 'Book creation failed. please try again' : 'Book creation successful. redirecting ...'
          } onExit={() => {
            if (message) {
              this.setState(prevState => ({ ...prevState, disabled: false, snackBarOpen: false }))
            } else {
              history.replace(`/profile/books/${book.recordId}`)
            }
          }} />
        </Dialog>
      }}
    </Mutation>
  }
}

export default withMobileDialog()(withStyles(AddBook.styles)(AddBook))
