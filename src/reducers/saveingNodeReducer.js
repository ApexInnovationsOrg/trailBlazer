import { SAVE_QUESTION_BEGIN,
    SAVE_QUESTION_SUCCESS,
    SAVE_QUESTION_FAILURE } from '../actions/types';

const initialState = {
    error:null,
    loading:false
}
    



export default function(state=initialState, action){
    switch(action.type){
        case SAVE_QUESTION_BEGIN:
            return {
                loading:true,
                error:null
            }
        case SAVE_QUESTION_SUCCESS:
            return {
                loading:false,
                error:null
            }
        case SAVE_QUESTION_FAILURE:
            return {
                loading:false,
                error:action.payload
            }
        
        default:
            return state;
    }
}
