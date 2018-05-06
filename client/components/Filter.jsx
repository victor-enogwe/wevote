import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import Grid from 'material-ui/Grid'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import IconButton from 'material-ui/IconButton'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import SearchIcon from 'material-ui-icons/Search'
import AddBook from './AddBook'

class Filter extends React.Component {
  state = {
    name: 'Composed TextField',
    addHidden: false,
    openAddForm: false
  }
  static styles = theme => ({
    container: {
      background: theme.palette.grey['200']
    },
    formControl: {
      margin: theme.spacing.unit
    },
    button: {
      marginLeft: 'auto',
      marginRight: 'auto',
      zIndex: 99999
    }
  })

  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.shape(),
    filter: PropTypes.func.isRequired,
    filterArgs: PropTypes.shape({
      page: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
      filter: PropTypes.shape().isRequired,
      sort: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape().isRequired
  }

  handleChange = event => this.setState({ name: event.target.value })

  openCloseAddBookDialog = (event) => {
    event.stopPropagation()
    this.setState(prevState => ({
      ...prevState,
      addHidden: !prevState.addHidden,
      openAddForm: !prevState.addHidden
    }))
  }

  render () {
    const { addHidden, openAddForm } = this.state
    const { classes, user, filter, filterArgs, history } = this.props

    return (
      <Grid item xs={12}>
        <ExpansionPanel
          className={classes.container}
          onChange={() => this.setState(prevState => ({ ...prevState, addHidden: !prevState.addHidden }))}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Button disabled color='default' size='small'>Filter Panel</Button>
            {!addHidden && user ? <Button onClick={this.openCloseAddBookDialog} color='secondary' size='small' className={classes.button}>
              <AddIcon /> ADD BOOK
            </Button> : null}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ padding: '8px 24px 24px 8px' }}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor='search'>Search For Book</InputLabel>
                  <Input id='search' endAdornment={
                    <IconButton
                      aria-label='Search For Book'
                      onClick={event => filter({
                        ...filterArgs,
                        filter: {
                          ...filterArgs.filter,
                          search: window.document.getElementById('search').value
                        }
                      })}
                    >
                      <SearchIcon />
                    </IconButton>
                  } />
                </FormControl>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {user ? <AddBook
          user={user}
          open={openAddForm}
          toggleDialog={this.openCloseAddBookDialog}
          history={history}
        /> : null}
      </Grid>
    )
  }
}

export default withStyles(Filter.styles)(Filter)
