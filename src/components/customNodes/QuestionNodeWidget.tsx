import * as React from "react";
import { QuestionNodeModel } from "./QuestionNodeModel";
import { PortWidget } from "storm-react-diagrams";

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

		// console.log('this is the props inside the custom node',this.props);
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
					height:"50px",
					background:"rgb(0,87,157)"
				}}
			>

			<div
				style={{
					position:"absolute",
					width:"100%",
					height:"10px",
					left:"0",
					top:"0",
					background:"rgb(32,53,105)"
				}}
			/>
			<div style={{
				position:'relative',
				color:'white',
				padding:'1em 0 0 1em'
			}}>
				{this.props.node.name}
			</div>
			</div>
				<div className={"questionAndAnswerAreaOnNodeContainer"}//that's a little verbose
				>
					<div className={"questionAreaNode"}
					>
						{this.props.node.question}
					</div>
					<div className={"answerAreaNode"}
					/>
						<ul className={"answerListNode"}>

							{this.props.node.answers.map((answer)=>{

								return <li>{answer['AnswerText']}</li>;
							})
							
							}
							

						</ul>
					</div>
				
				
			</div>
		);
	}
}
