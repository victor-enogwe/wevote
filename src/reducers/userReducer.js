import actionTypes from '../actions/constants';
import initialState from "../store/initialState";

const { TEST } = actionTypes;
export function user(state=initialState.user, action){
    switch(action.type){
        case TEST:
            return action.payload.name;
        default:
            return state;
    }
}
