import toastr from 'toastr';
import { ajaxCallError } from "../actions/ajaxStatusActions";

/**
 * Handles errors from ajax calls
 * @param {object} error
 * @param {function} dispatch
 * @returns {function} error display
 */
export function handleError(error, dispatch) {
    if (dispatch) {
        dispatch(ajaxCallError());
    }
    if (error.response) {
        return toastr.error(error.response.data.message);
    }
    return toastr.error('Something went wrong');
}

/**
 * Ends ajax call and throws error to be handled in component
 * @param {object} error
 * @param {function} dispatch
 */
export function throwError(error, dispatch) {
    dispatch(ajaxCallError());
    throw error;
}
