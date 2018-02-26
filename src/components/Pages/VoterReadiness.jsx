import React, {Component} from 'react';
import { connect } from 'react-redux';
import Start from '../Snippets/Start';
import VotersCard from '../Snippets/VotersCard';
import Proximity from '../Snippets/Proximity';
import RegistrationYear from '../Snippets/RegistrationYear';
import RegistrationStatus from '../Snippets/RegistrationStatus';
import Bio from '../Snippets/Bio';
import Save from '../Snippets/Save';
import Stepper from 'react-stepper-horizontal';

import drawDonutChart from '../../assets/progressbar.js';
import toastr from "toastr";
import {handleError} from "../../utils/errorHandler";
import * as validate from "../../utils/validate";

import actionTypes from '../../actions/constants';
const { START, CARD, PROXIMITY, YEAR, STATUS, BIO, SAVE } = actionTypes;

class VoterReadiness extends Component {
	sections = [START, CARD, PROXIMITY, YEAR, STATUS, BIO, SAVE];
    constructor(props){
        super(props);
        this.state = {
			section: START,
            responses: {},
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
				onClick: (e) => {
					e.preventDefault()
					this.setState({ section })
				}
			})),
			currentStep: 0,
            errors: {},
        };
        this.handleSignUpChange = this.handleSignUpChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onBioSubmit = this.onBioSubmit.bind(this);
        this.goToNext = this.goToNext.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    handleChange(event) {
        const responses = this.state.responses;
        responses[event.target.name] = event.target.id;
        this.setState({ responses });
    }

    goToNext(section) {
		console.log(section)
		const { steps, currentStep } = this.state;
		// note that for questions that make you skip steps, the questions still remain unanswered ???
		// the steps rendomly jumps ??
        this.setState({ section, currentStep: this.sections.indexOf(section) });
    }

    onSave(event) {
        event.preventDefault();
        const { valid, errors } = validate.save(this.state.userDetails);
        if (valid) {
            console.log('Saved');
        } else {
            this.setState({ errors });
        }
    }

    onBioSubmit(event) {
        event.preventDefault();
        const { valid, errors } = validate.bio(this.state.userDetails);
        console.log('Valid', valid, 'Errors', errors);
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

    render(){
        const { section, userDetails, steps, currentStep, errors } = this.state;
        return (
            <div className="vri">
			    <Stepper steps={ steps } activeStep={ currentStep } disabledSteps={ [] } />
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
            </div>
        );
    }
}

export default VoterReadiness;
