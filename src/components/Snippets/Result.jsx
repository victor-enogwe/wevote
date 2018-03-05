import React from 'react';

const Result = ({recommendations, username, rank, score, openFrame}) => (
    <section className="result">
        <div id="donut-chart">
        </div>
        {rank &&
        <div className="rank">
            <img src={rank.image} />
            <p>Rank: <span>{rank.title}</span></p>
        </div>}
        <article id="recommendations">
            <h3>Hello {username},</h3>
            <p>
                Thank you for taking your time to check your voter readiness.
                Right now you are
                {score < 50 && ' far from being '}
                {score > 50 && score < 100 && ' close to being '}
                {score === 100 && ' '}
                vote ready.
            </p>
            {recommendations && recommendations.map(recommendation =>
                <p key={recommendation}>
                    {recommendation}
                </p>
            )}
        </article>
        <div className="result-options">
            <a href="https://govote.org.ng/search" target="frame" onClick={openFrame}>
                <button>
                    Find a Registration Center
                </button>
            </a>
            <a href="http://www.inecnigeria.org/?page_id=5217" target="frame" onClick={openFrame}>
                <button>
                    Find INEC Office near you
                </button>
            </a>
        </div>
        <div className="result-options">
            <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwevoteng.herokuapp.com%2F&amp;src=sdkpreparse"
                data-href="https://wevoteng.herokuapp.com"
                className="fb-share-button"
                target="_blank"
            >
                <button>
                    Share on Facebook
                </button>
            </a>
            <a
                href="https://twitter.com/intent/tweet?text=Hello%20world&url=https%3A%2F%2Fwevotengn.herokuapp.com%2F"
                target="_blank"
            >
                <button>
                    Share on Twitter
                </button>
            </a>
        </div>
    </section>
);

export default Result;
