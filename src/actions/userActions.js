import actionTypes from './constants';

const { TEST, MODAL_CHOICE } = actionTypes;

export function test(){
    return {
        type: TEST,
        payload: {
            name: 'kingobi'
        }
    };
}

export function selectModal(modal){
    return {
        type: MODAL_CHOICE,
        payload: modal
    };
}