import { combineReducers } from 'redux';
import { user } from './userReducer';
import { currentModal } from './modalReducer';

const rootReducer = combineReducers({
    user,
    currentModal
});

export default rootReducer;