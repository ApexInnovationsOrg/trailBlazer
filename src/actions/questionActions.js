import {
    SET_NEW_ANSWERS
} from './types';

export function updateNewQuestion(question,answers){
    return dispatch =>{
        console.log('updating new question');
        dispatch(alterQuestion({
            questionText:question,
            answers:answers
        }));

        const initialState = {
            questionText:'',
            answers:[
            {
                answerText:''
            },{
                answerText:''
            }]
        }
    }

}

export const alterQuestion = question => (
    {
    type: SET_NEW_ANSWERS,
    payload:{question}
  });


  