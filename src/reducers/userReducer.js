import actionTypes from '../actions/constants';
import initialState from "../store/initialState";

const { SIGN_IN, SIGN_UP, USER_DATA } = actionTypes;

export function user(state=initialState.user, action){
    switch(action.type){
        case SIGN_IN:
            return {
                isAuthenticated: true,
                uuid: action.payload
            };
        case SIGN_UP:
            return {
                isAuthenticated: true,
                uuid: action.payload
            };
        case USER_DATA:
            return {...state, profile: action.payload};
        default:
            return state;
    }
}
