import actionTypes from './constants';

const { TEST } = actionTypes;

export function test(){
    return {
        type: TEST,
        payload: {
            name: 'kingobi'
        }
    };
}