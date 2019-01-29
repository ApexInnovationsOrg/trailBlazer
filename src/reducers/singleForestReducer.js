import { FETCH_FOREST_BEGIN, FETCH_FOREST_SUCCESS, FETCH_FOREST_FAILURE } from '../actions/types';

const initialState = {
    trees:[
        {
            ID:1,
            selected:false,
            Name: "Forests Booting up"
        }
    ],
    error:null,
    loading:false
}
    



export default function(state=initialState, action){
    switch(action.type){

        case FETCH_FOREST_BEGIN:
                return {
                    ...state,
                    loading:true,
                    error:null,
                    trees:[]
                }
        case FETCH_FOREST_SUCCESS:
                console.log('heres the payload',action);
                return Object.assign({},action.payload,{
                    loading:false,
                    error:null,
                    forestHistory:state
                })
        case FETCH_FOREST_FAILURE:
            return {
                forests:[
                    {
                        ID:1,
                        selected:false,
                        Name: "Forests Booting up"
                    }
                ],
                error:action.payload.error,
                loading:false
            }
        default:
            return state;
    }
}

