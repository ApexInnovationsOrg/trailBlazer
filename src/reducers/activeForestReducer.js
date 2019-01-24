import { SET_ACTIVE_FOREST } from '../actions/types';

const initialState = {
    id:-1,
    forestName:'none selected'
}
    



export default function(state=initialState, action){
    switch(action.type){
        
        case SET_ACTIVE_FOREST:
                return action.payload.forest;
        default:
            return state;
    }
}

