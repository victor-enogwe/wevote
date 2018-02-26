import axios from 'axios';
const { API_URL } = process.env;

import { beginAjaxCall } from "./ajaxStatusActions";

import actionTypes from './constants';
import { handleError } from '../utils/errorHandler';

const { DISPLAY_NEWS_AJAX, DISPLAY_IMAGE } = actionTypes;

export function getNews(){
    return (dispatch) => {
        dispatch(beginAjaxCall());
        return axios.get(`${API_URL}/news/news`)
            .then((res) => {
                dispatch(displayNews(res.data.data));
            })
            .catch(error => handleError(error, dispatch));
    };
}

export function getImage(media_id){
    return (dispatch) => {
        return axios.get(`${API_URL}/news/images?media_id=${media_id}`)
            .then((res) => {
                dispatch(displayImage(res.data.data.post, res.data.data.source_url));
            })
            .catch(error => handleError(error, dispatch));
    };
}

function displayNews(posts) {
    return {
        type: DISPLAY_NEWS_AJAX,
        payload: posts,
        error: false
    };
}

function displayImage(post_id, source_url){
    return {
      type: DISPLAY_IMAGE,
        payload: {
          post_id,
          source_url
      }
    };
}
