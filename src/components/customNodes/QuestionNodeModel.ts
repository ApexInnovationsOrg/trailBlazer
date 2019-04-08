import { NodeModel } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";

import store from '../../store';
import {getSingleForest} from '../../actions/getForest';
import {getTree} from '../../actions/getTree';
import { savedQuestion } from "../../actions/questionActions";


export class QuestionNodeModel extends NodeModel {
	name: string;
	question: Object;
	answers: Array<Object>;
	_id:string;
	_x:number;
	_y:number;
	editingAnswerIndex:number;
	waiting:boolean;
	masterQuestion:boolean;
	editing:boolean;
	savePositions:boolean;
	editingAnswer:boolean;
	props?:object;

	constructor(name: string = "Question", question: Object = {}, answers: Array<Object> = []) {
		super("question");

		this.name = name;
		this.question = question;
		this.answers = answers;
		this._id = question['ID'];

		

		// console.log('question port time',question);
		
		this.answers.forEach((answer,index)=>{
			let port = this.addOutPort("answer" + index);	
			if(typeof answer['NextQuestionID'] !== undefined)
			{
				port.NextQuestionID = answer['NextQuestionID'];
			}
		})
		// console.log('de question', this.question);
		this.masterQuestion = false;
		this.editing = false;
		this.setMaster.bind(this);
		this.savePositions = false;
		this.editingAnswer = false;
	}

	set x(newVal) {
		
		this.startTimer();
		this._x = newVal;
	}
	get x() {
		return this._x;
	}
	set y(newVal) {
		this.startTimer();
		this._y = newVal;
	}
	get y() {
		return this._y;
	}
	
	enableSavePositions()
	{
		this.savePositions = true;
	}



	setMaster(masterQuestion)
	{
		if(!masterQuestion)
		{
			this.addInPort("question");
		}

		this.masterQuestion = masterQuestion;
	}

	setEdit = (mode)=>
	{
		this.editing = mode;
		this.setLocked(mode);
		this.repaintCanvas();
	}
	toggleEdit=()=>
	{
		this.editing = !this.editing;
		this.setLocked(this.editing);
		this.repaintCanvas();
	}

	setEditingAnswer = (mode)=>
	{
		this.editingAnswer = mode;
		this.repaintCanvas();
	}
	toggleEditingAnswer = ()=>
	{
		this.editingAnswer = !this.editingAnswer;
		this.repaintCanvas();
	}

	saveChanges = ()=>
	{
		let questionID = this.question['ID'];
		let questionText = this.question['QuestionText'];
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Question',
				action:'updateQuestion',
				questionID: questionID,				
				questionText: questionText				
			})
		}).then(res=>res.json())
        .then(json=>{
			
			store.dispatch(savedQuestion());
        })

		this.question['Answers'].map((answer,index)=>{
			let answerID = answer.ID;
			let questionID = this.question['ID'];
			let answerText = answer.AnswerText;

			if(answerID == -1)
			{
				
				fetch(process.env.REACT_APP_API_LOCATION,{
					method:'POST',
					headers:{
						'content-type':'application/json'
					},
					body:JSON.stringify({
						controller:'Answer',
						action:'createnewAnswer',
						questionID: questionID,				
						answerText: answerText				
					})
				}).then(res=>res.json())
				.then(json=>{
					answer.ID = json.data;
				})
			}
			else
			{

				fetch(process.env.REACT_APP_API_LOCATION,{
					method:'POST',
					headers:{
						'content-type':'application/json'
					},
					body:JSON.stringify({
						controller:'Answer',
						action:'updateAnswer',
						answerID: answerID,				
						answerText: answerText				
					})
				})
			}
		})



		this.toggleEdit();

	}
	setMasterQuestion=()=>
	{

		let masterQuestionID = this.question['ID'];
		let activeTreeID = this.question['TreeID'];
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Forest',
				action:'setMasterQuestion',
				masterQuestionID: masterQuestionID,	
				treeID:activeTreeID			
			})
		}).then(()=>{
			let state = store.getState();
			state.activeTree.MasterQuestionID = masterQuestionID;

			store.dispatch(getTree(state['activeTree']));

		})		
	}

	repaintCanvas=()=>
	{	
		try{
			this['_engine'].repaintCanvas();
		}
		catch(e)
		{
			console.error('no engine so canvas cannot be repainted');
		}
	}
	updatePosition()
	{
		if(!this.question)
		{
			return false;
		}
		let questionID = this.question['ID'];
		let positionX = this.x;
		let positionY = this.y;

		

		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Question',
				action:'moveQuestion',
				questionID: questionID,
				positionX:positionX,
				positionY:positionY
			})
		})
		
	}

	deleteNode()
	{
		// console.log('deleting node');
		let questionID = this.question['ID'];
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Question',
				action:'deleteQuestion',
				questionID: questionID				
			})
		})
		this.remove();
		this.repaintCanvas();
	}

	startTimer()
	{
		if(this.waiting || !this.savePositions)
		{
			return;
		}

		this.waiting = true;
		setTimeout(()=>{
			this.waiting = false;
			this.updatePosition();
		},1000)
	}

	
	removeLink = (answerName)=>
	{
		for(let i in this.ports)
		{
			if(i === answerName)
			{
				let answerPort = this.ports[i];
				let answerIndex = parseInt(answerName.slice(-1));
				let answer = this.answers[answerIndex];
				for(let q in answerPort.links)
				{
					fetch(process.env.REACT_APP_API_LOCATION,{
						method:'POST',
						headers:{
							'content-type':'application/json'
						},
						body:JSON.stringify({
							controller:'Answer',
							action:'removeLink',
							answerID: answer['ID'],
						})
					})
					answerPort.links[q].remove();
					this.repaintCanvas();
				}
			}
		}
	}

	addInPort(label: string): QuestionPortModel {
		return this.addPort(new QuestionPortModel(true,label));
	}

	addOutPort(label: string): QuestionPortModel {
		return this.addPort(new QuestionPortModel(false,label));
	}
}
