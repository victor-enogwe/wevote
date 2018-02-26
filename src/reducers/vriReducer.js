import initialState from "../store/initialState";
import actionTypes from '../actions/constants';
const { SAVE_VRI_AJAX, GET_USER_VRI_AJAX, GET_VRIS_AJAX, SAVE_TEMP_VRI } = actionTypes;

function getResponses(choices){
    let responses = {};
    choices.forEach((choice) => {
       responses[choice.code] = choice.choice;
    });
    return responses;
}

export function vri(state=initialState.vri, action){
    switch(action.type){
        case GET_VRIS_AJAX:
            return {...state, vris: action.payload};
        case SAVE_VRI_AJAX:
            return {...state, responses: action.payload};
        case GET_USER_VRI_AJAX:
            return {...state,
                responses: getResponses(action.payload.data),
                score: action.payload.score};
        case SAVE_TEMP_VRI:
            return {...state, choices: action.payload.choices, score: action.payload.score};
        default:
            return state;
    }
}
