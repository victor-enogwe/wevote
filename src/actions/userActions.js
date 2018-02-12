import axios from 'axios';
import jwt from 'jsonwebtoken';

import { beginAjaxCall } from "./ajaxStatusActions";

import setAccessToken from '../utils/setAccessToken';
import { handleError, throwError } from '../utils/errorHandler';

import actionTypes from './constants';

const { MODAL_CHOICE, SIGN_UP_AJAX, SIGN_IN_AJAX, USER_DATA_AJAX } = actionTypes;

const { API_URL } = process.env;

export function selectModal(modal){
    return {
        type: MODAL_CHOICE,
        payload: modal
    };
}

/**
 * Action creator called after user logs in or registers
 * @param {number} token
 * @param {string} type
 * @returns {object} action to dispatch
 */
export function login(token, type) {
    setAccessToken(token);
    const decoded = jwt.decode(token);
    const uuid = decoded.uuid;
    return {
        type,
        payload: uuid,
        error: false
    };
}

/**
 * This function saves token to localStorage and dispatches login
 * @param {object} response
 * @param {string} type
 * @param {function} dispatch
 */
function saveToken(response, type, dispatch) {
    const token = response.data.token;
    const tokenStorage = JSON.stringify({
        jwt: token
    });
    localStorage.setItem('wevote', tokenStorage);
    dispatch(login(token, type));
}

/**
 * Thunk that creates a new user
 * @param {object} user
 * @returns {function} saveToken
 */
export function signUp(user){
    return (dispatch) => {
        dispatch(beginAjaxCall());
        return axios.post(`${API_URL}/user/create`, user)
            .then((res) => {
                saveToken(res.data, SIGN_UP_AJAX, dispatch);
            })
            .catch(error => throwError(error, dispatch));
    };
}

/**
 * Thunk that signs in a user
 * @param {object} user
 * @returns {function} saveToken
 */
export function signIn(user){
    return (dispatch) => {
        dispatch(beginAjaxCall());
        return axios.post(`${API_URL}/auth/basic`, user)
            .then((res) => {
                saveToken(res.data, SIGN_IN_AJAX, dispatch);
            })
            .catch(error => throwError(error, dispatch));
    };
}

/**
 * This function makes the user data available to the app
 * @param {string} type
 * @param {object} user
 */
function provideUserData(type, user){
    return {
        type,
        payload: user,
        error: false
    };
}

/**
 * Thunk that gets user details
 * @param {object} uuid
 * @returns {function} saveToken
 */
export function getUser(uuid){
    return (dispatch) => {
        dispatch(beginAjaxCall());
        return axios.get(`${API_URL}/user/fetch/${uuid}`)
            .then((res) => {
                dispatch(provideUserData(USER_DATA_AJAX, res.data.data))
            })
            .catch(error => handleError(error, dispatch));
    };
}


/**
 * Thunk that signs up a user on Facebook
 * @param {object} user
 * @returns {function} saveToken
 */
export function facebookAuth(){
    return (dispatch) => {
        return axios.get(`${API_URL}/auth/facebook`)
            .then((res) => {
                console.log('Res', res.data);
            })
            .catch(error => handleError(error));
    };
}


/**
 * Thunk that signs up a user on Twitter
 * @param {object} user
 * @returns {function} saveToken
 */
export function twitterAuth(){
    return (dispatch) => {
        return axios.get(`${API_URL}/auth/twitter`)
            .then((res) => {
                console.log('Res', res.data);
            })
            .catch(error => handleError(error));
    };
}
