import React,{ Component } from 'react';

class ElectionStructure extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
          <article className="structure">
              <header>
                  <h1>Election Structure</h1>
              </header>
              <section>
                  <p>Nigeria elects on the federal level a head of state (the President of Nigeria)
                      and a legislature (the National Assembly). The president is elected by the people.
                      The National Assembly has two chambers. The House of Representatives has 360 members,
                      elected for a four-year term in single-seat constituencies. The Senate has 109 members,
                      elected for a four-year term: each of the 36 states are divided into 3 senatorial districts,
                      each of which is represented by one senator; the Federal Capital Territory is represented by
                      only one senator.
                      Nigeria has a multi-party system, with two or three strong parties and a third party that is
                      electorally successful.
                  </p>
                  <p>How to Vote?
                      <a href="http://www.inecnigeria.org/?page_id=5202">Find out</a>
                  </p>
                  <p>What happens after voting?
                      <a href="http://www.inecnigeria.org/?page_id=5194">Read more</a>
                  </p>
              </section>
          </article>
        );
    }
}

export default ElectionStructure;
