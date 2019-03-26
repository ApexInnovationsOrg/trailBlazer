import {
    FETCH_ALL_FORESTS_BEGIN, 
    FETCH_ALL_FORESTS_SUCCESS, 
    FETCH_ALL_FORESTS_FAILURE,
    FETCH_FOREST_BEGIN,
    FETCH_FOREST_SUCCESS,
    FETCH_FOREST_FAILURE,
    SET_ACTIVE_FOREST
} from './types';


export function getAllForests(){
    return dispatch => {
        dispatch(fetchAllForestsBegin());
        return fetch(process.env.REACT_APP_API_LOCATION,{
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

export function getSingleForest(forest){
    return dispatch =>{

        dispatch(setActiveForest(forest));
        dispatch(fetchSingleForestBegin());
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Forest',
                action:'getSingleForest',
                data:forest.ID
            })
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => { 
                if(!json.success) 
                {
                    dispatch(fetchSingleFailure(json.errormsg));
                }
                else
                {
                    dispatch(fetchSingleSuccess(json.data));
                    return json.data;
                }
            })
            .catch(error => dispatch(fetchSingleFailure(error)));
    }
    
}

function handleErrors(response)
{
    if(!response.ok){ 
        throw Error(response.statusText);
    }
    return response;
}

export const setActiveForest = (forest) =>({
    type:SET_ACTIVE_FOREST,
    payload:{forest}
})

export const fetchSingleForestBegin = () => ({
    type: FETCH_FOREST_BEGIN
});
  
export const fetchSingleSuccess = trees => ({
    type: FETCH_FOREST_SUCCESS,
    payload:{ trees }
});

export const fetchSingleFailure = error => ({
    type: FETCH_FOREST_FAILURE,
    payload: { error }
});

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