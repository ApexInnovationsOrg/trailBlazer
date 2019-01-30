import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Questions extends Component {


    findQuestion(questionID)
    {
        console.log(this.props);
        for(let i in this.props.tree.questions)
        {
            let question = this.props.tree.questions[i];
            console.log(question.ID,questionID);
            if(question.ID === questionID)
            {
                return question;
            }
        }
    }
    renderAnswers(question)
    {
        return question.Answers.map(answer=>
            <div>
                {answer.AnswerText}
            </div>
        )
    }

    renderNextQuestions(question)
    {
        for(let i in question.Answers)
        {
            let followupQuestion = question.Answers[i];

            
        }
    }

    questionFunction(question,masterQuestion,previousQuestion = false)
    {
        let classes = "question";
        if(masterQuestion)
        {
            classes = classes + " masterQuestion";
        }
        return  <div>

                    <div className={classes}>Question: {question.QuestionText}
                        <div className="weight">Weight: {question.Weight}</div>
                        <div className="answerArea">
                            
                            Answers:{this.renderAnswers(question)}
                        </div>
                    </div>
                    
                    {this.renderNextQuestions(question)}
                </div>
    }

    renderQuestions()
    { 
        let questionsJSX;
        let masterQuestion = this.findQuestion(this.props.activeTree.MasterQuestionID);
        if(this.props.activeTree.ID === '-1')
        {
            return;
        }

        if(this.props.tree.questions.length === 0)
        {
            return <div>No Questions Yet</div>
        }

        questionsJSX = this.questionFunction(masterQuestion,true);

        return questionsJSX;
    }

    render(){
     
        return <div>
            {this.renderQuestions()}
        </div>;
      }
}


function mapStateToProps(state)
{
    return {
        tree: state.tree,
        activeTree:state.activeTree
    }
}


export default connect(mapStateToProps,null)(Questions);