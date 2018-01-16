import React, {Component} from 'react';
import { connect } from 'react-redux';

import { test } from '../../actions/userActions';


class HomePage extends Component {
    constructor(props){
        super(props);
        this.showUsername = this.showUsername.bind(this);
    }

    showUsername(){
        this.props.test()
    }

    render(){
        return (
            <div>
                <h1>HomePage</h1>
                <button
                    onClick={this.showUsername}
                >
                    Show my username
                </button>
                <h1 className="name">{this.props.user}</h1>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    };
}

export default connect(mapStateToProps, { test })(HomePage);