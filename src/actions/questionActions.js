import {
    SET_NEW_ANSWERS,
    SAVE_QUESTION_BEGIN,
    SAVE_QUESTION_SUCCESS,
    SAVE_QUESTION_FAILURE
} from './types';

import {getTree} from './getTree';
import store from '../store';


export function updateNewQuestion(question,answers){
    return dispatch =>{
        // console.log('updating new question');
        dispatch(alterQuestion({
            questionText:question,
            answers:answers
        }));
    }

}

export function setMasterQuestion(tree)
{
    return dispatch => {
        return dispatch(getTree(tree));
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
                answers:data.answers,
                positionX:data.positionX,
                positionY:data.positionY
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

export function saveSingleAnswer(data){
    return dispatch =>{
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Answer',
                action:'createnewanswer',
                questionID:data.questionID,
                answerText:data.answerText
            })
        })
        .then(res=>res.json())
        .then(json=>{
            let state = store.getState();
			return store.dispatch(getTree(state['activeTree']));
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