import { combineReducers } from 'redux';
import forestReducer from './forestReducer';
import activeForestReducer from './activeForestReducer';
import activeTreeReducer from './activeTreeReducer';
import singleForestReducer from './singleForestReducer';
import treeReducer from './treeReducer';

export default combineReducers({
   forests: forestReducer,
   singleForest:singleForestReducer,
   activeForest:activeForestReducer,
   activeTree:activeTreeReducer,
   tree:treeReducer
})

