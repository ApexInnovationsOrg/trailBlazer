import * as SRD from "storm-react-diagrams";
import { QuestionNodeWidget } from "./QuestionNodeWidget";
import { QuestionNodeModel } from "./QuestionNodeModel";
import * as React from "react";

export class QuestionNodeFactory extends SRD.AbstractNodeFactory {
	constructor() {
		super("diamond");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: QuestionNodeModel): JSX.Element {
		return <QuestionNodeWidget node={node} />;
	}

	getNewInstance() {
		return new QuestionNodeModel();
	}
}
