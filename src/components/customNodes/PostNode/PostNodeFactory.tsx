import * as SRD from "storm-react-diagrams";
import PostNodeWidget from "./PostNodeWidget";
import { PostNodeModel } from "./PostNodeModel";
import * as React from "react";

export class PostNodeFactory extends SRD.AbstractNodeFactory {
	constructor() {
		super("node");
	}

	generateReactWidget(diagramEngine: SRD.DiagramEngine, node: PostNodeModel): JSX.Element {
		return React.createElement(PostNodeWidget,{
			node:node})
	}

	getNewInstance() {
		return new PostNodeModel();
	}
}

