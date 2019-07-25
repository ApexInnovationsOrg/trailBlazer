import {
    FETCH_TREE_BEGIN,
    FETCH_TREE_SUCCESS,
    FETCH_TREE_FAILURE,
    SET_ACTIVE_TREE
} from './types';

export function getTree(tree){
    return dispatch =>{
        dispatch(setActiveTree(tree));
        dispatch(fetchTreeBegin());
        return fetch(process.env.REACT_APP_API_LOCATION,{
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

                    

                   dispatch(fetchTreeSuccess(json.data.map((node) => {
                        node.Contents.map((content)=>{
                            content.Content = JSON.parse(content.Content);
                            return content;
                        })

                        return node;
                    })));
                    // //console.log('fetch tree success');
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
  
  export const fetchTreeSuccess = nodes => ({
    type: FETCH_TREE_SUCCESS,
    payload:{ nodes }
  });
  
  export const fetchTreeFailure = error => ({
    type: FETCH_TREE_FAILURE,
    payload: { error }
  });