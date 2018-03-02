import axios from 'axios';
import jwt from 'jsonwebtoken';

import { beginAjaxCall } from "./ajaxStatusActions";

import setAccessToken from '../utils/setAccessToken';
import { handleError, throwError } from '../utils/errorHandler';

import actionTypes from './constants';

const { MODAL_CHOICE, SIGN_UP_AJAX, SIGN_IN_AJAX, USER_DATA_AJAX, CONFIRM_PHONE_AJAX } = actionTypes;

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
 * Saves token to localStorage and dispatches login
 * @param {object} response
 * @param {string} type
 * @param {function} dispatch
 */
function saveToken(response, type, dispatch) {
    const token = response.data.token;
    const decodedToken = jwt.decode(token);
    const tokenExpiry = decodedToken.exp;
    const tokenStorage = JSON.stringify({
        jwt: token,
        exp: tokenExpiry
    });
    localStorage.setItem('wevote', tokenStorage);
    dispatch(login(token, type));
}

/**
 * Creates a new user
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
 * Thunk that confirms phone number
 * @param {number} number
 * @returns {function} provideSurname
 */
export function confirmPhone(number){
    return (dispatch) => {
        dispatch(beginAjaxCall());
        return axios.post(`${API_URL}/auth/confirm`, number)
            .then((res) => {
                dispatch(provideSurname(CONFIRM_PHONE_AJAX, res.data.data.surname));
            })
            .catch(error => handleError(error, dispatch));
    };
}

/**
 * Provides surname for user authentication
 * @param {string} type
 * @param {object} surname
 */
function provideSurname(type, surname){
    return {
        type,
        payload: surname,
        error: false
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
