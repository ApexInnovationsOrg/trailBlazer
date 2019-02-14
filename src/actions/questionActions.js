import {
    SET_NEW_ANSWERS
} from './types';

export function updateNewQuestion(question){
    console.log('updating new question');
}

export const alterQuestion = question => ({
    type: SET_NEW_ANSWERS,
    payload:{question}
  });

