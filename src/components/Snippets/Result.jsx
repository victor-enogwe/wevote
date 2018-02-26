import React from 'react';

const Result = ({recommendations}) => (
    <section className="result">
        <div id="donut-chart">
        </div>
        <ul id="recommendations">
            {recommendations && recommendations.map(recommendation =>
                <li key={recommendation}>
                    {recommendation}
                </li>
            )}
        </ul>
        <div className="options">
            <a href="https://govote.org.ng/search" target="_blank">
                <button>
                    Find a Registration/Collection Center
                </button>
            </a>
            <a href="http://www.inecnigeria.org/?page_id=5217" target="_blank">
                <button>
                    Find INEC Office near you
                </button>
            </a>
        </div>
    </section>
);

export default Result;
