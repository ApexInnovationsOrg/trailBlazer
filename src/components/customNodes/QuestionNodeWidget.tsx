import * as React from "react";
import { QuestionNodeModel } from "./QuestionNodeModel";
import { PortWidget } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";
import Mousetrap from "mousetrap";
import ContentEditable from 'react-contenteditable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditAnswer } from './EditAnswer';
import { EditBubbles } from './EditBubbles';
import { EditMedia } from './EditMedia';

import {connect} from 'react-redux';

export interface QuestionNodeWidgetProps {
	node: QuestionNodeModel;
	size?: number;
	answer?:object;
}

export interface QuestionNodeWidgetState {
	editingAnswer:boolean;
	editingBubbles:boolean;
	editingMedia:boolean;

}

/**
 * @author Dylan Vorster
 */
export class QuestionNodeWidget extends React.Component<QuestionNodeWidgetProps, QuestionNodeWidgetState> {
	answer:object;
	editingAnswer:boolean;

	public static defaultProps: QuestionNodeWidgetProps = {
		size: 300,
		node: null
	};

	constructor(props: QuestionNodeWidgetProps) {
		super(props);
		this.state = {
			editingAnswer:false,
			editingBubbles:false,
			editingMedia:false
		};
		this.answer = {};
	}

	destroyLink(answerName)
	{

		// console.log(answerName);
		this.props.node.removeLink(answerName);
	}
	deleteCheck(answerName)
	{
		console.log('possibleDelete');
		// Mousetrap
	}
	getQuestionPort = ()=>
	{	
		if(!this.props.node.masterQuestion)
		{
			return <div className={"port questionPort"}>
						<PortWidget name="question" node={this.props.node} />
					</div>
		}
	}

	setMaster = ()=>
	{
		this.props.node.setMasterQuestion();
	}

	getMasterQuestionButton = () =>
	{
		if(this.props.node.masterQuestion)
		{
			return <span onDoubleClick={this.setMaster}><FontAwesomeIcon style={{cursor:'pointer',color:'gold'}} icon="star"/></span>
		}
		else
		{
			return <span onDoubleClick={this.setMaster}><FontAwesomeIcon style={{cursor:'pointer',color:'white'}} icon="star"/></span>
		}
	}

	editButtons = () =>
	{
		if(this.props.node.editing)
		{


			return (
				<div>
					<button onClick={this.toggleEdit}>Cancel</button>
					<button onClick={this.saveChanges}>Save</button>
					<button onClick={this.deleteNode}>Delete</button>
				</div>
			)
		}
	}

	saveChanges = ()=>
	{
		// console.log('save changes');
		this.props.node.saveChanges();
	}

	toggleEdit = ()=>
	{
		this.props.node.toggleEdit();
	}

	deleteNode = () =>
	{
		this.props.node.deleteNode();
	}
	updateTitle = evt =>
	{
		this.props.node.question['QuestionText'] = evt.target.value;
	}
	updateAnswer = (evt,answer)=>
	{
		answer['AnswerText'] = evt.target.value;
	}
	editAnswerComplete = ()=>
	{
		this.props.node.editingAnswer = false;
		this.props.node.editingAnswerIndex = -1;
		this.props.node.editing = true;
		this.setState({
			editingAnswer:false
		})
		this.props.node.repaintCanvas();
	}
	editAnswer = (index)=>
	{
		this.props.node.editingAnswer = true;
		this.props.node.editingAnswerIndex = index;
		this.props.node.editing = false;
		this.setState({
			editingAnswer:true
		})

		this.props.node.repaintCanvas();
	}
	editContainer = ()=>
	{
		if(this.state.editingAnswer)
		{

			return	<div>
						<EditAnswer node={this.props.node} parent={this} answer={this.answer} />
					</div>
		}
		else
		{
			return false;
		}
	}

	editBubbleContainer = ()=>
	{
		if(this.state.editingBubbles)
		{
			return <div>
					<EditBubbles node={this.props.node}/>
			</div>
		}
		else
		{
			return false;
		}
	}

	editMediaContainer = ()=>
	{
		if(this.state.editingMedia)
		{
			return <div>
					<EditMedia node={this.props.node}/>
			</div>
		}
		else{
			return false;
		}
	}

	hasBubbleContent = ()=>
	{
		let hasBubbles = false;

		this.props.node.question['Contents'].forEach(content => {
			if(content.Content.type === "bubble")
			{
				hasBubbles = true
			}
		});
		if(hasBubbles)
		{
			return <span><FontAwesomeIcon icon="comment-slash"></FontAwesomeIcon></span>;
		}
		else
		{
			return <span  style={{opacity:0.5}}><FontAwesomeIcon icon="comment-dots"></FontAwesomeIcon></span>;
		}
	}
	hasMediaContent = ()=>
	{
		let hasMedia = false;

		this.props.node.question['Contents'].forEach(content => {
			if(content.Content.type === "masterMedia")
			{
				hasMedia = true
			}
		});
		if(hasMedia)
		{
			return <span><FontAwesomeIcon icon="film"></FontAwesomeIcon></span>;
		}
		else
		{
			return <span style={{opacity:0.5}}><FontAwesomeIcon icon="film"></FontAwesomeIcon></span>;
		}
	}

	
	editBubbles = ()=>{
		this.props.node.editingAnswer = true;
		this.setState({
			editingBubbles:true,
			editingMedia:false
		})
	}
	editMedia = ()=>{
		this.props.node.editingAnswer = true;
		this.setState({
			editingMedia:true,
			editingBubbles:false
		})
	}


	render() {

		return (
			<div
				style={{
					position: "relative",
					width: this.props.size * 1.5,
					height: this.props.size,
					cursor: this.props.node.editing ? 'auto':'move'
				}}
			>
			<div
				style={{
					width:"100%",
					height:"70px",
					background: this.props.node.masterQuestion ? 'green' : "rgb(0,87,157)"
				}}
			>

			<div className={"questionNotch"}/>



				{this.getQuestionPort()}
				
			
			<div style={{
				position:'relative',
				color:'white',
				padding:'2em 0 0 1em',
				width:'50%'
			}}>
				{this.props.node.name}
			</div>
			<div className={"editNodeContainer"}>
				{this.getMasterQuestionButton()}
			</div>
			<div onClick={this.editBubbles} className={"editNodeContainer"}>
				{this.hasBubbleContent()}
			</div>
			<div onClick={this.editMedia} className={"editNodeContainer"}>
				{this.hasMediaContent()}
			</div>
			<div className={"editNodeContainer"}>
				<span onClick={this.toggleEdit}><FontAwesomeIcon style={{'marginTop':'6px',cursor:'pointer',display: this.props.node.editing ? 'none' : 'block'}} icon="lock"/>
				<FontAwesomeIcon style={{'marginTop':'6px',cursor:'pointer',display: this.props.node.editing ? 'block' : 'none'}} icon="lock-open"/></span>
			</div>
			</div>
				{this.editContainer()}
				{this.editBubbleContainer()}
				{this.editMediaContainer()}
				<div style={{display:this.props.node.editingAnswer ? 'none':'block'}}className={"questionAndAnswerAreaOnNodeContainer"}//that's a little verbose
				>
					<div className={"questionAreaNode"}
					>
						<ContentEditable style={{cursor:this.props.node.editing?'pointer':'move', background:this.props.node.editing?'rgba(106, 193, 255, 0.17)':'white'}} html={this.props.node.question['QuestionText']} onChange={this.updateTitle} disabled={!this.props.node.editing}></ContentEditable>
					</div>
					<div className={"answerAreaNode"}
					/>
						<ul className={"answerListNode"}>

							{this.props.node.answers.map((answer,index)=>{


								let answerID = 'answerID_' + answer['ID'];
								

								let answerName = "answer" + index;

								return <li key={index}>
									<div 
									style={{display:this.props.node.editing ? 'block':'none',float:'left'}}
									className="editAnswerButtonContainer" 
									onClick={()=>{this.editAnswer(index)}} ><FontAwesomeIcon icon="cogs"></FontAwesomeIcon></div>
									<ContentEditable className="answerText" onChange={(e)=> this.updateAnswer(e,answer)} html={answer['AnswerText']} disabled={!this.props.node.editing} style={{cursor:this.props.node.editing?'pointer':'move',background:this.props.node.editing?'rgba(106, 193, 255, 0.17)':'white'}}></ContentEditable>
									<div onClick={()=>{ this.deleteCheck(answerName) }} onDoubleClick={()=>{this.destroyLink(answerName)}} className={"port answerPort"}>
										<PortWidget  name={answerName} node={this.props.node} />
									</div>
								</li>;
							})
							
							}
							
							 <li style={{display:this.props.node.editing ? 'block':'none'}} className={"newAnswer"} onClick={this.props.node.newAnswer}>New Answer</li>
							
						</ul>
					</div>
				{this.editButtons()}
				
			</div>
		);
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


export default connect(mapStateToProps)(QuestionNodeModel);