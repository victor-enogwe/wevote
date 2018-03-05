import React, {Component} from 'react';
import { connect } from 'react-redux';

import Start from '../Snippets/Start';
import VotersCard from '../Snippets/VotersCard';
import Proximity from '../Snippets/Proximity';
import RegistrationYear from '../Snippets/RegistrationYear';
import RegistrationStatus from '../Snippets/RegistrationStatus';
import Bio from '../Snippets/Bio';
import Save from '../Snippets/Save';
import Result from '../Snippets/Result';
import Stepper from 'react-stepper-horizontal';
import { isMobile } from 'react-device-detect';

import { signUp, getUser } from '../../actions/userActions';
import { saveVri, getUserVri } from '../../actions/vriActions';
import { handleError } from "../../utils/errorHandler";
import generateRank from "../../utils/generateRank";
import generateRecommendations from '../../utils/generateRecommendations';
import * as validate from "../../utils/validate";
import drawDonutChart from '../../assets/progressbar.js';

import actionTypes from '../../actions/constants';
const { START, CARD, PROXIMITY, YEAR, STATUS, BIO, SAVE, RESULT } = actionTypes;

class VoterReadiness extends Component {
	sections = [START, CARD, STATUS, YEAR, PROXIMITY, BIO, SAVE];
    constructor(props){
        super(props);
        this.state = {
            showFrame: false,
			section: START,
            responses: {},
            rank: {},
            recommendations: [],
            score: 0,
            userDetails: {
                firstname: '',
                surname: '',
                state: '',
                dob: '',
                sex: '',
                phone: '',
                email: ''
			},
			steps: this.sections.map(section => ({
				title: section,
				href: '#',
			})),
			currentStep: 0,
            errors: {},
        };
        this.handleSignUpChange = this.handleSignUpChange.bind(this);
        this.generateResult = this.generateResult.bind(this);
        this.displayResult = this.displayResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onBioSubmit = this.onBioSubmit.bind(this);
        this.closeFrame = this.closeFrame.bind(this);
        this.openFrame = this.openFrame.bind(this);
        this.goToNext = this.goToNext.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentDidMount(){
        // Load Facebook SDK for JavaScript
        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=151030348949397&autoLogAppEvents=1';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Load Twitter SDK
        window.twttr = (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }(document, "script", "twitter-wjs"));

        // Load Google charts for D3 chart
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(this.drawChart);

        if (this.props.user.isAuthenticated && !this.props.vri.responses){
            this.props.getUserVri();
        }
        if (this.props.user.isAuthenticated && this.props.vri.score){
            this.generateResult(this.props.vri, this.displayResult);
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.user.isAuthenticated && !nextProps.vri.responses){
            this.props.getUserVri();
        }
        if (nextProps.vri.score !== this.props.vri.score){
            this.generateResult(nextProps.vri, this.displayResult);
        }
    }

    generateResult(props, callback){
        this.setState({
            section: RESULT,
            score: props.score,
            rank: generateRank(props.score),
            recommendations: generateRecommendations(props.responses)
        }, () => callback());
    }

    displayResult(){
        const donutChart = document.getElementById('donut-chart');
        drawDonutChart(donutChart, this.state.score, 500, 500, '.56em')
    }

    handleChange(event) {
        const responses = this.state.responses;
        responses[event.target.name] = event.target.id;
        this.setState({ responses });
    }

    goToNext(section) {
        this.setState({ section, currentStep: this.sections.indexOf(section) });
    }

    onSave(event) {
        event.preventDefault();
        const { valid, errors } = validate.save(this.state.userDetails);
        if (valid) {
            this.props.signUp(this.state.userDetails)
                .then(() => {
                    if (this.props.user.isAuthenticated) {
                        this.props.saveVri(this.state.responses);
                        this.props.getUser(this.props.user.uuid);
                    }
                    this.setState({section: RESULT})
                })
                .catch((error) => handleError(error));
        } else {
            this.setState({ errors });
        }
    }

    onBioSubmit(event) {
        event.preventDefault();
        const { valid, errors } = validate.bio(this.state.userDetails);
        if (valid) {
            this.goToNext(SAVE);
        } else {
            this.setState({ errors });
        }
    }

    handleSignUpChange(event) {
        const userDetails = this.state.userDetails;
        userDetails[event.target.name] = event.target.value.substr(0, 50);
        this.setState({ userDetails });
    }

    openFrame(){
        this.setState({ showFrame: true})
    }

    closeFrame(){
        this.setState({ showFrame: false})
    }

    render(){
        const { section, score, userDetails, steps, showFrame,
            currentStep, errors, rank, recommendations } = this.state;
        return (
            <div className="vri">
                <div id="fb-root">
                </div>
                <div id="twitter-wjs">
                </div>
                {section !== RESULT &&
                <Stepper
					className="steps"
					steps={ steps }
					activeStep={ currentStep }
					titleFontSize= { isMobile ? 0: 16 }
					activeBorderStyle="solid"
					activeBorderColor="#3004E0"
				/>}
                {section === START &&
                <Start
                    handleChange={this.handleChange}
                    goTo={this.goToNext}
                />}
                {section === CARD &&
                <VotersCard
                    handleChange={this.handleChange}
                    goTo={this.goToNext}
                />}
                {section === PROXIMITY &&
                <Proximity
                    handleChange={this.handleChange}
                    goTo={this.goToNext}
                />}
                {section === YEAR &&
                <RegistrationYear
                    handleChange={this.handleChange}
                    goTo={this.goToNext}
                />}
                {section === STATUS &&
                <RegistrationStatus
                    handleChange={this.handleChange}
                    goTo={this.goToNext}
                />}
                {section === BIO &&
                <Bio
                    handleChange={this.handleSignUpChange}
                    onBioSubmit={this.onBioSubmit}
                    userDetails={userDetails}
                    errors={errors}
                />}
                {section === SAVE &&
                <Save
                    handleChange={this.handleSignUpChange}
                    onSave={this.onSave}
                    userDetails={userDetails}
                    errors={errors}
                />}
                {section === RESULT &&
                <Result
                    rank={rank}
                    score={score}
                    recommendations={recommendations}
                    username={this.props.user.profile ? this.props.user.profile.firstname : ''}
                    openFrame={this.openFrame}
                />}
                {showFrame &&
                <div className="frame">
                    <p onClick={this.closeFrame}>Close</p>
                    <iframe src="" name="frame">
                        <p>This is an iframe</p>
                    </iframe>
                </div>}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        user: state.user,
        vri: state.vri
    };
}

export default connect(mapStateToProps, {signUp, saveVri, getUserVri, getUser})(VoterReadiness);
