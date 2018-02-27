import React from 'react';

const Result = ({recommendations, username}) => (
    <section className="result">
        <div id="donut-chart">
        </div>
        <article id="recommendations">
            <h3>Hello {username},</h3>
            {recommendations && recommendations.map(recommendation =>
                <p key={recommendation}>
                    {recommendation}
                </p>
            )}
        </article>
        <div className="options">
            <a href="https://govote.org.ng/search" target="_blank">
                <button>
                    Find a Registration Center
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
