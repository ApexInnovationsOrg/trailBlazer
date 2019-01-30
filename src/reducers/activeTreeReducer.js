import { SET_ACTIVE_TREE } from '../actions/types';

const initialState = {
    id:-1,
    treeName:'none selected',
    masterQuestion:-1
}
    



export default function(state=initialState, action){
    switch(action.type){
        
        case SET_ACTIVE_TREE:
                return action.payload.tree;
        default:
            return state;
    }
}

