import { combineReducers } from 'redux';
import forestReducer from './forestReducer';
import activeForestReducer from './activeForestReducer';
import singleForestReducer from './singleForestReducer';
import treeReducer from './treeReducer';

export default combineReducers({
   forests: forestReducer,
   singleForest:singleForestReducer,
   activeForest:activeForestReducer,
   tree:treeReducer
})

