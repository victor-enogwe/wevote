import actionTypes from '../actions/constants';
import initialState from "../store/initialState";

const { SAVE_VRI_AJAX, GET_USER_VRI_AJAX, GET_VRIS_AJAX, SAVE_TEMP_VRI } = actionTypes;

export function vri(state=initialState.vri, action){
    switch(action.type){
        case GET_VRIS_AJAX:
            return {...state, vris: action.payload};
        case SAVE_VRI_AJAX:
            return {...state, userVRI: action.payload};
        case GET_USER_VRI_AJAX:
            return {...state, userVRI: action.payload, score: action.payload.score};
        case SAVE_TEMP_VRI:
            return {...state, choices: action.payload.choices, score: action.payload.score};
        default:
            return state;
    }
}
