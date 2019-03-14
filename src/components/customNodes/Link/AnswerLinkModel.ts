import { DefaultLinkModel, LinkModelListener } from "storm-react-diagrams";
import { QuestionPortModel } from "../QuestionPortModel";

export class AnswerLinkModel extends DefaultLinkModel {
	save:boolean;
	constructor(save: boolean = true) {
		super();
		this.save = save;
	}

	setSourcePort(port: QuestionPortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.sourcePort !== null) {
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			if (listener.sourcePortChanged) {
				listener.sourcePortChanged({ ...event, port: port });
			}
		});
	}

	// getSourcePort(): QuestionPortModel {
	// 	return this.sourcePort;
	// }

	// getTargetPort(): QuestionPortModel {
	// 	return this.targetPort;
	// }

	saveLink()
	{
		if(this.targetPort === null)
		{
			return 
		}
		
		let answer = this.sourcePort.parent['answers'][parseInt(this.sourcePort.name.slice(-1))];
		let question = this.targetPort.parent['question'];

		fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Answer',
				action:'createNewLink',
				answerID: answer.ID,
				nextQuestionID:question.ID
			})
		})
	}

	setTargetPort(port: QuestionPortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.targetPort !== null) {
			this.targetPort.removeLink(this);
		}
		this.targetPort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			if (listener.targetPortChanged) {
				listener.targetPortChanged({ ...event, port: port });
			}
		});

		if(this.save)
		{
			this.saveLink();
		}
	}

}
