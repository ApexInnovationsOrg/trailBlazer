import { NodeModel } from "storm-react-diagrams";
import { QuestionPortModel } from "./QuestionPortModel";

export class QuestionNodeModel extends NodeModel {
	name: string;
	question: Object;
	answers: Array<Object>;
	_id:string;
	_x:number;
	_y:number;
	waiting:boolean;
	masterQuestion:boolean;

	constructor(name: string = "Question", question: Object = {}, answers: Array<Object> = []) {
		super("question");

		this.name = name;
		this.question = question;
		this.answers = answers;
		this._id = question['ID'];

		let questionPort = this.addInPort("question");

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
		this.setMaster.bind(this);
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

	setMaster()
	{
		this.masterQuestion = true;
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

		

		fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
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

	startTimer()
	{
		if(this.waiting)
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
					fetch("https://devbox2.apexinnovations.com/JourneyAPI/",{
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
