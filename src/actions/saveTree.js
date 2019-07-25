import {
    FETCH_TREE_BEGIN,
    FETCH_TREE_SUCCESS,
    FETCH_TREE_FAILURE,
    SET_ACTIVE_TREE
} from './types';
import {getSingleForest} from './getForest';
import {getTree} from './getTree'

export function saveTree(data){
    return dispatch =>{
        console.log('int he savetree funct',data);
        return fetch(process.env.REACT_APP_API_LOCATION,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                controller:'Forest',
                action:'createTree',
                name:data.name,
                forestID:data.forestID
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
                    const forest = dispatch(getSingleForest({ID:data.forestID}));
                    forest.then(dispatch(getTree({ID:json.data})));
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
  
  export const fetchTreeSuccess = nodes => ({
    type: FETCH_TREE_SUCCESS,
    payload:{ nodes }
  });
  
  export const fetchTreeFailure = error => ({
    type: FETCH_TREE_FAILURE,
    payload: { error }
  });