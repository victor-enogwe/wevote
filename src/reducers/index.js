import { combineReducers } from 'redux';
import { user } from './userReducer';
import { currentModal } from './modalReducer';
import { news } from './newsReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import { vri } from './vriReducer'

const rootReducer = combineReducers({
    user,
    currentModal,
    news,
    ajaxCallsInProgress,
    vri
});

export default rootReducer;
