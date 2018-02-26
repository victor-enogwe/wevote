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
    </section>
);

export default Result;
