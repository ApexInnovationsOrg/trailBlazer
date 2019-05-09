import { SET_ACTIVE_TREE } from '../actions/types';

const initialState = {
    ID:'-1',
    treeName:'none selected',
    MasterNodeID:'-1'
}
    



export default function(state=initialState, action){
    switch(action.type){
        
        case SET_ACTIVE_TREE:
                return action.payload.tree;
        default:
            return state;
    }
}

