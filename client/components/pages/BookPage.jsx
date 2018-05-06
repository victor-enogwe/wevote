import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation, Query } from 'react-apollo'
import Loader from 'react-loader-advanced'
import Card, {
  CardContent, CardActions, CardHeader, CardMedia
} from 'material-ui/Card'
import classnames from 'classnames'
import Collapse from 'material-ui/transitions/Collapse'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ShareIcon from 'material-ui-icons/Share'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import {
  GET_BOOK_BY_ID, CREATE_REQUEST, GET_ONE_REQUEST, DELETE_REQUEST_BY_ID
} from '../../store/queries'

class BookPage extends Component {
  state = { expanded: false }

  static styles = theme => ({
    margin: {
      margin: theme.spacing.unit
    },
    bookCard: {
      backgroundColor: theme.palette.primary.main,
      height: 'calc(92vh - 4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexFlow: 'row wrap',
      overflowY: 'scroll'
    },
    card: {
      minWidth: '50vw',
      maxWidth: 400,
      width: '90vw'
    },
    media: {
      height: 0,
      paddingTop: '56.25%'
    },
    actions: {
      display: 'flex'
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      }),
      marginLeft: 'auto'
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    }
  })
  static propTypes = {
    user: PropTypes.shape({
      _id: PropTypes.string,
      token: PropTypes.string
    }),
    history: PropTypes.object.isRequired
  }

  handleExpandClick = () => this.setState({ expanded: !this.state.expanded })

  render () {
    const {
      classes, user, history: { location: { pathname } }
    } = this.props
    const bookId = pathname.match(/\w+$/g)[0]

    return <div>
      <div className={this.props.classes.bookCard}>

        <Query
          query={GET_BOOK_BY_ID}
          variables={{ _id: bookId }}
          pollInterval={user ? 10000 : 0}
          children={({ data, error, refetch, variables, loading }) => {
            return <Loader
              show={loading}
              message={'please wait'}
            >
              {data.BookFindById ? <Card className={classes.card}>
                <CardHeader
                  action={user &&
                    data.BookFindById.creator._id !== user._id &&
                    data.BookFindById.status === 'AVAILABLE' &&
                    data.BookFindById.lendingDetails.status === 'AVAILABLE'
                    ? <Query
                      query={GET_ONE_REQUEST}
                      pollInterval={user ? 1000 : 0}
                      variables={{ filter: { bookId, creatorId: user._id } }}
                      children={({ data: dataRequest, loading: loadingRequest, refetch: refetchRequest }) => {
                        return dataRequest && dataRequest.RequestFindOne
                          ? <Mutation
                            mutation={DELETE_REQUEST_BY_ID}
                            variables={{ id: dataRequest.RequestFindOne._id }}
                            children={(deleteRequest, { loading: loadingRequestDelete }) => {
                              return <Button
                                fullWidth
                                disabled={loading || loadingRequest || loadingRequestDelete}
                                onClick={async () => {
                                  await deleteRequest()
                                  await refetch()
                                  await refetchRequest()
                                }}
                                color='secondary' size='small'
                                style={{ marginTop: 15 }}
                              >
                                <AddIcon /> DELETE CURRENT REQUEST
                              </Button>
                            }}
                          /> : <Mutation
                            mutation={CREATE_REQUEST}
                            variables={{ record: { creatorId: user._id, bookId } }}
                            children={(createRequest, { loading: loadingRequestCreate }) => {
                              return <Button
                                fullWidth
                                disabled={loading || loadingRequest || loadingRequestCreate}
                                onClick={async () => {
                                  await createRequest()
                                  await refetch()
                                  await refetchRequest()
                                }}
                                color='secondary' size='small'
                                style={{ marginTop: 15 }}
                              >
                                <AddIcon /> REQUEST TO LEND THIS BOOK
                              </Button>
                            }}
                          />
                      }}
                    /> : <Button
                      fullWidth
                      disabled
                      color='secondary' size='small'
                      style={{ marginTop: 15 }}
                    >
                      {user && data.BookFindById.lendingDetails &&
                      data.BookFindById.lendingDetails.loanedTo === user._id
                        ? 'BOOK LENDING REQUEST APPROVED' : (user ? 'BOOK NOT AVAILABLE FOR LENDING' : '')}
                    </Button>}
                />
                <CardMedia
                  className={classes.media}
                  image={data.BookFindById.image}
                  title={data.BookFindById.title}
                />
                <CardContent>
                  <Typography gutterBottom variant='headline' component='h2'>
                    {data.BookFindById.title}
                  </Typography>
                </CardContent>
                <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                  <CardContent>
                    {user && data.BookFindById.creator._id !== user._id ? <Typography
                      gutterBottom
                      variant='subheading'
                      component='p'
                      style={{ width: '100vw', maxWidth: 392 }}
                    >
                      {`Owned By: ${data.BookFindById.creator.displayName}`}
                    </Typography> : null}
                    <Typography paragraph>{data.BookFindById.description}</Typography>
                  </CardContent>
                </Collapse>
                <CardActions className={classes.actions} disableActionSpacing>
                  <IconButton aria-label='Share'>
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    className={classnames(classes.expand, {
                      [classes.expandOpen]: this.state.expanded
                    })}
                    onClick={this.handleExpandClick}
                    aria-expanded={this.state.expanded}
                    aria-label='Show more'
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
              </Card> : null}
            </Loader>
          }}
        />
      </div>
    </div>
  }
}

export default withStyles(BookPage.styles)(BookPage)
