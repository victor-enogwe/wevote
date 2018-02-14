import actionTypes from './constants';
const { BEGIN_AJAX_CALL, AJAX_CALL_ERROR} = actionTypes;

/**
 * Action creator that's called when ajax call begins
 * @returns {object} action
 */
export function beginAjaxCall() {
    return { type: BEGIN_AJAX_CALL };
}

/**
 * Action creator that starts when ajax call ends
 * @returns {object} action
 */
export function ajaxCallError() {
    return { type: AJAX_CALL_ERROR };
}
