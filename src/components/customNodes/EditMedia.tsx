import * as React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuestionNodeModel } from "./QuestionNodeModel";
import { QuestionNodeWidget } from "./QuestionNodeWidget";
import {getMediaType} from '../../utils/getMediaType';
import Dropzone from 'react-dropzone';


export interface EditMediaProps{
    node: QuestionNodeModel,
    parent:QuestionNodeWidget
}

export interface EditMediaState {
    saving:boolean,
    deleting:boolean
}


export class EditMedia extends React.Component<EditMediaProps,EditMediaState> {
	public static defaultProps: EditMediaProps={
        node:null,
        parent:null,
    }

	constructor(props: EditMediaProps) {
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
                console.log('avvrfasdf ')
                if(type.key == 'video')  
                {
                    return <div><video src={media.src}/></div>
                }
                
            }
        }) 
    }

    exitMedia = () =>
    {
        this.props.parent.setEditMedia(false);
        this.props.node.setEditingAnswer(false);
        this.props.node.setLocked(false);
    }

	render() {

		return (<div className={'questionAndAnswerAreaOnNodeContainer'}>
            Media
            <button style={{float:'right', background:'red'}} onClick={this.exitMedia}>
                   X
            </button>
            <div className={'mediaContainer'}>
            {this.getMasterMedia()}
            </div>
            
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <section>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                </section>
            )}
            </Dropzone>
        </div>);
	}
}
