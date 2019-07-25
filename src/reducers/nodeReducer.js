import { SET_NEW_ANSWERS } from '../actions/types';

const initialState = {
    nodeText:'',
    answers:[
    {
        answerText:''
    },{
        answerText:''
    }]
}
    



export default function(state=initialState, action){
    switch(action.type){
        
        case SET_NEW_ANSWERS:
                return action.payload;
        default:
            return state;
    }
}

