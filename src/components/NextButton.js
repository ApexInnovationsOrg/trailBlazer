import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { submitAnswer } from '../actions/answerActions';
import { bindActionCreators } from 'redux';


class NextButton extends Component {
    render() {
        if(this.props.answeredQuestions.error)
        {
            return (<div>Error: {this.props.answeredQuestions.error}</div>);
        }

        if(this.props.answeredQuestions.loading)
        {
            return (<button disabled>Submitting</button>);
        }
        if(this)


        return (
            <button disabled={this.props.activeAnswer.id === -1} onClick={()=>store.dispatch(submitAnswer(this.props.activeAnswer))}> 
            Next
            </button>
        );
    }
}


function mapStateToProps(state)
{
    return {
        activeAnswer: state.activeAnswer,
        answeredQuestions:state.answeredQuestions
    }
}

function matchDispatchToProps(dispatch)
{
    return bindActionCreators({submitAnswer:submitAnswer},dispatch);
}


export default connect(mapStateToProps,matchDispatchToProps)(NextButton);