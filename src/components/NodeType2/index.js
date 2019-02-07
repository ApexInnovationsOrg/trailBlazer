import * as React from "react";

import { endPointStyles, nodeStyles, nodeWrapperStyles } from "../NodeType1";

import {DefaultNode} from "react-dag";
import { css } from "glamor";
import { getSettings } from "../../settings/dag-settings";
import { theme } from "../../styles";

const modNodeStyle = css({
  border: `2px solid ${theme.main.colors.teal}`,
});

const modEndpointStyles = css({
  zIndex: 20001,
});
export default class NodeType2 extends DefaultNode {

  constructor()
  {
    super()
    console.log('props in the constructor',this.props);
  }
  rightEndpointRef;
  componentDidMount() {
    const { transformSource, transformSink } = getSettings();
    const initConfig = {
      endPointParams: [
        {
          element: this.rightEndpointRef,
          params: {
            ...transformSource,
            isSource: true,
            uuid: `${this.props.id}-DottedEndpoint-right`,
          },
          referenceParams: {},
        },
      ], 
      makeTargetParams: {
        allowLoopback: false,
        anchor: "ContinuousLeft",
        dropOptions: { hoverClass: "drag-hover" },
        isTarget: true,
        uuid: `${this.props.id}-DottedEndPoint`,
      },
      nodeId: this.props.id,
    };
    if (this.props.initNode) {
      this.props.initNode(initConfig);
    }
  }
  render() {
    console.log('node type 2');
    const config = this.props.config;
    console.log('what is the config',this.props);
    let style = {};
    if (config) {
      style = config.style;
    }
    return (
      <div
        id={this.props.id}
        className={`${nodeStyles} ${modNodeStyle}`}
        style={style}
      >
        <div className={`${nodeWrapperStyles}`}>
          {config && config.label ? config.label : this.props.id}
        </div>
        <div
          id={`${this.props.id}-right`}
          ref={ref => (this.rightEndpointRef = ref)}
          className={`${endPointStyles} ${modEndpointStyles} right`}
        />
      </div>
    );
  }
}
