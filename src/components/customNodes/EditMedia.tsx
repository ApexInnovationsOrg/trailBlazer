import * as React from "react";

import ContentEditable from 'react-contenteditable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuestionNodeModel } from "./QuestionNodeModel";
import { QuestionNodeWidget } from "./QuestionNodeWidget";
import { Editor } from '@tinymce/tinymce-react';
import {getMediaType} from '../../utils/getMediaType';

export interface AnswerProps{
    node: QuestionNodeModel,
    parent:QuestionNodeWidget
}

export interface AnswerState {
    saving:boolean,
    deleting:boolean
}


export class EditMedia extends React.Component<AnswerProps,AnswerState> {
	public static defaultProps: AnswerProps={
        node:null,
        parent:null,
    }

	constructor(props: AnswerProps) {
		super(props);
		this.state = { 
            saving:false,
            deleting:false
         }
	}

    getMasterMedia()
    {
        return this.props.node.question['Contents'].map((content)=>{
            if(content.Content.type === "masterMedia")
            {
                let media = content.Content;
                let type = getMediaType(media.src);
                if(type.key == 'image')
                {
                    return <div><img src={media.src}/></div>;
                }

                if(type.key == 'video')
                {
                    return <div><video src={media.src}/></div>
                }
                
            }
        }) 
    }


	render() {

		return (<div className={'questionAndAnswerAreaOnNodeContainer'}>
            Media
            <div className={'mediaContainer'}>
            {this.getMasterMedia()}
            </div>
            
            
        </div>);
	}
}
