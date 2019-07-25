import {
    SET_NEW_ANSWERS,
    SAVE_QUESTION_BEGIN,
    SAVE_QUESTION_SUCCESS,
    SAVE_QUESTION_FAILURE
} from './types';

import {getTree} from './getTree';
import store from '../store';


export function updateNewNode(node,answers){
    return dispatch =>{
        // //console.log('updating new node');
        dispatch(alterNode({
            nodeText:node,
            answers:answers
        }));
    }

}

export function setMasterNode(tree)
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
                node:data.node,
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
                dispatch(savedNode())
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
                nodeID:data.nodeID,
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


export const alterNode = node => (
    {
    type: SET_NEW_ANSWERS,
    payload:{node}
  });


export const savingNode = ()=>(
    {
        type:SAVE_QUESTION_BEGIN
    });

export const savedNode = ()=>(
    {
        type:SAVE_QUESTION_SUCCESS
    });

export const saveNodeErr = (error) =>(
    {
        type:SAVE_QUESTION_FAILURE,
        payload:{error}
    });    