import * as React from "react";
import { QuestionNodeModel } from "./QuestionNodeModel";
import { PortWidget } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";

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

	clickThing()
	{
		alert('You clicked me~!');
	}


	render() {
		// this.props.node.addInPort(index.toString(ques));
		return (
			<div
				style={{
					position: "relative",
					width: this.props.size * 1.5,
					height: this.props.size,
					
				}}
			>
			<div
				style={{
					width:"100%",
					height:"70px",
					background:"rgb(0,87,157)"
				}}
			>

			<div className={"questionNotch"}/>

			<div className={"port questionPort"}>
				<PortWidget name={'questionID_' + this.props.node.question['ID']} node={this.props.node} />
			</div>
			
			<div style={{
				position:'relative',
				color:'white',
				padding:'2em 0 0 1em'
			}}>
				{this.props.node.name}
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
								// let actualPort = new QuestionPortModel(index.toString());
								// actualPort.setParent(actualPort);
								// console.log('answer me this',answer);
								let answerID = 'answerID_' + answer['ID'];
								this.props.node.addOutPort(answerID);

								// console.log('here is the actual port',actualPort);
								return <li key={index}>
								
									{answer['AnswerText']}
									<div className={"port answerPort"}>
										<PortWidget  name={answerID} node={this.props.node} />
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
