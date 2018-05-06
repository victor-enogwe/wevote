import React from 'react'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  media: {
    height: 0,
    paddingTop: '66.25%'
  },
  content: {
    maxHeight: 115,
    minHeight: 115
  }
})

function Book (props) {
  const { classes, book, grid, user, history } = props
  const dummyImage = 'https://cdn.pixabay.com/photo/2017/09/07/17/27/background-2726037_1280.png'
  const { title, image = dummyImage, _id, creatorId } = book
  return (
    <Grid item {...grid}>
      <Card>
        <CardMedia
          className={classes.media}
          image={image}
          title={title}
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom variant='headline' component='h2'>
            {title.slice(0, 40)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size='small'
            color='default'
            onClick={() => history.replace(`/books/${_id}`)}
          >
            View
          </Button>
          {user && (user._id === creatorId)
            ? <Button
              size='small'
              color='default'
              onClick={() => history.replace(`/profile/books/${_id}`)}
            >
              GO TO BOOK DASHBOARD
            </Button>
            : null
          }
        </CardActions>
      </Card>
    </Grid>
  )
}

Book.propTypes = {
  classes: PropTypes.object.isRequired,
  book: PropTypes.shape().isRequired,
  grid: PropTypes.shape({
    xs: PropTypes.number.isRequired,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number
  }).isRequired,
  user: PropTypes.shape(),
  history: PropTypes.shape().isRequired
}

export default withStyles(styles)(Book)
