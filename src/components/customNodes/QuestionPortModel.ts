import * as _ from "lodash";
import { LinkModel, DiagramEngine, PortModel, DefaultLinkModel } from "storm-react-diagrams";

export class QuestionPortModel extends PortModel {
	name: string;

	constructor(name: string = "1") {
		super(name, "question");
		this.name = name;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.name = data.name;
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
