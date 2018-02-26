import React, { Component } from 'react';

import SelectInput from '../Forms/SelectInput';

const electionYears = ['2019', '2016', '2015'];

const candidatesIn2015 = [
    ['Presidential', '2015/01/2015-PRESIDENTIAL-LIST-FINAL-13.05.151.xlsx'],
    ['Governorship', '2015/01/2015-GOVERNORSHIP-.xlsx'],
    ['Senatorial', '2015/01/2015-SENATORIAL-CANDIDATES-.xlsx'],
    ['House of Representatives', '2015/01/2015-HOUSE-OF-REPS-CANDIDATES.xlsx'],
    ['State House of Assembly', '2015/01/2015-STATE-ASSEMBLY-CANDIDATES-1.xlsx']
];

export const inecFiles = 'http://www.inecnigeria.org/wp-content/uploads/';

class Candidates extends Component {
    constructor(props){
        super(props);
        this.state = {
          year: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    render(){
        const { year } = this.state;
        return (
            <div className="candidates">
                <header>
                    <h1>Know Your Candidates</h1>
                    <p>Get to know all the candidates competing for various electoral positions</p>
                </header>
                <section className="questions">
                    <SelectInput
                        id="election-year"
                        name="year"
                        placeholder="Select Election Year"
                        fields={electionYears}
                        handleChange={this.handleChange}
                        value={year}
                    />
                </section>
                <section className="response">
                    {year === "2019" && <div>
                        <h2>Candidates for {year} elections</h2>
                        <p>Sorry... The Candidates List for {year} elections is not currently available.
                            Please try again later.
                        </p>
                    </div>}
                    {year === "2016" && <div>
                        <p> Candidates for Edo State Governorship Election, {year}
                            <a
                                href={`${inecFiles}/2016/07/LIST-OF-EDO-GOVERNORSHIP-CANDIDATES-LIST.pdf`}
                                target="_blank"
                            >
                                View list
                            </a>
                        </p>
                    </div>}
                    {year === "2015" && <div>
                        <article>
                            <h2>Candidates for {year} elections</h2>
                            {candidatesIn2015.map(electionType =>
                                <p key={electionType[0]}>{electionType[0]} candidates
                                    <a href={`${inecFiles}${electionType[1]}`}>Download List</a>
                                </p>
                            )}
                        </article>
                    </div>}
                </section>
            </div>
        );
    }
}

export default Candidates;
