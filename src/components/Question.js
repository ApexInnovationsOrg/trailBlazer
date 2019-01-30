import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Questions extends Component {
    // constructor(props)
    // {
    //     super(props);

    //     console.log(props);
    //     // this.props.selectAnswer = this.props.selectAnswer.bind(this);
    // }
    questionFunction(question)
    {
        console.log(question);
        return <div>Question: {question.QuestionText}
                    
                </div>
    }

    renderQuestions()
    { 
        for(let i in this.props.tree.questions)
        {
            let question = this.props.tree.questions[i];
            console.log(question.ID,this.props.activeTree.MasterQuestionID,question.ID == this.props.activeTree.MasterQuestionID);
            if(question.ID == this.props.activeTree.MasterQuestionID)
            {
                return this.questionFunction(question);
            }
        }
    }

    render(){
    
        console.log(this.props.tree);
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