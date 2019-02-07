import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import randomColor from 'randomcolor';
import ReactDAG, {DefaultNode, INode} from "react-dag";
import NodeType1 from "./NodeType1";
import NodeType2 from "./NodeType2";
import NodeType3 from "./NodeType3";

import {
    conditionConnectionDecoder,
    conditionConnectionEncoder,
    transformConnectionDecoder,
    transformConnectionEncoder,
  } from "../reducers/connectionReducers";

import {
    defaultSettings,
    dottedConnectionStyle,
    selectedConnectionStyle,
  } from "../settings/dag-settings";
import { onConnectionEventHandler, onEndPointClick } from "../actions/eventHandlers";
import { css } from "glamor";

const cloneDeep = require("lodash.clonedeep");
const HEIGHT_OF_HEADER = 90;
const HEIGHT_OF_BUTTON_PANEL = 50;
const dagWrapperStyles = css({
    background: "rgba(100,100,100,0.2)",
    height: `calc(100vh - ${HEIGHT_OF_HEADER}px - ${HEIGHT_OF_BUTTON_PANEL +
      1}px)`,
    width: "100vw",
  });
  
  const eventListeners = {
      click: onEndPointClick,
      connection: onConnectionEventHandler,
      endpointClick: onEndPointClick,
  };
  const registerTypes = {
    connections: {
      dotted: dottedConnectionStyle,
      selected: selectedConnectionStyle,
    },
    endpoints: {},
  }; 
  const typeToComponentMap = {
    action: NodeType2,
    condition: NodeType3,
    sink: NodeType1,
    source: DefaultNode,
    transform: NodeType1,
  };

  const getComponent = (type) =>
  typeToComponentMap[type] ? typeToComponentMap[type] : DefaultNode;


  class Questions extends Component {
      

    findQuestion(questionID)
    {
        // console.log(this.props);
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

    retrieveQuestionNodes()
    {
        this.props.tree.questions.map((question)=>{
            return {
                config:{
                    label:question.QuestionText,
                    type:"source",
                },
                id:question.ID
            }
        });
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

    drawNodes()
    {

        if(this.props.tree.questions)
        {
            return this.props.tree.questions.map((node, i) => {
                const Component = getComponent('action');
                // console.log('here is the component',Component);
                console.log('iiiiiiiiiiiiiii node',INode);

                // const configClass = INodeConfig;
                // console.log('config Class',INodeConfig);?
                // let configProp = {
                //     label:node.QuestionText
                // }
                return <Component config={{label:node.QuestionText,width:100,height:100}} key={i} id={node.ID} />;
            })
        }
        else{
            return false;
        }
    }

    retrieveConnections()
    {
        let connections = [];
        if(this.props.tree.questions)
        {
            for(let i in this.props.tree.questions)
            {
                let question = this.props.tree.questions[i];
                if(question.Answers)
                {
                    for(let q in question.Answer)
                    {
                        let answer = question.Answer[q];
                        connections.push(
                            {
                                sourceId:question.ID,
                                targetId:answer.NextQuestionID
                            }
                        )
                    }
                }
            }
        }
        console.log('connecting connections',connections);
        return connections;
    }

    render(){
        return <div>
            {/* {this.renderQuestions()} */}
            <ReactDAG
                className={`${dagWrapperStyles}`}
                key="dag"
                connections={this.retrieveConnections(this.props.tree.questions)}
                nodes={this.retrieveQuestionNodes(this.props.tree.questions)}
                jsPlumbSettings={defaultSettings}
                connectionDecoders={[
                transformConnectionDecoder,
                conditionConnectionDecoder,
                ]}
                connectionEncoders={[
                transformConnectionEncoder,
                conditionConnectionEncoder,
                ]}
                eventListeners={eventListeners}
                registerTypes={registerTypes}
                onChange={({ nodes, connections }) => {
                this.setState({ nodes, connections }); // un-necessary cycle??
                }}
                zoom={1}
            >
                
                {this.drawNodes()}
            </ReactDAG>
        </div>;
      }
}


function mapStateToProps(state)
{
    // console.log('connections',state);
    return {
        tree: state.tree,
        activeTree:state.activeTree,
        connections:state.connections.connections,
        nodes:state.connections.nodes
    }
}


export default connect(mapStateToProps,null)(Questions);