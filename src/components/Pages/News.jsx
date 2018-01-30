import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getNews, getImage } from '../../actions/newsActions';

import inecLogo from '../../assets/inec-logo.png';

class News extends Component {
    constructor(props){
        super(props);
        this.state = {
            imagesRequested: false
        };
    }

    componentDidMount() {
        this.props.getNews();
    }

    componentWillReceiveProps(nextProps){
        if (this.state.imagesRequested) return;
        this.requestImages(nextProps.news);
    }

    requestImages(posts){
        posts.forEach(post =>
            this.props.getImage(post.media)
        );
        this.setState({imagesRequested: true});
    }


    render(){
        const { news } = this.props;
        console.log('News', news);
        return (
            <div className="news-page">
                <header>
                    <h1>Latest News from INEC</h1>
                    <small>Visit <a href="www.inecnews.com">www.inecnews.com</a> for more election news</small>
                </header>
                <div className="news">
                {news && news.map(newsItem =>
                    <article key={newsItem.id}>
                        <a className="read-more" href={newsItem.link} target="_blank">
                            <section>
                                <div className="preview">
                                    <img className="news-image" src={newsItem.image || inecLogo} />
                                </div>
                                <h4>{newsItem.title}</h4>
                            </section>
                            <div className="news-content" dangerouslySetInnerHTML=
                                   {{ __html: `${newsItem.excerpt.slice(0, -16)}...` }}>
                            </div>
                            <p className="news-date">{new Date(newsItem.date).toLocaleDateString()}</p>
                        </a>
                    </article>
                )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        news: state.news
    };
}

export default connect(mapStateToProps, { getNews, getImage })(News);
