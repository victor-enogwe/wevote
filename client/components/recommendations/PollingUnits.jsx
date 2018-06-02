import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Loader from 'react-loader-advanced'
import Grid from '@material-ui/core/Grid'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { scoreStyles } from '../../data/styles'
import states from '../../data/States'

class PollingUnits extends Component {
  state = {
    inecLoading: false,
    data: {
      count: 0,
      lat: 9.0820,
      lng: 8.6753,
      photos: [{
        lat: 9.0820,
        lng: 8.6753
      }]
    }
  }
  static propTypes = {
    classes: PropTypes.object.isRequired,
    lga: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }

  mapdefaultProps = { center: { lat: 9.0820, lng: 8.6753 } }

  componentDidMount () {
    const { state } = this.getState(this.props.lga)
    this.getPollingUnits(this.props.lga, state)
  }

  getState = lga => states.filter(item => (item.state.locals
    .filter(place => (place.name.toLowerCase() === lga)).length > 0))[0]

  getPollingUnits = async (lga, state) => {
    const lgaId = state.locals
      .filter(place => (place.name.toLowerCase() === lga))[0].id
    state = state.name.slice(0, 2).toUpperCase()
    const units = await axios({
      url: 'api/v1/inec',
      params: { state, lgaId },
      transformRequest: [(data, headers) => {
        this.setState(prevState => ({ ...prevState, inecLoading: true }))
        return data
      }],
      transformResponse: [(data) => {
        data = JSON.parse(data).data
        data = {
          count: data.count,
          lat: +data.latti,
          lng: +data.longi,
          photos: data.photos.map(datum => ({
            ...datum, lat: +datum.latitude, lng: +datum.longitude
          }))
        }
        this.setState(prevState => ({ ...prevState, inecLoading: false, data }))
        return data
      }]
    })

    return units
  }

  render () {
    const { classes, expanded, onChange } = this.props
    const { center } = this.mapdefaultProps
    const {
      inecLoading, data: { count, lat, lng, photos }
    } = this.state

    const bounds = new this.props.google.maps.LatLngBounds()
    for (let i = 0; i < photos.length; i++) {
      bounds.extend(photos[i])
    }

    return <ExpansionPanel
      expanded={expanded} onChange={onChange()} className={classes.expansion}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading} variant='title'>
          {count} Polling Centers In your LGA
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container className={classes.mapGrid}>
          <Grid item xs={12}>
            <Loader show={inecLoading} message='please wait'>
              <Map
                className={classes.map}
                google={this.props.google}
                initialCenter={center}
                center={{lat, lng}}
                bounds={bounds}
              >
                {photos.map((photo, index) => {
                  const { name, desc, lat, lng } = photo
                  return <Marker
                    key={index}
                    title={desc}
                    name={name}
                    position={{lat, lng}}
                  />
                })}
              </Map>
            </Loader>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  }
}

const LoadingContainer = (props) => <Loader show message='please wait' />

export default GoogleApiWrapper({
  apiKey: MAPS_KEY,
  LoadingContainer: LoadingContainer
})(withStyles(scoreStyles)(PollingUnits))
