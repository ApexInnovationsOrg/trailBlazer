import * as React from "react";

import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuestionNodeModel } from "./QuestionNodeModel";
import QuestionNodeWidget from "./QuestionNodeWidget";
import ContentEditable from 'react-contenteditable';
import { Editor } from '@tinymce/tinymce-react';
import {saveContent, deleteContent} from '../../actions/contentActions';


export interface AnswerProps{
    node: QuestionNodeModel,
    parent:any,
    answer?:object,
    editorHtml?:string
}

export interface AnswerState {
    saving:boolean,
    deleting:boolean
}

interface BubbleProps{
    data:object,
    removeBubble:any
}

interface BubbleState{
    editing:boolean,
    saving:boolean
    deleting:boolean
}


class Bubble extends React.Component<BubbleProps,BubbleState>{
    constructor(props:BubbleProps){
        super(props);
        this.state = {
            editing:false,
            saving:false,
            deleting:false
        }
    } 
    componentDidMount = ()=>
    {
        if(this.props.data['ID'] == -1)
        {
            this.setState({
                editing:true
            })
        }
    }
    updateTitle =(e)=>
    {
        this.props.data['Content'].title = e.target.value;
    }
    updateBody = (content)=>
    {
        
        this.props.data['Content'].text = content;
    }

    startEditing = ()=>
    {
        this.setState({editing:true});
    }
    cancelEdit = ()=>
    {
        if(this.props.data['ID'] == -1)
        {
            this.props.removeBubble();
        }
        this.setState({editing:false});
        
    }

    getBody = (bubble)=>
    {
        if(this.state.editing)
        {

           return <Editor
            apiKey="bcs5ei9c3att51pb7mdwdz56liaaadza5bitfd5g5ukd7i1e"
            init={{                     plugins: ['advlist autolink autosave lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste  textpattern imagetools codesample toc help'],
            toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
            branding: false,
            height: 400, }}
            initialValue={bubble.text}
            onEditorChange={this.updateBody}
            />
        }
        else
        {
           return <div style={{background:"white",border:'1px solid black',padding:'1em'}} dangerouslySetInnerHTML={{__html:bubble['text']}}></div>;
        }
    }
    getButtons = () =>
    {
        let saveText = this.state.saving ? 'Saving...' : 'Save';
        if(this.state.editing)
        {
            return <div><button onClick={this.cancelEdit}>Cancel</button><button disabled={this.state.saving} onClick={this.saveBubble}>{saveText}</button><button onClick={this.deleteBubble}>Delete</button></div>
        }
    }

    saveBubble = () =>
    {
        this.setState({
            saving:true
        })
        const save = saveContent({
            ID:this.props.data['ID'],
            content:this.props.data['Content'],
            nodeID:this.props.data['NodeID']
        });

        save.then((json)=>{
            if(this.props.data['ID'] == -1)
            {
                this.props.data['ID'] = json['data'];
            }
            this.setState({
                editing:false,
                saving:false
            })
        })

    }
    deleteBubble = ()=>
    {
        this.setState({
            deleting:true,
        });

        const removeBubblefromDB = deleteContent({
            ID:this.props.data['ID']
        })

        removeBubblefromDB.then((json) => {
            this.props.removeBubble();
            this.setState({
                editing:false,
                deleting:false
            })
        })
    }

    render(){
        let bubble = this.props.data['Content'];
        return <div onClick={()=>{!this.state.editing ? this.startEditing() : ''}} className={'bubble'}>
                    <div className={'bubbleTitle'}>
                        Title: <ContentEditable onChange={this.updateTitle} disabled={!this.state.editing} html={bubble.title} style={{cursor:this.state.editing?'pointer':'move',background:this.state.editing?'rgba(106, 193, 255, 0.17)':'white'}}></ContentEditable>
                    </div>
                    <div  className={'bubbleBody'}>
                        Body: {this.getBody(bubble)}
                    </div>
                    {this.getButtons()}
                </div>
    }
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
    
    removeBubble = (index)=>
    {
        this.props.node.node['Contents'].splice(index,1);
        this.props.node.repaintCanvas();
    }

    getBubbles = ()=>
    {
        return this.props.node.node['Contents'].map((content,index)=>{
            if(content.Content.type === "bubble")
            {
                let bubble = content.Content;

                return <Bubble key={index} removeBubble={(index)=>{this.removeBubble(index)}} data={content}/>
            }
        })   
    }

    newBubble = ()=>
    {
        this.props.node.node['Contents'].push({
            Content:{type:"bubble",title:"Untitled",text:""},
            ID:-1,
            NodeID:this.props.node.node["ID"]            
        })
        this.forceUpdate();
    }

    exitBubbles = ()=>
    {
        this.props.parent.setEditBubbles(false);
        this.props.node.setEditingAnswer(false);
        this.props.node.setLocked(false);
    }

	render() {
		return (<div className={'nodeAndAnswerAreaOnNodeContainer'}>
            <div>
            Bubbles 
            <button style={{float:'right', background:'red'}} onClick={this.exitBubbles}>
                   X
                </button>
            </div>
            <div>
                {this.getBubbles()}
            </div>
            <div>
                <button onClick={this.newBubble}>
                    New Bubble
                </button>

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
        newNode:state.newNode,
        savingNode:state.savingNode
    }
}


export default connect(mapStateToProps)(EditBubbles);