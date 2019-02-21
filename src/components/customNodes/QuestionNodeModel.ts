import { NodeModel } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";

export class QuestionNodeModel extends NodeModel {
	name: string;
	question: string;
	answers: Array<Object>;

	constructor(name: string = "Question", question: string = "No question", answers: Array<Object> = []) {
		super("diamond");

		this.name = name;
		this.question = question;
		this.answers = answers;
		// this.name = name;
		this.addPort(new QuestionPortModel("in"));
		// this.addPort(new DiamondPortModel("left"));
		// this.addPort(new DiamondPortModel("bottom"));
		// this.addPort(new DiamondPortModel("right"));
	}
}
