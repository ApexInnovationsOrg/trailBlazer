import {SELECT_ANSWER} from '../actions/types';

const initialState = {
    id:-1,
    answerText:'no answer selected'
}

export default function(state=initialState, action){
    switch(action.type){
        case SELECT_ANSWER:
            return action.payload;
            
        default:
            return state;
    }
}


