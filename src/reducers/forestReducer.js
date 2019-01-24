import { FETCH_ALL_FORESTS_BEGIN, FETCH_ALL_FORESTS_SUCCESS, FETCH_ALL_FORESTS_FAILURE } from '../actions/types';

const initialState = {
    forests:[
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

        case FETCH_ALL_FORESTS_BEGIN:
                return {
                    ...state,
                    loading:true,
                    error:null,
                    forests:[]
                }
        case FETCH_ALL_FORESTS_SUCCESS:
                console.log('heres the payload',action);
                return Object.assign({},action.payload,{
                    loading:false,
                    error:null,
                    forestHistory:state
                })
        case FETCH_ALL_FORESTS_FAILURE:
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

