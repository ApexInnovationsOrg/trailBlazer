import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import randomColor from 'randomcolor';
import * as SRD from "storm-react-diagrams"

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

        let questionX = 0;

        return this.props.tree.questions.map((question)=>{
            
            var questionNode = new SRD.DefaultNodeModel(question.QuestionText, "rgb(0,192,255)");
            questionNode._id = question.ID;
            questionNode.setPosition(questionX, 100);
            questionX += 400;
            var inPort = questionNode.addInPort(' ');
            inPort.inletPort = true;
            question.Answers.map((answer)=>{
                let answerPort = questionNode.addOutPort(answer.AnswerText);
                
                answerPort.NextQuestionID = answer.NextQuestionID;
                answerPort.inletPort = false;
                
            })
            return questionNode;

        });
    }

    retrieveConnections(questionNodes)
    {
        let links = [];
        for(let q in questionNodes)
        {
            let question = questionNodes[q];
            // return questionNodes.map((question)=>{
                for(let i in question.ports)
                {
                    
                    let port = question.ports[i];
                    if(port.NextQuestionID && !port.inletPort)
                    {

                        try{
                            let questionPort = this.findQuestionNodePort(port.NextQuestionID,questionNodes);
                            
                            if(questionPort)
                            {   
                                links.push(port.link(questionPort));
                            }
                            
                        }catch(e)
                        {
                            return console.error('could not find or draw question/answer connection');
                        }
                    }
                        
                }
                
            // })
        }
        return links;
    }    
        
    findQuestionNodePort(id,questionNodes)
    {
        for(let i in questionNodes)
        {
            let node = questionNodes[i];
            if(node._id === id)
            {
                for(let q in node.ports)
                {
                    if(node.ports[q].inletPort)
                    {
                        return node.ports[q];
                    }
                }
            }
        }
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



    render(){

        const questionNodes = this.retrieveQuestionNodes(this.props.tree.questions);
        const connectionData = this.retrieveConnections(questionNodes);
        // console.log(questionNodes);
        console.log('connection connection-----------------------------',connectionData);

        // 1) setup the diagram engine
        var engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        // 2) setup the diagram model
        var model = new SRD.DiagramModel();

        // 3) create a default node
        var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
        let port1 = node1.addOutPort("Out");
        node1.addOutPort('really out');
        // let port2 = node1.addOutPort("Out 2");
        // let port3 = node1.addOutPort("Out 3");
        node1.setPosition(100, 100);

        // 4) create another default node
        var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
        let port2 = node2.addInPort("In");
        node2.setPosition(400, 100);

        // 5) link the ports
        let link1 = port1.link(port2);

        // 6) add the models to the root graph
        model.addAll(...questionNodes,...connectionData);

        // 7) load model into engine
        engine.setDiagramModel(model);
        console.log('errr',engine);

        return <div>
         
            <SRD.DiagramWidget diagramEngine={engine} />

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