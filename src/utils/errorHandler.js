import toastr from 'toastr';

/**
 * Handles errors from ajax calls
 * @param {object} error
 * @param {function} dispatch
 * @returns {function} error display
 */
export function handleError(error, dispatch) {
    if (dispatch) {
        return toastr.error(error);
    }
    return toastr.error('Something went wrong');
}

/**
 * Ends ajax call and throws error to be handled in frontend
 * @param {object} error
 * @param {function} dispatch
 */
export function throwError(error, dispatch) {
    throw error;
}