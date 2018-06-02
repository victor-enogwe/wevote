import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import PropTypes from 'prop-types'

const Snack = (props) => (<Snackbar
  open={props.open}
  autoHideDuration={props.duration || 2000}
  message={props.message}
  onClose={props.onExit}
/>)

Snack.propTypes = {
  open: PropTypes.bool.isRequired,
  autoHideDuration: PropTypes.number,
  message: PropTypes.string.isRequired,
  onExit: PropTypes.func
}

export default Snack
