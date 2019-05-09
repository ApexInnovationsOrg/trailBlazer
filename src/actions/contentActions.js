import {

} from './types';



export function saveContent(data){

   
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Content',
                action: data.ID === -1 ? 'createNewContent' : 'updateContent',
                questionID:data.questionID,
                contentID:data.ID,
                content:JSON.stringify(data.content)
            })
        })
        .then(res=>res.json())
        .then(json=>{
            return json;
        })
    }

    export function deleteContent(data){

   
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Content',
                action: 'deleteContent',
                contentID:data.ID,
            })
        })
        .then(res=>res.json())
        .then(json=>{
            return json;
        })
    }


// export const alterQuestion = question => (
//     {
//     type: SET_NEW_ANSWERS,
//     payload:{question}
//   });


// export const savingNode = ()=>(
//     {
//         type:SAVE_NODE_BEGIN
//     });

// export const savedQuestion = ()=>(
//     {
//         type:SAVE_NODE_SUCCESS
//     });

// export const saveNodeErr = (error) =>(
//     {
//         type:SAVE_NODE_FAILURE,
//         payload:{error}
//     });    