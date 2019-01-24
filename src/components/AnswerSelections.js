import React, { Component } from 'react';
import Answer from './Answer';
import store from '../store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectAnswer, getAnswers } from '../actions/answerActions';


class AnswerSelections extends Component {

    constructor(props){
        super(props)
        this.state = {
          answer:null
        }
      }
    
      renderAnswer(text,i)
      {
        return (
          <Answer 
            value={text}

            selectAnswer={()=>{
                store.dispatch({type:'SELECT_ANSWER',action:i})
                // console.log('here is the state',store.getState(),this.state.answer)
            }}
            
            answer={this.state.answer}
            choice={i}
          />
        )
      }

    listAnswers()
    {
        return this.props.answerState.answers.map((answer)=>{
            let classNames = ["answer"];

            if(this.props.activeAnswer.ID === answer.ID)
            {
              classNames.push('selected')
            }
            return (
                <li key={answer.ID}
                    className={
                    classNames.join(' ')
                    }
                    onClick={() => store.dispatch(selectAnswer(answer))}
                >
                
                    {answer.AnswerText}
                
                </li>
            );
            
        })
    }
    

    render() {
        console.log('answers props',this.props);

        if(this.props.answerState.error)
        {
            return (
                <ul className="answerArea">
                <li className="answer" style={{color:'red'}}>Error! {this.props.answerState.error}</li>
                </ul>
            )
        }
        
        if(this.props.answerState.loading)
        {
            return (
                <ul className="answerArea">
                <li className="answer">Loading...</li>
                </ul>
            )
        }


        return (
            <ul className="answerArea">
               { this.listAnswers() }
            </ul>
        );
    }
}

function mapStateToProps(state)
{

    console.log('mah state',state);
    return {
        answerState: state.answers,
        activeAnswer: state.activeAnswer,
        question:state.question
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators(
        {
            ...selectAnswer,
            ...getAnswers
        },dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(AnswerSelections);