import * as React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuestionNodeModel } from "./QuestionNodeModel";

import {QuestionNodeWidget} from "./QuestionNodeWidget";
import {getMediaType} from '../../utils/getMediaType';
import Dropzone from 'react-dropzone';

import store from '../../store';
import { savedNode } from "../../actions/nodeActions";
import { getTree } from "../../actions/getTree";


export interface EditMediaProps{
    node: QuestionNodeModel,
    parent:QuestionNodeWidget
}

export interface EditMediaState {
    saving:boolean,
    deleting:boolean,
    previewAvailable:boolean,
    previewUpload:any
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
            deleting:false,
            previewAvailable:false,
            previewUpload:null
         }
	}

    getMasterMedia()
    {
        return this.props.node.node['Contents'].map((content)=>{
            if(content.Content.type === "masterMedia")
            {
                let media = content.Content;
                let type = getMediaType(media.src);
                let deleteButton = <div><button onClick={this.deleteMedia}>Delete</button></div>;
                if(type.key == 'image')
                {
                    return <div><img src={media.src}  style={{width:'100%'}}/>{deleteButton}</div>;
                }

                if(type.key == 'video')
                {
                    return <div><video src={media.src} style={{width:'100%'}} controls autoPlay/>{deleteButton}</div>
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

    droppedFile = (files) =>
    {
        const reader = new FileReader()

        reader.onabort = () => //console.log('file reading was aborted')
        reader.onerror = () => //console.log('file reading has failed')
        reader.onload = () => {
          // Do whatever you want with the file contents
          //console.log(files);

          const dataURL = reader.result

          files.data = dataURL;
          this.setState({
              previewUpload:files,
              previewAvailable:true
          })
        }
        files.forEach(file => reader.readAsDataURL(file))
    }
    deleteMedia = ()=>
    {
        return this.props.node.node['Contents'].map((content,index)=>{
            if(content.Content.type === "masterMedia")
            {
                this.props.node.node['Contents'].splice(index,1);
                this.props.node.repaintCanvas();
                this.forceUpdate();
            }
        })

        
    }

    saveMedia = ()=>
    {
        this.setState({
            saving:true
        })
            var data = new FormData();
            data.append('files',this.state.previewUpload[0],this.state.previewUpload[0]['name']);
            data.append('json',JSON.stringify({controller:'Content',action:'uploadMedia',nodeID:this.props.node.node['ID']}));
            return fetch(process.env.REACT_APP_API_LOCATION,{
                method:'POST',
                body:data
            })
            .then(res=>res.json())
            .then(json=>{
                //console.log(json);
                let state = store.getState();

                store.dispatch(getTree(state['activeTree']));
            })


        
    }
    cancel = ()=>
    {
        this.setState({
            previewUpload:null,
            previewAvailable:false
        })
    }
    saveButton = () =>
    {
        if(this.state.saving)
        {
            return <button disabled>Saving...</button>;
        }
        else
        {

            return  <button onClick={this.saveMedia}>
                    Save
                </button>
        }
    }

    getUploadOrPreview = () =>
    {
        if(this.state.previewAvailable)
        {
            //console.log(this.state.previewUpload);
            let type = getMediaType(this.state.previewUpload[0].path);
            let media;
            if(type.key == 'image')
            {
                media = <div><img style={{width:'100%'}} src={this.state.previewUpload.data} /></div>;
            }

            if(type.key == 'video')
            {
                media = <div><video style={{width:'100%'}} controls>
                                <source type={this.state.previewUpload[0].type} src={this.state.previewUpload.data}/>
                            </video>
                        </div>
            }
            return      <div>
                            {media}
                            <div style={{marginTop:'1.5em'}}>

                                <button onClick={this.cancel}>
                                    Cancel
                                </button>
                                {this.saveButton()}
                            </div>
                        </div>
            
                    
        }
        else
        {
          return  <Dropzone onDrop={this.droppedFile}>
                    {({getRootProps, getInputProps}) => (
                        <section className={"newAnswer"}>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        </section>
                    )}
                    </Dropzone>
        }
    }

	render() {

		return (<div className={'nodeAndAnswerAreaOnNodeContainer'}>
            Media
            <button style={{float:'right', background:'red'}} onClick={this.exitMedia}>
                   X
            </button>
            <div className={'mediaContainer'}>
                {this.getMasterMedia()}
            </div>
            <div>
            Upload/Preview
                {this.getUploadOrPreview()}
            </div>
        </div>);
	}
}
