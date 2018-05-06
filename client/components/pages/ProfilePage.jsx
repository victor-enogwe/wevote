import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import { Mutation } from 'react-apollo'
import Card, { CardContent } from 'material-ui/Card'
import { UPDATE_USER_PROFILE, GET_USER } from '../../store/queries'
import ProfileInputField from '../ProfileInputField'
import { UserAvatar } from '../Nav'
import { omitTypeName } from '../../store/resolvers'
import BottomNav from '../BottomNav'

class ProfilePage extends Component {
  state = {
    record: this.props.user
  }
  static styles = theme => ({
    margin: {
      margin: theme.spacing.unit
    },
    profileCard: {
      backgroundColor: theme.palette.primary.main,
      height: 'calc(80vh)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexFlow: 'row wrap',
      overflowY: 'scroll'
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
    user: PropTypes.shape({
      _id: PropTypes.string,
      token: PropTypes.string
    }).isRequired
  }
  render () {
    const { user, user: { _id, photos: [image] }, classes } = this.props
    const { record } = this.state
    const fields = ['displayName', 'street', 'city', 'state', 'country']

    return <div>
      <div className={this.props.classes.profileCard}>
        <Card>
          <CardContent>
            <Mutation
              mutation={UPDATE_USER_PROFILE}
              variables={{ record: omitTypeName(record) }}
              update={(cache, { data: { UserUpdateById: { record } } }) => cache.writeQuery({
                query: GET_USER,
                variables: { _id },
                data: { UserFindById: record }
              })}
            >
              {(updateUser, { error }) => {
                const { message } = error || { message: '' }
                return (
                  <div>
                    <UserAvatar
                      alt={record.displayName}
                      imageUrl={image.value}
                      style={{
                        height: 80,
                        width: 80,
                        margin: '0 auto',
                        marginTop: 15,
                        marginBottom: 20
                      }}
                    />
                    {fields.map((fieldName, index) => {
                      const props = {
                        classes,
                        message,
                        fieldName,
                        record,
                        updateUser,
                        onChange: (event) => {
                          event.persist()
                          this.setState((prevState) => ({
                            ...prevState,
                            record: (fieldName === 'displayName'
                              ? {
                                ...prevState.record,
                                [fieldName]: event.target.value
                              } : {
                                ...prevState.record,
                                address: {
                                  ...prevState.record.address,
                                  [fieldName]: event.target.value
                                }
                              }) }))
                        }
                      }
                      return <ProfileInputField {...props} key={index} />
                    })}
                  </div>
                )
              }}
            </Mutation>
          </CardContent>
        </Card>
      </div>
      <BottomNav history={this.props.history} user={user} />
    </div>
  }
}

export default withStyles(ProfilePage.styles)(ProfilePage)
