import { FETCH_TREE_BEGIN, FETCH_TREE_SUCCESS, FETCH_TREE_FAILURE } from '../actions/types';

const initialState = {
    nodes:[
        // {
        //     'ID' : '1',
        //     'NodeText' :'Nodes booting',
        //     'Active' : 'Y',
        //     'CreationDate' : '0000-00-00 00:00:00',
        //     'Weight' : '2',
        //     'TreeID' : '-1',
        //     'Answers' : []
        // }
    ],
    error:null,
    loading:false
}
    



export default function(state=initialState, action){
    switch(action.type){

        case FETCH_TREE_BEGIN:
                //console.log('fetching tree');
                return {
                    ...state,
                    loading:true,
                    error:null,
                    nodes:[
                        // {
                            //     'ID' : '1',
                            //     'NodeText' :'Nodes booting',
                            //     'Active' : 'Y',
                            //     'CreationDate' : '0000-00-00 00:00:00',
                            //     'Weight' : '2',
                            //     'TreeID' : '-1',
                            //     'Answers' : []
                            // }
                        ]
                    }
        case FETCH_TREE_SUCCESS:
                    // //console.log('heres the payload',action);
                    //console.log('fetched tree');
                return Object.assign({},action.payload,{
                    loading:false,
                    error:null,
                    treeHistory:state
                })
        case FETCH_TREE_FAILURE:
            return {
                nodes:[
                    // {
                    //     'ID' : '1',
                    //     'NodeText' :'Nodes booting',
                    //     'Active' : 'Y',
                    //     'CreationDate' : '0000-00-00 00:00:00',
                    //     'Weight' : '2',
                    //     'TreeID' : '-1',
                    //     'Answers' : []
                    // }
                ],
                error:action.payload.error,
                loading:false
            }
        default:
            return state;
    }
}

