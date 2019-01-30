import {
    FETCH_TREE_BEGIN,
    FETCH_TREE_SUCCESS,
    FETCH_TREE_FAILURE,
    SET_ACTIVE_TREE
} from './types';

export function getTree(tree){
    return dispatch =>{
        console.log('getting tree',tree);
        dispatch(setActiveTree(tree));
        dispatch(fetchTreeBegin());
        return fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Forest',
                action:'getTree',
                data:tree.ID
            })
        })
            .then(handleErrors)
            .then(res => res.json())
            .then(json => { 
                if(!json.success) 
                {
                    dispatch(fetchTreeFailure(json.errormsg));
                }
                else
                {
                    dispatch(fetchTreeSuccess(json.data));
                    return json.data;
                }
            })
            .catch(error => dispatch(fetchTreeFailure(error)));
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