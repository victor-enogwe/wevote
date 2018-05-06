import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation } from 'react-apollo'
import Loader from 'react-loader-advanced'
import Dialog, {
  DialogActions, DialogTitle, withMobileDialog, DialogContent
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Input, { InputLabel } from 'material-ui/Input'
import { EDIT_BOOK } from '../store/queries'

class LendBook extends Component {
  state = {
    book: {
      _id: this.props.bookId,
      lendingDetails: null
    },
    snackOpen: false,
    snackMessage: '',
    disabled: false
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
    bookId: PropTypes.string.isRequired,
    toggleDialog: PropTypes.func.isRequired,
    refetchBooks: PropTypes.func.isRequired
  }

  onChange = (event) => {
    event.preventDefault()
    event.persist()
    const name = event.target.name
    this.setState(prevState => ({
      ...prevState,
      book: {
        ...prevState.book,
        lendingDetails: {
          ...prevState.book.lendingDetails, [name]: event.target.value
        }
      }
    }))
  }

  createLend = (createLendingProfile, message) => createLendingProfile()
    .then(() => (message ? null : this.props.toggleDialog()))
    .then(() => this.props.refetchBooks())
    .catch(error => (error ? null : null))

  render () {
    const { open, toggleDialog } = this.props
    const { book } = this.state
    return <Mutation
      mutation={EDIT_BOOK}
      variables={{ book }}
      children={(createLendingProfile, { data = {}, error, loading }) => {
        const fields = [
          'amount',
          'currency',
          'info',
          'duration'
        ]
        let { message } = error || { message: '' }

        return <Loader
          show={loading}
          message={'please wait'}
        >
          <Dialog
            open={open}
            fullScreen
            aria-labelledby='lend-dialog'
            aria-describedby='lend-dialog-confirmation'
          >
            <DialogTitle id='lend-dialog-title'>Create Lending Profile for Book</DialogTitle>
            <form onSubmit={(event) => {
              event.preventDefault()

              return this.createLend(createLendingProfile, message)
            }}>
              <DialogContent>
                {fields.map((field, index) => {
                  const messageRegex = new RegExp(`${field}\\s.+\\.`, 'i')

                  return (<FormControl
                    error={message ? message.includes(field) : false}
                    fullWidth
                    aria-describedby={`${field}-error-text`}
                    key={index}
                  >
                    <InputLabel htmlFor={field}>{field.toUpperCase()}</InputLabel>
                    <Input name={field} fullWidth placeholder={field.toUpperCase()} inputProps={{
                      'aria-label': `Book ${field}`
                    }} onChange={this.onChange} required />
                    {
                      message.includes(field)
                        ? <FormHelperText id={`${field}-error-text`}>
                          {message.match(messageRegex)[0].split(',')[0]}
                        </FormHelperText>
                        : null
                    }
                  </FormControl>)
                })}
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleDialog} color='primary' disabled={loading}>Cancel</Button>
                <Button type='submit' color='secondary' disabled={loading} autoFocus>Create Lending Profile</Button>
              </DialogActions>
            </form>
          </Dialog>
        </Loader>
      }}
    />
  }
}

export default withMobileDialog()(withStyles(LendBook.styles)(LendBook))
