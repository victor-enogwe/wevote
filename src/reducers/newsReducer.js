import actionTypes from '../actions/constants';
import initialState from '../store/initialState';

const { DISPLAY_NEWS_AJAX, DISPLAY_IMAGE } = actionTypes;

function getRelevantDetails(post){
    return {
        id: post.id,
        date: post.date,
        link: post.link,
        title: post.title.rendered,
        media: post.featured_media,
        excerpt: post.excerpt.rendered
    };
}

function addImageToPost(state, payload){
    let posts = state.slice();
    let postIndex = posts.findIndex(post =>
        post.id === payload.post_id
    );
    if (postIndex === -1) return state;
    posts[postIndex].image = payload.source_url;
    return posts;
}

export function news(state=initialState.news, action){
    switch(action.type){
        case DISPLAY_NEWS_AJAX:
            return action.payload.map(getRelevantDetails);
        case DISPLAY_IMAGE:
            return addImageToPost(state, action.payload);
        default:
            return state;
    }
}
