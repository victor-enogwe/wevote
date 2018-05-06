import React from 'react'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import Edit from 'material-ui-icons/ModeEdit'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'

function BookInputField (props) {
  const { classes, message, fieldName, book, updateBook, onChange, refetchBooks } = props
  const messageRegex = new RegExp(`${fieldName}.+\\.`, 'i')

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
        value={book[fieldName] || ''}
        disabled
        onChange={onChange}
        onBlur={async (e) => {
          e.target.disabled = true
          await updateBook()
          await refetchBooks()
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
        message.includes(fieldName)
          ? <FormHelperText id={`${fieldName}-error-text`}>
            {`invalid ${messageRegex.exec(message)[0]}`}
          </FormHelperText>
          : null
      }
    </FormControl>
  </div>
}

BookInputField.propTypes = {
  classes: PropTypes.shape().isRequired,
  message: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  book: PropTypes.shape().isRequired,
  updateBook: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  refetchBooks: PropTypes.func.isRequired
}

export default BookInputField
