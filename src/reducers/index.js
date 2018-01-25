import { combineReducers } from 'redux';
import { user } from './userReducer';
import { currentModal } from './modalReducer';
import { news } from './newsReducer';

const rootReducer = combineReducers({
    user,
    currentModal,
    news,
});

export default rootReducer;