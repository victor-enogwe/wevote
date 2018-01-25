import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getNews, getImage } from '../../actions/newsActions';

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
            <div>
                {news && news.map(newsItem =>
                    <div key={newsItem.id}>
                        {newsItem.image && <img src={newsItem.image} width='50px' />}
                        <p>
                            {newsItem.title}
                        </p>
                    </div>
                )}
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