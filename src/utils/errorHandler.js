import toastr from 'toastr';

/**
 * Handles errors from ajax calls
 * @param {object} error
 * @param {function} dispatch
 * @returns {function} error display
 */
export function handleError(error) {
    return toastr.error(error);
}

/**
 * Ends ajax call and throws error to be handled in frontend
 * @param {object} error
 * @param {function} dispatch
 */
export function throwError(error, dispatch) {
    throw error;
}
