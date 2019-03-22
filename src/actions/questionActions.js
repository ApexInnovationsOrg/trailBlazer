import {
    SET_NEW_ANSWERS,
    SAVE_QUESTION_BEGIN,
    SAVE_QUESTION_SUCCESS,
    SAVE_QUESTION_FAILURE
} from './types';

import {getTree} from './getTree';

export function updateNewQuestion(question,answers){
    return dispatch =>{
        // console.log('updating new question');
        dispatch(alterQuestion({
            questionText:question,
            answers:answers
        }));

        // const initialState = {
        //     questionText:'',
        //     answers:[
        //     {
        //         answerText:''
        //     },{
        //         answerText:''
        //     }]
        // }
    }

}

export function saveQuestion(data){
    return dispatch => {
        dispatch(savingQuestion());
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Question',
                action:'createNewQuestion',
                treeID:data.treeID,
                question:data.question,
                answers:data.answers
            })
        })
        .then(res=>res.json())
        .then(json=>{
            if(!json.success)
            {
                dispatch(saveQuestionErr(json.errormsg));
            }
            else
            {
                dispatch(savedQuestion())
            }
        })
        .then(()=>{
            dispatch(getTree({ID:data.treeID}));
        })
        
    }
}


export const alterQuestion = question => (
    {
    type: SET_NEW_ANSWERS,
    payload:{question}
  });


export const savingQuestion = ()=>(
    {
        type:SAVE_QUESTION_BEGIN
    });

export const savedQuestion = ()=>(
    {
        type:SAVE_QUESTION_SUCCESS
    });

export const saveQuestionErr = (error) =>(
    {
        type:SAVE_QUESTION_FAILURE,
        payload:{error}
    });    