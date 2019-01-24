import { FETCH_ANSWERS_BEGIN, FETCH_ANSWERS_FAILURE, FETCH_ANSWERS_SUCCESS } from '../actions/types';

const initialState = {
    answers:[
        {
            ID:1,
            selected:false,
            AnswerText: "Answers booting up"
        }
    ],
    error:null,
    loading:false
}
    



export default function(state=initialState, action){
    console.log('in the reducer', action);
    switch(action.type){
        // case SELECT_ANSWER:
        //     console.log('heres the action',action)
        //     return {

        //         ...state,
        //         answer:action
        //     }
        // case SUBMIT_ANSWER:
        //     console.log('submitting answer');
        //     // return {

        //     //     ...state,
        //     //     items:action.payload
        //     // }
        //     break;

        case FETCH_ANSWERS_BEGIN:
                return {
                    ...state,
                    loading:true,
                    error:null,
                    answers:[]
                }
        case FETCH_ANSWERS_SUCCESS:
                return Object.assign({},action.payload,{
                    loading:false,
                    error:null,
                    answerHistory:state
                })
        case FETCH_ANSWERS_FAILURE:
            return {
                answers:[

                ],
                error:action.payload.error,
                loading:false
            }
        default:
            // console.log('is default immediately hit');
            return state;
    }
}

