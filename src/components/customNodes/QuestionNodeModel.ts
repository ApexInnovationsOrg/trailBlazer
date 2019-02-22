import { NodeModel } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";

export class QuestionNodeModel extends NodeModel {
	name: string;
	question: Object;
	answers: Array<Object>;

	constructor(name: string = "Question", question: Object = {}, answers: Array<Object> = []) {
		super("question");

		this.name = name;
		this.question = question;
		this.answers = answers;
	}


	addInPort(label: string): QuestionPortModel {
		return this.addPort(new QuestionPortModel(label));
	}

	addOutPort(label: string): QuestionPortModel {
		return this.addPort(new QuestionPortModel(label));
	}
}
