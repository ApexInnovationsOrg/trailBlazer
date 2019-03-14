import * as React from "react";
import { DiagramEngine, AbstractLinkFactory, DefaultLinkWidget } from "storm-react-diagrams";
import { AnswerLinkWidget } from "./AnswerLinkWidget";
import { AnswerLinkModel } from "./AnswerLinkModel";
/**
 * @author Dylan Vorster
 */
export class AnswerLinkFactory extends AbstractLinkFactory<AnswerLinkModel> {
	constructor() {
		super("default");
		console.log('link factory hit');
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: AnswerLinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): AnswerLinkModel {
		return new AnswerLinkModel();
	}

	generateLinkSegment(model: AnswerLinkModel, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
}
