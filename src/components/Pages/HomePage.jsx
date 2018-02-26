import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import account from '../../assets/signup_icon.png';
import checkVri from '../../assets/readiness.png';
import getNotifications from '../../assets/notification.png'
import receiveNews from '../../assets/news.png';
import { inecFiles } from "./Candidates";

class HomePage extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="home-page">
                <section className="background">
                    <div className="keyword">
                        <p>Great societies don't just happen. <br/> Good leaders make it happen.</p>
                        <p>Let's vote them.</p>
                        <Link to="/voter-readiness">
                            <button className="vri-button">
                                Check Your Readiness
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
                    <p>In the 2015 elections, only 33.7% (67,422,005) of the general
                        population registered to vote. Worse still, less than 50% of the
                        67,422,005 eventually turned out to vote.
                        <a href={`${inecFiles}2015/04/summary-of-results.pdf`}>Source
                        </a>
                    </p>
                    <p>If <strong>WE</strong> want competent leaders, <strong>WE</strong> have to vote them in.
                        <br/> Are you ready to vote?
                    </p>
                    <Link to="/voter-readiness">
                        <button className="vri-button">
                            Check Your Voter Readiness
                        </button>
                    </Link>
                </section>
                <section className="how-it-works">
                    <h1>How WeVote Works</h1>
                    <section>
                        <div>
                            <img src={checkVri} alt="Check Voter Readiness" />
                            <h3>Check Readiness</h3>
                            <p>Check if you have all the requirements to vote</p>
                        </div>
                        <div>
                            <img src={getNotifications} alt="Get Notifications" />
                            <h3>Get Notifications</h3>
                            <p>Receive personalized updates to ensure you vote</p>
                        </div>
                        <div>
                            <img src={receiveNews} alt="Create Account Image" />
                            <h3>Stay Informed</h3>
                            <p>Get the latest news and election information</p>
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
