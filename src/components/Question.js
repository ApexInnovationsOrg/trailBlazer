import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import randomColor from 'randomcolor';
class Questions extends Component {
    

    findQuestion(questionID)
    {
        console.log(this.props);
        for(let i in this.props.tree.questions)
        {
            let question = this.props.tree.questions[i];
            if(question.ID === questionID)
            {
                return question;
            }
        }
        return false;
    }
    renderAnswers(question)
    {
        question.Answers.forEach(answer => {
            answer.specialColor = randomColor();
        });
        return question.Answers.map(answer=>
            <div style={{background:answer.specialColor}}>
                {answer.AnswerText} (follow up is: {this.findQuestion(answer['NextQuestionID']).QuestionText})
            </div>
        )
    }

    renderNextQuestions(question)
    {
        // let usedQuestions = [];
        return question.Answers.map((answer) =>{
                   
                let followupQuestion = this.findQuestion(answer['NextQuestionID']);
                // const color = randomColor();
                // console.log('following up ',followupQuestion);
                if(followupQuestion)
                {
                    // if(usedQuestions.indexOf(followupQuestion.ID) === -1)
                    // {   
                        // console.log('using ', followupQuestion.ID);
                        // usedQuestions.push(followupQuestion.ID);
                        return this.questionFunction(followupQuestion,false,answer.specialColor);
                    // }
                }
        })
    }

    questionFunction(question,masterQuestion,backgroundColor = '#fff')
    {
        
        let classes = "question";
        if(masterQuestion)
        {
            classes = classes + " masterQuestion";
        }
        return  <div>

                    <div style={{'background':backgroundColor}} className={classes}>Question: {question.QuestionText}
                        <div className="weight">Weight: {question.Weight}</div>
                        <div className="answerArea">
                            
                            Answers:{this.renderAnswers(question)}
                        </div>
                        <div>
                                    
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