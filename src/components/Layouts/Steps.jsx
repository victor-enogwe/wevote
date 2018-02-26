import React, { Component } from 'react';
import Stepper from 'react-stepzilla';
import VoterReadiness from '../Pages/VoterReadiness';

export default class VriSteps extends Component {
	steps = [
		{name: 'Step 1', component: <VoterReadiness />}
	];

	constructor(props) {
		super(props);
	}

	render() {
		return <div className='step-progress'>
				<Stepper steps={this.steps}/>
		</div>
	}
}
