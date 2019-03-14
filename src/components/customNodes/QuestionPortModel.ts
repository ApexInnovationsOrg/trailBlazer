import * as _ from "lodash";
import { DiagramEngine, PortModel } from "storm-react-diagrams";
import { AnswerLinkModel } from "./Link/AnswerLinkModel";

export class QuestionPortModel extends PortModel {
	in: boolean;
	label: string;
	links: { [id: string]: AnswerLinkModel };
	NextQuestionID:string;
	_id:string;

	constructor(isInput: boolean, name: string, label: string = null, id?: string) {
		super(name, "default", id);
		this.in = isInput;
		this.label = label || name;
		this.links = {};
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
	}


	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label
		});
	}
	addLink = function (link,save?:boolean) {
		// console.log('adding link',save);

		this.links[link.getID()] = link;
	};
	


	link(port: QuestionPortModel): AnswerLinkModel {
		
		// console.log('link hit',dontSave);
		let link = this.createLinkModel(false);
		link.setSourcePort(this);
		link.setTargetPort(port);
		
		return link;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof QuestionPortModel) {
			return this.in !== port.in;
		}
		return true;
	}

	createLinkModel(save:boolean = true): AnswerLinkModel {
		// console.log('creating link model');
		// let link = new AnswerLinkModel('got damnit');
		// link._dontSave = true;
		// return link || new DefaultLinkModel();
		return new AnswerLinkModel(save);
	}
}
