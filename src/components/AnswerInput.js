import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

class AnswerInput extends Component {
    constructor(props)
    {
        super(props);

        console.log(props);

        this.state = {
            'showAnswer':true
        };
        
        
    }

    hide = ()=>
    {
        // console.log('now hide?');
        this.setState({'showAnswer':false});
    }

    render(){
        let rowClasses = this.props.number === 0 ? "row" : "row mt-4";
        console.log('what state we in?',this.state);
        if(!this.state || !this.state.showAnswer)
        {
            return null;
        }
        else
        {

            return <div className={rowClasses}>
                    <input name={this.props.number} className="col-md-9 form-control input-md mt-1" placeholder="1:00pm" type="text"></input>
                    <div className="col-md-2">
                        <Button className="float-right mt-1" variant="outline-danger" onClick={this.hide} style={{'borderRadius':'100%'}}>-</Button>
                    </div>
                </div>
        }
        
      }
}



export default AnswerInput;