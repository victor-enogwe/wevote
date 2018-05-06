import React from 'react'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import Edit from 'material-ui-icons/ModeEdit'
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'

function ProfileInputField (props) {
  const { classes, message, fieldName, record, updateUser, onChange } = props

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
        value={record[fieldName] || (record.address ? record.address[fieldName] : '') || ''}
        disabled
        onChange={onChange}
        onBlur={async (e) => {
          e.target.disabled = true
          updateUser()
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
          ? <FormHelperText id={`${fieldName}-error-text`}>invalid {fieldName} format supplied</FormHelperText>
          : null
      }
    </FormControl>
  </div>
}

ProfileInputField.propTypes = {
  classes: PropTypes.shape().isRequired,
  message: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  record: PropTypes.shape().isRequired,
  updateUser: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ProfileInputField
