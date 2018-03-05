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
        <article id="recommendations">
            <p>
                Since you've checked your Voter Readiness, why not tell your friends to do so too.
            </p>
        </article>
        <div className="social-share">
            <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwevote-ng.herokuapp.com%2F&amp;src=sdkpreparse"
                data-href="https://wevote-ng.herokuapp.com"
                className="fb-share-button"
                target="_blank"
            >
                <button>
                    Share on Facebook
                </button>
            </a>
            <a
                href="https://twitter.com/intent/tweet?text=I%20just%20checked%20my%20voter%20readiness%20on%20WeVote.%20Check%20yours&url=https%3A%2F%2Fwevote-ng.herokuapp.com%2F&via=saucecodexyz&related=ignatiusukwuoma%2Ckingobi1&hashtags=nigeria%2Celection"
                target="_blank"
                className="tw-share-button"
            >
                <button>
                    Share on Twitter
                </button>
            </a>
        </div>
    </section>
);

export default Result;
