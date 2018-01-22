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
    this.state = {
      option: "A"
    }
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.value)
  }


  render(){
    const {card, proximity, candidate} = this.state;
    return (
      <form>
        <select value={card} onChange={this.onChange} name="card">
          <option value="A">{resposes.A}</option>
          <option value="B">{resposes.B}</option>
          <option value="C">{resposes.C}</option>
          <option value="D">{resposes.D}</option>
          <option value="E">{resposes.E}</option>
        </select>
        {card == "D" || card == "E" ? 
          <select value={card}>
            <option value={card}>{resposes[card]}</option>
          </select>
           :
          <select value={proximity} onChange={this.onChange} name="proximity">
            <option value="F">{resposes.F}</option>
            <option value="G">{resposes.G}</option>
            <option value="H">{resposes.H}</option>
          </select>
        }
        <select value={candidate} onChange={this.onChange} name="candidate">
          <option value="I">{resposes.I}</option>
          <option value="J">{resposes.J}</option>
        </select>
        <button type="submit"> Check Your Readiness</button>
      </form>
    );
  }
}

export default VriForm;