import { TEST } from '../actions/constants';
import initialState from "../store/initialState";

export function user(state=initialState.user, action){
    switch(action.type){
        case TEST:
            return action.payload.name;
        default:
            return state;
    }
}
