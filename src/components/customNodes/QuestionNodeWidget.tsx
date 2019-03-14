import * as React from "react";
import { QuestionNodeModel } from "./QuestionNodeModel";
import { PortWidget } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";
import Mousetrap from "mousetrap";
import ContentEditable from 'react-contenteditable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface QuestionNodeWidgetProps {
	node: QuestionNodeModel;
	size?: number;
}

export interface QuestionNodeWidgetState {}

/**
 * @author Dylan Vorster
 */
export class QuestionNodeWidget extends React.Component<QuestionNodeWidgetProps, QuestionNodeWidgetState> {
	public static defaultProps: QuestionNodeWidgetProps = {
		size: 300,
		node: null
	};

	constructor(props: QuestionNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	destroyLink(answerName)
	{
		console.log('destroyyyyyyyyyyyy');

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

	render() {

		return (
			<div
				style={{
					position: "relative",
					width: this.props.size * 1.5,
					height: this.props.size
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
				
				<span  onClick={this.toggleEdit}><FontAwesomeIcon style={{cursor:'pointer',display: this.props.node.editing ? 'none' : 'block'}} icon="lock"/>
				<FontAwesomeIcon style={{cursor:'pointer',display: this.props.node.editing ? 'block' : 'none'}} icon="lock-open"/></span>
			</div>
			</div>
				<div className={"questionAndAnswerAreaOnNodeContainer"}//that's a little verbose
				>
					<div className={"questionAreaNode"}
					>
						<ContentEditable style={{cursor:this.props.node.editing?'pointer':'auto', background:this.props.node.editing?'rgba(106, 193, 255, 0.17)':'white'}}html={this.props.node.question['QuestionText']} onChange={this.updateTitle} disabled={!this.props.node.editing}></ContentEditable>
					</div>
					<div className={"answerAreaNode"}
					/>
						<ul className={"answerListNode"}>

							{this.props.node.answers.map((answer,index)=>{


								let answerID = 'answerID_' + answer['ID'];
								

								let answerName = "answer" + index;

								return <li key={index}>
								
									<ContentEditable className="answerText" onChange={(e)=> this.updateAnswer(e,answer)} html={answer['AnswerText']} disabled={!this.props.node.editing} style={{cursor:this.props.node.editing?'pointer':'auto',background:this.props.node.editing?'rgba(106, 193, 255, 0.17)':'white'}}></ContentEditable>
									<div onClick={()=>{ this.deleteCheck(answerName) }} onDoubleClick={()=>{this.destroyLink(answerName)}} className={"port answerPort"}>
										<PortWidget  name={answerName} node={this.props.node} />
									</div>
								</li>;
							})
							
							}
							

						</ul>
					</div>
				{this.editButtons()}
				
			</div>
		);
	}
}
