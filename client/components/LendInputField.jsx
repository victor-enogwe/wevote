import React, {Component } from 'react'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import Edit from 'material-ui-icons/ModeEdit'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'
import { omitTypeName } from '../store/resolvers'

class LendInputField extends Component {
  state = {
    value: this.props.book.lendingDetails[this.props.fieldName]
  }
  static propTypes = {
    classes: PropTypes.shape().isRequired,
    message: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    book: PropTypes.shape().isRequired,
    updateLend: PropTypes.func.isRequired,
    refetchBooks: PropTypes.func.isRequired
  }

  render () {
    const {
      classes,
      message,
      fieldName,
      book,
      updateLend,
      refetchBooks
    } = this.props
    const messageRegex = new RegExp(`${fieldName}\\s.+\\.`, 'i')

    return <div className={classes.inputContainer}>
      <FormControl
        className={classes.margin}
        error={message ? message.includes(`${fieldName}`) : false}
        fullWidth
        aria-describedby={`${fieldName}-error-text`}
      >
        <InputLabel htmlFor={fieldName}>{fieldName.toUpperCase()}</InputLabel>
        <Input
          id={fieldName}
          className={classes.input}
          value={this.state.value || ''}
          disabled
          onChange={(event) => {
            event.persist()
            this.setState(prevState => ({ ...prevState, value: event.target.value }))
          }}
          onBlur={(event) => {
            event.target.disabled = true
            const { creator, ...newBook } = book
            const update = {
              ...newBook,
              lendingDetails: {
                ...newBook.lendingDetails,
                [fieldName]: event.target.value
              }
            }

            return updateLend({ variables: { book: omitTypeName(update) } })
              .then(() => refetchBooks())
              .catch(error => (error ? null : null))
          }}
          placeholder={fieldName}
          inputProps={{
            'aria-label': fieldName
          }}
          endAdornment={
            <InputAdornment position='end'>
              <Tooltip id='tooltip-icon' title='Edit' placement='top'>
                <IconButton
                  aria-label={`edit ${fieldName}`}
                  onClick={() => {
                    const parent = document.getElementById(fieldName)
                    if (parent.createTextRange) {
                      const part = parent.createTextRange()
                      part.move('character', 0)
                      part.select()
                    } else if (parent.setSelectionRange) {
                      parent.setSelectionRange(0, 0)
                    }
                    parent.disabled = !parent.disabled
                    parent.focus({ preventScroll: true })
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          }
        />
        {
          message.includes(fieldName) && messageRegex.test(message)
            ? <FormHelperText id={`${fieldName}-error-text`}>
              {message.match(messageRegex)[0].split(',')[0]}
            </FormHelperText>
            : null
        }
      </FormControl>
    </div>
  }
}

export default LendInputField
