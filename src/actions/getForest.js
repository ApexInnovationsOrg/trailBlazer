import {
    FETCH_ALL_FORESTS_BEGIN, 
    FETCH_ALL_FORESTS_SUCCESS, 
    FETCH_ALL_FORESTS_FAILURE
} from './types';


export function getAllForests(){
    return dispatch => {
        dispatch(fetchAllForestsBegin());
        return fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Forest',
                action:'getAllForests'
            })
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => { 
                if(!json.success) 
                {
                    dispatch(fetchAllForestsFailure(json.errormsg));
                }
                else
                {
                    dispatch(fetchAllForestsSuccess(json.data));
                    return json.data;
                }
            })
            .catch(error => dispatch(fetchAllForestsFailure(error)));

    }
}

function handleErrors(response)
{
    if(!response.ok){ 
        throw Error(response.statusText);
    }
    return response;
}

export const fetchAllForestsBegin = () => ({
    type: FETCH_ALL_FORESTS_BEGIN
  });
  
  export const fetchAllForestsSuccess = forests => ({
    type: FETCH_ALL_FORESTS_SUCCESS,
    payload:{ forests }
  });
  
  export const fetchAllForestsFailure = error => ({
    type: FETCH_ALL_FORESTS_FAILURE,
    payload: { error }
  });