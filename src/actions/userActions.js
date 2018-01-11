import { TEST } from './constants';

export function test(){
    return {
        type: TEST,
        payload: {
            name: 'kingobi'
        }
    };
}