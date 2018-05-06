import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Loader from 'react-loader-advanced'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem'
import Typography from 'material-ui/Typography'
import Card, { CardContent } from 'material-ui/Card'
import { EDIT_BOOK } from '../store/queries'
import LendInputField from './LendInputField'
import { omitTypeName } from '../store/resolvers'

class EditLend extends Component {
  static styles = theme => ({
    cardHeader: {
      fontWeight: 900,
      fontSize: 21,
      marginTop: 21,
      marginBottom: 19
    },
    button: {
      margin: theme.spacing.unit
    },
    select: {
      marginTop: `calc(${theme.spacing.unit - 2}px)`
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

  render () {
    const { classes, refetchBooks } = this.props
    const { book } = this.props

    return <Mutation
      mutation={EDIT_BOOK}
      variables={{ book: omitTypeName(this.props.book) }}
      children={(updateLend, { data = {}, error, variables, loading }) => {
        const fields = [
          'amount',
          'currency',
          'info',
          'duration'
        ]
        const { message } = error || { message: '' }

        return <Grid item xs>
          <Loader
            show={loading}
            message={'please wait'}
          >
            <Card>
              <CardContent>
                <Typography gutterBottom variant='headline' component='h3' className={classes.cardHeader}>
                  Edit Book Lending Details
                </Typography>
                {fields.map((fieldName, index) => {
                  const props = {
                    classes,
                    message,
                    fieldName,
                    book,
                    updateLend,
                    refetchBooks
                  }
                  return book.lendingDetails ? <LendInputField {...props} key={index} /> : null
                })}
                <TextField
                  error={Boolean(message.includes('status'))}
                  select
                  fullWidth
                  label={`Lending Status ${message.replace('GraphQL error: ', '')}`}
                  value={book.lendingDetails.status}
                  className={classes.select}
                  onChange={async (event) => {
                    const { value } = event.target
                    const { creator, ...newBook } = book
                    const update = {
                      ...newBook,
                      lendingDetails: {
                        ...newBook.lendingDetails,
                        status: value,
                        loanedTo: value === 'UNAVAILABLE' ? newBook.lendingDetails.loanedTo : null
                      }
                    }
                    return updateLend({ variables: { book: omitTypeName(update) } })
                      .then(() => refetchBooks())
                  }
                  }
                >
                  {['AVAILABLE', 'UNAVAILABLE'].map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  <MenuItem disabled value='LENT'>LENT</MenuItem>
                </TextField>
              </CardContent>
            </Card>
          </Loader>
        </Grid>
      }}
    />
  }
}

export default withStyles(EditLend.styles)(EditLend)
