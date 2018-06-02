import React from 'react'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  page: {
    backgroundColor: theme.palette.primary.main,
    backgroundSize: 'contain',
    height: 'calc(80vh -16px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'row wrap'
  },
  button: {
    marginTop: '29vh'
  }
})

export default withStyles(styles)(function FourZeroFour (props) {
  return <div className={props.classes.page}>
    <Button
      variant='raised'
      className={props.classes.button}
      onClick={() => props.history.goBack()}
    >
      Go Back
    </Button>
  </div>
})
