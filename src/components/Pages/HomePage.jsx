import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import account from '../../assets/signup_icon.png';
import checkVri from '../../assets/readiness.png';
import getNotifications from '../../assets/notification.png'
import receiveNews from '../../assets/news.png';

class HomePage extends Component {
    constructor(props){
        super(props);
    }


    render(){
        return (
            <div className="home-page">
                <section className="background">
                    <div className="keyword">
                        <p>Great societies don't just happen</p>
                        <p>They must be made to happen.</p>
                        <Link to="/voter-readiness">
                            <button className="vri-button">
                                Check Readiness
                            </button>
                        </Link>
                    </div>
                </section>
                <section className="about">
                    <h1>About WeVote</h1>
                    <p>It is in our hands to vote and elect a leader who will lead us,
                    to make our nation great. Lack of information about being vote ready
                    and the misconception that their votes won't count hinders most Nigerians
                    from coming out to vote during the elections.
                    WeVote seeks to bridge that information gap and ensure that all Nigerians,
                    especially the youth, cast their votes during the 2019 elections.</p>
                </section>
                <section className="how-it-works">
                    <h1>How WeVote Works</h1>
                    <section>
                        <div>
                            <img src={account} alt="Create Account" />
                            <h3>Create Account</h3>
                            <p>Sign up to receive election updates</p>
                        </div>
                        <div>
                            <img src={checkVri} alt="Check Voter Readiness" />
                            <h3>Check Readiness</h3>
                            <p>Check how vote ready you are</p>
                        </div>
                        <div>
                            <img src={getNotifications} alt="Get Notifications" />
                            <h3>Receive Notifications</h3>
                            <p>Get necessary election information</p>
                        </div>
                        <div>
                            <img src={receiveNews} alt="Create Account Image" />
                            <h3>Read News</h3>
                            <p>Get political news from INEC</p>
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(HomePage);
