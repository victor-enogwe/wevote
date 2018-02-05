import actionTypes from '../actions/constants';
import initialState from "../store/initialState";

const { SIGN_IN_AJAX, SIGN_UP_AJAX, USER_DATA_AJAX } = actionTypes;

export function user(state=initialState.user, action){
    switch(action.type){
        case SIGN_IN_AJAX:
            return {
                isAuthenticated: true,
                uuid: action.payload
            };
        case SIGN_UP_AJAX:
            return {
                isAuthenticated: true,
                uuid: action.payload
            };
        case USER_DATA_AJAX:
            return {...state, profile: action.payload};
        default:
            return state;
    }
}
