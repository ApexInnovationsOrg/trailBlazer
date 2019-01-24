import { combineReducers } from 'redux';
import forestReducer from './forestReducer';

export default combineReducers({
   forests: forestReducer,

})