import { combineReducers } from 'redux';
import { user } from './userReducer';
import { currentModal } from './modalReducer';
import { news } from './newsReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';

const rootReducer = combineReducers({
    user,
    currentModal,
    news,
    ajaxCallsInProgress
});

export default rootReducer;
