import axios from 'axios';
import jwt from 'jsonwebtoken';

import setAccessToken from '../utils/setAccessToken';
import { handleError } from '../utils/errorHandler';

import actionTypes from './constants';

const { MODAL_CHOICE, SIGN_UP, SIGN_IN, USER_DATA } = actionTypes;

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
        payload: uuid
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
        return axios.post(`${API_URL}/user/create`, user)
            .then((res) => {
                saveToken(res.data, SIGN_UP, dispatch);
            })
            .catch(error => handleError(error));
    };
}

/**
 * Thunk that signs in a user
 * @param {object} user
 * @returns {function} saveToken
 */
export function signIn(user){
    return (dispatch) => {
        return axios.post(`${API_URL}/auth/basic`, user)
            .then((res) => {
                saveToken(res.data, SIGN_IN, dispatch);
            })
            .catch(error => handleError(error));
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
        payload: user
    };
}

/**
 * Thunk that gets user details
 * @param {object} uuid
 * @returns {function} saveToken
 */
export function getUser(uuid){
    return (dispatch) => {
        return axios.get(`${API_URL}/user/fetch/${uuid}`)
            .then((res) => {
                dispatch(provideUserData(USER_DATA, res.data.data))
            })
            .catch(error => handleError(error));
    };
}
