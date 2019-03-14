import * as React from "react";
import { QuestionNodeModel } from "./QuestionNodeModel";
import { PortWidget } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";
import Mousetrap from "mousetrap";

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
				padding:'2em 0 0 1em'
			}}>
				{this.props.node.name}
			</div>

			<div className={"editNodeContainer"}>
				<button className={"editNodeButton btn btn-primary"}>Edit</button>
			</div>
			</div>
				<div className={"questionAndAnswerAreaOnNodeContainer"}//that's a little verbose
				>
					<div className={"questionAreaNode"}
					>
						{this.props.node.question['QuestionText']}
					</div>
					<div className={"answerAreaNode"}
					/>
						<ul className={"answerListNode"}>

							{this.props.node.answers.map((answer,index)=>{


								let answerID = 'answerID_' + answer['ID'];
								

								let answerName = "answer" + index;

								return <li key={index}>
								
									{answer['AnswerText']}
									<div onClick={()=>{ this.deleteCheck(answerName) }} onDoubleClick={()=>{this.destroyLink(answerName)}} className={"port answerPort"}>
										<PortWidget  name={answerName} node={this.props.node} />
									</div>
								</li>;
							})
							
							}
							

						</ul>
					</div>
				
				
			</div>
		);
	}
}
