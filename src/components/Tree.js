import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { bindActionCreators } from 'redux';


class Tree extends Component {

    displayQuestions()
    {
        return this.props.tree.questions.map(question => 
        <li key={question.ID}>
            {question.QuestionText}
            <ul>

                {question.Answers.map(answer=><li>{answer.AnswerText}</li>)}

            </ul>
        </li>)
    }

    render() {
        return(
            <div>
                <div>Tree</div>

                <ul>
                    {this.displayQuestions()}
                </ul>
            </div>
        )
    }
}


function mapStateToProps(state)
{
    return {
        tree: state.tree,
    }
}

// function matchDispatchToProps(dispatch)
// {
//     return bindActionCreators({submitAnswer:submitAnswer},dispatch);
// }


// export default connect(mapStateToProps,matchDispatchToProps)(Tree);

export default connect(mapStateToProps,null)(Tree);
