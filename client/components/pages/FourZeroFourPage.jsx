import React from 'react'
import Button from 'material-ui/Button'
import withStyles from 'material-ui/styles/withStyles'

const styles = theme => ({
  page: {
    backgroundColor: theme.palette.primary.main,
    background: `url('https://www.osustech.edu.ng/staff/images/error.jpg') center center no-repeat`,
    backgroundSize: 'contain',
    height: 'calc(100vh - 80px)',
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
