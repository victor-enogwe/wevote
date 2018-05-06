import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Loader from 'react-loader-advanced'
import Typography from 'material-ui/Typography'
import Card, { CardContent } from 'material-ui/Card'
import { EDIT_LENDING_DETAILS } from '../store/queries'
import LendInputField from './LendInputField'
import { omitTypeName } from '../store/resolvers'

class EditLend extends Component {
  state = {
    lendingDetails: this.props.lendingDetails
  }
  static styles = theme => ({
    card: {
      boxShadow: 'none'
    },
    cardHeader: {
      fontWeight: 900,
      fontSize: 18,
      marginTop: 18,
      marginBottom: 19
    },
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
    lendingDetails: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    refetchBooks: PropTypes.func.isRequired
  }

  render () {
    const { classes, refetchBooks } = this.props
    const { lendingDetails } = this.state

    return <Mutation
      mutation={EDIT_LENDING_DETAILS}
      variables={{ lendingDetails: omitTypeName(lendingDetails) }}
      children={(updateLend, { data = {}, error, variables, loading }) => {
        const fields = [
          'lendingAmount',
          'booksWorth',
          'info',
          'timeframe',
          'copies'
        ]
        const { message } = error || { message: '' }
        return <Grid item xs>
          <Loader
            show={loading}
            message={'please wait'}
          >
            <Card className={classes.card}>
              <CardContent>
                <Typography gutterBottom variant='headline' component='h3' className={classes.cardHeader}>
                  Edit Book Lending Details
                </Typography>
                {fields.map((fieldName, index) => {
                  const props = {
                    classes,
                    message,
                    fieldName,
                    lendingDetails,
                    updateLend,
                    refetchBooks,
                    onChange: (event) => {
                      event.persist()
                      this.setState((prevState) => ({
                        ...prevState,
                        lendingDetails: {
                          ...prevState.lendingDetails,
                          [fieldName]: event.target.value
                        } }))
                    }
                  }
                  return lendingDetails ? <LendInputField {...props} key={index} /> : null
                })}
              </CardContent>
            </Card>
          </Loader>
        </Grid>
      }}
    />
  }
}

export default withStyles(EditLend.styles)(EditLend)
