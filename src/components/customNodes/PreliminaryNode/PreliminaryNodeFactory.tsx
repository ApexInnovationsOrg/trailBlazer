import * as SRD from "storm-react-diagrams";
import PreliminaryNodeWidget from "./PreliminaryNodeWidget";
import { PreliminaryNodeModel } from "./PreliminaryNodeModel";
import * as React from "react";

export class PreliminaryNodeFactory extends SRD.AbstractNodeFactory {
	constructor() {
		super("node");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: PreliminaryNodeModel): JSX.Element {
		return React.createElement(PreliminaryNodeWidget,{
			node:node})
	}

	getNewInstance() {
		return new PreliminaryNodeModel();
	}
}

