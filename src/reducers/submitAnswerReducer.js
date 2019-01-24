import {
    SUBMIT_ANSWER_BEGIN,
    SUBMIT_ANSWER_SUCCESS,
    SUBMIT_ANSWER_FAILURE
} from '../actions/types';

const initialState = {
    ID:-1,
    loading:false,
    error:null
}

export default function(state=initialState, action){
    switch(action.type){
        case SUBMIT_ANSWER_BEGIN:
            return {
                ...state,
                loading:true,
                error:null,
                answers:[]
            }
        case SUBMIT_ANSWER_SUCCESS:
            return Object.assign({},action.payload,{
                loading:false,
                error:null,
                answers:[]
            })
        case SUBMIT_ANSWER_FAILURE:
        return {
            answers:[

            ],
            error:action.payload.error,
            loading:false
        }
        default:
            return state;
    }
}

