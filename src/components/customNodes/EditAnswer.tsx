import * as React from "react";

import ContentEditable from 'react-contenteditable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QuestionNodeModel } from "./QuestionNodeModel";
import { QuestionNodeWidget } from "./QuestionNodeWidget";
import { Editor } from '@tinymce/tinymce-react';

export interface AnswerProps{
    node: QuestionNodeModel,
    parent:QuestionNodeWidget,
    answer?:object,
    followUp?:string,
    editorHtml?:string
}

export interface AnswerState {
    saving:boolean,
    deleting:boolean
}


export class EditAnswer extends React.Component<AnswerProps,AnswerState> {
	public static defaultProps: AnswerProps={
        followUp:'No followup written',
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
        this.handleChange = this.handleChange.bind(this)
	}

    handleInputChange = (e) =>
    {
        this.props.node.answers[this.props.node.editingAnswerIndex]['Weight'] = e.target.value;
    }
    handleChange = (content) => {
        // this.props.answer['FollowupText'] = html
        // this.setState();
        this.props.node.answers[this.props.node.editingAnswerIndex]['FollowupText'] = content;
    }
    updateAnswer = (e) => {
        this.props.node.answers[this.props.node.editingAnswerIndex]['AnswerText'] = e.target.value;
    }

    saveAnswer = ()=>{
        let answerID = this.props.node.answers[this.props.node.editingAnswerIndex]['ID'];
        let answerText = this.props.node.answers[this.props.node.editingAnswerIndex]['AnswerText'];
        let answerWeight = this.props.node.answers[this.props.node.editingAnswerIndex]['Weight'];
        let followupText = this.props.node.answers[this.props.node.editingAnswerIndex]['FollowupText'];
        let followupTextID = this.props.node.answers[this.props.node.editingAnswerIndex]['FollowupTextID'];
        let questionID = this.props.node.question['ID'];
        this.setState({
            saving:true
        })
        // console.log('should be fetching');
        // console.log(this.props.answer['FollowupText']);
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Answer',
				action:'updateanswer',
				answerID: answerID,				
                answerText: answerText,
                answerWeight: answerWeight,
                followupText:followupText,			
                followupTextID:followupTextID,	
                questionID:questionID		
			})
		}).then(res=>res.json())
        .then(json=>{
            this.props.parent.editAnswerComplete();
        })
    }

    deleteAnswer = ()=>{
        let answerID = this.props.node.answers[this.props.node.editingAnswerIndex]['ID'];
        this.setState({
            deleting:true
        })
        fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Answer',
				action:'deleteanswer',
				answerID: answerID		
			})
		}).then(res=>res.json())
        .then(json=>{
            this.props.node.answers.splice(this.props.node.editingAnswerIndex,1);
            this.props.parent.editAnswerComplete();
        })
    }

    cancel = ()=>{
        this.props.parent.editAnswerComplete();
    }

    saveButton = ()=>
    {
        if(this.state.saving)
        {
            return <button disabled>Saving...</button>
        }
        else
        {
            return <button onClick={this.saveAnswer}>Save</button>
        }
    }

    deleteButton = ()=>
    {
        if(this.state.deleting)
        {
           return <button disabled>Deleting...</button>
        }
        else
        {
           return <button onClick={this.deleteAnswer}>Delete</button>
        }
    }

	render() {

		return (<div className={'questionAndAnswerAreaOnNodeContainer'}>
            <div>
                <p>Answer Text:</p>
                <div className={'questionAreaNode'}>
                    <ContentEditable className="answerText" onChange={this.updateAnswer} html={this.props.node.answers[this.props.node.editingAnswerIndex]['AnswerText']}  style={{cursor:'pointer',background:'white'}}></ContentEditable>
                </div>
            </div>
            <div>
                <p>Follow Up Response:</p>

                <div >
                
                <Editor
                    apiKey="bcs5ei9c3att51pb7mdwdz56liaaadza5bitfd5g5ukd7i1e"
                    init={{                     plugins: ['advlist autolink autosave lists link image charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons template paste  textpattern imagetools codesample toc help'],
                    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                    toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
                    branding: false,
                    height: 400, }}
                    initialValue={this.props.node.answers[this.props.node.editingAnswerIndex]['FollowupText']}
                    onEditorChange={this.handleChange}
                    />
                </div>
            </div>
            <div>
                <p>Answer Weight:</p>
                <input
                    name="answerWeight"
                    type="number"
                    value={this.props.node.answers[this.props.node.editingAnswerIndex]['Weight']}
                    onChange={this.handleInputChange} />
            </div>
            <button onClick={this.cancel}>
                Cancel
            </button>
            {this.saveButton()}
            {this.deleteButton()}
            
            
        </div>);
	}
}