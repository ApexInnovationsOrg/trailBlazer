import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import randomColor from 'randomcolor';
import * as SRD from "storm-react-diagrams"

import {saveQuestion} from '../actions/questionActions';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AnswerInput from './AnswerInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// import the custom models
import { QuestionNodeModel } from "./customNodes/QuestionNodeModel";
import { QuestionNodeFactory } from "./customNodes/QuestionNodeFactory";
import { SimplePortFactory } from "./customNodes/SimplePortFactory";
import { QuestionPortModel } from "./customNodes/QuestionPortModel";

import { TrailBlazerDiagramWidget } from "./customNodes/Diagram/TrailBlazerDiagramWidget";

import ls from 'local-storage';


  class Questions extends Component {
      
    constructor()
    {
        super();
        // 1) setup the diagram engine
        this.engine = new SRD.DiagramEngine();
        this.engine.installDefaultFactories();

        // 2) setup the diagram model
        this.model = new SRD.DiagramModel();

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.stepFunction = this.stepFunction.bind(this);
        this.addNewAnswerOption = this.addNewAnswerOption.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
        this.updateAnswer = this.updateAnswer.bind(this);
        this.drawDiagram = this.drawDiagram.bind(this);
        this.clearAllNodes = this.clearAllNodes.bind(this);
        this.state = {
            show: false,
            renderedTree:-1,
            fullscreen:false
        };


        
    }
    componentDidMount()
    {
        this.setState({
            newQuestionText:this.props.newQuestion.questionText,
            newAnswersArray:this.props.newQuestion.answers
        })
     
    }


    drawDiagram()
    {
        this.clearAllNodes();
        const questionNodes = this.retrieveQuestionNodes(this.props.tree.questions);

        // console.log('what the heck',questionNodes);
        const connectionData = this.retrieveConnections(questionNodes);


        this.engine.registerPortFactory(new SimplePortFactory("question", config => new QuestionPortModel()));
        this.engine.registerNodeFactory(new QuestionNodeFactory());
        // var node2 = new QuestionNodeModel('This should be the question');
        // node2.setPosition(250, 108);
        // this.model.addAll(node2);
        

        // 6) add the models to the root graph
        this.model.addAll(...questionNodes,...connectionData);
        
        this.engine.repaintCanvas();
        
        // 7) load model into engine
        this.engine.setDiagramModel(this.model);
        setTimeout(()=>{
            this.engine.repaintCanvas();
            // this.engine.zoomToFit()
            let storedDiagram = ls.get('diagramPosition');
            if(storedDiagram[this.props.activeTree.ID] !== undefined)
            {
                    this.model.setOffset(storedDiagram[this.props.activeTree.ID]['x'],storedDiagram[this.props.activeTree.ID]['y']);
                    this.model.setZoomLevel(storedDiagram[this.props.activeTree.ID]['zoom']);
                
            }
        },250);


      
    }

    clearAllNodes()
    {
        const nodes = this.model.getNodes();
        for(let i in nodes)
        {   
            
            
                    nodes[i].remove();
            
        }
        
    }


    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    
    findQuestion(questionID)
    {
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


        return this.props.tree.questions.map((question)=>{
            
            var questionNode = new QuestionNodeModel("Question", question ,question.Answers);
            questionNode._id = question.ID;
            questionNode._engine = this.engine;

            // console.log(this.props.activeTree.MasterQuestionID,question.ID);
            
            questionNode.setMaster(this.props.activeTree.MasterQuestionID === question.ID);
            
            questionNode.setPosition(parseInt(question.PositionX), parseInt(question.PositionY));
            questionNode.enableSavePositions();

            return questionNode;

        });
    }
// 
    retrieveConnections(questionNodes)
    {
        let links = [];
        // console.log('--------------------',questionNodes,this.model);
        for(let q in questionNodes)
        {

            let question = questionNodes[q];

            for(let i in question.ports)
            {
                // console.log('mah question port',question.ports[i]);
                
                let port = question.ports[i];
                if(port.NextQuestionID && !port.in)
                {
                    // console.log('the thing');   
                    try{
                        let questionPort = this.findQuestionNodePort(port.NextQuestionID,questionNodes);
                        
                        if(questionPort)
                        {   
                            links.push(port.link(questionPort,false));
                        }
                        
                    }catch(e)
                    {
                        return console.error('could not find or draw question/answer connection');
                    }
                }
                
            }
  
        }
        
        return links;
    }    
        
    findQuestionNodePort(id,questionNodes)
    {
        // console.log('finding question node port');
        for(let i in questionNodes)
        {
            let node = questionNodes[i];
            // console.log('node id',node,id);
            if(node._id === id)
            {
                for(let q in node.ports)
                {
                    if(node.ports[q].in)
                    {
                        return node.ports[q];
                    }
                }
            }
        }
    }
    
    removeAnswer(index)
    {


        var answersArr = [...this.state.newAnswersArray];
        if(index !== -1 && answersArr.length > 1)
        {
            answersArr.splice(index,1);
            this.setState({newAnswersArray:answersArr});
        }
        else
        {
            alert("You have to have at least one answer");
        }
    }

    updateAnswer(value,index)
    {
            
            const updatedAnswersArray = this.state.newAnswersArray.map((item,i)=>{
                if(index === i)
                {
                    
                    item.answerText = value;
                    return item;

                }
                else
                {
                    return item;
                }
            })
            
        this.setState({newAnswersArray:updatedAnswersArray});            
    }

    renderNewAnswers()
    {
        if(this.state.newAnswersArray)
        {
            return this.state.newAnswersArray.map((answer,index)=>{
                return <AnswerInput key={index} number={index} answerObject={answer} value={this.state.value} onChange={this.updateAnswer} removeAnswer={this.removeAnswer} updateAnswer={this.updateAnswer} />
            })
        }
    }

    addNewAnswerOption()
    {
        var added = this.state.newAnswersArray.concat({
            answerText:''
        })
        this.setState({
            newAnswersArray:added
        })
    }

    stepFunction(e)
    {
        this.setState({
            newQuestionText:e.target.value
        })
    }

    saveNewQuestion = ()=>{
       this.props.dispatch(saveQuestion({
            treeID:this.props.activeTree.ID,
            question:this.state.newQuestionText,
            answers:this.state.newAnswersArray
       }));
       
       this.handleClose();
    }

    saveButton()
    {
        if(this.props.savingQuestion.loading)
        {
            return <Button variant="primary" disabled={true}><FontAwesomeIcon icon="spinner" spin /></Button>
        }
        return <Button variant="primary" onClick={this.saveNewQuestion}>
                Save Changes
                </Button>
    }

    render(){

            this.drawDiagram();

        
    

        return <div className="fullHeight">

                <TrailBlazerDiagramWidget className="fullHeight" deleteKeys={[]} diagramEngine={this.engine} />


            {/* <Button variant="primary" onClick={this.handleShow}>
                Add Question
            </Button> */}

            <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-horizontal">
                <fieldset>
                <div className="form-group">
                    <label className="col-md-4 control-label">Question Text</label>  
                    <div className="col-md-12 p-4" style={{'background':'#e8e8e8'}}>
                    <input id="textinput" name="textinput" type="text" placeholder="What time is it?" className="form-control input-lg" onChange={this.stepFunction} value={this.state.newQuestionText}/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-4 control-label">Answers</label>
                    <div className="col-md-12 p-4" style={{'background':'#e8e8e8'}}>
                            {this.renderNewAnswers()}
                            <div className="row float-right mb-5">
                                <div className="col-md-12">
                                    <Button variant="success" className="mt-2 float-right" style={{'borderRadius':'100%'}} onClick={this.addNewAnswerOption}><strong>+</strong></Button>
                                </div>
                            </div>
                    </div>
                    
                </div>

                </fieldset>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                Close
                </Button>
                {this.saveButton()}
            </Modal.Footer>
            </Modal>
        </div>;
      }
}


function mapStateToProps(state)
{
    return {
        tree: state.tree,
        activeTree:state.activeTree,
        connections:state.connections.connections,
        nodes:state.connections.nodes,
        newQuestion:state.newQuestion,
        savingQuestion:state.savingQuestion
    }
}


export default connect(mapStateToProps)(Questions);