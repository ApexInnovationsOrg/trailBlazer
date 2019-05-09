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


// export const savingQuestion = ()=>(
//     {
//         type:SAVE_QUESTION_BEGIN
//     });

// export const savedQuestion = ()=>(
//     {
//         type:SAVE_QUESTION_SUCCESS
//     });

// export const saveQuestionErr = (error) =>(
//     {
//         type:SAVE_QUESTION_FAILURE,
//         payload:{error}
//     });    