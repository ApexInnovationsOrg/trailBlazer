import { FETCH_TREE_BEGIN, FETCH_TREE_SUCCESS, FETCH_TREE_FAILURE } from '../actions/types';

const initialState = {
    questions:[
        // {
        //     'ID' : '1',
        //     'QuestionText' :'Questions booting',
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
                return {
                    ...state,
                    loading:true,
                    error:null,
                    questions:[
                        // {
                        //     'ID' : '1',
                        //     'QuestionText' :'Questions booting',
                        //     'Active' : 'Y',
                        //     'CreationDate' : '0000-00-00 00:00:00',
                        //     'Weight' : '2',
                        //     'TreeID' : '-1',
                        //     'Answers' : []
                        // }
                    ]
                }
        case FETCH_TREE_SUCCESS:
                // console.log('heres the payload',action);
                return Object.assign({},action.payload,{
                    loading:false,
                    error:null,
                    treeHistory:state
                })
        case FETCH_TREE_FAILURE:
            return {
                questions:[
                    // {
                    //     'ID' : '1',
                    //     'QuestionText' :'Questions booting',
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

