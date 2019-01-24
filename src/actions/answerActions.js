import {SELECT_ANSWER, 
    FETCH_ANSWERS_BEGIN,
    FETCH_ANSWERS_SUCCESS,
    FETCH_ANSWERS_FAILURE,
    SUBMIT_ANSWER_BEGIN,
    SUBMIT_ANSWER_SUCCESS,
    SUBMIT_ANSWER_FAILURE} from './types';


import {getQuestion} from './getQuestion';

export function getAnswers(){
    return dispatch => {
        dispatch(fetchAnswersBegin());
        return fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Exam',
                action:'getAnswers'
            })
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => { 
                if(!json.success) 
                {
                    dispatch(fetchAnswerFailure(json.errormsg));
                }
                else
                {
                    dispatch(fetchAnswerSuccess(json.data));
                    return json.data;
                }
            })
            .catch(error => dispatch(fetchAnswerFailure(error)));

    }
}
 
export function submitAnswer(activeAnswer){
    console.log('submit answer function',activeAnswer);
    return dispatch => {
        dispatch(submitAnswerBegin());
        return fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Exam',
                action:'submitAnswer',
                data:activeAnswer.ID
            })

        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                if(!json.success)
                {
                    dispatch(submitAnswerFailure(json.errormsg));
                }
                else
                {
                    dispatch(submitAnswerSuccess(json.data));
                    
                    dispatch(getQuestion());
                    this.getAnswers();
                    return json.data;


                }
            })
            .catch(error=>dispatch(submitAnswerFailure(error)));
    }
}

function handleErrors(response)
{
    if(!response.ok){
        throw Error(response.statusText);
    }
    return response;
}

export const fetchAnswersBegin = () => ({
    type: FETCH_ANSWERS_BEGIN
  });
  
  export const fetchAnswerSuccess = answers => ({
    type: FETCH_ANSWERS_SUCCESS,
    payload: { answers }
  });
  
  export const fetchAnswerFailure = error => ({
    type: FETCH_ANSWERS_FAILURE,
    payload: { error }
  });

export const selectAnswer = (answer) => {
    return {
        type: SELECT_ANSWER,
        payload: answer
    }
}

export const submitAnswerBegin = (answer) => {
    return {
        type: SUBMIT_ANSWER_BEGIN,
        payload: answer
    }
}

export const submitAnswerSuccess = (answer) => {
    return {
        type: SUBMIT_ANSWER_SUCCESS,
        payload: answer
    }
}

export const submitAnswerFailure = (answer) => {
    return {
        type: SUBMIT_ANSWER_FAILURE,
        payload: answer
    }
}