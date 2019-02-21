import * as _ from "lodash";
import { LinkModel, DiagramEngine, PortModel, DefaultLinkModel } from "storm-react-diagrams";

export class QuestionPortModel extends PortModel {
	position: string | "1" | "2" | "3" | "4" | "in";

	constructor(pos: string = "1") {
		super(pos, "diamond");
		this.position = pos;
	}

	serialize() {
		return _.merge(super.serialize(), {
			position: this.position
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.position = data.position;
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
