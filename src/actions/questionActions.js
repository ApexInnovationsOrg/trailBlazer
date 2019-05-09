import {
    SET_NEW_ANSWERS,
    SAVE_NODE_BEGIN,
    SAVE_NODE_SUCCESS,
    SAVE_NODE_FAILURE
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

export function saveNode(data){

    return dispatch => {
        dispatch(savingNode());
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Node',
                action:'createNewNode',
                treeID:data.treeID,
                nodeText:data.nodeText,
                answers:data.answers,
                positionX:data.positionX,
                positionY:data.positionY
            })
        })
        .then(res=>res.json())
        .then(json=>{
            if(!json.success)
            {
                dispatch(saveNodeErr(json.errormsg));
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


export const savingNode = ()=>(
    {
        type:SAVE_NODE_BEGIN
    });

export const savedQuestion = ()=>(
    {
        type:SAVE_NODE_SUCCESS
    });

export const saveNodeErr = (error) =>(
    {
        type:SAVE_NODE_FAILURE,
        payload:{error}
    });    