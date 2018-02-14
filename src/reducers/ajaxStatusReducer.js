import actionTypes from '../actions/constants';
import initialState from "../store/initialState";

const { BEGIN_AJAX_CALL, AJAX_CALL_ERROR } = actionTypes;


/**
 * Check if a ajax action is dispatched
 * @param {string} type
 * @returns {boolean}
 */
function isAjax(type) {
    return type.substring(type.length - 5) === '_AJAX';
}


/**
 * Reducer for ajax calls
 * @param {number} [state=initialState.ajaxCallsInProgress]
 * @param {object} action
 * @returns {number}
 */
export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    if (action.type === BEGIN_AJAX_CALL) {
        return state + 1;
    } else if (action.type === AJAX_CALL_ERROR || (isAjax(action.type) && !action.error)) {
        if (state > 0) {
            return state - 1;
        }
        return state;
    }
    return state;
}
