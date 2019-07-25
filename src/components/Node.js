import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import randomColor from 'randomcolor';
import * as SRD from "storm-react-diagrams"

import {saveNode} from '../actions/nodeActions';
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


  class Nodes extends Component {
      
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
            newNodeText:this.props.newNode.nodeText,
            newAnswersArray:this.props.newNode.answers
        })
     
    }


    drawDiagram()
    {
        this.clearAllNodes();
        //console.log(this.props.tree,'???????????????????????????');
        const nodes = this.retrieveNodes(this.props.tree.nodes);

        // //console.log('what the heck',nodeNodes);
        const connectionData = this.retrieveConnections(nodes);


        this.engine.registerPortFactory(new SimplePortFactory("node", config => new QuestionPortModel()));
        this.engine.registerNodeFactory(new QuestionNodeFactory());
        // var node2 = new QuestionNodeModel('This should be the node');
        // node2.setPosition(250, 108);
        // this.model.addAll(node2);
        

        // 6) add the models to the root graph
        this.model.addAll(...nodes,...connectionData);
        
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

    
    findNode(nodeID)
    {
        for(let i in this.props.tree.nodes)
        {
            let node = this.props.tree.nodes[i];
            if(node.ID === nodeID)
            {
                return node;
            }
        }
        return false;
    }
  

    nodeFunction(node,masterNode,backgroundColor = '#fff')
    {
        
        let classes = "node";
        if(masterNode)
        {
            classes = classes + " masterNode";
        }
        return  <div>

                    <div style={{'background':backgroundColor}} className={classes}>Node: {node.NodeText}
                        <div className="weight">Weight: {node.Weight}</div>
                        <div className="answerArea">
                            
                            Answers:{this.renderAnswers(node)}
                        </div>
                        <div>
                                    
                        </div>
                    </div>
                    
                    {this.renderNextNodes(node)}
                </div>
    }

    retrieveNodes()
    {

        //console.log('reeeeeee', this.props.tree);
        return this.props.tree.nodes.map((node)=>{
            
            var nodeNode = new QuestionNodeModel("Node", node ,node.Answers);
            nodeNode._id = node.ID;
            nodeNode._engine = this.engine;

            // //console.log(this.props.activeTree.MasterNodeID,node.ID);
            
            nodeNode.setMaster(this.props.activeTree.MasterNodeID === node.ID);
            
            nodeNode.setPosition(parseInt(node.PositionX), parseInt(node.PositionY));
            nodeNode.enableSavePositions();

            return nodeNode;

        });
    }
// 
    retrieveConnections(nodes)
    {
        let links = [];
        //console.log('--------------------',nodes,this.model);
        for(let q in nodes)
        {

            let node = nodes[q];

            for(let i in node.ports)
            {
                //console.log('mah node port',node.ports[i]);
                
                let port = node.ports[i];
                if(port.NextNodeID && !port.in)
                {
                    //console.log('the thing');   
                    try{
                        let nodePort = this.findNodePort(port.NextNodeID,nodes);
                        
                        if(nodePort)
                        {   
                            links.push(port.link(nodePort,false));
                        }
                        
                    }catch(e)
                    {
                        return console.error('could not find or draw node/answer connection');
                    }
                }
                
            }
  
        }
        
        return links;
    }    
        
    findNodePort(id,nodes)
    {
        //console.log('finding node node port');
        for(let i in nodes)
        {
            let node = nodes[i];
            // //console.log('node id',node,id);
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
            newNodeText:e.target.value
        })
    }

    saveNewNode = ()=>{
       this.props.dispatch(saveNode({
            treeID:this.props.activeTree.ID,
            nodeText:this.state.newNodeText,
            answers:this.state.newAnswersArray
       }));
       
       this.handleClose();
    }

    saveButton()
    {
        if(this.props.savingNode.loading)
        {
            return <Button variant="primary" disabled={true}><FontAwesomeIcon icon="spinner" spin /></Button>
        }
        return <Button variant="primary" onClick={this.saveNewNode}>
                Save Changes
                </Button>
    }

    render(){

            this.drawDiagram();

        
    

        return <div className="fullHeight">

                <TrailBlazerDiagramWidget className="fullHeight" deleteKeys={[]} diagramEngine={this.engine} />


            {/* <Button variant="primary" onClick={this.handleShow}>
                Add Node
            </Button> */}

            <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-horizontal">
                <fieldset>
                <div className="form-group">
                    <label className="col-md-4 control-label">Node Text</label>  
                    <div className="col-md-12 p-4" style={{'background':'#e8e8e8'}}>
                    <input id="textinput" name="textinput" type="text" placeholder="What time is it?" className="form-control input-lg" onChange={this.stepFunction} value={this.state.newNodeText}/>
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
        newNode:state.newNode,
        savingNode:state.savingNode
    }
}


export default connect(mapStateToProps)(Nodes);