import { DefaultLinkModel, LinkModelListener } from "storm-react-diagrams";
import { QuestionPortModel } from "../QuestionNode/QuestionPortModel";

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

	// getSourcePort(): NodePortModel {
	// 	return this.sourcePort;
	// }

	// getTargetPort(): NodePortModel {
	// 	return this.targetPort;
	// }

	saveLink()
	{
		if(this.targetPort === null)
		{
			return 
		}
		
		let answer = this.sourcePort.parent['answers'][parseInt(this.sourcePort.name.slice(-1))];
		let node = this.targetPort.parent['node'];

		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Answer',
				action:'createNewLink',
				answerID: answer.ID,
				nextNodeID:node.ID
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
