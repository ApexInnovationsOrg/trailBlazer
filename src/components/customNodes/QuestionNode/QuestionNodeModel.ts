import { NodeModel } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";

import store from '../../../store';
import {getSingleForest} from '../../../actions/getForest';
import {getTree} from '../../../actions/getTree';
import { savedNode } from "../../../actions/nodeActions";


export class QuestionNodeModel extends NodeModel {
	name: string;
	node: Object;
	question: Object;
	answers: Array<Object>;
	_id:string;
	_x:number;
	_y:number;
	editingAnswerIndex:number;
	waiting:boolean;
	masterNode:boolean;
	editing:boolean;
	savePositions:boolean;
	editingAnswer:boolean;
	props?:object;

	constructor(name: string = "Node", node: Object = {}, answers: Array<Object> = []) {
		super("node");

		this.name = name;
		this.node = node;
		this.answers = answers;
		this._id = node['ID'];

		

		// //console.log('node port time',node);
		
		this.answers.forEach((answer,index)=>{
			let port = this.addOutPort("answer" + index);	
			if(typeof answer['NextNodeID'] !== undefined)
			{
				port.NextNodeID = answer['NextNodeID'];
			}
		})
		// //console.log('de node', this.node);
		this.masterNode = false;
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



	setMaster(masterNode)
	{
		if(!masterNode)
		{
			this.addInPort("node");
		}

		this.masterNode = masterNode;
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
		let nodeID = this.node['ID'];
		let nodeText = this.node['NodeText'];
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Node',
				action:'updateNode',
				nodeID: nodeID,				
				nodeText: nodeText				
			})
		}).then(res=>res.json())
        .then(json=>{
			
			store.dispatch(savedNode());
        })

		this.node['Answers'].map((answer,index)=>{
			let answerID = answer.ID;
			let nodeID = this.node['ID'];
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
						nodeID: nodeID,				
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
	setMasterNode=()=>
	{

		let masterNodeID = this.node['ID'];
		let activeTreeID = this.node['TreeID'];
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Forest',
				action:'setMasterNode',
				masterNodeID: masterNodeID,	
				treeID:activeTreeID			
			})
		}).then(()=>{
			let state = store.getState();
			state.activeTree.MasterNodeID = masterNodeID;

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
		if(!this.node)
		{
			return false;
		}
		let nodeID = this.node['ID'];
		let positionX = this.x;
		let positionY = this.y;

		

		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Node',
				action:'moveNode',
				nodeID: nodeID,
				positionX:positionX,
				positionY:positionY
			})
		})
		
	}

	deleteNode()
	{
		// //console.log('deleting node');
		let nodeID = this.node['ID'];
		fetch(process.env.REACT_APP_API_LOCATION,{
			method:'POST',
			headers:{
				'content-type':'application/json'
			},
			body:JSON.stringify({
				controller:'Node',
				action:'deleteNode',
				nodeID: nodeID				
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
