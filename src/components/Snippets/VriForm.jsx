import toastr from 'toastr';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getVri, saveVri, getUserVri } from '../../actions/vriActions';
import drawDonutChart from '../../assets/progressbar.js';
const resposes = {
  A: "I have collected my Voter's Card",
  B: "I have registered and I know where to collect my card",
  C: "I have registered but I don't know where to collect my card",
  D: "I have not registered but I know where to register",
  E: "I don't know where to register for my card",
  F: "I registered within my city of residence",
  G: "I registered within my state of residence but not in my city of residence",
  H: "I registered outside my state of residence",
  I: "I have decided the candidates to vote for",
  J: "I don't know any candidate I can vote for",
};

const scores = {
  A: 75,
  B: 37.5,
  C: 25,
  D: 12.5,
  E: 0,
  F: 10,
  G: 5,
  H: 0,
  I: 15,
  J: 0
};

class VriForm extends Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.checkVRI = this.checkVRI.bind(this);
    this.nextSteps = this.nextSteps.bind(this);
    this.alert = this.alert.bind(this);
    this.state = {
      card: "A",
      proximity: "F",
      candidate: "I",
      vriStatus: false,
      score: 0,
      vris: {},
      userVRI: []
    }
  }

  componentWillMount(){
    if (this.props.user.isAuthenticated){
      this.props.getVri();
      this.props.getUserVri();
    }
  }

  componentDidMount() {
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(this.drawChart);
  }

  componentWillReceiveProps({ vri }){
    if (vri !== this.props.vri) {
      this.setState({vris: vri.vris, userVRI: vri.userVRI});
      if (vri.score) {
        const choices = vri.userVRI.data;
        if (choices.length === 2) {
            this.setState({card: choices[0].code, proximity: choices[0].code, candidate: choices[1].code})
        } else {
            this.setState({card: choices[0].code, proximity: choices[1].code, candidate: choices[2].code})
        }
        const donutchart = document.getElementById('donutchart');
        this.setState({vriStatus: true, score: vri.score});
        drawDonutChart(donutchart, vri.score, 500, 500, '.56em')
      }
    }
  }

  alert() {
    toastr.success('Feature Comming Soon!')
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value === 'D' || event.target.value === 'E') {
      this.setState({ proximity: event.target.value });
    }
  }

  checkVRI(){
    const {card, proximity, candidate} = this.state;
    let score = scores[card] + scores[proximity] + scores[candidate];
    const donutchart = document.getElementById('donutchart');
    if (card === 'D' || card === 'E') {
      score = scores[card] + 0 + scores[candidate];
    }
    localStorage.score = score;
    this.setState({vriStatus: true, score}, () => {
      if (this.props.user.isAuthenticated){
        this.props.saveVri([card, proximity, candidate])
      }
      drawDonutChart(donutchart, score, 500, 500, '.56em')
    });

  }

  nextSteps(){
    const { card } = this.state;
    if (['D', 'E'].includes(card)){
      return (
        <p>You will not be able to vote unless you get registered and issued a Permanent Voters Card (PVC).
          <br/>Continuous Voter Registration is currently ongoing
          <a href="https://govote.org.ng/#/search" target="_blank"> Find a Registration Center</a>
        </p>
      );
    } else if (['B', 'C'].includes(card)){
      return (
        <p>You will not be able to vote if you are not in possession of your Permanent Voters Card (PVC).
          <br/> Collect your PVC from a ward near you
          <a href="https://govote.org.ng/#/search" target="_blank"> Find a PVC Collection Ward</a>
          <br/>You can also visit the INEC office in your Local Government.
          <a href="http://www.inecnigeria.org/?page_id=5217" target="_blank"> Find INEC office in your LGA</a>
        </p>
      );
    } else if (card === 'A') {
      return (
        <p>
          Congratulations! You have your Permanent Voters Card which allows you to vote.
          Encourage your family and friends to do the same. <br/> Want to verify your voter status and
          check for your Polling Unit?
          <a href="http://voterreg.inecnigeria.org/" target="_blank">Verify your Voter Status</a>
        </p>
      );
    }
  }


  render(){
    const {card, proximity, candidate, vriStatus, userVRI} = this.state;
    console.log('State', this.state);
    return (
      <div className="container-flex">
        <div className="vri-text-area">
          <h1> Voter Readiness Index</h1>
          {vriStatus ? <div className="next-steps"> {this.nextSteps()}
              <p>Have questions about Voter Registration?
                  <a href="http://www.inecnigeria.org/?page_id=5198" target="_blank">Get answers</a>
              </p>
              {!this.props.user.isAuthenticated && <p> Sign Up to save your VRI and update the battery bar above</p>}
          </div> :
          <p>The Voter Readiness Index helps you know what is required of you to vote and if you've met
            those requirements. It consists of 3 questions, select the option that applies to you for
            each question
          </p>}
        </div>
        <div id="donutchart">
          <form className="form-vri">
            <div className="form-vri-inner">
              <div className="form-group">
                <label htmlFor="card"> <b>Registration/Card Collection:</b> </label>
                <select className="form-control" value={card} onChange={this.onChange} name="card">
                  <option value="A">{resposes.A}</option>
                  <option value="B">{resposes.B}</option>
                  <option value="C">{resposes.C}</option>
                  <option value="D">{resposes.D}</option>
                  <option value="E">{resposes.E}</option>
                </select>
                <small className="form-text text-muted">What stage are you with your registration?</small>
              </div>
              <div className="form-group">
                <label htmlFor="proximity"> <b>Proximity:</b> </label>
                {card == "D" || card == "E" ?
                  <select className="form-control" value={card} name="proximity">
                    <option value={card}>{resposes[card]}</option>
                  </select>
                  :
                  <select className="form-control" value={proximity} onChange={this.onChange} name="proximity">
                    <option value="F">{resposes.F}</option>
                    <option value="G">{resposes.G}</option>
                    <option value="H">{resposes.H}</option>
                  </select>
                }
                <small className="form-text text-muted">How close are you to your registration center?</small>
              </div>
              <div className="form-group">
                <label htmlFor="candidate"> <b>Clarity of Choice:</b> </label>
                <select className="form-control" value={candidate} onChange={this.onChange} name="candidate">
                  <option value="I">{resposes.I}</option>
                  <option value="J">{resposes.J}</option>
                </select>
                <small className="form-text text-muted">How clear are you about whom to vote for?</small>
              </div>
              <input className="vri-submit" type="button" onClick={this.checkVRI} value="Check Your Readiness" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
      vri: state.vri,
      user: state.user,
  };
}

export default connect(mapStateToProps, { getVri, saveVri, getUserVri })(VriForm);
