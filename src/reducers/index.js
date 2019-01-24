import { combineReducers } from 'redux';
import forestReducer from './forestReducer';
import activeForestReducer from './activeForestReducer';

export default combineReducers({
   forests: forestReducer,
   activeForest:activeForestReducer
})

