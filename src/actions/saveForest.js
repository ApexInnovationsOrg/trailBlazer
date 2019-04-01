import {
    FETCH_TREE_BEGIN,
    FETCH_TREE_SUCCESS,
    FETCH_TREE_FAILURE,
    SET_ACTIVE_TREE
} from './types';
import {getAllForests} from './getForest';

export function saveForest(data){
    return dispatch =>{
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Forest',
                action:'createForest',
                name:data.name
            })
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => { 

                    dispatch(getAllForests());

            })

    }
    
}

function handleErrors(response)
{
    if(!response.ok){ 
        throw Error(response.statusText);
    }
    return response;
}
export const setActiveTree = tree => ({
    type: SET_ACTIVE_TREE,
    payload:{tree}
  });

export const fetchTreeBegin = () => ({
    type: FETCH_TREE_BEGIN
  });
  
  export const fetchTreeSuccess = questions => ({
    type: FETCH_TREE_SUCCESS,
    payload:{ questions }
  });
  
  export const fetchTreeFailure = error => ({
    type: FETCH_TREE_FAILURE,
    payload: { error }
  });