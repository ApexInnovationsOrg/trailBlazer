import * as SRD from "storm-react-diagrams";
import QuestionNodeWidget from "./QuestionNodeWidget";
import { QuestionNodeModel } from "./QuestionNodeModel";
import * as React from "react";

export class QuestionNodeFactory extends SRD.AbstractNodeFactory {
	constructor() {
		super("question");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: QuestionNodeModel): JSX.Element {
		return React.createElement(QuestionNodeWidget,{
			node:node})
	}

	getNewInstance() {
		return new QuestionNodeModel();
	}
}

