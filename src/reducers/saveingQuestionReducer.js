import { SAVE_NODE_BEGIN,
    SAVE_NODE_SUCCESS,
    SAVE_NODE_FAILURE } from '../actions/types';

const initialState = {
    error:null,
    loading:false
}
    



export default function(state=initialState, action){
    switch(action.type){
        case SAVE_NODE_BEGIN:
            return {
                loading:true,
                error:null
            }
        case SAVE_NODE_SUCCESS:
            return {
                loading:false,
                error:null
            }
        case SAVE_NODE_FAILURE:
            return {
                loading:false,
                error:action.payload
            }
        
        default:
            return state;
    }
}
