import * as React from "react";

import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuestionNodeModel } from "./QuestionNodeModel";
import { QuestionNodeWidget } from "./QuestionNodeWidget";
import { Editor } from '@tinymce/tinymce-react';

export interface AnswerProps{
    node: QuestionNodeModel,
    parent:QuestionNodeWidget,
    answer?:object,
    editorHtml?:string
}

export interface AnswerState {
    saving:boolean,
    deleting:boolean
}


export class EditBubbles extends React.Component<AnswerProps,AnswerState> {
	public static defaultProps: AnswerProps={
        node:null,
        parent:null,
        editorHtml:''
    }

	constructor(props: AnswerProps) {
		super(props);
		this.state = { 
            saving:false,
            deleting:false
         }
	}

    getBubbles = ()=>
    {
        return this.props.node.question['Contents'].map((content)=>{
            if(content.Content.type === "bubble")
            {
                let bubble = content.Content;
                return <div className={'bubble'}>
                    <div  className={'bubbleTitle'}>
                        Title: {bubble.title}
                    </div>
                    <div  className={'bubbleBody'}>
                        Body: {bubble.text}
                    </div>
                    
                </div>
            }
        })

        
    }

	render() {
		return (<div className={'questionAndAnswerAreaOnNodeContainer'}>
            <div>
            Bubbles
            </div>
            <div>
                {this.getBubbles()}
            </div>
        </div>);
	}
}


function mapStateToProps(state)
{
    return {
        tree: state.tree,
        activeTree:state.activeTree,
        connections:state.connections.connections,
        nodes:state.connections.nodes,
        newQuestion:state.newQuestion,
        savingQuestion:state.savingQuestion
    }
}


export default connect(mapStateToProps)(EditBubbles);