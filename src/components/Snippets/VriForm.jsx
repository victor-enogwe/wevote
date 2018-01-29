import Input from './SingleInput';
import React, {Component} from 'react';

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
}

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
}

class VriForm extends Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.checkVRI = this.checkVRI.bind(this);
    this.drawChart = this.drawChart.bind(this);
    this.chartDiv = null;
    this.state = {
      card: "A",
      proximity: "F",
      candidate: "I",
      vriStatus: false,
      score: 0
    }
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.value)
  }

  checkVRI(){
    const {card, proximity, candidate} = this.state;
    const score = scores[card] + scores[proximity] + scores[candidate];
    localStorage.score = score;
    // this.setState({vriStatus: true});
    // this.drawChart();
    alert (score)
  }

  drawChart() {
    const data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Score',     this.state.score],
      ['Remaining',      100 - this.state.score]
    ]);
  
    const options = {
      title: 'Your Voter Readiness Index',
      pieHole: 0.8,
      colors: ['green', 'red'],
      chartArea: {width: "400", height: "400", left: '50'},
      legend: 'none',
      pieStartAngle: 114
    };
  
    const donutchart = document.getElementById('donutchart');
    console.log(this.chartDiv)
  
    if (donutchart) {
      const chart = new google.visualization.PieChart(donutchart);
      chart.draw(data, options);
    }
  }


  render(){
    const {card, proximity, candidate, vriStatus} = this.state;
    return (
      <div className="container-flex">
        <div className="vri-text-area">
          <h1 > Voter's Readiness </h1>
          <p >Your readiness to vote is very important </p>
        </div>
        {vriStatus ==true ? <div id="donutchart" ref={div => this.chartDiv = div} /> :
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
              <small className="form-text text-muted">At what stage are you with your registration?</small>
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
              <small className="form-text text-muted">Tell us how close to your registration center you live.</small>
            </div>
            <div className="form-group">
              <label htmlFor="candidate"> <b>Clarity of Choice:</b> </label>
              <select className="form-control" value={candidate} onChange={this.onChange} name="candidate">
                <option value="I">{resposes.I}</option>
                <option value="J">{resposes.J}</option>
              </select>
              <small className="form-text text-muted">How clear are you about whom to vote for?</small>
            </div>
            <input type="button" onClick={this.checkVRI} value="Check Your Readiness" />
          </div>
        </form>
        }
      </div>
    );
  }
}

export default VriForm;