import { SET_NEW_ANSWERS } from '../actions/types';

const initialState = {
    questionText:'',
    answers:[
    {
        answerText:''
    },{
        answerText:''
    }]
}
    



export default function(state=initialState, action){
    console.log('hmmm',action);
    switch(action.type){
        
        case SET_NEW_ANSWERS:
                console.log('setting new answers');
                return action.payload;
        default:
            return state;
    }
}

