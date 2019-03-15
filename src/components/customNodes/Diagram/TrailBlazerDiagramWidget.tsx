import * as _ from "lodash";
import { DiagramWidget, SelectingAction, MoveItemsAction, NodeModel, PointModel, MoveCanvasAction, LinkLayerWidget, NodeLayerWidget, PortModel } from "storm-react-diagrams";
import React from 'react';

export class TrailBlazerDiagramWidget extends DiagramWidget{
    
	onMouseMove(event) {
        
		var diagramEngine = this.props.diagramEngine;
		var diagramModel = diagramEngine.getDiagramModel();
		//select items so draw a bounding box
		if (this.state.action instanceof SelectingAction) {
            console.log('selecting action');
            
            var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
            
			_.forEach(diagramModel.getNodes(), node => {
                console.log(node);
				if ((this.state.action as SelectingAction).containsElement(node.x, node.y, diagramModel)) {
                    
                    node.setSelected(true);
				}
			});
            
			_.forEach(diagramModel.getLinks(), link => {
                console.log('link');
				var allSelected = true;
				_.forEach(link.points, point => {
                    if ((this.state.action as SelectingAction).containsElement(point.x, point.y, diagramModel)) {
                        point.setSelected(true);
					} else {
                        allSelected = false;
					}
				});
                
				if (allSelected) {
                    link.setSelected(true);
				}
			});
            
			this.state.action.mouseX2 = relative.x;
			this.state.action.mouseY2 = relative.y;
            
			this.fireAction();
			this.setState({ action: this.state.action });
			return;
		} else if (this.state.action instanceof MoveItemsAction) {
            console.log('NOT selecting action');
            // alert('ding dong');
            let amountX = event.clientX - this.state.action.mouseX;
			let amountY = event.clientY - this.state.action.mouseY;
			let amountZoom = diagramModel.getZoomLevel() / 100;
            
			_.forEach(this.state.action.selectionModels, model => {
                // in this case we need to also work out the relative grid position
                
                if(model.model.editing)
                {
                    return
                }
				if (
					model.model instanceof NodeModel ||
					(model.model instanceof PointModel && !model.model.isConnectedToPort())
				) {
					model.model.x = diagramModel.getGridPosition(model.initialX + amountX / amountZoom);
					model.model.y = diagramModel.getGridPosition(model.initialY + amountY / amountZoom);

					// update port coordinates as well
					if (model.model instanceof NodeModel) {
                        _.forEach(model.model.getPorts(), port => {
                            
							const portCoords = this.props.diagramEngine.getPortCoords(port);
							port.updateCoords(portCoords);
						});
					}

					if (diagramEngine.isSmartRoutingEnabled()) {
						diagramEngine.calculateRoutingMatrix();
					}
				} else if (model.model instanceof PointModel) {
					// we want points that are connected to ports, to not necessarily snap to grid
                    // this stuff needs to be pixel perfect, dont touch it
                    console.log('else if');
					model.model.x = model.initialX + diagramModel.getGridPosition(amountX / amountZoom);
					model.model.y = model.initialY + diagramModel.getGridPosition(amountY / amountZoom);
				}
			});

			if (diagramEngine.isSmartRoutingEnabled()) {
				diagramEngine.calculateCanvasMatrix();
			}

			this.fireAction();
			if (!this.state.wasMoved) {
				this.setState({ wasMoved: true });
			} else {
				this.forceUpdate();
			}
		} else if (this.state.action instanceof MoveCanvasAction) {
			//translate the actual canvas
			if (this.props.allowCanvasTranslation) {
				diagramModel.setOffset(
					this.state.action.initialOffsetX + (event.clientX - this.state.action.mouseX),
					this.state.action.initialOffsetY + (event.clientY - this.state.action.mouseY)
				);
				this.fireAction();
				this.forceUpdate();
			}
		}
	}

	render() {
		var diagramEngine = this.props.diagramEngine;
		diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
		diagramEngine.setSmartRoutingStatus(this.props.smartRouting);
		var diagramModel = diagramEngine.getDiagramModel();

		return (
			<div
				{...this.getProps()}
				ref={ref => {
					if (ref) {
						this.props.diagramEngine.setCanvas(ref);
					}
				}}
				onWheel={event => {
					if (this.props.allowCanvasZoom) {
						event.preventDefault();
						event.stopPropagation();
						const oldZoomFactor = diagramModel.getZoomLevel() / 100;
						let scrollDelta = this.props.inverseZoom ? -event.deltaY : event.deltaY;
						//check if it is pinch gesture
						if (event.ctrlKey && scrollDelta % 1 !== 0) {
							/*Chrome and Firefox sends wheel event with deltaY that
                have fractional part, also `ctrlKey` prop of the event is true
                though ctrl isn't pressed
              */
							scrollDelta /= 3;
						} else {
							scrollDelta /= 60;
						}
						if (diagramModel.getZoomLevel() + scrollDelta > 10) {
							diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
						}

						const zoomFactor = diagramModel.getZoomLevel() / 100;

						const boundingRect = event.currentTarget.getBoundingClientRect();
						const clientWidth = boundingRect.width;
						const clientHeight = boundingRect.height;
						// compute difference between rect before and after scroll
						const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
						const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
						// compute mouse coords relative to canvas
						const clientX = event.clientX - boundingRect.left;
						const clientY = event.clientY - boundingRect.top;

						// compute width and height increment factor
						const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
						const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

						diagramModel.setOffset(
							diagramModel.getOffsetX() - widthDiff * xFactor,
							diagramModel.getOffsetY() - heightDiff * yFactor
						);

						diagramEngine.enableRepaintEntities([]);
						this.forceUpdate();
					}
				}}
				onMouseDown={event => {
                    
					if (event.nativeEvent.which === 3) return;
					this.setState({ ...this.state, wasMoved: false });

					diagramEngine.clearRepaintEntities();
					var model = this.getMouseElement(event);
					//the canvas was selected
					if (model === null) {
						//is it a multiple selection
						if (event.shiftKey) {
							var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
							this.startFiringAction(new SelectingAction(relative.x, relative.y));
						} else {
							//its a drag the canvas event
							diagramModel.clearSelection();
							this.startFiringAction(new MoveCanvasAction(event.clientX, event.clientY, diagramModel));
						}
					} else if (model.model instanceof PortModel) {
						//its a port element, we want to drag a link
						if (!this.props.diagramEngine.isModelLocked(model.model)) {
							var relative = diagramEngine.getRelativeMousePoint(event);
							var sourcePort = model.model;
							var link = sourcePort.createLinkModel();
							link.setSourcePort(sourcePort);

							if (link) {
								link.removeMiddlePoints();
								if (link.getSourcePort() !== sourcePort) {
									link.setSourcePort(sourcePort);
								}
								link.setTargetPort(null);

								link.getFirstPoint().updateLocation(relative);
								link.getLastPoint().updateLocation(relative);

								diagramModel.clearSelection();
								link.getLastPoint().setSelected(true);
								diagramModel.addLink(link);

								this.startFiringAction(
									new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
								);
							}
						} else {
							diagramModel.clearSelection();
						}
					} else {
						//its some or other element, probably want to move it
						if (!event.shiftKey && !model.model.isSelected()) {
							diagramModel.clearSelection();
						}
						model.model.setSelected(true);

						this.startFiringAction(new MoveItemsAction(event.clientX, event.clientY, diagramEngine));
					}
					this.state.document.addEventListener("mousemove", this.onMouseMove);
                    this.state.document.addEventListener("mouseup", this.onMouseUp);
                    
                    this.state.document.addEventListener("touchmove",this.onMouseMove);
                    this.state.document.addEventListener("touchstart",this.onMouseMove);
				}}
			>
				{this.state.renderedNodes && (
					<LinkLayerWidget
						diagramEngine={diagramEngine}
						pointAdded={(point: PointModel, event) => {
							this.state.document.addEventListener("mousemove", this.onMouseMove);
							this.state.document.addEventListener("mouseup", this.onMouseUp);
							event.stopPropagation();
							diagramModel.clearSelection(point);
							this.setState({
								action: new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
							});
						}}
					/>
				)}
				<NodeLayerWidget diagramEngine={diagramEngine} />
				{this.state.action instanceof SelectingAction && this.drawSelectionBox()}
			</div>
		);
	}

}